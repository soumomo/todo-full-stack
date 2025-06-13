const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
mongoose.connect(process.env.MONGODB_URI);
const { UserModel, TodoModel } = require("./db");


const app = express();
app.use(express.json());

// Configure CORS
/*
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-frontend-url.vercel.app', // Replace with your actual frontend URL or use env var
  credentials: true
}));
*/

const allowedOrigins = [
  'https://todo-full-stack-st9x.vercel.app', // Your frontend Vercel URL
  'https://todo-full-stack-tau.vercel.app',  // Your backend Vercel URL (if it ever serves content directly or for other APIs)
  'http://localhost:5500', // Common local dev port for live server
  'http://127.0.0.1:5500' // Another common local dev port
  // Add any other local development ports you use for the frontend, e.g., if you use a different port for `live-server`
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, curl)
    if (!origin) return callback(null, true);
    
    // Vercel preview URLs can have dynamic subdomains, so we need a more flexible check for them
    // This regex checks for your-vercel-project-name-*.vercel.app or your-vercel-project-name.vercel.app
    const vercelPreviewPattern = /^https:\/\/todo-full-stack-st9x(-[a-zA-Z0-9]+)?\.vercel\.app$/;

    if (allowedOrigins.includes(origin) || vercelPreviewPattern.test(origin)) {
      callback(null, true);
    } else {
      console.error('CORS error: Origin not allowed:', origin); // Log the blocked origin
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

// const SECRET = \'gruzlovesamrit\';
const SECRET = process.env.JWT_SECRET;

app.post('/api/signup', (req, res) => { // Removed async from here as bcrypt callbacks are used
    const { name, email, password: plainTextPassword } = req.body;

    UserModel.findOne({ email }).then(existingUser => {
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists."
            });
        }

        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                console.error("Error generating salt:", err);
                return res.status(500).json({ message: "Error creating user during salt generation" });
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hashedPassword) {
                if (err) {
                    console.error("Error hashing password:", err);
                    return res.status(500).json({ message: "Error creating user during password hashing" });
                }
                UserModel.create({ name, email, password: hashedPassword })
                    .then(user => {
                        res.json({
                            message: "Signed Up!"
                        });
                    })
                    .catch(dbError => {
                        console.error("Error saving user to DB:", dbError);
                        return res.status(500).json({ message: "Error creating user during DB operation" });
                    });
            });
        });
    }).catch(findError => {
        console.error("Error finding user:", findError);
        return res.status(500).json({ message: "Error checking for existing user" });
    });
});

app.post('/api/login' , async(req,res)=>{
    const {email , password} = req.body;
    // Find user by email first
    const user = await UserModel.findOne({email});

    if(!user){
        return res.status(401).json({
            message:"Invalid Credentials - User not found"
        })
    };

    // Compare the provided password with the stored hashed password
    bcrypt.compare(password, user.password, function(err, isMatch) {
        if (err) {
            console.error("Error comparing passwords:", err);
            return res.status(500).json({ message: "Error during login" });
        }
        if (isMatch) {
            // Passwords match, generate JWT
            const token = jwt.sign({userId : user._id , email: user.email} , SECRET , {expiresIn: '1h'});
            res.json({ token });
        } else {
            // Passwords don't match
            return res.status(401).json({
                message:"Invalid Credentials - Password incorrect"
            })
        }
    });
})

function authenticateToken(req , res , next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({
            message: "Token Required"
        })
    }

    jwt.verify(token , SECRET , (err , user)=>{
        if(err){
            return res.status(403).json({
                message: "Invalid Token"
            });

        }
        req.user = user;
        next()

    })
}


app.get('/api/me', authenticateToken, async(req, res) => {
    const user = await UserModel.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
        user: user.name , 
        email: user.email
    });
});


app.post('/api/todo' , authenticateToken , async(req,res)=>{
    const {title} = req.body;
    if(!title){
        return res.status(400).json({
            message: "Title is required"
        })
    }
    
    const todo = await TodoModel.create({
        userId : req.user.userId,
        title,
        done: false
    })
    res.json({
        message: "Todo created",
        todo
    })
})

app.get('/api/todos' , authenticateToken , async(req,res)=>{
    const todos = await TodoModel.find({
        userId :req.user.userId
    })

    res.json({todos})
})

app.delete('/api/todo/:id' , authenticateToken , async(req,res)=>{
    try{
        const todoId = req.params.id;

        const deleteTodo = await TodoModel.findOneAndDelete({
            _id: todoId,
            userId: req.user.userId
        });

        if (!deleteTodo){
            return res.status(404).json({
                message: "Todo not found or not authorized"
            })
        }

        res.json({
            message: "Todo deleted successfully",
            deleteTodo
        });
    } catch(e){
        res.status(500).json({
            message:"Error deleting todo",
            e: e.message
        })
    }


})

app.put('/api/todo/:id' , authenticateToken , async(req , res)=>{
    try{
        const todoId = req.params.id;
        const {title,done} = req.body;

        const updateFields ={};

        if(title){
            updateFields.title = title;
        }

        if(done !== undefined){
            updateFields.done = done;
        }
        
        const updatedTodo = await TodoModel.findOneAndUpdate(
            { _id: todoId, userId: req.user.userId },
            updateFields,
            { new: true }
        );

        if(!updatedTodo){
            return res.status(404).json({
                message: "Todo not found or not authorized"
            });
        }

        res.json({
            message: "Todo updated successfully",
            updatedTodo
        });

    } catch(e) {
        res.status(500).json({
            message: "Error updating todo",
            e: e.message
        });
    }
})

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
mongoose.connect("mongodb+srv://momo:5JCBEcGO7li1driF@cluster0.chwt5ha.mongodb.net/TaskMaster");
const { UserModel, TodoModel } = require("./db");


const app = express();
app.use(express.json());
app.use(cors());

const SECRET = 'gruzlovesamrit';

app.post('/signup', (req, res) => { // Removed async from here as bcrypt callbacks are used
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

app.post('/login' , async(req,res)=>{
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


app.get('/me', authenticateToken, async(req, res) => {
    const user = await UserModel.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
        user: user.name , 
        email: user.email
    });
});


app.post('/todo' , authenticateToken , async(req,res)=>{
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

app.get('/todos' , authenticateToken , async(req,res)=>{
    const todos = await TodoModel.find({
        userId :req.user.userId
    })

    res.json({todos})
})

app.delete('/todo/:id' , authenticateToken , async(req,res)=>{
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

app.put('/todo/:id' , authenticateToken , async(req , res)=>{
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

app.listen(3000 , ()=> console.log("Server  is running on port 3000."))
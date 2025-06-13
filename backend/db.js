const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({ // creates an instance of the Mongoose Schema class, so User is an instance of the Schema class 
    name : String,
    email : String,
    password: String
}); 

const Todo = new Schema({
    userId: ObjectId,
    title: String,
    done: Boolean
});

const UserModel = mongoose.model('users' , User);
const TodoModel = mongoose.model('todos' , Todo);


module.exports = {
    UserModel,
    TodoModel
}
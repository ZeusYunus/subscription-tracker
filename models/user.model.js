import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User Name is required'],
        trim: true,
        minLength: [2, 'User Name must be at least 2 characters long'],
        maxLength: [50, 'User Name must be at most 50 characters long']
    },
    email: {
        type: String,
        required: [true, 'User Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'User Password is required'],
        minLength: [6, 'User Password must be at least 6 characters long']
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;

// { name: 'John Doe', email: 'johnny@email.com', password: 'password123' }
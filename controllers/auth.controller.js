import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

// What is a req body ? -> req.body is an object containing data from a client (POST)

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Logic to create a new user
        const { name, email, password } = req.body;

        // Check if a user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error('User already exists with this email');
            error.status = 409;
            throw error;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUsers = await User.create([
            {
                name,
                email,
                password: hashedPassword
            }
        ], { session });

        const token = jwt.sign(
            { userId: newUsers[0]._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        await session.commitTransaction();
        session.endSession();

        const createdUser = newUsers[0].toObject();
        delete createdUser.password;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: createdUser,
                token
            }
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res) => {
    res.status(201).json({ message: 'User signed in successfully' });
}

export const signOut = async (req, res) => {
    res.status(201).json({ message: 'User signed out successfully' });
}
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const signUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            const error = new Error("All fields are required");
            error.status = 400;
            throw error;
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("User already exists with this email");
            error.status = 409;
            throw error;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Generate JWT
        const token = jwt.sign(
            { userId: newUser._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Remove password from response
        const user = newUser.toObject();
        // delete user.password;

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user,
                token,
                password
            },
        });

    } catch (error) {
        next(error);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("Invalid email or password");
            error.status = 401;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error("Invalid email or password");
            error.status = 401;
            throw error;
        }

        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        const userObj = user.toObject();
        // delete userObj.password;

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                token,
                user: userObj, 
            },
        });
    } catch (error) {
        next(error);
    }
};

import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { fullname, username, password, confirmPassword, gender } = req.body;
        if (!fullname || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password and Confirm Password must be same" });
        }
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = await User.create({
            fullname,
            username,
            password: hashedPassword,
            gender,
            profilephoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto
        });
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                gender: newUser.gender,
                profilephoto: newUser.profilephoto
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                fullname: user.fullname,
                username: user.username,
                gender: user.gender,
                profilephoto: user.profilephoto
            },
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

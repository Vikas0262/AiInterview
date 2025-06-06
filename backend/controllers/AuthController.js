import User from '../models/Users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    try{
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
        console.log("User registered successfully....");
    } catch (err) {
        console.log("Check What server error occured while signup : ",err);
        res.status(500).json({ message: 'Server error' });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user = await User.findOne({ email });
        console.log("user = ", user)
        if (!user) {
            console.log("user not found")
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("isMatch = ", isMatch)
        if (!isMatch) {
            console.log("password not match")
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '7d' }
        );
        res.json({ token });
        console.log("Login success")
    } catch (err) {
        console.log("login error = ", err)
        res.status(500).json({ message: 'Server error' });
    }
}
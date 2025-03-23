const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class UserController {
    static async register(req, res) {
        try {
            const { username, email, password } = req.body;
            
            // Check if user already exists
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            // Create new user
            const userId = await UserModel.create(username, email, password);
            const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });

            res.status(201).json({
                message: 'User registered successfully',
                token,
                userId
            });
        } catch (error) {
            res.status(500).json({ message: 'Error registering user', error: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            
            // Find user
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate token
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

            res.json({
                message: 'Login successful',
                token,
                userId: user.id
            });
        } catch (error) {
            res.status(500).json({ message: 'Error during login', error: error.message });
        }
    }

    static async getProfile(req, res) {
        try {
            const user = await UserModel.findById(req.user.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching profile', error: error.message });
        }
    }
}

module.exports = UserController;

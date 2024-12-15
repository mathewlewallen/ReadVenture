"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.getUserById = exports.deleteUser = exports.updateUser = exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jsonwebtoken_1.default.sign({ userId }, secret, { expiresIn: '24h' });
};
const register = async (req, res) => {
    try {
        const { username, password, parentEmail } = req.body;
        if (!validateEmail(parentEmail)) {
            res.status(400).json({ message: 'Invalid email format' });
            return;
        }
        const existingUser = await User_1.default.findOne({ username });
        if (existingUser) {
            res.status(400).json({ message: 'Username already exists' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const newUser = await User_1.default.create({
            username,
            password: hashedPassword,
            parentEmail,
            parentConsent: false,
            createdAt: new Date(),
        });
        const token = generateToken(newUser.id);
        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                parentEmail: newUser.parentEmail,
                parentConsent: newUser.parentalConsent,
                createdAt: newUser.createdAt,
            },
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User_1.default.findOne({ username });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = generateToken(user.id);
        res.status(200).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                parentEmail: user.parentEmail,
                parentConsent: user.parentalConsent,
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user?.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({
            id: user.id,
            username: user.username,
            parentEmail: user.parentEmail,
            parentConsent: user.parentalConsent,
            createdAt: user.createdAt,
        });
    }
    catch (error) {
        console.error('Get user error:', error);
    }
};
exports.getMe = getMe;
const updateUser = async (req, res) => {
    try {
        const user = await User_1.default.findByIdAndUpdate(req.user?.id, { $set: req.body }, { new: true });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({
            id: user.id,
            username: user.username,
            parentEmail: user.parentEmail,
            parentConsent: user.parentalConsent,
            createdAt: user.createdAt,
        });
    }
    catch (error) {
        console.error('Update user error:', error);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const user = await User_1.default.findByIdAndDelete(req.user?.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteUser = deleteUser;
const getUserById = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({
            id: user.id,
            username: user.username,
            parentEmail: user.parentEmail,
            parentConsent: user.parentalConsent,
            createdAt: user.createdAt,
        });
    }
    catch (error) {
        console.error('Get user by id error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getUserById = getUserById;
const getAllUsers = async (_req, res) => {
    try {
        const users = await User_1.default.find();
        res.status(200).json(users.map((user) => ({
            id: user.id,
            username: user.username,
            parentEmail: user.parentEmail,
            parentConsent: user.parentalConsent,
            createdAt: user.createdAt,
        })));
    }
    catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllUsers = getAllUsers;
//# sourceMappingURL=users.js.map
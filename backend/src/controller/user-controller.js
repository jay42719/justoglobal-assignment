'use strict';

const jwt = require('jsonwebtoken');
const md5 = require('md5');
const SECRET_KEY = process.env.SECRET_KEY || 'jay_secret_key';
const PORT = process.env.PORT || 3000;
const LOGIN_ATTEMPT_COUNT = 5;
const UserModel = require('../models/user-model');

const generateToken = (userName) => {
    return jwt.sign({
        userName: userName
    }, SECRET_KEY, {
        expiresIn: '1h'
    });
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded.userName;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
};

exports.login = async (req, res) => {
    try {
        const {
            userName,
            password
        } = req.body;
        if (password && password.length < 5) return res.status(403).json({
            message: 'Password must be 5 characters'
        });

        const query = {
            userName
        };
        let user = await UserModel.findOne(query);

        if (!user) {
            req.body.password = md5(req.body.password);
            const userModel = new UserModel(req.body);
            user = await userModel.save();
        };
        if (user.password != md5(password)) {
            const loginAttempts = user.loginAttempts + 1;
            const updateData = {
                $set: {
                    loginAttempts
                }
            };
            await UserModel.updateOne(query, updateData);

            if (loginAttempts >= LOGIN_ATTEMPT_COUNT) return res.status(403).json({
                message: 'Account locked due to too many login attempts.'
            });

            return res.status(401).json({
                message: 'Invalid password.'
            })
        };
        if (user.isLocked) return res.status(403).json({
            message: 'Account is locked.'
        });

        const token = generateToken(user.userName);
        const updateData = {
            $set: {
                loginAttempts: 0
            }
        };
        await UserModel.updateOne(query, updateData);
        res.json({
            token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong.'
        });
    }
};

exports.requestLink = async (req, res) => {
    try {
        const {
            userName
        } = req.body;
        const query = {
            userName
        };
        const user = await UserModel.findOne(query);
        if (!user) return res.status(404).json({
            message: 'User not found.'
        });
        if (user.isLocked) return res.status(403).json({
            message: 'Account is locked.'
        });

        const token = generateToken(user.userName);
        const link = `http://localhost:${PORT}/api/user/auth-link?token=${token}`;
        res.json({
            link
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong.'
        });
    }
};

exports.authLink = async (req, res) => {
    try {
        const {
            token
        } = req.query;
        const userName = verifyToken(token);
        const query = {
            userName
        };
        const user = await UserModel.findOne(query);
        if (!user) return res.status(404).json({
            message: 'User not found.'
        });
        if (user.isLocked) return res.status(403).json({
            message: 'Account is locked.'
        });

        const authToken = generateToken(user.userName);
        res.json({
            token: authToken
        });
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            message: 'Invalid token.'
        });
    }
};

exports.time = async (req, res) => {
    try {
        const {
            authorization
        } = req.headers;
        if (!authorization) return res.status(401).json({
            message: 'No token provided.'
        });

        const token = authorization.split(' ')[1];

        const userName = verifyToken(token);
        const query = {
            userName
        };
        const user = await UserModel.findOne(query);
        if (!user) return res.status(404).json({
            message: 'User not found.'
        });
        if (user.isLocked) return res.status(403).json({
            message: 'Account is locked.'
        });

        res.json({
            time: new Date().toISOString()
        });
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            message: 'Invalid token.'
        });
    }
};

exports.kickOut = async (req, res) => {
    try {
        const {
            userName
        } = req.body;

        const query = {
            userName
        };
        const user = await UserModel.findOne(query);
        if (!user) return res.status(404).json({
            message: 'User not found.'
        });

        const updateData = {
            $set: {
                loginAttempts: LOGIN_ATTEMPT_COUNT,
                isLocked: 1
            }
        };
        await UserModel.updateOne(query, updateData);

        return res.json({
            message: 'User kicked out successfully.'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong.'
        });
    }
};
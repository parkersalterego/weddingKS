const express = require('express');
const User = require('../models/user.model');
const Guest = require('../models/guest.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
const STAMP_ROUNDS = 8;

class UserController {
    constructor(router) {
        router.route('/users')
            .get(this.getAllUsers);
        router.route('/users/token')
            .post(UserController.allowCredentials, UserController.verifyRefreshToken, this.token)
            .options(UserController.allowCredentials);
        router.route('/users/login')
            .options(UserController.allowCredentials)
            .post(UserController.allowCredentials, this.loginUser);
        router.route('/users/register')
            .post(this.registerUser);
        router.route('/users/:_id')
            .get(this.getUserById)
            .delete(this.softDeleteUser);
        router.route('/users/restore/:_id')
            .delete(this.restoreUser);
        router.route('/users/reset-password')
            .post(this.resetPassword);
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await User.find({'is_deleted' : false});
            res.status(200).json(users);
        } catch (err) {
            next(err);
        }
    }

    async token(req, res, next) {
        try {
            const accessToken = await UserController.generateAccessToken(req.user);
                res.status(200).json(accessToken);
        } catch (err) {
            next(err);
        }
    }

    async loginUser(req, res, next) {
        try {
            const user = await User.findOne({'email' : req.body.email, 'is_deleted' : false});
            if (user) {
                const result = await bcrypt.compare(req.body.password, user.password);
                if(result) {
                    const accessToken = await UserController.generateAccessToken(user);
                    console.log(accessToken);
                    const refreshToken = await UserController.generateRefreshToken(user);
                    UserController.setRefreshTokenCookie(res, refreshToken);
                    res.status(200)
                        .json({
                            refreshToken: refreshToken,
                            accessToken: accessToken
                        });
                } else {
                    res.status(403).json('incorrect email or password');
                }
            } else {
                res.status(403).json('incorrect email or password');
            }
        } catch (err) {
            next(err);
        }
    }

    
    static allowCredentials(req, res, next) {
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    }

    async registerUser(req, res, next) {
        try {
            // const hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
            //         req.body.password = hash;
            //         const user = await User.create(new User(req.body));
            //         await UserController.updateSecurityStamp(user)
            //             res.status(200).json(user);
            const checkEmail = await User.findOne({'email' : req.body.email, 'is_deleted' : false})
            const checkGuest = await Guest.findOne({'firstName' : req.body.firstName, 'lastName' : req.body.lastName});

            if (checkGuest === null || checkGuest === undefined) {
                res.status(403).json('It apears you are not on the guest list');
            } else {
                if (checkEmail !== null && checkEmail !== undefined) {
                    res.status(403).json('An account already exists with the provided email or username');
                } else {
                    const hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
                    req.body.password = hash;
                    const user = await User.create(new User(req.body));
                    await UserController.updateSecurityStamp(user)
                        res.status(200).json(user);
                }
            }
        } catch (err) {
            next(err);
        }
    }

    async getUserById(req, res, next) {
        try {
            const user = await User.findOne({'_id' : req.params._id, 'is_deleted' : false}, {'password' : 0});
                res.status(200).json(user);
        } catch(err) {
            next(err);
        }
    }

    async softDeleteUser(req, res, next) {
        try {
            const softDelete = await User.findOneAndUpdate(req.params._id, {'is_deleted' : true}, {'new' : true})
            res.status(200).json(softDelete);
        } catch(err) {
            next(err)
        }
    }

    async restoreUser(req, res, next) {
        try {
            const restore = await User.findOneAndUpdate(req.params._id, {'is_deleted' : false}, {'new' : true})
            res.status(200).json(restore);
        } catch(err) {
            next(err)
        }
    }

    async resetPassword(req, res, next) {
        try {
            const user = await User.findOne({'email' : req.body.email, 'is_deleted' : false})

            if (user === null || user === undefined) {
                res.status(500).json('There is no user registered with the email ' + req.body.email);
            } else {
                const hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
                await UserController.updateSecurityStamp(user)
                const updateUser = await User.update({'_id' : user._id}, {$set: {'password' : hash}});

                if (updateUser === null || updateUser === undefined) {
                    res.status(500).json('Unable to update password by email please get in touch with support through the help section');
                } else {
                    const updatedUser = await User.findById(user._id);
                    res.status(200).json(updatedUser);
                }
            }
        } catch(err) {
            next(err);
        }
    }


    // UTILITY METHODS

    static async verifyRefreshToken(req, res, next) {
        try {
            const refreshToken = req.cookie.refreshToken;
            const userId = refreshToken.split('.')[0];
            if (!req.user) {
                req.user = await User.findOne(userId)
            }
            const tokenEntry = user.refreshToken;
            if (tokenEntry) {
                next();
            } else {
                throw new Error();
            }
        } catch(e) {
            const err = new Error('Invalid Refresh Token');
            err.name = 'UnauthorizedError';
            next(err);
        }
    }

    static async generateAccessToken(user) {
        return new Promise((resolve, reject) => {
            jwt.sign({
                id: user._id,
                username: user.username,
                secStamp: user.secStamp
            },
            process.env.JWT_SECRET, 
            {expiresIn : '30min'},
            (err, token) => {
                if (err) return reject(err);
                resolve(token);
            });
        });
    }

    static async updateSecurityStamp(user) {
        const stampData = JSON.stringify({email: user.email, password: user.password});
        const secStamp = await bcrypt.hash(stampData, STAMP_ROUNDS);
        await User.findOneAndUpdate(user._id, {secStamp: secStamp});
    }

    static async getUserRolesPermissions(user) {
        const user = await User.findOne(user._id);
        return {role: user.role, permissions: user.permissions};
    }

    static async generateRefreshToken(user) {
        const refreshToken = user._id.toString() + '.' + crypto.randomBytes(40)
            .toString('hex');
        const updatedUser = await User.findOneAndUpdate(user._id, {refreshToken : refreshToken}, {new: true});
        return updatedUser.refreshToken;
    }

    static setRefreshTokenCookie(res, refreshToken) {
        res.cookie('refreshToken', refreshToken, {
            maxAge: 3600 * 24 * 90 * 1000, // 180 days
            httpOnly: true,
            domain: 'localhost',
            path: '/api/users/token', // @TODO use .env
        });
    }

    static clearRefreshTokenCookie(res) {
        res.cookie('refreshToken', '', {
            maxAge: -1,
            httpOnly: true,
            path: '/api/user/token'
        });
    }

}

module.exports = UserController;

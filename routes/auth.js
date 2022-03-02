const express = require('express');
const { check, body } = require('express-validator');
const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
    [
        check('email', 'Please enter a valid E-Mail !!')
            .isEmail()
            .toLowerCase(),
    ],
    authController.postLogin
);

router.post(
    '/signup',
    [
        check('email', 'Please enter a valid E-Mail !!')
            .isEmail().toLowerCase()
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('E-Mail exists already, please pick a different one.');
                        }
                    })
            }),
        body('password', 'Please enter a password with only number and text and at least 5 to 14 charecter !!')
            .isLength({
                min: 5,
                max: 14
            })
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Password Does't Match !!");
                }
                return true;
            })
    ],
    authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
'use strict';

const {
    Router
} = require("express");

const router = new Router();
const loginLimiterValidator = require("../middleware/login-limiter-validator");
const {
    login,
    requestLink,
    authLink,
    time,
    kickOut
} = require("../controller/user-controller");

router.post('/login', loginLimiterValidator, login);
router.post('/request-link', requestLink);
router.get('/auth-link', authLink);
router.get('/time', time);
router.get('/kick-out', kickOut);

module.exports = router;
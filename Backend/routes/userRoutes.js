const express = require('express');
const router = express.Router();
const User = require('../controllers/userController');
const passport = require('../middlewares/auth');
const { jwtAuthMiddleware } = require('../middlewares/jwt');

const localAuthMid = passport.authenticate('local', {session: false});

router.post('/signup', User.signUp);

router.post('/login', localAuthMid, User.login);

// router.get('/profile', jwtAuthMiddleware, User.profile);


module.exports = router;
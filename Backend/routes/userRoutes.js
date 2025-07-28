const express = require('express');
const router = express.Router();
const User = require('../controllers/userController');
const passport = require('../middlewares/auth');


router.post('/signup', User.signUp);

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
    if (!user) {
      return res.status(401).json({ error: info?.message || 'Invalid credentials' });
    }

    req.user = user;
    return User.login(req, res);
  })(req, res, next);
});


module.exports = router;
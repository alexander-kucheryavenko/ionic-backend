const express = require('express');

const controller = require('../controllers/auth');

const router = express.Router();

// localhost:8000/auth/login
router.post('/login', controller.login);
// localhost:8000/auth/registration
router.post('/registration', controller.register);

module.exports = router;

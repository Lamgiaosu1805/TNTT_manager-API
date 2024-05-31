const express = require('express');
const auth = require('../middlewares/auth');
const UserController = require('../controllers/UserController');
const router = express.Router()

router.get('/info', auth.verifyToken, UserController.getUserInfo);

router.post('/change-password', auth.verifyToken, UserController.changePassword);

module.exports = router;
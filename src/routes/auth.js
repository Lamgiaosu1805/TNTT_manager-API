const express = require('express');
const AuthController = require('../controllers/AuthController');
const auth = require('../middlewares/auth');
const router = express.Router()

router.post('/signUp', auth.verifyTokenForAdminXuDoan, AuthController.signUp);
// router.post('/signUp/admin', AuthController.createAdmin);
router.post('/signIn', AuthController.signIn);

module.exports = router;
const express = require('express');
const auth = require('../middlewares/auth');
const XuDoanController = require('../controllers/XuDoanController');
const router = express.Router()

router.post('/create', auth.verifyTokenForAdmin, XuDoanController.createXuDoan);

module.exports = router;
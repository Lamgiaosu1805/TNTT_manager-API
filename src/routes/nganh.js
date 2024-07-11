const express = require('express');
const NganhController = require('../controllers/NganhController');
const auth = require('../middlewares/auth');
const router = express.Router()

router.post('/create', auth.verifyTokenForAdmin, NganhController.createNganh);

module.exports = router;
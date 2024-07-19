const express = require('express');
const auth = require('../middlewares/auth');
const XuDoanController = require('../controllers/XuDoanController');
const upload = require('../middlewares/uploadFile');
const router = express.Router()

router.post('/create', auth.verifyTokenForAdmin, XuDoanController.createXuDoan);
router.post('/addDoanSinhExcel', auth.verifyTokenForAdminXuDoan, upload.single('file'), XuDoanController.addDoanSinhByExcelFile);

module.exports = router;
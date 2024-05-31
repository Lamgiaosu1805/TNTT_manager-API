const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    roleId: {type: Number, required: true}, //Id = 0, Admin tổng, 1, Admin hỗ trợ hệ thống,. 2, Admin Xứ đoàn ... 3, GV - ngQL, 4, Account Thường
    isResetPassword: {type: Boolean, default: true}, // Phải đổi mật khẩu sau khi mật khẩu được sinh tự động lúc tạo TK, khi chưa đổi == true, sau khi đổi == false
    fullName: { type: String, required: true },
    isActive: {type: Boolean, default: true},
    idXuDoan: {type: String, default: ""},
}, {
    timestamps: true
})

module.exports = mongoose.model('user', User)
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    role: {type: Number, required: true},//Id = 0, Admin tổng, 1, Admin hỗ trợ hệ thống,. 2, Admin Xứ đoàn ... 3, Account
    isResetPassword: {type: Boolean, default: true},
    fullName: { type: String, required: true },
    isActive: {type: Boolean, default: true},
    idXuDoanQly: {type: String, default: ""},
}, {
    timestamps: true
})

module.exports = mongoose.model('user', User)
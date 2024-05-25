const mongoose = require('mongoose')
const Schema = mongoose.Schema

const XuDoan = new Schema({
    tenXuDoan: { type: String, required: true },
    tenGiaoXu: { type: String, required: true },
}, {
    timestamps: true
})

module.exports = mongoose.model('xuDoan', XuDoan)
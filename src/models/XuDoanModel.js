const mongoose = require('mongoose')
const Schema = mongoose.Schema

const XuDoan = new Schema({
    tenXuDoan: { type: String, required: true },
    tenGiaoXu: { type: String, required: true },
    avtUrl: { type: String, default: "" },
    ngayThanhLap: {type: Date, default: ""},
    isDelete: {type: Boolean, default: false}
}, {
    timestamps: true
})

module.exports = mongoose.model('xuDoan', XuDoan)
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DoanSinh = new Schema({
    fullName: { type: String, required: true },
    idAccount: { type: String, required: true },
    idXuDoan: { type: String, required: true },
    idClass: {type: String, default: ''},
    className: {type: String, default: ''},
    dob: {type: Date, default: ''},
    isDelete: {type: Boolean, default: false},
}, {
    timestamps: true
})

module.exports = mongoose.model('doanSinh', DoanSinh)
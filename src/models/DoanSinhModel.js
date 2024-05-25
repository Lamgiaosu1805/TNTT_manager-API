const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DoanSinh = new Schema({
    fullName: { type: String, required: true },
    idAccount: { type: String, required: true },
    idXuDoan: { type: String, required: true }
}, {
    timestamps: true
})

module.exports = mongoose.model('doanSinh', DoanSinh)
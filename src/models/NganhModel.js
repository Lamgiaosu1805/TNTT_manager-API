const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Nganh = new Schema({
    tenNganh: { type: String, required: true },
}, {
    timestamps: true
})

module.exports = mongoose.model('nganh', Nganh)
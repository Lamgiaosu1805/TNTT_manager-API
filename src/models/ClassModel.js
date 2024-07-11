const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Class = new Schema({
    className: { type: String, required: true },
    idXuDoan: { type: String, required: true },
    tenXuDoan: { type: String, required: true },
    idNganh: { type: String, required: true },
    tenNganh: { type: String, required: true },
    isDelete: {type: Boolean, default: false}
}, {
    timestamps: true
})

module.exports = mongoose.model('class', Class)
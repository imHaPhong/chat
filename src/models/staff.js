const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const staffschame = new mongoose.Schema({
    notification:{
        type: String,
        require: true
    },
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account'
    },
    status:{
        type: Number,
        default: 1
    }
})

const Staff = mongoose.model('Staff', staffschame)

module.exports = Staff
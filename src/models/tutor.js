const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const tutorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type : Date, default: Date.now 
    },
    role:{
        type: String,
        required: true,
        default: 2
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

const Tutor = mongoose.model('Tutor', tutorSchema)

tutorSchema.statics.findByCredentials = async (email,password) => {
    const tutor = await Tutor.findOne({ email })

    if (!tutor) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, tutor.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return tutor
}

tutorSchema.methods.generateAuthToken = async function () {
    const user = this
    console.log(user);
    
    const token = jwt.sign({ _id: user._id.toString(), role: user.role}, 'thisismynewcourse')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

tutorSchema.pre('save', async function (next) {
    const user = this
    if(user.isModified('token')) {
        user.dateLogin = new Date()
    }

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

module.exports = Tutor
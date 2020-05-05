const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const accountSchema = new mongoose.Schema({
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
        required: true
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    upload:[{
      name: {
        type: String,
        required: true
       },
       file: {
           type: String,
           required: true
       }
    }],
    status:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }],
    meetings:[{
        date: {
            type: Date
        },
        partner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        },
        place: {
            type: String,
            required: true
        }
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

accountSchema.statics.findByCredentials = async (email,password) => {
    const account = await Account.findOne({ email })

    if (!account) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, account.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return account
}

accountSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString(), role: user.role}, 'abc')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

accountSchema.pre('save', async function (next) {
    const user = this
    if(user.isModified('token')) {
        user.dateLogin = new Date()
    }

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const Account = mongoose.model('Account', accountSchema)


module.exports = Account
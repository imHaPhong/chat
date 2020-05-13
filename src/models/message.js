const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'account'
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'account'
    },
    message: [
        {
            message:{
                type: String,
                required: true
            },
            time:{
                 type : Date, default: Date.now 
            }, 
            status:{
                type: Number,
                required: true
            },
            link: {
                type: String, default: null
            }
        }
    ],
    document: []
})

const Message = mongoose.model('messages', messageSchema, 'messages')


module.exports = Message
const Tutor = require('../models/tutor')
const Account = require('../models/account')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {

    try {   
        let tokens = req.headers.cookie
        tokens = tokens.split(';')
        const token = tokens[0].replace('token=', '')
        const decoded = jwt.verify(token, 'abc')
        console.log(decoded);
        
        if(decoded.role ==  '1'){
            const student = await Account.findOne({ _id: decoded._id, 'tokens.token': token});
            req.user = student
            if (!student) {
                throw new Error('student')
            } 

            
        }else if(decoded.role == '2'){
            const tutor = await Account.findOne({ _id: decoded._id, 'tokens.token': token});
            req.user = tutor
            if (!tutor) {
                throw new Error('tutor')
            } 
        }else{
            const tutor = await Account.findOne({ _id: decoded._id, 'tokens.token': token});
            req.user = tutor
            if (!tutor) {
                throw new Error('tutor')
            } 
        }
        req.token = token
        req.role = decoded.role
        next()
    } catch (e) {
        res.status(401).send('please authenticate 1' + e)
    }
}

const tutorAuth = async (req, res, next) => {
    try {      
        if(req.role != 2){
            throw new Error('please authorization')
        }
        next()
    } catch (error) {
        res.status(400).send(error.message)
    }
}

const studentAuth = async (req, res, next) => {
    try {
        if(req.role != 1){
            throw new Error('please authorization 2')
        }
        next()
    } catch (error) {
        res.status(400).send(error.message)
    }
}

module.exports = auth
module.exports.studentAuth = studentAuth
module.exports.tutorAuth = tutorAuth
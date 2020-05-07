const router = require('express').Router()

const Tutor = require('../models/tutor')
const Account = require('../models/account')

router.get('/', (req, res) => {
    res.render('login', {mess: null})
})

router.post('/', async (req, res) => {
    let {email, password, role} = req.body
    switch (role) {
        case 'Student':
            role = '1'
            break;
        case 'Tutor':
            role = '2'
            break;
        default:
            role = '3'
    }
    const roles  = '1,2,3'
    var validateMail =  (email) => {
        if(email.trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            return true;
        } else{
            return false;
        }
    }

    if(validateMail(email)){
        res.render('login', {mess: true, data: "email is not validate"})
    } else {
        if(role == 3){
            const account = await Account.findByCredentials(email,password,role)
            const token = await account.generateAuthToken()
            res.cookie('token', token)
            res.redirect('/staff/')
        } else if(role == 2){
           try {
            const account = await Account.findByCredentials(email,password,role)
            const token = await account.generateAuthToken()
            res.cookie('token', token)
            res.render('chat', {token: "tokens"})
           } catch (error) {
            res.render('login', {mess: true, data: "Username or password incorrect"})
           }
        } else {
            try {
               
                const account = await Account.findByCredentials(email,password,role)
                const token = await account.generateAuthToken()
                res.cookie('token', token)
                res.render('chat', {token: "tokens"})
               } catch (error) {
                res.render('login', {mess: true, data: "Username or password incorrect"})
               }
        }
    }
})


module.exports = router
const router = require('express').Router()

const Tutor = require('../models/tutor')
const Account = require('../models/account')

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/', async (req, res) => {
    const {email, password, role} = req.body
    const roles  = '1,2,3'
    
    if(!roles.includes(role)){
        res.status(400).send('Invalid role')
    } else {
        if(role == 3){
            const account = await Account.findByCredentials(email,password)
            const token = await account.generateAuthToken()
            res.cookie('token', token)
            res.redirect('/staff/')
        } else if(role == 2){
           try {
            const account = await Account.findByCredentials(email,password)
            const token = await account.generateAuthToken()
            res.cookie('token', token)
            res.render('userIndex', {token: "tokens"})
           } catch (error) {
               res.status(400).send(error.message)
           }
        } else {
            try {
               
                const account = await Account.findByCredentials(email,password)
                const token = await account.generateAuthToken()
                res.cookie('token', token)
                res.render('userIndex', {token: "tokens"})
               } catch (error) {
                   res.status(400).send(error.message)
               }
        }
    }
})


module.exports = router
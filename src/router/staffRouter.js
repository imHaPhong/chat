const router = require('express').Router()
const Account = require('../models/account')
const Tutor = require('../models/tutor')
const Message = require('../models/message')
const {send2Student, send2Tuor} = require('../utils/sendEmail')

router.get('/', async (req, res) =>{ 
    let tutorOnline = [] 
    let studentOnline = [] 
    let staffNotActive = []
    let studentNotActive = []
    const updateList = await Account.find()
        updateList.forEach(ls => {
            if(ls.isOnline && ls.role == 2) {
                tutorOnline.push(ls)
            } else if(ls.isOnline && ls.role == 1) {
                studentOnline.push(ls)
            } else if(ls.active != null && ls.role == 2){
                if(ls.active.getTime() < new Date().getTime() - (7 * 24 * 60 * 60 * 1000)){
                    staffNotActive.push(ls)
                }
            } else if(ls.active != null && ls.role == 1){
                if(ls.active.getTime() < new Date().getTime() - (7 * 24 * 60 * 60 * 1000)){
                    studentNotActive.push(ls)
                }
        }})
    res.render('index', {listTutor: tutorOnline.length, listStudent: studentOnline.length, tNotActive: staffNotActive.length, sNotActive: studentNotActive.length})
})

router.post('/addStudent', async (req, res) => {
    const account = await Account(req.body)
    await account.save()
    res.send(account)
})

router.get('/listTutor', async (req, res) => {
    const lTutor = await Account.find()
    res.send(lTutor)
})

router.post('/associate', async (req, res) => {
    const {sender,receiver} = req.body
    const message = await Message({from: sender, to: receiver})
    const message2 = await Message({from: receiver, to: sender})
    await message.save()
    await message2.save()
    res.send("oke")
})


router.get('/StudentClick',async (req, res) => {
    const listStudent = await Account.find({role:'1'})
    res.render('StudentClick', {listStudent})
})
router.get('/TutorClick', async (req, res) => {
    const listStudent = await Account.find({role:'2'})
    res.render('TutorClick', {listStudent})
    //console.log(listStudent[0].status.length)
})
router.get('/AssociateClick', async (req, res) => {
    const listStudent = await Account.find({role:'1'})
    const listTutor = await Account.find({role:'2'})
    res.render('AssociateClick', {listStudent, listTutor})
})

router.post('/getData',async (req, res) => {
    let {tutor, listStudent} = req.body  
    const sTutor = await Account.findById(tutor)
    if(typeof listStudent != 'string'){   
        for(let i = 0; i < listStudent.length; i++) {
            sTutor.status = sTutor.status.concat(listStudent[i])
            let sStudent = await Account.findById(listStudent[i])
            sStudent.status = sStudent.status.concat(tutor)
            let message = await Message({from: tutor, to: listStudent[i]})
            let message2 = await Message({from: listStudent[i], to: tutor})
            await message.save()
            await message2.save()
            await sStudent.save()
        }
        await sTutor.save()
        listStudent.forEach(stu => {
            send2Student(sTutor.name, stu.email)
        })
        send2Tuor(listStudent.toString() , sTutor.email)
    }
    else{
        sTutor.status = sTutor.status.concat(listStudent)
        let sStudent = await Account.findById(listStudent)
        sStudent.status = sStudent.status.concat(tutor)
        let message = await Message({from: tutor, to: listStudent})
        let message2 = await Message({from: listStudent, to: tutor})
        await message.save()
        await message2.save()
        await sStudent.save()
        await sTutor.save()
        send2Student(sTutor.name, sStudent.email)
        send2Student(sStudent.name, sTutor.email)
    }

    res.redirect('http://localhost:3000/staff/AssociateClick')
})

router.get('/studentNotActive', async (req, res) => {
        var notActice = []
    var account = await Account.find({role: '1'})
    account.forEach(acc => {
       if(acc.active != null){
        if(acc.active.getTime() < new Date().getTime() - (7 * 24 * 60 * 60 * 1000)){
            notActice.push(acc)
        }
       }
    })
    res.render('StudentClick', {listStudent: notActice})
})
router.get('/tutorNotActive', async (req, res) => {
        var notActice = []
    var account = await Account.find({role: '2'})
    account.forEach(acc => {
       if(acc.active != null){
        if(acc.active.getTime() < new Date().getTime() - (7 * 24 * 60 * 60 * 1000)){
            notActice.push(acc)
        }
       }
    })
    res.render('TutorClick', {listStudent: notActice})
})
module.exports = router
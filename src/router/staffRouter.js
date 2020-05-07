const router = require('express').Router()
const Account = require('../models/account')
const Tutor = require('../models/tutor')
const Message = require('../models/message')
const {send2Student, send2Tuor} = require('../utils/sendEmail')
const {index, listTutor, studentClick, associate, tutorClick, studentNotActive, tutorNotActive, statistical, statisticalMess} = require('../controller/staffController')

router.get('/', index)

router.post('/addStudent', async (req, res) => {
    const account = await Account(req.body)
    await account.save()
    res.send(account)
})

router.get('/listTutor', listTutor)

router.post('/associate', associate)


router.get('/StudentClick', studentClick)
router.get('/TutorClick', tutorClick)
router.get('/AssociateClick', async (req, res) => {
    const listStudent = await Account.find({role:'1'})
    const listTutor = await Account.find({role:'2'})
    res.render('AssociateClick', {listStudent, listTutor})
})

router.get('/AssociateClick/Nos', async (req, res) => {
    let olistStudent = await Account.find({role:'2'})
    const listStudent = await Account.find({role:'1'})
    for(let i = 0; i < olistStudent.length; i++) {
        for(let j = i + 1; j < olistStudent.length; j++) {
            if(olistStudent[i].status.length > olistStudent[j].status.length) {
                let store = olistStudent[i]
                olistStudent[i] = olistStudent[j];
                olistStudent[j] = store
            }
        }
    }
    let listTutor = olistStudent
    res.render('AssociateClick', {listStudent, listTutor})
})
router.get('/AssociateClick/name', async (req, res) => {
    const listTutor = await Account.find({role:'2'},{},{sort: {name: 1}})
    const listStudent = await Account.find({role:'1'},{},{sort: {status: 1}})
    res.render('AssociateClick', {listStudent, listTutor})
})
router.get('/AssociateClick/status', async (req, res) => {
    const listTutor = await Account.find({role:'2'},{},{sort: {status: 1}})
    const listStudent = await Account.find({role:'1'},{},{sort: {status: 1}})
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

router.get('/statistical', async (req, res) => {
    res.render('statistical')
})
router.get('/statistical/mess', async (req, res) => {
    res.render('statisticalMess')
})
module.exports = router
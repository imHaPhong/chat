const Account = require('../models/account')
const Tutor = require('../models/tutor')
const Message = require('../models/message')

exports.index =   async (req, res) =>{ 
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
}

exports.listTutor = async (req, res) => {
    const lTutor = await Account.find()
    res.send(lTutor)
}

exports.associate = async (req, res) => {
    const {sender,receiver} = req.body
    const message = await Message({from: sender, to: receiver})
    const message2 = await Message({from: receiver, to: sender})
    await message.save()
    await message2.save()
    res.send("oke")
}

exports.studentClick = async (req, res) => {
    const listStudent = await Account.find({role:'1'})
    res.render('StudentClick', {listStudent})
}

exports.tutorClick = async (req, res) => {
    const listStudent = await Account.find({role:'2'})
    res.render('TutorClick', {listStudent})
}
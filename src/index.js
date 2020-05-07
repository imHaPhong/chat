const path = require('path')
require('./db/mongoose')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Message = require('./models/message')
const tutorRouter = require('./router/tutorRouter')
const staffRouter = require('./router/staffRouter')
const studentRouter = require('./router/studentRouter.js')
const login = require('./router/login.js')
const auth = require('./auth/auth')
var bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const Account = require('./models/account')
const Staff = require('./models/staff')
// set up multer
const fs = require('fs');

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../src/views')

app.set('view engine', 'ejs')
app.set('views', viewsPath)
app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

io.on('connection', (socket) => {  
    let fileName = ''
    socket.on('login', async (token) => {
        //socket.name = name
        const decoded = jwt.verify(token, 'abc')
        const {_id, role} = decoded
        const account = await Account.findById(_id)
        socket.userid = account._id
        socket.userName = account.name
        socket.role = account.role
        console.log(role);
        
        if(role != 3){
            const account = await Account.findById(_id)
            account.isOnline = true
            socket.userid = account._id
            socket.userName = account.name    
            socket.emit('getName', socket.userName)
            let students = await Message.find({from: socket.userid})
            for(let i = 0; i < students.length; i++){
                await students[i].populate('to').execPopulate()
            }
    
            let listStudent = []
            students.forEach(student => listStudent.push({'reciever':student.to._id, 'name': student.to.name})) 
            socket.emit('updateStudent', listStudent)
            socket.join(socket.userid)
            //console.log()
            socket.emit('loadUser', {user: listStudent[0], message: students[0].message})
            account.active = new Date()
            await account.save()
            
        } else {
            account.isOnline = true
            await account.save()
            console.log('staff: ' + socket.userName);       
        }
        let tutorOnline = [] 
        let studentOnline = [] 
        const updateList = await Account.find()
        updateList.forEach(ls => {
            if(ls.isOnline && ls.role == 2) {
                tutorOnline.push(ls)
            }
        })
        updateList.forEach(ls => {
            if(ls.isOnline && ls.role == 1) {
                studentOnline.push(ls)
            }
        })
        io.sockets.emit('userOnline', {listTutor: tutorOnline.length, listStudent: studentOnline.length})
    })

    socket.on('sendMessage', async (data, link, to) => {     
        console.log(socket.userid, to, data)
        let message = await Message.find({from: socket.userid, to: to})
        let receiver = await Message.find({from: to, to: socket.userid})
        message = message[0]
        receiver = receiver[0]
        console.log(message);
        io.to(to).emit('getMessage', data, link) 
        if(link != null){
            fileName = './uploads/' + new Date().getTime() + link 
            link = './download/' + new Date().getTime() + link 
        } 
        message.message = message.message.concat({message: data, time: new Date, status: 0, link})
        socket.emit('Message', data, link)
        receiver.message = receiver.message.concat({message: data, time: new Date, status: 1, link});
        await message.save()
        await receiver.save()
    })
    socket.on('chat', async (id) => {
        const message = await Message.find({from: socket.userid, to: id})  
        await message[0].populate('to').execPopulate()         
        socket.emit('changeUser', { id, message: message[0].message, 'name': message[0].to.name})
    })
    socket.on('sendFile', async ({name, file, to}) => {     
        //let dir = './uploads/' + new Date().getTime() + name 
        fs.writeFile(fileName, file, (err) => {
            if(err){
                console.log(err)
            }
        })
        let sender = await Message.find({from: socket.userid, to: to})
        let receiver = await Message.find({from: to, to: socket.userid})
        sender = sender[0]
        receiver = receiver[0]
        sender.document = sender.document.concat({name, file: fileName})
        receiver.document = receiver.document.concat({name, file: fileName})
        await receiver.save()
        await sender.save()
    })

    socket.on('notication',async () => {
        console.log('alo');
        
        const account = await Account.findById(socket.userid)             
        const notification = 'Student ' + account.name + ' has requested to help' 
        let staff = await Staff({notification, studentId: socket.userid})
        await staff.save()
        const listNotifications = await Staff.find()
        io.sockets.emit('sendNotification', {listNotifications})
    })

    socket.on('getInfo', async function (){   
        const listNotifications = await Staff.find()
        io.sockets.emit('sendNotification', {listNotifications})
    })

    socket.on('checked', async (data) => {
        const notification = await Staff.findById(data)
        notification.status = 0
        await notification.save()
        const listNotifications = await Staff.find()
        io.sockets.emit('sendNotification', {listNotifications})
    })

    socket.on('disconnect', async function () {
        const user = await Account.findById(socket.userid)
        if(user.isOnline){
            user.isOnline = null
        }
        await user.save()
        let tutorOnline = [] 
        let studentOnline = [] 
        const updateList = await Account.find()
        updateList.forEach(ls => {
            if(ls.isOnline && ls.role == 2) {
                tutorOnline.push(ls)
            }
        })
        updateList.forEach(ls => {
            if(ls.isOnline && ls.role == 1) {
                studentOnline.push(ls)
            }
        })
        io.sockets.emit('userOnline', {listTutor: tutorOnline.length, listStudent: studentOnline.length})
    });
})

 
app.use('/staff',staffRouter)
app.use(login)
app.use('/student',auth, auth.studentAuth ,studentRouter)
app.use('/tutor',auth, auth.tutorAuth ,tutorRouter)

app.use(login)

app.post('/upload', (req,res) => {
    console.log("da nhan");  
})

app.post('/:id', (req,res) => {
    res.send(req.params.id) 
})

app.get('/download/:id', (req,res) => {
    let link = 'uploads/' + req.params.id
    res.download(link)
    // console.log(req.params.id)
    // console.log('158752923947293547536_862869704191010_4891187384651087872_n.jpg')
    // console.log(req.params.id + '' == '158752923947293547536_862869704191010_4891187384651087872_n.jpg');
    
    //res.download('uploads/158752923947293547536_862869704191010_4891187384651087872_n.jpg')
    
})

app.get('/', (req, res) => {
    res.render('meeting')
})

server.listen('1999', () => {
    console.log(`Server is up on port ${port}!`)
})
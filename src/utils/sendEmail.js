const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: 'visaolaithe99@gmail.com', // generated ethereal user
    pass: 'nguyenanhtuan1' // generated ethereal password
  }
});

module.exports.send2Student = async (name, email) => {
  let info = await transporter.sendMail({
    from: 'visaolaithe99@gmail.com', 
    to: email, 
    subject: "eTutoring ",
    text: "The request to associate with the tutor has been resolved", 
    html: `<h1>Hi</h1> <p>You are already associated with tutor: ${name}</p>`
  });
}

module.exports.send2Tutor = async (name, email) => {
  let info = await transporter.sendMail({
    from: 'visaolaithe99@gmail.com', 
    to: email, 
    subject: "eTutoring ",
    text: "The request to associate with the tutor has been resolved", 
    html: `<h1>Hi</h1> <p>You are already associated with student: ${name}</p>`
  });
}


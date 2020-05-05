const socket = io()

function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

socket.on('user', (data) => {
    console.log(data);    
})
socket.on('updateStudent', (data) => {
    console.log(data);
    
    data.forEach(d => {   
        $('.contacts').append('<div class="d-flex bd-highlight user" id ="'+ d.reciever +'"><div class="img_cont"><img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img"><span class="online_icon"></span></div><div class="user_info"><span>'+ d.name +'</span><p>Kalid is online</p></div></div>')
    })
    
})

$(document).on( "click",'.user', (e) => {
    e.preventDefault(); 
    console.log(e.currentTarget.id);
    
    socket.emit('chat', e.currentTarget.id)
    $('div .msg_card_body').html('')
})
    
socket.on('changeUser', ({id, message, name}) => {
     $('.userName').text(name)
     $('.userName').attr('id', id)
      var d = new Date().getDay()
      weekday.f
      weekday[d] = 'Today'
     if(message){
        message.forEach(m => {     
            m.time = new Date(m.time) 
            if(m.status == 1) {
                let sendMessage = ''
                if(m.link != null){
                    sendMessage = '<div class="d-flex justify-content-start mb-4"><div class="img_cont_msg"><img src="" class="rounded-circle user_img_msg"></div><div class="msg_cotainer_send"><a href="#">' + m.message + '</a><span class="msg_time">,'+ addZero(m.time.getHours()) + ' : '+ addZero(m.time.getMinutes()) + ' '+ weekday[m.time.getDay()] +'</span></div></div>'
                  } else {
                     sendMessage = '<div class="d-flex justify-content-start mb-4"><div class="img_cont_msg"><img src="" class="rounded-circle user_img_msg"></div><div class="msg_cotainer_send">' + m.message + '<span class="msg_time">,'+ addZero(m.time.getHours()) + ' : '+ addZero(m.time.getMinutes()) + ' '+ weekday[m.time.getDay()] +'</span></div></div>'
                  }
                    $('.msg_card_body').append(sendMessage);
            } else {

                sendMessage = '<div class="d-flex justify-content-end mb-4"><div class="img_cont_msg"><img src="" class="rounded-circle user_img_msg"></div><div class="msg_cotainer">' + m.message + '<span class="msg_time">,'+ addZero(m.time.getHours()) + ' : '+ addZero(m.time.getMinutes()) +  ' '+ weekday[m.time.getDay()] +'</span></div></div>'
                $('.msg_card_body').append(sendMessage);
            }
        })
     }
})


$( document ).ready(function() {
    let cookie = document.cookie
    cookie = cookie.replace('token=', '')
    socket.emit('login', cookie)

});

socket.on('loadUser', ({user, message}) => {
    console.log(message);
    if(message) {
       message.forEach(m => {
        if(m.link != null){
            $('.shared').append('<p><a href="'+ m.link+'">'+  m.message+'</a></p>')
        }
       })
    }
    $('.userName').text(user.name)
    $('.userName').attr('id', user.reciever)
    if(message){
        message.forEach(m => {     
            m.time = new Date(m.time) 
            if(m.status == 1) {
            let sendMessage = ''
              if(m.link != null){
                sendMessage = '<div class="d-flex justify-content-start mb-4"><div class="img_cont_msg"><img src="" class="rounded-circle user_img_msg"></div><div class="msg_cotainer_send"><a href="'+m.link+'">' + m.message + '</a><span class="msg_time">,'+ addZero(m.time.getHours()) + ' : '+ addZero(m.time.getMinutes()) + ' '+ weekday[m.time.getDay()] +'</span></div></div>'
              } else {
                 sendMessage = '<div class="d-flex justify-content-start mb-4"><div class="img_cont_msg"><img src="" class="rounded-circle user_img_msg"></div><div class="msg_cotainer_send">' + m.message + '<span class="msg_time">,'+ addZero(m.time.getHours()) + ' : '+ addZero(m.time.getMinutes()) + ' '+ weekday[m.time.getDay()] +'</span></div></div>'
              }
                $('.msg_card_body').append(sendMessage);
            } else {
                let sendMessage = ''
                if(m.link == null){
                sendMessage = '<div class="d-flex justify-content-end mb-4"><div class="img_cont_msg"><img src="" class="rounded-circle user_img_msg"></div><div class="msg_cotainer">' + m.message + '<span class="msg_time">,'+ addZero(m.time.getHours()) + ' : '+ addZero(m.time.getMinutes()) +  ' '+ weekday[m.time.getDay()] +'</span></div></div>'
                } else {
                    sendMessage = '<div class="d-flex justify-content-end mb-4"><div class="img_cont_msg"><img src="" class="rounded-circle user_img_msg"></div><div class="msg_cotainer"> <a href="'+m.link+'">' + m.message + '</a><span class="msg_time">,'+ addZero(m.time.getHours()) + ' : '+ addZero(m.time.getMinutes()) +  ' '+ weekday[m.time.getDay()] +'</span></div></div>'
                }
                $('.msg_card_body').append(sendMessage);
            }
        })
     }
})

socket.on("Message", (data, link) =>{   
    let sendMessage = ''
    if(link == null){
        sendMessage = '<div class="d-flex justify-content-end mb-4"><div class="img_cont_msg"><img src="" class="rounded-circle user_img_msg"></div><div class="msg_cotainer">' + data + '<span class="msg_time">8:40 AM, Today</span></div></div>'
    } else {
        sendMessage = '<div class="d-flex justify-content-end mb-4"><div class="img_cont_msg"><img src="" class="rounded-circle user_img_msg"></div><div class="msg_cotainer"> <a href="'+link+'">' + data + '</a><span class="msg_time">,</span></div></div>'
    }
    $('.msg_card_body').append(sendMessage);
})
socket.on("getName", data =>{
    $('.input-group').append(data);
})
socket.on("getMessage", data =>{
    console.log(data);
    
    let sendMessage = '<div class="d-flex justify-content-start mb-4"><div class="msg_cotainer_send">'+ data +'<span class="msg_time_send">9:05 AM, Today</span></div><div class="img_cont_msg"><img src="" class="rounded-circle user_img_msg"></div></div>'
    $('.msg_card_body').append(sendMessage);
})

    
$( ".notification" ).click(function() {
    socket.emit('notication')
  });
// $( ".meeting" ).click(function() {
//     socket.emit('meeting')
//   });

document.getElementsByClassName('input-group-append')[1].addEventListener('click', async () => {
    let message = document.getElementsByClassName('form-control type_msg')[0].value 
    let file = $('.data-form').prop('files')[0];   
    let link;
    if(file) {    
        message = file.name
        link = file.name
    }
    socket.emit('sendMessage', message, link,$('.userName').attr('id'))
    if(file) {    
    socket.emit('sendFile', {name: file.name, file, to:$('.userName').attr('id')})
    }
    
    document.getElementsByClassName('form-control type_msg')[0].value = ''

})
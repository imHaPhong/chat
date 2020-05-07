const socket = io()

socket.on('user', (data) => {
    console.log('data');    
})
socket.on('updateStudent', (data) => {
    data.forEach(d => {   
      $('#contacts ul').append('<li class="contact" id ="'+ d.reciever +'"><div class="wrap"><div class="meta"><p class="name">'+ d.name +'</p><p class="preview">ALo</p></div></div></li>')
    })
    
})

$(document).on( "click",'.contact', (e) => {
    e.preventDefault(); 
    socket.emit('chat', e.currentTarget.id)
    $('.ulmessages').html('')
})
    
socket.on('changeUser', ({id, message, name}) => {
     $('.userName').text(name)
     $('.userName').attr('id', id)
     if(message){
        message.forEach(m => {     
            if(m.status == 1) {
                let sendMessage = ''
                if(m.link != null){
                  sendMessage = '<li class="sent"><p><a href="">' + m.message +'</a></p></li>'
                  } else {
                    sendMessage = '<li class="sent"><p>' + m.message +'</p></li>'
                  }
                    $('.ulmessages').append(sendMessage);
            } else {
                if(m.link != null){
                    sendMessage = '<li class="replies"> <p><a href="">' + m.message +'</a></p></li>'
                    } else {
                      sendMessage = '<li class="replies"> <p>' + m.message +'</p></li>'
                    }
                $('.ulmessages').append(sendMessage);
            }
        })
     }
})


$(document).ready(function() {
    let cookie = document.cookie
    cookie = cookie.replace('token=', '')
    socket.emit('login', cookie)
});
socket.on('getUser', data => {
$('.uName').text(data.name)
})

socket.on('loadUser', ({user, message, meeting}) => {
    console.log(meeting.meetings[0]);
    
    if(message) {
       message.forEach(m => {
        if(m.link != null){
            $('.shared').append('<button type="button" class="list-group-item list-group-item-action"><p><a href="'+ m.link+'">'+  m.message+'</a></p></button>')
        }
       })
    }
    if(meeting.meetings) {
        meeting.meetings.forEach(m => {
           if(m.file){
            $('.meeting').append('<button type="button" class="list-group-item list-group-item-action"> date'+ m.date + '| Place: ' +  m.place +' file: '+ m.file+' </button>')
           } else{
            $('.meeting').append('<button type="button" class="list-group-item list-group-item-action"> date'+ m.date + '| Place: ' +  m.place +' </button>')
           }
        })
    }
    $('.userName').text(user.name)
    $('.userName').attr('id', user.reciever)
    if(message){
        message.forEach(m => {     
            if(m.status == 1) {
            let sendMessage = ''
              if(m.link != null){
                sendMessage = '<li class="sent">  <p><a href="'+ m.link+'">' + m.message +'</a></p></li>'
              } else {
                sendMessage = '<li class="sent"> <p>' + m.message +'</p></li>'
              }
                $('.ulmessages').append(sendMessage);
            } else {
                let sendMessage = ''
                if(m.link == null){
                    sendMessage = '<li class="replies"> <p>' + m.message +'</p></li>'
                } else {
                    sendMessage = '<li class="replies">  <p><a href="'+ m.link+'">' + m.message +'</a></p></li>'
                }
                $('.ulmessages').append(sendMessage);
            }
        })
     }
})

socket.on("Message", (data, link) =>{   
    let sendMessage = ''
    if(link == null){
        sendMessage = '<li class="replies"> <p>' + data +'</p></li>'
    } else {
        sendMessage = '<li class="replies"> <p> <a href="'+link+'">' + data +'</a></p></li>'
        }
    $('.ulmessages').append(sendMessage);
})
socket.on("getName", data =>{
    $('.input-group').append(data);
})
socket.on("getMessage", data =>{
    let sendMessage = '<li class="sent"> <p>' + data +'</p></li>'
    $('.ulmessages').append(sendMessage);
})

    
$( ".notification" ).click(function() {
    console.log('alo');
    socket.emit('notication')
  });

$('.message-input').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which)
  if(keycode == '13'){
    let message = $('.mess').val()
    let file = $('.file').prop('files')[0];   
    let link;
        if(file) {    
            message = file.name
            link = file.name
        }
        socket.emit('sendMessage', message, link,$('.userName').attr('id'))
        if(file) {    
        socket.emit('sendFile', {name: file.name, file, to:$('.userName').attr('id')})
        }
        $('.mess').val('')
  }
});
$('.meetingSave').click(function () {
 var data = $('.schedule').serialize()
 data = data.replace('date=', '')
 data = data.replace(/%2F/g, '/')
 var day = new Date(data)
 const place = $('.place').val()
 let file = $('.fileMeeting').prop('files')[0];
 socket.emit('addMeeting', {day, place,"partner" : $('.userName').attr('id') ,"name" : file.name, file})
})

const socket = io()

$( document ).ready(function() {

    let cookie = document.cookie
    cookie = cookie.replace('token=', '')
    socket.emit('login', cookie)
    socket.emit('getInfo')
    socket.on('sendNotification', ({notification, id, listNotifications}) => {
        var count = 0
        for (var i = 0; i < listNotifications.length; i ++) {
            if(listNotifications[i].status == 1){  
                count ++
            }
        }
        $('.badge-counter').text(count)
        $('.noti').html('')
        for (var i = 0; i < listNotifications.length; i ++) {
            if(listNotifications[i].status == 1){
                $('.noti').append('<a class="dropdown-item d-flex align-items-center" id="'+listNotifications[i]._id+'" href="'+listNotifications[i]._id+'"><div class="customItem"><div class="small text-gray-500">December 2, 2019</div>'+ listNotifications[i].notification + '</div></a>')
            }else{
                $('.noti').append('<a class="dropdown-item d-flex align-items-center" id="'+listNotifications[i]._id+'" href="'+listNotifications[i]._id+'"><div><div class="small text-gray-500">December 2, 2019</div>'+ listNotifications[i].notification + '</div></a>')
            }
        }
    })
})
$(document).on( "click",'.align-items-center', (e) => {
    var idNotification = e.currentTarget.id
    socket.emit('checked', idNotification)
})

socket.on('userOnline', (data) => {
    $('.numTutor').text(data.listTutor)
    $('.numStudent').text(data.listStudent)
})
//badge-counter
// noti
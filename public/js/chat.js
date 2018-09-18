var socket = io();

function scrollToBottom() {

    //Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    //Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + lastMessageHeight + newMessageHeight>=scrollHeight){
        messages.scrollTop(scrollHeight);
    }
    
}

socket.on('connect', function () {
    // console.log('Connected to server');
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function (err) {
        if(err){
            alert(err);
            window.location.href='/';
        }else {
            console.log('No error');
        }
    });

});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
    var ol = jQuery('<ol></ol>');

    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
});

socket.on('newMessage', function (message) {

    var formattedTime = moment(message.createdAt).format('h:mm a')
    var tempalate= jQuery('#message-tempalate').html();
    var html = Mustache.render(tempalate,{
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();

    // var formattedTime = moment(message.createdAt).format('h:mm a')
    // var li= jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);

    // jQuery('#messages').append(li);
});

// socket.emit('createMessage',  {
//     from: 'Frank',
//     text: 'Hi'
// }, function(ack){
//     console.log('Got it! ', ack);
// });

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val('');
    })

});

var locationButton = jQuery('#send-location');

locationButton.on('click', function (){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser!')
    }

    locationButton.attr('disabled', 'disabled').text('Sending Location...');
    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Sending Location');
        socket.emit('createLocationMessage',  {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    },function () {
        locationButton.removeAttr('disabled').text('Sending Location');
        alert('Unable to fetch location')
    });

    socket.on('newLocationMessage', function (message) {
        var formattedTime = moment(message.createdAt).format('h:mm a');
        var tempalate = jQuery('#location-message-tempalate').html();
        var html = Mustache.render(tempalate, {
            from: message.from,
            url: message.url,
            createdAt: formattedTime
        });
        jQuery('#messages').append(html);
        scrollToBottom();

        // var formattedTime = moment(message.createdAt).format('h:mm a')
        // var li = jQuery('<li></li>');
        // var a = jQuery('<a target="_blank">My current Location</a>');
        // li.text(`${message.from} ${formattedTime}: `);
        // a.attr('href', message.url);
        // li.append(a);
        // jQuery('#messages').append(li);
    });


} )
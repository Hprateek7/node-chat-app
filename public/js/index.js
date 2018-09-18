var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
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
        from: "User",
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

        // var formattedTime = moment(message.createdAt).format('h:mm a')
        // var li = jQuery('<li></li>');
        // var a = jQuery('<a target="_blank">My current Location</a>');
        // li.text(`${message.from} ${formattedTime}: `);
        // a.attr('href', message.url);
        // li.append(a);
        // jQuery('#messages').append(li);
    });


} )
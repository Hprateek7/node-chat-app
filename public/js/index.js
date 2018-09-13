var socket = io();
socket.on('connect', function () {
    console.log('Connected to server');

    socket.emit('createMsg', {
        to: 'Mehul',
        text: 'Bhai paise nhi h',
    });

});

socket.on('disconnect', function () {
    console.log('Disonnected from server');
});

socket.on('newMsg', function (msg) {
    console.log('New Message', msg);
});
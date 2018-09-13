const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

var app = express();

const publicPath = path.join(__dirname,'../public');

const port = process.env.PORT || 3000;

var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New User connected');

    socket.emit('newMsg',{
        from: 'Mehul',
        text: 'Please transfer the rent',
        createAt: 123
    });

    socket.on('createMsg', (newMsg) => {
        console.log('createMsg', newMsg );
    });

    socket.on('disconnect', () => {
        console.log('Disonnected from server')
    });

})

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Server is up on the port ${port}`);
});

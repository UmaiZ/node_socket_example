const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


var rooms = [
    {
        'roomID': 1,
        'chats': [
            {
                'message': 'Hey',
                'username': 'Arooba'
            },
            {
                'message': 'How Are you',
                'username': 'Sana'
            }
        ]
    },
    {
        'roomID': 2,
        'chats': [
            {
                'message': 'Hey',
                'username': 'Arooba'
            },
            {
                'message': 'How Are you',
                'username': 'Sana'
            }
        ]
    }
];


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('getRoomChats', async (msg) => {
        console.log(msg);
        io.emit('messagerecieved', rooms.filter(x => x.roomID == msg.roomID)[0]);
    });

    socket.on('sendMessage', async (msg) => {
        console.log(msg);
        console.log(rooms.filter(x => x.roomID == msg.roomID));
        rooms.filter(x => x.roomID == msg.roomID)[0].chats.push({
            'message': msg.message,
            'username': msg.username
        })
        io.emit('messagerecieved', rooms[0]);
    });

});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
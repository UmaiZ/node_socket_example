const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require("mongoose")
const { Rooms } = require('./chatschema')
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())



app.post('/createroom', async (req, res) => {
    const createRoom = Rooms({
        partner1: req.body.partner1,
        partner2: req.body.partner2,
    })
    const creating = await createRoom.save()

    return res.status(200).json({ 'success': true, 'match': true, 'message': 'Success', data: creating, })
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('getRoomChats', async (msg) => {
        const getroomchat = await Rooms.findById(msg.roomid);
        io.emit('messagerecieved', getroomchat.chats);
    });

    socket.on('messageseen', async (msg) => {
        console.log(msg.roomid)
        const sendMessagetoRoom = await Rooms.findOneAndUpdate(
            { _id: msg.roomid, 'chats.partner': msg.partner },
            { 'chats.$.lastSeen': true },
            { new: true }
        );

        if (sendMessagetoRoom) {
            io.emit('messagerecieved', sendMessagetoRoom.chats);
        }

        // Rooms.findOne({ _id: msg.roomid }).then(async doc => {
        //     for (let i = 0; i < doc.chats.length; i++) {
        //         if (doc.chats[i].partner == msg.partner) {
        //             doc.chats[i].lastSeen = true;
        //         }
        //     }
        //     const sendMessagetoRoom = await Rooms.findByIdAndUpdate(msg.roomid, {
        //         chats: doc.chats
        //     }, {
        //         new: true
        //     })
        //     io.emit('messagerecieved', sendMessagetoRoom.chats);

        // }).catch(err => {
        //     console.log(err)
        // });
    });

    socket.on('sendMessage', async (msg) => {
        const sendMessagetoRoom = await Rooms.findByIdAndUpdate(msg.roomid, {
            $push: {
                chats: {
                    "message": msg.message,
                    "messagetype": msg.messagetype,
                    "partner": msg.partner,
                }
            }
        }, {
            new: true
        })

        io.emit('messagerecieved', sendMessagetoRoom.chats);
    });

});


mongoose.connect("mongodb+srv://umaiz:node@cluster0.ojrgi.mongodb.net/interact-dev", {
    dbName: 'chata-data'
})
    .then(() => {
        console.log("database connected");
    })
    .catch(() => {
        console.log("database not connected");
    })


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});



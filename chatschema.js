const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    partner1: {
        type: String,
        required: true
    },
    partner2: {
        type: String,
        required: true
    },
    chats:
        [
            {
                "message": {
                    type: String
                },
                "messagetype": {
                    type: Number,
                    //0: Text 1: Image 2: Video 3:Audio
                },
                "lastSeen": {
                    type: Boolean,
                    default: false
                },
                "time": {
                    type: Date,
                    default: Date.now
                },
                "partner": {
                    type: String,
                    required: true
                },
            }

        ]
})


exports.Rooms = mongoose.model('rooms', chatRoomSchema);
exports.chatRoomSchema = chatRoomSchema;
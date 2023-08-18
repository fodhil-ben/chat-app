const socketIo = require('socket.io')

function InitServer(server) {
    const io = socketIo(server, {
        cors: {
            origin: process.env.NODE_ENV !== 'production' ? "http://localhost:5173" : "https://chat-app-i3zg.onrender.com"
        }
    })
    io.on('connection', (socket) => {
        console.log('new user connected')

        // event on - join room - when the user select a group chat 
        // on the client when the user select it we emit with credentials to join the room
        //cred => group_id, user_id

        // event on - send message - when the user send a message check if the user is in that room
        // on client when the user send a message we emit with creds
        // creds => message, sender_id, group_id

        //setup 
        socket.on('setup', (user_id) => {
            socket.join(user_id)
            console.log('new user connected: ', user_id)
            // socket.emit('connected')
        })

        socket.on('join room', (group_id) => {
            socket.join(group_id)
            console.log('User joined room: ', group_id)
        })


        socket.on('new message', (messageData) => {
            //message contains the sender and the group_id and the group members
            //check if the user in the room


            // socket.in(messageData.group_id).emit("message recieved", messageData)
            console.log(messageData)
            socket.to(messageData.group_id).emit("message received", messageData)
        })


        //handle disconnection
        socket.off('setup', () => {
            console.log('user disconnected')
            socket.leave(user.id)
        })
    })

}

module.exports = InitServer
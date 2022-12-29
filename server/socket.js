const actions = require("./src/utils/socketTypes.js")

let users = [];


const myScoket = (io) => {

    io.on('connection', (client) => {
        // add users
        client.on(actions.ADD_USERS, (_id) => {
            !users.some((user) => user.socketId === client.id) &&
                users.push({ _id, socketId: client.id });
            io.emit(actions.GET_ONLINE_USERS, users);
        });


        // email confirmation
        client.on(actions.EMAIL_CONFIRMED, message => {
            for (let i = 0; i < users.length; i++) {
                const e = users[i];
                if (e._id === message._id && e.socketId !== client.id) {
                    console.log(e.socketId);
                    io.to(e.socketId).emit(actions.EMAIL_CONFIRMED, {
                        verfied: message.verified,
                        _id: message._id,
                        email: message.email
                    })
                    break;
                }
            }
        })

        // on disconnect
        client.on('disconnect', () => {
            users = users.filter((user) => user.socketId !== client.id);
            io.emit(actions.ADD_USERS, users);
            console.log('user disconnected');
        });
    });
}
module.exports = myScoket
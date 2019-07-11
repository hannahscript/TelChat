const fs = require('fs');
const net = require('net');
const User = require('./user.js');
const curses = require('./curses');

const PORT = process.env.port || 8000;

const MAX_LOG_SIZE = 10;
const SERVER_ID = -1;
const INPUT_ROW = MAX_LOG_SIZE + 2;
class TelchatServer {
    constructor() {
        this.id = 0;
        this.users = {};
        this.log = [];
    }

    getNextId() {
        return this.id++;
    }

    getUser(id) {
        return this.users[id];
    }

    getAllUsers() {
        return Object.values(this.users);
    }

    addToLog(text) {
        this.log.push(text);

        if (this.log.length > MAX_LOG_SIZE) {
            this.log.shift();
        }
    }

    broadcast(id, text) {
        const prefix = id === SERVER_ID ? 'SERVER]' : (this.getUser(id).getName() + '>');
        this.addToLog(`${prefix} ${text}`);

        for (const user of this.getAllUsers()) {
            user.send(curses.storeCursor());
            for (let i = 0; i < this.log.length; i++) {
                user.send(curses.moveCursor(i, 0));
                user.send(curses.clearLine() + this.log[i]);
            }
            user.send(curses.loadCursor());
        }
    }

    isSendCommand(buffer) {
        return buffer.includes(13) && buffer.includes(10);
    }

    registerUser(socket) {
        const id = this.getNextId();
        this.users[id] = new User(id, socket);
        return this.users[id];
    }

    start() {
        const server = net.createServer(socket => this.onSocketConnected(socket));
        server.listen(PORT);
    }

    onDataReceived(user, data) {
        if (this.isSendCommand(data)) {
            const message = user.getAndClearBuffer();
            this.broadcast(user.getId(), message);
            user.send(curses.moveCursor(INPUT_ROW, 0));
            user.send(curses.clearLine());
        } else {
            user.addToBuffer(data);
        }
    }

    onSocketConnected(socket) {
        const user = this.registerUser(socket);
        this.broadcast(SERVER_ID, 'New user connected');

        user.send(curses.moveCursor(INPUT_ROW, 0));

        socket.on('data', data => this.onDataReceived(user, data));
    }    
}

new TelchatServer().start();

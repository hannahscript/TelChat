class User {
    constructor(id, socket) {
        this.id = id;
        this.socket = socket;
        this.name = 'user' + id;
        this.buffer = Buffer.alloc(0);
    }

    addToBuffer(buffer) {
        this.buffer = Buffer.concat([this.buffer, buffer]);
    }

    getAndClearBuffer() {
        const buffer = this.buffer;
        this.buffer = Buffer.alloc(0);
        return buffer;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    getId() {
        return this.id;
    }

    send(text) {
        this.socket.write(text);
    }
}

module.exports = User;
export default class ServerUser {
    socketId;
    username;
    color;
    constructor(username, socketId) {
        this.socketId = socketId;
        this.username = username;
    }
    getSocketId() {
        return this.socketId;
    }
    getUsername() {
        return this.username;
    }
    getColor() {
        return this.color;
    }
    setColor(color) {
        this.color = color;
    }
    getClientUser() {
        return { username: this.username, color: this.color };
    }
}

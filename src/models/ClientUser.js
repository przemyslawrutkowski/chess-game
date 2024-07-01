export default class ClientUser {
    username;
    color;
    constructor(username, color) {
        this.username = username;
        this.color = color;
    }
    getUsername() {
        return this.username;
    }
    getColor() {
        return this.color;
    }
}

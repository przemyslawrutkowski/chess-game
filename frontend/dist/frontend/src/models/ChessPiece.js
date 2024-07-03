export default class ChessPiece {
    id;
    user;
    movementStrategy;
    constructor(user, movementStrategy) {
        this.user = user;
        this.movementStrategy = movementStrategy;
        this.id = crypto.randomUUID();
    }
    getId() {
        return this.id;
    }
    getUser() {
        return this.user;
    }
    getMovementStrategy() {
        return this.movementStrategy;
    }
}

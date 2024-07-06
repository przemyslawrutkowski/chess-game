export default class ChessPiece {
    id;
    user;
    movementStrategy;
    constructor(id, user, movementStrategy) {
        this.id = id;
        this.user = user;
        this.movementStrategy = movementStrategy;
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

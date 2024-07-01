export default class ChessPiece {
    user;
    movementStrategy;
    constructor(user, movementStrategy) {
        this.user = user;
        this.movementStrategy = movementStrategy;
    }
    getUser() {
        return this.user;
    }
    getMovementStrategy() {
        return this.movementStrategy;
    }
}

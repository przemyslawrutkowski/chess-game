import crypto from 'crypto';
export default class ChessPiece {
    id;
    user;
    movementStrategy;
    isFirstMove;
    constructor(user, movementStrategy, isFirstMove = false) {
        this.user = user;
        this.movementStrategy = movementStrategy;
        this.id = crypto.randomUUID();
        this.isFirstMove = isFirstMove;
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
    getIsFirstMove() {
        return this.isFirstMove;
    }
    setIsFirstMove(isFirstMove) {
        this.isFirstMove = isFirstMove;
    }
}

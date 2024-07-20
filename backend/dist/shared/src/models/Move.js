export default class Move {
    oldPosition;
    newPosition;
    newMovementStrategy;
    constructor(oldPosition, newPosition, newMovementStrategy) {
        this.oldPosition = oldPosition;
        this.newPosition = newPosition;
        this.newMovementStrategy = newMovementStrategy;
    }
    getOldPosition() {
        return this.oldPosition;
    }
    getNewPosition() {
        return this.newPosition;
    }
    getNewMovementStrategy() {
        return this.newMovementStrategy;
    }
}

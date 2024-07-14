export default class Move {
    oldPosition;
    newPosition;
    constructor(oldPosition, newPosition) {
        this.oldPosition = oldPosition;
        this.newPosition = newPosition;
    }
    getOldPosition() {
        return this.oldPosition;
    }
    getNewPosition() {
        return this.newPosition;
    }
}

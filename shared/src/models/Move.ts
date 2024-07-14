import Position from "./Position.js";

export default class Move {
    private oldPosition: Position;
    private newPosition: Position;

    constructor(oldPosition: Position, newPosition: Position) {
        this.oldPosition = oldPosition;
        this.newPosition = newPosition;
    }

    public getOldPosition() {
        return this.oldPosition;
    }

    public getNewPosition() {
        return this.newPosition;
    }
}
import Position from "./Position.js";

export default class Move {
    protected oldPosition: Position;
    protected newPosition: Position;

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
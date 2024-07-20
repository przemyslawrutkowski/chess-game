import { MovementStrategy } from "../enums/MovementStrategy.js";
import Position from "./Position.js";

export default class Move {
    private oldPosition: Position;
    private newPosition: Position;
    private newMovementStrategy: MovementStrategy | null;

    constructor(oldPosition: Position, newPosition: Position, newMovementStrategy: MovementStrategy | null) {
        this.oldPosition = oldPosition;
        this.newPosition = newPosition;
        this.newMovementStrategy = newMovementStrategy;
    }

    public getOldPosition() {
        return this.oldPosition;
    }

    public getNewPosition() {
        return this.newPosition;
    }

    public getNewMovementStrategy() {
        return this.newMovementStrategy;
    }
}
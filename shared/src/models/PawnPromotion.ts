import Move from "./Move.js";
import Position from "./Position.js";
import { MovementStrategy } from "../enums/MovementStrategy.js";

export default class PawnPromotion extends Move {
    private newMovementStrategy: MovementStrategy;

    constructor(oldPosition: Position, newPosition: Position, newMovementStrategy: MovementStrategy) {
        super(oldPosition, newPosition);
        this.newMovementStrategy = newMovementStrategy;
    }

    public getNewMovementStrategy(): MovementStrategy {
        return this.newMovementStrategy;
    }
}
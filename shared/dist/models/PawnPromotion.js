import Move from "./Move.js";
export default class PawnPromotion extends Move {
    newMovementStrategy;
    constructor(oldPosition, newPosition, newMovementStrategy) {
        super(oldPosition, newPosition);
        this.newMovementStrategy = newMovementStrategy;
    }
    getNewMovementStrategy() {
        return this.newMovementStrategy;
    }
}

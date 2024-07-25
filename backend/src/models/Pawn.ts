import ServerUser from "./ServerUser.js";
import { MovementStrategy } from "../../../shared/src/enums/MovementStrategy.js";
import ChessPieceWithFirstMove from "./ChessPieceWithFirstMove.js";

export default class Pawn extends ChessPieceWithFirstMove {
    private wasPreviousMoveDouble: boolean;

    constructor(user: ServerUser, movementStrategy: MovementStrategy) {
        super(user, movementStrategy);
        this.wasPreviousMoveDouble = false;
    }

    public getWasPreviousMoveDouble(): boolean {
        return this.wasPreviousMoveDouble;
    }

    public setWasPreviousMoveDouble(wasPreviousMoveDouble: boolean): void {
        this.wasPreviousMoveDouble = wasPreviousMoveDouble;
    }
}
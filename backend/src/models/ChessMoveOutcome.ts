import { MoveType } from "../../../shared/src/enums/MoveType.js";

export default class ChessMoveOutCome {
    private moveType: MoveType;
    private scoreIncrease: number;
    private capturedPieceId: string | undefined;

    constructor(moveType: MoveType, scoreIncrease: number, capturedPieceId: string | undefined) {
        this.moveType = moveType;
        this.scoreIncrease = scoreIncrease;
        this.capturedPieceId = capturedPieceId;
    }

    public getMoveType(): MoveType {
        return this.moveType;
    }

    public getScoreIncrease(): number {
        return this.scoreIncrease;
    }

    public getCapturedPieceId(): string | undefined {
        return this.capturedPieceId;
    }
}
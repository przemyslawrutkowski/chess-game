import Position from "../../../shared/src/models/Position.js";
import { MoveType } from "../../../shared/src/enums/MoveType.js";
import ClientUser from "./ClientUser.js";
import Score from "../../../shared/src/models/Score.js";

export default class MoveResult {
    chessPieceId: string;
    oldPostion: Position;
    newPosition: Position;
    moveType: MoveType;
    score: Score;
    whoseTurn: ClientUser;
    capturedPieceId?: string;

    constructor(chessPieceId: string, oldPostion: Position, newPosition: Position, moveType: MoveType, score: Score, whoseTurn: ClientUser, capturedPieceId?: string) {
        this.chessPieceId = chessPieceId;
        this.oldPostion = oldPostion;
        this.newPosition = newPosition;
        this.moveType = moveType;
        this.score = score;
        this.whoseTurn = whoseTurn;
        this.capturedPieceId = capturedPieceId;
    }

    public getChessPieceId(): string {
        return this.chessPieceId;
    }

    public getOldPosition(): Position {
        return this.oldPostion;
    }

    public getNewPosition(): Position {
        return this.newPosition;
    }

    public getMoveType(): MoveType {
        return this.moveType;
    }

    public getScore(): Score {
        return this.score;
    }

    public getWhoseTurn(): ClientUser {
        return this.whoseTurn;
    }

    public getCapturedPieceId(): string | undefined {
        return this.capturedPieceId;
    }
}
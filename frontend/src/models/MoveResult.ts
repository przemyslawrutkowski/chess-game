import Position from "../../../shared/src/models/Position.js";
import { MoveType } from "../../../shared/src/enums/MoveType.js";
import ClientUser from "./ClientUser.js";
import Score from "../../../shared/src/models/Score.js";

export default class MoveResult {
    oldPostion: Position;
    newPosition: Position;
    score: Score;
    whoseTurn: ClientUser;

    constructor(oldPostion: Position, newPosition: Position, score: Score, whoseTurn: ClientUser) {
        this.oldPostion = oldPostion;
        this.newPosition = newPosition;
        this.score = score;
        this.whoseTurn = whoseTurn;
    }

    public getOldPosition(): Position {
        return this.oldPostion;
    }

    public getNewPosition(): Position {
        return this.newPosition;
    }

    public getScore(): Score {
        return this.score;
    }

    public getWhoseTurn(): ClientUser {
        return this.whoseTurn;
    }
}
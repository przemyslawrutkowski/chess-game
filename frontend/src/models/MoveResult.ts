import Position from "../../../shared/src/models/Position.js";
import { MoveType } from "../../../shared/src/enums/MoveType.js";
import ClientUser from "./ClientUser.js";
import Score from "../../../shared/src/models/Score.js";
import { GameState } from "../../../shared/src/enums/GameState.js";

export default class MoveResult {
    oldPostion: Position;
    newPosition: Position;
    score: Score;
    currentOrWinningPlayer: ClientUser | null;
    gameState: GameState;

    constructor(oldPostion: Position, newPosition: Position, score: Score, currentOrWinningPlayer: ClientUser | null, gameState: GameState) {
        this.oldPostion = oldPostion;
        this.newPosition = newPosition;
        this.score = score;
        this.currentOrWinningPlayer = currentOrWinningPlayer;
        this.gameState = gameState;
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

    public getCurrentOrWinningPlayer(): ClientUser | null {
        return this.currentOrWinningPlayer;
    }

    public getGameState(): GameState {
        return this.gameState;
    }
}
import Position from "../../../shared/src/models/Position.js";
import ClientUser from "./ClientUser.js";
import Score from "../../../shared/src/models/Score.js";
import { GameState } from "../../../shared/src/enums/GameState.js";
import { MovementStrategy } from "../../../shared/src/enums/MovementStrategy.js";

export default class MoveResult {
    oldPostion: Position;
    newPosition: Position;
    score: Score;
    currentOrWinningPlayer: ClientUser | null;
    gameState: GameState;
    newMovementStrategy: MovementStrategy | null;

    constructor(oldPostion: Position, newPosition: Position, score: Score, currentOrWinningPlayer: ClientUser | null, gameState: GameState, newMovementStrategy: MovementStrategy | null) {
        this.oldPostion = oldPostion;
        this.newPosition = newPosition;
        this.score = score;
        this.currentOrWinningPlayer = currentOrWinningPlayer;
        this.gameState = gameState;
        this.newMovementStrategy = newMovementStrategy;
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

    public getNewMovementStrategy(): MovementStrategy | null {
        return this.newMovementStrategy;
    }
}
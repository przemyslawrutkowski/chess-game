import ClientUser from "./ClientUser.js";
import Score from "../../../shared/src/models/Score.js";
import { GameState } from "../../../shared/src/enums/GameState.js";
import Move from "../../../shared/src/models/Move.js";

export default class MoveResult {
    move: Move;
    score: Score;
    currentOrWinningPlayer: ClientUser | null;
    gameState: GameState;

    constructor(move: Move, score: Score, currentOrWinningPlayer: ClientUser | null, gameState: GameState) {
        this.move = move;
        this.score = score;
        this.currentOrWinningPlayer = currentOrWinningPlayer;
        this.gameState = gameState;
    }

    public getMove(): Move {
        return this.move;
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
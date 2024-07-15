import ClientUser from "./ClientUser.js";
import { Chessboard } from "../types/Chessboard.js";
import { GameState } from "../../../shared/src/enums/GameState.js";

export default class ClientGame {
    private user1: ClientUser;
    private user2: ClientUser;
    private chessboard: Chessboard;
    private whoseTurn: ClientUser;
    private gameState: GameState;

    constructor(user1: ClientUser, user2: ClientUser, chessboard: Chessboard, whoseTurn: ClientUser, gameState: GameState) {
        this.user1 = user1;
        this.user2 = user2;
        this.chessboard = chessboard;
        this.whoseTurn = whoseTurn;
        this.gameState = gameState;
    }

    public getUser1(): ClientUser {
        return this.user1;
    }

    public getUser2(): ClientUser {
        return this.user2;
    }

    public getChessboard(): Chessboard {
        return this.chessboard;
    }

    public getWhoseTurn(): ClientUser {
        return this.whoseTurn;
    }

    public getGameState(): GameState {
        return this.gameState;
    }
}
import ClientUser from "./ClientUser.js";
import { Chessboard } from "../types/Chessboard.js";

export default class ServerGame {
    private user1: ClientUser;
    private user2: ClientUser;
    private chessboard: Chessboard;
    private whoseTurn: ClientUser;

    constructor(user1: ClientUser, user2: ClientUser, chessboard: Chessboard, whoseTurn: ClientUser) {
        this.user1 = user1;
        this.user2 = user2;
        this.chessboard = chessboard;
        this.whoseTurn = whoseTurn;
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
}
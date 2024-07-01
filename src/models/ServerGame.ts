import ServerUser from "./ServerUser.js";
import ChessPiece from "./ChessPiece.js";
import ClientGame from "./ClientGame.js";
import { Chessboard } from "../types/Chessboard.js";

export default class ServerGame {
    private user1: ServerUser;
    private user2: ServerUser;
    private chessboard: Chessboard;
    private whoseTurn: ServerUser;
    private clientGame: ClientGame;

    constructor(user1: ServerUser, user2: ServerUser, chessboard: Chessboard) {
        this.user1 = user1;
        this.user2 = user2;
        this.chessboard = chessboard;
        this.whoseTurn = user1;
        this.clientGame = this.setClientGame();
    }

    public getUser1(): ServerUser {
        return this.user1;
    }

    public getUser2(): ServerUser {
        return this.user2;
    }

    public getChessboard(): Chessboard {
        return this.chessboard;
    }

    public getWhoseTurn(): ServerUser {
        return this.whoseTurn;
    }

    public getClientGame(): ClientGame {
        return this.clientGame;
    }

    private setClientGame(): ClientGame {
        const clientUser1 = this.user1.getClientUser();
        const clientUser2 = this.user2.getClientUser();
        const clientChessboard = this.chessboard.map(row =>
            row.map(piece => {
                if (piece) {
                    const pieceOwner = piece.getUser();
                    if (pieceOwner instanceof ServerUser) {
                        return new ChessPiece(pieceOwner.getClientUser(), piece.getMovementStrategy());
                    }
                    return null;
                }
                return null;
            })
        );
        const whoseTurn = this.whoseTurn.getClientUser();
        return new ClientGame(clientUser1, clientUser2, clientChessboard, whoseTurn);
    }
}
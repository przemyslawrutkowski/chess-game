import ServerUser from "./ServerUser.js";
import ChessPiece from "./ChessPiece.js";
import ClientGame from "./ClientGame.js";
import ChessboardCell from "./ChessboardCell.js";
export default class ServerGame {
    user1;
    user2;
    chessboard;
    whoseTurn;
    clientGame;
    constructor(user1, user2, chessboard) {
        this.user1 = user1;
        this.user2 = user2;
        this.chessboard = chessboard;
        this.whoseTurn = user1;
        this.clientGame = this.setClientGame();
    }
    getUser1() {
        return this.user1;
    }
    getUser2() {
        return this.user2;
    }
    getChessboard() {
        return this.chessboard;
    }
    getWhoseTurn() {
        return this.whoseTurn;
    }
    getClientGame() {
        return this.clientGame;
    }
    setClientGame() {
        const clientUser1 = this.user1.getClientUser();
        const clientUser2 = this.user2.getClientUser();
        const clientChessboard = this.chessboard.map(row => row.map(cell => {
            const chessPiece = cell.getChessPiece();
            if (chessPiece) {
                const owner = chessPiece.getUser();
                if (owner instanceof ServerUser) {
                    const clientChessPiece = new ChessPiece(owner.getClientUser(), chessPiece.getMovementStrategy());
                    return new ChessboardCell(cell.getXPosition(), cell.getYPosition(), clientChessPiece);
                }
            }
            return new ChessboardCell(cell.getXPosition(), cell.getYPosition(), null);
        }));
        const whoseTurn = this.whoseTurn.getClientUser();
        return new ClientGame(clientUser1, clientUser2, clientChessboard, whoseTurn);
    }
}

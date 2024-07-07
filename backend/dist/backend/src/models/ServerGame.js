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
            let chessPieceDTO = null;
            if (chessPiece) {
                const owner = chessPiece.getUser();
                chessPieceDTO = {
                    id: chessPiece.getId(),
                    user: owner.getClientUser(),
                    movementStrategy: chessPiece.getMovementStrategy()
                };
            }
            return {
                xPosition: cell.getXPosition(),
                yPosition: cell.getYPosition(),
                chessPiece: chessPieceDTO
            };
        }));
        const whoseTurn = this.whoseTurn.getClientUser();
        return {
            user1: clientUser1,
            user2: clientUser2,
            chessboard: clientChessboard,
            whoseTurn: whoseTurn
        };
    }
}

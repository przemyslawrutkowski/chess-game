import Score from "../../../shared/src/models/Score.js";
import { PlayerColor } from "../../../shared/src/enums/PlayerColor.js";
export default class ServerGame {
    user1;
    user2;
    chessboard;
    whoseTurn;
    score;
    clientGame;
    constructor(user1, user2, chessboard) {
        this.user1 = user1;
        this.user2 = user2;
        this.chessboard = chessboard;
        this.whoseTurn = user1;
        this.score = new Score(0, 0);
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
        const score = this.getClientScore();
        return {
            user1: clientUser1,
            user2: clientUser2,
            chessboard: clientChessboard,
            whoseTurn: whoseTurn,
            score: score
        };
    }
    switchTurn() {
        this.whoseTurn = this.whoseTurn === this.user1 ? this.user2 : this.user1;
        this.clientGame = this.setClientGame();
    }
    getClientScore() {
        return { lightScore: this.score.getLightScore(), darkScore: this.score.getDarkScore() };
    }
    increaseScore(score) {
        this.whoseTurn.getColor() === PlayerColor.Light ? this.score.increaseLightScore(score) : this.score.increaseDarkScore(score);
        this.clientGame = this.setClientGame();
    }
}

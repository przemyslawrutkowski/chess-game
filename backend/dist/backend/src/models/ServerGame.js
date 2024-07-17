import Score from "../../../shared/src/models/Score.js";
import { PlayerColor } from "../../../shared/src/enums/PlayerColor.js";
import { GameState } from "../../../shared/src/enums/GameState.js";
export default class ServerGame {
    user1;
    user2;
    chessboard;
    currentOrWinningPlayer;
    score;
    gameState;
    constructor(user1, user2, chessboard) {
        this.user1 = user1;
        this.user2 = user2;
        this.chessboard = chessboard;
        this.currentOrWinningPlayer = user1;
        this.score = new Score(0, 0);
        this.gameState = GameState.InProgress;
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
    getCurrentOrWinningPlayer() {
        return this.currentOrWinningPlayer;
    }
    getClientGame() {
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
        const currentOrWinningPlayer = this.currentOrWinningPlayer.getClientUser();
        const score = this.getClientScore();
        return {
            user1: clientUser1,
            user2: clientUser2,
            chessboard: clientChessboard,
            whoseTurn: currentOrWinningPlayer,
            score: score,
            gameState: this.gameState
        };
    }
    updateCurrentPlayerOrWinner(gameState) {
        switch (gameState) {
            case GameState.Stalemate:
                this.gameState = gameState;
                this.currentOrWinningPlayer = null;
                break;
            case GameState.Checkmate:
                this.gameState = gameState;
                break;
            case GameState.InProgress:
                this.currentOrWinningPlayer = this.currentOrWinningPlayer === this.user1 ? this.user2 : this.user1;
                break;
        }
    }
    getClientScore() {
        return { lightScore: this.score.getLightScore(), darkScore: this.score.getDarkScore() };
    }
    increaseScore(score) {
        if (this.currentOrWinningPlayer) {
            this.currentOrWinningPlayer.getColor() === PlayerColor.Light ? this.score.increaseLightScore(score) : this.score.increaseDarkScore(score);
        }
    }
}

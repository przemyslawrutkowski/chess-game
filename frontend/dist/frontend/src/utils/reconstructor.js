import ClientUser from '../../src/models/ClientUser.js';
import ChessPiece from '../../src/models/ChessPiece.js';
import ChessboardCell from '../../src/models/ChessboardCell.js';
import ClientGame from '../../src/models/ClientGame.js';
import MoveResult from '../../src/models/MoveResult.js';
import Position from '../../../shared/src/models/Position.js';
import Score from '../../../shared/src/models/Score.js';
export function reconstructGame(game) {
    const user1 = game.user1;
    const user2 = game.user2;
    const chessboard = game.chessboard;
    const whoseTurn = game.whoseTurn;
    const gameState = game.gameState;
    const reconstructedUser1 = new ClientUser(user1.username, user1.color);
    const reconstructedUser2 = new ClientUser(user2.username, user2.color);
    const reconstructedChessboard = chessboard.map(row => row.map(cell => {
        const chessPiece = cell.chessPiece;
        if (chessPiece) {
            const owner = chessPiece.user;
            const reconstructedOwner = new ClientUser(owner.username, owner.color);
            const reconstructedChessPiece = new ChessPiece(chessPiece.id, reconstructedOwner, chessPiece.movementStrategy);
            return new ChessboardCell(cell.xPosition, cell.yPosition, reconstructedChessPiece);
        }
        return new ChessboardCell(cell.xPosition, cell.yPosition, null);
    }));
    const reconstructedWhoseTurn = new ClientUser(whoseTurn.username, whoseTurn.color);
    return new ClientGame(reconstructedUser1, reconstructedUser2, reconstructedChessboard, reconstructedWhoseTurn, gameState);
}
export function reconstructMoveResult(moveResult) {
    const oldPosition = moveResult.oldPostion;
    const newPosition = moveResult.newPosition;
    const score = moveResult.score;
    const currentOrWinningPlayer = moveResult.currentOrWinningPlayer;
    const gameState = moveResult.gameState;
    const reconstructedOldPosition = new Position(oldPosition.x, oldPosition.y);
    const reconstructedNewPosition = new Position(newPosition.x, newPosition.y);
    const reconstructedScore = new Score(score.lightScore, score.darkScore);
    const reconstructedCurrentOrWinningPlayer = currentOrWinningPlayer ? new ClientUser(currentOrWinningPlayer.username, currentOrWinningPlayer.color) : null;
    return new MoveResult(reconstructedOldPosition, reconstructedNewPosition, reconstructedScore, reconstructedCurrentOrWinningPlayer, gameState);
}

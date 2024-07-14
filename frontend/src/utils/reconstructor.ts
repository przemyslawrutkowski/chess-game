import { GameDTO, UserDTO, ChessboardDTO, MoveResultDTO, PositionDTO, ScoreDTO } from '../../../shared/src/interfaces/DTO.js';
import ClientUser from '../../src/models/ClientUser.js';
import ChessPiece from '../../src/models/ChessPiece.js';
import ChessboardCell from '../../src/models/ChessboardCell.js';
import ClientGame from '../../src/models/ClientGame.js';
import MoveResult from '../../src/models/MoveResult.js';
import { MoveType } from '../../../shared/src/enums/MoveType.js';
import Position from '../../../shared/src/models/Position.js';
import Score from '../../../shared/src/models/Score.js';


export function reconstructGame(game: GameDTO): ClientGame {
    const user1: UserDTO = game.user1;
    const user2: UserDTO = game.user2;
    const chessboard: ChessboardDTO = game.chessboard;
    const whoseTurn: UserDTO = game.whoseTurn;

    const reconstructedUser1 = new ClientUser(user1.username, user1.color);
    const reconstructedUser2 = new ClientUser(user2.username, user2.color);
    const reconstructedChessboard = chessboard.map(row =>
        row.map(cell => {
            const chessPiece = cell.chessPiece;
            if (chessPiece) {
                const owner = chessPiece.user;
                const reconstructedOwner = new ClientUser(owner.username, owner.color);
                const reconstructedChessPiece = new ChessPiece(chessPiece.id, reconstructedOwner, chessPiece.movementStrategy);
                return new ChessboardCell(cell.xPosition, cell.yPosition, reconstructedChessPiece);
            }
            return new ChessboardCell(cell.xPosition, cell.yPosition, null);
        })
    );
    const reconstructedWhoseTurn = new ClientUser(whoseTurn.username, whoseTurn.color);
    return new ClientGame(reconstructedUser1, reconstructedUser2, reconstructedChessboard, reconstructedWhoseTurn);
}

export function reconstructMoveResult(moveResult: MoveResultDTO): MoveResult {
    const oldPosition: PositionDTO = moveResult.oldPostion;
    const newPosition: PositionDTO = moveResult.newPosition;
    const score: ScoreDTO = moveResult.score;
    const whoseTurn: UserDTO = moveResult.whoseTurn;

    const reconstructedOldPosition = new Position(oldPosition.x, oldPosition.y);
    const reconstructedNewPosition = new Position(newPosition.x, newPosition.y);
    const reconstructedWhoseTurn = new ClientUser(whoseTurn.username, whoseTurn.color);
    const reconstructedScore = new Score(score.lightScore, score.darkScore);
    return new MoveResult(reconstructedOldPosition, reconstructedNewPosition, reconstructedScore, reconstructedWhoseTurn);
}
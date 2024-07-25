import { GameDTO, UserDTO, ChessboardDTO, MoveResultDTO, PositionDTO, ScoreDTO } from '../../../shared/src/interfaces/DTO.js';
import ClientUser from '../../src/models/ClientUser.js';
import ChessPiece from '../../src/models/ChessPiece.js';
import ChessboardCell from '../../src/models/ChessboardCell.js';
import ClientGame from '../../src/models/ClientGame.js';
import MoveResult from '../../src/models/MoveResult.js';
import Position from '../../../shared/src/models/Position.js';
import Score from '../../../shared/src/models/Score.js';
import { GameState } from '../../../shared/src/enums/GameState.js';
import Move from '../../../shared/src/models/Move.js';
import { MoveDTO, EnPassantDTO, PawnPromotionDTO, CastlingDTO } from '../../../shared/src/interfaces/DTO.js';
import PawnPromotion from '../../../shared/src/models/PawnPromotion.js';
import EnPassant from '../../../shared/src/models/EnPassant.js';
import Castling from '../../../shared/src/models/Castling.js';


export function reconstructGame(game: GameDTO): ClientGame {
    const user1: UserDTO = game.user1;
    const user2: UserDTO = game.user2;
    const chessboard: ChessboardDTO = game.chessboard;
    const whoseTurn: UserDTO = game.whoseTurn;
    const gameState: GameState = game.gameState;

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
    return new ClientGame(reconstructedUser1, reconstructedUser2, reconstructedChessboard, reconstructedWhoseTurn, gameState);
}

function isPawnPromotionDTO(move: MoveDTO | PawnPromotionDTO | EnPassantDTO): move is PawnPromotionDTO {
    return (move as PawnPromotionDTO).newMovementStrategy !== undefined;
}

function isEnPassantDTO(move: MoveDTO | PawnPromotionDTO | EnPassantDTO): move is EnPassantDTO {
    return (move as EnPassantDTO).enPassantPosition !== undefined;
}

function isCastlingDTO(move: MoveDTO | PawnPromotionDTO | EnPassantDTO): move is CastlingDTO {
    return (move as CastlingDTO).rookOldPosition !== undefined && (move as CastlingDTO).rookNewPosition !== undefined;

}

export function reconstructMoveResult(moveResult: MoveResultDTO): MoveResult {
    const move: MoveDTO = moveResult.move;
    const score: ScoreDTO = moveResult.score;
    const currentOrWinningPlayer: UserDTO | null = moveResult.currentOrWinningPlayer;
    const gameState: GameState = moveResult.gameState;

    let reconstructedMove: Move | PawnPromotion | EnPassant = new Move(new Position(move.oldPosition.x, move.oldPosition.y), new Position(move.newPosition.x, move.newPosition.y));
    if (isPawnPromotionDTO(move)) {
        reconstructedMove = new PawnPromotion(new Position(move.oldPosition.x, move.oldPosition.y), new Position(move.newPosition.x, move.newPosition.y), move.newMovementStrategy);
    } else if (isEnPassantDTO(move)) {
        reconstructedMove = new EnPassant(new Position(move.oldPosition.x, move.oldPosition.y), new Position(move.newPosition.x, move.newPosition.y), new Position(move.enPassantPosition.x, move.enPassantPosition.y));
    } else if (isCastlingDTO(move)) {
        reconstructedMove = new Castling(new Position(move.oldPosition.x, move.oldPosition.y), new Position(move.newPosition.x, move.newPosition.y), new Position(move.rookOldPosition.x, move.rookOldPosition.y), new Position(move.rookNewPosition.x, move.rookNewPosition.y));
    }

    const reconstructedScore = new Score(score.lightScore, score.darkScore);
    const reconstructedCurrentOrWinningPlayer = currentOrWinningPlayer ? new ClientUser(currentOrWinningPlayer.username, currentOrWinningPlayer.color) : null;

    return new MoveResult(reconstructedMove, reconstructedScore, reconstructedCurrentOrWinningPlayer, gameState);
}
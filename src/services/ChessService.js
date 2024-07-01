import ChessPiece from "../models/ChessPiece.js";
import { PlayerColor } from "../enums/PlayerColor.js";
import { MovementStrategy } from "../enums/MovementStrategy.js";
export default class ChessService {
    initilizeChessboard(user1, user2) {
        user1.setColor(PlayerColor.Light);
        user2.setColor(PlayerColor.Dark);
        const chessboard = Array(8).fill(null).map(() => Array(8).fill(null));
        // Initialize pawns
        for (let i = 0; i < 8; i++) {
            chessboard[1][i] = new ChessPiece(user1, MovementStrategy.PawnMovement);
            chessboard[6][i] = new ChessPiece(user2, MovementStrategy.PawnMovement);
        }
        // Initialize knights
        chessboard[0][1] = new ChessPiece(user1, MovementStrategy.KnightMovement);
        chessboard[0][6] = new ChessPiece(user1, MovementStrategy.KnightMovement);
        chessboard[7][1] = new ChessPiece(user2, MovementStrategy.KnightMovement);
        chessboard[7][6] = new ChessPiece(user2, MovementStrategy.KnightMovement);
        // Initialize bishops
        chessboard[0][2] = new ChessPiece(user1, MovementStrategy.BishopMovement);
        chessboard[0][5] = new ChessPiece(user1, MovementStrategy.BishopMovement);
        chessboard[7][2] = new ChessPiece(user2, MovementStrategy.BishopMovement);
        chessboard[7][5] = new ChessPiece(user2, MovementStrategy.BishopMovement);
        // Initialize rooks
        chessboard[0][0] = new ChessPiece(user1, MovementStrategy.RookMovement);
        chessboard[0][7] = new ChessPiece(user1, MovementStrategy.RookMovement);
        chessboard[7][0] = new ChessPiece(user2, MovementStrategy.RookMovement);
        chessboard[7][7] = new ChessPiece(user2, MovementStrategy.RookMovement);
        // Initialize queen
        chessboard[0][3] = new ChessPiece(user1, MovementStrategy.QueenMovement);
        chessboard[7][3] = new ChessPiece(user2, MovementStrategy.QueenMovement);
        // Initialize king
        chessboard[0][4] = new ChessPiece(user1, MovementStrategy.KingMovement);
        chessboard[7][4] = new ChessPiece(user2, MovementStrategy.KingMovement);
        return chessboard;
    }
    getPossibleMoves(chessPiece, chessboard) {
        return [];
    }
}

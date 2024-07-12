import ChessPiece from "../models/ChessPiece.js";
import { PlayerColor } from "../../../shared/src/enums/PlayerColor.js";
import { MovementStrategy } from "../../../shared/src/enums/MovementStrategy.js";
import ChessboardCell from "../models/ChessboardCell.js";
import Position from "../../../shared/src/models/Position.js";
import { MoveType } from "../../../shared/src/enums/MoveType.js";
import ChessMoveInfo from "../models/ChessMoveInfo.js";
export default class ChessService {
    static instance;
    constructor() { }
    static getInstance() {
        if (!ChessService.instance) {
            ChessService.instance = new ChessService();
        }
        return ChessService.instance;
    }
    initilizeChessboard(user1, user2) {
        user1.setColor(PlayerColor.Light);
        user2.setColor(PlayerColor.Dark);
        let chessboard = Array.from({ length: 8 }, (_, x) => {
            return Array.from({ length: 8 }, (_, y) => {
                return new ChessboardCell(x, y, null);
            });
        });
        // Initialize pawns
        for (let y = 0; y < 8; y++) {
            chessboard[1][y].setChessPiece(new ChessPiece(user1, MovementStrategy.PawnMovement, true));
            chessboard[6][y].setChessPiece(new ChessPiece(user2, MovementStrategy.PawnMovement, true));
        }
        // Initialize knights
        chessboard[0][1].setChessPiece(new ChessPiece(user1, MovementStrategy.KnightMovement));
        chessboard[0][6].setChessPiece(new ChessPiece(user1, MovementStrategy.KnightMovement));
        chessboard[7][1].setChessPiece(new ChessPiece(user2, MovementStrategy.KnightMovement));
        chessboard[7][6].setChessPiece(new ChessPiece(user2, MovementStrategy.KnightMovement));
        // Initialize bishops
        chessboard[0][2].setChessPiece(new ChessPiece(user1, MovementStrategy.BishopMovement));
        chessboard[0][5].setChessPiece(new ChessPiece(user1, MovementStrategy.BishopMovement));
        chessboard[7][2].setChessPiece(new ChessPiece(user2, MovementStrategy.BishopMovement));
        chessboard[7][5].setChessPiece(new ChessPiece(user2, MovementStrategy.BishopMovement));
        // Initialize rooks
        chessboard[0][0].setChessPiece(new ChessPiece(user1, MovementStrategy.RookMovement));
        chessboard[0][7].setChessPiece(new ChessPiece(user1, MovementStrategy.RookMovement));
        chessboard[7][0].setChessPiece(new ChessPiece(user2, MovementStrategy.RookMovement));
        chessboard[7][7].setChessPiece(new ChessPiece(user2, MovementStrategy.RookMovement));
        // Initialize queen
        chessboard[0][3].setChessPiece(new ChessPiece(user1, MovementStrategy.QueenMovement));
        chessboard[7][3].setChessPiece(new ChessPiece(user2, MovementStrategy.QueenMovement));
        // Initialize king
        chessboard[0][4].setChessPiece(new ChessPiece(user1, MovementStrategy.KingMovement));
        chessboard[7][4].setChessPiece(new ChessPiece(user2, MovementStrategy.KingMovement));
        return chessboard;
    }
    isPositionValid(position) {
        return position.getX() >= 0 && position.getX() < 8 && position.getY() >= 0 && position.getY() < 8;
    }
    cloneChessboard(chessboard) {
        return chessboard.map(row => row.map(cell => {
            return new ChessboardCell(cell.getXPosition(), cell.getYPosition(), cell.getChessPiece());
        }));
    }
    getChessPieceAtPosition(position, chessboard) {
        return chessboard[position.getX()][position.getY()].getChessPiece();
    }
    setChessPieceAtPosition(oldPosition, newPosition, chessboard) {
        const oldCell = chessboard[oldPosition.getX()][oldPosition.getY()];
        const newCell = chessboard[newPosition.getX()][newPosition.getY()];
        const chessPieceOldPosition = oldCell.getChessPiece();
        oldCell.setChessPiece(null);
        newCell.setChessPiece(chessPieceOldPosition);
    }
    isPositionOccupiedByPlayer(socketId, position, chessboard) {
        const targetPiece = this.getChessPieceAtPosition(position, chessboard);
        if (targetPiece) {
            return targetPiece.getUser().getSocketId() === socketId;
        }
        return false;
    }
    getPositionsOccupiedByOpponent(socketId, chessboard) {
        return chessboard.flatMap(row => row.flatMap(cell => {
            const piece = cell.getChessPiece();
            if (piece && piece.getUser().getSocketId() !== socketId) {
                return [new Position(cell.getXPosition(), cell.getYPosition())];
            }
            return [];
        }));
    }
    isMoveValid(socketId, oldPosition, newPosition, chessboard) {
        if (!this.isPositionValid(oldPosition) || !this.isPositionValid(newPosition))
            return false;
        const piece = this.getChessPieceAtPosition(oldPosition, chessboard);
        if (!piece)
            return false;
        const isOwnershipValid = this.isPositionOccupiedByPlayer(socketId, oldPosition, chessboard);
        if (!isOwnershipValid)
            return false;
        const clonedChessboard = this.cloneChessboard(chessboard);
        const isMoveLegal = this.isMoveLegal(oldPosition, newPosition, clonedChessboard, socketId);
        if (!isMoveLegal)
            return false;
        const doesResultsInCheck = this.doesResultsInCheck(socketId, oldPosition, newPosition, clonedChessboard);
        if (doesResultsInCheck)
            return false;
        if (piece.getMovementStrategy() === MovementStrategy.PawnMovement && piece.getIsFirstMove())
            piece.setIsFirstMove(false);
        return true;
    }
    isMoveLegal(oldPosition, newPosition, chessboard, socketId) {
        const oldX = oldPosition.getX();
        const oldY = oldPosition.getY();
        const newX = newPosition.getX();
        const newY = newPosition.getY();
        const chessPiece = this.getChessPieceAtPosition(oldPosition, chessboard);
        const targetPiece = this.getChessPieceAtPosition(newPosition, chessboard);
        if (socketId) {
            const isOccupiedBySamePlayer = this.isPositionOccupiedByPlayer(socketId, newPosition, chessboard);
            if (isOccupiedBySamePlayer)
                return false;
        }
        if (!chessPiece)
            return false;
        const movementStrategy = chessPiece.getMovementStrategy();
        switch (movementStrategy) {
            case MovementStrategy.KingMovement: {
                const dx = Math.abs(newX - oldX);
                const dy = Math.abs(newY - oldY);
                return (dx <= 1 && dy <= 1);
            }
            case MovementStrategy.QueenMovement:
                if (oldX !== newX && oldY !== newY) {
                    if (Math.abs(newX - oldX) !== Math.abs(newY - oldY))
                        return false;
                }
                break;
            case MovementStrategy.RookMovement:
                if (oldX !== newX && oldY !== newY)
                    return false;
                break;
            case MovementStrategy.BishopMovement:
                if (Math.abs(newX - oldX) !== Math.abs(newY - oldY))
                    return false;
                break;
            case MovementStrategy.KnightMovement: {
                const dx = Math.abs(newX - oldX);
                const dy = Math.abs(newY - oldY);
                return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
            }
            case MovementStrategy.PawnMovement:
                const direction = chessPiece.getUser().getColor() === PlayerColor.Light ? 1 : -1;
                const doubleMove = chessPiece.getIsFirstMove() && (newPosition.getX() === oldPosition.getX() + 2 * direction) && (newPosition.getY() === oldPosition.getY()) && targetPiece === null;
                const singleMove = (newPosition.getX() === oldPosition.getX() + direction) && (newPosition.getY() === oldPosition.getY()) && targetPiece === null;
                const diagonalMove = (newPosition.getX() === oldPosition.getX() + direction) && ((newPosition.getY() === oldPosition.getY() + 1) || (newPosition.getY() === oldPosition.getY() - 1)) && targetPiece !== null;
                return singleMove || doubleMove || diagonalMove;
        }
        const dx = Math.sign(newX - oldX);
        const dy = Math.sign(newY - oldY);
        let x = oldX + dx;
        let y = oldY + dy;
        while (x !== newX || y !== newY) {
            if (chessboard[x][y].getChessPiece() !== null)
                return false;
            x += dx;
            y += dy;
        }
        return true;
    }
    isKingInCheck(kingPosition, positionsOccupiedByOpponent, chessboard) {
        for (const position of positionsOccupiedByOpponent) {
            if (this.isMoveLegal(position, kingPosition, chessboard)) {
                return true;
            }
        }
        return false;
    }
    doesResultsInCheck(socketId, oldPosition, newPosition, chessboard) {
        this.setChessPieceAtPosition(oldPosition, newPosition, chessboard);
        const kingPosition = this.getKingPosition(socketId, chessboard);
        const positionsOccupiedByOpponent = this.getPositionsOccupiedByOpponent(socketId, chessboard);
        return this.isKingInCheck(kingPosition, positionsOccupiedByOpponent, chessboard);
    }
    getKingPosition(socketId, chessboard) {
        for (const row of chessboard) {
            for (const cell of row) {
                const piece = cell.getChessPiece();
                if (piece && piece.getMovementStrategy() === MovementStrategy.KingMovement && piece.getUser().getSocketId() === socketId) {
                    return new Position(cell.getXPosition(), cell.getYPosition());
                }
            }
        }
        throw new Error("King not found");
    }
    moveChessPiece(move, chessboard) {
        const oldPosition = move.getOldPosition();
        const newPosition = move.getNewPosition();
        const oldCell = chessboard[oldPosition.getX()][oldPosition.getY()];
        const newCell = chessboard[newPosition.getX()][newPosition.getY()];
        const chessPieceOldPosition = oldCell.getChessPiece();
        const chessPieceNewPosition = newCell.getChessPiece();
        const moveType = chessPieceNewPosition ? MoveType.Capture : MoveType.Move;
        const scoreIncrease = this.calculateScoreIncreaseForCapture(chessPieceNewPosition);
        const capturedPieceId = chessPieceNewPosition ? chessPieceNewPosition.getId() : undefined;
        const result = new ChessMoveInfo(moveType, scoreIncrease, capturedPieceId);
        oldCell.setChessPiece(null);
        newCell.setChessPiece(chessPieceOldPosition);
        return result;
    }
    calculateScoreIncreaseForCapture(chessPiece) {
        if (!chessPiece)
            return 0;
        const movementStrategy = chessPiece.getMovementStrategy();
        switch (movementStrategy) {
            case MovementStrategy.PawnMovement:
                return 1;
            case MovementStrategy.KnightMovement:
            case MovementStrategy.BishopMovement:
                return 3;
            case MovementStrategy.RookMovement:
                return 5;
            case MovementStrategy.QueenMovement:
                return 9;
            default:
                return 0;
        }
    }
}

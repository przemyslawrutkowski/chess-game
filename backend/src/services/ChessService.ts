import ChessPiece from "../models/ChessPiece.js";
import ServerUser from "../models/ServerUser.js";
import { PlayerColor } from "../../../shared/src/enums/PlayerColor.js";
import { MovementStrategy } from "../../../shared/src/enums/MovementStrategy.js";
import { Chessboard } from "../types/Chessboard.js";
import ChessboardCell from "../models/ChessboardCell.js";
import Move from "../../../shared/src/models/Move.js";
import Position from "../../../shared/src/models/Position.js";
import { MoveType } from "../../../shared/src/enums/MoveType.js";
import ChessMoveInfo from "../models/ChessMoveInfo.js";

export default class ChessService {
    private static instance: ChessService;

    private constructor() { }

    public static getInstance(): ChessService {
        if (!ChessService.instance) {
            ChessService.instance = new ChessService();
        }
        return ChessService.instance;
    }

    public initilizeChessboard(user1: ServerUser, user2: ServerUser): Chessboard {
        user1.setColor(PlayerColor.Light);
        user2.setColor(PlayerColor.Dark);

        let chessboard: Chessboard = Array.from({ length: 8 }, (_, x) => {
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

    private cloneChessboard(chessboard: Chessboard): Chessboard {
        return chessboard.map(row => row.map(cell => {
            return new ChessboardCell(cell.getXPosition(), cell.getYPosition(), cell.getChessPiece());
        }));
    }

    private getChessPieceAtPosition(position: Position, chessboard: Chessboard): ChessPiece | null {
        return chessboard[position.getX()][position.getY()].getChessPiece();
    }

    private setChessPieceAtPosition(oldPosition: Position, newPosition: Position, chessboard: Chessboard): void {
        const oldCell = chessboard[oldPosition.getX()][oldPosition.getY()];
        const newCell = chessboard[newPosition.getX()][newPosition.getY()];

        const chessPieceOldPosition = oldCell.getChessPiece();

        oldCell.setChessPiece(null);
        newCell.setChessPiece(chessPieceOldPosition);
    }

    private isPositionOccupiedByPlayer(socketId: string, position: Position, chessboard: Chessboard): boolean {
        const targetPiece = this.getChessPieceAtPosition(position, chessboard);
        if (targetPiece) {
            return targetPiece.getUser().getSocketId() === socketId;
        }
        return false;
    }

    private getPositionsOccupiedByOpponent(socketId: string, chessboard: Chessboard): Position[] {
        return chessboard.flatMap(row => row.flatMap(cell => {
            const piece = cell.getChessPiece();
            if (piece && piece.getUser().getSocketId() !== socketId) {
                return [new Position(cell.getXPosition(), cell.getYPosition())];
            }
            return [];
        }));
    }

    private isMoveLegal(piece: ChessPiece, oldPosition: Position, newPosition: Position, chessboard: Chessboard): boolean {
        const targetPiece = this.getChessPieceAtPosition(newPosition, chessboard);

        const dx = Math.abs(newPosition.getX() - oldPosition.getX());
        const dy = Math.abs(newPosition.getY() - oldPosition.getY());

        switch (piece.getMovementStrategy()) {
            case MovementStrategy.KingMovement:
                return (dx <= 1 && dy <= 1);
            case MovementStrategy.QueenMovement:
                return this.isPathClear(MovementStrategy.QueenMovement, oldPosition, newPosition, chessboard) && (dx === dy || dx === 0 || dy === 0);
            case MovementStrategy.RookMovement:
                return this.isPathClear(MovementStrategy.RookMovement, oldPosition, newPosition, chessboard) && (dx === 0 || dy === 0);
            case MovementStrategy.BishopMovement:
                return this.isPathClear(MovementStrategy.BishopMovement, oldPosition, newPosition, chessboard) && (dx === dy);
            case MovementStrategy.KnightMovement:
                return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
            case MovementStrategy.PawnMovement:
                const direction = piece.getUser().getColor() === PlayerColor.Light ? 1 : -1;

                const doubleMove = piece.getIsFirstMove() && (newPosition.getX() === oldPosition.getX() + 2 * direction) && (newPosition.getY() === oldPosition.getY()) && targetPiece === null;
                const singleMove = (newPosition.getX() === oldPosition.getX() + direction) && (newPosition.getY() === oldPosition.getY()) && targetPiece === null;
                const diagonalMove = (newPosition.getX() === oldPosition.getX() + direction) && ((newPosition.getY() === oldPosition.getY() + 1) || (newPosition.getY() === oldPosition.getY() - 1)) && targetPiece !== null;

                if (singleMove || doubleMove || diagonalMove) {
                    piece.setIsFirstMove(false);
                }
                return singleMove || doubleMove || diagonalMove;
        }
    }

    public isMoveValid(socketId: string, oldPosition: Position, newPosition: Position, chessboard: Chessboard): boolean {
        const piece = this.getChessPieceAtPosition(oldPosition, chessboard);

        if (!piece) return false;

        const isOwnershipValid = this.isPositionOccupiedByPlayer(socketId, oldPosition, chessboard);
        const isOccupiedBySamePlayer = this.isPositionOccupiedByPlayer(socketId, newPosition, chessboard);

        const cellsOccupiedByOpponent = this.getPositionsOccupiedByOpponent(socketId, chessboard);
        const kingPosition = this.getKingPosition(socketId, chessboard);

        const isKingInCheck = this.isKingInCheck(kingPosition, cellsOccupiedByOpponent, chessboard);
        if (isKingInCheck) {
            return this.doesGetOutOfCheck(socketId, oldPosition, newPosition, cellsOccupiedByOpponent, chessboard);
        }

        if (!isOwnershipValid || isOccupiedBySamePlayer) return false;

        return this.isMoveLegal(piece, oldPosition, newPosition, chessboard)
    }

    private isPathClear(movementStrategy: MovementStrategy, oldPosition: Position, newPosition: Position, chessboard: Chessboard): boolean {
        const oldX = oldPosition.getX();
        const oldY = oldPosition.getY();
        const newX = newPosition.getX();
        const newY = newPosition.getY();

        switch (movementStrategy) {
            case MovementStrategy.QueenMovement:
                if (oldX !== newX && oldY !== newY) {
                    if (Math.abs(newX - oldX) !== Math.abs(newY - oldY)) return false;
                }
                break;
            case MovementStrategy.RookMovement:
                if (oldX !== newX && oldY !== newY) return false;
                break;
            case MovementStrategy.BishopMovement:
                if (Math.abs(newX - oldX) !== Math.abs(newY - oldY)) return false;
                break;
            default:
                break;
        }
        const dx = Math.sign(newX - oldX);
        const dy = Math.sign(newY - oldY);
        let x = oldX + dx;
        let y = oldY + dy;
        while (x !== newX || y !== newY) {
            if (chessboard[x][y].getChessPiece() !== null) return false;
            x += dx;
            y += dy;
        }
        return true;
    }

    private canCheck(position: Position, kingPosition: Position, chessboard: Chessboard) {
        const piece = this.getChessPieceAtPosition(position, chessboard);

        if (!piece) throw new Error("Piece not found");

        const dx = Math.abs(kingPosition.getX() - position.getX());
        const dy = Math.abs(kingPosition.getY() - position.getY());

        switch (piece.getMovementStrategy()) {
            case MovementStrategy.KingMovement:
                return (dx <= 1 && dy <= 1);
            case MovementStrategy.QueenMovement:
                return this.isPathClear(MovementStrategy.QueenMovement, position, kingPosition, chessboard) && (dx === dy || dx === 0 || dy === 0);
            case MovementStrategy.RookMovement:
                return this.isPathClear(MovementStrategy.RookMovement, position, kingPosition, chessboard) && (dx === 0 || dy === 0);
            case MovementStrategy.BishopMovement:
                return this.isPathClear(MovementStrategy.BishopMovement, position, kingPosition, chessboard) && (dx === dy);
            case MovementStrategy.KnightMovement:
                return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
            case MovementStrategy.PawnMovement:
                const direction = piece.getUser().getColor() === PlayerColor.Light ? 1 : -1;
                const diagonalMove = (kingPosition.getX() === position.getX() + direction) && ((kingPosition.getY() === position.getY() + 1) || (kingPosition.getY() === position.getY() - 1));

                return diagonalMove;
        }
    }

    private isKingInCheck(kingPosition: Position, positionsOccupiedByOpponent: Position[], chessboard: Chessboard): boolean {
        for (const position of positionsOccupiedByOpponent) {
            if (this.canCheck(position, kingPosition, chessboard)) {
                return true;
            }
        }
        return false;
    }

    private doesGetOutOfCheck(socketId: string, oldPosition: Position, newPosition: Position, positionsOccupiedByOpponent: Position[], chessboard: Chessboard) {
        const clonedChessboard = this.cloneChessboard(chessboard);
        const chessPiece = this.getChessPieceAtPosition(oldPosition, clonedChessboard);
        if (!chessPiece) throw new Error("Piece not found");
        const isMoveLegal = this.isMoveLegal(chessPiece, oldPosition, newPosition, clonedChessboard);
        if (!isMoveLegal) return false;
        this.setChessPieceAtPosition(oldPosition, newPosition, clonedChessboard);
        const kingPosition = this.getKingPosition(socketId, clonedChessboard);
        return !this.isKingInCheck(kingPosition, positionsOccupiedByOpponent, clonedChessboard);
    }

    private getKingPosition(socketId: string, chessboard: Chessboard): Position {
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

    public moveChessPiece(move: Move, chessboard: Chessboard): ChessMoveInfo {
        const oldPosition = move.getOldPosition();
        const newPosition = move.getNewPosition();

        const oldCell = chessboard[oldPosition.getX()][oldPosition.getY()];
        const newCell = chessboard[newPosition.getX()][newPosition.getY()];

        const chessPieceOldPosition = oldCell.getChessPiece();
        const chessPieceNewPosition = newCell.getChessPiece();

        const moveType = chessPieceNewPosition ? MoveType.Capture : MoveType.Move;
        const scoreIncrease = this.calculateScoreIncreaseForCapture(chessPieceNewPosition);
        const capturedPieceId = chessPieceNewPosition ? chessPieceNewPosition.getId() : undefined

        const result = new ChessMoveInfo(moveType, scoreIncrease, capturedPieceId);

        oldCell.setChessPiece(null);
        newCell.setChessPiece(chessPieceOldPosition);

        return result;
    }

    private calculateScoreIncreaseForCapture(chessPiece: ChessPiece | null): number {
        if (!chessPiece) return 0;

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
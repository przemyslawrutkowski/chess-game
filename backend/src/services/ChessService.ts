import ChessPiece from "../models/ChessPiece.js";
import ServerUser from "../models/ServerUser.js";
import { PlayerColor } from "../../../shared/src/enums/PlayerColor.js";
import { MovementStrategy } from "../../../shared/src/enums/MovementStrategy.js";
import { Chessboard } from "../types/Chessboard.js";
import ChessboardCell from "../models/ChessboardCell.js";
import Move from "../../../shared/src/models/Move.js";
import Position from "../../../shared/src/models/Position.js";
import { GameState } from "../../../shared/src/enums/GameState.js";
import Pawn from "../models/Pawn.js";
import EnPassant from "../../../shared/src/models/EnPassant.js";
import { MoveType } from "../../../shared/src/enums/MoveType.js";

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
            chessboard[1][y].setChessPiece(new Pawn(user1, MovementStrategy.PawnMovement));
            chessboard[6][y].setChessPiece(new Pawn(user2, MovementStrategy.PawnMovement));
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
    private isPositionValid(position: Position): boolean {
        return position.getX() >= 0 && position.getX() < 8 && position.getY() >= 0 && position.getY() < 8;
    }

    private cloneChessboard(chessboard: Chessboard): Chessboard {
        return chessboard.map(row => row.map(cell => {
            return new ChessboardCell(cell.getXPosition(), cell.getYPosition(), cell.getChessPiece());
        }));
    }

    private getChessPieceAtPosition(position: Position, chessboard: Chessboard): ChessPiece | null {
        return chessboard[position.getX()][position.getY()].getChessPiece();
    }

    private setChessPieceAtPosition(position: Position, chessPiece: ChessPiece | null, chessboard: Chessboard): void {
        chessboard[position.getX()][position.getY()].setChessPiece(chessPiece);
    }

    private moveChessPiece(oldPosition: Position, newPosition: Position, chessboard: Chessboard): void {
        const chessPiece = this.getChessPieceAtPosition(oldPosition, chessboard);

        this.setChessPieceAtPosition(oldPosition, null, chessboard);
        this.setChessPieceAtPosition(newPosition, chessPiece, chessboard);
    }

    public promotePawn(position: Position, movementStrategy: MovementStrategy, chessboard: Chessboard): void {
        const chessPiece = this.getChessPieceAtPosition(position, chessboard);
        if (!chessPiece) return;

        chessPiece.setMovementStrategy(movementStrategy);
    }

    private isPositionOccupied(socketId: string, position: Position, chessboard: Chessboard, byMe: boolean = false): boolean {
        const targetPiece = this.getChessPieceAtPosition(position, chessboard);
        if (targetPiece) {
            return byMe ? targetPiece.getUser().getSocketId() === socketId : targetPiece.getUser().getSocketId() !== socketId;
        }
        return false;
    }

    private getOccupiedPositions(socketId: string, chessboard: Chessboard, byMe: boolean = false): Position[] {
        return chessboard.flatMap(row => row.flatMap(cell => {
            const piece = cell.getChessPiece();
            if (piece) {
                const condition = byMe ? piece.getUser().getSocketId() === socketId : piece.getUser().getSocketId() !== socketId;
                if (condition) {
                    return [new Position(cell.getXPosition(), cell.getYPosition())];
                }
            }
            return [];
        }));
    }

    public isMoveValid(socketId: string, oldPosition: Position, newPosition: Position, chessboard: Chessboard): boolean {
        if (!this.isPositionValid(oldPosition) || !this.isPositionValid(newPosition)) return false;
        const piece = this.getChessPieceAtPosition(oldPosition, chessboard);
        if (!piece) return false;

        const isOwnershipValid = this.isPositionOccupied(socketId, oldPosition, chessboard, true);
        const isOccupiedByMe = this.isPositionOccupied(socketId, newPosition, chessboard, true);

        if (!isOwnershipValid || isOccupiedByMe) return false;

        const clonedChessboard = this.cloneChessboard(chessboard);

        const isMoveLegal = this.isMoveLegal(oldPosition, newPosition, clonedChessboard);
        if (!isMoveLegal) return false;

        const doesResultsInCheck = this.doesResultsInCheck(socketId, oldPosition, newPosition, clonedChessboard);
        if (doesResultsInCheck) return false;

        return true;
    }

    private isMoveLegal(oldPosition: Position, newPosition: Position, chessboard: Chessboard): boolean {
        const oldX = oldPosition.getX();
        const oldY = oldPosition.getY();
        const newX = newPosition.getX();
        const newY = newPosition.getY();

        const chessPiece = this.getChessPieceAtPosition(oldPosition, chessboard);
        const targetPiece = this.getChessPieceAtPosition(newPosition, chessboard);

        if (!chessPiece) return false;

        const movementStrategy = chessPiece.getMovementStrategy();

        switch (movementStrategy) {
            case MovementStrategy.KingMovement: {
                const dx = Math.abs(newX - oldX);
                const dy = Math.abs(newY - oldY);
                return (dx <= 1 && dy <= 1);
            }
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
            case MovementStrategy.KnightMovement: {
                const dx = Math.abs(newX - oldX);
                const dy = Math.abs(newY - oldY);
                return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
            }
            case MovementStrategy.PawnMovement:
                const direction = chessPiece.getUser().getColor() === PlayerColor.Light ? 1 : -1;

                const doubleMove = (chessPiece as Pawn).getIsFirstMove() && (newX === oldX + 2 * direction) && (newY === oldY) && targetPiece === null;
                const singleMove = (newX === oldX + direction) && (newY === oldY) && targetPiece === null;
                const diagonalMove = (newX === oldX + direction) && ((newY === oldY + 1) || (newY === oldY - 1)) && targetPiece !== null;

                const canEnPassantToSide = (sideOffset: number) => {
                    const opponentPosition = new Position(oldX, oldY + sideOffset);
                    if (!this.isPositionValid(opponentPosition)) return false;
                    const opponentPiece = this.getChessPieceAtPosition(opponentPosition, chessboard);
                    return targetPiece === null && (newX === oldX + direction) && (newY === oldY + sideOffset) && opponentPiece?.getMovementStrategy() === MovementStrategy.PawnMovement && (opponentPiece as Pawn).getWasPreviousMoveDouble() && this.isPositionOccupied(chessPiece.getUser().getSocketId(), opponentPosition, chessboard);
                };

                return singleMove || doubleMove || diagonalMove || canEnPassantToSide(1) || canEnPassantToSide(-1);
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

    private isKingInCheck(kingPosition: Position, positionsOccupiedByOpponent: Position[], chessboard: Chessboard): boolean {
        for (const position of positionsOccupiedByOpponent) {
            if (this.isMoveLegal(position, kingPosition, chessboard)) {
                return true;
            }
        }
        return false;
    }

    private doesResultsInCheck(socketId: string, oldPosition: Position, newPosition: Position, chessboard: Chessboard, opponent: boolean = false) {
        const isEnPassantMove = this.isEnPassantMove(oldPosition, newPosition, chessboard);
        if (isEnPassantMove) {
            this.setChessPieceAtPosition(isEnPassantMove.getEnPassantPosition(), null, chessboard);
            this.moveChessPiece(oldPosition, newPosition, chessboard);
        } else {
            this.moveChessPiece(oldPosition, newPosition, chessboard);
        }
        const kingPosition = this.getKingPosition(socketId, chessboard, !opponent);
        const occupiedPositions = this.getOccupiedPositions(socketId, chessboard, opponent);
        return this.isKingInCheck(kingPosition, occupiedPositions, chessboard);
    }

    public checkGameState(socketId: string, chessboard: Chessboard): GameState { //We need to pass a chessboard after the move has been made!!!
        const opponentKingPosition = this.getKingPosition(socketId, chessboard);
        const positionsOccupiedByMe = this.getOccupiedPositions(socketId, chessboard, true);

        const isKingInCheck = this.isKingInCheck(opponentKingPosition, positionsOccupiedByMe, chessboard);

        const kingPossibleMoves = this.getPossibleMoves(socketId, opponentKingPosition, chessboard);
        for (const move of kingPossibleMoves) {
            if (!this.doesResultsInCheck(socketId, opponentKingPosition, move, this.cloneChessboard(chessboard), true)) {
                return GameState.InProgress;
            }
        }

        const positionsOccupiedByOpponent = this.getOccupiedPositions(socketId, chessboard);
        for (const position of positionsOccupiedByOpponent) {
            const possibleMoves = this.getPossibleMoves(socketId, position, chessboard);

            for (const move of possibleMoves) {
                if (!this.doesResultsInCheck(socketId, position, move, this.cloneChessboard(chessboard), true)) {
                    return GameState.InProgress;
                }
            }
        }

        if (isKingInCheck) return GameState.Checkmate;
        return GameState.Stalemate;
    }

    private getKingPosition(socketId: string, chessboard: Chessboard, my: boolean = false): Position {
        for (const row of chessboard) {
            for (const cell of row) {
                const piece = cell.getChessPiece();
                if (piece && piece.getMovementStrategy() === MovementStrategy.KingMovement) {
                    const condition = my ? piece.getUser().getSocketId() === socketId : piece.getUser().getSocketId() !== socketId;
                    if (condition) {
                        return new Position(cell.getXPosition(), cell.getYPosition());
                    }
                }
            }
        }
        throw new Error("King not found");
    }

    private getPossibleMoves(socketId: string, position: Position, chessboard: Chessboard): Position[] {
        const chessPiece = this.getChessPieceAtPosition(position, chessboard);
        if (!chessPiece) return [];

        const movementStrategy = chessPiece.getMovementStrategy();

        switch (movementStrategy) {
            case MovementStrategy.KingMovement:
                return this.getKingMoves(socketId, position, chessboard);
            case MovementStrategy.QueenMovement:
                return this.getQueenMoves(socketId, position, chessboard);
            case MovementStrategy.RookMovement:
                return this.getRookMoves(socketId, position, chessboard);
            case MovementStrategy.BishopMovement:
                return this.getBishopMoves(socketId, position, chessboard);
            case MovementStrategy.KnightMovement:
                return this.getKnightMoves(socketId, position, chessboard);
            case MovementStrategy.PawnMovement:
                return this.getPawnMoves(socketId, position, chessboard);
        }
    }

    private getKingMoves(socketId: string, position: Position, chessboard: Chessboard): Position[] {
        const x = position.getX();
        const y = position.getY();

        const possibleMoves: Position[] = [
            new Position(x - 1, y),
            new Position(x - 1, y + 1),
            new Position(x, y + 1),
            new Position(x + 1, y + 1),
            new Position(x + 1, y),
            new Position(x + 1, y - 1),
            new Position(x, y - 1),
            new Position(x - 1, y - 1),
        ];

        return possibleMoves.filter(position => {
            return this.isPositionValid(position) && !this.isPositionOccupied(socketId, position, chessboard);
        });
    }

    private getQueenMoves(socketId: string, position: Position, chessboard: Chessboard): Position[] {
        const possibleMoves: Position[] = [];

        const rookDirections = [[-1, 0], [0, 1], [1, 0], [0, -1]];
        for (const direction of rookDirections) {
            let x = position.getX() + direction[0];
            let y = position.getY() + direction[1];
            while (this.isPositionValid(new Position(x, y))) {
                if (!this.isPositionOccupied(socketId, new Position(x, y), chessboard)) {
                    possibleMoves.push(new Position(x, y));
                } else {
                    break;
                }
                x += direction[0];
                y += direction[1];
            }
        }

        const bishopDirections = [[-1, 1], [1, 1], [1, -1], [-1, -1]];
        for (const direction of bishopDirections) {
            let x = position.getX() + direction[0];
            let y = position.getY() + direction[1];
            while (this.isPositionValid(new Position(x, y))) {
                if (!this.isPositionOccupied(socketId, new Position(x, y), chessboard)) {
                    possibleMoves.push(new Position(x, y));
                } else {
                    break;
                }
                x += direction[0];
                y += direction[1];
            }
        }

        return possibleMoves;
    }

    private getRookMoves(socketId: string, position: Position, chessboard: Chessboard): Position[] {
        const x = position.getX();
        const y = position.getY();

        const possibleMoves: Position[] = [];
        const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

        for (const direction of directions) {
            let x = position.getX() + direction[0];
            let y = position.getY() + direction[1];
            while (this.isPositionValid(new Position(x, y))) {
                if (!this.isPositionOccupied(socketId, new Position(x, y), chessboard)) {
                    possibleMoves.push(new Position(x, y));
                } else {
                    break;
                }
                x += direction[0];
                y += direction[1];
            }
        }

        return possibleMoves;
    }

    private getBishopMoves(socketId: string, position: Position, chessboard: Chessboard): Position[] {
        const x = position.getX();
        const y = position.getY();

        const possibleMoves: Position[] = [];
        const directions = [[-1, 1], [1, 1], [1, -1], [-1, -1]];

        for (const direction of directions) {
            let x = position.getX() + direction[0];
            let y = position.getY() + direction[1];
            while (this.isPositionValid(new Position(x, y))) {
                if (!this.isPositionOccupied(socketId, new Position(x, y), chessboard)) {
                    possibleMoves.push(new Position(x, y));
                } else {
                    break;
                }
                x += direction[0];
                y += direction[1];
            }
        }

        return possibleMoves;
    }

    private getKnightMoves(socketId: string, position: Position, chessboard: Chessboard): Position[] {
        const x = position.getX();
        const y = position.getY();

        const possibleMoves: Position[] = [
            new Position(x - 2, y + 1),
            new Position(x - 1, y + 2),

            new Position(x + 1, y + 2),
            new Position(x + 2, y + 1),

            new Position(x + 2, y - 1),
            new Position(x + 1, y - 2),

            new Position(x - 2, y - 1),
            new Position(x - 1, y - 2),
        ];

        return possibleMoves.filter(position => {
            return this.isPositionValid(position) && !this.isPositionOccupied(socketId, position, chessboard);
        });
    }

    private getPawnMoves(socketId: string, position: Position, chessboard: Chessboard): Position[] {
        const x = position.getX();
        const y = position.getY();

        const chessPiece = this.getChessPieceAtPosition(position, chessboard);
        if (!chessPiece) return [];

        const direction = chessPiece.getUser().getColor() === PlayerColor.Light ? 1 : -1;

        const doubleMove: Position = new Position(x + 2 * direction, y);
        const singleMove: Position = new Position(x + direction, y);
        const diagonalMoves: Position[] = [
            new Position(x + direction, y + 1),
            new Position(x + direction, y - 1)
        ];

        const possibleMoves: Position[] = [];
        possibleMoves.push(doubleMove, singleMove, ...diagonalMoves);

        return possibleMoves.filter(position => {
            return this.isPositionValid(position) && !this.isPositionOccupied(socketId, position, chessboard);
        });
    }

    public makeMove(moveType: MoveType, move: Move, chessboard: Chessboard): number {
        const oldPosition = move.getOldPosition();
        const newPosition = move.getNewPosition();

        const chessPieceOldPosition = this.getChessPieceAtPosition(oldPosition, chessboard) as ChessPiece;
        const chessPieceNewPosition = this.getChessPieceAtPosition(newPosition, chessboard);

        let scoreIncrease = 0;

        if (moveType === MoveType.EnPassant) {
            const isEnPassantMove = this.isEnPassantMove(oldPosition, newPosition, chessboard);
            const enPassantPosition = (isEnPassantMove as EnPassant).getEnPassantPosition();
            const enPassantChessPiece = this.getChessPieceAtPosition(enPassantPosition, chessboard);
            this.setChessPieceAtPosition(enPassantPosition, null, chessboard);
            scoreIncrease = this.calculateScoreIncreaseForCapture(enPassantChessPiece);
        }

        this.moveChessPiece(oldPosition, newPosition, chessboard);

        if (chessPieceOldPosition.getMovementStrategy() === MovementStrategy.PawnMovement) {
            (chessPieceOldPosition as Pawn).setIsFirstMove(false);

            const dx = Math.abs(newPosition.getX() - oldPosition.getX());
            (chessPieceOldPosition as Pawn).setWasPreviousMoveDouble(dx === 2);
        }

        return moveType === MoveType.EnPassant ? scoreIncrease : this.calculateScoreIncreaseForCapture(chessPieceNewPosition);
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

    public isPawnPromotionMove(oldPosition: Position, newPosition: Position, chessboard: Chessboard): boolean {
        const chessPiece = this.getChessPieceAtPosition(oldPosition, chessboard);
        if (!chessPiece) return false;

        const movementStrategy = chessPiece.getMovementStrategy();
        if (movementStrategy !== MovementStrategy.PawnMovement) return false;

        const isPromotionRow = chessPiece.getUser().getColor() === PlayerColor.Light ? newPosition.getX() === 7 : newPosition.getX() === 0;
        return isPromotionRow;
    }

    public isEnPassantMove(oldPosition: Position, newPosition: Position, chessboard: Chessboard): EnPassant | null {
        const oldX = oldPosition.getX();
        const oldY = oldPosition.getY();
        const newX = newPosition.getX();
        const newY = newPosition.getY();

        const chessPiece = this.getChessPieceAtPosition(oldPosition, chessboard);
        if (!chessPiece || chessPiece.getMovementStrategy() !== MovementStrategy.PawnMovement) return null;

        const direction = chessPiece.getUser().getColor() === PlayerColor.Light ? 1 : -1;
        const isTargetPositionEmpty = this.getChessPieceAtPosition(newPosition, chessboard) === null;

        const canEnPassantToSide = (sideOffset: number) => {
            const opponentPosition = new Position(oldX, oldY + sideOffset);
            if (!this.isPositionValid(opponentPosition)) return false;
            const opponentPiece = this.getChessPieceAtPosition(opponentPosition, chessboard);
            return isTargetPositionEmpty && (newX === oldX + direction) && (newY === oldY + sideOffset) && opponentPiece?.getMovementStrategy() === MovementStrategy.PawnMovement && (opponentPiece as Pawn).getWasPreviousMoveDouble() && this.isPositionOccupied(chessPiece.getUser().getSocketId(), opponentPosition, chessboard);
        };

        if (canEnPassantToSide(1)) {
            const enPassantPosition = new Position(oldX, oldY + 1);
            return new EnPassant(oldPosition, newPosition, enPassantPosition);
        } else if (canEnPassantToSide(-1)) {
            const enPassantPosition = new Position(oldX, oldY - 1);
            return new EnPassant(oldPosition, newPosition, enPassantPosition);
        }

        return null;
    }
}
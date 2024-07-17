import ChessPiece from "../models/ChessPiece.js";
import { PlayerColor } from "../../../shared/src/enums/PlayerColor.js";
import { MovementStrategy } from "../../../shared/src/enums/MovementStrategy.js";
import ChessboardCell from "../models/ChessboardCell.js";
import Position from "../../../shared/src/models/Position.js";
import { GameState } from "../../../shared/src/enums/GameState.js";
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
    isPositionOccupied(socketId, position, chessboard, byMe = false) {
        const targetPiece = this.getChessPieceAtPosition(position, chessboard);
        if (targetPiece) {
            return byMe ? targetPiece.getUser().getSocketId() === socketId : targetPiece.getUser().getSocketId() !== socketId;
        }
        return false;
    }
    getOccupiedPositions(socketId, chessboard, byMe = false) {
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
    isMoveValid(socketId, oldPosition, newPosition, chessboard) {
        if (!this.isPositionValid(oldPosition) || !this.isPositionValid(newPosition))
            return false;
        const piece = this.getChessPieceAtPosition(oldPosition, chessboard);
        if (!piece)
            return false;
        const isOwnershipValid = this.isPositionOccupied(socketId, oldPosition, chessboard, true);
        const isOccupiedByMe = this.isPositionOccupied(socketId, newPosition, chessboard, true);
        if (!isOwnershipValid || isOccupiedByMe)
            return false;
        const clonedChessboard = this.cloneChessboard(chessboard);
        const isMoveLegal = this.isMoveLegal(oldPosition, newPosition, clonedChessboard);
        if (!isMoveLegal)
            return false;
        const doesResultsInCheck = this.doesResultsInCheck(socketId, oldPosition, newPosition, clonedChessboard);
        if (doesResultsInCheck)
            return false;
        return true;
    }
    isMoveLegal(oldPosition, newPosition, chessboard) {
        const oldX = oldPosition.getX();
        const oldY = oldPosition.getY();
        const newX = newPosition.getX();
        const newY = newPosition.getY();
        const chessPiece = this.getChessPieceAtPosition(oldPosition, chessboard);
        const targetPiece = this.getChessPieceAtPosition(newPosition, chessboard);
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
    doesResultsInCheck(socketId, oldPosition, newPosition, chessboard, opponent = false) {
        this.setChessPieceAtPosition(oldPosition, newPosition, chessboard);
        const kingPosition = this.getKingPosition(socketId, chessboard, !opponent);
        const occupiedPositions = this.getOccupiedPositions(socketId, chessboard, opponent);
        return this.isKingInCheck(kingPosition, occupiedPositions, chessboard);
    }
    checkGameState(socketId, chessboard) {
        const opponentKingPosition = this.getKingPosition(socketId, chessboard);
        const positionsOccupiedByMe = this.getOccupiedPositions(socketId, chessboard, true);
        const isKingInCheck = this.isKingInCheck(opponentKingPosition, positionsOccupiedByMe, chessboard);
        //Verify does the opponent's king can do any legal move
        //If yes -> return GameState.InProgress
        //If no -> go to the next step
        const kingPossibleMoves = this.getPossibleMoves(socketId, opponentKingPosition, chessboard);
        for (const move of kingPossibleMoves) {
            if (!this.doesResultsInCheck(socketId, opponentKingPosition, move, this.cloneChessboard(chessboard), true)) {
                return GameState.InProgress;
            }
        }
        const positionsOccupiedByOpponent = this.getOccupiedPositions(socketId, chessboard);
        //Verify does any other oponent's chess piece can do any legal move
        for (const position of positionsOccupiedByOpponent) {
            const possibleMoves = this.getPossibleMoves(socketId, position, chessboard);
            for (const move of possibleMoves) {
                if (!this.doesResultsInCheck(socketId, position, move, this.cloneChessboard(chessboard), true)) {
                    return GameState.InProgress;
                }
            }
        }
        if (isKingInCheck)
            return GameState.Checkmate;
        return GameState.Stalemate;
    }
    getKingPosition(socketId, chessboard, my = false) {
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
    getPossibleMoves(socketId, position, chessboard) {
        const chessPiece = this.getChessPieceAtPosition(position, chessboard);
        if (!chessPiece)
            return [];
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
    getKingMoves(socketId, position, chessboard) {
        const x = position.getX();
        const y = position.getY();
        const possibleMoves = [
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
    getQueenMoves(socketId, position, chessboard) {
        const x = position.getX();
        const y = position.getY();
        const possibleMoves = [];
        const rookDirections = [[-1, 0], [0, 1], [1, 0], [0, -1]];
        for (const direction of rookDirections) {
            let x = position.getX() + direction[0];
            let y = position.getY() + direction[1];
            while (this.isPositionValid(new Position(x, y))) {
                if (!this.isPositionOccupied(socketId, new Position(x, y), chessboard)) {
                    possibleMoves.push(new Position(x, y));
                }
                else {
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
                }
                else {
                    break;
                }
                x += direction[0];
                y += direction[1];
            }
        }
        return possibleMoves;
    }
    getRookMoves(socketId, position, chessboard) {
        const x = position.getX();
        const y = position.getY();
        const possibleMoves = [];
        const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
        for (const direction of directions) {
            let x = position.getX() + direction[0];
            let y = position.getY() + direction[1];
            while (this.isPositionValid(new Position(x, y))) {
                if (!this.isPositionOccupied(socketId, new Position(x, y), chessboard)) {
                    possibleMoves.push(new Position(x, y));
                }
                else {
                    break;
                }
                x += direction[0];
                y += direction[1];
            }
        }
        return possibleMoves;
    }
    getBishopMoves(socketId, position, chessboard) {
        const x = position.getX();
        const y = position.getY();
        const possibleMoves = [];
        const directions = [[-1, 1], [1, 1], [1, -1], [-1, -1]];
        for (const direction of directions) {
            let x = position.getX() + direction[0];
            let y = position.getY() + direction[1];
            while (this.isPositionValid(new Position(x, y))) {
                if (!this.isPositionOccupied(socketId, new Position(x, y), chessboard)) {
                    possibleMoves.push(new Position(x, y));
                }
                else {
                    break;
                }
                x += direction[0];
                y += direction[1];
            }
        }
        return possibleMoves;
    }
    getKnightMoves(socketId, position, chessboard) {
        const x = position.getX();
        const y = position.getY();
        const possibleMoves = [
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
    getPawnMoves(socketId, position, chessboard) {
        const x = position.getX();
        const y = position.getY();
        const chessPiece = this.getChessPieceAtPosition(position, chessboard);
        if (!chessPiece)
            return [];
        const direction = chessPiece.getUser().getColor() === PlayerColor.Light ? 1 : -1;
        const doubleMove = new Position(x + 2 * direction, y);
        const singleMove = new Position(x + direction, y);
        const diagonalMoves = [
            new Position(x + direction, y + 1),
            new Position(x + direction, y - 1)
        ];
        const possibleMoves = [];
        possibleMoves.push(doubleMove, singleMove, ...diagonalMoves);
        return possibleMoves.filter(position => {
            return this.isPositionValid(position) && !this.isPositionOccupied(socketId, position, chessboard);
        });
    }
    moveChessPiece(move, chessboard) {
        const oldPosition = move.getOldPosition();
        const newPosition = move.getNewPosition();
        const oldCell = chessboard[oldPosition.getX()][oldPosition.getY()];
        const newCell = chessboard[newPosition.getX()][newPosition.getY()];
        const chessPieceOldPosition = oldCell.getChessPiece();
        const chessPieceNewPosition = newCell.getChessPiece();
        oldCell.setChessPiece(null);
        newCell.setChessPiece(chessPieceOldPosition);
        if (chessPieceOldPosition.getMovementStrategy() === MovementStrategy.PawnMovement && chessPieceOldPosition.getIsFirstMove())
            chessPieceOldPosition.setIsFirstMove(false);
        return this.calculateScoreIncreaseForCapture(chessPieceNewPosition);
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

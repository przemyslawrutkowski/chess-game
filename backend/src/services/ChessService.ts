import ChessPiece from "../models/ChessPiece.js";
import ServerUser from "../models/ServerUser.js";
import { PlayerColor } from "../../../shared/src/enums/PlayerColor.js";
import { MovementStrategy } from "../../../shared/src/enums/MovementStrategy.js";
import { Chessboard } from "../types/Chessboard.js";
import ChessboardCell from "../models/ChessboardCell.js";
import Move from "../../../shared/src/models/Move.js";
import Position from "../../../shared/src/models/Position.js";
import { MoveType } from "../../../shared/src/enums/MoveType.js";
import ChessMoveOutCome from "../models/ChessMoveOutcome.js";

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
            chessboard[1][y].setChessPiece(new ChessPiece(user1, MovementStrategy.PawnMovement));
            chessboard[6][y].setChessPiece(new ChessPiece(user2, MovementStrategy.PawnMovement));
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

    public getPossibleMoves(chessPiece: ChessPiece, chessboard: Chessboard): Array<Array<number>> {
        return [];
    }

    public isTargetPositionOccupiedBySamePlayer(socketId: string, newPosition: Position, chessboard: Chessboard): boolean {
        const targetCell = chessboard[newPosition.getX()][newPosition.getY()];
        const targetPiece = targetCell.getChessPiece();

        if (targetPiece) {
            return targetPiece.getUser().getSocketId() === socketId;
        }

        return false;
    }

    public moveChessPiece(move: Move, chessboard: Chessboard): ChessMoveOutCome {
        const oldPosition = move.getOldPosition();
        const newPosition = move.getNewPosition();

        const oldCell = chessboard[oldPosition.getX()][oldPosition.getY()];
        const newCell = chessboard[newPosition.getX()][newPosition.getY()];

        const chessPieceOldPosition = oldCell.getChessPiece();
        const chessPieceNewPosition = newCell.getChessPiece();

        const moveType = chessPieceNewPosition ? MoveType.Capture : MoveType.Move;
        const scoreIncrease = this.calculateScoreIncreaseForCapture(chessPieceNewPosition);
        const capturedPieceId = chessPieceNewPosition ? chessPieceNewPosition.getId() : undefined

        const result = new ChessMoveOutCome(moveType, scoreIncrease, capturedPieceId);

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
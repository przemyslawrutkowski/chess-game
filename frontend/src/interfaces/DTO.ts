import { MovementStrategy } from "../../../shared/src/enums/MovementStrategy.js";
import { PlayerColor } from "../../../shared/src/enums/PlayerColor.js";

export interface GameDTO {
    user1: UserDTO;
    user2: UserDTO;
    chessboard: ChessboardDTO;
    whoseTurn: UserDTO;
}

export interface UserDTO {
    username: string;
    color: PlayerColor;
}

export interface ChessPieceDTO {
    id: string;
    user: UserDTO;
    movementStrategy: MovementStrategy;
}

export interface ChessboardCell {
    xPosition: number;
    yPosition: number;
    chessPiece: ChessPieceDTO | null;
}

export type ChessboardDTO = Array<Array<ChessboardCell>>;
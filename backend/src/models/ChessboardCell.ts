import ChessPiece from "./ChessPiece.js";

export default class ChessboardCell {
    private xPosition: number;
    private yPosition: number;
    private chessPiece: ChessPiece | null;

    constructor(xPosition: number, yPosition: number, chessPiece: ChessPiece | null) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.chessPiece = chessPiece;
    }

    public getXPosition(): number {
        return this.xPosition;
    }

    public getYPosition(): number {
        return this.yPosition;
    }

    public getChessPiece(): ChessPiece | null {
        return this.chessPiece;
    }

    public setChessPiece(chessPiece: ChessPiece | null): void {
        this.chessPiece = chessPiece;
    }
}
export default class ChessboardCell {
    xPosition;
    yPosition;
    chessPiece;
    constructor(xPosition, yPosition, chessPiece) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.chessPiece = chessPiece;
    }
    getXPosition() {
        return this.xPosition;
    }
    getYPosition() {
        return this.yPosition;
    }
    getChessPiece() {
        return this.chessPiece;
    }
    setChessPiece(chessPiece) {
        this.chessPiece = chessPiece;
    }
}

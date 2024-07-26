import globalStyle from '../js/globalStyles.js';
import ChessPieceC from './ChessPieceC.js';
import ChessboardCellC from './ChessboardCellC.js';
import PawnPromotion from '../../../shared/src/models/PawnPromotion.js';
import EnPassant from '../../../shared/src/models/EnPassant.js';
import Castling from '../../../shared/src/models/Castling.js';
const template = document.createElement('template');
template.innerHTML = `
    <style>
        .chessboard-panel {
            display: grid;
            grid-template-columns: repeat(8, minmax(0, 75px));
            grid-template-rows: repeat(8, minmax(0, 75px));
            max-width: 600px;
            max-height: 600px;
            margin-bottom: 2rem;
            aspect-ratio: 1 / 1;
        }

        chessboard-cell {
            position: relative;
            z-index: 1000;
        }

        promotion-selector {
            display: block;
        }
    </style>

    <div class="chessboard-panel"></div>
    <promotion-selector></promotion-selector>
`;
export default class ChessboardPanelC extends HTMLElement {
    chessboard;
    promotionSelector;
    constructor() {
        super();
        const clone = template.content.cloneNode(true);
        this.chessboard = clone.querySelector('.chessboard-panel');
        this.promotionSelector = clone.querySelector('promotion-selector');
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(clone);
        shadowRoot.adoptedStyleSheets = [globalStyle];
    }
    connectedCallback() {
        this.addEventListener('pawnPromotion', this.handlePromotionSelected.bind(this));
    }
    disconnectedCallback() {
        this.removeEventListener('pawnPromotion', this.handlePromotionSelected.bind(this));
    }
    handlePromotionSelected(event) {
        const pawnPromotionEvent = event;
        if (pawnPromotionEvent.detail && pawnPromotionEvent.detail.callback) {
            this.promotionSelector.show();
            const handlePromotionSelected = (event) => {
                const promotionSelectedEvent = event;
                const movementStrategy = promotionSelectedEvent.detail.movementStrategy;
                pawnPromotionEvent.detail.callback(movementStrategy);
                this.promotionSelector.hide();
                this.promotionSelector.removeEventListener('promotionSelected', handlePromotionSelected);
            };
            this.promotionSelector.addEventListener('promotionSelected', handlePromotionSelected);
        }
    }
    initialize(chessboard) {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const chessboardCell = chessboard[x][y];
                const chessboardCellC = new ChessboardCellC(chessboardCell);
                const chessPiece = chessboardCell.getChessPiece();
                if (chessPiece) {
                    const chessPieceC = new ChessPieceC(chessPiece);
                    chessboardCellC.setChessPiece(chessPieceC);
                }
                this.chessboard.appendChild(chessboardCellC);
            }
        }
    }
    update(move) {
        let oldCellC = null;
        let newCellC = null;
        const oldPosition = move.getOldPosition();
        const newPosition = move.getNewPosition();
        const cells = Array.from(this.chessboard.children);
        cells.forEach(cell => {
            if (oldPosition.getX() === cell.getXPosition() && oldPosition.getY() === cell.getYPosition()) {
                oldCellC = cell;
            }
            else if (newPosition.getX() === cell.getXPosition() && newPosition.getY() === cell.getYPosition()) {
                newCellC = cell;
            }
        });
        if (!oldCellC || !newCellC)
            throw new Error("Invalid move: One or both specified positions do not exist on the chessboard.");
        const chessPieceC = oldCellC.getChessPiece();
        if (!chessPieceC)
            throw new Error("Invalid move: No chess piece found at the old position.");
        oldCellC.unsetChessPiece();
        newCellC.unsetChessPiece();
        newCellC.setChessPiece(chessPieceC);
        if (move instanceof PawnPromotion) {
            chessPieceC.changeVisualModel(move.getNewMovementStrategy());
            const chessPiece = chessPieceC.getChessPiece();
            chessPiece.setMovementStrategy(move.getNewMovementStrategy());
        }
        else if (move instanceof EnPassant) {
            const enPassantPosition = move.getEnPassantPosition();
            const enPassantCell = cells.find(cell => cell.getXPosition() === enPassantPosition.getX() &&
                cell.getYPosition() === enPassantPosition.getY());
            if (!enPassantCell)
                throw new Error("Invalid move: En passant position does not exist on the chessboard.");
            enPassantCell.unsetChessPiece();
        }
        else if (move instanceof Castling) {
            const rookOldPosition = move.getRookOldPosition();
            const rookNewPosition = move.getRookNewPosition();
            const oldRookCell = cells.find(cell => cell.getXPosition() === rookOldPosition.getX() &&
                cell.getYPosition() === rookOldPosition.getY());
            const newRookCell = cells.find(cell => cell.getXPosition() === rookNewPosition.getX() &&
                cell.getYPosition() === rookNewPosition.getY());
            if (!oldRookCell || !newRookCell)
                throw new Error("Invalid move: One or both rook positions do not exist on the chessboard.");
            const rookChessPieceC = oldRookCell.getChessPiece();
            if (!rookChessPieceC)
                throw new Error("Invalid move: No rook found at the old position.");
            oldRookCell.unsetChessPiece();
            newRookCell.setChessPiece(rookChessPieceC);
        }
    }
}
customElements.define('chessboard-panel', ChessboardPanelC);

import globalStyle from '../js/globalStyles.js';
import ChessPieceC from './ChessPieceC.js';
import ChessboardCellC from './ChessboardCellC.js';
const template = document.createElement('template');
template.innerHTML = `
    <style>
        .chessboard-panel {
            display: grid;
            grid-template-columns: repeat(8, minmax(0, 1fr));
            grid-template-rows: repeat(8, minmax(0, 1fr));
            max-width: 600px;
            max-height: 600px;
        }

        chessboard-cell {
            position: relative;
            z-index: 1000;
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
        this.addEventListener('pawnPromotion', (event) => {
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
        });
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
    update(oldPosition, newPosition) {
        let oldCell = null;
        let newCell = null;
        const cells = Array.from(this.chessboard.children);
        cells.forEach(cell => {
            const xPosition = cell.getXPosition();
            const yPosition = cell.getYPosition();
            if (oldPosition.getX() === xPosition && oldPosition.getY() === yPosition) {
                oldCell = cell;
            }
            else if (newPosition.getX() === xPosition && newPosition.getY() === yPosition) {
                newCell = cell;
            }
        });
        let chessPiece = null;
        if (oldCell !== null) {
            chessPiece = oldCell.getChessPiece();
            oldCell.unsetChessPiece();
        }
        if (newCell !== null && chessPiece !== null) {
            newCell.unsetChessPiece();
            newCell.setChessPiece(chessPiece);
        }
    }
}
customElements.define('chessboard-panel', ChessboardPanelC);

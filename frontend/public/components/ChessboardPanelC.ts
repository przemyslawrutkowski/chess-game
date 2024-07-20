import globalStyle from '../js/globalStyles.js';
import { Chessboard } from '../../src/types/Chessboard.js';
import ChessPieceC from './ChessPieceC.js';
import ChessboardCellC from './ChessboardCellC.js';
import Position from '../../../shared/src/models/Position.js';
import PromotionSelector from './PromotionSelectorC.js';
import { MovementStrategy } from '../../../shared/src/enums/MovementStrategy.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        .chessboard-panel {
            display: grid;
            grid-template-columns: repeat(8, minmax(0, 1fr));
            grid-template-rows: repeat(8, minmax(0, 1fr));
            max-width: 600px;
            max-height: 600px;
            margin-bottom: 2rem;
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
    private chessboard: HTMLDivElement;
    private promotionSelector: PromotionSelector;

    constructor() {
        super();
        const clone = template.content.cloneNode(true) as DocumentFragment;
        this.chessboard = clone.querySelector('.chessboard-panel') as HTMLDivElement;
        this.promotionSelector = clone.querySelector('promotion-selector') as PromotionSelector;
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(clone);
        shadowRoot.adoptedStyleSheets = [globalStyle];
    }

    connectedCallback() {
        this.addEventListener('pawnPromotion', (event: Event) => {
            const pawnPromotionEvent = event as CustomEvent;
            if (pawnPromotionEvent.detail && pawnPromotionEvent.detail.callback) {
                this.promotionSelector.show();

                const handlePromotionSelected = (event: Event) => {
                    const promotionSelectedEvent = event as CustomEvent;
                    const movementStrategy = promotionSelectedEvent.detail.movementStrategy;
                    pawnPromotionEvent.detail.callback(movementStrategy);
                    this.promotionSelector.hide();

                    this.promotionSelector.removeEventListener('promotionSelected', handlePromotionSelected);
                };

                this.promotionSelector.addEventListener('promotionSelected', handlePromotionSelected);
            }
        });
    }

    public initialize(chessboard: Chessboard) {
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

    public update(oldPosition: Position, newPosition: Position, newMovementStrategy: MovementStrategy | null) {
        let oldCellC: ChessboardCellC | null = null;
        let newCellC: ChessboardCellC | null = null;

        const cells = Array.from(this.chessboard.children) as ChessboardCellC[];

        cells.forEach(cell => {
            const xPosition = cell.getXPosition();
            const yPosition = cell.getYPosition();
            if (oldPosition.getX() === xPosition && oldPosition.getY() === yPosition) {
                oldCellC = cell;
            } else if (newPosition.getX() === xPosition && newPosition.getY() === yPosition) {
                newCellC = cell;
            }
        });

        let chessPieceC: ChessPieceC | null = null;

        if (oldCellC !== null) {
            chessPieceC = (oldCellC as ChessboardCellC).getChessPiece();
            (oldCellC as ChessboardCellC).unsetChessPiece();
        }

        if (newCellC !== null && chessPieceC !== null) {
            (newCellC as ChessboardCellC).unsetChessPiece();
            (newCellC as ChessboardCellC).setChessPiece(chessPieceC);

            if (newMovementStrategy) {
                chessPieceC.changeVisualModel(newMovementStrategy);
                const chessPiece = chessPieceC.getChessPiece();
                chessPiece.setMovementStrategy(newMovementStrategy);
            }
        }
    }

}

customElements.define('chessboard-panel', ChessboardPanelC);
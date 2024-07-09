import globalStyle from '../js/globalStyles.js';
import { Chessboard } from '../../src/types/Chessboard.js';
import ChessPieceC from './ChessPieceC.js';
import ChessboardCellC from './ChessboardCellC.js';
import Position from '../../../shared/src/models/Position.js';

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
`;

export default class ChessboardPanelC extends HTMLElement {
    private chessboard: HTMLDivElement;

    constructor() {
        super();
        const clone = template.content.cloneNode(true) as DocumentFragment;
        this.chessboard = clone.querySelector('.chessboard-panel') as HTMLDivElement;
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(clone);
        shadowRoot.adoptedStyleSheets = [globalStyle];
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

    public update(oldPosition: Position, newPosition: Position) {
        let oldCell: ChessboardCellC | null = null;
        let newCell: ChessboardCellC | null = null;

        const cells = Array.from(this.chessboard.children) as ChessboardCellC[];

        cells.forEach(cell => {
            const xPosition = cell.getXPosition();
            const yPosition = cell.getYPosition();
            if (oldPosition.getX() === xPosition && oldPosition.getY() === yPosition) {
                oldCell = cell;
            } else if (newPosition.getX() === xPosition && newPosition.getY() === yPosition) {
                newCell = cell;
            }
        });

        let chessPiece: ChessPieceC | null = null;

        if (oldCell !== null) {
            chessPiece = (oldCell as ChessboardCellC).getChessPiece();
            (oldCell as ChessboardCellC).unsetChessPiece();
        }

        if (newCell !== null && chessPiece !== null) {
            (newCell as ChessboardCellC).unsetChessPiece();
            (newCell as ChessboardCellC).setChessPiece(chessPiece);
        }
    }

}

customElements.define('chessboard-panel', ChessboardPanelC);
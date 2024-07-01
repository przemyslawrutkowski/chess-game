import globalStyle from '../js/globalStyles.js';
import { Chessboard } from '../../src/types/Chessboard.js';
import ChessPiece from './ChessPiece.js';
import ChessboardCell from './ChessboardCell.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        .chessboard-panel {
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            grid-template-rows: repeat(8, 1fr);
            width: 100%;
            height: 100%;
            max-width: 600px;
            max-height: 600px;
        }
    </style>

    <div class="chessboard-panel"></div>
`;

export default class ChessboardPanel extends HTMLElement {
    private chessboard: HTMLDivElement;

    constructor() {
        super();
        const clone = template.content.cloneNode(true) as DocumentFragment;
        this.chessboard = clone.querySelector('.chessboard-panel') as HTMLDivElement;
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(clone);
        shadowRoot.adoptedStyleSheets = [globalStyle];
    }

    initialize(chessboard: Chessboard) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const cell = new ChessboardCell(row, col);

                const chessPiece = chessboard[row][col];
                if (chessPiece) {
                    const chessPieceUser = chessPiece.getUser();
                    const chessPieceMovementStrategy = chessPiece.getMovementStrategy();
                    const chessPieceColor = chessPieceUser.getColor();

                    if (chessPieceColor !== undefined) {
                        let chessPieceComp = new ChessPiece(chessPieceColor, chessPieceMovementStrategy);
                        cell.setChessPiece(chessPieceComp);
                    }
                }
                this.chessboard.appendChild(cell);
            }
        }
    }
}

customElements.define('chessboard-panel', ChessboardPanel);
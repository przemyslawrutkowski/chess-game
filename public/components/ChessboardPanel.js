import globalStyle from '../js/globalStyles.js';
import ChessPieceUI from './ChessPieceUI.js';
import ChessboardCellUI from './ChessboardCellUI.js';
const template = document.createElement('template');
template.innerHTML = `
    <style>
        .chessboard-panel {
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            grid-template-rows: repeat(8, 1fr);
            max-width: 600px;
            max-height: 600px;
        }

        chessboard-cell {
            width: 100%;
            height: 100%;
        }
    </style>

    <div class="chessboard-panel"></div>
`;
export default class ChessboardPanel extends HTMLElement {
    chessboard;
    constructor() {
        super();
        const clone = template.content.cloneNode(true);
        this.chessboard = clone.querySelector('.chessboard-panel');
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(clone);
        shadowRoot.adoptedStyleSheets = [globalStyle];
    }
    initialize(chessboard) {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const chessboardCell = chessboard[x][y];
                const chessboardCellUI = new ChessboardCellUI(chessboardCell.getXPosition(), chessboardCell.getYPosition());
                const chessPiece = chessboardCell.getChessPiece();
                if (chessPiece) {
                    const chessPieceUser = chessPiece.getUser();
                    const chessPieceMovementStrategy = chessPiece.getMovementStrategy();
                    const chessPieceColor = chessPieceUser.getColor();
                    if (chessPieceColor !== undefined) {
                        let chessPieceUI = new ChessPieceUI(chessPieceColor, chessPieceMovementStrategy);
                        chessboardCellUI.setChessPiece(chessPieceUI);
                    }
                }
                this.chessboard.appendChild(chessboardCellUI);
            }
        }
    }
}
customElements.define('chessboard-panel', ChessboardPanel);

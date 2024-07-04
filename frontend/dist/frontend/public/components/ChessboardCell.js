import globalStyle from '../js/globalStyles.js';
const template = document.createElement('template');
template.innerHTML = `
    <style>
        .chess-field-light {
            background-color: var(--chess-field-a-color);
        }

        .chess-field-dark {
            background-color: var(--chess-field-b-color);
        }

        .cell {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
        }

        chess-piece {
            width: 100%;
            height: 100%;
        }
    </style>

    <div class="cell"></div>
`;
export default class ChessboardCell extends HTMLElement {
    cell;
    xPosition;
    yPosition;
    constructor(xPosition, yPosition) {
        super();
        const clone = template.content.cloneNode(true);
        this.cell = clone.querySelector('.cell');
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.cell.classList.add((xPosition + yPosition) % 2 === 0 ? 'chess-field-light' : 'chess-field-dark');
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(clone);
        shadowRoot.adoptedStyleSheets = [globalStyle];
    }
    setChessPiece(chessPiece) {
        this.cell.appendChild(chessPiece);
    }
    unsetChessPiece() {
        this.cell.innerHTML = '';
    }
    getChessPiece() {
        return this.cell.querySelector('chess-piece');
    }
    getXPosition() {
        return this.xPosition;
    }
    getYPosition() {
        return this.yPosition;
    }
}
customElements.define('chessboard-cell', ChessboardCell);

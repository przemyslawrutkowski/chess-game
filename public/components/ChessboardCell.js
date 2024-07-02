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

        chessboard-cell,
        chess-piece {
            width: 100%;
            height: 100%;
        }
    </style>

    <div class="cell"></div>
`;
export default class ChessboardCell extends HTMLElement {
    cell;
    constructor(xPos, yPos) {
        super();
        const clone = template.content.cloneNode(true);
        this.cell = clone.querySelector('.cell');
        this.cell.setAttribute('x-pos', xPos.toString());
        this.cell.setAttribute('y-pos', yPos.toString());
        this.cell.classList.add((xPos + yPos) % 2 === 0 ? 'chess-field-light' : 'chess-field-dark');
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(clone);
        shadowRoot.adoptedStyleSheets = [globalStyle];
    }
    setChessPiece(chessPiece) {
        this.cell.appendChild(chessPiece);
    }
}
customElements.define('chessboard-cell', ChessboardCell);

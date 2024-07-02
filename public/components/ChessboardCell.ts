import globalStyle from '../js/globalStyles.js';
import ChessPiece from './ChessPiece.js';

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
    private cell: HTMLDivElement;

    constructor(xPos: number, yPos: number) {
        super();
        const clone = template.content.cloneNode(true) as DocumentFragment;
        this.cell = clone.querySelector('.cell') as HTMLDivElement;
        this.cell.setAttribute('x-pos', xPos.toString());
        this.cell.setAttribute('y-pos', yPos.toString());
        this.cell.classList.add((xPos + yPos) % 2 === 0 ? 'chess-field-light' : 'chess-field-dark');
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(clone);
        shadowRoot.adoptedStyleSheets = [globalStyle];
    }

    setChessPiece(chessPiece: ChessPiece) {
        this.cell.appendChild(chessPiece);
    }
}

customElements.define('chessboard-cell', ChessboardCell);
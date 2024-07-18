import globalStyle from '../js/globalStyles.js';
import ClientUser from '../../src/models/ClientUser.js';
import { PlayerColor } from '../../../shared/src/enums/PlayerColor.js';
import { GameState } from '../../../shared/src/enums/GameState.js';
import LoadingSpinnerC from './LoadingSpinnerC.js';
import SocketConnection from '../../src/models/SocketConnection.js';
import Events from '../../../shared/src/events/Events.js';
import navigationModule from '../js/navigation.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        .info-panel {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
            width: 300px;
        }

        .opponents-info {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            width: 100%;
        }

        .opponent {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            width: 100px;
        }

        .opponent .avatar {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            background-color: var(--panel-color);
            height: 50px;
            width: 50px;
            margin-bottom: 0.5rem;
            border-radius: 1rem;
        }

        .opponent .avatar svg {
            width: 70%;
            height: 70%;
        }

        .score-board {
            display: flex;
            flex-direction: row;
            justify-content: center;
            gap: 1rem;
            border: 1px solid var(--b-color);
        }

        .score-board .score {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem;
        }

        .light-score,
        .dark-score {
            font-weight: bold;
        }

        .announcement {
            text-align: center;
            width: 100%;
            padding: 1rem;
            border: 1px solid var(--panel-color);
            background-color: var(--panel-color);
            color: var(--b-color);
            border-radius: 0.5rem;
        }

        .chess-piece-light {
            fill: var(--chess-piece-a-color);
        }

        .chess-piece-dark {
            fill: var(--chess-piece-b-color);
        }

        .action-menu{
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            width: 100%;
        }

        button {
            width: 100px;
        }
    </style>

    <div class="info-panel">
        <h1>Just Chess</h1>
        <div class="opponents-info">
            <div class="opponent">
                <div class="avatar">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                        <path
                            d="M215.5 224c29.2-18.4 48.5-50.9 48.5-88c0-57.4-46.6-104-104-104S56 78.6 56 136c0 37.1 19.4 69.6 48.5 88H96c-17.7 0-32 14.3-32 32c0 16.5 12.5 30 28.5 31.8L80 400H240L227.5 287.8c16-1.8 28.5-15.3 28.5-31.8c0-17.7-14.3-32-32-32h-8.5zM22.6 473.4c-4.2 4.2-6.6 10-6.6 16C16 501.9 26.1 512 38.6 512H281.4c12.5 0 22.6-10.1 22.6-22.6c0-6-2.4-11.8-6.6-16L256 432H64L22.6 473.4z" />
                    </svg>
                </div>
                <p class="username">Test1</p>
            </div>
            <span>VS</span>
            <div class="opponent">
                <div class="avatar">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                        <path
                            d="M215.5 224c29.2-18.4 48.5-50.9 48.5-88c0-57.4-46.6-104-104-104S56 78.6 56 136c0 37.1 19.4 69.6 48.5 88H96c-17.7 0-32 14.3-32 32c0 16.5 12.5 30 28.5 31.8L80 400H240L227.5 287.8c16-1.8 28.5-15.3 28.5-31.8c0-17.7-14.3-32-32-32h-8.5zM22.6 473.4c-4.2 4.2-6.6 10-6.6 16C16 501.9 26.1 512 38.6 512H281.4c12.5 0 22.6-10.1 22.6-22.6c0-6-2.4-11.8-6.6-16L256 432H64L22.6 473.4z" />
                    </svg>
                </div>
                <p class="username">Test2</p>
            </div>
        </div>
        <div class="score-board">
            <div class="score">
                <h3>Light</h3>
                <p class="light-score">0</p>
            </div>
            <div class="score">
                <h3>Dark</h3>
                <p class="dark-score">0</p>
            </div>
        </div>
        <p class="announcement"></p>
        <div class="action-menu">
            <button class="disconnect-button">Disconnect</button>
            <button class="next-opponent-button">Next Opponent</button>
        </div>
        <loading-spinner></<loading-spinner>
    </div>
`;

export default class InfoPanelC extends HTMLElement {
    private opponents: NodeListOf<Element>;
    private announcement: HTMLParagraphElement;
    private lightScore: HTMLParagraphElement;
    private darkScore: HTMLParagraphElement;
    private disconnectButton: HTMLButtonElement;
    private nextOpponentButton: HTMLButtonElement;
    private socket: any;


    constructor() {
        super();
        const clone = template.content.cloneNode(true) as DocumentFragment;
        this.opponents = clone.querySelectorAll('.opponent') as NodeListOf<HTMLDivElement>;
        this.announcement = clone.querySelector('.announcement') as HTMLParagraphElement;
        this.lightScore = clone.querySelector('.light-score') as HTMLParagraphElement;
        this.darkScore = clone.querySelector('.dark-score') as HTMLParagraphElement;
        this.disconnectButton = clone.querySelector('.action-menu .disconnect-button') as HTMLButtonElement;
        this.nextOpponentButton = clone.querySelector('.action-menu .next-opponent-button') as HTMLButtonElement;
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(clone);
        shadowRoot.adoptedStyleSheets = [globalStyle];

        this.socket = SocketConnection.getInstance();

        this.disconnectButton.addEventListener('click', () => {
            this.socket.emit(Events.SELF_DISCONNECT);
            this.socket.on(Events.SELF_DISCONNECTED, () => {
                navigationModule.loadPage('/', false);
                this.socket.off(Events.SELF_DISCONNECTED);
            });
        });

        this.nextOpponentButton.addEventListener('click', () => {
            //Disconnect from the game
            //Try to match with another user
        });
    }

    public initialize(user1: ClientUser, user2: ClientUser) {
        const opponent1 = this.opponents.item(0) as HTMLDivElement;
        const opponent2 = this.opponents.item(1) as HTMLDivElement;

        const opponent1Avatar = opponent1.querySelector('.avatar path') as SVGPathElement;
        const opponent2Avatar = opponent2.querySelector('.avatar path') as SVGPathElement;

        const opponent1Username = opponent1.querySelector('.username') as HTMLParagraphElement;
        const opponent2Username = opponent2.querySelector('.username') as HTMLParagraphElement;

        if (user1.getColor() === PlayerColor.Light) {
            opponent1Avatar.classList.add('chess-piece-light');
            opponent2Avatar.classList.add('chess-piece-dark');
        }
        else {
            opponent2Avatar.classList.add('chess-piece-light');
            opponent1Avatar.classList.add('chess-piece-dark');
        }

        opponent1Username.innerText = user1.getUsername();
        opponent2Username.innerText = user2.getUsername();
    }

    public setAnnouncement(gameState: GameState, username?: string) {
        switch (gameState) {
            case GameState.Checkmate:
                this.announcement.innerText = `Checkmate! ${username} wins!`;
                break;
            case GameState.Stalemate:
                this.announcement.innerText = `Stalemate! It's a draw!`;
                break;
            case GameState.InProgress:
                this.announcement.innerText = `It's ${username} turn...`;
                break;
            case GameState.Disconnection:
                this.announcement.innerText = `You won! Opponent disconnected!`;
                break;
        }
    }

    public setScore(lightScore: number, darkScore: number) {
        this.lightScore.innerText = lightScore.toString();
        this.darkScore.innerText = darkScore.toString();
    }
}

customElements.define('info-panel', InfoPanelC);
import globalStyle from '../js/globalStyles.js';
const template = document.createElement('template');
template.innerHTML = `
    <style>
        button {
            border: 3px solid var(--b-color);
            border-radius: 0.5rem;
            font-size: 1rem;
            padding: 0.5rem;
            background-color: var(--a-color);
            color: var(--b-color);
            cursor: pointer;
            transition: all .5s ease;
        }

        button:hover {
            background-color: var(--b-color);
            color: var(--a-color);
        }
    </style>

    <button type="submit">Connect</button>
`;
export default class ConnectButton extends HTMLElement {
    button;
    constructor() {
        super();
        const clone = template.content.cloneNode(true);
        this.button = clone.querySelector('button');
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(clone);
        shadowRoot.adoptedStyleSheets = [globalStyle];
    }
    setStatus(status) {
        this.button.innerText = status;
    }
}
customElements.define('connect-button', ConnectButton);

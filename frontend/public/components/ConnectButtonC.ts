import globalStyle from '../js/globalStyles.js';

const template = document.createElement('template');
template.innerHTML = `
    <button type="submit">Connect</button>
`;

export default class ConnectButtonC extends HTMLElement {
    private button: HTMLButtonElement;

    constructor() {
        super();
        const clone = template.content.cloneNode(true) as DocumentFragment;
        this.button = clone.querySelector('button') as HTMLButtonElement;
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(clone);
        shadowRoot.adoptedStyleSheets = [globalStyle];
    }

    public setStatus(status: 'Connect' | 'Disconnect') {
        this.button.innerText = status;
    }
}

customElements.define('connect-button', ConnectButtonC);
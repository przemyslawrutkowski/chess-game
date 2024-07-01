import globalStyle from '../js/globalStyles.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        form {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 250px;
            gap: 0.5rem;
        }

        div {
            width: 100%;
            position: relative;
        }

        input[type="text"] {
            width: 100%;
            border: 1px solid var(--a-color);
            border-radius: 0.5rem;
            font-size: 1rem;
            padding: 0.5rem 0.5rem 0.5rem 30px;
        }

        svg {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            position: absolute;
            left: 0px;
            top: 50%;
            transform: translate(50%, -50%);
            width: 1rem;
            height: 1rem;
        }

        label {
            align-self: flex-start;
            color: var(--b-color);
        }
    </style>

    <form>
        <label for="username">Username:</label>
        <div>
            <input type="text" id="username" name="username" placeholder="Enter Your Username" required />
            <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                <path fill="#232323"
                    d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
            </svg>
        </div>
        <connect-button></connect-button>
    </form>
`;

export default class UsernameForm extends HTMLElement {
    private input: HTMLInputElement;

    constructor() {
        super();
        const clone = template.content.cloneNode(true) as DocumentFragment;
        this.input = clone.querySelector('input') as HTMLInputElement;
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(clone);
        shadowRoot.adoptedStyleSheets = [globalStyle];
    }

    getUsernameInput() {
        return this.input.value.trim();

    }
}

customElements.define('username-form', UsernameForm);
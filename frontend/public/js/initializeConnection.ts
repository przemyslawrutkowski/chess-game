import Events from '../../../shared/src/events/Events.js';
import SocketConnection from '../../src/models/SocketConnection.js';
import LoadingSpinnerC from '../components/LoadingSpinnerC.js';
import UsernameFormC from '../components/UsernameFormC.js';
import CustomButtonC from '../components/CustomButtonC.js';
import navigationModule from './navigation.js';

export default function startInit() {
    try {
        const usernameForm = document.querySelector('username-form') as UsernameFormC;
        const shadowRoot = usernameForm.shadowRoot;
        let connectButton: CustomButtonC | undefined;
        if (shadowRoot) {
            connectButton = shadowRoot.querySelector('custom-button') as CustomButtonC;
        }
        const spinner = document.querySelector('loading-spinner') as LoadingSpinnerC;

        if (!usernameForm || !connectButton || !spinner) throw new Error('Page content was not generated correctly.');

        let buttonStatus: 'Connect' | 'Disconnect' = 'Connect';
        connectButton.setStatus(buttonStatus);

        const socket = SocketConnection.getInstance();

        socket.once(Events.MATCH_FOUND, () => {
            navigationModule.loadPage('/game', true);
        });

        connectButton.addEventListener('click', async (event) => {
            event.preventDefault();

            if (buttonStatus === 'Connect') {
                if (!usernameForm.getUsernameInput()) return;

                socket.emit(Events.MATCH, usernameForm.getUsernameInput());

                sessionStorage.setItem('username', usernameForm.getUsernameInput());

                buttonStatus = 'Disconnect';

                spinner.show();

                connectButton.setStatus(buttonStatus);

            } else {
                socket.emit(Events.REMOVE_FROM_POOL);

                buttonStatus = 'Connect';

                spinner.hide();

                connectButton.setStatus(buttonStatus);
            }
        });
    } catch (err) {
        console.error(err);
    }
}
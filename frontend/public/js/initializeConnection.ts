import Events from '../../../shared/src/events/Events.js';
import SocketConnection from '../../src/models/SocketConnection.js';
import LoadingSpinnerC from '../components/LoadingSpinnerC.js';
import UsernameFormC from '../components/UsernameFormC.js';
import ConnectButtonC from '../components/ConnectButtonC.js';

export default function startInit(onSuccess: () => void) {
    try {
        const usernameForm = document.querySelector('username-form') as UsernameFormC;
        const shadowRoot = usernameForm.shadowRoot as ShadowRoot;
        let connectButton: ConnectButtonC | undefined;
        if (shadowRoot) {
            connectButton = shadowRoot.querySelector('connect-button') as ConnectButtonC;
        }
        const spinner = document.querySelector('loading-spinner') as LoadingSpinnerC;

        if (!usernameForm || !connectButton || !spinner) throw new Error('Page content was not generated correctly');

        let buttonStatus: 'Connect' | 'Disconnect' = 'Connect';

        const socket = SocketConnection.getInstance();

        socket.on(Events.MATCH_FOUND, () => {
            onSuccess();
            socket.off(Events.MATCH_FOUND);
        });

        connectButton.addEventListener('click', async (event) => {
            event.preventDefault();

            if (buttonStatus === 'Connect') {
                if (!usernameForm.getUsernameInput()) return;

                socket.emit(Events.MATCH, usernameForm.getUsernameInput());

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
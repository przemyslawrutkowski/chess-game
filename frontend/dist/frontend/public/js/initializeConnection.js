import Events from '../../../shared/src/events/Events.js';
import SocketConnection from '../../src/models/SocketConnection.js';
export default function startInit(onSuccess) {
    try {
        const usernameForm = document.querySelector('username-form');
        const shadowRoot = usernameForm.shadowRoot;
        let connectButton;
        if (shadowRoot) {
            connectButton = shadowRoot.querySelector('connect-button');
        }
        const spinner = document.querySelector('loading-spinner');
        if (!usernameForm || !connectButton || !spinner)
            throw new Error('Page content was not generated correctly');
        let buttonStatus = 'Connect';
        const socket = SocketConnection.getInstance();
        connectButton.addEventListener('click', async (event) => {
            event.preventDefault();
            if (buttonStatus === 'Connect') {
                if (!usernameForm.getUsernameInput())
                    return;
                //wysylamy zadanie do serwera
                socket.emit(Events.MATCH, usernameForm.getUsernameInput());
                //zmieniamy status przycisku
                buttonStatus = 'Disconnect';
                //uwidaczniamy spinner
                spinner.show();
                //zmieniamy tekst na przycisku
                connectButton.setStatus(buttonStatus);
                //czekamy na odpowiedz
                socket.on(Events.MATCH_FOUND, () => onSuccess());
            }
            else {
                //zrywamy polaczenie z serwerem
                socket.emit(Events.REMOVE_FROM_POOL);
                socket.on(Events.REMOVED_FROM_POOL, () => {
                    console.log(`Disconnected from the server`);
                    socket.disconnect();
                });
                //zmieniamy status przycisku
                buttonStatus = 'Connect';
                //ukrywamy spinner
                spinner.hide();
                //zmieniamy tekst na przycisku
                connectButton.setStatus(buttonStatus);
            }
        });
    }
    catch (err) {
        console.error(err);
    }
}

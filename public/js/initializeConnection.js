import Events from '../../src/events/Events.js';
import SocketConnection from '../../src/models/SocketConnection.js';
export default function startInit(onSuccess) {
    try {
        const usernameForm = document.getElementById('username-form');
        const connectBtn = document.querySelector('.custom-btn');
        const spinner = document.querySelector('.spinner');
        if (!usernameForm || !connectBtn || !spinner)
            throw new Error('Page content was not generated correctly');
        const usernameInput = usernameForm.elements.namedItem('username'); //.value
        let btnStatus = 'Connect';
        const socket = SocketConnection.getInstance();
        connectBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            if (btnStatus === 'Connect') {
                if (!usernameInput.value.trim())
                    return;
                //wysylamy zadanie do serwera
                socket.emit(Events.MATCH, { username: usernameInput.value });
                //zmieniamy status przycisku
                btnStatus = 'Disconnect';
                //uwidaczniamy spinner
                spinner.classList.add('visible');
                //zmieniamy tekst na przycisku
                connectBtn.innerText = btnStatus;
                //czekamy na odpowiedz
                socket.on(Events.MATCH_FOUND, () => onSuccess());
            }
            else {
                //zrywamy polaczenie z serwerem
                socket.emit(Events.REMOVE_FROM_POOL);
                socket.on(Events.REMOVED_FROM_POOL, () => socket.disconnect());
                //zmieniamy status przycisku
                btnStatus = 'Connect';
                //ukrywamy spinner
                spinner.classList.remove('visible');
                //zmieniamy tekst na przycisku
                connectBtn.innerText = btnStatus;
            }
        });
    }
    catch (err) {
        console.error(err);
    }
}

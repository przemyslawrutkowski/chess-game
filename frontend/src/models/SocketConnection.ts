declare const io: any;

class SocketConnection {
    private static instance: any = null;

    public static getInstance(serverUrl: string = 'https://chess-game-6md9.onrender.com') {
        if (!SocketConnection.instance) {
            SocketConnection.instance = io(serverUrl);
        }
        return SocketConnection.instance;
    }
}

export default SocketConnection;
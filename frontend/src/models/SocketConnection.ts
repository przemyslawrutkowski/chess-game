declare const io: any;

class SocketConnection {
    private static instance: any = null;

    public static getInstance(serverUrl: string = 'http://localhost:5000') {
        if (!SocketConnection.instance) {
            SocketConnection.instance = io(serverUrl);
        }
        return SocketConnection.instance;
    }
}

export default SocketConnection;
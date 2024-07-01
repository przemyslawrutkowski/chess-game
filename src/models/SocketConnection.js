class SocketConnection {
    static instance = null;
    static getInstance(serverUrl = 'http://localhost:5000') {
        if (!SocketConnection.instance) {
            SocketConnection.instance = io(serverUrl);
        }
        return SocketConnection.instance;
    }
}
export default SocketConnection;

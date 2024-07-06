export default class ClientGame {
    user1;
    user2;
    chessboard;
    whoseTurn;
    constructor(user1, user2, chessboard, whoseTurn) {
        this.user1 = user1;
        this.user2 = user2;
        this.chessboard = chessboard;
        this.whoseTurn = whoseTurn;
    }
    getUser1() {
        return this.user1;
    }
    getUser2() {
        return this.user2;
    }
    getChessboard() {
        return this.chessboard;
    }
    getWhoseTurn() {
        return this.whoseTurn;
    }
}

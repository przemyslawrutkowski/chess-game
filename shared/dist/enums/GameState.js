export var GameState;
(function (GameState) {
    GameState[GameState["InProgress"] = 0] = "InProgress";
    GameState[GameState["Stalemate"] = 1] = "Stalemate";
    GameState[GameState["Checkmate"] = 2] = "Checkmate";
})(GameState || (GameState = {}));

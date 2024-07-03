export var MovementStrategy;
(function (MovementStrategy) {
    MovementStrategy[MovementStrategy["KingMovement"] = 0] = "KingMovement";
    MovementStrategy[MovementStrategy["QueenMovement"] = 1] = "QueenMovement";
    MovementStrategy[MovementStrategy["RookMovement"] = 2] = "RookMovement";
    MovementStrategy[MovementStrategy["BishopMovement"] = 3] = "BishopMovement";
    MovementStrategy[MovementStrategy["KnightMovement"] = 4] = "KnightMovement";
    MovementStrategy[MovementStrategy["PawnMovement"] = 5] = "PawnMovement";
})(MovementStrategy || (MovementStrategy = {}));

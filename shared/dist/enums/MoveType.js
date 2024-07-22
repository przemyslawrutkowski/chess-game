export var MoveType;
(function (MoveType) {
    MoveType[MoveType["Move"] = 0] = "Move";
    MoveType[MoveType["EnPassant"] = 1] = "EnPassant";
    MoveType[MoveType["PawnPromotion"] = 2] = "PawnPromotion";
    MoveType[MoveType["Castling"] = 3] = "Castling";
    MoveType[MoveType["Invalid"] = 4] = "Invalid";
})(MoveType || (MoveType = {}));

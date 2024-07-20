const Events = {
    MATCH: 'match',
    MATCH_FOUND: 'matchFound',

    REMOVE_FROM_POOL: "remove_from_pool",

    GET_GAME_STATE: "get_game_state",
    GAME_STATE: "game_state",

    UPDATE_GAME_STATE: "update_game_state",
    GAME_STATE_UPDATE: "game_state_update",

    OPPONENT_DISCONNECTED: "opponent_disconnected",

    SELF_DISCONNECT: "self_disconnect",
    SELF_DISCONNECTED: "self_disconnected",

    CHECK_PAWN_PROMOTION: "check_pawn_promotion",
    PAWN_PROMOTION_RESULT: "pawn_promotion_result"
}
export default Events;
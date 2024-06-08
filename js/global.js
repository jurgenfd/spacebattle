// Original app used real globals but they are discouraged in modern JS.
// Global Constants organized in CONST

export const CONST = {
    /** Fixed board sizing */
    SIZE: 10,
    /** Same length occurs in these ships. */
    AVAILABLE_SHIPS: ['carrier', 'battleship', 'destroyer', 'submarine', 'patrolboat'],

    /**  You are player 0 */
    HUMAN_PLAYER: 0,
    /**  Computer is player 1 */
    COMPUTER_PLAYER: 1,
    /** A virtual player is used for generating temporary ships for calculating the probability heatmap of AI.*/
    VIRTUAL_PLAYER: 2,

    // Parallel info with the types below. Used for CSS classes.

    /** space (empty) */
    CSS_TYPE_EMPTY: 'empty',
    /** undamaged ship */
    CSS_TYPE_SHIP: 'ship',
    /** water with a cannonball in it (missed shot) */
    CSS_TYPE_MISS: 'miss',
    /** damaged ship (hit shot) */
    CSS_TYPE_HIT: 'hit',
    /** sunk ship */
    CSS_TYPE_SUNK: 'sunk',

    /** Cell type: water (empty) */
    TYPE_EMPTY: 0,
    /** undamaged ship */
    TYPE_SHIP: 1,
    /** water with a cannonball in it (missed shot) */
    TYPE_MISS: 2,
    /** damaged ship (hit shot) */
    TYPE_HIT: 3,
    /** sunk ship */
    TYPE_SUNK: 4,

    /** Ship is being used for placing during setup */
    USED: 1,
    /** Ship is not being placed during setup */
    UNUSED: 0
}

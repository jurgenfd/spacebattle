// Original app used real globals but they are discouraged in modern JS.

export var DEBUG_MODE = localStorage.getItem('DEBUG_MODE') === 'true';
// NB there is also local storage for Tutorial

// Global Constants organized in CONST
export var CONST = {};
CONST.AVAILABLE_SHIPS = ['carrier', 'battleship', 'destroyer', 'submarine', 'patrolboat'];
// You are player 0 and the computer is player 1
// A virtual player is used for generating temporary ships for calculating the probability heatmap
CONST.HUMAN_PLAYER = 0;
CONST.COMPUTER_PLAYER = 1;
CONST.VIRTUAL_PLAYER = 2;
// Possible values for the parameter `type` (string)
CONST.CSS_TYPE_EMPTY = 'empty';
CONST.CSS_TYPE_SHIP = 'ship';
CONST.CSS_TYPE_MISS = 'miss';
CONST.CSS_TYPE_HIT = 'hit';
CONST.CSS_TYPE_SUNK = 'sunk';
// Grid code:
CONST.TYPE_EMPTY = 0; // 0 = water (empty)
CONST.TYPE_SHIP = 1; // 1 = undamaged ship
CONST.TYPE_MISS = 2; // 2 = water with a cannonball in it (missed shot)
CONST.TYPE_HIT = 3; // 3 = damaged ship (hit shot)
CONST.TYPE_SUNK = 4; // 4 = sunk ship

// TODO: Make this better OO code. CONST.AVAILABLE_SHIPS should be an array
//       of objects rather than than two parallel arrays. Or, a better
//       solution would be to store "USED" and "UNUSED" as properties of
//       the individual ship object.
// These numbers correspond to CONST.AVAILABLE_SHIPS
// 0) 'carrier' 1) 'battleship' 2) 'destroyer' 3) 'submarine' 4) 'patrolboat'
// This variable is only used when DEBUG_MODE === true.
CONST.USED = 1;
CONST.UNUSED = 0;

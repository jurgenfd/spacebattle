// Original app used real globals but they are discouraged in modern JS.
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
CONST.TYPE_EMPTY = 0; // water (empty)
CONST.TYPE_SHIP = 1; // undamaged ship
CONST.TYPE_MISS = 2; // water with a cannonball in it (missed shot)
CONST.TYPE_HIT = 3; // damaged ship (hit shot)
CONST.TYPE_SUNK = 4; // sunk ship

CONST.USED = 1;
CONST.UNUSED = 0;

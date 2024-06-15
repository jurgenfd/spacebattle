import { CONST } from './global.js';

export class Ship {
	static DIRECTION_VERTICAL = 0;
	static DIRECTION_HORIZONTAL = 1;

	/** 
	 * @param {string} type
	 * @param {Grid} playerGrid
	 * @param {number} player
	*/
	constructor(type, playerGrid, player) {
		this.damage = 0;
		/** @type string */
		this.type = type;
		this.sunk = false;
		this.playerGrid = playerGrid;
		this.player = player;
		this.shipLength = CONST.SHIP_LENGTH_MAP[CONST.AVAILABLE_SHIPS.indexOf(this.type)];
		this.maxDamage = this.shipLength;
	}

	isLegal(x, y, direction) {
		if (this.withinBounds(x, y, direction)) {
			// ...then check to make sure it doesn't collide with another ship
			for (var i = 0; i < this.shipLength; i++) {
				let xCoor = x;
				let yCoor = y;
					if (direction === Ship.DIRECTION_VERTICAL) {
					xCoor = x + i;
				} else {
					yCoor = y + i;
				}
				if (this.hasCollision(xCoor, yCoor)) {
					return false;
				}
			}
			return true;
		}
		return false;
	}

	hasCollision(x, y) {
		return this.playerGrid.cells[x][y] === CONST.TYPE_SHIP ||
			this.playerGrid.cells[x][y] === CONST.TYPE_MISS ||
			this.playerGrid.cells[x][y] === CONST.TYPE_SUNK;
	}

	withinBounds(x, y, direction) {
		if (direction === Ship.DIRECTION_VERTICAL) {
			return x + this.shipLength <= CONST.SIZE;
		} else {
			return y + this.shipLength <= CONST.SIZE;
		}
	}

	// Increments the damage counter and sink if needed.
	incrementDamage() {
		this.damage++;
		if (this.damage >= this.maxDamage) {
			this.sinkShip();
		}
	}

	sinkShip() {
		this.damage = this.maxDamage; // Force the damage to equal the max damage
		this.sunk = true;
		// Make the CSS class sunk
		var allCells = this.getAllShipCells();
		for (var i = 0; i < this.shipLength; i++) {
			this.playerGrid.updateCell(allCells[i].x, allCells[i].y, 'sunk', this.player);
		}
	}
	/**
	 * Returns an array with all coordinates of the ship:
	 * e.g.
	 * [{'x':0, 'y':0},
	 *	{'x':1, 'y':0}]
	 * @returns {Array.<{x: number, y: number}>}
	 */
	getAllShipCells() {
		var resultObject = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (this.direction === Ship.DIRECTION_VERTICAL) {
				resultObject[i] = { 'x': this.xPosition + i, 'y': this.yPosition };
			} else {
				resultObject[i] = { 'x': this.xPosition, 'y': this.yPosition + i };
			}
		}
		return resultObject;
	}
	/** @param {boolean} virtual  
	Initializes a ship with the given coordinates and direction (bearing).
	If the ship is declared virtual, then the ship gets initialized with
	its coordinates but DOESN'T get placed on the grid.
	*/
	create(x, y, direction, virtual) {
		// This function assumes that you've already checked that the placement is legal
		this.xPosition = x;
		this.yPosition = y;
		this.direction = direction;

		// If the ship is virtual, don't add it to the grid.
		if (!virtual) {
			for (var i = 0; i < this.shipLength; i++) {
				if (this.direction === Ship.DIRECTION_VERTICAL) {
					this.playerGrid.cells[x + i][y] = CONST.TYPE_SHIP;
				} else {
					this.playerGrid.cells[x][y + i] = CONST.TYPE_SHIP;
				}
			}
		}
	}
}

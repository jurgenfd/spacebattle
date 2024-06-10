import { CONST } from './global.js';
import { Game } from './battleGame.js';

export class Ship {
	// direction === 0 when the ship is facing north/south
	// direction === 1 when the ship is facing east/west
	static DIRECTION_VERTICAL = 0;
	static DIRECTION_HORIZONTAL = 1;

	/** playerGrid is of type Grid */
	constructor(type, playerGrid, player) {
		this.damage = 0;
		this.type = type;
		this.sunk = false;
		this.playerGrid = playerGrid;
		this.player = player;

		switch (this.type) {
			case CONST.AVAILABLE_SHIPS[0]:
				this.shipLength = 5;
				break;
			case CONST.AVAILABLE_SHIPS[1]:
				this.shipLength = 4;
				break;
			case CONST.AVAILABLE_SHIPS[2]:
				this.shipLength = 3;
				break;
			case CONST.AVAILABLE_SHIPS[3]:
				this.shipLength = 3;
				break;
			case CONST.AVAILABLE_SHIPS[4]:
				this.shipLength = 2;
				break;
			default:
				log('ERROR: Ship type not found for type: ' + type);
				this.shipLength = 3;
				break;
		}
		this.maxDamage = this.shipLength;
	}

	isLegal(x, y, direction) {
		if (this.withinBounds(x, y, direction)) {
			// ...then check to make sure it doesn't collide with another ship
			for (var i = 0; i < this.shipLength; i++) {
				if (direction === Ship.DIRECTION_VERTICAL) {
					if (this.playerGrid.cells[x + i][y] === CONST.TYPE_SHIP ||
						this.playerGrid.cells[x + i][y] === CONST.TYPE_MISS ||
						this.playerGrid.cells[x + i][y] === CONST.TYPE_SUNK) {
						return false;
					}
				} else {
					if (this.playerGrid.cells[x][y + i] === CONST.TYPE_SHIP ||
						this.playerGrid.cells[x][y + i] === CONST.TYPE_MISS ||
						this.playerGrid.cells[x][y + i] === CONST.TYPE_SUNK) {
						return false;
					}
				}
			}
			return true;
		}
		return false;
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
		if ( this.damage >= this.maxDamage ) {
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
	 * Gets all the ship cells
	 *
	 * Returns an array with all (x, y) coordinates of the ship:
	 * e.g.
	 * [
	 *	{'x':2, 'y':2},
	 *	{'x':3, 'y':2},
	 *	{'x':4, 'y':2}
	 * ]
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
	// Initializes a ship with the given coordinates and direction (bearing).
	// If the ship is declared "virtual", then the ship gets initialized with
	// its coordinates but DOESN'T get placed on the grid.
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

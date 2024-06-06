import { CONST } from './global.js';
import { Ship } from './ship.js';
import { boardSize, Game } from './battleGame.js';

export class Fleet {
	constructor(game, playerGrid, player) {
		this.game = game;
		this.numShips = CONST.AVAILABLE_SHIPS.length;
		this.playerGrid = playerGrid;
		this.player = player;
		this.fleetRoster = []; // portfolio of ships
		this.populate();
	}

	populate() {
		for (var i = 0; i < this.numShips; i++) {
			// loop over the ship types when numShips > Constants.AVAILABLE_SHIPS.length
			var j = i % this.numShips;
			this.fleetRoster.push(new Ship(CONST.AVAILABLE_SHIPS[j], this.playerGrid, this.player));
		}
	}


	/** Places the ship 
	 *  @return whether or not the placement was successful
	 */
	placeShip(x, y, direction, shipType) {
		var shipCoords;
		for (var i = 0; i < this.fleetRoster.length; i++) {
			var shipTypes = this.fleetRoster[i].type;

			if (shipType === shipTypes &&
				this.fleetRoster[i].isLegal(x, y, direction)) {
				this.fleetRoster[i].create(x, y, direction, false);
				shipCoords = this.fleetRoster[i].getAllShipCells();

				for (var j = 0; j < shipCoords.length; j++) {
					this.playerGrid.updateCell(shipCoords[j].x, shipCoords[j].y, 'ship', this.player);
				}
				return true;
			}
		}
		return false;
	}

	placeShipsRandomly() {
		var shipCoords;
		for (var i = 0; i < this.fleetRoster.length; i++) {
			var illegalPlacement = true;

			// Prevents the random placement of already placed ships
			if (this.player === CONST.HUMAN_PLAYER && this.game.usedShips[i] === CONST.USED) {
				continue;
			}
			while (illegalPlacement) {
				var randomX = Math.floor(boardSize * Math.random());
				var randomY = Math.floor(boardSize * Math.random());
				var randomDirection = Math.floor(2 * Math.random());

				if (this.fleetRoster[i].isLegal(randomX, randomY, randomDirection)) {
					this.fleetRoster[i].create(randomX, randomY, randomDirection, false);
					shipCoords = this.fleetRoster[i].getAllShipCells();
					illegalPlacement = false;
				} else {
					continue;
				}
			}
			if (this.player === CONST.HUMAN_PLAYER && this.game.usedShips[i] !== CONST.USED) {
				for (var j = 0; j < shipCoords.length; j++) {
					this.playerGrid.updateCell(shipCoords[j].x, shipCoords[j].y, 'ship', this.player);
					this.game.usedShips[i] = CONST.USED;
				}
			}
		}
	}

	/** @returns ship object || null */
	findShipByCoords(x, y) {
		for (var i = 0; i < this.fleetRoster.length; i++) {
			var currentShip = this.fleetRoster[i];
			if (currentShip.direction === Ship.DIRECTION_VERTICAL) {
				if (y === currentShip.yPosition &&
					x >= currentShip.xPosition &&
					x < currentShip.xPosition + currentShip.shipLength) {
					return currentShip;
				} else {
					continue;
				}
			} else {
				if (x === currentShip.xPosition &&
					y >= currentShip.yPosition &&
					y < currentShip.yPosition + currentShip.shipLength) {
					return currentShip;
				} else {
					continue;
				}
			}
		}
		return null;
	}

	// Finds a ship by its type
	// Param shipType is a string
	// Returns the ship object that is of type shipType
	// If no ship exists, this returns null.
	findShipByType(shipType) {
		for (var i = 0; i < this.fleetRoster.length; i++) {
			if (this.fleetRoster[i].type === shipType) {
				return this.fleetRoster[i];
			}
		}
		return null;
	}

	allShipsSunk() {
		for (var i = 0; i < this.fleetRoster.length; i++) {
			// If one or more ships are not sunk, then the sentence "all ships are sunk" is false.
			if (this.fleetRoster[i].sunk === false) {
				return false;
			}
		}
		return true;
	}
}

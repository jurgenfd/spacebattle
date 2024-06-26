import { CONST } from './global.js';
import { Grid } from './grid.js';
import { Ship } from './ship.js';
import { Fleet } from './fleet.js';

export class AI {
	/**  arbitrarily big number*/
	static PROB_WEIGHT = 5000;
	/** how much weight to give to the opening book's high probability cells */
	static OPEN_HIGH_MIN = 20;
	static OPEN_HIGH_MAX = 30;
	/** how much weight to give to the opening book's medium probability cells */
	static OPEN_MED_MIN = 15;
	static OPEN_MED_MAX = 25;
	/** how much weight to give to the opening book's low probability cells */
	static OPEN_LOW_MIN = 10;
	static OPEN_LOW_MAX = 20;
	/** Amount of randomness when selecting between cells of equal probability */
	static RANDOMNESS = 0.1;

	/** Returns a random number between min (inclusive) and max (exclusive) */
	static getRandom(min, max) {
		return Math.random() * (max - min) + min;
	}

	// AI's opening book.
	// This is the pattern of the first cells for the AI to target
	static OPENINGS = [
		{ 'x': 7, 'y': 3, 'weight': AI.getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX) }, // JFD: alas we need the "AI." prefix
		{ 'x': 6, 'y': 2, 'weight': AI.getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX) },
		{ 'x': 3, 'y': 7, 'weight': AI.getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX) },
		{ 'x': 2, 'y': 6, 'weight': AI.getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX) },
		{ 'x': 6, 'y': 6, 'weight': AI.getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX) },
		{ 'x': 3, 'y': 3, 'weight': AI.getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX) },
		{ 'x': 5, 'y': 5, 'weight': AI.getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX) },
		{ 'x': 4, 'y': 4, 'weight': AI.getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX) },
		{ 'x': 0, 'y': 8, 'weight': AI.getRandom(AI.OPEN_MED_MIN, AI.OPEN_MED_MAX) },
		{ 'x': 1, 'y': 9, 'weight': AI.getRandom(AI.OPEN_HIGH_MIN, AI.OPEN_HIGH_MAX) },
		{ 'x': 8, 'y': 0, 'weight': AI.getRandom(AI.OPEN_MED_MIN, AI.OPEN_MED_MAX) },
		{ 'x': 9, 'y': 1, 'weight': AI.getRandom(AI.OPEN_HIGH_MIN, AI.OPEN_HIGH_MAX) },
		{ 'x': 9, 'y': 9, 'weight': AI.getRandom(AI.OPEN_HIGH_MIN, AI.OPEN_HIGH_MAX) },
		{ 'x': 0, 'y': 0, 'weight': AI.getRandom(AI.OPEN_HIGH_MIN, AI.OPEN_HIGH_MAX) }
	];

	constructor(game) {
		this.game = game;
		this.virtualGrid = new Grid(CONST.SIZE);
		this.virtualFleet = new Fleet(this.game, this.virtualGrid, CONST.VIRTUAL_PLAYER);
		this.probGrid = [];
		this.initProbs();
		this.updateProbs();
	}

	// Scouts the grid based on max probability, and shoots at the cell
	// that has the highest probability of containing a ship
	shoot() {
		var maxProbability = 0;
		var maxProbCoords;
		var maxProbs = [];

		// Add the AI's opening book to the probability grid
		for (var i = 0; i < AI.OPENINGS.length; i++) {
			var cell = AI.OPENINGS[i];
			if (this.probGrid[cell.x][cell.y] !== 0) {
				this.probGrid[cell.x][cell.y] += cell.weight;
			}
		}

		for (var x = 0; x < CONST.SIZE; x++) {
			for (var y = 0; y < CONST.SIZE; y++) {
				if (this.probGrid[x][y] > maxProbability) {
					maxProbability = this.probGrid[x][y];
					maxProbs = [{ 'x': x, 'y': y }]; // Replace the array
				} else if (this.probGrid[x][y] === maxProbability) {
					maxProbs.push({ 'x': x, 'y': y });
				}
			}
		}

		maxProbCoords = Math.random() < AI.RANDOMNESS ?
			maxProbs[Math.floor(Math.random() * maxProbs.length)] :
			maxProbs[0];

		var result = this.game.shoot(maxProbCoords.x, maxProbCoords.y, CONST.HUMAN_PLAYER);

		// If the game ends, the next lines need to be skipped.
		if (this.gameOver) {
			this.gameOver = false;
			return;
		}

		this.virtualGrid.cells[maxProbCoords.x][maxProbCoords.y] = result;

		// If you hit a ship, check to make sure if you've sunk it.
		if (result === CONST.TYPE_HIT) {
			var humanShip = this.findHumanShip(maxProbCoords.x, maxProbCoords.y);
			if (humanShip.sunk) {
				// Remove any ships from the roster that have been sunk
				var shipTypes = [];
				for (var k = 0; k < this.virtualFleet.fleetRoster.length; k++) {
					shipTypes.push(this.virtualFleet.fleetRoster[k].type);
				}
				var index = shipTypes.indexOf(humanShip.type);
				this.virtualFleet.fleetRoster.splice(index, 1);

				// Update the virtual grid with the sunk ship's cells
				var shipCells = humanShip.getAllShipCells();
				for (var _i = 0; _i < shipCells.length; _i++) {
					this.virtualGrid.cells[shipCells[_i].x][shipCells[_i].y] = CONST.TYPE_SUNK;
				}
			}
		}
		// Update probability grid after each shot
		this.updateProbs();
	}

	updateProbs() {
		var roster = this.virtualFleet.fleetRoster;
		var coords;
		this.resetProbs();

		// Probabilities are not normalized to fit in the interval [0, 1]
		// because we're only interested in the maximum value.

		// This works by trying to fit each ship in each cell in every orientation
		// For every cell, the more legal ways a ship can pass through it, the more
		// likely the cell is to contain a ship.
		// Cells that surround known 'hits' are given an arbitrarily large probability
		// so that the AI tries to completely sink the ship before moving on.

		// JFD: implementation is inefficient
		for (var k = 0; k < roster.length; k++) {
			for (var x = 0; x < CONST.SIZE; x++) {
				for (var y = 0; y < CONST.SIZE; y++) {
					if (roster[k].isLegal(x, y, Ship.DIRECTION_VERTICAL)) {
						roster[k].create(x, y, Ship.DIRECTION_VERTICAL, true);
						coords = roster[k].getAllShipCells();
						if (this.passesThroughHitCell(coords)) {
							for (var i = 0; i < coords.length; i++) {
								this.probGrid[coords[i].x][coords[i].y] += AI.PROB_WEIGHT * this.numHitCellsCovered(coords);
							}
						} else {
							for (var _i = 0; _i < coords.length; _i++) {
								this.probGrid[coords[_i].x][coords[_i].y]++;
							}
						}
					}
					if (roster[k].isLegal(x, y, Ship.DIRECTION_HORIZONTAL)) {
						roster[k].create(x, y, Ship.DIRECTION_HORIZONTAL, true);
						coords = roster[k].getAllShipCells();
						if (this.passesThroughHitCell(coords)) {
							for (var j = 0; j < coords.length; j++) {
								this.probGrid[coords[j].x][coords[j].y] += AI.PROB_WEIGHT * this.numHitCellsCovered(coords);
							}
						} else {
							for (var _j = 0; _j < coords.length; _j++) {
								this.probGrid[coords[_j].x][coords[_j].y]++;
							}
						}
					}

					// Set hit cells to probability zero so the AI doesn't
					// target cells that are already hit
					if (this.virtualGrid.cells[x][y] === CONST.TYPE_HIT) {
						this.probGrid[x][y] = 0;
					}
				}
			}
		}
	}

	// Initializes the probability grid for targeting
	initProbs() {
		for (var x = 0; x < CONST.SIZE; x++) {
			var row = [];
			this.probGrid[x] = row;
			for (var y = 0; y < CONST.SIZE; y++) {
				row.push(0);
			}
		}
	}

	// Resets the probability grid to all 0.
	resetProbs() {
		for (var x = 0; x < CONST.SIZE; x++) {
			for (var y = 0; y < CONST.SIZE; y++) {
				this.probGrid[x][y] = 0;
			}
		}
	}

	/** @returns Ship */
	findHumanShip(x, y) {
		return this.game.humanFleet.findShipByCoords(x, y);
	}

	// Checks whether or not a given ship's cells passes through
	// any cell that is hit.
	// Returns boolean
	passesThroughHitCell(shipCells) {
		for (var i = 0; i < shipCells.length; i++) {
			if (this.virtualGrid.cells[shipCells[i].x][shipCells[i].y] === CONST.TYPE_HIT) {
				return true;
			}
		}
		return false;
	}

	// Gives the number of hit cells the ships passes through. The more
	// cells this is, the more probable the ship exists in those coordinates
	// Returns int
	numHitCellsCovered(shipCells) {
		var cells = 0;
		for (var i = 0; i < shipCells.length; i++) {
			if (this.virtualGrid.cells[shipCells[i].x][shipCells[i].y] === CONST.TYPE_HIT) {
				cells++;
			}
		}
		return cells;
	}
}

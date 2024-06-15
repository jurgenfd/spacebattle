import { CONST } from './global.js';
import { Grid } from './grid.js';
import { Ship } from './ship.js';
import { Fleet } from './fleet.js';

export class AI {
	/**  arbitrarily big number for use in already hit surroundings */
	static PROB_WEIGHT = 999;
	/** how much weight to give to the opening book's high, medium and low probability cells */
	static OPEN_HIGH_MIN = 20;
	static OPEN_HIGH_MAX = 30;
	static OPEN_MED_MIN = 15;
	static OPEN_MED_MAX = 25;
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
		/** Probabilities */
		this.probGrid = [];
		this.initProbsToZero();
		this.updateProbs();
	}

	/**  Shoot at the cell that has the highest probability. */
	shoot() {
		var maxProbability = 0;
		var maxProbCoords;
		/** @type [{}] */
		var maxProbs = [];

		for (var x = 0; x < CONST.SIZE; x++) {
			for (var y = 0; y < CONST.SIZE; y++) {
				if (this.probGrid[x][y] > maxProbability) {
					maxProbability = this.probGrid[x][y];
					maxProbs = [{ 'x': x, 'y': y }];
				} else if (this.probGrid[x][y] === maxProbability) {
					maxProbs.push({ 'x': x, 'y': y });
				}
			}
		}
		// JFD: add a bit of randomness to the AI's choices when there are multiple cells with the same probability
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
		// If you hit a ship, check to make sure if you've sunk it in the virtual grid as well.
		if (result === CONST.TYPE_HIT) {
			var humanShip = this.findHumanShip(maxProbCoords.x, maxProbCoords.y);
			if (humanShip.sunk) {
				// Remove any ships from the roster that have been sunk
				var shipTypes = [];
				for (var ship of this.virtualFleet.fleetRoster) {
					shipTypes.push(ship.type);
				}
				var index = shipTypes.indexOf(humanShip.type);
				this.virtualFleet.fleetRoster.splice(index, 1);
				// Update the virtual grid with the sunk ship's cells
				var shipCells = humanShip.getAllShipCells();
				for (var cell of shipCells) {
					this.virtualGrid.cells[cell.x][cell.y] = CONST.TYPE_SUNK;
				}
			}
		}
		this.updateProbs();
	}

	updateProbs() {
		var roster = this.virtualFleet.fleetRoster;
		var coords;
		this.resetProbsToZero();

		// Trying to fit each ship in each cell in every orientation.
		// For every cell, the more legal ways a ship can pass through it, the more
		// likely the cell is to contain a ship.
		// Cells that surround known 'hits' are given an arbitrarily large probability
		// so that the AI tries to completely sink the ship before moving on.
		// Probabilities are not normalized to fit in the interval [0, 1]
		// because we're only interested in the maximum value.

		// JFD: doesn't account for:
		// - direction of ship that can sometimes already be inferred

		// Loop over ships in fleetRoster
		for (var k = 0; k < roster.length; k++) {
			// Loop over cells
			for (var x = 0; x < CONST.SIZE; x++) {
				for (var y = 0; y < CONST.SIZE; y++) {
					const ship = roster[k];
					// Check if the ship can fit in the cell in different orientations
					for (let direction of [Ship.DIRECTION_VERTICAL, Ship.DIRECTION_HORIZONTAL]) {
						if (ship.isLegal(x, y, direction)) {
							ship.create(x, y, direction, true);
							coords = ship.getAllShipCells();
							let countHitCellsCovered = this.numHitCellsCovered(coords);
							if (countHitCellsCovered) {
								for (var coord of coords) {
									this.probGrid[coord.x][coord.y] += AI.PROB_WEIGHT * countHitCellsCovered;
								}
							} else {
								for (var coord of coords) {
									this.probGrid[coord.x][coord.y]++;
								}
							}
						}
					}
					// Lowest prob. for hit cells so they will be skipped.
					if (this.virtualGrid.cells[x][y] === CONST.TYPE_HIT) {
						this.probGrid[x][y] = 0;
						continue;
					}
				}
			}
		}

		// Add the AI's opening book to the probability grid
		// JFD: this used to be done in shoot() but it makes more sense to do it here
		for (var i = 0; i < AI.OPENINGS.length; i++) {
			var cell = AI.OPENINGS[i];
			if (this.probGrid[cell.x][cell.y] !== 0) {
				this.probGrid[cell.x][cell.y] += cell.weight;
			}
		}
	}

	initProbsToZero() {
		for (var x = 0; x < CONST.SIZE; x++) {
			var row = [];
			this.probGrid[x] = row;
			for (var y = 0; y < CONST.SIZE; y++) {
				row.push(0);
			}
		}
	}

	resetProbsToZero() {
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

	// Gives the number of hit cells the ships passes through. The more
	// cells this is, the more probable the ship exists in those coordinates
	/** @returns number */
	numHitCellsCovered(shipCells) {
		var cellCount = 0;
		for (let shipCell of shipCells) {
			if (this.virtualGrid.cells[shipCell.x][shipCell.y] === CONST.TYPE_HIT) {
				cellCount++;
			}
		}
		return cellCount;
	}
}

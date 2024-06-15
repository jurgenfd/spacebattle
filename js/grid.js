import { CONST } from './global.js';

export class Grid {
	constructor(size) {
		CONST.SIZE = size;
		this.cells = [];
		this.init();
	}

	// Init and populate the grid
	init() {
		for (var x = 0; x < CONST.SIZE; x++) {
			var row = [];
			this.cells[x] = row;
			for (var y = 0; y < CONST.SIZE; y++) {
				row.push(CONST.TYPE_EMPTY);
			}
		}
	}

	resetForCheat(playerId) {
		for (var x = 0; x < CONST.SIZE; x++) {
			for (var y = 0; y < CONST.SIZE; y++) {
				this.updateCell(x, y, null, playerId);
			}
		}
	}

	static createGridCellSlug(x, y) {
		return 'grid-cell-' + x + '-' + y;
	}

	/** Updates the cell's CSS class based on the css type passed in
	 * @param {string|null} type
	 */
	updateCell(x, y, type, targetPlayer) {
		var player;
		if (targetPlayer === CONST.HUMAN_PLAYER) {
			player = 'human-player';
		} else if (targetPlayer === CONST.COMPUTER_PLAYER) {
			player = 'computer-player';
		} else {
			// Should never be called
			error("There was an error trying to find the correct player's grid");
		}
		if (type === null) {
			type = CONST.TYPE_2_CSS_MAP[this.cells[x][y]]
		} else {
			switch (type) {
				case CONST.CSS_TYPE_EMPTY:
					this.cells[x][y] = CONST.TYPE_EMPTY;
					break;
				case CONST.CSS_TYPE_SHIP:
					this.cells[x][y] = CONST.TYPE_SHIP;
					break;
				case CONST.CSS_TYPE_MISS:
					this.cells[x][y] = CONST.TYPE_MISS;
					break;
				case CONST.CSS_TYPE_HIT:
					this.cells[x][y] = CONST.TYPE_HIT;
					break;
				case CONST.CSS_TYPE_SUNK:
					this.cells[x][y] = CONST.TYPE_SUNK;
					break;
				default:
					error("There was an error trying to update the cell for type: " + type);
					break;
			}
		}
		var slug = Grid.createGridCellSlug(x, y);
		var classes = ['grid-cell', slug]
		/** Cheat the computer by showing it's ships */
		if (window.cheat || targetPlayer === CONST.HUMAN_PLAYER ||
			(targetPlayer === CONST.COMPUTER_PLAYER && 
				(type !== CONST.CSS_TYPE_SHIP && type !== CONST.CSS_TYPE_EMPTY))
		) {
			if (this.cells[x][y] != CONST.TYPE_EMPTY) {
				classes.push('grid-' + type);
			}
		}
		document.querySelector('.' + player + ' .' + slug).setAttribute('class', classes.join(' '));
	}

	// Checks to see if a cell contains an undamaged ship
	isUndamagedShip(x, y) {
		return this.cells[x][y] === CONST.TYPE_SHIP;
	};

	// Checks to see if the shot was missed. This is equivalent
	// to checking if a cell contains a cannonball
	isMiss(x, y) {
		return this.cells[x][y] === CONST.TYPE_MISS;
	};

	isDamagedShip(x, y) {
		return this.cells[x][y] === CONST.TYPE_HIT || this.cells[x][y] === CONST.TYPE_SUNK;
	}
}

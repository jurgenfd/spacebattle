import { CONST } from './global.js';

export class Grid {
	constructor(size) {
<<<<<<< HEAD
		this.size = size;
		this.cells = [];
		this.init();
	}
}

// Initialize and populate the grid
Grid.prototype.init = function() {
	for (var x = 0; x < this.size; x++) {
		var row = [];
		this.cells[x] = row;
		for (var y = 0; y < this.size; y++) {
			row.push(CONST.TYPE_EMPTY);
		}
	}
};

// Updates the cell's CSS class based on the type passed in
Grid.prototype.updateCell = function(x, y, type, targetPlayer) {
	var player;
	if (targetPlayer === CONST.HUMAN_PLAYER) {
		player = 'human-player';
	} else if (targetPlayer === CONST.COMPUTER_PLAYER) {
		player = 'computer-player';
	} else {
		// Should never be called
		console.log("There was an error trying to find the correct player's grid");
	}

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
			this.cells[x][y] = CONST.TYPE_EMPTY;
			break;
	}
	var classes = ['grid-cell', 'grid-cell-' + x + '-' + y, 'grid-' + type];
	document.querySelector('.' + player + ' .grid-cell-' + x + '-' + y).setAttribute('class', classes.join(' '));
};
// Checks to see if a cell contains an undamaged ship
// Returns boolean
Grid.prototype.isUndamagedShip = function(x, y) {
	return this.cells[x][y] === CONST.TYPE_SHIP;
};
// Checks to see if the shot was missed. This is equivalent
// to checking if a cell contains a cannonball
// Returns boolean
Grid.prototype.isMiss = function(x, y) {
	return this.cells[x][y] === CONST.TYPE_MISS;
};
// Checks to see if a cell contains a damaged ship,
// either hit or sunk.
// Returns boolean
Grid.prototype.isDamagedShip = function(x, y) {
	return this.cells[x][y] === CONST.TYPE_HIT || this.cells[x][y] === CONST.TYPE_SUNK;
};
=======
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

	/** no space or period */
	static createGridCellSlug(x, y) {
		return 'grid-cell-' + x + '-' + y;
	}

	// Updates the cell's CSS class based on the type passed in
	updateCell(x, y, type, targetPlayer) {
		var player;
		if (targetPlayer === CONST.HUMAN_PLAYER) {
			player = 'human-player';
		} else if (targetPlayer === CONST.COMPUTER_PLAYER) {
			player = 'computer-player';
		} else {
			// Should never be called
			console.log("ERROR: There was an error trying to find the correct player's grid");
		}

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
				this.cells[x][y] = CONST.TYPE_EMPTY;
				break;
		}
		var slug = Grid.createGridCellSlug(x, y);
		var classes = ['grid-cell', slug, 'grid-' + type];
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
>>>>>>> gh-pages

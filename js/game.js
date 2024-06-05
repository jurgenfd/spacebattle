// Jurgen Doreleijers based on https://github.com/billmei/battleboat
// Starting game at the bottom of the file.
import { CONST } from './global.js';
import { Grid } from './grid.js';
import { Fleet } from './fleet.js';
import { Stats } from './stats.js';
import { AI } from './ai.js';

export class Game {

	static gameOver = false;

	constructor(size) {
		this.size = size;
		this.usedShips = [CONST.UNUSED, CONST.UNUSED, CONST.UNUSED, CONST.UNUSED, CONST.UNUSED];
		this.shotsTaken = 0;
		this.createGrid();
		this.stats = new Stats();
		this.init();
	}

	init() {
		this.humanGrid = new Grid(Game.size);
		this.computerGrid = new Grid(Game.size);
		this.humanFleet = new Fleet(this.humanGrid, CONST.HUMAN_PLAYER);
		this.computerFleet = new Fleet(this.computerGrid, CONST.COMPUTER_PLAYER);

		this.robot = new AI(this);
		Game.stats = new Stats();
		Game.stats.updateStatsSidebar();
	}

	checkIfWon() {
		if (this.computerFleet.allShipsSunk()) {
			alert('Congratulations, you win!');
			Game.stats.wonGame();
		} else if (this.humanFleet.allShipsSunk()) {
			alert('Yarr! The computer sank all your ships. Try again.');
			Game.stats.lostGame();
		} else {
			return;
		}
		Game.gameOver = true;
		Game.stats.syncStats();
		Game.stats.updateStatsSidebar();
		this.showRestartSidebar();
}



	// Shoots at the target player on the grid.
	// Returns {int} Constants.TYPE: What the shot uncovered
	shoot(x, y, targetPlayer) {
		var targetGrid;
		var targetFleet;
		if (targetPlayer === CONST.HUMAN_PLAYER) {
			targetGrid = this.humanGrid;
			targetFleet = this.humanFleet;
		} else if (targetPlayer === CONST.COMPUTER_PLAYER) {
			targetGrid = this.computerGrid;
			targetFleet = this.computerFleet;
		} else {
			// Should never be called
			console.log("There was an error trying to find the correct player to target");
		}

		if (targetGrid.isDamagedShip(x, y)) {
			return null;
		} else if (targetGrid.isMiss(x, y)) {
			return null;
		} else if (targetGrid.isUndamagedShip(x, y)) {
			// update the board/grid
			targetGrid.updateCell(x, y, 'hit', targetPlayer);
			// IMPORTANT: This function needs to be called _after_ updating the cell to a 'hit',
			// because it overrides the CSS class to 'sunk' if we find that the ship was sunk
			targetFleet.findShipByCoords(x, y).incrementDamage(); // increase the damage
			this.checkIfWon();
			return CONST.TYPE_HIT;
		} else {
			targetGrid.updateCell(x, y, 'miss', targetPlayer);
			this.checkIfWon();
			return CONST.TYPE_MISS;
		}
	}

	// Creates click event listeners on each one of the 100 grid cells
	shootListener(e) {
		var self = e.target.self;
		// Extract coordinates from event listener
		var x = parseInt(e.target.getAttribute('data-x'), 10);
		var y = parseInt(e.target.getAttribute('data-y'), 10);
		var result = null;
		if (self.readyToPlay) {
			result = self.shoot(x, y, CONST.COMPUTER_PLAYER);
		}

		if (result !== null && !Game.gameOver) {
			Game.stats.incrementShots();
			if (result === CONST.TYPE_HIT) {
				Game.stats.hitShot();
			}
			// The AI shoots iff the player clicks on a cell that he/she hasn't
			// already clicked on yet
			self.robot.shoot();
		} else {
			Game.gameOver = false;
		}
	}

	// Creates click event listeners on each of the ship names in the roster
	rosterListener(e) {
		var self = e.target.self;
		// Remove all classes of 'placing' from the fleet roster first
		var roster = document.querySelectorAll('.fleet-roster li');
		for (var i = 0; i < roster.length; i++) {
			var classes = roster[i].getAttribute('class') || '';
			classes = classes.replace('placing', '');
			roster[i].setAttribute('class', classes);
		}
		// Set the class of the target ship to 'placing'
		Game.placeShipType = e.target.getAttribute('id');
		document.getElementById(Game.placeShipType).setAttribute('class', 'placing');
		Game.placeShipDirection = parseInt(document.getElementById('rotate-button').getAttribute('data-direction'), 10);
		self.placingOnGrid = true;
	}


	// Creates click event listeners on the human player's grid to handle
	// ship placement after the user has selected a ship name
	placementListener(e) {
		var self = e.target.self;
		if (self.placingOnGrid) {
			// Extract coordinates from event listener
			var x = parseInt(e.target.getAttribute('data-x'), 10);
			var y = parseInt(e.target.getAttribute('data-y'), 10);

			// Don't screw up the direction if the user tries to place again.
			var successful = self.humanFleet.placeShip(x, y, Game.placeShipDirection, Game.placeShipType);
			if (successful) {
				self.endPlacing(Game.placeShipType);
				self.placingOnGrid = false;
				if (self.areAllShipsPlaced()) {
					var el = document.getElementById('rotate-button');
					// el.addEventListener(transitionEndEventName(), (function () {
					// 	el.setAttribute('class', 'hidden');
					// 	document.getElementById('start-game').removeAttribute('class');
					// }), false);
					el.setAttribute('class', 'invisible');
				}
			}
		}
	}

	// Creates mouseover event listeners that handles mouseover on the
	// human player's grid to draw a phantom ship implying that the user
	// is allowed to place a ship there
	placementMouseover(e) {
		var self = e.target.self;
		if (self.placingOnGrid) {
			var x = parseInt(e.target.getAttribute('data-x'), 10);
			var y = parseInt(e.target.getAttribute('data-y'), 10);
			var classes;
			var fleetRoster = self.humanFleet.fleetRoster;

			for (var i = 0; i < fleetRoster.length; i++) {
				var shipType = fleetRoster[i].type;

				if (Game.placeShipType === shipType &&
					fleetRoster[i].isLegal(x, y, Game.placeShipDirection)) {
					// Virtual ship
					fleetRoster[i].create(x, y, Game.placeShipDirection, true);
					Game.placeShipCoords = fleetRoster[i].getAllShipCells();

					for (var j = 0; j < Game.placeShipCoords.length; j++) {
						var el = document.querySelector('.grid-cell-' + Game.placeShipCoords[j].x + '-' + Game.placeShipCoords[j].y);
						classes = el.getAttribute('class');
						// Check if the substring ' grid-ship' already exists to avoid adding it twice
						if (classes.indexOf(' grid-ship') < 0) {
							classes += ' grid-ship';
							el.setAttribute('class', classes);
						}
					}
				}
			}
		}
	}

	// Creates mouseout event listeners that un-draws the phantom ship
	// on the human player's grid as the user hovers over a different cell
	placementMouseout(e) {
		var self = e.target.self;
		if (self.placingOnGrid) {
			for (var j = 0; j < Game.placeShipCoords.length; j++) {
				var el = document.querySelector('.grid-cell-' + Game.placeShipCoords[j].x + '-' + Game.placeShipCoords[j].y);
				classes = el.getAttribute('class');
				// Check if the substring ' grid-ship' already exists to avoid adding it twice
				if (classes.indexOf(' grid-ship') > -1) {
					classes = classes.replace(' grid-ship', '');
					el.setAttribute('class', classes);
				}
			}
		}
	}

	// Click handler for the Rotate Ship button
	toggleRotation(e) {
		// Toggle rotation direction
		var direction = parseInt(e.target.getAttribute('data-direction'), 10);
		if (direction === Ship.DIRECTION_VERTICAL) {
			e.target.setAttribute('data-direction', '1');
			Game.placeShipDirection = Ship.DIRECTION_HORIZONTAL;
		} else if (direction === Ship.DIRECTION_HORIZONTAL) {
			e.target.setAttribute('data-direction', '0');
			Game.placeShipDirection = Ship.DIRECTION_VERTICAL;
		}
	}

	// Click handler for the Start Game button
	startGame(e) {
		var self = e.target.self;
		var el = document.getElementById('roster-sidebar');
		var fn = function () { el.setAttribute('class', 'hidden'); };
		// el.addEventListener(transitionEndEventName(), fn, false);
		el.setAttribute('class', 'invisible');
		self.readyToPlay = true;
		// el.removeEventListener(transitionEndEventName(), fn, false);
	}


	// Click handler for Restart Game button
	restartGame(e) {
		e.target.removeEventListener(e.type, arguments.callee);
		var self = e.target.self;
		document.getElementById('restart-sidebar').setAttribute('class', 'hidden');
		self.resetFogOfWar();
		self.init();
	}

	/** Handy function for Debugging */
	placeRandomly(e) {
		e.target.removeEventListener(e.type, arguments.callee);
		e.target.self.humanFleet.placeShipsRandomly();
		e.target.self.readyToPlay = true;
		document.getElementById('roster-sidebar').setAttribute('class', 'hidden');
		this.setAttribute('class', 'hidden');
	}

	// Ends placing the current ship
	endPlacing(shipType) {
		document.getElementById(shipType).setAttribute('class', 'placed');

		// Mark the ship as 'used'
		Game.usedShips[CONST.AVAILABLE_SHIPS.indexOf(shipType)] = CONST.USED;

		// Wipe out the variable when you're done with it
		Game.placeShipDirection = null;
		Game.placeShipType = '';
		Game.placeShipCoords = [];
	}

	// Checks whether or not all ships are done placing
	// Returns boolean
	areAllShipsPlaced() {
		var playerRoster = document.querySelectorAll('.fleet-roster li');
		for (var i = 0; i < playerRoster.length; i++) {
			if (playerRoster[i].getAttribute('class') === 'placed') {
				continue;
			} else {
				return false;
			}
		}
		// Reset temporary variables
		Game.placeShipDirection = 0;
		Game.placeShipType = '';
		Game.placeShipCoords = [];
		return true;
	}

	resetFogOfWar() {
		for (var i = 0; i < Game.size; i++) {
			for (var j = 0; j < Game.size; j++) {
				this.humanGrid.updateCell(i, j, 'empty', CONST.HUMAN_PLAYER);
				this.computerGrid.updateCell(i, j, 'empty', CONST.COMPUTER_PLAYER);
			}
		}
		// Reset all values to indicate the ships are ready to be placed again
		Game.usedShips = Game.usedShips.map(function () { return CONST.UNUSED; });
	}
	// Resets CSS styling of the sidebar
	resetRosterSidebar() {
		var els = document.querySelector('.fleet-roster').querySelectorAll('li');
		for (var i = 0; i < els.length; i++) {
			els[i].removeAttribute('class');
		}

		document.getElementById('roster-sidebar').removeAttribute('class');
		document.getElementById('rotate-button').removeAttribute('class');
		document.getElementById('start-game').setAttribute('class', 'hidden');
		document.getElementById('place-randomly').removeAttribute('class');
	};
	showRestartSidebar() {
		var sidebar = document.getElementById('restart-sidebar');
		sidebar.setAttribute('class', 'highlight');

		// Deregister listeners
		var computerCells = document.querySelector('.computer-player').childNodes;
		for (var j = 0; j < computerCells.length; j++) {
			computerCells[j].removeEventListener('click', this.shootListener, false);
		}
		var playerRoster = document.querySelector('.fleet-roster').querySelectorAll('li');
		for (var i = 0; i < playerRoster.length; i++) {
			playerRoster[i].removeEventListener('click', this.rosterListener, false);
		}

		var restartButton = document.getElementById('restart-game');
		restartButton.addEventListener('click', this.restartGame, false);
		restartButton.self = this;
	};
	// Generates the HTML divs for the grid for both players
	createGrid() {
		var gridDiv = document.querySelectorAll('.grid');
		for (var grid = 0; grid < gridDiv.length; grid++) {
			gridDiv[grid].removeChild(gridDiv[grid].querySelector('.no-js')); // Removes the no-js warning
			for (var i = 0; i < Game.size; i++) {
				for (var j = 0; j < Game.size; j++) {
					var el = document.createElement('div');
					el.setAttribute('data-x', i);
					el.setAttribute('data-y', j);
					el.setAttribute('class', 'grid-cell grid-cell-' + i + '-' + j);
					gridDiv[grid].appendChild(el);
				}
			}
		}
	}
}

new Game(10);
console.log('Done');

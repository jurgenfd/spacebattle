import { DEBUG_MODE } from './global.js';

export class Stats {
	constructor() {
		this.shotsTaken = 0;
		this.shotsHit = 0;
		this.totalShots = parseInt(localStorage.getItem('totalShots'), 10) || 0;
		this.totalHits = parseInt(localStorage.getItem('totalHits'), 10) || 0;
		this.gamesPlayed = parseInt(localStorage.getItem('gamesPlayed'), 10) || 0;
		this.gamesWon = parseInt(localStorage.getItem('gamesWon'), 10) || 0;
		this.uuid = localStorage.getItem('uuid') || this.createUUID();
		if (DEBUG_MODE) {
			this.skipCurrentGame = true;
		}
	}
}
Stats.prototype.incrementShots = function () {
	this.shotsTaken++;
};
Stats.prototype.hitShot = function () {
	this.shotsHit++;
};
Stats.prototype.wonGame = function () {
	this.gamesPlayed++;
	this.gamesWon++;
};
Stats.prototype.lostGame = function () {
	this.gamesPlayed++;
};
// Saves the game statistics to local storage, also uploads where the user placed
// their ships to GA so that in the future I'll be able to see
// which cells humans are disproportionately biased to place ships on.
Stats.prototype.syncStats = function () {
	if (!this.skipCurrentGame) {
		var totalShots = parseInt(localStorage.getItem('totalShots'), 10) || 0;
		totalShots += this.shotsTaken;
		var totalHits = parseInt(localStorage.getItem('totalHits'), 10) || 0;
		totalHits += this.shotsHit;
		localStorage.setItem('totalShots', totalShots);
		localStorage.setItem('totalHits', totalHits);
		localStorage.setItem('gamesPlayed', this.gamesPlayed);
		localStorage.setItem('gamesWon', this.gamesWon);
		localStorage.setItem('uuid', this.uuid);
	} else {
		this.skipCurrentGame = false;
	}

	var stringifiedGrid = '';
	for (var x = 0; x < Game.size; x++) {
		for (var y = 0; y < Game.size; y++) {
			stringifiedGrid += '(' + x + ',' + y + '):' + mainGame.humanGrid.cells[x][y] + ';\n';
		}
	}
};
// Updates the sidebar display with the current statistics
Stats.prototype.updateStatsSidebar = function () {
	var elWinPercent = document.getElementById('stats-wins');
	var elAccuracy = document.getElementById('stats-accuracy');
	elWinPercent.innerHTML = this.gamesWon + " of " + this.gamesPlayed;
	elAccuracy.innerHTML = Math.round((100 * this.totalHits / this.totalShots) || 0) + "%";
};
// Reset all game vanity statistics to zero. Doesn't reset your uuid.
Stats.prototype.resetStats = function (e) {
	// Skip tracking stats until the end of the current game or else
	// the accuracy percentage will be wrong (since you are tracking
	// hits that didn't start from the beginning of the game)
	Game.stats.skipCurrentGame = true;
	localStorage.setItem('totalShots', 0);
	localStorage.setItem('totalHits', 0);
	localStorage.setItem('gamesPlayed', 0);
	localStorage.setItem('gamesWon', 0);
	localStorage.setItem('showTutorial', true);
	Game.stats.shotsTaken = 0;
	Game.stats.shotsHit = 0;
	Game.stats.totalShots = 0;
	Game.stats.totalHits = 0;
	Game.stats.gamesPlayed = 0;
	Game.stats.gamesWon = 0;
	Game.stats.updateStatsSidebar();
};
Stats.prototype.createUUID = function (len, radix) {
	/*! ripped from	mailto:robert@broofa.com */
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
		uuid = [], i;
	radix = radix || chars.length;

	if (len) {
		// Compact form
		for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
	} else {
		// rfc4122, version 4 form
		var r;

		// rfc4122 requires these characters
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';

		// Fill in random data.  At i==19 set the high bits of clock sequence as
		// per rfc4122, sec. 4.1.5
		for (i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random() * 16;
				uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
			}
		}
	}

	return uuid.join('');
};

import { Game } from './battleGame.js';

export class Stats {
	constructor() {
		this.shotsTaken = 0;
		this.shotsHit = 0;
		this.totalShots = parseInt(localStorage.getItem('totalShots')) || 0;
		this.totalHits = parseInt(localStorage.getItem('totalHits')) || 0;
		this.gamesPlayed = parseInt(localStorage.getItem('gamesPlayed')) || 0;
		this.gamesWon = parseInt(localStorage.getItem('gamesWon')) || 0;
		this.uuid = localStorage.getItem('uuid') || Stats.createUUID();
		this.skipCurrentGame = false;
	}

	incrementShots() {
		this.shotsTaken++;
	}
	hitShot() {
		this.shotsHit++;
	}
	wonGame() {
		this.gamesPlayed++;
		this.gamesWon++;
	}
	lostGame() {
		this.gamesPlayed++;
	}

	syncStats() {
		if (!this.skipCurrentGame) {
			var totalShots = parseInt(localStorage.getItem('totalShots')) || 0;
			totalShots += this.shotsTaken;
			var totalHits = parseInt(localStorage.getItem('totalHits')) || 0;
			totalHits += this.shotsHit;
			localStorage.setItem('totalShots', totalShots);
			localStorage.setItem('totalHits', totalHits);
			localStorage.setItem('gamesPlayed', this.gamesPlayed);
			localStorage.setItem('gamesWon', this.gamesWon);
			localStorage.setItem('uuid', this.uuid);
		} else {
			this.skipCurrentGame = false;
		}
	}

	updateStatsSidebar() {
		var elWinPercent = document.getElementById('stats-wins');
		var elAccuracy = document.getElementById('stats-accuracy');
		elWinPercent.innerHTML = this.gamesWon + " of " + this.gamesPlayed;
		var accuracy = 'NaN';
		if (this.totalShots !== 0) {
			accuracy = Math.round(100 * this.totalHits / this.totalShots) + " %";
		} 
		elAccuracy.innerHTML = accuracy;
	};

	// Reset all game statistics to zero. Doesn't reset uuid.
	resetStats(e) {
		var stats = e.target.stats;
		// Skip tracking stats until the end of the current game or else
		// the accuracy percentage will be wrong (since you are tracking
		// hits that didn't start from the beginning of the game)
		stats.skipCurrentGame = true;
		stats.shotsTaken = 0;
		stats.shotsHit = 0;
		stats.totalShots = 0;
		stats.totalHits = 0;
		stats.gamesPlayed = 0;
		stats.gamesWon = 0;

		localStorage.setItem('totalShots', 0);
		localStorage.setItem('totalHits', 0);
		localStorage.setItem('gamesPlayed', 0);
		localStorage.setItem('gamesWon', 0);

		stats.updateStatsSidebar();
	};

	/*! ripped from	mailto:robert@broofa.com JFD: The ! instructs a minifier to keep this in.*/
	static createUUID(len, radix) {
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
	}
}

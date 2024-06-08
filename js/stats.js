import { Game } from './battleGame.js';

export class Stats {
	constructor() {
		this.shotsTaken = 0;
		this.shotsHit = 0;
		this.totalShots = parseInt(localStorage.getItem('totalShots')) || 0; // TODO: JFD: radix can be omitted
		this.totalHits = parseInt(localStorage.getItem('totalHits')) || 0;
		this.gamesPlayed = parseInt(localStorage.getItem('gamesPlayed')) || 0;
		this.gamesWon = parseInt(localStorage.getItem('gamesWon')) || 0;
		this.uuid = localStorage.getItem('uuid') || Stats.createUUID();
		this.skipCurrentGame = false; // TODO: check if needed to be true when not debugging
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
		elAccuracy.innerHTML = Math.round((100 * this.totalHits / this.totalShots) || 0) + "%";
	};

	// Reset all game statistics to zero. Doesn't reset uuid.
	resetStats(e) {
		// Skip tracking stats until the end of the current game or else
		// the accuracy percentage will be wrong (since you are tracking
		// hits that didn't start from the beginning of the game)
		this.stats.skipCurrentGame = true;
		localStorage.setItem('totalShots', 0);
		localStorage.setItem('totalHits', 0);
		localStorage.setItem('gamesPlayed', 0);
		localStorage.setItem('gamesWon', 0);
		this.stats.shotsTaken = 0;
		this.stats.shotsHit = 0;
		this.stats.totalShots = 0;
		this.stats.totalHits = 0;
		this.stats.gamesPlayed = 0;
		this.stats.gamesWon = 0;
		this.stats.updateStatsSidebar();
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

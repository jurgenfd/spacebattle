import { CONST } from './global.js';
import { Grid } from './grid.js';
import { Ship } from './ship.js';
import { Fleet } from './fleet.js';
/** Based on Stijn Smulders API forked to:
 * https://github.com/jurgenfd/webdev-javascript-notes
 */

/** TODO: eliminate the "Data Clump" code smell and use it in other code as well. */
export class Coor {
	/** @param {number} x @param {number} y */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

export class IO {
	// JS has no static const ;-)
	static api_url = 'https://avans-webdev-zeeslag.azurewebsites.net';
	static playerName = 'spacebattle_human_player';
	// v for Dutch: vliegdekschip, s for slagschip, s for onderzeeër, o for onderzeeër, p for patrouilleschip
	// as defined in CONST.AVAILABLE_SHIPS
	static shipSlugList = 'vssooopppp'.split('');
	// v for Dutch: vliegdekschip, s for slagschip, s for onderzeeër, o for onderzeeër, p for patrouilleschip
	/** @param {Game} game */
	constructor(game) {
		this.game = game;
		this.gameId = undefined;
		this.wasAlive = false;
		IO.ping();
	}

	/**
	 * @returns {Promise<boolean>}	 
	 * If the server responds set wasAlive */
	static async ping() {
		let response = await fetch(`${IO.api_url}`);
		let responseObject = await response;
		debug("responseObject from io.ping():")
		console.log(responseObject); // needs console.log to show the object
		if (responseObject.ok) {
			debug("Ping successful");
			this.wasAlive = true;
			return true;
		}
		return false;
	}

	async saveServerGame() {

		let serverBoard = this.toServerBoard(true);

		//Step 1 - Create a server-side game 
		let create_game_body = {
			player1: IO.playerName,
			opponentIsAI: true
		}
		let response = await IO.send_json_post(IO.getUrlEnd('game'), create_game_body)
		let serverGame = await response.json();
		console.log("Server created game:")
		debug(serverGame);
		this.gameId = serverGame._id;

		//Step 2 - Get the server-side game from the server
		response = await fetch(`${IO.api_url}/game/${this.gameId}`)
		let one_game = await response.json();
		console.log("One game:")
		console.log(one_game);

		//Step 3 - Push the human's board server-side
		let gameBoard_for_submit = {
			"board": serverBoard
		}
		let request_url = IO.getUrlEnd(`game/${this.gameId}/board/${IO.playerName}`);
		response = await IO.send_json_post(request_url, gameBoard_for_submit);
		let board_result = await response.json();
		console.log("Board result:")
		console.log(board_result);

	}

	/**
	 * @param {boolean} useHumanPlayer 
	 * @returns {Array<Array<string>>} board
	 */
	toServerBoard(useHumanPlayer) {
		let grid = this.game.humanGrid
		let fleet = this.game.humanFleet;
		if (!useHumanPlayer) {
			grid = this.game.computerGrid;
			fleet = this.game.computerFleet;
		}
		let board = [];
		for (var x = 0; x < CONST.SIZE; x++) {
			let row = [];
			for (var y = 0; y < CONST.SIZE; y++) {
				let coor = new Coor(x, y);
				let cellValueJson = this.toServerCell(grid.cells[x][y], coor, fleet);
				row.push(cellValueJson);
			}
			board.push(row);
		}
		return board;
	}

	/**
	 * @param {number} cell
	 * @param {Coor} coor
	 * @param {Fleet} fleet
	 */
	toServerCell(cell, coor, fleet) {
		switch (cell) {
			case CONST.TYPE_EMPTY:
				return "0";
			case CONST.TYPE_SHIP:
				let ship = fleet.findShipByCoords(coor.x, coor.y);
				return IO.getShipSlug(ship.type);
			default:
				error("There was an error trying to get the cell info for cell: " + cell);
				return "0";
		}
	}
	/**
	 * 
	 * @param {string} type 
	 * @returns {string} character for specific ship type
	 */
	static getShipSlug(type) {
		// AVAILABLE_SHIPS: ['carrier', 'battleship', 'destroyer', 'submarine', 'patrolboat'],

		var index = CONST.AVAILABLE_SHIPS.indexOf(type);
		if (index < 0) {
			error("There was an error trying to get the ship slug for type: " + type);
			return "0";
		}
		return IO.shipSlugList[index];
	}

	/** Get a remote game */
	async loadGame() {
		debug("ignoring loadGame() for now");
	}

	static getUrlEnd(endpoint) {
		return `${IO.api_url}/` + endpoint;
	}

	/**
	 * @param {string} url 
	 * @param {object} body 
	 * @returns {Promise<Response>}
	 */
	static send_json_post(url, body) {
		let bodyString = JSON.stringify(body);
		return fetch(url, {
			method: "POST", body: bodyString,
			headers: { "Content-Type": "application/json" }
		});
	}


	/**
	 * @param {string} url 
	 * @returns {Promise<Response>}
	 */
	static send_get(url) {
		return fetch(url, { method: "GET" });
	}
}
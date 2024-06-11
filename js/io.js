import { CONST } from './global.js';
import { Grid } from './grid.js';
import { Ship } from './ship.js';
import { Fleet } from './fleet.js';
/** Based on Stijn Smulders API forked to:
 * https://github.com/jurgenfd/webdev-javascript-notes
 */
export class IO {
	// JS has no static const ;-)
	static api_url = 'https://avans-webdev-zeeslag.azurewebsites.net';
	static playerName = 'spacebattle_human_player';
	// v for Dutch: vliegdekschip, s for slagschip, s for onderzeeër, o for onderzeeër, p for patrouilleschip
	static shipSlugList = 'vssop'.split(''); 

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
		console.log("responseObject:")
		console.log(responseObject);
		if (responseObject.ok) {
			debug("Ping successful");
			this.wasAlive = true;
			return true;
		}
		return false;
	}

	async saveServerGame() {
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
		let serverBoard = this.toServerBoard(true);
		let gameBoard_for_submit = {
			"board": serverBoard
		}
		response = await send_post(`${IO.api_url}/game/${this.gameId}/board/${playerName}`, gameBoard_for_submit)
		let board_result = await response.json();
		console.log("Board result:")
		console.log(board_result);
	}

	/**
	 * @param {boolean} useHumanPlayer 
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
				let cellValueJson = this.toServerCell(grid.cells[x][y], fleet);
				row.push(cellValueJson);
			}
			board.push(row);
		}
	}

	toServerCell(cell, fleet) {
		switch (cell) {
			case CONST.TYPE_EMPTY:
				return "0";
			case CONST.TYPE_SHIP:
				let ship = fleet.findShipByCoords(x, y);
				return getShipSlug(shipSlugList[ship.type]);
			default:
				error("There was an error trying to get the cell info for cell: " + cell);
				return "0";
		}
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

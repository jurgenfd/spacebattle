import { Game } from './battleGame.js';

/** var is function-scoped and initialized automatically to undefined. 
 * let is block-scoped; here it doesn't matter.*/
var game = new Game();
game.setupAI(); // TODO: make lazy.
game.setupIO();

let current_game = JSON.parse(localStorage.getItem("selected_game"));
if (current_game) {
    game.io.loadRemoteGame(current_game);
}

debug('Done');

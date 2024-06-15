import { Game } from './battleGame.js';

/** var is function-scoped and initialized automatically to undefined. 
 * let is block-scoped; here it doesn't matter.*/
// JFD: Exposed for cheating and debugging from util.js. Real dirty though?
window.game = new Game();
game.setupAI();
game.setupIO();
let current_game = JSON.parse(localStorage.getItem("selected_game"));
if (current_game) {
    game.io.loadServerGame(current_game);
}

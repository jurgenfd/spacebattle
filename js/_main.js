import { Game } from './battleGame.js';

/** var is function-scoped and initialized automatically to undefined. 
 * let is block-scoped; here it doesn't matter.*/
var game = new Game();
game.setupAI(); // TODO: make lazy.
game.setupIO();
console.log('Done from _main.js');

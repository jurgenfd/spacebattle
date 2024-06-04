// Jurgen Doreleijers based on https://github.com/billmei/battleboat
console.log('Start the game when ready ;-).');

console.log("If you want to try stuff out, run %csetDebug(true);%c in the " +
	"console before doing anything. You'll also get access to some cool features.",
	"background: #000; color: #0f0; padding: 2px 5px; border-radius: 2px;", "");
// debugger;

import { Game } from './game.js';
new Game(10);
console.log('Done');


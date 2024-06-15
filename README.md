# spaceBattle

SpaceBattle - AI beats space captain.

// Jurgen Doreleijers based on https://github.com/billmei/battleboat

Stuff added w.r.t. Bill's
- Added flexbox layouts to game, help-text, and grid-set.
- Converted single .js file to module-based setup with a dozen of modules.
- CHEAT mode.
- Published to private server at: https://ododo.nl/spacebattle/
- Help made optional with nice tooltip.
- Saving to with Zeeslag api at 'https://avans-webdev-zeeslag.azurewebsites.net'
- Removed tutorial because my simplifications required it no more.
- Changed roster to that required by Zeeslag
- Added variables i.s.o. magic numbers in CSS and JS
- Fixed stat values bugs
- Added @type in common spots to aid nav in IDEs.
- Worked mostly in Chrome but also in Safari Dev Tools
- Understand the probability alg. in ai.js.
- Debugged the probs. in ai.js so the opening book doesn't become dominant.
- Rewrote to advanced loops as much as possible
- Refactored to remove duplicate code

Differences between this game and the setup in school assignment with Zeeslag are:
- Boats of same length have different names here. I.e. 
    Submarine and Destroyer both have length 3.

TODO: 
- Understand the probability alg. in ai.js.
- Test restarting after a game.

FIXME:
- Sometimes in the human board a square is set to not to be sunk where the rest of the ship is. ;-)
Always happens when horizontally finishing the last one on the right. The left square is bad.
- On mobile the touch for the tooltip fails.

Publish from local dev machine to home server
rsync -ave ssh /Volumes/Sleuteld/Avans/WebDev/Code/spacebattle \
  jd@dododoos:/Users/jd/Sites


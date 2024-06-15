# spaceBattle

SpaceBattle - AI beats space captain.

// Jurgen Doreleijers based on https://github.com/billmei/battleboat

Stuff added w.r.t. Bill's
- Converted single .js file to module-based setup with a dozen of modules.
- CHEAT mode.
- Published to private server at: https://ododo.nl/spacebattle/
- Help made optional with nice tooltip.
- Saving to with Zeeslag api at 'https://avans-webdev-zeeslag.azurewebsites.net'
- Removed tutorial
- Changed roster to that required by Zeeslag
- Added variables i.s.o. magic numbers in CSS and JS
- Fixed stat values

Diffs with setup in assignment
- Boats of same length have different names here. I.e. 
    Submarine and Destroyer both have length 3.

TODO: 
-

Known bugs
- Sometimes a square is set to not to be sunk where the rest of the ship is. ;-)
Always happens when horizontally finishing the last one on the right. The left square is bad.
- On mobile the touch for the tooltip fails.

Publish from local dev machine to home server
rsync -ave ssh /Volumes/Sleuteld/Avans/WebDev/Code/spacebattle \
  jd@dododoos:/Users/jd/Sites


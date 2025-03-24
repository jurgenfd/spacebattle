# spaceBattle

SpaceBattle - AI beats space captain.

// Jurgen Doreleijers - https://github.com/jurgenfd/spacebattle/tree/main
based on https://github.com/billmei/battleboat



Stuff added w.r.t. Bill's (one dozen items)
- Added flexbox layouts to game, help-text, and grid-set.
- Converted single .js file to module-based setup with a dozen of modules.
- CHEAT mode added.
- Published to private server at: https://ododo.nl/spacebattle/
- Help made optional with nice disappearing tooltip.
- Saving to Zeeslag api at 'https://avans-webdev-zeeslag.azurewebsites.net'
- Removed tutorial because the simplifications no longer required it.
- Removed the data leak to GA ;-)
- Changed fleet roster to that required by Zeeslag
- Replaced the magic numbers in CSS and JS by const's.
- Fixed stat values bugs
- Added @type in common spots to aid nav in IDEs.

Notes
- Worked mostly in Chrome but also in Safari Dev Tools
- Understand the probability alg. in ai.js.
- Debugged the probs. in ai.js so the opening book doesn't become dominant.
- Rewrote to advanced loops as much as possible
- Refactored to remove duplicate code


Differences between this game and the school assignment "Zeeslag" are:
- Boats of same length have different names here. I.e. 
    Submarine and Destroyer both have length 3.

TIP:
- Jasper: rewrite with template for html already in .html. Or is this easier with
a framework still?
- Show real async functionality without await's. Because they kinda cancel it again.

OUTSTANDING:
- Test restarting after a game.

FIXME:
- On mobile the touch for the tooltip fails.
- Extremely quick actions can lead to unforeseen throwables.

<!-- 
Publish from local dev machine to home server
rsync -ave ssh /Volumes/Sleuteld/Avans/WebDev/Code/spacebattle \
  jd@dododoos:/Users/jd/Sites
-->
- Added funny spaceship names
<!-- Was boring     Carrier
					Battleship
					Missiler
					Submarine
					Destroyer
					Deepmarine
					Patrol Boat
					Surfboard
					Dinghy
					Liveboat 
You might also like the result of prompt below:
"""
Give me ten funny names for spaceships. Some should hint on how large they are and order them by largest size first. The names should be 12 or less chars without spaces.
My daughter thought this was the 💣
					GalaxyGiant
					StarCrusher
					BigDipper
					MoonMover
					SunSkipper
					CometTail
					SpaceBug
					TinyBlip
					NanoShip
					BitVoyager -->

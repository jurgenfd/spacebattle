# spaceBattle

SpaceBattle - AI beats space captain.

// Jurgen Doreleijers based on https://github.com/billmei/battleboat

Diffs with setup in assignment
- Boats of same length have different names here. I.e. 
    Submarine and Destroyer both have length 3.

TODO: Known bugs
- Sometimes a square is set to not to be sunk where the rest of the ship is. ;-)
Always happens when horizontally finishing the last one on the right. The left square is bad.
- On mobile the touch for the tooltip fails.

Publish from local dev machine to home server
rsync -ave ssh /Volumes/Sleuteld/Avans/WebDev/Code/spacebattle \
  jd@dododoos:/Users/jd/Sites

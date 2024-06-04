// Browser compatibility workaround for transition end event names.
// From modernizer: http://stackoverflow.com/a/9090128
export function transitionEndEventName() {
	var i,
		undefined,
		el = document.createElement('div'),
		transitions = {
			'transition':'transitionend'
		};

	for (i in transitions) {
		if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
			return transitions[i];
		}
	}
}

// Returns a random number between min (inclusive) and max (exclusive)
export function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}

// Toggles on or off DEBUG_MODE
export function setDebug(val) {
	DEBUG_MODE = val;
	localStorage.setItem('DEBUG_MODE', val);
	localStorage.setItem('showTutorial', 'false');
	window.location.reload();
}

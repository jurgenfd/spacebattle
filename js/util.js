// function attached to window object
(function () {
    /** Exposed top-level function for debugging in browser. */
    window.setLogLevel = function (val) {
        window.logLevel = val;
        debug('Debugging set to: ' + window.logLevel);
    };

    /** Order matters in this list */
    let LOG_LEVELS = 'DEBUG INFO WARNING ERROR'.split(' ');
    window.logLevel = LOG_LEVELS[1]; // default

    window.debug = function (message) {
        if (LOG_LEVELS.indexOf(window.logLevel) <= 0) {
            console.debug(LOG_LEVELS[0] + ': ' + message);
        }
    };
    window.log = function (message) {
        if (LOG_LEVELS.indexOf(window.logLevel) <= 1) {
            console.log(LOG_LEVELS[1] + ': ' + message);
        }
    };
    window.warn = function (message) {
        if (LOG_LEVELS.indexOf(window.logLevel) <= 2) {
            console.warn(LOG_LEVELS[2] + ': ' + message);
        }
    };
    window.error = function (message) {
        console.error(LOG_LEVELS[3] + ': ' + message);
    };
})();
setLogLevel('DEBUG');
// setLogLevel('WARNING');
// Below uses some markup for the console message and not be routed thru the hand-rolled logger.
console.log("If you want to try stuff out, run %csetLogLevel('DEBUG');%c in the " +
    "console before doing anything. You'll also get access to some cool features.",
    "background: #000; color: #0f0; padding: 2px 5px; border-radius: 2px;", "");

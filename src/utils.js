(function (w) {

    var log = w.console.log.bind(w.console);

    function fromMidiRange(options) {
        var result;
        options = options || {};
        result = options.scale / 127 * options.velocity;
        if (options.reverse) {
            result = options.scale - result;
        }
        if (options.round) {
            result = Math.floor(result);
        }
        if (typeof options.trim !== 'undefined') {
            result = result.toFixed(options.trim);
        }
        return result;
    }

    function reverseMidiRange(value) {
         return 127 - value;
    }

    function isUndefined(value) {
        return typeof value === 'undefined';
    }

    function runCallback(func, context) {
        if (typeof func === 'function') {
            try {
                func.apply(context, Array.prototype.slice.call(arguments, 2));
            } catch (exc) {
                _err('failed to run callback', exc);
            }
        }
    }

    w.utils = {
        log: log,
        fromMidiRange: fromMidiRange,
        reverseMidiRange: reverseMidiRange,
        isUndefined: isUndefined,
        runCallback: runCallback
    };

})(window);
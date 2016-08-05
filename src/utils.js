(function (w) {

    w.utils = {

        log: w.console.log.bind(w.console),

        fromMidiRange: function (options) {
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

    }

})(window);
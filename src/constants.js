(function (w) {

    const keyMappings = (function () {
        var range = [];
        for (var i = 0; i < 25; i++) {
            range[i] = i + 48;
        }
        return range;
    })();

    const padMappings = [
        50, 45, 51, 49, 36, 38, 42, 46
    ];

    const rainbowColors = [
        '#f44336',
        '#ff9800',
        '#ffeb3b',
        '#4caf50',
        '#2196f3',
        '#3f51b5',
        '#9c27b0'
    ];


    w.constants = {
        keyMappings: keyMappings,
        padMappings: padMappings,
        rainbowColors: rainbowColors
    };

})(window);
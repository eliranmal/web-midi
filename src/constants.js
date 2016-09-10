(function (w) {

    const keyNoteMap = (function () {
        var range = [];
        for (var i = 0; i < 25; i++) {
            range[i] = i + 48;
        }
        return range;
    })();

    const padNoteMap = [
        50, 45, 51, 49,
        36, 38, 42, 46
    ];

    const knobNoteMap = [
        74, 71, 91, 93,
        73, 72, 5, 84
    ];

    const transportNoteMap = [
        113,    // loop
        114,    // rewind
        115,    // forward
        116,    // stop
        117,    // play
        118     // record
    ];

    const transportCommandMap = [
        'loop',
        'rewind',
        'forward',
        'stop',
        'play',
        'record'
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
        keyNoteMap: keyNoteMap,
        padNoteMap: padNoteMap,
        knobNoteMap: knobNoteMap,
        transportNoteMap: transportNoteMap,
        transportCommandMap: transportCommandMap,
        rainbowColors: rainbowColors
    };

})(window);
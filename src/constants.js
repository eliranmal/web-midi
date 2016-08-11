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

    const knobNoteMap = [];

    // todo - find all transport notes
    const transportNoteMap = [
        113,    // loop
        null,   // rewind
        null,   // forward
        null,   // stop
        null,   // play
        null    // record
    ];

    const knobCommandMap = [
        'rotate', 'zoom', 'panX', 'panY'
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
        transportNoteMap: transportNoteMap,
        knobCommandMap: knobCommandMap,
        rainbowColors: rainbowColors
    };

})(window);
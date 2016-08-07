(function (w, d) {

    var volume;
    var midi, data, cmd, channel, type, note, velocity;

    var padMap = [
        50, 45, 51, 49, 36, 38, 42, 46
    ];
    var keyMap = (function () {
        var range = [];
        for (var i = 0; i < 25; i++) {
             range[i] = i + 48;
        }
        return range;
    })();

    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess({
            sysex: false
        }).then(onMIDISuccess, onMIDIFailure);
    } else {
        alert('No MIDI support in your browser.');
    }


    function onMIDISuccess(midiAccess) {
        midi = midiAccess;
        var inputs = midi.inputs.values();
        for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
            input.value.onmidimessage = onMIDIMessage;
        }
        midi.onstatechange = onStateChange;
    }

    function onMIDIMessage(event) {
        data = event.data;
        cmd = data[0] >> 4;
        channel = data[0] & 0xf;
        type = data[0] & 0xf0; // channel agnostic message type. Thanks, Phil Burk.
        note = data[1];
        velocity = data[2];

        typeController();

        var message = 'channel: ' + channel + ', cmd: ' + cmd + ', type: ' + type + '\n' + 'note: ' + note + ', velocity: ' + velocity;
        w.utils.log(message);
        print(message);
    }

    function typeController() {
        switch (type) {
            case 144: // note on
                noteOnController();
                break;
            //case 128: // note off
            //    break;
            case 224: // pitch bend
                domUpdateDecorator({
                    actionFn: w.actions.continuousRelativeScroll,
                    feedbackEl: w.dom.bendControl
                });

                break;
            case 176: // range controls (knobs/switches/faders)
                if (channel == 15) {
                    transportController();
                } else {
                    rangeController();
                }
                break;
        }
    }

    function transportController() {
        switch (note) {
            case 113: // loop
                domUpdateDecorator({
                    actionFn: w.actions.switchBackground
                });
                break;
        }
    }

    function rangeController() {
        switch (note) {
            case 1: // modulation wheel
                domUpdateDecorator({
                    actionFn: w.actions.absoluteScroll,
                    targetEl: w.dom.modControl
                });
                break;
            case 7: // volume fader
                volume = velocity;
                domUpdateDecorator({
                    actionFn: w.actions.opacity,
                    feedbackEl: w.dom.volControl
                });
                break;


            case 74: // knob 1
                domUpdateDecorator({
                    actionFn: w.actions.rotate,
                    feedbackEl: w.dom.knobControls[0],
                    targetEl: w.dom.virtualController
                });
                break;
            case 71: // knob 2
                domUpdateDecorator({
                    actionFn: w.actions.scale,
                    feedbackEl: w.dom.knobControls[1],
                    targetEl: w.dom.virtualController
                });
                break;
            case 91: // knob 3
                domUpdateDecorator({
                    actionFn: w.actions.translateX,
                    feedbackEl: w.dom.knobControls[2],
                    targetEl: w.dom.virtualController
                });
                break;
            case 93: // knob 4
                domUpdateDecorator({
                    actionFn: w.actions.translateY,
                    feedbackEl: w.dom.knobControls[3],
                    targetEl: w.dom.virtualController
                });
                break;
            case 73: // knob 5
                domUpdateDecorator({
                    actionFn: null,
                    feedbackEl: w.dom.knobControls[4],
                    targetEl: null
                });
                break;
            case 72: // knob 6
                domUpdateDecorator({
                    actionFn: null,
                    feedbackEl: w.dom.knobControls[5],
                    targetEl: null
                });
                break;
            case 5:  // knob 7
                domUpdateDecorator({
                    actionFn: null,
                    feedbackEl: w.dom.knobControls[6],
                    targetEl: null
                });
                break;
            case 84: // knob 8
                domUpdateDecorator({
                    actionFn: null,
                    feedbackEl: w.dom.knobControls[7],
                    targetEl: null
                });
                break;
        }
    }

    function noteOnController() {
        if (channel == 9) {
            padController();
        } else if (channel == 0) {
            keyController();
        }
    }

    function padController() {
        //if (velocity == 0) {
        //    return; // ignore 0 velocity - the pad's 'note-off' does that
        //}

        var targetEl = w.dom.padControls[padMap.indexOf(note)];
        domUpdateDecorator({
            actionFn: w.actions.opacity,
            targetEl: targetEl,
            reverseVelocity: true
        });
    }

    function keyController() {
        var targetEl = w.dom.keyControls[keyMap.indexOf(note)];
        domUpdateDecorator({
            actionFn: w.actions.opacity,
            targetEl: targetEl,
            reverseVelocity: true
        });
    }


    function domUpdateDecorator(options) {
        options = options || {};
        var vel = velocity;
        if (options.reverseVelocity) {
            vel = 127 - velocity;
        }
        options.actionFn && options.actionFn(vel, options.targetEl);
        options.feedbackEl && (options.feedbackEl.value = vel);
    }

    function onStateChange(event) {
        var port = event.port,
            state = port.state,
            name = port.name,
            type = port.type;
        if (type == 'input') {
            w.utils.log('name', name, 'port', port, 'state', state);
        }
    }

    function onMIDIFailure(e) {
        w.utils.log('No access to MIDI devices or your browser does not support WebMIDI API. Please use WebMIDIAPIShim ' + e);
    }

    function print(message) {
        var el = w.dom.virtualControllerDisplay;
        el && (el.textContent = message);
    }


})(window, document);

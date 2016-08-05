(function (w, d) {

    var volume;
    var midi, data, cmd, channel, type, note, velocity;


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
                    inputControlEl: w.dom.bendControl
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
                    inputControlEl: w.dom.volControl
                });
                break;

            case 74: // knob 1
                domUpdateDecorator({
                    actionFn: w.actions.rotate,
                    inputControlEl: w.dom.knobControls[0],
                    targetEl: w.dom.virtualController
                });
                break;
            case 71: // knob 2
                domUpdateDecorator({
                    actionFn: null,
                    inputControlEl: w.dom.knobControls[1],
                    targetEl: null
                });
                break;
            case 91: // knob 3
                domUpdateDecorator({
                    actionFn: null,
                    inputControlEl: w.dom.knobControls[2],
                    targetEl: null
                });
                break;
            case 93: // knob 4
                domUpdateDecorator({
                    actionFn: null,
                    inputControlEl: w.dom.knobControls[3],
                    targetEl: null
                });
                break;
            case 73: // knob 5
                domUpdateDecorator({
                    actionFn: null,
                    inputControlEl: w.dom.knobControls[4],
                    targetEl: null
                });
                break;
            case 72: // knob 6
                domUpdateDecorator({
                    actionFn: null,
                    inputControlEl: w.dom.knobControls[5],
                    targetEl: null
                });
                break;
            case 5:  // knob 7
                domUpdateDecorator({
                    actionFn: null,
                    inputControlEl: w.dom.knobControls[6],
                    targetEl: null
                });
                break;
            case 84: // knob 8
                domUpdateDecorator({
                    actionFn: null,
                    inputControlEl: w.dom.knobControls[7],
                    targetEl: null
                });
                break;
        }
    }

    function noteOnController() {
        if (channel == 9) {
            padController();
        }
        switch (note) {
            case 48: // C-4
                //midiMessageDecorator(onKeyC4, null, velocity);
                break;
        }
    }

    function padController() {
        //if (velocity == 0) {
        //    return; // ignore 0 velocity - the pad's 'note-off' does that
        //}
        switch (note) {
            case 50: // pad 1
                padDomUpdateDecorator(0);
                break;
            case 45: // pad 2
                padDomUpdateDecorator(1);
                break;
            case 51: // pad 3
                padDomUpdateDecorator(2);
                break;
            case 49: // pad 4
                padDomUpdateDecorator(3);
                break;
            case 36: // pad 5
                padDomUpdateDecorator(4);
                break;
            case 38: // pad 6
                padDomUpdateDecorator(5);
                break;
            case 42: // pad 7
                padDomUpdateDecorator(6);
                break;
            case 46: // pad 8
                padDomUpdateDecorator(7);
                break;
        }
    }
    
    function padDomUpdateDecorator(padIndex) {
        var targetEl = w.dom.padControls[padIndex];
        if (volume == 0) {
            targetEl = d.body;
        }
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
        options.inputControlEl && (options.inputControlEl.value = vel);
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

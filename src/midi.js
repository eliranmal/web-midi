(function (w, d) {

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

        switch (type) {
            case 144: // note on
                switch (note) {
                    case 48: // C-4
                        //midiMessageDecorator(onKeyC4, null, velocity);
                        break;
                }
                break;
            case 128: // note off
                break;
            case 224: // pitch bend
                midiMessageDecorator(w.actions.continuousRelativeScroll, w.dom.bendControl, velocity);
                break;
            case 176: // faders, knobs, pitch/mod
                switch (note) {
                    case 1: // modulation wheel
                        midiMessageDecorator(w.actions.absoluteScroll, w.dom.modControl, velocity);
                        break;
                    case 73: // knob on bottom left
                        w.actions.rotate(velocity);
                        break;
                    case 74: // knob on top left
                        midiMessageDecorator(w.actions.opacity, w.dom.faderControl, velocity);
                        break;
                    case 113: // loop button
                        midiMessageDecorator(w.actions.switchBackground, null, velocity);
                        break;
                }
                break;
        }

        w.utils.log('key data [channel: ' + channel + ', cmd: ' + cmd + ', type: ' + type + ' , note: ' + note + ' , velocity: ' + velocity + ']');
    }

    function midiMessageDecorator(onHandler, controlEl, vel) {
        onHandler(vel);
        controlEl && (controlEl.value = vel);
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

})(window, document);

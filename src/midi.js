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

        typeController();

        w.utils.log('key data [channel: ' + channel + ', cmd: ' + cmd + ', type: ' + type + ' , note: ' + note + ' , velocity: ' + velocity + ']');
    }

    function typeController() {
        switch (type) {
            case 144: // note on
                noteOnController();
                break;
            //case 128: // note off
            //    break;
            case 224: // pitch bend
                domUpdateDecorator(w.actions.continuousRelativeScroll, w.dom.bendControl);
                break;
            case 176: // range controls
                rangeController();
                break;
        }
    }

    function noteOnController() {
        switch (note) {
            case 48: // C-4
                //midiMessageDecorator(onKeyC4, null, velocity);
                break;
        }
    }

    function rangeController() {
        switch (note) {
            case 1: // modulation wheel
                domUpdateDecorator(w.actions.absoluteScroll, w.dom.modControl);
                break;
            case 7: // volume fader
                domUpdateDecorator(w.actions.opacity, w.dom.faderControl);
                break;
            case 73: // knob on bottom left
                domUpdateDecorator(w.actions.rotate, null);
                break;
            //case 74: // knob on top left
            //    break;
            case 113: // loop button
                domUpdateDecorator(w.actions.switchBackground, null);
                break;
        }
    }


    function domUpdateDecorator(actionFn, controlEl) {
        actionFn(velocity);
        controlEl && (controlEl.value = velocity);
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

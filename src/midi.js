(function (w, d) {

    function init() {
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess({
                sysex: false
            }).then(_onMidiSuccess, _onMidiFailure);
        } else {
            alert('on shit, your browser does not support MIDI. open this in chrome, will ya?');
        }
    }

    function _onMidiFailure(e) {
        w.utils.log('no access to MIDI devices or your browser does not support WebMIDI API. please use WebMIDIAPIShim ' + e);
    }

    function _onMidiSuccess(midiAccess) {
        var input,
            inputs = midiAccess.inputs.values();
        for (input = inputs.next(); input && !input.done; input = inputs.next()) {
            input.value.onmidimessage = _onMidiMessage;
        }
        midiAccess.onstatechange = _onMidiStateChange;
    }

    function _onMidiStateChange(event) {
        var port = event.port,
            state = port.state,
            name = port.name,
            type = port.type;
        if (type == 'input') {
            w.utils.log('name', name, 'port', port, 'state', state);
        }
    }

    function _onMidiMessage(event) {
        var data = event.data,
            cmd = data[0] >> 4,
            channel = data[0] & 0xf,
            type = data[0] & 0xf0, // channel agnostic message type. Thanks, Phil Burk.
            note = data[1],
            velocity = data[2],
            midiMessageData = {
                cmd: cmd,
                channel: channel,
                type: type,
                note: note,
                velocity: velocity
            };

        _handleMidiMessage(midiMessageData);

        var message = 'channel: ' + channel + ', cmd: ' + cmd + ', type: ' + type + '\n' + 'note: ' + note + ', velocity: ' + velocity;
        w.utils.log(message);
        _display(midiMessageData);
    }

    function _handleMidiMessage(midiMessageData) {
        switch (midiMessageData.type) {
            case 144: // note on
                _handleNoteOn(midiMessageData);
                break;
            //case 128: // note off
            //    break;
            case 224: // pitch bend
                w.commands.pitchBend({
                    velocity: midiMessageData.velocity,
                    echoEl: w.dom.el.bendControl
                });
                break;
            case 176: // range controls (knobs/switches/faders)
                switch (midiMessageData.channel) {
                    case 15:
                        _handleTransportTrigger(midiMessageData);
                        break;
                    case 0:
                        _handleRangeTrigger(midiMessageData);
                        break;
                }
                break;
        }
    }

    function _handleTransportTrigger(midiMessageData) {
        // todo - use transportNoteMap constant, with util function to map these contants to actions (and use that util everywhere)
        var transportIndex = w.constants.transportNoteMap.indexOf(midiMessageData.note);
        w.utils.log('transportIndex', transportIndex);
        switch (midiMessageData.note) {
            case 113: // loop
                w.commands.image({
                    velocity: midiMessageData.velocity
                });
                break;
        }
    }

    function _handleRangeTrigger(midiMessageData) {
        var knobIndex,
            note = midiMessageData.note,
            velocity = midiMessageData.velocity;

        switch (note) {
            case 1: // modulation
                w.commands.modulation({
                    velocity: velocity,
                    echoEl: w.dom.el.modControl
                });
                break;
            case 7: // volume
                w.commands.volume({
                    el: w.dom.el.virtualController,
                    velocity: velocity,
                    echoEl: w.dom.el.volControl
                });
                break;
            default:
                // knobs
                knobIndex = w.constants.knobNoteMap.indexOf(note);
                if (knobIndex !== -1) {
                    w.commands['knob' + (knobIndex + 1)]({
                        velocity: velocity,
                        el: w.dom.el.virtualController,
                        echoEl: w.dom.el.knobControls[knobIndex]
                    });
                }
                break;
        }

    }

    function _handleNoteOn(midiMessageData) {
        switch (midiMessageData.channel) {
            case 0:
                _handleKeyTrigger(midiMessageData);
                break;
            case 9:
                _handlePadTrigger(midiMessageData);
                break;
        }
    }

    function _handleKeyTrigger(midiMessageData) {
        var keyIndex = w.constants.keyNoteMap.indexOf(midiMessageData.note),
            keyEl = w.dom.el.keyControls[keyIndex];
        w.commands.key({
            velocity: midiMessageData.velocity,
            echoEl: keyEl,
            index: keyIndex
        });
    }

    function _handlePadTrigger(midiMessageData) {
        var padIndex = w.constants.padNoteMap.indexOf(midiMessageData.note),
            padEl = w.dom.el.padControls[padIndex];
        w.commands['pad' + (padIndex + 1)]({
            velocity: midiMessageData.velocity,
            el: padEl,
            echoEl: padEl
        });
    }


    function _display(midiMessageData) {
        w.dom.setText({
            el: w.dom.el.displayLogChannel,
            message: midiMessageData.channel
        });
        w.dom.setText({
            el: w.dom.el.displayLogCmd,
            message: midiMessageData.cmd
        });
        w.dom.setText({
            el: w.dom.el.displayLogType,
            message: midiMessageData.type
        });
        w.dom.setText({
            el: w.dom.el.displayLogNote,
            message: midiMessageData.note
        });
        w.dom.setText({
            el: w.dom.el.displayLogVelocity,
            message: midiMessageData.velocity
        });
    }


    w.midi = {
        init: init
    };

})(window, document);

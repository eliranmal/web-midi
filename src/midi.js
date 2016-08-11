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
        w.utils.log('No access to MIDI devices or your browser does not support WebMIDI API. Please use WebMIDIAPIShim ' + e);
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
            velocity = data[2];

        _handleMidiMessage({
            cmd: cmd,
            channel: channel,
            type: type,
            note: note,
            velocity: velocity
        });

        var message = 'channel: ' + channel + ', cmd: ' + cmd + ', type: ' + type + '\n' + 'note: ' + note + ', velocity: ' + velocity;
        w.utils.log(message);
        _show(message);
    }

    function _handleMidiMessage(midiMessageData) {
        switch (midiMessageData.type) {
            case 144: // note on
                _handleNoteOn(midiMessageData);
                break;
            //case 128: // note off
            //    break;
            case 224: // pitch bend
                _domUpdateDecorator({
                    actionFn: w.commands.stickyScroll,
                    feedbackEl: w.dom.el.bendControl
                }, midiMessageData);

                break;
            case 176: // range controls (knobs/switches/faders)
                switch (channel) {
                    case 15:
                        _handleTransportTrigger(midiMessageData);
                        break;
                    default:
                        _handleRangeTrigger(midiMessageData);
                        break;
                }
                break;
        }
    }

    function _handleTransportTrigger(midiMessageData) {
        // todo - use transportNoteMap constant, with util function to map these contants to actions (and use that util everywhere)
        //w.constants.transportNoteMap.indexOf(midiMessageData.note);
        switch (midiMessageData.note) {
            case 113: // loop
                _domUpdateDecorator({
                    actionFn: w.commands.image
                }, midiMessageData);
                break;
        }
    }

    function _handleRangeTrigger(midiMessageData) {
        switch (midiMessageData.note) {
            case 1: // modulation wheel
                _domUpdateDecorator({
                    actionFn: w.commands.scroll,
                    targetEl: w.dom.el.modControl
                }, midiMessageData);
                break;
            case 7: // volume fader
                _domUpdateDecorator({
                    actionFn: w.commands.opacity,
                    feedbackEl: w.dom.el.volControl
                }, midiMessageData);
                break;


            case 74: // knob 1
                _domUpdateDecorator({
                    actionFn: w.commands.rotate,
                    feedbackEl: w.dom.el.knobControls[0],
                    targetEl: w.dom.el.virtualController
                }, midiMessageData);
                break;
            case 71: // knob 2
                _domUpdateDecorator({
                    actionFn: w.commands.zoom,
                    feedbackEl: w.dom.el.knobControls[1],
                    targetEl: w.dom.el.virtualController
                }, midiMessageData);
                break;
            case 91: // knob 3
                _domUpdateDecorator({
                    actionFn: w.commands.panX,
                    feedbackEl: w.dom.el.knobControls[2],
                    targetEl: w.dom.el.virtualController
                }, midiMessageData);
                break;
            case 93: // knob 4
                _domUpdateDecorator({
                    actionFn: w.commands.panY,
                    feedbackEl: w.dom.el.knobControls[3],
                    targetEl: w.dom.el.virtualController
                }, midiMessageData);
                break;
            case 73: // knob 5
                _domUpdateDecorator({
                    actionFn: null,
                    feedbackEl: w.dom.el.knobControls[4],
                    targetEl: null
                }, midiMessageData);
                break;
            case 72: // knob 6
                _domUpdateDecorator({
                    actionFn: null,
                    feedbackEl: w.dom.el.knobControls[5],
                    targetEl: null
                }, midiMessageData);
                break;
            case 5:  // knob 7
                _domUpdateDecorator({
                    actionFn: null,
                    feedbackEl: w.dom.el.knobControls[6],
                    targetEl: null
                }, midiMessageData);
                break;
            case 84: // knob 8
                _domUpdateDecorator({
                    actionFn: null,
                    feedbackEl: w.dom.el.knobControls[7],
                    targetEl: null
                }, midiMessageData);
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
        // todo - extract to util
        var el = w.dom.el.keyControls[w.constants.keyNoteMap.indexOf(midiMessageData.note)],
            color = w.dom.keyElColorMap.get(el);
        w.commands.color({
            el: el,
            velocity: midiMessageData.velocity,
            color: color,
            reverse: true
        });
        w.commands.opacity({
            el: el,
            velocity: midiMessageData.velocity,
            reverse: true
            //domEcho: true/el
        });
    }

    function _handlePadTrigger(midiMessageData) {
        //if (midiMessageData.velocity == 0) {
        //    return; // ignore 0 velocity - the pad's 'note-off' does that
        //}

        // todo - extract to util
        var targetEl = w.dom.el.padControls[w.constants.padNoteMap.indexOf(midiMessageData.note)];
        _domUpdateDecorator({
            actionFn: w.commands.opacity,
            targetEl: targetEl,
            reverseVelocity: true
        }, midiMessageData);
    }


    function _domUpdateDecorator(options={}, midiMessageData) {
        var vel = midiMessageData.velocity;
        if (options.reverseVelocity) {
            vel = 127 - vel;
        }
        options.actionFn && options.actionFn(vel, options.targetEl);
        options.feedbackEl && (options.feedbackEl.value = vel);
    }

    function _show(message) {
        var el = w.dom.el.virtualControllerDisplay;
        el && (el.textContent = message);
    }


    w.midi = {
        init: init
    };

})(window, document);

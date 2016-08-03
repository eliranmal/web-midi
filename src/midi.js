/**
 * Created by eliranm on 03/08/16.
 */

var log = console.log.bind(console),
    testControlsEl = document.getElementById('test-controls'),
    bendControlEl = document.getElementById('bend-control'),
    modControlEl = document.getElementById('mod-control'),
    faderControlEl = document.getElementById('fader-control');
var midi, bendIntervalId;
var data, cmd, channel, type, note, velocity;
var tickScrollDistance = 10;

// element binding

bendControlEl.addEventListener('input', function(e) {
    onBend(bendControlEl.value);
});

modControlEl.addEventListener('input', function(e) {
    onMod(modControlEl.value);
});

faderControlEl.addEventListener('input', function(e) {
    onFader(faderControlEl.value);
});

// simulate the physical control:
// jump to middle position when leaving mouse button on the bend slider
document.addEventListener('mouseup', function(e) {
    if (e.target === bendControlEl) {
        onBend(bendControlEl.value = 64);
    }
})


// request MIDI access

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    alert("No MIDI support in your browser.");
}


// midi functions

function onMIDISuccess(midiAccess) {
    midi = midiAccess;
    var inputs = midi.inputs.values();
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        input.value.onmidimessage = onMIDIMessage;
    }
    midi.onstatechange = onStateChange;
}

function onMIDIMessage(event) {
    data = event.data,
        cmd = data[0] >> 4,
        channel = data[0] & 0xf,
        type = data[0] & 0xf0, // channel agnostic message type. Thanks, Phil Burk.
        note = data[1],
        velocity = data[2];

    switch (type) {
        case 144: // note on
            switch (note) {
                case 48: // C-4
                    midiMessageDecorator(onKeyC4, null, velocity);
                    break;
            }
            break;
        case 128: // note off
            break;
        case 224: // pitch bend
            midiMessageDecorator(onBend, bendControlEl, velocity);
            break;
        case 176: // faders, knobs, pitch/mod
            switch (note) {
                case 1: // modulation wheel
                    midiMessageDecorator(onMod, modControlEl, velocity);
                    break;
                case 73: // knob on bottom left
                    rotate(velocity);
                    break;
                case 74: // knob on top left
                    midiMessageDecorator(onFader, faderControlEl, velocity);
                    break;
                case 113: // loop button
                    midiMessageDecorator(onSwitch, null, velocity);
                    break;
            }
            break;
    }

    // log('data', data, 'cmd', cmd, 'channel', channel);
    logKeyData(data);
}

function midiMessageDecorator(onHandler, controlEl, vel) {
    onHandler(vel);
    controlEl && (controlEl.value = vel);
}

function rotate(vel) {
    testControlsEl.style.webkitTransform = 'rotate(' + (360 / 127 * vel) + 'deg)';
}

function onKeyC4(vel) {
    // todo - something
}

function onMod(vel) {
    var docHeight = document.body.offsetHeight,
        y = Math.floor(docHeight - (docHeight / 127 * vel));
    // log('y', y);
    scrollTo(0, y);
}

function onFader(vel) {
    var opacity = +(1 / 127 * vel).toFixed(3);
    // log('opacity', opacity);
    document.body.style.opacity = opacity;
}

function onSwitch(vel) {
    var imageUrl;
    if (vel === 0) {
        imageUrl = 'http://subtlepatterns2015.subtlepatterns.netdna-cdn.com/patterns/sativa.png';
    } else if (vel === 127) {
        imageUrl = 'http://subtlepatterns2015.subtlepatterns.netdna-cdn.com/patterns/footer_lodyas.png';
    }
    document.body.style.backgroundImage = 'url("' + imageUrl + '")';
}

function onBend(vel) {
    var startTime,
        synchronizedInterval,
        relVelocity = vel - 64,
        absVelocity = Math.abs(relVelocity),
        interval = Math.round(Math.exp(Math.log1p(64 - absVelocity)) * .6),
        y = tickScrollDistance;

    if (relVelocity > 0) {
        y = y * -1;
    }

    clearTimeout(bendIntervalId);

    if (relVelocity !== 0) {
        startTime = new Date().getTime();

        (function timer() {
            scrollBy(0, y);
            synchronizedInterval = interval - ((new Date().getTime() - startTime) % interval);
            bendIntervalId = setTimeout(timer, synchronizedInterval);
        })();
    }
}

function onStateChange(event) {
    var port = event.port,
        state = port.state,
        name = port.name,
        type = port.type;
    if (type == "input") {
        log("name", name, "port", port, "state", state);
    }
}

function onMIDIFailure(e) {
    log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
}


// utility functions

function logKeyData(data) {
    var message = "key data [channel: " + (data[0] & 0xf) + ", cmd: " + (data[0] >> 4) + ", type: " + (data[0] & 0xf0) + " , note: " + data[1] + " , velocity: " + data[2] + "]";
    log(message);
}

function is(val) {
    return typeof val !== 'undefined';
}

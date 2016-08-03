(function (w, d) {

    var bendControlEl = d.getElementById('bend-control'),
        modControlEl = d.getElementById('mod-control'),
        faderControlEl = d.getElementById('fader-control'),
        testControlsEl = d.getElementById('test-controls');


    bendControlEl.addEventListener('input', function (e) {
        w.actions.continuousRelativeScroll(bendControlEl.value);
    });

    modControlEl.addEventListener('input', function (e) {
        w.actions.absoluteScroll(modControlEl.value);
    });

    faderControlEl.addEventListener('input', function (e) {
        w.actions.opacity(faderControlEl.value);
    });

    // simulate the physical control:
    // jump to middle position when leaving mouse button on the bend slider
    d.addEventListener('mouseup', function (e) {
        if (e.target === bendControlEl) {
            w.actions.continuousRelativeScroll(bendControlEl.value = 64);
        }
    });

    w.dom = {
        controlsContainer: testControlsEl,
        bendControl: bendControlEl,
        modControl: modControlEl,
        faderControl: faderControlEl
    };

})(window, document);
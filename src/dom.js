(function (w, d) {

    var virtualControllerDisplayEl = d.querySelector('.virtual-controller .display'),
        bendControlEl = d.querySelector('#bend-control'),
        modControlEl = d.querySelector('#mod-control'),
        volControlEl = d.querySelector('#vol-control'),
        virtualControllerEl = d.querySelector('#virtual-controller');


    bendControlEl.addEventListener('input', function (e) {
        w.actions.continuousRelativeScroll(bendControlEl.value);
    });

    modControlEl.addEventListener('input', function (e) {
        w.actions.absoluteScroll(modControlEl.value);
    });

    volControlEl.addEventListener('input', function (e) {
        w.actions.opacity(volControlEl.value);
    });

    // simulate the physical control:
    // jump to middle position when leaving mouse button on the bend slider
    d.addEventListener('mouseup', function (e) {
        if (e.target === bendControlEl) {
            w.actions.continuousRelativeScroll(bendControlEl.value = 64);
        }
    });

    w.dom = {
        virtualController: virtualControllerEl,
        bendControl: bendControlEl,
        modControl: modControlEl,
        volControl: volControlEl,
        virtualControllerDisplay: virtualControllerDisplayEl
    };

})(window, document);
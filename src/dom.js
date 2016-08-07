(function (w, d) {

    var virtualControllerDisplay = d.querySelector('.virtual-controller .display'),
        bendControl = d.querySelector('#bend-control'),
        modControl = d.querySelector('#mod-control'),
        volControl = d.querySelector('#vol-control'),
        virtualController = d.querySelector('.virtual-controller'),
        transportControls = [].slice.call(d.querySelectorAll('.transport > div')),
        padControls = [].slice.call(d.querySelectorAll('.pads > div > div')),
        keyControls = [].slice.call(d.querySelectorAll('.keys > div')),
        knobControls = [].slice.call(d.querySelectorAll('.knobs input'));
    // todo - tie transport buttons, too (and knobs!, and keys!!!)


    bendControl.addEventListener('input', function (e) {
        w.actions.continuousRelativeScroll(bendControl.value);
    });

    modControl.addEventListener('input', function (e) {
        w.actions.absoluteScroll(modControl.value);
    });

    volControl.addEventListener('input', function (e) {
        w.actions.opacity(volControl.value);
    });

    knobControls[0].addEventListener('input', function (e) {
        w.actions.rotate(knobControls[0].value, virtualController);
    });

    knobControls[1].addEventListener('input', function (e) {
        w.actions.scale(knobControls[1].value, virtualController);
    });

    knobControls[2].addEventListener('input', function (e) {
        w.actions.translateX(knobControls[2].value, virtualController);
    });

    knobControls[3].addEventListener('input', function (e) {
        w.actions.translateY(knobControls[3].value, virtualController);
    });

    // mimic the pitchbend physical control behavior:
    // jump to middle position when leaving mouse button on the bend slider
    d.addEventListener('mouseup', function (e) {
        if (e.target === bendControl) {
            w.actions.continuousRelativeScroll(bendControl.value = 64);
        }
    });

    addOpacityMouseListener(padControls);
    addOpacityMouseListener(keyControls);
    addOpacityMouseListener(transportControls);


    function addOpacityMouseListener(nodes) {
        nodes.forEach(function (node, index, collection) {
            node.addEventListener('mousedown', function (e) {
                w.actions.opacity(70, node);
            });
            node.addEventListener('mouseup', function (e) {
                w.actions.opacity(127, node);
            });
        });
    }

    w.dom = {
        virtualController: virtualController,
        bendControl: bendControl,
        modControl: modControl,
        volControl: volControl,
        transportControls: transportControls,
        padControls: padControls,
        knobControls: knobControls,
        keyControls: keyControls,
        virtualControllerDisplay: virtualControllerDisplay
    };

})(window, document);
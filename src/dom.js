(function (w, d) {

    var virtualControllerDisplay = d.querySelector('.virtual-controller .display'),
        bendControl = d.querySelector('#bend-control'),
        modControl = d.querySelector('#mod-control'),
        volControl = d.querySelector('#vol-control'),
        virtualController = d.querySelector('.virtual-controller'),
        padControlNodes = [].slice.call(d.querySelectorAll('.pads > div > div')),
        keyControlNodes = [].slice.call(d.querySelectorAll('.keys > div')),
        knobControlNodes = [].slice.call(d.querySelectorAll('.knobs input'));
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

    // mimic the pitchbend physical control behavior:
    // jump to middle position when leaving mouse button on the bend slider
    d.addEventListener('mouseup', function (e) {
        if (e.target === bendControl) {
            w.actions.continuousRelativeScroll(bendControl.value = 64);
        }
    });

    addOpacityMouseListener(padControlNodes);

    addOpacityMouseListener(keyControlNodes);


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
        padControls: padControlNodes,
        knobControls: knobControlNodes,
        keyControls: keyControlNodes,
        virtualControllerDisplay: virtualControllerDisplay
    };

})(window, document);
(function (w, d) {

    w.dom.bendControl.addEventListener('input', function (e) {
        w.commands.pitchBend(w.dom.bendControl.value);
    });

    w.dom.modControl.addEventListener('input', function (e) {
        w.commands.modulation(w.dom.modControl.value);
    });

    w.dom.volControl.addEventListener('input', function (e) {
        w.commands.opacity(w.dom.volControl.value, w.dom.virtualController);
    });

    w.dom.knobControls[0].addEventListener('input', function (e) {
        w.commands.rotate(w.dom.knobControls[0].value, w.dom.virtualController);
    });

    w.dom.knobControls[1].addEventListener('input', function (e) {
        w.commands.zoom(w.dom.knobControls[1].value, w.dom.virtualController);
    });

    w.dom.knobControls[2].addEventListener('input', function (e) {
        w.commands.panX(w.dom.knobControls[2].value, w.dom.virtualController);
    });

    w.dom.knobControls[3].addEventListener('input', function (e) {
        w.commands.panY(w.dom.knobControls[3].value, w.dom.virtualController);
    });

    // mimic the pitchbend physical control behavior:
    // jump to middle position when leaving mouse button on the bend slider
    w.dom.bendControl.addEventListener('mouseup', function (e) {
        w.commands.pitchBend(w.dom.bendControl.value = 64);
    });

    //w.dom.keyControls.forEach(function (node, index) {
    //    node.style.backgroundColor = w.constants.rainbowColors[index % w.constants.rainbowColors.length];
    //});

    w.dom.addOpacityMouseListeners(w.dom.padControls);
    w.dom.addOpacityMouseListeners(w.dom.transportControls);

    w.dom.addMouseListeners(
        w.dom.keyControls,
        function (node, index) {
            w.commands.key({
                elIndex: index,
                velocity: 60
            });
        }, function (node, index) {
            w.commands.key({
                elIndex: index,
                velocity: 0
            });
        });


    w.midi.init();


})(window, document);
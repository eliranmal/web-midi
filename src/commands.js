(function (w, d) {

    function _modulation(velocity) {
        var docHeight = d.body.offsetHeight,
            y = w.utils.fromMidiRange({
                scale: docHeight,
                velocity: velocity,
                reverse: true,
                round: true
            });
        //w.utils.log('y', y);
        w.scrollTo(0, y);
    }

    function _pitchBend(velocity) {
        w.dom.startContinuousRelativeScroll({
            velocity: velocity,
            mean: 64 // todo - redundant?
        });
    }

    function _rotate(velocity, el) {
        var degrees = w.utils.fromMidiRange({
            scale: 360,
            velocity: velocity,
            round: true
        });
        //w.utils.log('degrees', degrees);
        w.dom.appendTransform({
            el: el,
            fnName: 'rotate',
            fnParamValue: degrees,
            fnParamUnit: 'deg'
        });
    }

    function _zoom(vel, el) {
        var scaleValue = w.utils.fromMidiRange({
            scale: 5,
            velocity: vel
        });
        scaleValue = Math.pow(+scaleValue + .5, 2).toFixed(3);

        //w.utils.log('scale', scale);
        w.dom.appendTransform({
            el: el,
            fnName: 'scale',
            fnParamValue: scaleValue
        });
    }

    function _setOpacity(vel, el) {
        var opacityValue = w.utils.fromMidiRange({
            scale: 1,
            velocity: vel,
            trim: 3
        });
        //w.utils.log('opacity', opacity);
        w.dom.setOpacity({
            el: el,
            opacity: opacityValue
        });
    }

    function _saturate(velocity, el) {
        var saturation = w.utils.fromMidiRange({
            scale: 100,
            velocity: velocity,
            trim: 0
        });
        //w.utils.log('saturation', saturation);
        w.dom.appendFilter({
            el: el,
            fnName: 'saturate',
            fnParamValue: saturation,
            fnParamUnit: '%'
        });
    }

    function _switchBackground(velocity) {
        var imageUrl;
        if (velocity === 0) {
            imageUrl = 'http://subtlepatterns2015.subtlepatterns.netdna-cdn.com/patterns/sativa.png';
        } else if (velocity === 127) {
            imageUrl = 'http://subtlepatterns2015.subtlepatterns.netdna-cdn.com/patterns/footer_lodyas.png';
        }
        w.dom.setBackgroundImage({
            imageUrl: imageUrl
        });
    }

    function _setBackgroundColor(velocity, el, elIndex) {
        var colorIndex = (elIndex % w.constants.rainbowColors.length),
            color;

        if (velocity === 0) {
            color = 'transparent';
        } else {
            color = w.constants.rainbowColors[colorIndex];
        }

        w.dom.setBackgroundColor({
            el: el,
            color: color
        });
    }

    function _translate(vel, el, axis) {
        var scale = 500,
            translation = w.utils.fromMidiRange({
                scale: scale,
                velocity: vel,
                trim: 3
            });
        translation = +translation - scale / 2;
        //w.utils.log('translate', translate);
        w.dom.appendTransform({
            el: el,
            fnName: 'translate' + axis,
            fnParamValue: translation,
            fnParamUnit: 'px'
        });
    }

    function _panX(vel, el) {
        _translate(vel, el, 'X');
    }

    function _panY(vel, el) {
        _translate(vel, el, 'Y');
    }


    function key(options={}) {

        var reversed = w.utils.reverseMidiRange(options.velocity),
            elIndex = options.elIndex,
            targetEl;

        if (w.utils.isUndefined(elIndex)) {
            elIndex = w.constants.keyMappings.indexOf(options.note);
        }

        targetEl = w.dom.keyControls[elIndex];

        //if (options.domEcho) {
        //}
        _setOpacity(reversed, targetEl);

        _setBackgroundColor(options.velocity, w.dom.overlay, elIndex);
    }


    w.commands = {
        rotate: _rotate,
        zoom: _zoom,
        panX: _panX,
        panY: _panY,
        opacity: _setOpacity,
        saturate: _saturate,
        switchBackground: _switchBackground,

        modulation: _modulation,
        pitchBend: _pitchBend,
        key: key
    };

})(window, document);
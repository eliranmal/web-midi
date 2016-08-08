(function (w, d) {

    function _absoluteScroll(velocity) {
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

    function _continuousRelativeScroll(velocity) {
        w.dom.startContinuousRelativeScroll({
            velocity: velocity,
            mean: 64
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

    function _scale(vel, el) {
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

    function _setBackgroundColor(elIndex) {
        var colorIndex = (elIndex % w.constants.rainbowColors.length);
        w.dom.setBackgroundColor({
            el: w.dom.wrapper,
            color: w.constants.rainbowColors[colorIndex]
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

    function _translateX(vel, el) {
        _translate(vel, el, 'X');
    }

    function _translateY(vel, el) {
        _translate(vel, el, 'Y');
    }


    function key(options={}) {
        var elIndex = options.elIndex || w.constants.keyMappings.indexOf(options.note),
            targetEl = w.dom.keyControls[elIndex];

        options.velocity = w.utils.reverseMidiRange(options.velocity);

        //if (options.domEcho) {
        //}
        _setOpacity(options.velocity, targetEl);
        _setOpacity(options.velocity, w.dom.wrapper);
        _setBackgroundColor(elIndex);
    }


    w.commands = {
        absoluteScroll: _absoluteScroll,
        continuousRelativeScroll: _continuousRelativeScroll,
        rotate: _rotate,
        scale: _scale,
        translateX: _translateX,
        translateY: _translateY,
        opacity: _setOpacity,
        saturate: _saturate,
        switchBackground: _switchBackground,

        key: key
    };

})(window, document);
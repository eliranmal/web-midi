(function (w, d) {

    function volume(options) {
        _echoRange(options);
        _opacity(options);
    }

    function pitchBend(options) {
        _echoRange(options);
        _stickyScroll(options);
    }

    function modulation(options) {
        _echoRange(options);
        _scroll(options);
    }


    function loop(options) {
        _image(options);
    }

    function rewind(options) {
        _image(options);
    }

    function forward(options) {
        _image(options);
    }

    function stop(options) {
        _image(options);
    }

    function play(options) {
        _image(options);
    }

    function record(options) {
        _image(options);
    }


    function knob1(options) {
        _echoRange(options);
        _rotate(options);
    }

    function knob2(options) {
        _echoRange(options);
        _zoom(options);
    }

    function knob3(options) {
        _echoRange(options);
        _panX(options);
    }

    function knob4(options) {
        _echoRange(options);
        _panY(options);
    }

    function knob5(options) {
        _echoRange(options);
    }

    function knob6(options) {
        _echoRange(options);
    }

    function knob7(options) {
        _echoRange(options);
    }

    function knob8(options) {
        _echoRange(options);
    }


    function pad1(options) {
        _echoTap(options);
    }

    function pad2(options) {
        _echoTap(options);
    }

    function pad3(options) {
        _echoTap(options);
    }

    function pad4(options) {
        _echoTap(options);
    }

    function pad5(options) {
        _echoTap(options);
    }

    function pad6(options) {
        _echoTap(options);
    }

    function pad7(options) {
        _echoTap(options);
    }

    function pad8(options) {
        _echoTap(options);
    }


    function key(options) {
        var color;
        _echoTap(options);
        if (options.velocity > 0) {
            color = w.dom.keyElColorMap.get(options.echoEl);
            w.dom.addOverlay({
                id: options.index,
                color: color,
                opacity: _getOpacityValue(options)
            });
        } else {
            w.dom.removeOverlay({
                id: options.index
            });
        }
    }


    function _echoTap(options) {
        _opacity({
            el: options.echoEl,
            velocity: options.velocity,
            reverse: true
        });
    }

    function _echoRange(options) {
        w.dom.setInputValue({
            el: options.echoEl,
            value: options.velocity
        });
    }

    function _scroll(options) {
        var docHeight = d.body.offsetHeight,
            y = w.utils.fromMidiRange({
                scale: docHeight,
                velocity: options.velocity,
                reverse: true,
                round: true
            });
        //w.utils.log('y', y);
        w.scrollTo(0, y);
    }

    function _stickyScroll(options) {
        w.dom.startContinuousRelativeScroll({
            velocity: options.velocity,
            mean: 64 // todo - redundant?
        });
    }

    function _rotate(options) {
        var degrees = w.utils.fromMidiRange({
            scale: 360,
            velocity: options.velocity,
            round: true
        });
        //w.utils.log('degrees', degrees);
        w.dom.appendTransform({
            el: options.el,
            name: 'rotate',
            value: degrees,
            unit: 'deg'
        });
    }

    function _zoom(options) {
        var scaleValue = w.utils.fromMidiRange({
            scale: 5,
            velocity: options.velocity
        });
        scaleValue = Math.pow(+scaleValue + 0.5, 2).toFixed(3);

        //w.utils.log('scale', scale);
        w.dom.appendTransform({
            el: options.el,
            name: 'scale',
            value: scaleValue
        });
    }

    function _saturate(options) {
        var saturation = w.utils.fromMidiRange({
            scale: 100,
            velocity: options.velocity,
            trim: 0
        });
        //w.utils.log('saturation', saturation);
        w.dom.appendFilter({
            el: options.el,
            name: 'saturate',
            value: saturation,
            unit: '%'
        });
    }

    function _image(options) {
        var imageUrl, backgroundImageOptions,
            index = options.index;
        if (options.velocity === 0) {
            imageUrl = '/images/patterns/sativa.png'; // default
        } else if (options.velocity === 127) {
            imageUrl = w.constants.transportImageMap[index];
        }
        if (imageUrl) {
            backgroundImageOptions = {
                imageUrl: imageUrl
            };
            w.dom.setBackgroundImage(backgroundImageOptions);
            if (index === 0) { // this is not a pattern image
                w.scrollTo(0, 0);
            }
        }
    }

    function _translate(axis, options) {
        var scale = 500,
            translation = w.utils.fromMidiRange({
                scale: scale,
                velocity: options.velocity,
                trim: 3
            });
        translation = +translation - scale / 2;
        //w.utils.log('translate', translate);
        w.dom.appendTransform({
            el: options.el,
            name: 'translate' + axis,
            value: translation,
            unit: 'px'
        });
    }

    function _panX(options) {
        _translate('X', options);
    }

    function _panY(options) {
        _translate('Y', options);
    }

    function _color(options) {
        if (options.velocity === 0) {
            options.color = 'transparent';
        }
        w.dom.setBackgroundColor({
            el: options.el,
            color: options.color
        });
    }

    function _opacity(options) {
        var opacityValue = _getOpacityValue(options);
        //w.utils.log('opacity', opacity);
        w.dom.setOpacity({
            el: options.el,
            opacity: opacityValue
        });
    }

    function _getOpacityValue(options) {
        if (options.reverse) {
            options.velocity = w.utils.reverseMidiRange(options.velocity);
        }
        return w.utils.fromMidiRange({ // change to fromRange - pass fromRange [min, max] and toRange (min/max)
            // min / max
            scale: 1,
            // value
            velocity: options.velocity,
            trim: 3
        });
    }


    w.commands = {
        volume: volume,
        pitchBend: pitchBend,
        modulation: modulation,
        loop: loop,
        rewind: rewind,
        forward: forward,
        stop: stop,
        play: play,
        record: record,
        key: key,
        knob1: knob1,
        knob2: knob2,
        knob3: knob3,
        knob4: knob4,
        knob5: knob5,
        knob6: knob6,
        knob7: knob7,
        knob8: knob8,
        pad1: pad1,
        pad2: pad2,
        pad3: pad3,
        pad4: pad4,
        pad5: pad5,
        pad6: pad6,
        pad7: pad7,
        pad8: pad8
    };

})(window, document);

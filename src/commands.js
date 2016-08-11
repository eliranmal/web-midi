(function (w, d) {

    function _scroll(velocity) {
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

    function _stickyScroll(velocity) {
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
            name: 'rotate',
            value: degrees,
            unit: 'deg'
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
            name: 'scale',
            value: scaleValue
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
            name: 'saturate',
            value: saturation,
            unit: '%'
        });
    }

    function _image(velocity) {
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
            name: 'translate' + axis,
            value: translation,
            unit: 'px'
        });
    }

    function _panX(vel, el) {
        _translate(vel, el, 'X');
    }

    function _panY(vel, el) {
        _translate(vel, el, 'Y');
    }

    function _color(options) {
        if (options.velocity === 0) {
            options.color = 'transparent';
        }
        w.dom.setBackgroundColor({
            el: w.dom.el.overlay, // todo - extract to options.targetEl (add sourceEl)
            color: options.color
        });
    }

    function _opacity(options) {
        var opacityValue;
        if (options.reverse) {
            options.velocity = w.utils.reverseMidiRange(options.velocity);
        }
        opacityValue = w.utils.fromMidiRange({ // change to fromRange - pass fromRange [min, max] and toRange (min/max)
            // min / max
            scale: 1,
            // value
            velocity: options.velocity,
            trim: 3
        });
        //w.utils.log('opacity', opacity);
        w.dom.setOpacity({
            el: options.el,
            opacity: opacityValue
        });
    }


    w.commands = {
        rotate: _rotate,
        zoom: _zoom,
        panX: _panX,
        panY: _panY,
        color: _color,
        opacity: _opacity,
        saturate: _saturate,
        image: _image,
        scroll: _scroll,
        stickyScroll: _stickyScroll
    };

})(window, document);
(function (w, d) {

    w.actions = {

        absoluteScroll: function (vel) {
            var docHeight = d.body.offsetHeight,
                y = w.utils.fromMidiRange({
                    scale: docHeight,
                    velocity: vel,
                    reverse: true,
                    round: true
                });
            //w.utils.log('y', y);
            w.scrollTo(0, y);
        },

        continuousRelativeScroll: function (vel) {
            w.dom.startContinuousRelativeScroll({
                velocity: vel,
                mean: 64
            });
        },

        rotate: function (vel, el) {
            var degrees = w.utils.fromMidiRange({
                scale: 360,
                velocity: vel,
                round: true
            });
            //w.utils.log('degrees', degrees);
            w.dom.appendTransform({
                el: el,
                fnName: 'rotate',
                fnParamValue: degrees,
                fnParamUnit: 'deg'
            });
        },

        scale: function (vel, el) {
            var scale = w.utils.fromMidiRange({
                scale: 5,
                velocity: vel
            });
            scale = Math.pow(+scale + .5, 2).toFixed(3);

            //w.utils.log('scale', scale);
            w.dom.appendTransform({
                el: el,
                fnName: 'scale',
                fnParamValue: scale
            });
        },

        translateX: function (vel, el) {
            _translate(vel, el, 'X');
        },

        translateY: function (vel, el) {
            _translate(vel, el, 'Y');
        },

        opacity: function (vel, el) {
            var opacity = w.utils.fromMidiRange({
                scale: 1,
                velocity: vel,
                trim: 3
            });
            //w.utils.log('opacity', opacity);
            w.dom.setOpacity({
                el: el,
                opacity: opacity
            });
        },

        saturate: function (vel, el) {
            var saturation = w.utils.fromMidiRange({
                scale: 100,
                velocity: vel,
                trim: 0
            });
            //w.utils.log('saturation', saturation);
            w.dom.appendFilter({
                el: el,
                fnName: 'saturate',
                fnParamValue: saturation,
                fnParamUnit: '%'
            });
        },

        switchBackground: function (vel) {
            var imageUrl;
            if (vel === 0) {
                imageUrl = 'http://subtlepatterns2015.subtlepatterns.netdna-cdn.com/patterns/sativa.png';
            } else if (vel === 127) {
                imageUrl = 'http://subtlepatterns2015.subtlepatterns.netdna-cdn.com/patterns/footer_lodyas.png';
            }
            w.dom.setBackgroundImage({
                imageUrl: imageUrl
            });
        }
    };

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

})(window, document);
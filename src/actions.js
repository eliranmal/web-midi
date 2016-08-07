(function (w, d) {

    var relativeScrollTimerId,
        tickScrollDistance = 10;

    const transformMap = new WeakMap();

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
            var startTime,
                synchronizedInterval,
                relVelocity = vel - 64,
                absVelocity = Math.abs(relVelocity),
                interval = Math.round(Math.exp(Math.log1p(64 - absVelocity)) * .6),
                y = tickScrollDistance;

            if (relVelocity > 0) {
                y = y * -1;
            }

            w.clearTimeout(relativeScrollTimerId);

            if (relVelocity !== 0) {
                startTime = new Date().getTime();

                (function timer() {
                    w.scrollBy(0, y);
                    synchronizedInterval = interval - ((new Date().getTime() - startTime) % interval);
                    relativeScrollTimerId = w.setTimeout(timer, synchronizedInterval);
                })();
            }
        },

        rotate: function (vel, el) {
            var degrees = w.utils.fromMidiRange({
                scale: 360,
                velocity: vel,
                round: true
            });
            //w.utils.log('degrees', degrees);
            _appendTransform(_bodyFallback(el), 'rotate', degrees,  'deg');
        },

        scale: function (vel, el) {
            var scale = w.utils.fromMidiRange({
                scale: 5,
                velocity: vel,
                trim: 3
            });
            scale = Math.pow(+scale + .5, 2);

            //w.utils.log('scale', scale);
            _appendTransform(_bodyFallback(el), 'scale', scale);
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
            _bodyFallback(el).style.opacity = opacity;
        },

        saturate: function (vel, el) {
            var saturation = w.utils.fromMidiRange({
                scale: 100,
                velocity: vel,
                trim: 0
            });
            //w.utils.log('saturation', saturation);
            _bodyFallback(el).style.filter = '(' + saturation + '%)';
        },

        switchBackground: function (vel) {
            var imageUrl;
            if (vel === 0) {
                imageUrl = 'http://subtlepatterns2015.subtlepatterns.netdna-cdn.com/patterns/sativa.png';
            } else if (vel === 127) {
                imageUrl = 'http://subtlepatterns2015.subtlepatterns.netdna-cdn.com/patterns/footer_lodyas.png';
            }
            d.body.style.backgroundImage = 'url("' + imageUrl + '")';
        }
    };

    // todo - move to w.dom
    function _bodyFallback(el) {
        return el || d.body;
    }

    function _translate(vel, el, axis) {
        var scale = 500,
            translate = w.utils.fromMidiRange({
                scale: scale,
                velocity: vel,
                trim: 3
            });
        translate = +translate - scale / 2;
        //w.utils.log('translate', translate);
        _appendTransform(_bodyFallback(el), 'translate' + axis, translate, 'px');
    }


    // todo - move to w.dom
    function _appendTransform(el, key, value, units) {
        var transforms,
            transformString = '';
        //w.utils.log('transform key', key, 'transform value', value);
        if (!el) {
            return;
        }
        units = units || '';
        transforms = transformMap.get(el) || {};
        transforms[key] = value + units;
        transformMap.set(el, transforms);
        for (var key in transforms) {
            transformString += key + '(' + transforms[key] + ') ';
        }
        //w.utils.log(transformString);
        el.style.webkitTransform = transformString;
    }

    // todo - combine all transforms/filters into one dynamic string or array

})(window, document);
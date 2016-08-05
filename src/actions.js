(function (w, d) {

    var relativeScrollTimerId,
        tickScrollDistance = 10;

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
            _bodyFallback(el).style.webkitTransform = 'rotate(' + degrees + 'deg)';
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
    }

    function _bodyFallback(el) {
        return el || d.body;
    }

})(window, document);
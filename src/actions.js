(function (w, d) {

    var relativeScrollTimerId,
        tickScrollDistance = 10;

        w.actions = {

        rotate: function (vel) {
            w.dom.virtualController.style.webkitTransform = 'rotate(' + (360 / 127 * vel) + 'deg)';
        },

        absoluteScroll: function (vel) {
            var docHeight = d.body.offsetHeight,
                y = Math.floor(docHeight - (docHeight / 127 * vel));
            // w.utils.log('y', y);
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
        opacity: function (vel) {
            var opacity = +(1 / 127 * vel).toFixed(3);
            // w.utils.log('opacity', opacity);
            d.body.style.opacity = opacity;
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

})(window, document);
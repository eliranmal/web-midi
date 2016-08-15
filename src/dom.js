(function (w, d) {

    var relativeScrollTimerId,
        tickScrollDistance = 10;

    var virtualControllerDisplay = d.querySelector('.virtual-controller .display'),
        displayLogChannel = virtualControllerDisplay.querySelector('.channel .log'),
        displayLogCmd = virtualControllerDisplay.querySelector('.cmd .log'),
        displayLogType = virtualControllerDisplay.querySelector('.type .log'),
        displayLogNote = virtualControllerDisplay.querySelector('.note .log'),
        displayLogVelocity = virtualControllerDisplay.querySelector('.velocity .log'),
        bendControl = d.querySelector('#bend-control'),
        modControl = d.querySelector('#mod-control'),
        volControl = d.querySelector('#vol-control'),
        virtualController = d.querySelector('.virtual-controller'),
        transportControls = [].slice.call(d.querySelectorAll('.transport > div')),
        padControls = [].slice.call(d.querySelectorAll('.pads > div > div')),
        keyControls = [].slice.call(d.querySelectorAll('.keys > div')),
        knobControls = [].slice.call(d.querySelectorAll('.knobs input'));

    const keyElColorMap = (function () {
        var index, color, colorIndex;
        var map = new WeakMap(),
            whiteKeys = keyControls.filter(function (node, index) {
                return node.className.indexOf('white') !== -1;
            });
        for (index in whiteKeys) {
            colorIndex = (index % w.constants.rainbowColors.length);
            color = w.constants.rainbowColors[colorIndex];
            map.set(whiteKeys[index], color);
        }
        return map;
    })();

    const overlayMap = {};


    function init() {

        _bindRange(volControl, function (data) {
            w.commands.volume({
                el: virtualController,
                velocity: data.velocity
            });
        });

        _bindRange(modControl, function (data) {
            w.commands.modulation({
                velocity: data.velocity
            });
        });

        // add 'idlePosition' to mimic the pitchbend physical control behavior
        _bindRange(bendControl, function (data) {
            w.commands.pitchBend({
                velocity: data.velocity
            });
        }, 64);

        knobControls.forEach(function (node, index) {
            _bindRange(node, function (data) {
                var command = 'knob' + (index + 1);
                w.commands[command]({
                    velocity: data.velocity,
                    el: virtualController,
                    echoEl: node
                });
            });
        });

        padControls.forEach(function (node, index) {
            _bindTap(node, function (data) {
                var command = 'pad' + (index + 1);
                w.commands[command]({
                    velocity: data.velocity,
                    el: virtualController,
                    echoEl: node
                });
            });
        });

        keyControls.forEach(function (node, index) {
            _bindTap(node, function (data) {
                w.commands.key({
                    velocity: data.velocity,
                    echoEl: node,
                    index: index
                });
            });
        });
    }

    function appendTransform(options) {
        _appendFunctionListStyle('transform', options);
    }

    function appendFilter(options) {
        _appendFunctionListStyle('filter', options);
    }

    function startContinuousRelativeScroll(options) {
        var startTime,
            synchronizedInterval,
            relVelocity = options.velocity - options.mean,
            absVelocity = Math.abs(relVelocity),
            interval = Math.round(Math.exp(Math.log1p(options.mean - absVelocity)) * 0.6),
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
    }

    function setBackgroundColor(options) {
        _ensureElement(options.el).style.backgroundColor = options.color;
    }

    function setBackgroundImage(options) {
        _ensureElement(options.el).style.backgroundImage = 'url("' + options.imageUrl + '")';
    }

    function setOpacity(options) {
        _ensureElement(options.el).style.opacity = options.opacity;
    }

    function setInputValue(options) {
        if (options.el) {
            options.el.value = options.value;
        }
    }

    function setText(options) {
        options.el && (options.el.textContent = options.message);
    }

    function addOverlay(options) {
        var id = 'overlay-' + options.id,
            el;
        if (overlayMap[id]) {
            return;
        }
        el = d.createElement('div');
        el.setAttribute('class', 'overlay');
        d.body.appendChild(el);
        // trigger css transition
        el.style.backgroundColor = options.color;
        el.style.opacity = options.opacity;
        overlayMap[id] = el;
    }

    function removeOverlay(options) {
        var id = 'overlay-' + options.id;
        var el = overlayMap[id];
        if (!el) {
            return;
        }
        d.body.removeChild(el);
        delete overlayMap[id];
    }

    //function isRangeInput(el) {
    //    return el && el instanceof w.HTMLInputElement && el.type === 'range';
    //}


    function _appendFunctionListStyle(prop, options) {
        var functionList,
            functionListMapName = prop + 'FunctionListMap',
            functionListString = '';

        options.el = _ensureElement(options.el);
        this[functionListMapName] = this[functionListMapName] || new WeakMap();
        functionList = this[functionListMapName].get(options.el) || {};
        functionList[options.name] = options.value + (options.unit || '');
        this[functionListMapName].set(options.el, functionList);

        for (var n in functionList) {
            functionListString += n + '(' + functionList[n] + ') ';
        }
        //w.utils.log(transformString);
        options.el.style[prop] = functionListString;
    }


    function _bindRange(inputEl, callback, idlePosition) {
        inputEl.addEventListener('input', function (e) {
            callback({
                velocity: inputEl.value
            });
        });
        if (!w.utils.isUndefined(idlePosition)) {
            // jump to middle position when leaving mouse button
            inputEl.addEventListener('mouseup', function (e) {
                callback({
                    velocity: (inputEl.value = 64)
                });
            });
        }
    }

    function _bindTap(el, callback) {
        el.addEventListener('mousedown', callback.bind(this, {
            velocity: 60
        }));
        el.addEventListener('mouseup', callback.bind(this, {
            velocity: 0
        }));
    }

    function _ensureElement(el) {
        return el || d.body;
    }


    w.dom = {
        el: {
            virtualController: virtualController,
            virtualControllerDisplay: virtualControllerDisplay,
            displayLogChannel: displayLogChannel,
            displayLogCmd: displayLogCmd,
            displayLogNote: displayLogNote,
            displayLogType: displayLogType,
            displayLogVelocity: displayLogVelocity,
            bendControl: bendControl,
            modControl: modControl,
            volControl: volControl,
            keyControls: keyControls,
            padControls: padControls,
            knobControls: knobControls,
            transportControls: transportControls
        },
        keyElColorMap: keyElColorMap,
        init: init,
        appendTransform: appendTransform,
        appendFilter: appendFilter,
        setBackgroundColor: setBackgroundColor,
        setBackgroundImage: setBackgroundImage,
        setOpacity: setOpacity,
        startContinuousRelativeScroll: startContinuousRelativeScroll,
        setInputValue: setInputValue,
        setText: setText,
        addOverlay: addOverlay,
        removeOverlay: removeOverlay
    };

})
(window, document);
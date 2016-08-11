(function (w, d) {

    const knobCommnads = [
        'rotate', 'zoom', 'panX', 'panY'
    ];

    var relativeScrollTimerId,
        tickScrollDistance = 10;

    var overlay = d.querySelector('.overlay'),
        virtualControllerDisplay = d.querySelector('.virtual-controller .display'),
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


    function init() {

        _addInputListener(volControl, w.commands.opacity, virtualController);
        _addInputListener(modControl, w.commands.scroll);
        _addInputListener(bendControl, w.commands.stickyScroll);
        // mimic the pitchbend physical control behavior:
        // jump to middle position when leaving mouse button on the bend slider
        bendControl.addEventListener('mouseup', function (e) {
            w.commands.stickyScroll(bendControl.value = 64);
        });

        knobControls.forEach(function (node, index, collection) {
            var command = knobCommnads[index];
            if (command) {
                _addInputListener(node, w.commands[command], virtualController);
            }
        });

        //keyControls.forEach(function (node, index) {
        //    node.style.backgroundColor = w.constants.rainbowColors[index % w.constants.rainbowColors.length];
        //});

        _addAllOpacityMouseListeners();

        _addMouseListeners(
            keyControls,
            function (node, index) {
                w.commands.color({
                    el: node,
                    velocity: 60,
                    color: keyElColorMap.get(node)
                });
            }, function (node, index) {
                w.commands.color({
                    el: node,
                    velocity: 0,
                    color: keyElColorMap.get(node)
                });
            });
    }

    function _addInputListener(inputEl, command, targetEl) {
        inputEl.addEventListener('input', function (e) {
            w.commands[command](inputEl.value, targetEl);
        });
    }

    function _addAllOpacityMouseListeners() {
        _addOpacityMouseListeners(padControls);
        _addOpacityMouseListeners(keyControls);
        _addOpacityMouseListeners(transportControls);
    }

    function _addOpacityMouseListeners(nodes) {
        _addMouseListeners(
            nodes,
            opacityMouseListener.bind({
                velocity: 60
            }),
            opacityMouseListener.bind({
                velocity: 0
            })
        );
    }

    function opacityMouseListener(el, index) {
        w.commands.opacity({
            velocity: this.velocity,
            el: el,
            reverse: true
        });
    }

    function _addMouseListeners(nodes, onMouseDown, onMouseUp) {
        nodes.forEach(function (node, index, collection) {
            node.addEventListener('mousedown', onMouseDown.bind(this, node, index));
            node.addEventListener('mouseup', onMouseUp.bind(this, node, index));
        });
    }

    function appendTransform(options={}) {
        appendFunctionListStyle('transform', options);
    }

    function appendFilter(options={}) {
        appendFunctionListStyle('filter', options);
    }

    // el, name, value, unit
    function appendFunctionListStyle(prop, options) {
        var functionList,
            functionListMapName = prop + 'FunctionListMap',
            functionListString = '';

        options.el = ensureElement(options.el);
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

    function startContinuousRelativeScroll(options={}) {
        var startTime,
            synchronizedInterval,
            relVelocity = options.velocity - options.mean,
            absVelocity = Math.abs(relVelocity),
            interval = Math.round(Math.exp(Math.log1p(options.mean - absVelocity)) * .6),
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

    function setBackgroundColor(options={}) {
        ensureElement(options.el).style.backgroundColor = options.color;
    }

    function setBackgroundImage(options={}) {
        ensureElement(options.el).style.backgroundImage = 'url("' + options.imageUrl + '")';
    }

    function setOpacity(options={}) {
        ensureElement(options.el).style.opacity = options.opacity;
    }

    function ensureElement(el) {
        return el || d.body;
    }


    w.dom = {
        el: {
            overlay: overlay,
            virtualController: virtualController,
            virtualControllerDisplay: virtualControllerDisplay,
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
        startContinuousRelativeScroll: startContinuousRelativeScroll
    };

})(window, document);
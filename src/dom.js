(function (w, d) {

    const rainbowColors = [
        '#f44336',
        '#ff9800',
        '#ffeb3b',
        '#4caf50',
        '#2196f3',
        '#3f51b5',
        '#9c27b0'
    ];

    var relativeScrollTimerId,
        tickScrollDistance = 10;

    var virtualControllerDisplay = d.querySelector('.virtual-controller .display'),
        bendControl = d.querySelector('#bend-control'),
        modControl = d.querySelector('#mod-control'),
        volControl = d.querySelector('#vol-control'),
        virtualController = d.querySelector('.virtual-controller'),
        transportControls = [].slice.call(d.querySelectorAll('.transport > div')),
        padControls = [].slice.call(d.querySelectorAll('.pads > div > div')),
        keyControls = [].slice.call(d.querySelectorAll('.keys > div')),
        knobControls = [].slice.call(d.querySelectorAll('.knobs input'));
    // todo - tie transport buttons, too (and knobs!, and keys!!!)


    bendControl.addEventListener('input', function (e) {
        w.actions.continuousRelativeScroll(bendControl.value);
    });

    modControl.addEventListener('input', function (e) {
        w.actions.absoluteScroll(modControl.value);
    });

    volControl.addEventListener('input', function (e) {
        w.actions.opacity(volControl.value);
    });

    knobControls[0].addEventListener('input', function (e) {
        w.actions.rotate(knobControls[0].value, virtualController);
    });

    knobControls[1].addEventListener('input', function (e) {
        w.actions.scale(knobControls[1].value, virtualController);
    });

    knobControls[2].addEventListener('input', function (e) {
        w.actions.translateX(knobControls[2].value, virtualController);
    });

    knobControls[3].addEventListener('input', function (e) {
        w.actions.translateY(knobControls[3].value, virtualController);
    });

    // mimic the pitchbend physical control behavior:
    // jump to middle position when leaving mouse button on the bend slider
    d.addEventListener('mouseup', function (e) {
        if (e.target === bendControl) {
            w.actions.continuousRelativeScroll(bendControl.value = 64);
        }
    });

    keyControls.forEach(function (node, index) {
        node.style.backgroundColor = rainbowColors[index % 7];
    });

    _addOpacityMouseListener(padControls);
    _addOpacityMouseListener(keyControls);
    _addOpacityMouseListener(transportControls);


    function _addOpacityMouseListener(nodes) {
        nodes.forEach(function (node, index, collection) {
            node.addEventListener('mousedown', function (e) {
                w.actions.opacity(70, node);
            });
            node.addEventListener('mouseup', function (e) {
                w.actions.opacity(127, node);
            });
        });
    }

    function appendTransform(options={}) {
        _appendFunctionListStyle('transform', options);
    }

    function appendFilter(options={}) {
        _appendFunctionListStyle('filter', options);
    }

    // el, fnName, fnParamValue, fnParamUnit
    function _appendFunctionListStyle(prop, options) {
        var functionList,
            functionListMapName = prop + 'FunctionListMap',
            functionListString = '';
        options.el = ensureElement(options.el);
        this[functionListMapName] = this[functionListMapName] || new WeakMap();
        functionList = this[functionListMapName].get(options.el) || {};
        functionList[options.fnName] = options.fnParamValue + (options.fnParamUnit || '');
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

    //const elementColorMap = new WeakMap();

    function setBackgroundColor(options={}) {
        options.color = options.color || 'red';
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
        virtualController: virtualController,
        bendControl: bendControl,
        modControl: modControl,
        volControl: volControl,
        transportControls: transportControls,
        padControls: padControls,
        knobControls: knobControls,
        keyControls: keyControls,
        virtualControllerDisplay: virtualControllerDisplay,
        ensureElement: ensureElement,
        appendTransform: appendTransform,
        appendFilter: appendFilter,
        setBackgroundColor: setBackgroundColor,
        setBackgroundImage: setBackgroundImage,
        setOpacity: setOpacity,
        startContinuousRelativeScroll: startContinuousRelativeScroll
    };

})(window, document);
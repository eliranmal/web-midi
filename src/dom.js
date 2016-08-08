(function (w, d) {

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


    function addOpacityMouseListeners(nodes, targetEl) {
        addMouseListeners(
            nodes,
            function (node, index) {
                w.commands.opacity(70, targetEl || node);
            }, function (node, index) {
                w.commands.opacity(127, targetEl || node);
            });
    }

    function addMouseListeners(nodes, onMouseDown, onMouseUp) {
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

    // el, fnName, fnParamValue, fnParamUnit
    function appendFunctionListStyle(prop, options) {
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
        overlay: overlay,
        virtualController: virtualController,
        bendControl: bendControl,
        modControl: modControl,
        volControl: volControl,
        transportControls: transportControls,
        padControls: padControls,
        knobControls: knobControls,
        keyControls: keyControls,
        virtualControllerDisplay: virtualControllerDisplay,
        addMouseListeners: addMouseListeners,
        addOpacityMouseListeners: addOpacityMouseListeners,
        appendTransform: appendTransform,
        appendFilter: appendFilter,
        setBackgroundColor: setBackgroundColor,
        setBackgroundImage: setBackgroundImage,
        setOpacity: setOpacity,
        startContinuousRelativeScroll: startContinuousRelativeScroll
    };

})(window, document);
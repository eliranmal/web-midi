(function (w) {

    function request(options) {
        var data = options.payload, xhr = new XMLHttpRequest();
        xhr.open(options.method || 'GET', options.url, true);
        xhr.onreadystatechange = _xhrCallback(xhr, options);

        options.headers = options.headers || {};
        options.headers['X-Requested-With'] = 'XMLHttpRequest';
        options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json;charset=UTF-8';
        options.headers.Accept = options.headers.Accept || 'application/json, text/javascript, */*;';

        for (var key in options.headers) {
            if (options.headers.hasOwnProperty(key) &&
                typeof options.headers[key] === 'string') {
                xhr.setRequestHeader(key, options.headers[key]);
            }
        }
        if (data && typeof data !== 'string') {
            data = JSON.stringify(data);
        }
        xhr.send(data);
    }

    function _xhrCallback(xhr, options) {
        return function () {
            var status, data, responseText;
            if (XMLHttpRequest.DONE === xhr.readyState) {
                status = xhr.status;
                responseText = xhr.responseText;
                data = responseText;
                if (options.JSON) {
                    if (responseText && typeof responseText === 'string') {
                        try {
                            data = JSON.parse(responseText);
                        } catch (exc) {
                        }
                    }
                }
                if (399 >= status) {
                    w.utils.runCallback(options.success, options.context, data, status);
                }
                else {
                    w.utils.runCallback(options.error, options.context, data, status);
                }
            }
        };
    }

    w.xhr = {
        request: request
    };

})(window);


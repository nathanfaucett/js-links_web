(function(dependencies, chunks, undefined, global) {
    
    var cache = [],
        cacheCallbacks = {};
    

    function Module() {
        this.id = null;
        this.filename = null;
        this.dirname = null;
        this.exports = {};
        this.loaded = false;
    }

    Module.prototype.require = require;

    function require(index) {
        var module = cache[index],
            callback, exports;

        if (module !== undefined) {
            return module.exports;
        } else {
            callback = dependencies[index];

            cache[index] = module = new Module();
            exports = module.exports;

            callback.call(exports, require, exports, module, undefined, global);
            module.loaded = true;

            return module.exports;
        }
    }

    require.resolve = function(path) {
        return path;
    };

    
    require.async = function async(index, callback) {
        var module = cache[index],
            callbacks, node;

        if (module) {
            callback(module.exports);
        } else if ((callbacks = cacheCallbacks[index])) {
            callbacks[callbacks.length] = callback;
        } else {
            node = document.createElement("script");
            callbacks = cacheCallbacks[index] = [callback];

            node.type = "text/javascript";
            node.charset = "utf-8";
            node.async = true;

            function onLoad() {
                var i = -1,
                    il = callbacks.length - 1;

                while (i++ < il) {
                    callbacks[i](require(index));
                }
                delete cacheCallbacks[index];
            }

            if (node.attachEvent && !(node.attachEvent.toString && node.attachEvent.toString().indexOf("[native code") < 0)) {
                node.attachEvent("onreadystatechange", onLoad);
            } else {
                node.addEventListener("load", onLoad, false);
            }

            node.src = chunks[index];

            document.head.appendChild(node);
        }
    };

    global["I1aLHc3J-FfmC-4wCN-AYIE-Dnhg1kepSfMca"] = function(asyncDependencies) {
        var i = -1,
            il = asyncDependencies.length - 1,
            dependency, index;

        while (i++ < il) {
            dependency = asyncDependencies[i];
            index = dependency[0];

            if (dependencies[index] === null) {
                dependencies[index] = dependency[1];
            }
        }
    };

    

    if (typeof(define) === "function" && define.amd) {
        define([], function() {
            return require(0);
        });
    } else if (typeof(module) !== "undefined" && module.exports) {
        module.exports = require(0);
    } else {
        
        require(0);
        
    }
}([
function(require, exports, module, undefined, global) {
/*@=-/var/www/html/faucette/js-links_web/app/js/oauth2.js-=@*/
var config = require(1),
    qs = require(2),
    url = require(3),
    request = require(4);


var opener = window.opener,
    fullUrl = url.parse(location + ""),
    search = qs.parse(fullUrl.search.slice(1)),
    code = search.code;


function init(provider) {
    request.get(config.baseUrl + "/users/"+ provider +"/callback?" + qs.stringify({
        code: code
    }), {
        success: function(response) {
            opener.postMessage(JSON.stringify({
                type: "success",
                user: response.data
            }), config.appUrl);
            window.close();
        },
        error: function(response) {
            opener.postMessage(JSON.stringify({
                type: "error",
                error: response.data
            }), config.appUrl);
            window.close();
        }
    });
}


function onMessage(event) {
    var data = JSON.parse(event.data);

    switch (data.type) {
        case "provider":
            init(data.provider);
            break;
    }
}
window.addEventListener("message", onMessage, false);

opener.postMessage(JSON.stringify({
    type: "load"
}), config.appUrl);

},
function(require, exports, module, undefined, global) {
/*@=-/var/www/html/faucette/js-links_web/app/js/config.js-=@*/
module.exports = {
    "env": "development",
    "flatLocaleMode": true,
    "locales": [
        "en"
    ],
    "oauth2": [
        "google",
        "github"
    ],
    "throwMissingTranslationError": false,
    "html5Mode": false,
    "appUrl": "http://localhost:4000",
    "baseUrl": "http://192.168.1.23:3000",
    "baseUrlWS": "ws://192.168.1.23:3000"
};

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/qs@0.0.2/src/index.js-=@*/
var Buffer = require(5).Buffer;
var indexOf = require(6),
    has = require(7),
    keys = require(8),
    isPrimitive = require(9),
    isArrayLike = require(10),
    isNaNShim = require(11),
    isObject = require(12);


var qs = module.exports,

    ObjectPrototype = Object.prototype,

    reDecode = /\+/g,
    reParseKeysParent = /^([^\[\]]*)/,
    reParseKeysChild = /(\[[^\[\]]*\])/g,
    reParseKeysReplacer = /\[|\]/g;


function mergeArrays(a, b) {
    var i = -1,
        length = b.length - 1,
        offset = a.length;

    while (i++ < length) {
        a[offset + i] = b[i];
    }

    return a;
}

function stringify(obj, prefix) {
    var key, values, i, length;

    obj = Buffer.isBuffer(obj) ? obj.toString() : obj instanceof Date ? obj.toISOString() : obj != null ? obj : "";

    if (isPrimitive(obj)) {
        return [encodeURIComponent(prefix) + "=" + encodeURIComponent(obj)];
    }

    values = [];

    if (isArrayLike(obj)) {
        i = -1;
        length = obj.length - 1;

        while (i++ < length) {
            mergeArrays(values, stringify(obj[i], prefix + "[" + i + "]"));
        }
    } else {
        for (key in obj) {
            if (has(obj, key)) {
                mergeArrays(values, stringify(obj[key], prefix + "[" + key + "]"));
            }
        }
    }

    return values;
}

qs.stringify = function(obj, options) {
    var keys = [],
        delimiter, key;

    delimiter = options && typeof(options.delimiter) !== "undefined" ? options.delimiter : "&";

    for (key in obj) {
        if (has(obj, key)) {
            mergeArrays(keys, stringify(obj[key], key));
        }
    }

    return keys.join(delimiter);
};

function decode(str) {
    var value, num;

    try {
        value = decodeURIComponent(str.replace(reDecode, " "));
        num = +value;
        return num !== num ? value : num;
    } catch (e) {
        return str;
    }
}

function parseValues(str, options) {
    var obj = {},
        parts = str.split(options.delimiter, options.parameterLimit === Infinity ? undefined : options.parameterLimit),
        i = -1,
        il = parts.length - 1,
        part, index, pos, key, val;

    while (i++ < il) {
        part = parts[i];
        index = part.indexOf("]=");
        pos = index === -1 ? part.indexOf("=") : index + 1;

        if (pos === -1) {
            obj[decode(part)] = "";
        } else {
            key = decode(part.slice(0, pos));
            val = decode(part.slice(pos + 1));

            obj[key] = has(obj, key) ? [obj[key], val] : val;
        }
    }

    return obj;
}

function parseObject(chain, val, options) {
    var root, obj, cleanRoot, index;

    if (!chain.length) {
        return val;
    }

    root = chain.shift();

    if (root === "[]") {
        obj = [parseObject(chain, val, options)];
    } else {
        cleanRoot = "[" === root[0] && "]" === root[root.length - 1] ? root.slice(1, root.length - 1) : root;
        index = +cleanRoot;

        if (!isNaNShim(index) && root !== cleanRoot && index <= options.arrayLimit) {
            obj = [];
            obj[index] = parseObject(chain, val, options);
        } else {
            obj = {};
            obj[cleanRoot] = parseObject(chain, val, options);
        }
    }

    return obj;
}

function parseKeys(key, val, options) {
    var parent = reParseKeysParent,
        child = reParseKeysChild,
        segment, keys, i;

    if (!key) {
        return undefined;
    }

    segment = parent.exec(key);

    if (has(ObjectPrototype, segment[1])) {
        return undefined;
    }

    keys = [];
    segment[1] && (keys[keys.length] = segment[1]);

    i = 0;
    while (null !== (segment = child.exec(key)) && i < options.depth) {
        if (!has(ObjectPrototype, segment[1].replace(reParseKeysReplacer, ""))) {
            keys[keys.length] = segment[1];
        }
        i++;
    }

    segment && (keys[keys.length] = "[" + key.slice(segment.index) + "]");

    return parseObject(keys, val, options);
}

function compact(obj, refs) {
    var lookup, compacted, i, length, objectKeys, key, value;

    if (!isObject(obj)) {
        return obj;
    }

    refs = refs || [];
    lookup = indexOf(refs, obj);

    if (lookup !== -1) {
        return refs[lookup];
    }

    refs[refs.length] = obj;

    if (isArrayLike(obj)) {
        compacted = [];

        i = -1;
        length = obj.length - 1;

        while (i++ < length) {
            value = obj[i];

            if (value != null) {
                compacted[compacted.length] = value;
            }
        }

        return compacted;
    }

    objectKeys = keys(obj);
    i = -1;
    length = objectKeys.length - 1;

    while (i++ < length) {
        key = objectKeys[i];
        obj[key] = compact(obj[key], refs);
    }

    return obj;
}

function arrayToObject(array) {
    var obj = {},
        i = -1,
        length = array.length - 1,
        value;

    while (i++ < length) {
        value = array[i];

        if (value != null) {
            obj[i] = value;
        }
    }

    return obj;
}

function merge(target, source) {
    var objectKeys, i, il, k, kl, key, value;

    if (!source) {
        return target;
    }

    if (isArrayLike(source)) {
        i = -1;
        il = source.length - 1;

        while (i++ < il) {
            key = target[i];
            value = source[i];

            if (value != null) {
                if (isObject(key)) {
                    target[i] = merge(key, value);
                } else {
                    target[i] = value;
                }
            }
        }

        return target;
    }

    if (isArrayLike(target)) {
        if (typeof(source) !== "object") {
            target[target.length] = source;
            return target;
        } else {
            target = arrayToObject(target);
        }
    }

    objectKeys = keys(source);
    k = -1;
    kl = objectKeys.length - 1;

    while (k++ < kl) {
        key = objectKeys[k];
        value = source[key];

        if (value && typeof(value) === "object") {
            if (target[key] == null) {
                target[key] = value;
            } else {
                target[key] = merge(target[key], value);
            }
        } else {
            target[key] = value;
        }
    }

    return target;
}

qs.parse = function(str, options) {
    var obj = {},
        tempObj, objectKeys, i, il, key, newObj;

    if (str === "" || str == null) {
        return obj;
    }

    options || (options = {});
    options.delimiter = typeof(options.delimiter) === "string" || (options.delimiter instanceof RegExp) ? options.delimiter : "&";
    options.depth = typeof(options.depth) === "number" ? options.depth : 5;
    options.arrayLimit = typeof(options.arrayLimit) === "number" ? options.arrayLimit : 20;
    options.parameterLimit = typeof(options.parameterLimit) === "number" ? options.parameterLimit : 1e3;

    tempObj = typeof(str) === "string" ? parseValues(str, options) : str;

    objectKeys = keys(tempObj);
    i = -1;
    il = objectKeys.length - 1;

    while (i++ < il) {
        key = objectKeys[i];
        newObj = parseKeys(key, tempObj[key], options);
        obj = merge(obj, newObj);
    }

    return compact(obj);
};

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/url@0.0.3/src/index.js-=@*/
var isObject = require(12),
    isString = require(25),
    isUndefined = require(23),
    isNull = require(22),
    create = require(28),
    keys = require(8),
    punycode = require(29),
    qs = require(2);


// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var url = exports,
    toASCII = punycode.toASCII,

    protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    hostnameMaxLen = 255,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
        'javascript': true,
        'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
        'javascript': true,
        'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
        'http': true,
        'http:': true,
        'https': true,
        'https:': true,
        'ftp': true,
        'ftp:': true,
        'gopher': true,
        'gopher:': true,
        'file': true,
        'file:': true
    };


url.parse = urlParse;
url.resolve = urlResolve;
url.resolveObject = urlResolveObject;
url.format = urlFormat;

url.Url = Url;


function Url() {
    this.protocol = null;
    this.slashes = null;
    this.auth = null;
    this.host = null;
    this.port = null;
    this.hostname = null;
    this.hash = null;
    this.search = null;
    this.query = null;
    this.pathname = null;
    this.path = null;
    this.href = null;
}



// This constructor is used to store parsed query string values. Instantiating
// this is faster than explicitly calling `Object.create(null)` to get a
// "clean" empty object (tested with v8 v4.9).
function ParsedQueryString() {}
ParsedQueryString.prototype = create(null);

function urlParse(url, parseQueryString, slashesDenoteHost) {
    var u;

    if (url instanceof Url) {
        return url;
    } else {
        u = new Url();
        u.parse(url, parseQueryString, slashesDenoteHost);
        return u;
    }
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
    if (!isString(url)) {
        throw new TypeError('Parameter "url" must be a string, not ' + typeof url);
    }
    // Copy chrome, IE, opera backslash-handling behavior.
    // Back slashes before the query string get converted to forward slashes
    // See: https://code.google.com/p/chromium/issues/detail?id=25916
    var hasHash = false,
        start = -1,
        end = -1,
        rest = '',
        lastPos = 0,
        i = 0,
        inWs, code, simplePath, proto, lowerProto, slashes, hostEnd, atSign,
        nonHost, hostname, ipv6Hostname, result, p, h, questionIdx, hashIdx,
        firstIdx, s;

    for (inWs = false, split = false; i < url.length; ++i) {
        code = url.charCodeAt(i);

        // Find first and last non-whitespace characters for trimming
        isWs = code === 32 /* */ ||
            code === 9 /*\t*/ ||
            code === 13 /*\r*/ ||
            code === 10 /*\n*/ ||
            code === 12 /*\f*/ ||
            code === 160 /*\u00A0*/ ||
            code === 65279 /*\uFEFF*/ ;

        if (start === -1) {
            if (isWs) {
                continue;
            }
            lastPos = start = i;
        } else {
            if (inWs) {
                if (!isWs) {
                    end = -1;
                    inWs = false;
                }
            } else if (isWs) {
                end = i;
                inWs = true;
            }
        }

        // Only convert backslashes while we haven't seen a split character
        if (!split) {
            switch (code) {
                case 35: // '#'
                    hasHash = true;
                    /* falls through */
                case 63: // '?'
                    split = true;
                    break;
                case 92: // '\\'
                    if (i - lastPos > 0) {
                        rest += url.slice(lastPos, i);
                    }
                    rest += '/';
                    lastPos = i + 1;
                    break;
            }
        } else if (!hasHash && code === 35 /*#*/ ) {
            hasHash = true;
        }
    }

    // Check if string was non-empty (including strings with only whitespace)
    if (start !== -1) {
        if (lastPos === start) {
            // We didn't convert any backslashes

            if (end === -1) {
                if (start === 0) {
                    rest = url;
                } else {
                    rest = url.slice(start);
                }
            } else {
                rest = url.slice(start, end);
            }
        } else if (end === -1 && lastPos < url.length) {
            // We converted some backslashes and have only part of the entire string
            rest += url.slice(lastPos);
        } else if (end !== -1 && lastPos < end) {
            // We converted some backslashes and have only part of the entire string
            rest += url.slice(lastPos, end);
        }
    }

    if (!slashesDenoteHost && !hasHash) {
        // Try fast path regexp
        simplePath = simplePathPattern.exec(rest);

        if (simplePath) {
            this.path = rest;
            this.href = rest;
            this.pathname = simplePath[1];
            if (simplePath[2]) {
                this.search = simplePath[2];
                if (parseQueryString) {
                    this.query = qs.parse(this.search.slice(1));
                } else {
                    this.query = this.search.slice(1);
                }
            } else if (parseQueryString) {
                this.search = '';
                this.query = new ParsedQueryString();
            }
            return this;
        }
    }

    proto = protocolPattern.exec(rest);
    if (proto) {
        proto = proto[0];
        lowerProto = proto.toLowerCase();
        this.protocol = lowerProto;
        rest = rest.slice(proto.length);
    }

    // figure out if it's got a host
    // user@server is *always* interpreted as a hostname, and url
    // resolution will treat //foo/bar as host=foo,path=bar because that's
    // how the browser resolves relative URLs.
    if (slashesDenoteHost || proto || /^\/\/[^@\/]+@[^@\/]+/.test(rest)) {
        slashes = rest.charCodeAt(0) === 47 && rest.charCodeAt(1) === 47;
        if (slashes && !(proto && hostlessProtocol[proto])) {
            rest = rest.slice(2);
            this.slashes = true;
        }
    }

    if (!hostlessProtocol[proto] &&
        (slashes || (proto && !slashedProtocol[proto]))) {

        // there's a hostname.
        // the first instance of /, ?, ;, or # ends the host.
        //
        // If there is an @ in the hostname, then non-host chars *are* allowed
        // to the left of the last @ sign, unless some host-ending character
        // comes *before* the @-sign.
        // URLs are obnoxious.
        //
        // ex:
        // http://a@b@c/ => user:a@b host:c
        // http://a@b?@c => user:a host:b path:/?@c

        // v0.12 TODO(isaacs): This is not quite how Chrome does things.
        // Review our test case against browsers more comprehensively.

        hostEnd = -1;
        atSign = -1;
        nonHost = -1;
        for (i = 0; i < rest.length; i++) {
            switch (rest.charCodeAt(i)) {
                case 9: // '\t'
                case 10: // '\n'
                case 13: // '\r'
                case 32: // ' '
                case 34: // '"'
                case 37: // '%'
                case 39: // '\''
                case 59: // ';'
                case 60: // '<'
                case 62: // '>'
                case 92: // '\\'
                case 94: // '^'
                case 96: // '`'
                case 123: // '{'
                case 124: // '|'
                case 125: // '}'
                    // Characters that are never ever allowed in a hostname from RFC 2396
                    if (nonHost === -1) {
                        nonHost = i;
                    }
                    break;
                case 35: // '#'
                case 47: // '/'
                case 63: // '?'
                    // Find the first instance of any host-ending characters
                    if (nonHost === -1) {
                        nonHost = i;
                    }
                    hostEnd = i;
                    break;
                case 64: // '@'
                    // At this point, either we have an explicit point where the
                    // auth portion cannot go past, or the last @ char is the decider.
                    atSign = i;
                    nonHost = -1;
                    break;
            }
            if (hostEnd !== -1) {
                break;
            }
        }
        start = 0;
        if (atSign !== -1) {
            this.auth = decodeURIComponent(rest.slice(0, atSign));
            start = atSign + 1;
        }
        if (nonHost === -1) {
            this.host = rest.slice(start);
            rest = '';
        } else {
            this.host = rest.slice(start, nonHost);
            rest = rest.slice(nonHost);
        }

        // pull out port.
        this.parseHost();

        // we've indicated that there is a hostname,
        // so even if it's empty, it has to be present.
        if (!isString(this.hostname)) {
            this.hostname = '';
        }

        hostname = this.hostname;

        // if hostname begins with [ and ends with ]
        // assume that it's an IPv6 address.
        ipv6Hostname = hostname.charCodeAt(0) === 91 && hostname.charCodeAt(hostname.length - 1) === 93;

        // validate a little.
        if (!ipv6Hostname) {
            result = validateHostname(this, rest, hostname);
            if (!isUndefined(result)) {
                rest = result;
            }
        }

        if (this.hostname.length > hostnameMaxLen) {
            this.hostname = '';
        } else {
            // hostnames are always lower case.
            this.hostname = this.hostname.toLowerCase();
        }

        if (!ipv6Hostname) {
            // IDNA Support: Returns a punycoded representation of "domain".
            // It only converts parts of the domain name that
            // have non-ASCII characters, i.e. it doesn't matter if
            // you call it with a domain that already is ASCII-only.
            this.hostname = toASCII(this.hostname);
        }

        p = this.port ? ':' + this.port : '';
        h = this.hostname || '';
        this.host = h + p;

        // strip [ and ] from the hostname
        // the host field still retains them, though
        if (ipv6Hostname) {
            this.hostname = this.hostname.slice(1, -1);
            if (rest[0] !== '/') {
                rest = '/' + rest;
            }
        }
    }

    // now rest is set to the post-host stuff.
    // chop off any delim chars.
    if (!unsafeProtocol[lowerProto]) {
        // First, make 100% sure that any "autoEscape" chars get
        // escaped, even if encodeURIComponent doesn't think they
        // need to be.
        result = autoEscapeStr(rest);
        if (!isUndefined(result)) {
            rest = result;
        }
    }

    questionIdx = -1;
    hashIdx = -1;
    for (i = 0; i < rest.length; ++i) {
        code = rest.charCodeAt(i);
        if (code === 35 /*#*/ ) {
            this.hash = rest.slice(i);
            hashIdx = i;
            break;
        } else if (code === 63 /*?*/ && questionIdx === -1) {
            questionIdx = i;
        }
    }

    if (questionIdx !== -1) {
        if (hashIdx === -1) {
            this.search = rest.slice(questionIdx);
            this.query = rest.slice(questionIdx + 1);
        } else {
            this.search = rest.slice(questionIdx, hashIdx);
            this.query = rest.slice(questionIdx + 1, hashIdx);
        }
        if (parseQueryString) {
            this.query = qs.parse(this.query);
        }
    } else if (parseQueryString) {
        // no query string, but parseQueryString still requested
        this.search = '';
        this.query = new ParsedQueryString();
    }

    firstIdx = (
        questionIdx !== -1 && (hashIdx === -1 || questionIdx < hashIdx) ?
        questionIdx :
        hashIdx
    );

    if (firstIdx === -1) {
        if (rest.length > 0) {
            this.pathname = rest;
        }
    } else if (firstIdx > 0) {
        this.pathname = rest.slice(0, firstIdx);
    }
    if (slashedProtocol[lowerProto] &&
        this.hostname && !this.pathname) {
        this.pathname = '/';
    }

    // to support http.request
    if (this.pathname || this.search) {
        p = this.pathname || '';
        s = this.search || '';
        this.path = p + s;
    }

    // finally, reconstruct the href based on what has been validated.
    this.href = this.format();

    return this;
};

function validateHostname(self, rest, hostname) {
    var i, lastPos, code;

    for (i = 0, lastPos; i <= hostname.length; ++i) {
        if (i < hostname.length) {
            code = hostname.charCodeAt(i);
        }
        if (code === 46 /*.*/ || i === hostname.length) {
            if (i - lastPos > 0) {
                if (i - lastPos > 63) {
                    self.hostname = hostname.slice(0, lastPos + 63);
                    return '/' + hostname.slice(lastPos + 63) + rest;
                }
            }
            lastPos = i + 1;
            continue;
        } else if ((code >= 48 /*0*/ && code <= 57 /*9*/ ) ||
            (code >= 97 /*a*/ && code <= 122 /*z*/ ) ||
            code === 45 /*-*/ ||
            (code >= 65 /*A*/ && code <= 90 /*Z*/ ) ||
            code === 43 /*+*/ ||
            code === 95 /*_*/ ||
            code > 127) {
            continue;
        }
        // Invalid host character
        self.hostname = hostname.slice(0, i);
        if (i < hostname.length) {
            return '/' + hostname.slice(i) + rest;
        }
        break;
    }
}

function autoEscapeStr(rest) {
    var newRest = '',
        lastPos = 0,
        i;
    for (i = 0; i < rest.length; i++) {
        // Automatically escape all delimiters and unwise characters from RFC 2396
        // Also escape single quotes in case of an XSS attack
        switch (rest.charCodeAt(i)) {
            case 9: // '\t'
                if (i - lastPos > 0) {
                    newRest += rest.slice(lastPos, i);
                }
                newRest += '%09';
                lastPos = i + 1;
                break;
            case 10: // '\n'
                if (i - lastPos > 0) {
                    newRest += rest.slice(lastPos, i);
                }
                newRest += '%0A';
                lastPos = i + 1;
                break;
            case 13: // '\r'
                if (i - lastPos > 0) {
                    newRest += rest.slice(lastPos, i);
                }
                newRest += '%0D';
                lastPos = i + 1;
                break;
            case 32: // ' '
                if (i - lastPos > 0) {
                    newRest += rest.slice(lastPos, i);
                }
                newRest += '%20';
                lastPos = i + 1;
                break;
            case 34: // '"'
                if (i - lastPos > 0) {
                    newRest += rest.slice(lastPos, i);
                }
                newRest += '%22';
                lastPos = i + 1;
                break;
            case 39: // '\''
                if (i - lastPos > 0) {
                    newRest += rest.slice(lastPos, i);
                }
                newRest += '%27';
                lastPos = i + 1;
                break;
            case 60: // '<'
                if (i - lastPos > 0) {
                    newRest += rest.slice(lastPos, i);
                }
                newRest += '%3C';
                lastPos = i + 1;
                break;
            case 62: // '>'
                if (i - lastPos > 0) {
                    newRest += rest.slice(lastPos, i);
                }
                newRest += '%3E';
                lastPos = i + 1;
                break;
            case 92: // '\\'
                if (i - lastPos > 0) {
                    newRest += rest.slice(lastPos, i);
                }
                newRest += '%5C';
                lastPos = i + 1;
                break;
            case 94: // '^'
                if (i - lastPos > 0) {
                    newRest += rest.slice(lastPos, i);
                }
                newRest += '%5E';
                lastPos = i + 1;
                break;
            case 96: // '`'
                if (i - lastPos > 0) {
                    newRest += rest.slice(lastPos, i);
                }
                newRest += '%60';
                lastPos = i + 1;
                break;
            case 123: // '{'
                if (i - lastPos > 0) {
                    newRest += rest.slice(lastPos, i);
                }
                newRest += '%7B';
                lastPos = i + 1;
                break;
            case 124: // '|'
                if (i - lastPos > 0) {
                    newRest += rest.slice(lastPos, i);
                }
                newRest += '%7C';
                lastPos = i + 1;
                break;
            case 125: // '}'
                if (i - lastPos > 0) {
                    newRest += rest.slice(lastPos, i);
                }
                newRest += '%7D';
                lastPos = i + 1;
                break;
        }
    }
    if (lastPos === 0) {
        return;
    }
    if (lastPos < rest.length) {
        return newRest + rest.slice(lastPos);
    } else {
        return newRest;
    }
}

// format a parsed object into a url string
function urlFormat(obj) {
    // ensure it's an object, and not a string url.
    // If it's an obj, this is a no-op.
    // this way, you can call url_format() on strings
    // to clean up potentially wonky urls.
    if (isString(obj)) {
        obj = urlParse(obj);
    } else if (!isObject(obj) || isNull(obj)) {
        throw new TypeError('Parameter "urlObj" must be an object, not ' +
            isNull(obj) ? 'null' : typeof obj);
    } else if (!(obj instanceof Url)) {
        return Url.prototype.format.call(obj);
    } else {
        return obj.format();
    }
}

Url.prototype.format = function() {
    var auth = this.auth || '',
        protocol, pathname, hash, host, query, search, newPathname, lastPos, i;

    if (auth) {
        auth = encodeAuth(auth);
        auth += '@';
    }

    protocol = this.protocol || '';
    pathname = this.pathname || '';
    hash = this.hash || '';
    host = '';
    query = '';

    if (this.host) {
        host = auth + this.host;
    } else if (this.hostname) {
        host = (
            auth + (this.hostname.indexOf(':') === -1 ?
                this.hostname :
                '[' + this.hostname + ']')
        );
        if (this.port) {
            host += ':' + this.port;
        }
    }

    if (isNull(this.query) && isObject(this.query)) {
        query = qs.stringify(this.query);
    }

    search = this.search || (query && ('?' + query)) || '';

    if (protocol && protocol.charCodeAt(protocol.length - 1) !== 58 /*:*/ ) {
        protocol += ':';
    }

    newPathname = '';
    lastPos = 0;
    for (i = 0; i < pathname.length; ++i) {
        switch (pathname.charCodeAt(i)) {
            case 35: // '#'
                if (i - lastPos > 0) {
                    newPathname += pathname.slice(lastPos, i);
                }
                newPathname += '%23';
                lastPos = i + 1;
                break;
            case 63: // '?'
                if (i - lastPos > 0) {
                    newPathname += pathname.slice(lastPos, i);
                }
                newPathname += '%3F';
                lastPos = i + 1;
                break;
        }
    }
    if (lastPos > 0) {
        if (lastPos !== pathname.length) {
            pathname = newPathname + pathname.slice(lastPos);
        } else {
            pathname = newPathname;
        }
    }

    // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
    // unless they had them to begin with.
    if (this.slashes || slashedProtocol[protocol]) {
        if (this.slashes || host) {
            if (pathname && pathname.charCodeAt(0) !== 47 /*/*/ ) {
                pathname = '/' + pathname;
            }
            host = '//' + host;
        } else if (protocol.length >= 4 &&
            protocol.charCodeAt(0) === 102 /*f*/ &&
            protocol.charCodeAt(1) === 105 /*i*/ &&
            protocol.charCodeAt(2) === 108 /*l*/ &&
            protocol.charCodeAt(3) === 101 /*e*/ ) {
            host = '//';
        }
    }

    search = search.replace(/#/g, '%23');

    if (hash && hash.charCodeAt(0) !== 35 /*#*/ ) {
        hash = '#' + hash;
    }
    if (search && search.charCodeAt(0) !== 63 /*?*/ ) {
        search = '?' + search;
    }

    return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
    return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
    return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
    if (!source) {
        return relative;
    }
    return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
    var rel, result, tkeys, tk, tkey, rkeys, rk, ks, v, k, relPath, p, s,
        isSourceAbs, isRelAbs, mustEndAbs, removeAllDots, srcPath, psychotic,
        authInHost, last, hasTrailingSlash, up, i, isAbsolute;

    if (isString(relative)) {
        rel = new Url();
        rel.parse(relative, false, true);
        relative = rel;
    }

    result = new Url();
    tkeys = keys(this);
    for (tk = 0; tk < tkeys.length; tk++) {
        tkey = tkeys[tk];
        result[tkey] = this[tkey];
    }

    // hash is always overridden, no matter what.
    // even href="" will remove it.
    result.hash = relative.hash;

    // if the relative url is empty, then there's nothing left to do here.
    if (relative.href === '') {
        result.href = result.format();
        return result;
    }

    // hrefs like //foo/bar always cut to the protocol.
    if (relative.slashes && !relative.protocol) {
        // take everything except the protocol from relative
        rkeys = keys(relative);

        for (rk = 0; rk < rkeys.length; rk++) {
            rkey = rkeys[rk];
            if (rkey !== 'protocol') {
                result[rkey] = relative[rkey];
            }
        }

        //urlParse appends trailing / to urls like http://www.example.com
        if (slashedProtocol[result.protocol] &&
            result.hostname && !result.pathname) {
            result.path = result.pathname = '/';
        }

        result.href = result.format();

        return result;
    }

    if (relative.protocol && relative.protocol !== result.protocol) {
        // if it's a known url protocol, then changing
        // the protocol does weird things
        // first, if it's not file:, then we MUST have a host,
        // and if there was a path
        // to begin with, then we MUST have a path.
        // if it is file:, then the host is dropped,
        // because that's known to be hostless.
        // anything else is assumed to be absolute.
        if (!slashedProtocol[relative.protocol]) {
            ks = keys(relative);
            for (v = 0; v < ks.length; v++) {
                k = ks[v];
                result[k] = relative[k];
            }
            result.href = result.format();
            return result;
        }

        result.protocol = relative.protocol;
        if (!relative.host &&
            !/^file:?$/.test(relative.protocol) &&
            !hostlessProtocol[relative.protocol]) {
            relPath = (relative.pathname || '').split('/');
            while (relPath.length && !(relative.host = relPath.shift())) {}
            if (!relative.host) {
                relative.host = '';
            }
            if (!relative.hostname) {
                relative.hostname = '';
            }
            if (relPath[0] !== '') {
                relPath.unshift('');
            }
            if (relPath.length < 2) {
                relPath.unshift('');
            }
            result.pathname = relPath.join('/');
        } else {
            result.pathname = relative.pathname;
        }
        result.search = relative.search;
        result.query = relative.query;
        result.host = relative.host || '';
        result.auth = relative.auth;
        result.hostname = relative.hostname || relative.host;
        result.port = relative.port;
        // to support http.request
        if (result.pathname || result.search) {
            p = result.pathname || '';
            s = result.search || '';
            result.path = p + s;
        }
        result.slashes = result.slashes || relative.slashes;
        result.href = result.format();
        return result;
    }

    isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/');
    isRelAbs = (
        relative.host ||
        relative.pathname && relative.pathname.charAt(0) === '/'
    );
    mustEndAbs = (isRelAbs || isSourceAbs || (result.host && relative.pathname));
    removeAllDots = mustEndAbs;
    srcPath = result.pathname && result.pathname.split('/') || [];
    relPath = relative.pathname && relative.pathname.split('/') || [];
    psychotic = result.protocol && !slashedProtocol[result.protocol];

    // if the url is a non-slashed url, then relative
    // links like ../.. should be able
    // to crawl up to the hostname, as well.  This is strange.
    // result.protocol has already been set by now.
    // Later on, put the first path part into the host field.
    if (psychotic) {
        result.hostname = '';
        result.port = null;
        if (result.host) {
            if (srcPath[0] === '') {
                srcPath[0] = result.host;
            } else {
                srcPath.unshift(result.host);
            }
        }
        result.host = '';
        if (relative.protocol) {
            relative.hostname = null;
            relative.port = null;
            result.auth = null;
            if (relative.host) {
                if (relPath[0] === '') {
                    relPath[0] = relative.host;
                } else {
                    relPath.unshift(relative.host);
                }
            }
            relative.host = null;
        }
        mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
    }

    if (isRelAbs) {
        // it's absolute.
        if (relative.host || relative.host === '') {
            if (result.host !== relative.host) {
                result.auth = null;
            }
            result.host = relative.host;
            result.port = relative.port;
        }
        if (relative.hostname || relative.hostname === '') {
            if (result.hostname !== relative.hostname) {
                result.auth = null;
            }
            result.hostname = relative.hostname;
        }
        result.search = relative.search;
        result.query = relative.query;
        srcPath = relPath;
        // fall through to the dot-handling below.
    } else if (relPath.length) {
        // it's relative
        // throw away the existing file, and take the new path instead.
        if (!srcPath) {
            srcPath = [];
        }
        srcPath.pop();
        srcPath = srcPath.concat(relPath);
        result.search = relative.search;
        result.query = relative.query;
    } else if (isNull(relative.search) && relative.search !== undefined) {
        // just pull out the search.
        // like href='?foo'.
        // Put this after the other two cases because it simplifies the booleans
        if (psychotic) {
            result.hostname = result.host = srcPath.shift();
            //occasionally the auth can get stuck only in host
            //this especially happens in cases like
            //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
            authInHost = result.host && result.host.indexOf('@') > 0 ?
                result.host.split('@') : false;
            if (authInHost) {
                result.auth = authInHost.shift();
                result.host = result.hostname = authInHost.shift();
            }
        }
        result.search = relative.search;
        result.query = relative.query;
        //to support http.request
        if (isNull(result.pathname) || isNull(result.search)) {
            result.path = (result.pathname ? result.pathname : '') +
                (result.search ? result.search : '');
        }
        result.href = result.format();
        return result;
    }

    if (!srcPath.length) {
        // no path at all.  easy.
        // we've already handled the other stuff above.
        result.pathname = null;
        //to support http.request
        if (result.search) {
            result.path = '/' + result.search;
        } else {
            result.path = null;
        }
        result.href = result.format();

        return result;
    }

    // if a url ENDs in . or .., then it must get a trailing slash.
    // however, if it ends in anything else non-slashy,
    // then it must NOT get a trailing slash.
    last = srcPath.slice(-1)[0];
    hasTrailingSlash = (
        (result.host || relative.host || srcPath.length > 1) &&
        (last === '.' || last === '..') || last === '');

    // strip single dots, resolve double dots to parent dir
    // if the path tries to go above the root, `up` ends up > 0
    up = 0;
    for (i = srcPath.length - 1; i >= 0; i--) {
        last = srcPath[i];
        if (last === '.') {
            spliceOne(srcPath, i);
        } else if (last === '..') {
            spliceOne(srcPath, i);
            up++;
        } else if (up) {
            spliceOne(srcPath, i);
            up--;
        }
    }

    // if the path is allowed to go above the root, restore leading ..s
    if (!mustEndAbs && !removeAllDots) {
        for (; up--; up) {
            srcPath.unshift('..');
        }
    }

    if (mustEndAbs && srcPath[0] !== '' && (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
        srcPath.unshift('');
    }

    if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
        srcPath.push('');
    }

    isAbsolute = srcPath[0] === '' || (srcPath[0] && srcPath[0].charAt(0) === '/');

    // put the host back
    if (psychotic) {
        result.hostname = result.host = isAbsolute ? '' : srcPath.length ? srcPath.shift() : '';
        //occasionally the auth can get stuck only in host
        //this especially happens in cases like
        //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
        authInHost = result.host && result.host.indexOf('@') > 0 ?
            result.host.split('@') : false;
        if (authInHost) {
            result.auth = authInHost.shift();
            result.host = result.hostname = authInHost.shift();
        }
    }

    mustEndAbs = mustEndAbs || (result.host && srcPath.length);

    if (mustEndAbs && !isAbsolute) {
        srcPath.unshift('');
    }

    if (!srcPath.length) {
        result.pathname = null;
        result.path = null;
    } else {
        result.pathname = srcPath.join('/');
    }

    //to support request.http
    if (isNull(result.pathname) || isNull(result.search)) {
        result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
    }
    result.auth = relative.auth || result.auth;
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();

    return result;
};

Url.prototype.parseHost = function() {
    var host = this.host,
        port = portPattern.exec(host);

    if (port) {
        port = port[0];
        if (port !== ':') {
            this.port = port.slice(1);
        }
        host = host.slice(0, host.length - port.length);
    }
    if (host) {
        this.hostname = host;
    }
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
    var i = index,
        k = i + 1,
        n = list.length;

    for (; k < n; i += 1, k += 1) {
        list[i] = list[k];
    }
    list.pop();
}

var hexTable = new Array(256);
for (var i = 0; i < 256; ++i) {
    hexTable[i] = '%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase();
}

function encodeAuth(str) {
    // faster encodeURIComponent alternative for encoding auth uri components
    var out = '',
        lastPos = 0,
        i, c, c2;

    for (i = 0; i < str.length; ++i) {
        c = str.charCodeAt(i);

        // These characters do not need escaping:
        // ! - . _ ~
        // ' ( ) * :
        // digits
        // alpha (uppercase)
        // alpha (lowercase)
        if (c === 0x21 || c === 0x2D || c === 0x2E || c === 0x5F || c === 0x7E ||
            (c >= 0x27 && c <= 0x2A) ||
            (c >= 0x30 && c <= 0x3A) ||
            (c >= 0x41 && c <= 0x5A) ||
            (c >= 0x61 && c <= 0x7A)) {
            continue;
        }

        if (i - lastPos > 0) {
            out += str.slice(lastPos, i);
        }

        lastPos = i + 1;

        // Other ASCII characters
        if (c < 0x80) {
            out += hexTable[c];
            continue;
        }

        // Multi-byte characters ...
        if (c < 0x800) {
            out += hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)];
            continue;
        }
        if (c < 0xD800 || c >= 0xE000) {
            out += hexTable[0xE0 | (c >> 12)] +
                hexTable[0x80 | ((c >> 6) & 0x3F)] +
                hexTable[0x80 | (c & 0x3F)];
            continue;
        }
        // Surrogate pair
        ++i;
        c2;
        if (i < str.length) {
            c2 = str.charCodeAt(i) & 0x3FF;
        } else {
            c2 = 0;
        }
        c = 0x10000 + (((c & 0x3FF) << 10) | c2);
        out += hexTable[0xF0 | (c >> 18)] +
            hexTable[0x80 | ((c >> 12) & 0x3F)] +
            hexTable[0x80 | ((c >> 6) & 0x3F)] +
            hexTable[0x80 | (c & 0x3F)];
    }
    if (lastPos === 0) {
        return str;
    }
    if (lastPos < str.length) {
        return out + str.slice(lastPos);
    }
    return out;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/request@0.0.9/src/browser.js-=@*/
module.exports = require(31)(require(32));

},
function(require, exports, module, undefined, global) {
/*@=-buffer@3.6.0/index.js-=@*/
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require(13)
var ieee754 = require(14)
var isArray = require(15)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
 *     on objects.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

function typedArraySupport () {
  function Bar () {}
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    arr.constructor = Bar
    return arr.foo() === 42 && // typed array instances can be augmented
        arr.constructor === Bar && // constructor can be set
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    this.length = 0
    this.parent = undefined
  }

  // Common case.
  if (typeof arg === 'number') {
    return fromNumber(this, arg)
  }

  // Slightly less common case.
  if (typeof arg === 'string') {
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
  }

  // Unusual.
  return fromObject(this, arg)
}

function fromNumber (that, length) {
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < length; i++) {
      that[i] = 0
    }
  }
  return that
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
  var length = byteLength(string, encoding) | 0
  that = allocate(that, length)

  that.write(string, encoding)
  return that
}

function fromObject (that, object) {
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

  if (isArray(object)) return fromArray(that, object)

  if (object == null) {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (typeof ArrayBuffer !== 'undefined') {
    if (object.buffer instanceof ArrayBuffer) {
      return fromTypedArray(that, object)
    }
    if (object instanceof ArrayBuffer) {
      return fromArrayBuffer(that, object)
    }
  }

  if (object.length) return fromArrayLike(that, object)

  return fromJsonObject(that, object)
}

function fromBuffer (that, buffer) {
  var length = checked(buffer.length) | 0
  that = allocate(that, length)
  buffer.copy(that, 0, 0, length)
  return that
}

function fromArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Duplicate of fromArray() to keep fromArray() monomorphic.
function fromTypedArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    array.byteLength
    that = Buffer._augment(new Uint8Array(array))
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromTypedArray(that, new Uint8Array(array))
  }
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
function fromJsonObject (that, object) {
  var array
  var length = 0

  if (object.type === 'Buffer' && isArray(object.data)) {
    array = object.data
    length = checked(array.length) | 0
  }
  that = allocate(that, length)

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
} else {
  // pre-set for values that may exist in the future
  Buffer.prototype.length = undefined
  Buffer.prototype.parent = undefined
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = Buffer._augment(new Uint8Array(length))
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
    that._isBuffer = true
  }

  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
  if (fromPool) that.parent = rootParent

  return that
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  var i = 0
  var len = Math.min(x, y)
  while (i < len) {
    if (a[i] !== b[i]) break

    ++i
  }

  if (i !== len) {
    x = a[i]
    y = b[i]
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buf = new Buffer(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

function byteLength (string, encoding) {
  if (typeof string !== 'string') string = '' + string

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  start = start | 0
  end = end === undefined || end === Infinity ? this.length : end | 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

// `get` is deprecated
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` is deprecated
Buffer.prototype.set = function set (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    var swap = encoding
    encoding = offset
    offset = length | 0
    length = swap
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), targetStart)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
  arr._set = arr.set

  // deprecated
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.indexOf = BP.indexOf
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/index_of@0.0.1/src/index.js-=@*/
var isEqual = require(16);


module.exports = indexOf;


function indexOf(array, value, fromIndex) {
    var i = (fromIndex || 0) - 1,
        il = array.length - 1;

    while (i++ < il) {
        if (isEqual(array[i], value)) {
            return i;
        }
    }

    return -1;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/has@0.0.2/src/index.js-=@*/
var isNative = require(17),
    getPrototypeOf = require(18),
    isNullOrUndefined = require(19);


var nativeHasOwnProp = Object.prototype.hasOwnProperty,
    baseHas;


module.exports = has;


function has(object, key) {
    if (isNullOrUndefined(object)) {
        return false;
    } else {
        return baseHas(object, key);
    }
}

if (isNative(nativeHasOwnProp)) {
    baseHas = function baseHas(object, key) {
        if (object.hasOwnProperty) {
            return object.hasOwnProperty(key);
        } else {
            return nativeHasOwnProp.call(object, key);
        }
    };
} else {
    baseHas = function baseHas(object, key) {
        var proto = getPrototypeOf(object);

        if (isNullOrUndefined(proto)) {
            return key in object;
        } else {
            return (key in object) && (!(key in proto) || proto[key] !== object[key]);
        }
    };
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/keys@0.0.2/src/index.js-=@*/
var has = require(7),
    isNative = require(17),
    isNullOrUndefined = require(19),
    isObject = require(12);


var nativeKeys = Object.keys;


module.exports = keys;


function keys(value) {
    if (isNullOrUndefined(value)) {
        return [];
    } else {
        return nativeKeys(isObject(value) ? value : Object(value));
    }
}

if (!isNative(nativeKeys)) {
    nativeKeys = function keys(value) {
        var localHas = has,
            out = [],
            i = 0,
            key;

        for (key in value) {
            if (localHas(value, key)) {
                out[i++] = key;
            }
        }

        return out;
    };
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_primitive@0.0.2/src/index.js-=@*/
var isNullOrUndefined = require(19);


module.exports = isPrimitive;


function isPrimitive(obj) {
    var typeStr;
    return isNullOrUndefined(obj) || ((typeStr = typeof(obj)) !== "object" && typeStr !== "function") || false;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_array_like@0.0.2/src/index.js-=@*/
var isLength = require(26),
    isFunction = require(20),
    isObject = require(12);


module.exports = isArrayLike;


function isArrayLike(value) {
    return !isFunction(value) && isObject(value) && isLength(value.length);
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_nan@0.0.2/src/index.js-=@*/
var isNumber = require(27);


module.exports = Number.isNaN || function isNaN(value) {
    return isNumber(value) && value !== value;
};

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_object@0.0.1/src/index.js-=@*/
var isNull = require(22);


module.exports = isObject;


function isObject(value) {
    var type = typeof(value);
    return type === "function" || (!isNull(value) && type === "object") || false;
}

},
function(require, exports, module, undefined, global) {
/*@=-base64-js@0.0.8/lib/b64.js-=@*/
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},
function(require, exports, module, undefined, global) {
/*@=-ieee754@1.1.8/index.js-=@*/
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},
function(require, exports, module, undefined, global) {
/*@=-isarray@1.0.0/index.js-=@*/
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_equal@0.0.1/src/index.js-=@*/
module.exports = isEqual;


function isEqual(a, b) {
    return !(a !== b && !(a !== a && b !== b));
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_native@0.0.2/src/index.js-=@*/
var isFunction = require(20),
    isNullOrUndefined = require(19),
    escapeRegExp = require(21);


var reHostCtor = /^\[object .+?Constructor\]$/,

    functionToString = Function.prototype.toString,

    reNative = RegExp("^" +
        escapeRegExp(Object.prototype.toString)
        .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ),

    isHostObject;


module.exports = isNative;


function isNative(value) {
    return !isNullOrUndefined(value) && (
        isFunction(value) ?
        reNative.test(functionToString.call(value)) : (
            typeof(value) === "object" && (
                (isHostObject(value) ? reNative : reHostCtor).test(value) || false
            )
        )
    ) || false;
}

try {
    String({
        "toString": 0
    } + "");
} catch (e) {
    isHostObject = function isHostObject() {
        return false;
    };
}

isHostObject = function isHostObject(value) {
    return !isFunction(value.toString) && typeof(value + "") === "string";
};

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/get_prototype_of@0.0.1/src/index.js-=@*/
var isObject = require(12),
    isNative = require(17),
    isNullOrUndefined = require(19);


var nativeGetPrototypeOf = Object.getPrototypeOf,
    baseGetPrototypeOf;


module.exports = getPrototypeOf;


function getPrototypeOf(value) {
    if (isNullOrUndefined(value)) {
        return null;
    } else {
        return baseGetPrototypeOf(value);
    }
}

if (isNative(nativeGetPrototypeOf)) {
    baseGetPrototypeOf = function baseGetPrototypeOf(value) {
        return nativeGetPrototypeOf(isObject(value) ? value : Object(value)) || null;
    };
} else {
    if ("".__proto__ === String.prototype) {
        baseGetPrototypeOf = function baseGetPrototypeOf(value) {
            return value.__proto__ || null;
        };
    } else {
        baseGetPrototypeOf = function baseGetPrototypeOf(value) {
            return value.constructor ? value.constructor.prototype : null;
        };
    }
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_null_or_undefined@0.0.1/src/index.js-=@*/
var isNull = require(22),
    isUndefined = require(23);


module.exports = isNullOrUndefined;

/**
  isNullOrUndefined accepts any value and returns true
  if the value is null or undefined. For all other values
  false is returned.
  
  @param {Any}        any value to test
  @returns {Boolean}  the boolean result of testing value

  @example
    isNullOrUndefined(null);   // returns true
    isNullOrUndefined(undefined);   // returns true
    isNullOrUndefined("string");    // returns false
**/
function isNullOrUndefined(value) {
    return isNull(value) || isUndefined(value);
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_function@0.0.1/src/index.js-=@*/
var objectToString = Object.prototype.toString,
    isFunction;


if (objectToString.call(function() {}) === "[object Object]") {
    isFunction = function isFunction(value) {
        return value instanceof Function;
    };
} else if (typeof(/./) === "function" || (typeof(Uint8Array) !== "undefined" && typeof(Uint8Array) !== "function")) {
    isFunction = function isFunction(value) {
        return objectToString.call(value) === "[object Function]";
    };
} else {
    isFunction = function isFunction(value) {
        return typeof(value) === "function" || false;
    };
}


module.exports = isFunction;

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/escape_regexp@0.0.1/src/index.js-=@*/
var toString = require(24);


var reRegExpChars = /[.*+?\^${}()|\[\]\/\\]/g,
    reHasRegExpChars = new RegExp(reRegExpChars.source);


module.exports = escapeRegExp;


function escapeRegExp(string) {
    string = toString(string);
    return (
        (string && reHasRegExpChars.test(string)) ?
        string.replace(reRegExpChars, "\\$&") :
        string
    );
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_null@0.0.1/src/index.js-=@*/
module.exports = isNull;


function isNull(value) {
    return value === null;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_undefined@0.0.1/src/index.js-=@*/
module.exports = isUndefined;


function isUndefined(value) {
    return value === void(0);
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/to_string@0.0.1/src/index.js-=@*/
var isString = require(25),
    isNullOrUndefined = require(19);


module.exports = toString;


function toString(value) {
    if (isString(value)) {
        return value;
    } else if (isNullOrUndefined(value)) {
        return "";
    } else {
        return value + "";
    }
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_string@0.0.1/src/index.js-=@*/
module.exports = isString;


function isString(value) {
    return typeof(value) === "string" || false;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_length@0.0.1/src/index.js-=@*/
var isNumber = require(27);


var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;


module.exports = isLength;


function isLength(value) {
    return isNumber(value) && value > -1 && value % 1 === 0 && value <= MAX_SAFE_INTEGER;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_number@0.0.1/src/index.js-=@*/
module.exports = isNumber;


function isNumber(value) {
    return typeof(value) === "number" || false;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/create@0.0.2/src/index.js-=@*/
var isNull = require(22),
    isNative = require(17),
    isPrimitive = require(9);


var nativeCreate = Object.create;


module.exports = create;


function create(object) {
    return nativeCreate(isPrimitive(object) ? null : object);
}

if (!isNative(nativeCreate)) {
    nativeCreate = function nativeCreate(object) {
        var newObject;

        function F() {
            this.constructor = F;
        }

        if (isNull(object)) {
            F.prototype = null;
            newObject = new F();
            newObject.constructor = newObject.__proto__ = null;
            delete newObject.__proto__;
            return newObject;
        } else {
            F.prototype = object;
            return new F();
        }
    };
}

},
function(require, exports, module, undefined, global) {
/*@=-punycode@1.4.1/punycode.js-=@*/
var process = require(30);
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

},
function(require, exports, module, undefined, global) {
/*@=-process@0.11.9/browser.js-=@*/
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/request@0.0.9/src/create.js-=@*/
var methods = require(33),
    arrayForEach = require(34),
    EventEmitter = require(35),
    defaults = require(36);


module.exports = function createRequest(request) {

    arrayForEach(methods, function(method) {
        var upper = method.toUpperCase();

        request[method] = function(url, options) {
            options = options || {};

            options.url = url;
            options.method = upper;

            return request(options);
        };
    });
    request.mSearch = request["m-search"];

    arrayForEach(["post", "patch", "put"], function(method) {
        var upper = method.toUpperCase();

        request[method] = function(url, data, options) {
            options = options || {};

            options.url = url;
            options.data = data;
            options.method = upper;

            return request(options);
        };
    });

    request.defaults = defaults.values;
    request.plugins = new EventEmitter(-1);

    return request;
};

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/request@0.0.9/src/requestBrowser.js-=@*/
var PromisePolyfill = require(45),
    XMLHttpRequestPolyfill = require(46),
    isFunction = require(20),
    isString = require(25),
    isNull = require(22),
    objectForEach = require(47),
    trim = require(48),
    extend = require(39),
    Response = require(49),
    defaults = require(36),
    camelcaseHeader = require(50),
    parseContentType = require(51);


var supportsFormData = typeof(FormData) !== "undefined";


defaults.values.XMLHttpRequest = XMLHttpRequestPolyfill;


function parseResponseHeaders(responseHeaders) {
    var headers = {},
        raw = responseHeaders.split("\n");

    objectForEach(raw, function(header) {
        var tmp = header.split(":"),
            key = tmp[0],
            value = tmp[1];

        if (key && value) {
            key = camelcaseHeader(key);
            value = trim(value);

            if (key === "Content-Length") {
                value = +value;
            }

            headers[key] = value;
        }
    });

    return headers;
}


function addEventListener(xhr, event, listener) {
    if (isFunction(xhr.addEventListener)) {
        xhr.addEventListener(event, listener, false);
    } else if (isFunction(xhr.attachEvent)) {
        xhr.attachEvent("on" + event, listener);
    } else {
        xhr["on" + event] = listener;
    }
}

function request(options) {
    var xhr = new defaults.values.XMLHttpRequest(),
        plugins = request.plugins,
        canSetRequestHeader = isFunction(xhr.setRequestHeader),
        canOverrideMimeType = isFunction(xhr.overrideMimeType),
        defer = null,
        isFormData;

    options = defaults(options);

    plugins.emit("before", xhr, options);

    isFormData = (supportsFormData && options.data instanceof FormData);

    if (options.isPromise) {
        defer = PromisePolyfill.defer();
    }

    function onSuccess(response) {
        plugins.emit("response", response, xhr, options);
        plugins.emit("load", response, xhr, options);

        if (options.isPromise) {
            defer.resolve(response);
        } else {
            if (!isNull(options.success)) {
                options.success(response);
            }
        }
    }

    function onError(response) {
        plugins.emit("response", response, xhr, options);
        plugins.emit("error", response, xhr, options);

        if (options.isPromise) {
            defer.reject(response);
        } else {
            if (!isNull(options.error)) {
                options.error(response);
            }
        }
    }

    function onComplete() {
        var statusCode = +xhr.status,
            responseText = xhr.responseText,
            response = new Response();

        response.url = xhr.responseURL || options.url;
        response.method = options.method;

        response.statusCode = statusCode;

        response.responseHeaders = xhr.getAllResponseHeaders ? parseResponseHeaders(xhr.getAllResponseHeaders()) : {};
        response.requestHeaders = options.headers ? extend({}, options.headers) : {};

        response.data = null;

        if (responseText) {
            if (options.transformResponse) {
                response.data = options.transformResponse(responseText);
            } else {
                if (parseContentType(response.responseHeaders["Content-Type"]) === "application/json") {
                    try {
                        response.data = JSON.parse(responseText);
                    } catch (e) {
                        response.data = e;
                        onError(response);
                        return;
                    }
                } else if (responseText) {
                    response.data = responseText;
                }
            }
        }

        if ((statusCode > 199 && statusCode < 301) || statusCode === 304) {
            onSuccess(response);
        } else {
            onError(response);
        }
    }

    function onReadyStateChange() {
        switch (+xhr.readyState) {
            case 1:
                plugins.emit("request", xhr, options);
                break;
            case 4:
                onComplete();
                break;
        }
    }

    addEventListener(xhr, "readystatechange", onReadyStateChange);

    if (options.withCredentials && options.async) {
        xhr.withCredentials = options.withCredentials;
    }

    xhr.open(
        options.method,
        options.url,
        options.async,
        options.username,
        options.password
    );

    if (canSetRequestHeader) {
        if (options.headers && options.headers["Content-Type"] && isFormData) {
            delete options.headers["Content-Type"];
        }

        objectForEach(options.headers, function(value, key) {
            if (isString(value)) {
                if (key === "Content-Type" && canOverrideMimeType) {
                    xhr.overrideMimeType(value);
                }
                xhr.setRequestHeader(key, value);
            }
        });
    }

    if (options.transformRequest) {
        options.data = options.transformRequest(options.data);
    } else if (options.data) {
        if (!isString(options.data) && !isFormData) {
            if (options.headers["Content-Type"] === "application/json") {
                options.data = JSON.stringify(options.data);
            } else {
                options.data = options.data + "";
            }
        }
    }

    xhr.send(options.data);

    return isNull(defer) ? undefined : defer.promise;
}


module.exports = request;

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/methods@0.0.1/src/browser.js-=@*/
module.exports = [
    "checkout",
    "connect",
    "copy",
    "delete",
    "get",
    "head",
    "lock",
    "m-search",
    "merge",
    "mkactivity",
    "mkcalendar",
    "mkcol",
    "move",
    "notify",
    "options",
    "patch",
    "post",
    "propfind",
    "proppatch",
    "purge",
    "put",
    "report",
    "search",
    "subscribe",
    "trace",
    "unlock",
    "unsubscribe"
];

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/array-for_each@0.0.1/src/index.js-=@*/
module.exports = arrayForEach;


function arrayForEach(array, callback) {
    var i = -1,
        il = array.length - 1;

    while (i++ < il) {
        if (callback(array[i], i, array) === false) {
            break;
        }
    }

    return array;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/event_emitter@0.0.3/src/index.js-=@*/
var isFunction = require(20),
    inherits = require(37),
    fastSlice = require(38),
    keys = require(8),
    isNumber = require(27),
    isNullOrUndefined = require(19);


var EventEmitterPrototype;


module.exports = EventEmitter;


function EventEmitter(maxListeners) {
    this.__events = {};
    this.__maxListeners = isNumber(maxListeners) ? +maxListeners : EventEmitter.defaultMaxListeners;
}
EventEmitterPrototype = EventEmitter.prototype;

EventEmitterPrototype.on = function(name, listener) {
    var events, eventList, maxListeners;

    if (!isFunction(listener)) {
        throw new TypeError("EventEmitter.on(name, listener) listener must be a function");
    }

    events = this.__events || (this.__events = {});
    eventList = (events[name] || (events[name] = []));
    maxListeners = this.__maxListeners || -1;

    eventList[eventList.length] = listener;

    if (maxListeners !== -1 && eventList.length > maxListeners) {
        console.error(
            "EventEmitter.on(type, listener) possible EventEmitter memory leak detected. " + maxListeners + " listeners added"
        );
    }

    return this;
};

EventEmitterPrototype.addEventListener = EventEmitterPrototype.addListener = EventEmitterPrototype.on;

EventEmitterPrototype.once = function(name, listener) {
    var _this = this;

    function once() {

        _this.off(name, once);

        switch (arguments.length) {
            case 0:
                return listener();
            case 1:
                return listener(arguments[0]);
            case 2:
                return listener(arguments[0], arguments[1]);
            case 3:
                return listener(arguments[0], arguments[1], arguments[2]);
            case 4:
                return listener(arguments[0], arguments[1], arguments[2], arguments[3]);
            default:
                return listener.apply(null, arguments);
        }
    }

    this.on(name, once);

    return once;
};

EventEmitterPrototype.listenTo = function(value, name) {
    var _this = this;

    if (!value || !(isFunction(value.on) || isFunction(value.addListener))) {
        throw new TypeError("EventEmitter.listenTo(value, name) value must have a on function taking (name, listener[, ctx])");
    }

    function handler() {
        _this.emitArgs(name, arguments);
    }

    value.on(name, handler);

    return handler;
};

EventEmitterPrototype.off = function(name, listener) {
    var events = this.__events || (this.__events = {}),
        eventList, event, i;

    eventList = events[name];
    if (!eventList) {
        return this;
    }

    if (!listener) {
        i = eventList.length;

        while (i--) {
            this.emit("removeListener", name, eventList[i]);
        }
        eventList.length = 0;
        delete events[name];
    } else {
        i = eventList.length;

        while (i--) {
            event = eventList[i];

            if (event === listener) {
                this.emit("removeListener", name, event);
                eventList.splice(i, 1);
            }
        }

        if (eventList.length === 0) {
            delete events[name];
        }
    }

    return this;
};

EventEmitterPrototype.removeEventListener = EventEmitterPrototype.removeListener = EventEmitterPrototype.off;

EventEmitterPrototype.removeAllListeners = function() {
    var events = this.__events || (this.__events = {}),
        objectKeys = keys(events),
        i = -1,
        il = objectKeys.length - 1,
        key, eventList, j;

    while (i++ < il) {
        key = objectKeys[i];
        eventList = events[key];

        if (eventList) {
            j = eventList.length;

            while (j--) {
                this.emit("removeListener", key, eventList[j]);
                eventList.splice(j, 1);
            }
        }

        delete events[key];
    }

    return this;
};

EventEmitterPrototype.dispatchEvent = function(event) {
    return this.emitArg(event.type, event);
};

EventEmitterPrototype.attachEvent = function(type, listener) {
    return this.on(type.slice(2), listener);
};

EventEmitterPrototype.detachEvent = function(type, listener) {
    return this.off(type.slice(2), listener);
};

EventEmitterPrototype.fireEvent = function(type, event) {
    return this.emitArg(type.slice(2), event);
};

function emit0(eventList) {
    var i = -1,
        il = eventList.length - 1,
        event;

    while (i++ < il) {
        if ((event = eventList[i])) {
            event();
        }
    }
}

function emit1(eventList, a0) {
    var i = -1,
        il = eventList.length - 1,
        event;

    while (i++ < il) {
        if ((event = eventList[i])) {
            event(a0);
        }
    }
}

function emit2(eventList, args) {
    var a0 = args[0],
        a1 = args[1],
        i = -1,
        il = eventList.length - 1,
        event;

    while (i++ < il) {
        if ((event = eventList[i])) {
            event(a0, a1);
        }
    }
}

function emit3(eventList, args) {
    var a0 = args[0],
        a1 = args[1],
        a2 = args[2],
        i = -1,
        il = eventList.length - 1,
        event;

    while (i++ < il) {
        if ((event = eventList[i])) {
            event(a0, a1, a2);
        }
    }
}

function emit4(eventList, args) {
    var a0 = args[0],
        a1 = args[1],
        a2 = args[2],
        a3 = args[3],
        i = -1,
        il = eventList.length - 1,
        event;

    while (i++ < il) {
        if ((event = eventList[i])) {
            event(a0, a1, a2, a3);
        }
    }
}

function emit5(eventList, args) {
    var a0 = args[0],
        a1 = args[1],
        a2 = args[2],
        a3 = args[3],
        a4 = args[4],
        i = -1,
        il = eventList.length - 1,
        event;

    while (i++ < il) {
        if ((event = eventList[i])) {
            event(a0, a1, a2, a3, a4);
        }
    }
}

function emitApply(eventList, args) {
    var i = -1,
        il = eventList.length - 1,
        event;

    while (i++ < il) {
        if ((event = eventList[i])) {
            event.apply(null, args);
        }
    }
}

function emit(eventList, args) {
    switch (args.length) {
        case 0:
            emit0(eventList);
            break;
        case 1:
            emit1(eventList, args[0]);
            break;
        case 2:
            emit2(eventList, args);
            break;
        case 3:
            emit3(eventList, args);
            break;
        case 4:
            emit4(eventList, args);
            break;
        case 5:
            emit5(eventList, args);
            break;
        default:
            emitApply(eventList, args);
            break;
    }
}

EventEmitterPrototype.emitArg = function(name, arg) {
    var eventList = (this.__events || (this.__events = {}))[name];

    if (!eventList || !eventList.length) {
        return this;
    } else {
        emit1(eventList, arg);
        return this;
    }
};

EventEmitterPrototype.emitArgs = function(name, args) {
    var eventList = (this.__events || (this.__events = {}))[name];

    if (!eventList || !eventList.length) {
        return this;
    } else {
        emit(eventList, args);
        return this;
    }
};

EventEmitterPrototype.emit = function(name) {
    return this.emitArgs(name, fastSlice(arguments, 1));
};

function createFunctionCaller(args) {
    var a0, a1, a2, a3, a4;
    switch (args.length) {
        case 0:
            return function functionCaller(fn) {
                return fn();
            };
        case 1:
            a0 = args[0];
            return function functionCaller(fn) {
                return fn(a0);
            };
        case 2:
            a0 = args[0];
            a1 = args[1];
            return function functionCaller(fn) {
                return fn(a0, a1);
            };
        case 3:
            a0 = args[0];
            a1 = args[1];
            a2 = args[2];
            return function functionCaller(fn) {
                return fn(a0, a1, a2);
            };
        case 4:
            a0 = args[0];
            a1 = args[1];
            a2 = args[2];
            a3 = args[3];
            return function functionCaller(fn) {
                return fn(a0, a1, a2, a3);
            };
        case 5:
            a0 = args[0];
            a1 = args[1];
            a2 = args[2];
            a3 = args[3];
            a4 = args[4];
            return function functionCaller(fn) {
                return fn(a0, a1, a2, a3, a4);
            };
        default:
            return function functionCaller(fn) {
                return fn.apply(null, args);
            };
    }
}

function emitAsync(eventList, args, callback) {
    var length = eventList.length,
        index = 0,
        called = false,
        functionCaller;

    function next(error) {
        if (called !== true) {
            if (error || index === length) {
                called = true;
                callback(error);
            } else {
                functionCaller(eventList[index++]);
            }
        }
    }

    args[args.length] = next;
    functionCaller = createFunctionCaller(args);
    next();
}

EventEmitterPrototype.emitAsync = function(name, args, callback) {
    var eventList = (this.__events || (this.__events = {}))[name];

    args = fastSlice(arguments, 1);
    callback = args.pop();

    if (!isFunction(callback)) {
        throw new TypeError("EventEmitter.emitAsync(name [, ...args], callback) callback must be a function");
    } else {
        if (!eventList || !eventList.length) {
            callback();
        } else {
            emitAsync(eventList, args, callback);
        }
        return this;
    }
};

EventEmitterPrototype.listeners = function(name) {
    var eventList = (this.__events || (this.__events = {}))[name];
    return eventList ? eventList.slice() : [];
};

EventEmitterPrototype.listenerCount = function(name) {
    var eventList = (this.__events || (this.__events = {}))[name];
    return eventList ? eventList.length : 0;
};

EventEmitterPrototype.setMaxListeners = function(value) {
    if ((value = +value) !== value) {
        throw new TypeError("EventEmitter.setMaxListeners(value) value must be a number");
    }

    this.__maxListeners = value < 0 ? -1 : value;
    return this;
};

inherits.defineProperty(EventEmitter, "defaultMaxListeners", 10);

inherits.defineProperty(EventEmitter, "listeners", function(value, name) {
    var eventList;

    if (isNullOrUndefined(value)) {
        throw new TypeError("EventEmitter.listeners(value, name) value required");
    }
    eventList = value.__events && value.__events[name];

    return eventList ? eventList.slice() : [];
});

inherits.defineProperty(EventEmitter, "listenerCount", function(value, name) {
    var eventList;

    if (isNullOrUndefined(value)) {
        throw new TypeError("EventEmitter.listenerCount(value, name) value required");
    }
    eventList = value.__events && value.__events[name];

    return eventList ? eventList.length : 0;
});

inherits.defineProperty(EventEmitter, "setMaxListeners", function(value) {
    if ((value = +value) !== value) {
        throw new TypeError("EventEmitter.setMaxListeners(value) value must be a number");
    }

    EventEmitter.defaultMaxListeners = value < 0 ? -1 : value;
    return value;
});

EventEmitter.extend = function(child) {
    inherits(child, this);
    return child;
};

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/request@0.0.9/src/defaults.js-=@*/
var extend = require(39),
    isString = require(25),
    isFunction = require(20);


function defaults(options) {

    options = extend({}, defaults.values, options);

    options.url = isString(options.url || (options.url = options.src)) ? options.url : null;
    options.method = isString(options.method) ? options.method.toUpperCase() : "GET";

    options.transformRequest = isFunction(options.transformRequest) ? options.transformRequest : null;
    options.transformResponse = isFunction(options.transformResponse) ? options.transformResponse : null;

    options.withCredentials = options.withCredentials != null ? !!options.withCredentials : false;
    options.headers = extend({}, defaults.values.headers, options.headers);
    options.async = options.async != null ? !!options.async : true;

    options.success = isFunction(options.success) ? options.success : null;
    options.error = isFunction(options.error) ? options.error : null;
    options.isPromise = !isFunction(options.success) && !isFunction(options.error);

    options.user = isString(options.user) ? options.user : undefined;
    options.password = isString(options.password) ? options.password : undefined;

    return options;
}

defaults.values = {
    url: "",
    method: "GET",
    data: null,
    headers: {
        Accept: "*/*",
        "X-Requested-With": "XMLHttpRequest"
    }
};


module.exports = defaults;

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/inherits@0.0.3/src/index.js-=@*/
var create = require(28),
    extend = require(39),
    mixin = require(40),
    defineProperty = require(41);


var descriptor = {
    configurable: true,
    enumerable: false,
    writable: true,
    value: null
};


module.exports = inherits;


function inherits(child, parent) {

    mixin(child, parent);

    if (child.__super) {
        child.prototype = extend(create(parent.prototype), child.__super, child.prototype);
    } else {
        child.prototype = extend(create(parent.prototype), child.prototype);
    }

    defineNonEnumerableProperty(child, "__super", parent.prototype);
    defineNonEnumerableProperty(child.prototype, "constructor", child);

    child.defineStatic = defineStatic;
    child.super_ = parent;

    return child;
}
inherits.defineProperty = defineNonEnumerableProperty;

function defineNonEnumerableProperty(object, name, value) {
    descriptor.value = value;
    defineProperty(object, name, descriptor);
    descriptor.value = null;
}

function defineStatic(name, value) {
    defineNonEnumerableProperty(this, name, value);
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/fast_slice@0.0.1/src/index.js-=@*/
var clamp = require(44),
    isNumber = require(27);


module.exports = fastSlice;


function fastSlice(array, offset) {
    var length = array.length,
        newLength, i, il, result, j;

    offset = clamp(isNumber(offset) ? offset : 0, 0, length);
    i = offset - 1;
    il = length - 1;
    newLength = length - offset;
    result = new Array(newLength);
    j = 0;

    while (i++ < il) {
        result[j++] = array[i];
    }

    return result;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/extend@0.0.2/src/index.js-=@*/
var keys = require(42),
    isNative = require(17);


var nativeAssign = Object.assign,
    extend, baseExtend;


if (isNative(nativeAssign)) {
    extend = nativeAssign;
} else {
    extend = function extend(out) {
        var i = 0,
            il = arguments.length - 1;

        while (i++ < il) {
            baseExtend(out, arguments[i]);
        }

        return out;
    };
    baseExtend = function baseExtend(a, b) {
        var objectKeys = keys(b),
            i = -1,
            il = objectKeys.length - 1,
            key;

        while (i++ < il) {
            key = objectKeys[i];
            a[key] = b[key];
        }
    };
}


module.exports = extend;

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/mixin@0.0.2/src/index.js-=@*/
var keys = require(8),
    isNullOrUndefined = require(19);


module.exports = mixin;


function mixin(out) {
    var i = 0,
        il = arguments.length - 1;

    while (i++ < il) {
        baseMixin(out, arguments[i]);
    }

    return out;
}

function baseMixin(a, b) {
    var objectKeys = keys(b),
        i = -1,
        il = objectKeys.length - 1,
        key, value;

    while (i++ < il) {
        key = objectKeys[i];

        if (isNullOrUndefined(a[key]) && !isNullOrUndefined((value = b[key]))) {
            a[key] = value;
        }
    }
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/define_property@0.0.2/src/index.js-=@*/
var isObject = require(12),
    isFunction = require(20),
    isPrimitive = require(9),
    isNative = require(17),
    has = require(43);


var nativeDefineProperty = Object.defineProperty;


module.exports = defineProperty;


function defineProperty(object, name, descriptor) {
    if (isPrimitive(descriptor) || isFunction(descriptor)) {
        descriptor = {
            value: descriptor
        };
    }
    return nativeDefineProperty(object, name, descriptor);
}

defineProperty.hasGettersSetters = true;

if (!isNative(nativeDefineProperty) || !(function() {
        var object = {},
            value = {};

        try {
            nativeDefineProperty(object, "key", {
                value: value
            });
            if (has(object, "key") && object.key === value) {
                return true;
            } else {
                return false;
            }
        } catch (e) {}

        return false;
    }())) {

    defineProperty.hasGettersSetters = false;

    nativeDefineProperty = function defineProperty(object, name, descriptor) {
        if (!isObject(object)) {
            throw new TypeError("defineProperty(object, name, descriptor) called on non-object");
        }
        if (has(descriptor, "get") || has(descriptor, "set")) {
            throw new TypeError("defineProperty(object, name, descriptor) this environment does not support getters or setters");
        }
        object[name] = descriptor.value;
    };
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/keys@0.0.1/src/index.js-=@*/
var has = require(43),
    isNative = require(17),
    isNullOrUndefined = require(19),
    isObject = require(12);


var nativeKeys = Object.keys;


module.exports = keys;


function keys(value) {
    if (isNullOrUndefined(value)) {
        return [];
    } else {
        return nativeKeys(isObject(value) ? value : Object(value));
    }
}

if (!isNative(nativeKeys)) {
    nativeKeys = function keys(value) {
        var localHas = has,
            out = [],
            i = 0,
            key;

        for (key in value) {
            if (localHas(value, key)) {
                out[i++] = key;
            }
        }

        return out;
    };
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/has@0.0.1/src/index.js-=@*/
var isNative = require(17),
    getPrototypeOf = require(18),
    isNullOrUndefined = require(19);


var nativeHasOwnProp = Object.prototype.hasOwnProperty,
    baseHas;


module.exports = has;


function has(object, key) {
    if (isNullOrUndefined(object)) {
        return false;
    } else {
        return baseHas(object, key);
    }
}

if (isNative(nativeHasOwnProp)) {
    baseHas = function baseHas(object, key) {
        if (object.hasOwnProperty) {
            return object.hasOwnProperty(key);
        } else {
            return nativeHasOwnProp.call(object, key);
        }
    };
} else {
    baseHas = function baseHas(object, key) {
        var proto = getPrototypeOf(object);

        if (isNullOrUndefined(proto)) {
            return key in object;
        } else {
            return (key in object) && (!(key in proto) || proto[key] !== object[key]);
        }
    };
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/clamp@0.0.1/src/index.js-=@*/
module.exports = clamp;


function clamp(x, min, max) {
    if (x < min) {
        return min;
    } else if (x > max) {
        return max;
    } else {
        return x;
    }
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/promise_polyfill@0.0.4/src/index.js-=@*/
var process = require(30);
var isNull = require(22),
    isArray = require(52),
    isObject = require(12),
    isFunction = require(20),
    apply = require(53),
    WeakMapPolyfill = require(54),
    fastSlice = require(38),
    Iterator = require(55);


var PromisePolyfill, PromisePolyfillPrototype, PrivatePromise, Defer;


if (
    typeof(Promise) !== "undefined" &&
    (function isValidPromise() {
        try {
            new Promise(function resolver(resolve) {
                resolve(true);
            }).then(function onThen() {});
            return true;
        } catch (e) {
            return false;
        }
    }())
) {
    PromisePolyfill = Promise;
    PromisePolyfillPrototype = PromisePolyfill.prototype;
} else {
    PrivatePromise = (function createPrivatePromise() {

        function PrivatePromise(resolver) {
            var _this = this;

            this.handlers = [];
            this.state = null;
            this.value = null;

            handleResolve(
                resolver,
                function resolve(newValue) {
                    resolveValue(_this, newValue);
                },
                function reject(newValue) {
                    rejectValue(_this, newValue);
                }
            );
        }

        PrivatePromise.store = new WeakMapPolyfill();

        PrivatePromise.handle = function(_this, onFulfilled, onRejected, resolve, reject) {
            handle(_this, new Handler(onFulfilled, onRejected, resolve, reject));
        };

        function Handler(onFulfilled, onRejected, resolve, reject) {
            this.onFulfilled = isFunction(onFulfilled) ? onFulfilled : null;
            this.onRejected = isFunction(onRejected) ? onRejected : null;
            this.resolve = resolve;
            this.reject = reject;
        }

        function handleResolve(resolver, onFulfilled, onRejected) {
            var done = false;

            try {
                resolver(
                    function(value) {
                        if (!done) {
                            done = true;
                            onFulfilled(value);
                        }
                    },
                    function(reason) {
                        if (!done) {
                            done = true;
                            onRejected(reason);
                        }
                    }
                );
            } catch (err) {
                if (!done) {
                    done = true;
                    onRejected(err);
                }
            }
        }

        function resolveValue(_this, newValue) {
            try {
                if (newValue === _this) {
                    throw new TypeError("A promise cannot be resolved with itself");
                } else {
                    if (newValue && (isObject(newValue) || isFunction(newValue))) {
                        if (isFunction(newValue.then)) {
                            handleResolve(
                                function resolver(resolve, reject) {
                                    newValue.then(resolve, reject);
                                },
                                function resolve(newValue) {
                                    resolveValue(_this, newValue);
                                },
                                function reject(newValue) {
                                    rejectValue(_this, newValue);
                                }
                            );
                            return;
                        }
                    }
                    _this.state = true;
                    _this.value = newValue;
                    finale(_this);
                }
            } catch (error) {
                rejectValue(_this, error);
            }
        }

        function rejectValue(_this, newValue) {
            _this.state = false;
            _this.value = newValue;
            finale(_this);
        }

        function finale(_this) {
            var handlers = _this.handlers,
                i = -1,
                il = handlers.length - 1;

            while (i++ < il) {
                handle(_this, handlers[i]);
            }

            handlers.length = 0;
        }

        function handle(_this, handler) {
            var state = _this.state;

            if (isNull(_this.state)) {
                _this.handlers.push(handler);
            } else {
                process.nextTick(function onNextTick() {
                    var callback = state ? handler.onFulfilled : handler.onRejected,
                        value = _this.value,
                        out;

                    if (isNull(callback)) {
                        if (state) {
                            handler.resolve(value);
                        } else {
                            handler.reject(value);
                        }
                    } else {
                        try {
                            out = callback(value);
                            handler.resolve(out);
                        } catch (err) {
                            handler.reject(err);
                        }
                    }
                });
            }
        }

        return PrivatePromise;
    }());

    PromisePolyfill = function Promise(resolver) {

        if (!isFunction(resolver)) {
            throw new TypeError("Promise(resolver) You must pass a resolver function as the first argument to the promise constructor");
        }

        PrivatePromise.store.set(this, new PrivatePromise(resolver));
    };

    PromisePolyfillPrototype = PromisePolyfill.prototype;

    PromisePolyfillPrototype.then = function(onFulfilled, onRejected) {
        var _this = PrivatePromise.store.get(this);

        return new PromisePolyfill(function resolver(resolve, reject) {
            PrivatePromise.handle(_this, onFulfilled, onRejected, resolve, reject);
        });
    };
}

if (!isFunction(PromisePolyfillPrototype["catch"])) {
    PromisePolyfillPrototype["catch"] = function(reject) {
        return this.then(null, reject);
    };
}

if (!isFunction(PromisePolyfill.resolve)) {
    PromisePolyfill.resolve = function(value) {
        if (value instanceof PromisePolyfill) {
            return value;
        }

        return new PromisePolyfill(function resolver(resolve) {
            resolve(value);
        });
    };
}

if (!isFunction(PromisePolyfill.reject)) {
    PromisePolyfill.reject = function(value) {
        return new PromisePolyfill(function resolver(resolve, reject) {
            reject(value);
        });
    };
}

if (!isFunction(PromisePolyfill.defer)) {
    Defer = function Defer() {
        var _this = this;

        this.resolve = null;
        this.reject = null;

        this.promise = new PromisePolyfill(function resolver(resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        });
    };

    PromisePolyfill.defer = function() {
        return new Defer();
    };
}

if (!isFunction(PromisePolyfill.all)) {
    PromisePolyfill.all = function(value) {
        var values = (arguments.length === 1 && isArray(value)) ? value : fastSlice(arguments);

        return new PromisePolyfill(function resolver(resolve, reject) {
            var iterator = Iterator.getIterator(values),
                called = false,
                count = 0,
                it, step, value, resolveFn, rejectFn, results;

            if (iterator) {
                it = iterator.call(values);

                resolveFn = function resolveFn(value) {
                    if (!called) {
                        results = results || [];
                        results[results.length] = value;

                        if (--count === 0) {
                            called = true;
                            resolve(results);
                        }
                    }
                };
                rejectFn = function rejectFn(value) {
                    if (!called) {
                        called = true;
                        reject(value);
                    }
                };

                while (!(step = it.next()).done) {
                    count++;
                    value = step.value;

                    if (value && isFunction(value.then)) {
                        value.then(resolveFn, rejectFn);
                    } else {
                        resolveFn(value);
                    }
                }
            } else {
                reject(new Error("Invalid Iterator " + typeof(values)));
            }
        });
    };
}

if (!isFunction(PromisePolyfill.race)) {
    PromisePolyfill.race = function(value) {
        var values = (arguments.length === 1 && isArray(value)) ? value : fastSlice(arguments);

        return new PromisePolyfill(function resolver(resolve, reject) {
            var iterator = Iterator.getIterator(values),
                it, step, value;

            if (iterator) {
                it = iterator.call(values);

                while (!(step = it.next()).done) {
                    value = step.value;

                    if (value && isFunction(value.then)) {
                        value.then(resolve, reject);
                    } else {
                        resolve(value);
                    }
                }
            } else {
                reject(new Error("Invalid Iterator " + typeof(values)));
            }
        });
    };
}

if (!isFunction(PromisePolyfill.promisify)) {
    PromisePolyfill.promisify = function(fn, thisArg) {
        return function promisified() {
            var defer = PromisePolyfill.defer(),
                args = fastSlice(arguments);

            function callback(error, value) {
                if (error) {
                    return defer.reject(error);
                } else {
                    if (arguments.length < 3) {
                        return defer.resolve(value);
                    } else {
                        return defer.resolve(fastSlice(arguments, 1));
                    }
                }
            }

            args[args.length] = callback;
            apply(fn, args, thisArg);

            return defer.promise;
        };
    };
}


module.exports = PromisePolyfill;
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/xmlhttprequest_polyfill@0.0.4/src/index.js-=@*/
var extend = require(39),
    EventEmitter = require(35),
    EventPolyfill = require(58),
    ProgressEventPolyfill = require(59),
    tryCallFunction = require(60),
    trySetValue = require(61),
    emitEvent = require(62),
    toUint8Array = require(63),
    createNativeXMLHttpRequest = require(64);


var hasNativeProgress = false,
    XMLHttpRequestPolyfillPrototype;


module.exports = XMLHttpRequestPolyfill;


function XMLHttpRequestPolyfill(options) {
    var _this = this,
        nativeXMLHttpRequest = createNativeXMLHttpRequest(options || {});

    EventEmitter.call(this, -1);

    this.__requestHeaders = {};
    this.__nativeXMLHttpRequest = nativeXMLHttpRequest;

    this.onabort = null;
    this.onerror = null;
    this.onload = null;
    this.onloadend = null;
    this.onloadstart = null;
    this.onprogress = null;
    this.onreadystatechange = null;
    this.ontimeout = null;

    this.readyState = 0;
    this.response = "";
    this.responseText = "";
    this.responseType = "";
    this.responseURL = "";
    this.responseXML = null;
    this.status = 0;
    this.statusText = "";
    this.timeout = 0;
    this.withCredentials = false;

    nativeXMLHttpRequest.onreadystatechange = function(e) {
        return XMLHttpRequestPolyfill_onReadyStateChange(_this, e || {});
    };

    nativeXMLHttpRequest.ontimeout = function(e) {
        emitEvent(_this, "timeout", new EventPolyfill("timeout", e || {}));
    };

    nativeXMLHttpRequest.onerror = function(e) {
        emitEvent(_this, "error", new EventPolyfill("error", e || {}));
    };

    if ("onprogress" in nativeXMLHttpRequest) {
        hasNativeProgress = true;
        nativeXMLHttpRequest.onprogress = function(e) {
            emitEvent(_this, "progress", new ProgressEventPolyfill("progress", e || {}));
        };
    }
}
EventEmitter.extend(XMLHttpRequestPolyfill);
XMLHttpRequestPolyfillPrototype = XMLHttpRequestPolyfill.prototype;


function XMLHttpRequestPolyfill_onReadyStateChange(_this, e) {
    var nativeXMLHttpRequest = _this.__nativeXMLHttpRequest,
        response;

    _this.readyState = nativeXMLHttpRequest.readyState;

    switch (nativeXMLHttpRequest.readyState) {
        case 1:
            emitEvent(_this, "loadstart", new EventPolyfill("loadstart", e));
            break;
        case 3:
            XMLHttpRequestPolyfill_onProgress(_this, e);
            break;
        case 4:
            response = nativeXMLHttpRequest.response || "";

            _this.response = response;

            _this.status = nativeXMLHttpRequest.status || 0;
            _this.statusText = nativeXMLHttpRequest.statusText || "";

            if (nativeXMLHttpRequest.responseType !== "arraybuffer") {
                _this.responseText = nativeXMLHttpRequest.responseText || response;
                _this.responseXML = nativeXMLHttpRequest.responseXML || response;
            } else {
                _this.responseText = "";
                _this.responseXML = "";
            }

            _this.responseType = nativeXMLHttpRequest.responseType || "";
            _this.responseURL = nativeXMLHttpRequest.responseURL || "";

            emitEvent(_this, "load", new EventPolyfill("load", e));
            emitEvent(_this, "loadend", new EventPolyfill("loadend", e));

            break;
    }

    emitEvent(_this, "readystatechange", new EventPolyfill("readystatechange", e));

    return _this;
}

function XMLHttpRequestPolyfill_onProgress(_this, e) {
    var event;

    if (!hasNativeProgress) {
        event = new ProgressEventPolyfill("progress", e);

        event.lengthComputable = false;
        event.loaded = 1;
        event.total = 1;

        emitEvent(_this, "progress", event);

        return event;
    }
}

XMLHttpRequestPolyfillPrototype.abort = function() {
    emitEvent(this, "abort", new EventPolyfill("abort", {}));
    tryCallFunction(this.__nativeXMLHttpRequest, "abort");
};

XMLHttpRequestPolyfillPrototype.setTimeout = function(ms) {
    this.timeout = ms;
    trySetValue(this.__nativeXMLHttpRequest, "timeout", ms);
};

XMLHttpRequestPolyfillPrototype.setWithCredentials = function(value) {
    value = !!value;
    this.withCredentials = value;
    trySetValue(this.__nativeXMLHttpRequest, "withCredentials", value);
};

XMLHttpRequestPolyfillPrototype.getAllResponseHeaders = function() {
    return tryCallFunction(this.__nativeXMLHttpRequest, "getAllResponseHeaders");
};

XMLHttpRequestPolyfillPrototype.getResponseHeader = function(header) {
    return tryCallFunction(this.__nativeXMLHttpRequest, "getResponseHeader", header);
};

XMLHttpRequestPolyfillPrototype.open = function(method, url, async, user, password) {
    if (this.readyState === 0) {
        this.readyState = 1;
        return tryCallFunction(this.__nativeXMLHttpRequest, "open", method, url, async, user, password);
    } else {
        return undefined;
    }
};

XMLHttpRequestPolyfillPrototype.overrideMimeType = function(mimetype) {
    tryCallFunction(this.__nativeXMLHttpRequest, "overrideMimeType", mimetype);
};

XMLHttpRequestPolyfillPrototype.send = function(data) {
    this.__nativeXMLHttpRequest.responseType = this.responseType;
    tryCallFunction(this.__nativeXMLHttpRequest, "send", data);
};

XMLHttpRequestPolyfillPrototype.setRequestHeader = function(key, value) {
    this.__requestHeaders[key] = value;
    tryCallFunction(this.__nativeXMLHttpRequest, "setRequestHeader", key, value);
};

XMLHttpRequestPolyfillPrototype.getRequestHeader = function(key) {
    return this.__requestHeaders[key];
};

XMLHttpRequestPolyfillPrototype.getRequestHeaders = function() {
    return extend({}, this.__requestHeaders);
};

XMLHttpRequestPolyfillPrototype.sendAsBinary = function(string) {
    return this.send(toUint8Array(string));
};

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/object-for_each@0.0.2/src/index.js-=@*/
var keys = require(8);


module.exports = objectForEach;


function objectForEach(object, callback) {
    var objectKeys = keys(object),
        i = -1,
        il = objectKeys.length - 1,
        key;

    while (i++ < il) {
        key = objectKeys[i];

        if (callback(object[key], key, object) === false) {
            break;
        }
    }

    return object;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/trim@0.0.1/src/index.js-=@*/
var isNative = require(17),
    toString = require(24);


var StringPrototype = String.prototype,

    reTrim = /^[\s\xA0]+|[\s\xA0]+$/g,
    reTrimLeft = /^[\s\xA0]+/g,
    reTrimRight = /[\s\xA0]+$/g,

    baseTrim, baseTrimLeft, baseTrimRight;


module.exports = trim;


if (isNative(StringPrototype.trim)) {
    baseTrim = function baseTrim(str) {
        return str.trim();
    };
} else {
    baseTrim = function baseTrim(str) {
        return str.replace(reTrim, "");
    };
}

if (isNative(StringPrototype.trimLeft)) {
    baseTrimLeft = function baseTrimLeft(str) {
        return str.trimLeft();
    };
} else {
    baseTrimLeft = function baseTrimLeft(str) {
        return str.replace(reTrimLeft, "");
    };
}

if (isNative(StringPrototype.trimRight)) {
    baseTrimRight = function baseTrimRight(str) {
        return str.trimRight();
    };
} else {
    baseTrimRight = function baseTrimRight(str) {
        return str.replace(reTrimRight, "");
    };
}


function trim(str) {
    return baseTrim(toString(str));
}

trim.left = function trimLeft(str) {
    return baseTrimLeft(toString(str));
};

trim.right = function trimRight(str) {
    return baseTrimRight(toString(str));
};

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/request@0.0.9/src/Response.js-=@*/
module.exports = Response;


function Response() {
    this.data = null;
    this.method = null;
    this.requestHeaders = null;
    this.responseHeaders = null;
    this.statusCode = null;
    this.url = null;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/request@0.0.9/src/camelcaseHeader.js-=@*/
var arrayMap = require(66),
    capitalizeString = require(67);


module.exports = function camelcaseHeader(str) {
    return arrayMap(str.toLowerCase().split("-"), capitalizeString).join("-");
};

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/request@0.0.9/src/parseContentType.js-=@*/
module.exports = function parseContentType(str) {
    var index;

    if (str) {
        if ((index = str.indexOf(";")) !== -1) {
            str = str.substring(0, index);
        }
        if ((index = str.indexOf(",")) !== -1) {
            return str.substring(0, index);
        }

        return str;
    }

    return "application/octet-stream";
};

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_array@0.0.1/src/index.js-=@*/
var isNative = require(17),
    isLength = require(26),
    isObject = require(12);


var objectToString = Object.prototype.toString,
    nativeIsArray = Array.isArray,
    isArray;


if (isNative(nativeIsArray)) {
    isArray = nativeIsArray;
} else {
    isArray = function isArray(value) {
        return (
            isObject(value) &&
            isLength(value.length) &&
            objectToString.call(value) === "[object Array]"
        ) || false;
    };
}


module.exports = isArray;

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/apply@0.0.1/src/index.js-=@*/
var isNullOrUndefined = require(19);


module.exports = apply;


function apply(fn, args, thisArg) {
    if (isNullOrUndefined(thisArg)) {
        return applyNoThisArg(fn, args);
    } else {
        return applyThisArg(fn, args, thisArg);
    }
}

function applyNoThisArg(fn, args) {
    switch (args.length) {
        case 0:
            return fn();
        case 1:
            return fn(args[0]);
        case 2:
            return fn(args[0], args[1]);
        case 3:
            return fn(args[0], args[1], args[2]);
        case 4:
            return fn(args[0], args[1], args[2], args[3]);
        case 5:
            return fn(args[0], args[1], args[2], args[3], args[4]);
        default:
            return fn.apply(null, args);
    }
}

function applyThisArg(fn, args, thisArg) {
    switch (args.length) {
        case 0:
            return fn.call(thisArg);
        case 1:
            return fn.call(thisArg, args[0]);
        case 2:
            return fn.call(thisArg, args[0], args[1]);
        case 3:
            return fn.call(thisArg, args[0], args[1], args[2]);
        case 4:
            return fn.call(thisArg, args[0], args[1], args[2], args[3]);
        case 5:
            return fn.call(thisArg, args[0], args[1], args[2], args[3], args[4]);
        default:
            return fn.apply(thisArg, args);
    }
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/weak_map_polyfill@0.0.2/src/index.js-=@*/
var isNative = require(17),
    isPrimitive = require(9),
    createStore = require(56);


var NativeWeakMap = typeof(WeakMap) !== "undefined" ? WeakMap : null,
    WeakMapPolyfill, WeakMapPolyfillPrototype;


if (isNative(NativeWeakMap)) {
    WeakMapPolyfill = NativeWeakMap;
    WeakMapPolyfillPrototype = WeakMapPolyfill.prototype;
} else {
    WeakMapPolyfill = function WeakMap() {
        this.__store = createStore();
    };
    WeakMapPolyfillPrototype = WeakMapPolyfill.prototype;
    WeakMapPolyfillPrototype.constructor = WeakMapPolyfill;

    WeakMapPolyfillPrototype.get = function(key) {
        return this.__store.get(key);
    };

    WeakMapPolyfillPrototype.set = function(key, value) {
        if (isPrimitive(key)) {
            throw new TypeError("Invalid value used as key");
        } else {
            this.__store.set(key, value);
        }
    };

    WeakMapPolyfillPrototype.has = function(key) {
        return this.__store.has(key);
    };

    WeakMapPolyfillPrototype["delete"] = function(key) {
        return this.__store.remove(key);
    };

    WeakMapPolyfillPrototype.length = 0;
}

WeakMapPolyfillPrototype.remove = WeakMapPolyfillPrototype["delete"];


module.exports = WeakMapPolyfill;

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/iterator@0.0.2/src/index.js-=@*/
var apply = require(53),
    isFunction = require(20),
    isUndefined = require(23);


var KEYS = 0,
    VALUES = 1,
    ENTRIES = 2,

    ITERATOR_SYMBOL = typeof(Symbol) === "function" ? Symbol.iterator : false,
    EMPTY = new Iterator(createDone),

    IteratorPrototype;


module.exports = Iterator;


function Iterator(next) {
    this.next = next;
}
IteratorPrototype = Iterator.prototype;

Iterator.EMPTY = EMPTY;

function IteratorValue(value, done) {
    this.value = value;
    this.done = done;
}
Iterator.Value = IteratorValue;

function createValue(type, key, value, result) {
    var iteratorValue = (
        type === KEYS ? key :
        type === VALUES ? value : [key, value]
    );

    if (isUndefined(result)) {
        result = new IteratorValue(iteratorValue, false);
    } else {
        result.value = iteratorValue;
    }

    return result;
}
Iterator.createValue = createValue;

function createDone() {
    return new IteratorValue(undefined, true);
}
Iterator.createDone = createDone;

function getIterator(iterable) {
    var iteratorFn = iterable && (ITERATOR_SYMBOL && iterable[ITERATOR_SYMBOL] || iterable.iterator);

    if (isFunction(iteratorFn)) {
        return iteratorFn;
    } else {
        return void(0);
    }
}
Iterator.getIterator = function(iterable) {
    var iteratorFn = getIterator(iterable);

    if (iteratorFn) {
        return function fn() {
            return apply(iteratorFn, arguments, iterable);
        };
    } else {
        return void(0);
    }
};

function hasIterator(iterable) {
    return !!getIterator(iterable);
}
Iterator.hasIterator = hasIterator;

function isIterator(iterator) {
    return !!(iterator && isFunction(iterator.next));
}
Iterator.isIterator = isIterator;

Iterator.KEYS = KEYS;
Iterator.VALUES = VALUES;
Iterator.ENTRIES = ENTRIES;

IteratorPrototype.toString = function() {
    return "[Iterator]";
};
IteratorPrototype.inspect = IteratorPrototype.toSource = IteratorPrototype.toString;

IteratorPrototype.iterator = function() {
    return this;
};
IteratorPrototype[ITERATOR_SYMBOL] = IteratorPrototype.iterator;

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/create_store@0.0.2/src/index.js-=@*/
var has = require(7),
    defineProperty = require(57),
    isPrimitive = require(9);


var emptyStore = {
        value: undefined
    },
    ObjectPrototype = Object.prototype;


module.exports = createStore;


function createStore() {
    var privateKey = {},
        size = 0;


    function get(key) {
        var store;

        if (isPrimitive(key)) {
            throw new TypeError("Invalid value used as key");
        } else {
            store = key.valueOf(privateKey);

            if (!store || store.identity !== privateKey) {
                store = emptyStore;
            }

            return store;
        }
    }

    function set(key) {
        var store;

        if (isPrimitive(key)) {
            throw new TypeError("Invalid value used as key");
        } else {
            store = key.valueOf(privateKey);

            if (!store || store.identity !== privateKey) {
                store = privateStore(key, privateKey);
                size += 1;
            }

            return store;
        }
    }

    return {
        get: function(key) {
            return get(key).value;
        },
        set: function(key, value) {
            set(key).value = value;
        },
        has: function(key) {
            var store = get(key);
            return store !== emptyStore ? has(store, "value") : false;
        },
        remove: function(key) {
            var store = get(key);

            if (store !== emptyStore) {
                size -= 1;
                return store.remove();
            } else {
                return false;
            }
        },
        clear: function() {
            privateKey = {};
            size = 0;
        },
        size: function() {
            return size;
        }
    };
}

function privateStore(key, privateKey) {
    var keyValueOf = key.valueOf || ObjectPrototype.valueOf,
        store = {
            identity: privateKey,
            remove: function remove() {
                if (key.valueOf === valueOf) {
                    key.valueOf = keyValueOf;
                }
                return delete store.value;
            }
        };

    function valueOf(value) {
        if (value !== privateKey) {
            return keyValueOf.apply(this, arguments);
        } else {
            return store;
        }
    }

    defineProperty(key, "valueOf", {
        value: valueOf,
        configurable: true,
        enumerable: false,
        writable: true
    });

    return store;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/define_property@0.0.3/src/index.js-=@*/
var isObject = require(12),
    isFunction = require(20),
    isPrimitive = require(9),
    isNative = require(17),
    has = require(7);


var nativeDefineProperty = Object.defineProperty;


module.exports = defineProperty;


function defineProperty(object, name, descriptor) {
    if (isPrimitive(descriptor) || isFunction(descriptor)) {
        descriptor = {
            value: descriptor
        };
    }
    return nativeDefineProperty(object, name, descriptor);
}

defineProperty.hasGettersSetters = true;

if (!isNative(nativeDefineProperty) || !(function() {
        var object = {},
            value = {};

        try {
            nativeDefineProperty(object, "key", {
                value: value
            });
            if (has(object, "key") && object.key === value) {
                return true;
            } else {
                return false;
            }
        } catch (e) {}

        return false;
    }())) {

    defineProperty.hasGettersSetters = false;

    nativeDefineProperty = function defineProperty(object, name, descriptor) {
        if (!isObject(object)) {
            throw new TypeError("defineProperty(object, name, descriptor) called on non-object");
        }
        if (has(descriptor, "get") || has(descriptor, "set")) {
            throw new TypeError("defineProperty(object, name, descriptor) this environment does not support getters or setters");
        }
        object[name] = descriptor.value;
    };
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/xmlhttprequest_polyfill@0.0.4/src/EventPolyfill.js-=@*/
var tryCallFunction = require(60);


var EventPolyfillPrototype;


module.exports = EventPolyfill;


function EventPolyfill(type, nativeEvent) {

    this.__nativeEvent = nativeEvent;

    this.type = type;
    this.bubbles = nativeEvent.bubbles;
    this.cancelBubble = nativeEvent.cancelBubble;
    this.cancelable = nativeEvent.cancelable;
    this.currentTarget = nativeEvent.currentTarget;
    this.defaultPrevented = nativeEvent.defaultPrevented;
    this.eventPhase = nativeEvent.eventPhase;
    this.isTrusted = nativeEvent.isTrusted;
    this.path = nativeEvent.path;
    this.returnValue = nativeEvent.returnValue;
    this.srcElement = nativeEvent.srcElement;
    this.target = nativeEvent.target;
    this.timeStamp = nativeEvent.timeStamp;
}
EventPolyfillPrototype = EventPolyfill.prototype;

EventPolyfillPrototype.AT_TARGET = 2;
EventPolyfillPrototype.BLUR = 8192;
EventPolyfillPrototype.BUBBLING_PHASE = 3;
EventPolyfillPrototype.CAPTURING_PHASE = 1;
EventPolyfillPrototype.CHANGE = 32768;
EventPolyfillPrototype.CLICK = 64;
EventPolyfillPrototype.DBLCLICK = 128;
EventPolyfillPrototype.DRAGDROP = 2048;
EventPolyfillPrototype.FOCUS = 4096;
EventPolyfillPrototype.KEYDOWN = 256;
EventPolyfillPrototype.KEYPRESS = 1024;
EventPolyfillPrototype.KEYUP = 512;
EventPolyfillPrototype.MOUSEDOWN = 1;
EventPolyfillPrototype.MOUSEDRAG = 32;
EventPolyfillPrototype.MOUSEMOVE = 16;
EventPolyfillPrototype.MOUSEOUT = 8;
EventPolyfillPrototype.MOUSEOVER = 4;
EventPolyfillPrototype.MOUSEUP = 2;
EventPolyfillPrototype.NONE = 0;
EventPolyfillPrototype.SELECT = 16384;

EventPolyfillPrototype.preventDefault = function() {
    return tryCallFunction(this.__nativeEvent, "preventDefault");
};

EventPolyfillPrototype.stopImmediatePropagation = function() {
    return tryCallFunction(this.__nativeEvent, "stopImmediatePropagation");
};

EventPolyfillPrototype.stopPropagation = function() {
    return tryCallFunction(this.__nativeEvent, "stopPropagation");
};

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/xmlhttprequest_polyfill@0.0.4/src/ProgressEventPolyfill.js-=@*/
var inherits = require(37),
    EventPolyfill = require(58);


module.exports = ProgressEventPolyfill;


function ProgressEventPolyfill(type, nativeEvent) {

    EventPolyfill.call(this, type, nativeEvent);

    this.lengthComputable = nativeEvent.lengthComputable;
    this.loaded = nativeEvent.loaded;
    this.total = nativeEvent.total;
}
inherits(ProgressEventPolyfill, EventPolyfill);

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/xmlhttprequest_polyfill@0.0.4/src/tryCallFunction.js-=@*/
module.exports = tryCallFunction;


function tryCallFunction(object, name, a0, a1, a2, a3, a4) {
    try {
        return object[name](a0, a1, a2, a3, a4);
    } catch (e) {}
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/xmlhttprequest_polyfill@0.0.4/src/trySetValue.js-=@*/
module.exports = trySetValue;


function trySetValue(object, name, key, value) {
    try {
        return (object[name][key] = value);
    } catch (e) {}
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/xmlhttprequest_polyfill@0.0.4/src/emitEvent.js-=@*/
module.exports = emitEvent;


function emitEvent(object, type, event) {
    var onevent = "on" + type;

    if (object[onevent]) {
        object[onevent](event);
    }

    object.emitArg(type, event);
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/xmlhttprequest_polyfill@0.0.4/src/toUint8Array.js-=@*/
var environment = require(65);


var Uint8Array = environment.window.Uint8Array || Array;


module.exports = toUint8Array;


function toUint8Array(string) {
    var length = string.length,
        ui8 = new Uint8Array(length),
        i = -1,
        il = length - 1;

    while (i++ < il) {
        ui8[i] = string.charCodeAt(i) & 0xff;
    }

    return ui8;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/xmlhttprequest_polyfill@0.0.4/src/createNativeXMLHttpRequest.js-=@*/
var environment = require(65);


var window = environment.window,
    NativeXMLHttpRequest = window.XMLHttpRequest,

    createNativeXMLHttpRequest, NativeActiveXObjectType;


if (NativeXMLHttpRequest) {
    createNativeXMLHttpRequest = function createNativeXMLHttpRequest(options) {
        return new NativeXMLHttpRequest(options);
    };
} else {
    (function getNativeActiveXObject(types) {
        var NativeActiveXObject = window.ActiveXObject,
            i = -1,
            il = types.length - 1,
            instance, type;

        while (i++ < il) {
            try {
                type = types[i];
                instance = new NativeActiveXObject(type);
                break;
            } catch (e) {}
            type = null;
        }

        if (!type) {
            throw new Error("XMLHttpRequest not supported by this browser");
        }

        NativeActiveXObjectType = type;
    }([
        "Msxml2.XMLHTTP",
        "Msxml3.XMLHTTP",
        "Microsoft.XMLHTTP"
    ]));

    createNativeXMLHttpRequest = function createNativeXMLHttpRequest() {
        return new NativeActiveXObject(NativeActiveXObjectType);
    };
}


module.exports = createNativeXMLHttpRequest;

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/environment@0.0.2/src/index.js-=@*/
var Buffer = require(5).Buffer;
var process = require(30);
var environment = exports,

    hasWindow = typeof(window) !== "undefined",
    userAgent = hasWindow ? window.navigator.userAgent : "";


environment.worker = typeof(importScripts) !== "undefined";

environment.browser = environment.worker || !!(
    hasWindow &&
    typeof(navigator) !== "undefined" &&
    window.document
);

environment.node = (!hasWindow &&
    typeof(process) !== "undefined" &&
    typeof(process.versions) !== "undefined" &&
    typeof(process.versions.node) !== "undefined" &&
    typeof(Buffer) !== "undefined"
);

environment.mobile = environment.browser && /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());

environment.window = (
    hasWindow ? window :
    typeof(global) !== "undefined" ? global :
    typeof(self) !== "undefined" ? self : {}
);

environment.pixelRatio = environment.window.devicePixelRatio || 1;

environment.document = typeof(document) !== "undefined" ? document : {};

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/array-map@0.0.1/src/index.js-=@*/
module.exports = arrayMap;


function arrayMap(array, callback) {
    var length = array.length,
        i = -1,
        il = length - 1,
        results = new Array(length);

    while (i++ < il) {
        results[i] = callback(array[i], i, array);
    }

    return results;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/capitalize_string@0.0.1/src/index.js-=@*/
module.exports = capitalizeString;


function capitalizeString(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

}], {}, void(0), (new Function("return this;"))()));

//# sourceMappingURL=index.js.map
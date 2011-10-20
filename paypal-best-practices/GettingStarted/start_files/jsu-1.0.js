/**
 * @name script
 */
if(typeof(u) == 'undefined'){
    /**
     * the base class for the jsu library. does nothing right now 
     * @author Brad Hurley me@bradhurley.com
     * @class
     * @static
     * @version 1.0.8
     * @event serviceRequest {activeServiceRequests url parameters}
     * @event serviceRequestComplete {activeServiceRequests url parameters}
     * @borrows u.eventMixin#observe as #unregisterEvent
     * @borrows u.eventMixin#observe as #observe
     * @borrows u.eventMixin#stopObserving as #stopObserving
     * @borrows u.eventMixin#fire as #fire
     */
    var u = function(){return};
};
(function(){

/**
 * @returns {object} the destination object extended with members of the source object
 * @param {object} destination the object that is going to be extended
 * @param {object} *source the objects that are copied to the destination object
 * @example
 * var mixin = {
 * 	param1: 1234,
 * 	method1: function(){}
 * }
 * var myObj = {}
 *	
 * u.extend(myObj, mixin) 
 */
u.extend = function() {
    var a = arguments;
    var n = a.length;
    var l = n-1;
	while (n--) {
	    if(l-n){
		for (var property in a[l-n])
		    a[0][property] = a[l-n][property];
	    }
	}
    return a[0];
};

var con = function(type){
    if (u.debug || location.search.match(/debug=true/)) {
	var a = u.toArray(arguments);
	var c = a.shift();
	a.uEach(function(v){
	    try{
		console[type].call(c, v);
	    }catch(e){};
	});
    } else {
	return 
    }
};

var seqenceSortCallback = function(a, b, p) {
    if(p){
	a = a[p];
	b = b[p];
    }
    if(!parseInt(a)) a = String(a).toUpperCase();
    if(!parseInt(b)) b = String(b).toUpperCase();
    if (a > b) return -1;
    if (b > a) return 1;
    return 0;
}

var cache = {
    template: {}
};

/**
 * number of current service requests
 * @type {number}
 * @default 0
 * @private
 */
var activeServiceRequests = 0;

/**
 * flag for weather or not to call the init method of a class instance
 * @type {boolean}
 * @default false
 * @private
 */
var initializing = false;

/** @lends u */
u.extend(u, {
    /**
     * the version of the library
     * @constant
     * @type {string}
     * @default 1.0.8
     * @example
     * console.log(u.VERSION)	
     */
    VERSION: '1.0.8',
    
    /**
     * Debugging in Console
     * @type {boolean}
     * @default false
     * @example
     * u.debug = true
     * u.log(123)
     */
    debug: false,
    
    /**
     * determines the type of an object
     * @returns {string} the object type name
     * @param {object} obj the object that needs the type determined
     * @example
     * var a = [1,2]
     *
     * if (u.type(a) == 'array') {
     *     //while loop
     * } else if (u.type(a) == 'object') {
     *    //for in loop
     * }
     */
    type: function(obj){
	var t = typeof(obj);
	if(t == 'object') t = Object.prototype.toString.call(obj).replace(/\[object\s(.*?)\]/,'$1');
	return t.toLowerCase();
    },
    
    /**
     * converts anything to an array
     * @returns {array} any object as an array
     * @param {object} it the object that is going to become an array
     * @example
     * u.toArray(1).uEach(function(v){
     * });
     */
    toArray: function(it) {
	if (!it) return [];
	var t = u.type(it);
	if(t == 'array') return it;
	var length = it.length;
	if(length && t != 'string' && t != 'number'){
	    var r = [];
	    while (length--) r[length] = it[length];
	    return r;
	}
	else return [it];
    },
    
    /**
     * counts the members of an object
     * @returns {Number} the number of members of the object
     * @param {object} object to count
     * @example
     * var obj = {
     *	   a: 123,
     *	   b: 'abc'
     * };
     * console.log(u.count(obj));
     */
    count : function(o){
	var i = 0;
	for (var p in o) {
	    i++
	}
	return i;
    },
    
    /**
     * creates and returns a namespace
     * @returns {object} the object of the last namespace
     * @param {string} ns string that (may or may not contain dots seperating namespaces) translate to namespaces
     * @param {object} context append namespace to this context
     * @name u.namespace
     * @function
     * @example
     * var mySandboxedObject = u.namespace('xxx.yyy.zzz')
     */   
    'namespace': function(ns, context){
	var o, i, j, d;
	d = ns.split(".");
	o = context || window;
	for (j = (d[0] == "window") ? 1 : 0; j < d.length; j = j + 1) {
	    o[d[j]] = o[d[j]] || {};
	    o = o[d[j]];
	}
	
	return o;
    },
    
    /**
     * creates a class. a simple implimentation of class based inheritence
     * @returns {function} a function with extended prototype
     * @param {object|function} *subclasses objects and or functions to add methods to the prototype of the  returned class function
     * @name u.class
     * @function
     * @example
     * //base class
     * var MyClass = u.klass({
     *     init: function(){
     *		this.param1 = 123;
     *		return this;
     *     },
     *     method1: function(){
     *		return this.param1;
     *     }
     * });
     *
     * //subclass
     * var SubClass = u.klass(myClass, {
     *     method2: function(){
     *		return this.param1;
     *     }
     * });
     *
     //subclass with override and super
     * var SubClass2 = u.klass(myClass, {
     *     method1: function(){
     *		return SubClass.prototype.method1.call(this) + ' more';
     *     }
     * });
     */ 
    klass: function(){
	var a = u.toArray(arguments);
	var fn = function(){
	    if(!initializing && this.init)
	      return this.init.apply(this, arguments);
	    return this;
	};
	fn.constructor = fn;
	initializing = true;
	var proto = new fn();
	initializing = false;
	a.uEach(function(v){
	    var t = u.type(v);
	    if(t == "function"){
		u.extend(proto, v.prototype);
		for (var p in v)
		    fn[p] = v[p]
	    } else if(t == "object")
		u.extend(proto, v);
	});
	fn.prototype = proto;
	return fn;
    },
    
    /**
     * converts an object to a query string for urls
     * @returns {string} a query string
     * @param {object} object a javascript object to convert to a query string
     */ 
    toQueryString: function(o) {
	var a = [];
	u.each(o, function(v,k){
	    u.toArray(v).uEach(function(vv){
		a.push('{{}}={{}}'.uInject(encodeURIComponent(k), encodeURIComponent(vv)));
	    });    
	});
	return a.join('&');
    },
    
    /**
     * converts a json string to a javascript object
     * @returns {object} a javascript object
     * @param {string} string a json string to convert to a javascript object
     */
    decodeJSON: function(string) {
	return eval('('+ string + ')');
    },
    
    /**
     * converts an object to a json string
     * @returns {string} a json string
     * @param {object} object a javascript object to convert to json
     */       
    encodeJSON: function(object) {
	var tok = [];
	var dec = function(o){
	    switch (u.type(o)) {
		case 'string': str(o);
		    break;
		case 'object': obj(o);
		    break;
		case 'array': ary(o);
		    break;
		default: scaler(o);
	    }
	}
	var ary = function(a){
	    tok.push('[');
	    a.uEach(function(v){
		dec(v);
		tok.push(', ');
	    });
	    tok.pop();
	    tok.push(']');
	}
	var obj = function(h){
	    tok.push('{');
	    for(var p in h){
		tok.push('"{{}}":'.uInject(p));
		dec(h[p]);
		tok.push(', ');
	    }
	    tok.pop();
	    tok.push('}');
	}
	var str = function(s){
	    tok.push('"{{}}"'.uInject(s));
	}
	var scaler = function(s){
	    tok.push(s);
	}
	dec(object);
	return tok.join('');
    },
    
    /**
     * dynamic script loading of jsonp responses
     * @returns {object} the u namespace
     * @param {string} url the service url
     * @param {object} pars parameters applied to the url
     * @param {function} callback function to be called on return from the service
     */
    getJSONP: function(url, pars, callback){
	if ( u.type(pars) == 'function' ) {
	    callback = pars;
	    pars = null;
	}
	return u.getJS(url, pars, callback, true);
    },
    
    /**
     * dynamic script loading of jsonp responses
     * @returns {object} the u namespace
     * @param {string} url the service url
     * @param {object} pars parameters applied to the url
     * @param {function} callback function to be called on return from the service
     * @param {boolean} jsonp flag on weather or not a unique json callback should be generated
     */
    getJS: function (url, pars, callback, jsonp) {
	if ( u.type(pars) == 'function' ) {
	    jsonp = callback;
	    callback = pars;
	    pars = null;
	}
	
	if(pars){
	    var template = "{{}}?{{}}";
	    if(url.match(/$\?/)) template = "{{}}{{}}";
	    else if (url.indexOf('?')>-1) template = "{{}}&{{}}";
	    url = template.uInject(url, u.toQueryString(pars));
	}
    
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("script");
	
	if (jsonp) {
	    jsonp = "jsonp".uId();
	    window[jsonp] = function(result){
		activeServiceRequests--;
		u.fire('serviceRequestComplete', {activeServiceRequests:activeServiceRequests, url:url, parameters:pars});
		callback(result);
		window[jsonp] = undefined;
		try{ delete window[jsonp];}catch(e){}
		if (head) head.removeChild(script);
	    };
	    url = (url.indexOf('?')>-1) ? ("{{}}&callback={{}}".uInject(url, jsonp)) : ("{{}}?callback={{}}".uInject(url, jsonp));
	    
	} else {
	    var done = false;
	    script.onload = script.onreadystatechange = function(){
		if ( !done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") ) {
		    done = true;
		    activeServiceRequests--;
		    u.fire('serviceRequestComplete', {activeServiceRequests:activeServiceRequests, url:url, parameters:pars});
		    callback(url, pars);
		    script.onload = script.onreadystatechange = null;
		    head.removeChild(script);
		}
	    };
	}
	script.src = url;
	activeServiceRequests++;
	u.fire('serviceRequest', {activeServiceRequests:activeServiceRequests, url:url, parameters:pars});
	head.appendChild(script);
	return this;
    },
    
    /**
     * @returns {undefined}
     * @param {object} *objects the objects to log
     */
    log: function(){
	var a = u.toArray(arguments);
	a.unshift('log');
	con.apply(this, a)
    },
    /**
     * @returns {undefined}
     * @param {object} *objects the objects to log in a verbose manner
     */
    verbose: function(){
	var a = u.toArray(arguments);
	a.unshift('debug');
	con.apply(this, a)
    },
    /**
     * @returns {undefined}
     * @param {object} *objects the objects to log with an info icon
     */
    info: function(){
	var a = u.toArray(arguments);
	a.unshift('info');
	con.apply(this, a)
    },
    /**
     * @returns {undefined}
     * @param {object} *objects the objects to log with a warn icon
     */
    warn: function(){
	var a = u.toArray(arguments);
	a.unshift('warn');
	con.apply(this, a)
    },
    /**
     * @returns {undefined}
     * @param {object} *objects the objects to log with an error icon
     */
    error: function(){
	var a = u.toArray(arguments);
	a.unshift('error');
	con.apply(this, a)
    },
    /**
     * @returns {undefined}
     * @param {object} *objects the objects to log in an object tree
     */
    dir: function(){
	var a = u.toArray(arguments);
	a.unshift('dir');
	con.apply(this, a)
    },
    
    /**
     * the base enumerable method. loops through and array or object
     * @returns {undefined|object|array} 
     * @param {object|array} o the object or array to be looped over
     * @param {function} iterator callback function called on each item of the object or array
     * @param {object} context the object that will become the context of the iterator function
     * @param {boolean} breakontruth should the loop break and return the first match
     */
    each: function(o, iterator, context, breakontruth){
	var it = context ? function(){return iterator.apply(context, arguments)} : iterator;
	var t = u.type(o);
	if(t == "array"){
	    var n = o.length;
	    var l = n-1;
	    lp:
	    while (n--) {
		var r = it(o[l-n], l-n);
		if(breakontruth && r){
		    return o[l-n];
		    break lp;
		}
	    }
	}
	else{
	    lp:
	    for (var p in o) {
		var r = it(o[p], p);
		if(breakontruth && r){
		    return o[p];
		    break lp;
		}
	    } 
	}
	if(breakontruth) return undefined
	else return o;
    },
    
    /**
     * returns a new object or array based on what is returned from the interator function
     * @returns {object|array} the new object or array altered by the interator function
     * @param {object|array} o the object or array to be looped over
     * @param {function} iterator callback function called on each item of the object or array
     * @param {object} context the object that will become the context of the iterator function
     */
    map: function(o, iterator, context) {
	var it = context ? function(){return iterator.apply(context, arguments)} : iterator;
	var t = u.type(o);
	var fn = function(value, index) {
	    results[index] = it(value, index);
	};
	if(t == "array"){
	    var results = [];
	}else{
	    var results = {};
	};
	u.each(o, fn);
	return results;
    },
    
    /**
     * returns a new object or array based on any non undefined results from the interator function
     * @returns {object|array} the new object or array populated by any non undefined results from the interator function
     * @param {object|array} o the object or array to be looped over
     * @param {function} iterator callback function called on each item of the object or array
     * @param {object} context the object that will become the context of the iterator function
     */
    pluck: function(o, iterator, context) {
	var it = context ? function(){return iterator.apply(context, arguments)} : iterator;
	var t = u.type(o);
	var fn = function(value, index) {
	    var r = it(value, index);
	    if(r !== undefined) {
		if(t == "array")
		    results.push(r);
		else
		    results[index] = r;
	    }
	};
	if(t == "array"){
	    var results = [];
	}else{
	    var results = {};
	};
	u.each(o, fn);
	return results;
    },
    
    /**
     * calls a method on every element in an object or array.
     * @returns {object|array} the same object that was send
     * @param {object|array} o the object or array to be looped over
     * @param {function} method method called on each item of the object or array
     * @param {object} *arguments arguments that are send into each call to the objects method
     */
    invoke: function(){
	var a = u.toArray(arguments);
	var o = a.shift();
	var m = a.shift();
	return u.map(o, function(v){
	    return v[m].apply(v, a)
	});
	return o;
    },
    
    /**
     * returns a the first truth resulting from the interator function
     * @returns {object} the first truth resulting from the interator function
     * @param {object|array} o the object or array to be looped over
     * @param {function} iterator callback function called on each item of the object or array
     * @param {object} context the object that will become the context of the iterator function
     */
    detect: function(o, iterator, context) {
	return u.each(o, iterator, context, true);
    },
    
    /**
     * utility methods injected into the uTemplate scope as utils. 
     * @class
     * @static
     */
    templateUtils: {
	/**
	 * shortcut for rendering templates inside dom elements with an id
	 * @returns {string}
	 * @param {string} template the id of the dom element whos inner html will be the template
	 * @param {object} object the data object that becomes the context of the template
	 */
	includeById: function(template, object){
	    if(object != undefined){
		var e = document.getElementById(template).innerHTML;
		return e.uTemplate(object);
	    }
	    return '';
	}
    },
    
    /**
     * this is a mixin for enableing custom events to objects and or functions. not intended to be called as static.
     * @class
     */
    eventMixin :
    /**
     * @lends u.eventMixin#
     */
    {
	/**
	 * unregisters an event type.
	 * this will also remove all observers.		
	 * @returns {object}
	 * @param {string} onx the name of the custom event
	 */
	unregisterEvent: function (onx) {
	    if (this.events && this.events[onx]) delete this.events[onx];
	    return this
	},
  
	/**
	 * registers observer functions on an event type.
	 * the event types are scoped to the object that initialized the event object.
	 * @returns {object}
	 * @param {string} onx the name of the custom event to listen for
	 * @param {function} fn the function that runs on dispatch of the event
	 */
	observe: function (onx, fn, context) {
	    var f = context ? function(){return fn.apply(context, arguments)} : fn;
	    u.namespace('events', this);
	    if (typeof this.events[onx] == 'undefined') this.events[onx] = {};
	    this.events[onx][fn.toString()] = f;
	    return this;
	},
    
	/**
	 * unregisters an observer function on an event type. 
	 * the event types are scoped to the object that initialized the event object.	
	 * @returns {object}
	 * @param {string} onx the name of the custom event
	 * @param {function} fn the function that is to be removed
	 */
	stopObserving: function (onx ,fn) {
	    u.namespace('events', this);
	    if (this.events[onx] && this.events[onx][fn.toString()])
		delete this.events[onx][fn.toString()];
	    return this;
	},
    
	/**
	 * fires custom events.
	 * @returns {object}
	 * @param {string} onx the name of the custom event
	 * @param {object} message object to send to the listener functions
	 */
	fire: function (onx, message, context) {
	    var c = context || this;
	    u.namespace('events', this);
	    if(this.events[onx]){
		u.each(this.events[onx], function(v){
		    v({target: c, message: message})
		});
	    }
	    return this;
	}
    },
   
    /**
     * a class to determine what browser is rendering the file. 
     * @class
     * @static
     */
    browser: {
	/**
	 * is the browser ie
	 * @type {boolean}
	 * @constant
	 */
	IE: !!(window.attachEvent && !window.opera),
	/**
	 * is the browser ie6
	 * @type {boolean}
	 * @constant
	 */
	IE6: navigator.userAgent.toLowerCase().indexOf("msie 6") > -1 && !window.opera,
	/**
	 * is the browser ie7
	 * @type {boolean}
	 * @constant
	 */
	IE7: navigator.userAgent.toLowerCase().indexOf("msie 7") > -1 && !window.opera,
	/**
	 * is the browser opera
	 * @type {boolean}
	 * @constant
	 */
	OPERA: !!window.opera,
	/**
	 * is the browser a version of webkit
	 * @type {boolean}
	 * @constant
	 */
	WEBKIT: navigator.userAgent.indexOf('AppleWebKit/') > -1,
	/**
	 * is the browser a version of gecko
	 * @type {boolean}
	 * @constant
	 */
	GECKO: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1,
	/**
	 * is the browser mobile safari
	 * @type {boolean}
	 * @constant
	 */
	MOBILESAFARI: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/)
    }
});

u.extend(u, u.eventMixin);

/**
 * the native javascript String class 
 * @name String
 * @class
 * @lends String
 */
u.extend(String.prototype,
/** @lends String# */	 
{
    /**
     * converts a json string to a native javascript object
     * @returns {object} a native javascript object
     * @public
     */
    uToJSON: function(){
	return eval('('+this+')')
    },
    
    /**
     * truncates a string and adds ...
     * @returns {string} the truncated string
     * @param {number} character length of the returned string
     */
    uTruncate: function(trc){
	if(this.length > trc-3){
	    return this.substring(0,trc-3) + '...';
	}
	return this;
    },
    
    /**
     * creates a unique string of numbers
     * @returns {string} a unique string of numbers
     */
    uId: function(){
	return "{{}}{{}}{{}}".uInject(this, parseInt(Math.random()*1000000), new Date().getTime());
    },
    
    /**
     * strips whitespace from the beginning and end of the string
     * @returns {string} the stripped string
     */
    uStrip: function(){
	return this.replace(/^\s+/, '').replace(/\s+$/, '');
    },
    
    /**
     * returns the string as a slug
     * @returns {string} the string as a slug
     */
    uSlugify: function(){
	return this.toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-');
    },
    
    /**
     * injects a data object or positioned arguments into a string
     * @returns {string} the interpolated string
     * @param {object} *data
     */
    uInject: function(){
	var a = arguments;
	var i = -1;
	return this.replace(/\{\{(.*?)\}\}/g, function(){
	    i++
	    if(arguments[1] == '') return a[i];
	    if(arguments[1].match(/^[0-9]/)) return a[arguments[1]];
	    else return a[0][arguments[1]];
	})
    },
    
    /**
     * scriplet for javascript
     * @returns {string} the interpolated template string
     * @param {object} data standard javascript object
     * @param {object} opts options
     */
    uTemplate: function(data, opts){
	if(!cache.template[this]){
	    cache.template[this] = new Function("utils", "var tok=[];tok.push('" + (this.replace(/\n|\r|'|\{\{(.*?)\}\}|\{%(.*?)%\}/g, function(){
		if(arguments[0] == "'") return "\\'";
		else if(arguments[0] == '\n' && (!opts||(opts&!opts.cleanWhitespace))) return "','\\n','";
		else if(arguments[0] == '\r' && (!opts||(opts&!opts.cleanWhitespace))) return "','\\r','";
		else if(arguments[0].charAt(1) == "{") return "',"+arguments[1]+",'";
		else return "');"+arguments[2]+";tok.push('";
	    })) + "');return tok.join('');");
	}
	return cache.template[this].call(data || window, u.templateUtils);
    }
});

/**
 * the native javascript Array class 
 * @name Array
 * @class
 * @lends Array
 */
u.extend(Array.prototype,
/** @lends Array# */		 
{
    /**
     * returns the lowest item of an array
     * @returns {Number}
     */
    uMin: function(){
	return Math.min.apply('', this);
    },
    
    /**
     * returns the heighest item of an array
     * @returns {Number}
     */
    uMax: function(){
	return Math.max.apply('', this);
    },
    
    /**
     * sorts elements in an array in desending order
     * @param {string} p an optional member of each item in the array to compare
     * @returns {array}
     */
    uDescend: function(p){
	this.sort(function(a,b){
	    return seqenceSortCallback(a, b, p);
	});
    },

    /**
     * sorts elements in an array in ascending order
     * @param {string} p an optional member of each item in the array to compare
     * @returns {array}
     */
    uAscend: function(p){
	this.sort(function(a,b){
	    return seqenceSortCallback(b, a, p);
	});
    },
    
    /**
     * the base enumerable method. loops through and array
     * @returns {undefined|array} 
     * @param {function} iterator callback function called on each item of the array
     * @param {object} context the object that will become the context of the iterator function
     * @param {boolean} breakontruth should the loop break and return the first match
     */
    uEach: function(iterator, context, breakontruth){
	return u.each(this, iterator, context, breakontruth);
    },
    
    /**
     * calls a method on every element in an array.
     * @returns {array} the same array that was send
     * @param {function} method method called on each item of the array
     * @param {object} *arguments arguments that are send into each call to the objects method
     */
    uInvoke: function(){
	var a = u.toArray(arguments);
	a.unshift(this);
	return u.invoke.apply(u, a);
    },
    
    /**
     * returns a new array based on what is returned from the interator function
     * @returns {array} the new array altered by the interator function
     * @param {function} iterator callback function called on each item of the array
     * @param {object} context the object that will become the context of the iterator function
     */
    uMap: function(iterator, context) {
	return u.map(this, iterator, context);
    },
    
    /**
     * returns a the first truth resulting from the interator function
     * @returns {object} the first truth resulting from the interator function
     * @param {function} iterator callback function called on each item of the object or array
     * @param {object} context the object that will become the context of the iterator function
     */
    uDetect: function(iterator, context) {
	return u.detect(this, iterator, context);
    },
    
    /**
     * returns a new array based on any non undefined results from the interator function
     * @returns {array} the new array populated by any non undefined results from the interator function
     * @param {function} iterator callback function called on each item of the array
     * @param {object} context the object that will become the context of the iterator function
     */
    uPluck: function(iterator, context) {
	return u.pluck(this, iterator, context);
    }
});

/**
 * the native javascript Number class 
 * @name Number
 * @class
 * @lends Number
 */
u.extend(Number.prototype,
/** @lends Number# */		 
{
    /**
     * rounds numbers to a decimal
     * @returns {number} the rounded number
     * @param {number} decimal place to round too
     */
    uRound: function(places){
	if(places) return Math.round((this+1-1)*(Math.pow(10,places)))/Math.pow(10,places);
	else return Math.round();
    }
});

})();
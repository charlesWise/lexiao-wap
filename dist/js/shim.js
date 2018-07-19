/*!
 * https://github.com/es-shims/es5-shim
 * @license es5-shim Copyright 2009-2015 by contributors, MIT License
 * see https://github.com/es-shims/es5-shim/blob/master/LICENSE
 */

// vim: ts=4 sts=4 sw=4 expandtab

// Add semicolon to prevent IIFE from being passed as argument to concatenated code.
;

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
    'use strict';

    /* global define, exports, module */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    /**
     * Brings an environment as close to ECMAScript 5 compliance
     * as is possible with the facilities of erstwhile engines.
     *
     * Annotated ES5: http://es5.github.com/ (specific links below)
     * ES5 Spec: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
     * Required reading: http://javascriptweblog.wordpress.com/2011/12/05/extending-javascript-natives/
     */

    // Shortcut to an often accessed properties, in order to avoid multiple
    // dereference that costs universally. This also holds a reference to known-good
    // functions.
    var $Array = Array;
    var ArrayPrototype = $Array.prototype;
    var $Object = Object;
    var ObjectPrototype = $Object.prototype;
    var $Function = Function;
    var FunctionPrototype = $Function.prototype;
    var $String = String;
    var StringPrototype = $String.prototype;
    var $Number = Number;
    var NumberPrototype = $Number.prototype;
    var array_slice = ArrayPrototype.slice;
    var array_splice = ArrayPrototype.splice;
    var array_push = ArrayPrototype.push;
    var array_unshift = ArrayPrototype.unshift;
    var array_concat = ArrayPrototype.concat;
    var array_join = ArrayPrototype.join;
    var call = FunctionPrototype.call;
    var apply = FunctionPrototype.apply;
    var max = Math.max;
    var min = Math.min;

    // Having a toString local variable name breaks in Opera so use to_string.
    var to_string = ObjectPrototype.toString;

    /* global Symbol */
    /* eslint-disable one-var-declaration-per-line, no-redeclare, max-statements-per-line */
    var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
    var isCallable; /* inlined from https://npmjs.com/is-callable */ var fnToStr = Function.prototype.toString, constructorRegex = /^\s*class /, isES6ClassFn = function isES6ClassFn(value) { try { var fnStr = fnToStr.call(value); var singleStripped = fnStr.replace(/\/\/.*\n/g, ''); var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, ''); var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' '); return constructorRegex.test(spaceStripped); } catch (e) { return false; /* not a function */ } }, tryFunctionObject = function tryFunctionObject(value) { try { if (isES6ClassFn(value)) { return false; } fnToStr.call(value); return true; } catch (e) { return false; } }, fnClass = '[object Function]', genClass = '[object GeneratorFunction]', isCallable = function isCallable(value) { if (!value) { return false; } if (typeof value !== 'function' && typeof value !== 'object') { return false; } if (hasToStringTag) { return tryFunctionObject(value); } if (isES6ClassFn(value)) { return false; } var strClass = to_string.call(value); return strClass === fnClass || strClass === genClass; };

    var isRegex; /* inlined from https://npmjs.com/is-regex */ var regexExec = RegExp.prototype.exec, tryRegexExec = function tryRegexExec(value) { try { regexExec.call(value); return true; } catch (e) { return false; } }, regexClass = '[object RegExp]'; isRegex = function isRegex(value) { if (typeof value !== 'object') { return false; } return hasToStringTag ? tryRegexExec(value) : to_string.call(value) === regexClass; };
    var isString; /* inlined from https://npmjs.com/is-string */ var strValue = String.prototype.valueOf, tryStringObject = function tryStringObject(value) { try { strValue.call(value); return true; } catch (e) { return false; } }, stringClass = '[object String]'; isString = function isString(value) { if (typeof value === 'string') { return true; } if (typeof value !== 'object') { return false; } return hasToStringTag ? tryStringObject(value) : to_string.call(value) === stringClass; };
    /* eslint-enable one-var-declaration-per-line, no-redeclare, max-statements-per-line */

    /* inlined from http://npmjs.com/define-properties */
    var supportsDescriptors = $Object.defineProperty && (function () {
        try {
            var obj = {};
            $Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
            for (var _ in obj) { // jscs:ignore disallowUnusedVariables
                return false;
            }
            return obj.x === obj;
        } catch (e) { /* this is ES3 */
            return false;
        }
    }());
    var defineProperties = (function (has) {
        // Define configurable, writable, and non-enumerable props
        // if they don't exist.
        var defineProperty;
        if (supportsDescriptors) {
            defineProperty = function (object, name, method, forceAssign) {
                if (!forceAssign && (name in object)) {
                    return;
                }
                $Object.defineProperty(object, name, {
                    configurable: true,
                    enumerable: false,
                    writable: true,
                    value: method
                });
            };
        } else {
            defineProperty = function (object, name, method, forceAssign) {
                if (!forceAssign && (name in object)) {
                    return;
                }
                object[name] = method;
            };
        }
        return function defineProperties(object, map, forceAssign) {
            for (var name in map) {
                if (has.call(map, name)) {
                    defineProperty(object, name, map[name], forceAssign);
                }
            }
        };
    }(ObjectPrototype.hasOwnProperty));

    //
    // Util
    // ======
    //

    /* replaceable with https://npmjs.com/package/es-abstract /helpers/isPrimitive */
    var isPrimitive = function isPrimitive(input) {
        var type = typeof input;
        return input === null || (type !== 'object' && type !== 'function');
    };

    var isActualNaN = $Number.isNaN || function isActualNaN(x) {
        return x !== x;
    };

    var ES = {
        // ES5 9.4
        // http://es5.github.com/#x9.4
        // http://jsperf.com/to-integer
        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToInteger */
        ToInteger: function ToInteger(num) {
            var n = +num;
            if (isActualNaN(n)) {
                n = 0;
            } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
            return n;
        },

        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToPrimitive */
        ToPrimitive: function ToPrimitive(input) {
            var val, valueOf, toStr;
            if (isPrimitive(input)) {
                return input;
            }
            valueOf = input.valueOf;
            if (isCallable(valueOf)) {
                val = valueOf.call(input);
                if (isPrimitive(val)) {
                    return val;
                }
            }
            toStr = input.toString;
            if (isCallable(toStr)) {
                val = toStr.call(input);
                if (isPrimitive(val)) {
                    return val;
                }
            }
            throw new TypeError();
        },

        // ES5 9.9
        // http://es5.github.com/#x9.9
        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToObject */
        ToObject: function (o) {
            if (o == null) { // this matches both null and undefined
                throw new TypeError("can't convert " + o + ' to object');
            }
            return $Object(o);
        },

        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToUint32 */
        ToUint32: function ToUint32(x) {
            return x >>> 0;
        }
    };

    //
    // Function
    // ========
    //

    // ES-5 15.3.4.5
    // http://es5.github.com/#x15.3.4.5

    var Empty = function Empty() {};

    defineProperties(FunctionPrototype, {
        bind: function bind(that) { // .length is 1
            // 1. Let Target be the this value.
            var target = this;
            // 2. If IsCallable(Target) is false, throw a TypeError exception.
            if (!isCallable(target)) {
                throw new TypeError('Function.prototype.bind called on incompatible ' + target);
            }
            // 3. Let A be a new (possibly empty) internal list of all of the
            //   argument values provided after thisArg (arg1, arg2 etc), in order.
            // XXX slicedArgs will stand in for "A" if used
            var args = array_slice.call(arguments, 1); // for normal call
            // 4. Let F be a new native ECMAScript object.
            // 11. Set the [[Prototype]] internal property of F to the standard
            //   built-in Function prototype object as specified in 15.3.3.1.
            // 12. Set the [[Call]] internal property of F as described in
            //   15.3.4.5.1.
            // 13. Set the [[Construct]] internal property of F as described in
            //   15.3.4.5.2.
            // 14. Set the [[HasInstance]] internal property of F as described in
            //   15.3.4.5.3.
            var bound;
            var binder = function () {

                if (this instanceof bound) {
                    // 15.3.4.5.2 [[Construct]]
                    // When the [[Construct]] internal method of a function object,
                    // F that was created using the bind function is called with a
                    // list of arguments ExtraArgs, the following steps are taken:
                    // 1. Let target be the value of F's [[TargetFunction]]
                    //   internal property.
                    // 2. If target has no [[Construct]] internal method, a
                    //   TypeError exception is thrown.
                    // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                    //   property.
                    // 4. Let args be a new list containing the same values as the
                    //   list boundArgs in the same order followed by the same
                    //   values as the list ExtraArgs in the same order.
                    // 5. Return the result of calling the [[Construct]] internal
                    //   method of target providing args as the arguments.

                    var result = apply.call(
                        target,
                        this,
                        array_concat.call(args, array_slice.call(arguments))
                    );
                    if ($Object(result) === result) {
                        return result;
                    }
                    return this;

                } else {
                    // 15.3.4.5.1 [[Call]]
                    // When the [[Call]] internal method of a function object, F,
                    // which was created using the bind function is called with a
                    // this value and a list of arguments ExtraArgs, the following
                    // steps are taken:
                    // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                    //   property.
                    // 2. Let boundThis be the value of F's [[BoundThis]] internal
                    //   property.
                    // 3. Let target be the value of F's [[TargetFunction]] internal
                    //   property.
                    // 4. Let args be a new list containing the same values as the
                    //   list boundArgs in the same order followed by the same
                    //   values as the list ExtraArgs in the same order.
                    // 5. Return the result of calling the [[Call]] internal method
                    //   of target providing boundThis as the this value and
                    //   providing args as the arguments.

                    // equiv: target.call(this, ...boundArgs, ...args)
                    return apply.call(
                        target,
                        that,
                        array_concat.call(args, array_slice.call(arguments))
                    );

                }

            };

            // 15. If the [[Class]] internal property of Target is "Function", then
            //     a. Let L be the length property of Target minus the length of A.
            //     b. Set the length own property of F to either 0 or L, whichever is
            //       larger.
            // 16. Else set the length own property of F to 0.

            var boundLength = max(0, target.length - args.length);

            // 17. Set the attributes of the length own property of F to the values
            //   specified in 15.3.5.1.
            var boundArgs = [];
            for (var i = 0; i < boundLength; i++) {
                array_push.call(boundArgs, '$' + i);
            }

            // XXX Build a dynamic function with desired amount of arguments is the only
            // way to set the length property of a function.
            // In environments where Content Security Policies enabled (Chrome extensions,
            // for ex.) all use of eval or Function costructor throws an exception.
            // However in all of these environments Function.prototype.bind exists
            // and so this code will never be executed.
            bound = $Function('binder', 'return function (' + array_join.call(boundArgs, ',') + '){ return binder.apply(this, arguments); }')(binder);

            if (target.prototype) {
                Empty.prototype = target.prototype;
                bound.prototype = new Empty();
                // Clean up dangling references.
                Empty.prototype = null;
            }

            // TODO
            // 18. Set the [[Extensible]] internal property of F to true.

            // TODO
            // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
            // 20. Call the [[DefineOwnProperty]] internal method of F with
            //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
            //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
            //   false.
            // 21. Call the [[DefineOwnProperty]] internal method of F with
            //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
            //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
            //   and false.

            // TODO
            // NOTE Function objects created using Function.prototype.bind do not
            // have a prototype property or the [[Code]], [[FormalParameters]], and
            // [[Scope]] internal properties.
            // XXX can't delete prototype in pure-js.

            // 22. Return F.
            return bound;
        }
    });

    // _Please note: Shortcuts are defined after `Function.prototype.bind` as we
    // use it in defining shortcuts.
    var owns = call.bind(ObjectPrototype.hasOwnProperty);
    var toStr = call.bind(ObjectPrototype.toString);
    var arraySlice = call.bind(array_slice);
    var arraySliceApply = apply.bind(array_slice);
    /* globals document */
    if (typeof document === 'object' && document && document.documentElement) {
        try {
            arraySlice(document.documentElement.childNodes);
        } catch (e) {
            var origArraySlice = arraySlice;
            var origArraySliceApply = arraySliceApply;
            arraySlice = function arraySliceIE(arr) {
                var r = [];
                var i = arr.length;
                while (i-- > 0) {
                    r[i] = arr[i];
                }
                return origArraySliceApply(r, origArraySlice(arguments, 1));
            };
            arraySliceApply = function arraySliceApplyIE(arr, args) {
                return origArraySliceApply(arraySlice(arr), args);
            };
        }
    }
    var strSlice = call.bind(StringPrototype.slice);
    var strSplit = call.bind(StringPrototype.split);
    var strIndexOf = call.bind(StringPrototype.indexOf);
    var pushCall = call.bind(array_push);
    var isEnum = call.bind(ObjectPrototype.propertyIsEnumerable);
    var arraySort = call.bind(ArrayPrototype.sort);

    //
    // Array
    // =====
    //

    var isArray = $Array.isArray || function isArray(obj) {
        return toStr(obj) === '[object Array]';
    };

    // ES5 15.4.4.12
    // http://es5.github.com/#x15.4.4.13
    // Return len+argCount.
    // [bugfix, ielt8]
    // IE < 8 bug: [].unshift(0) === undefined but should be "1"
    var hasUnshiftReturnValueBug = [].unshift(0) !== 1;
    defineProperties(ArrayPrototype, {
        unshift: function () {
            array_unshift.apply(this, arguments);
            return this.length;
        }
    }, hasUnshiftReturnValueBug);

    // ES5 15.4.3.2
    // http://es5.github.com/#x15.4.3.2
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
    defineProperties($Array, { isArray: isArray });

    // The IsCallable() check in the Array functions
    // has been replaced with a strict check on the
    // internal class of the object to trap cases where
    // the provided function was actually a regular
    // expression literal, which in V8 and
    // JavaScriptCore is a typeof "function".  Only in
    // V8 are regular expression literals permitted as
    // reduce parameters, so it is desirable in the
    // general case for the shim to match the more
    // strict and common behavior of rejecting regular
    // expressions.

    // ES5 15.4.4.18
    // http://es5.github.com/#x15.4.4.18
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach

    // Check failure of by-index access of string characters (IE < 9)
    // and failure of `0 in boxedString` (Rhino)
    var boxedString = $Object('a');
    var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

    var properlyBoxesContext = function properlyBoxed(method) {
        // Check node 0.6.21 bug where third parameter is not boxed
        var properlyBoxesNonStrict = true;
        var properlyBoxesStrict = true;
        var threwException = false;
        if (method) {
            try {
                method.call('foo', function (_, __, context) {
                    if (typeof context !== 'object') {
                        properlyBoxesNonStrict = false;
                    }
                });

                method.call([1], function () {
                    'use strict';

                    properlyBoxesStrict = typeof this === 'string';
                }, 'x');
            } catch (e) {
                threwException = true;
            }
        }
        return !!method && !threwException && properlyBoxesNonStrict && properlyBoxesStrict;
    };

    defineProperties(ArrayPrototype, {
        forEach: function forEach(callbackfn/*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var i = -1;
            var length = ES.ToUint32(self.length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.forEach callback must be a function');
            }

            while (++i < length) {
                if (i in self) {
                    // Invoke the callback function with call, passing arguments:
                    // context, property value, property key, thisArg object
                    if (typeof T === 'undefined') {
                        callbackfn(self[i], i, object);
                    } else {
                        callbackfn.call(T, self[i], i, object);
                    }
                }
            }
        }
    }, !properlyBoxesContext(ArrayPrototype.forEach));

    // ES5 15.4.4.19
    // http://es5.github.com/#x15.4.4.19
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
    defineProperties(ArrayPrototype, {
        map: function map(callbackfn/*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var result = $Array(length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.map callback must be a function');
            }

            for (var i = 0; i < length; i++) {
                if (i in self) {
                    if (typeof T === 'undefined') {
                        result[i] = callbackfn(self[i], i, object);
                    } else {
                        result[i] = callbackfn.call(T, self[i], i, object);
                    }
                }
            }
            return result;
        }
    }, !properlyBoxesContext(ArrayPrototype.map));

    // ES5 15.4.4.20
    // http://es5.github.com/#x15.4.4.20
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
    defineProperties(ArrayPrototype, {
        filter: function filter(callbackfn/*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var result = [];
            var value;
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.filter callback must be a function');
            }

            for (var i = 0; i < length; i++) {
                if (i in self) {
                    value = self[i];
                    if (typeof T === 'undefined' ? callbackfn(value, i, object) : callbackfn.call(T, value, i, object)) {
                        pushCall(result, value);
                    }
                }
            }
            return result;
        }
    }, !properlyBoxesContext(ArrayPrototype.filter));

    // ES5 15.4.4.16
    // http://es5.github.com/#x15.4.4.16
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
    defineProperties(ArrayPrototype, {
        every: function every(callbackfn/*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.every callback must be a function');
            }

            for (var i = 0; i < length; i++) {
                if (i in self && !(typeof T === 'undefined' ? callbackfn(self[i], i, object) : callbackfn.call(T, self[i], i, object))) {
                    return false;
                }
            }
            return true;
        }
    }, !properlyBoxesContext(ArrayPrototype.every));

    // ES5 15.4.4.17
    // http://es5.github.com/#x15.4.4.17
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
    defineProperties(ArrayPrototype, {
        some: function some(callbackfn/*, thisArg */) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.some callback must be a function');
            }

            for (var i = 0; i < length; i++) {
                if (i in self && (typeof T === 'undefined' ? callbackfn(self[i], i, object) : callbackfn.call(T, self[i], i, object))) {
                    return true;
                }
            }
            return false;
        }
    }, !properlyBoxesContext(ArrayPrototype.some));

    // ES5 15.4.4.21
    // http://es5.github.com/#x15.4.4.21
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
    var reduceCoercesToObject = false;
    if (ArrayPrototype.reduce) {
        reduceCoercesToObject = typeof ArrayPrototype.reduce.call('es5', function (_, __, ___, list) {
            return list;
        }) === 'object';
    }
    defineProperties(ArrayPrototype, {
        reduce: function reduce(callbackfn/*, initialValue*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.reduce callback must be a function');
            }

            // no value to return if no initial value and an empty array
            if (length === 0 && arguments.length === 1) {
                throw new TypeError('reduce of empty array with no initial value');
            }

            var i = 0;
            var result;
            if (arguments.length >= 2) {
                result = arguments[1];
            } else {
                do {
                    if (i in self) {
                        result = self[i++];
                        break;
                    }

                    // if array contains no values, no initial value to return
                    if (++i >= length) {
                        throw new TypeError('reduce of empty array with no initial value');
                    }
                } while (true);
            }

            for (; i < length; i++) {
                if (i in self) {
                    result = callbackfn(result, self[i], i, object);
                }
            }

            return result;
        }
    }, !reduceCoercesToObject);

    // ES5 15.4.4.22
    // http://es5.github.com/#x15.4.4.22
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
    var reduceRightCoercesToObject = false;
    if (ArrayPrototype.reduceRight) {
        reduceRightCoercesToObject = typeof ArrayPrototype.reduceRight.call('es5', function (_, __, ___, list) {
            return list;
        }) === 'object';
    }
    defineProperties(ArrayPrototype, {
        reduceRight: function reduceRight(callbackfn/*, initial*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.reduceRight callback must be a function');
            }

            // no value to return if no initial value, empty array
            if (length === 0 && arguments.length === 1) {
                throw new TypeError('reduceRight of empty array with no initial value');
            }

            var result;
            var i = length - 1;
            if (arguments.length >= 2) {
                result = arguments[1];
            } else {
                do {
                    if (i in self) {
                        result = self[i--];
                        break;
                    }

                    // if array contains no values, no initial value to return
                    if (--i < 0) {
                        throw new TypeError('reduceRight of empty array with no initial value');
                    }
                } while (true);
            }

            if (i < 0) {
                return result;
            }

            do {
                if (i in self) {
                    result = callbackfn(result, self[i], i, object);
                }
            } while (i--);

            return result;
        }
    }, !reduceRightCoercesToObject);

    // ES5 15.4.4.14
    // http://es5.github.com/#x15.4.4.14
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
    var hasFirefox2IndexOfBug = ArrayPrototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
    defineProperties(ArrayPrototype, {
        indexOf: function indexOf(searchElement/*, fromIndex */) {
            var self = splitString && isString(this) ? strSplit(this, '') : ES.ToObject(this);
            var length = ES.ToUint32(self.length);

            if (length === 0) {
                return -1;
            }

            var i = 0;
            if (arguments.length > 1) {
                i = ES.ToInteger(arguments[1]);
            }

            // handle negative indices
            i = i >= 0 ? i : max(0, length + i);
            for (; i < length; i++) {
                if (i in self && self[i] === searchElement) {
                    return i;
                }
            }
            return -1;
        }
    }, hasFirefox2IndexOfBug);

    // ES5 15.4.4.15
    // http://es5.github.com/#x15.4.4.15
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
    var hasFirefox2LastIndexOfBug = ArrayPrototype.lastIndexOf && [0, 1].lastIndexOf(0, -3) !== -1;
    defineProperties(ArrayPrototype, {
        lastIndexOf: function lastIndexOf(searchElement/*, fromIndex */) {
            var self = splitString && isString(this) ? strSplit(this, '') : ES.ToObject(this);
            var length = ES.ToUint32(self.length);

            if (length === 0) {
                return -1;
            }
            var i = length - 1;
            if (arguments.length > 1) {
                i = min(i, ES.ToInteger(arguments[1]));
            }
            // handle negative indices
            i = i >= 0 ? i : length - Math.abs(i);
            for (; i >= 0; i--) {
                if (i in self && searchElement === self[i]) {
                    return i;
                }
            }
            return -1;
        }
    }, hasFirefox2LastIndexOfBug);

    // ES5 15.4.4.12
    // http://es5.github.com/#x15.4.4.12
    var spliceNoopReturnsEmptyArray = (function () {
        var a = [1, 2];
        var result = a.splice();
        return a.length === 2 && isArray(result) && result.length === 0;
    }());
    defineProperties(ArrayPrototype, {
        // Safari 5.0 bug where .splice() returns undefined
        splice: function splice(start, deleteCount) {
            if (arguments.length === 0) {
                return [];
            } else {
                return array_splice.apply(this, arguments);
            }
        }
    }, !spliceNoopReturnsEmptyArray);

    var spliceWorksWithEmptyObject = (function () {
        var obj = {};
        ArrayPrototype.splice.call(obj, 0, 0, 1);
        return obj.length === 1;
    }());
    defineProperties(ArrayPrototype, {
        splice: function splice(start, deleteCount) {
            if (arguments.length === 0) {
                return [];
            }
            var args = arguments;
            this.length = max(ES.ToInteger(this.length), 0);
            if (arguments.length > 0 && typeof deleteCount !== 'number') {
                args = arraySlice(arguments);
                if (args.length < 2) {
                    pushCall(args, this.length - start);
                } else {
                    args[1] = ES.ToInteger(deleteCount);
                }
            }
            return array_splice.apply(this, args);
        }
    }, !spliceWorksWithEmptyObject);
    var spliceWorksWithLargeSparseArrays = (function () {
        // Per https://github.com/es-shims/es5-shim/issues/295
        // Safari 7/8 breaks with sparse arrays of size 1e5 or greater
        var arr = new $Array(1e5);
        // note: the index MUST be 8 or larger or the test will false pass
        arr[8] = 'x';
        arr.splice(1, 1);
        // note: this test must be defined *after* the indexOf shim
        // per https://github.com/es-shims/es5-shim/issues/313
        return arr.indexOf('x') === 7;
    }());
    var spliceWorksWithSmallSparseArrays = (function () {
        // Per https://github.com/es-shims/es5-shim/issues/295
        // Opera 12.15 breaks on this, no idea why.
        var n = 256;
        var arr = [];
        arr[n] = 'a';
        arr.splice(n + 1, 0, 'b');
        return arr[n] === 'a';
    }());
    defineProperties(ArrayPrototype, {
        splice: function splice(start, deleteCount) {
            var O = ES.ToObject(this);
            var A = [];
            var len = ES.ToUint32(O.length);
            var relativeStart = ES.ToInteger(start);
            var actualStart = relativeStart < 0 ? max((len + relativeStart), 0) : min(relativeStart, len);
            var actualDeleteCount = min(max(ES.ToInteger(deleteCount), 0), len - actualStart);

            var k = 0;
            var from;
            while (k < actualDeleteCount) {
                from = $String(actualStart + k);
                if (owns(O, from)) {
                    A[k] = O[from];
                }
                k += 1;
            }

            var items = arraySlice(arguments, 2);
            var itemCount = items.length;
            var to;
            if (itemCount < actualDeleteCount) {
                k = actualStart;
                var maxK = len - actualDeleteCount;
                while (k < maxK) {
                    from = $String(k + actualDeleteCount);
                    to = $String(k + itemCount);
                    if (owns(O, from)) {
                        O[to] = O[from];
                    } else {
                        delete O[to];
                    }
                    k += 1;
                }
                k = len;
                var minK = len - actualDeleteCount + itemCount;
                while (k > minK) {
                    delete O[k - 1];
                    k -= 1;
                }
            } else if (itemCount > actualDeleteCount) {
                k = len - actualDeleteCount;
                while (k > actualStart) {
                    from = $String(k + actualDeleteCount - 1);
                    to = $String(k + itemCount - 1);
                    if (owns(O, from)) {
                        O[to] = O[from];
                    } else {
                        delete O[to];
                    }
                    k -= 1;
                }
            }
            k = actualStart;
            for (var i = 0; i < items.length; ++i) {
                O[k] = items[i];
                k += 1;
            }
            O.length = len - actualDeleteCount + itemCount;

            return A;
        }
    }, !spliceWorksWithLargeSparseArrays || !spliceWorksWithSmallSparseArrays);

    var originalJoin = ArrayPrototype.join;
    var hasStringJoinBug;
    try {
        hasStringJoinBug = Array.prototype.join.call('123', ',') !== '1,2,3';
    } catch (e) {
        hasStringJoinBug = true;
    }
    if (hasStringJoinBug) {
        defineProperties(ArrayPrototype, {
            join: function join(separator) {
                var sep = typeof separator === 'undefined' ? ',' : separator;
                return originalJoin.call(isString(this) ? strSplit(this, '') : this, sep);
            }
        }, hasStringJoinBug);
    }

    var hasJoinUndefinedBug = [1, 2].join(undefined) !== '1,2';
    if (hasJoinUndefinedBug) {
        defineProperties(ArrayPrototype, {
            join: function join(separator) {
                var sep = typeof separator === 'undefined' ? ',' : separator;
                return originalJoin.call(this, sep);
            }
        }, hasJoinUndefinedBug);
    }

    var pushShim = function push(item) {
        var O = ES.ToObject(this);
        var n = ES.ToUint32(O.length);
        var i = 0;
        while (i < arguments.length) {
            O[n + i] = arguments[i];
            i += 1;
        }
        O.length = n + i;
        return n + i;
    };

    var pushIsNotGeneric = (function () {
        var obj = {};
        var result = Array.prototype.push.call(obj, undefined);
        return result !== 1 || obj.length !== 1 || typeof obj[0] !== 'undefined' || !owns(obj, 0);
    }());
    defineProperties(ArrayPrototype, {
        push: function push(item) {
            if (isArray(this)) {
                return array_push.apply(this, arguments);
            }
            return pushShim.apply(this, arguments);
        }
    }, pushIsNotGeneric);

    // This fixes a very weird bug in Opera 10.6 when pushing `undefined
    var pushUndefinedIsWeird = (function () {
        var arr = [];
        var result = arr.push(undefined);
        return result !== 1 || arr.length !== 1 || typeof arr[0] !== 'undefined' || !owns(arr, 0);
    }());
    defineProperties(ArrayPrototype, { push: pushShim }, pushUndefinedIsWeird);

    // ES5 15.2.3.14
    // http://es5.github.io/#x15.4.4.10
    // Fix boxed string bug
    defineProperties(ArrayPrototype, {
        slice: function (start, end) {
            var arr = isString(this) ? strSplit(this, '') : this;
            return arraySliceApply(arr, arguments);
        }
    }, splitString);

    var sortIgnoresNonFunctions = (function () {
        try {
            [1, 2].sort(null);
        } catch (e) {
            try {
                [1, 2].sort({});
            } catch (e2) {
                return false;
            }
        }
        return true;
    }());
    var sortThrowsOnRegex = (function () {
        // this is a problem in Firefox 4, in which `typeof /a/ === 'function'`
        try {
            [1, 2].sort(/a/);
            return false;
        } catch (e) {}
        return true;
    }());
    var sortIgnoresUndefined = (function () {
        // applies in IE 8, for one.
        try {
            [1, 2].sort(undefined);
            return true;
        } catch (e) {}
        return false;
    }());
    defineProperties(ArrayPrototype, {
        sort: function sort(compareFn) {
            if (typeof compareFn === 'undefined') {
                return arraySort(this);
            }
            if (!isCallable(compareFn)) {
                throw new TypeError('Array.prototype.sort callback must be a function');
            }
            return arraySort(this, compareFn);
        }
    }, sortIgnoresNonFunctions || !sortIgnoresUndefined || !sortThrowsOnRegex);

    //
    // Object
    // ======
    //

    // ES5 15.2.3.14
    // http://es5.github.com/#x15.2.3.14

    // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
    var hasDontEnumBug = !isEnum({ 'toString': null }, 'toString'); // jscs:ignore disallowQuotedKeysInObjects
    var hasProtoEnumBug = isEnum(function () {}, 'prototype');
    var hasStringEnumBug = !owns('x', '0');
    var equalsConstructorPrototype = function (o) {
        var ctor = o.constructor;
        return ctor && ctor.prototype === o;
    };
    var excludedKeys = {
        $window: true,
        $console: true,
        $parent: true,
        $self: true,
        $frame: true,
        $frames: true,
        $frameElement: true,
        $webkitIndexedDB: true,
        $webkitStorageInfo: true,
        $external: true,
        $width: true,
        $height: true,
        $top: true,
        $localStorage: true
    };
    var hasAutomationEqualityBug = (function () {
        /* globals window */
        if (typeof window === 'undefined') {
            return false;
        }
        for (var k in window) {
            try {
                if (!excludedKeys['$' + k] && owns(window, k) && window[k] !== null && typeof window[k] === 'object') {
                    equalsConstructorPrototype(window[k]);
                }
            } catch (e) {
                return true;
            }
        }
        return false;
    }());
    var equalsConstructorPrototypeIfNotBuggy = function (object) {
        if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
            return equalsConstructorPrototype(object);
        }
        try {
            return equalsConstructorPrototype(object);
        } catch (e) {
            return false;
        }
    };
    var dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
    ];
    var dontEnumsLength = dontEnums.length;

    // taken directly from https://github.com/ljharb/is-arguments/blob/master/index.js
    // can be replaced with require('is-arguments') if we ever use a build process instead
    var isStandardArguments = function isArguments(value) {
        return toStr(value) === '[object Arguments]';
    };
    var isLegacyArguments = function isArguments(value) {
        return value !== null
            && typeof value === 'object'
            && typeof value.length === 'number'
            && value.length >= 0
            && !isArray(value)
            && isCallable(value.callee);
    };
    var isArguments = isStandardArguments(arguments) ? isStandardArguments : isLegacyArguments;

    defineProperties($Object, {
        keys: function keys(object) {
            var isFn = isCallable(object);
            var isArgs = isArguments(object);
            var isObject = object !== null && typeof object === 'object';
            var isStr = isObject && isString(object);

            if (!isObject && !isFn && !isArgs) {
                throw new TypeError('Object.keys called on a non-object');
            }

            var theKeys = [];
            var skipProto = hasProtoEnumBug && isFn;
            if ((isStr && hasStringEnumBug) || isArgs) {
                for (var i = 0; i < object.length; ++i) {
                    pushCall(theKeys, $String(i));
                }
            }

            if (!isArgs) {
                for (var name in object) {
                    if (!(skipProto && name === 'prototype') && owns(object, name)) {
                        pushCall(theKeys, $String(name));
                    }
                }
            }

            if (hasDontEnumBug) {
                var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
                for (var j = 0; j < dontEnumsLength; j++) {
                    var dontEnum = dontEnums[j];
                    if (!(skipConstructor && dontEnum === 'constructor') && owns(object, dontEnum)) {
                        pushCall(theKeys, dontEnum);
                    }
                }
            }
            return theKeys;
        }
    });

    var keysWorksWithArguments = $Object.keys && (function () {
        // Safari 5.0 bug
        return $Object.keys(arguments).length === 2;
    }(1, 2));
    var keysHasArgumentsLengthBug = $Object.keys && (function () {
        var argKeys = $Object.keys(arguments);
        return arguments.length !== 1 || argKeys.length !== 1 || argKeys[0] !== 1;
    }(1));
    var originalKeys = $Object.keys;
    defineProperties($Object, {
        keys: function keys(object) {
            if (isArguments(object)) {
                return originalKeys(arraySlice(object));
            } else {
                return originalKeys(object);
            }
        }
    }, !keysWorksWithArguments || keysHasArgumentsLengthBug);

    //
    // Date
    // ====
    //

    var hasNegativeMonthYearBug = new Date(-3509827329600292).getUTCMonth() !== 0;
    var aNegativeTestDate = new Date(-1509842289600292);
    var aPositiveTestDate = new Date(1449662400000);
    var hasToUTCStringFormatBug = aNegativeTestDate.toUTCString() !== 'Mon, 01 Jan -45875 11:59:59 GMT';
    var hasToDateStringFormatBug;
    var hasToStringFormatBug;
    var timeZoneOffset = aNegativeTestDate.getTimezoneOffset();
    if (timeZoneOffset < -720) {
        hasToDateStringFormatBug = aNegativeTestDate.toDateString() !== 'Tue Jan 02 -45875';
        hasToStringFormatBug = !(/^Thu Dec 10 2015 \d\d:\d\d:\d\d GMT[-+]\d\d\d\d(?: |$)/).test(String(aPositiveTestDate));
    } else {
        hasToDateStringFormatBug = aNegativeTestDate.toDateString() !== 'Mon Jan 01 -45875';
        hasToStringFormatBug = !(/^Wed Dec 09 2015 \d\d:\d\d:\d\d GMT[-+]\d\d\d\d(?: |$)/).test(String(aPositiveTestDate));
    }

    var originalGetFullYear = call.bind(Date.prototype.getFullYear);
    var originalGetMonth = call.bind(Date.prototype.getMonth);
    var originalGetDate = call.bind(Date.prototype.getDate);
    var originalGetUTCFullYear = call.bind(Date.prototype.getUTCFullYear);
    var originalGetUTCMonth = call.bind(Date.prototype.getUTCMonth);
    var originalGetUTCDate = call.bind(Date.prototype.getUTCDate);
    var originalGetUTCDay = call.bind(Date.prototype.getUTCDay);
    var originalGetUTCHours = call.bind(Date.prototype.getUTCHours);
    var originalGetUTCMinutes = call.bind(Date.prototype.getUTCMinutes);
    var originalGetUTCSeconds = call.bind(Date.prototype.getUTCSeconds);
    var originalGetUTCMilliseconds = call.bind(Date.prototype.getUTCMilliseconds);
    var dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var daysInMonth = function daysInMonth(month, year) {
        return originalGetDate(new Date(year, month, 0));
    };

    defineProperties(Date.prototype, {
        getFullYear: function getFullYear() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetFullYear(this);
            if (year < 0 && originalGetMonth(this) > 11) {
                return year + 1;
            }
            return year;
        },
        getMonth: function getMonth() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetFullYear(this);
            var month = originalGetMonth(this);
            if (year < 0 && month > 11) {
                return 0;
            }
            return month;
        },
        getDate: function getDate() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetFullYear(this);
            var month = originalGetMonth(this);
            var date = originalGetDate(this);
            if (year < 0 && month > 11) {
                if (month === 12) {
                    return date;
                }
                var days = daysInMonth(0, year + 1);
                return (days - date) + 1;
            }
            return date;
        },
        getUTCFullYear: function getUTCFullYear() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetUTCFullYear(this);
            if (year < 0 && originalGetUTCMonth(this) > 11) {
                return year + 1;
            }
            return year;
        },
        getUTCMonth: function getUTCMonth() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetUTCFullYear(this);
            var month = originalGetUTCMonth(this);
            if (year < 0 && month > 11) {
                return 0;
            }
            return month;
        },
        getUTCDate: function getUTCDate() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetUTCFullYear(this);
            var month = originalGetUTCMonth(this);
            var date = originalGetUTCDate(this);
            if (year < 0 && month > 11) {
                if (month === 12) {
                    return date;
                }
                var days = daysInMonth(0, year + 1);
                return (days - date) + 1;
            }
            return date;
        }
    }, hasNegativeMonthYearBug);

    defineProperties(Date.prototype, {
        toUTCString: function toUTCString() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var day = originalGetUTCDay(this);
            var date = originalGetUTCDate(this);
            var month = originalGetUTCMonth(this);
            var year = originalGetUTCFullYear(this);
            var hour = originalGetUTCHours(this);
            var minute = originalGetUTCMinutes(this);
            var second = originalGetUTCSeconds(this);
            return dayName[day] + ', '
                + (date < 10 ? '0' + date : date) + ' '
                + monthName[month] + ' '
                + year + ' '
                + (hour < 10 ? '0' + hour : hour) + ':'
                + (minute < 10 ? '0' + minute : minute) + ':'
                + (second < 10 ? '0' + second : second) + ' GMT';
        }
    }, hasNegativeMonthYearBug || hasToUTCStringFormatBug);

    // Opera 12 has `,`
    defineProperties(Date.prototype, {
        toDateString: function toDateString() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var day = this.getDay();
            var date = this.getDate();
            var month = this.getMonth();
            var year = this.getFullYear();
            return dayName[day] + ' '
                + monthName[month] + ' '
                + (date < 10 ? '0' + date : date) + ' '
                + year;
        }
    }, hasNegativeMonthYearBug || hasToDateStringFormatBug);

    // can't use defineProperties here because of toString enumeration issue in IE <= 8
    if (hasNegativeMonthYearBug || hasToStringFormatBug) {
        Date.prototype.toString = function toString() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var day = this.getDay();
            var date = this.getDate();
            var month = this.getMonth();
            var year = this.getFullYear();
            var hour = this.getHours();
            var minute = this.getMinutes();
            var second = this.getSeconds();
            var timezoneOffset = this.getTimezoneOffset();
            var hoursOffset = Math.floor(Math.abs(timezoneOffset) / 60);
            var minutesOffset = Math.floor(Math.abs(timezoneOffset) % 60);
            return dayName[day] + ' '
                + monthName[month] + ' '
                + (date < 10 ? '0' + date : date) + ' '
                + year + ' '
                + (hour < 10 ? '0' + hour : hour) + ':'
                + (minute < 10 ? '0' + minute : minute) + ':'
                + (second < 10 ? '0' + second : second) + ' GMT'
                + (timezoneOffset > 0 ? '-' : '+')
                + (hoursOffset < 10 ? '0' + hoursOffset : hoursOffset)
                + (minutesOffset < 10 ? '0' + minutesOffset : minutesOffset);
        };
        if (supportsDescriptors) {
            $Object.defineProperty(Date.prototype, 'toString', {
                configurable: true,
                enumerable: false,
                writable: true
            });
        }
    }

    // ES5 15.9.5.43
    // http://es5.github.com/#x15.9.5.43
    // This function returns a String value represent the instance in time
    // represented by this Date object. The format of the String is the Date Time
    // string format defined in 15.9.1.15. All fields are present in the String.
    // The time zone is always UTC, denoted by the suffix Z. If the time value of
    // this object is not a finite Number a RangeError exception is thrown.
    var negativeDate = -62198755200000;
    var negativeYearString = '-000001';
    var hasNegativeDateBug = Date.prototype.toISOString && new Date(negativeDate).toISOString().indexOf(negativeYearString) === -1; // eslint-disable-line max-len
    var hasSafari51DateBug = Date.prototype.toISOString && new Date(-1).toISOString() !== '1969-12-31T23:59:59.999Z';

    var getTime = call.bind(Date.prototype.getTime);

    defineProperties(Date.prototype, {
        toISOString: function toISOString() {
            if (!isFinite(this) || !isFinite(getTime(this))) {
                // Adope Photoshop requires the second check.
                throw new RangeError('Date.prototype.toISOString called on non-finite value.');
            }

            var year = originalGetUTCFullYear(this);

            var month = originalGetUTCMonth(this);
            // see https://github.com/es-shims/es5-shim/issues/111
            year += Math.floor(month / 12);
            month = ((month % 12) + 12) % 12;

            // the date time string format is specified in 15.9.1.15.
            var result = [
                month + 1,
                originalGetUTCDate(this),
                originalGetUTCHours(this),
                originalGetUTCMinutes(this),
                originalGetUTCSeconds(this)
            ];
            year = (
                (year < 0 ? '-' : (year > 9999 ? '+' : ''))
                + strSlice('00000' + Math.abs(year), (0 <= year && year <= 9999) ? -4 : -6)
            );

            for (var i = 0; i < result.length; ++i) {
                // pad months, days, hours, minutes, and seconds to have two digits.
                result[i] = strSlice('00' + result[i], -2);
            }
            // pad milliseconds to have three digits.
            return (
                year + '-' + arraySlice(result, 0, 2).join('-')
                + 'T' + arraySlice(result, 2).join(':') + '.'
                + strSlice('000' + originalGetUTCMilliseconds(this), -3) + 'Z'
            );
        }
    }, hasNegativeDateBug || hasSafari51DateBug);

    // ES5 15.9.5.44
    // http://es5.github.com/#x15.9.5.44
    // This function provides a String representation of a Date object for use by
    // JSON.stringify (15.12.3).
    var dateToJSONIsSupported = (function () {
        try {
            return Date.prototype.toJSON
                && new Date(NaN).toJSON() === null
                && new Date(negativeDate).toJSON().indexOf(negativeYearString) !== -1
                && Date.prototype.toJSON.call({ // generic
                    toISOString: function () { return true; }
                });
        } catch (e) {
            return false;
        }
    }());
    if (!dateToJSONIsSupported) {
        Date.prototype.toJSON = function toJSON(key) {
            // When the toJSON method is called with argument key, the following
            // steps are taken:

            // 1.  Let O be the result of calling ToObject, giving it the this
            // value as its argument.
            // 2. Let tv be ES.ToPrimitive(O, hint Number).
            var O = $Object(this);
            var tv = ES.ToPrimitive(O);
            // 3. If tv is a Number and is not finite, return null.
            if (typeof tv === 'number' && !isFinite(tv)) {
                return null;
            }
            // 4. Let toISO be the result of calling the [[Get]] internal method of
            // O with argument "toISOString".
            var toISO = O.toISOString;
            // 5. If IsCallable(toISO) is false, throw a TypeError exception.
            if (!isCallable(toISO)) {
                throw new TypeError('toISOString property is not callable');
            }
            // 6. Return the result of calling the [[Call]] internal method of
            //  toISO with O as the this value and an empty argument list.
            return toISO.call(O);

            // NOTE 1 The argument is ignored.

            // NOTE 2 The toJSON function is intentionally generic; it does not
            // require that its this value be a Date object. Therefore, it can be
            // transferred to other kinds of objects for use as a method. However,
            // it does require that any such object have a toISOString method. An
            // object is free to use the argument key to filter its
            // stringification.
        };
    }

    // ES5 15.9.4.2
    // http://es5.github.com/#x15.9.4.2
    // based on work shared by Daniel Friesen (dantman)
    // http://gist.github.com/303249
    var supportsExtendedYears = Date.parse('+033658-09-27T01:46:40.000Z') === 1e15;
    var acceptsInvalidDates = !isNaN(Date.parse('2012-04-04T24:00:00.500Z')) || !isNaN(Date.parse('2012-11-31T23:59:59.000Z')) || !isNaN(Date.parse('2012-12-31T23:59:60.000Z'));
    var doesNotParseY2KNewYear = isNaN(Date.parse('2000-01-01T00:00:00.000Z'));
    if (doesNotParseY2KNewYear || acceptsInvalidDates || !supportsExtendedYears) {
        // XXX global assignment won't work in embeddings that use
        // an alternate object for the context.
        /* global Date: true */
        var maxSafeUnsigned32Bit = Math.pow(2, 31) - 1;
        var hasSafariSignedIntBug = isActualNaN(new Date(1970, 0, 1, 0, 0, 0, maxSafeUnsigned32Bit + 1).getTime());
        // eslint-disable-next-line no-implicit-globals, no-global-assign
        Date = (function (NativeDate) {
            // Date.length === 7
            var DateShim = function Date(Y, M, D, h, m, s, ms) {
                var length = arguments.length;
                var date;
                if (this instanceof NativeDate) {
                    var seconds = s;
                    var millis = ms;
                    if (hasSafariSignedIntBug && length >= 7 && ms > maxSafeUnsigned32Bit) {
                        // work around a Safari 8/9 bug where it treats the seconds as signed
                        var msToShift = Math.floor(ms / maxSafeUnsigned32Bit) * maxSafeUnsigned32Bit;
                        var sToShift = Math.floor(msToShift / 1e3);
                        seconds += sToShift;
                        millis -= sToShift * 1e3;
                    }
                    date = length === 1 && $String(Y) === Y // isString(Y)
                        // We explicitly pass it through parse:
                        ? new NativeDate(DateShim.parse(Y))
                        // We have to manually make calls depending on argument
                        // length here
                        : length >= 7 ? new NativeDate(Y, M, D, h, m, seconds, millis)
                            : length >= 6 ? new NativeDate(Y, M, D, h, m, seconds)
                                : length >= 5 ? new NativeDate(Y, M, D, h, m)
                                    : length >= 4 ? new NativeDate(Y, M, D, h)
                                        : length >= 3 ? new NativeDate(Y, M, D)
                                            : length >= 2 ? new NativeDate(Y, M)
                                                : length >= 1 ? new NativeDate(Y instanceof NativeDate ? +Y : Y)
                                                    : new NativeDate();
                } else {
                    date = NativeDate.apply(this, arguments);
                }
                if (!isPrimitive(date)) {
                    // Prevent mixups with unfixed Date object
                    defineProperties(date, { constructor: DateShim }, true);
                }
                return date;
            };

            // 15.9.1.15 Date Time String Format.
            var isoDateExpression = new RegExp('^'
                + '(\\d{4}|[+-]\\d{6})' // four-digit year capture or sign + 6-digit extended year
                + '(?:-(\\d{2})' // optional month capture
                + '(?:-(\\d{2})' // optional day capture
                + '(?:' // capture hours:minutes:seconds.milliseconds
                    + 'T(\\d{2})' // hours capture
                    + ':(\\d{2})' // minutes capture
                    + '(?:' // optional :seconds.milliseconds
                        + ':(\\d{2})' // seconds capture
                        + '(?:(\\.\\d{1,}))?' // milliseconds capture
                    + ')?'
                + '(' // capture UTC offset component
                    + 'Z|' // UTC capture
                    + '(?:' // offset specifier +/-hours:minutes
                        + '([-+])' // sign capture
                        + '(\\d{2})' // hours offset capture
                        + ':(\\d{2})' // minutes offset capture
                    + ')'
                + ')?)?)?)?'
            + '$');

            var months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];

            var dayFromMonth = function dayFromMonth(year, month) {
                var t = month > 1 ? 1 : 0;
                return (
                    months[month]
                    + Math.floor((year - 1969 + t) / 4)
                    - Math.floor((year - 1901 + t) / 100)
                    + Math.floor((year - 1601 + t) / 400)
                    + (365 * (year - 1970))
                );
            };

            var toUTC = function toUTC(t) {
                var s = 0;
                var ms = t;
                if (hasSafariSignedIntBug && ms > maxSafeUnsigned32Bit) {
                    // work around a Safari 8/9 bug where it treats the seconds as signed
                    var msToShift = Math.floor(ms / maxSafeUnsigned32Bit) * maxSafeUnsigned32Bit;
                    var sToShift = Math.floor(msToShift / 1e3);
                    s += sToShift;
                    ms -= sToShift * 1e3;
                }
                return $Number(new NativeDate(1970, 0, 1, 0, 0, s, ms));
            };

            // Copy any custom methods a 3rd party library may have added
            for (var key in NativeDate) {
                if (owns(NativeDate, key)) {
                    DateShim[key] = NativeDate[key];
                }
            }

            // Copy "native" methods explicitly; they may be non-enumerable
            defineProperties(DateShim, {
                now: NativeDate.now,
                UTC: NativeDate.UTC
            }, true);
            DateShim.prototype = NativeDate.prototype;
            defineProperties(DateShim.prototype, { constructor: DateShim }, true);

            // Upgrade Date.parse to handle simplified ISO 8601 strings
            var parseShim = function parse(string) {
                var match = isoDateExpression.exec(string);
                if (match) {
                    // parse months, days, hours, minutes, seconds, and milliseconds
                    // provide default values if necessary
                    // parse the UTC offset component
                    var year = $Number(match[1]),
                        month = $Number(match[2] || 1) - 1,
                        day = $Number(match[3] || 1) - 1,
                        hour = $Number(match[4] || 0),
                        minute = $Number(match[5] || 0),
                        second = $Number(match[6] || 0),
                        millisecond = Math.floor($Number(match[7] || 0) * 1000),
                        // When time zone is missed, local offset should be used
                        // (ES 5.1 bug)
                        // see https://bugs.ecmascript.org/show_bug.cgi?id=112
                        isLocalTime = Boolean(match[4] && !match[8]),
                        signOffset = match[9] === '-' ? 1 : -1,
                        hourOffset = $Number(match[10] || 0),
                        minuteOffset = $Number(match[11] || 0),
                        result;
                    var hasMinutesOrSecondsOrMilliseconds = minute > 0 || second > 0 || millisecond > 0;
                    if (
                        hour < (hasMinutesOrSecondsOrMilliseconds ? 24 : 25)
                        && minute < 60 && second < 60 && millisecond < 1000
                        && month > -1 && month < 12 && hourOffset < 24
                        && minuteOffset < 60 // detect invalid offsets
                        && day > -1
                        && day < (dayFromMonth(year, month + 1) - dayFromMonth(year, month))
                    ) {
                        result = (
                            ((dayFromMonth(year, month) + day) * 24)
                            + hour
                            + (hourOffset * signOffset)
                        ) * 60;
                        result = ((
                            ((result + minute + (minuteOffset * signOffset)) * 60)
                            + second
                        ) * 1000) + millisecond;
                        if (isLocalTime) {
                            result = toUTC(result);
                        }
                        if (-8.64e15 <= result && result <= 8.64e15) {
                            return result;
                        }
                    }
                    return NaN;
                }
                return NativeDate.parse.apply(this, arguments);
            };
            defineProperties(DateShim, { parse: parseShim });

            return DateShim;
        }(Date));
        /* global Date: false */
    }

    // ES5 15.9.4.4
    // http://es5.github.com/#x15.9.4.4
    if (!Date.now) {
        Date.now = function now() {
            return new Date().getTime();
        };
    }

    //
    // Number
    // ======
    //

    // ES5.1 15.7.4.5
    // http://es5.github.com/#x15.7.4.5
    var hasToFixedBugs = NumberPrototype.toFixed && (
        (0.00008).toFixed(3) !== '0.000'
        || (0.9).toFixed(0) !== '1'
        || (1.255).toFixed(2) !== '1.25'
        || (1000000000000000128).toFixed(0) !== '1000000000000000128'
    );

    var toFixedHelpers = {
        base: 1e7,
        size: 6,
        data: [0, 0, 0, 0, 0, 0],
        multiply: function multiply(n, c) {
            var i = -1;
            var c2 = c;
            while (++i < toFixedHelpers.size) {
                c2 += n * toFixedHelpers.data[i];
                toFixedHelpers.data[i] = c2 % toFixedHelpers.base;
                c2 = Math.floor(c2 / toFixedHelpers.base);
            }
        },
        divide: function divide(n) {
            var i = toFixedHelpers.size;
            var c = 0;
            while (--i >= 0) {
                c += toFixedHelpers.data[i];
                toFixedHelpers.data[i] = Math.floor(c / n);
                c = (c % n) * toFixedHelpers.base;
            }
        },
        numToString: function numToString() {
            var i = toFixedHelpers.size;
            var s = '';
            while (--i >= 0) {
                if (s !== '' || i === 0 || toFixedHelpers.data[i] !== 0) {
                    var t = $String(toFixedHelpers.data[i]);
                    if (s === '') {
                        s = t;
                    } else {
                        s += strSlice('0000000', 0, 7 - t.length) + t;
                    }
                }
            }
            return s;
        },
        pow: function pow(x, n, acc) {
            return (n === 0 ? acc : (n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc)));
        },
        log: function log(x) {
            var n = 0;
            var x2 = x;
            while (x2 >= 4096) {
                n += 12;
                x2 /= 4096;
            }
            while (x2 >= 2) {
                n += 1;
                x2 /= 2;
            }
            return n;
        }
    };

    var toFixedShim = function toFixed(fractionDigits) {
        var f, x, s, m, e, z, j, k;

        // Test for NaN and round fractionDigits down
        f = $Number(fractionDigits);
        f = isActualNaN(f) ? 0 : Math.floor(f);

        if (f < 0 || f > 20) {
            throw new RangeError('Number.toFixed called with invalid number of decimals');
        }

        x = $Number(this);

        if (isActualNaN(x)) {
            return 'NaN';
        }

        // If it is too big or small, return the string value of the number
        if (x <= -1e21 || x >= 1e21) {
            return $String(x);
        }

        s = '';

        if (x < 0) {
            s = '-';
            x = -x;
        }

        m = '0';

        if (x > 1e-21) {
            // 1e-21 < x < 1e21
            // -70 < log2(x) < 70
            e = toFixedHelpers.log(x * toFixedHelpers.pow(2, 69, 1)) - 69;
            z = (e < 0 ? x * toFixedHelpers.pow(2, -e, 1) : x / toFixedHelpers.pow(2, e, 1));
            z *= 0x10000000000000; // Math.pow(2, 52);
            e = 52 - e;

            // -18 < e < 122
            // x = z / 2 ^ e
            if (e > 0) {
                toFixedHelpers.multiply(0, z);
                j = f;

                while (j >= 7) {
                    toFixedHelpers.multiply(1e7, 0);
                    j -= 7;
                }

                toFixedHelpers.multiply(toFixedHelpers.pow(10, j, 1), 0);
                j = e - 1;

                while (j >= 23) {
                    toFixedHelpers.divide(1 << 23);
                    j -= 23;
                }

                toFixedHelpers.divide(1 << j);
                toFixedHelpers.multiply(1, 1);
                toFixedHelpers.divide(2);
                m = toFixedHelpers.numToString();
            } else {
                toFixedHelpers.multiply(0, z);
                toFixedHelpers.multiply(1 << (-e), 0);
                m = toFixedHelpers.numToString() + strSlice('0.00000000000000000000', 2, 2 + f);
            }
        }

        if (f > 0) {
            k = m.length;

            if (k <= f) {
                m = s + strSlice('0.0000000000000000000', 0, f - k + 2) + m;
            } else {
                m = s + strSlice(m, 0, k - f) + '.' + strSlice(m, k - f);
            }
        } else {
            m = s + m;
        }

        return m;
    };
    defineProperties(NumberPrototype, { toFixed: toFixedShim }, hasToFixedBugs);

    var hasToPrecisionUndefinedBug = (function () {
        try {
            return 1.0.toPrecision(undefined) === '1';
        } catch (e) {
            return true;
        }
    }());
    var originalToPrecision = NumberPrototype.toPrecision;
    defineProperties(NumberPrototype, {
        toPrecision: function toPrecision(precision) {
            return typeof precision === 'undefined' ? originalToPrecision.call(this) : originalToPrecision.call(this, precision);
        }
    }, hasToPrecisionUndefinedBug);

    //
    // String
    // ======
    //

    // ES5 15.5.4.14
    // http://es5.github.com/#x15.5.4.14

    // [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
    // Many browsers do not split properly with regular expressions or they
    // do not perform the split correctly under obscure conditions.
    // See http://blog.stevenlevithan.com/archives/cross-browser-split
    // I've tested in many browsers and this seems to cover the deviant ones:
    //    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
    //    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
    //    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
    //       [undefined, "t", undefined, "e", ...]
    //    ''.split(/.?/) should be [], not [""]
    //    '.'.split(/()()/) should be ["."], not ["", "", "."]

    if (
        'ab'.split(/(?:ab)*/).length !== 2
        || '.'.split(/(.?)(.?)/).length !== 4
        || 'tesst'.split(/(s)*/)[1] === 't'
        || 'test'.split(/(?:)/, -1).length !== 4
        || ''.split(/.?/).length
        || '.'.split(/()()/).length > 1
    ) {
        (function () {
            var compliantExecNpcg = typeof (/()??/).exec('')[1] === 'undefined'; // NPCG: nonparticipating capturing group
            var maxSafe32BitInt = Math.pow(2, 32) - 1;

            StringPrototype.split = function (separator, limit) {
                var string = String(this);
                if (typeof separator === 'undefined' && limit === 0) {
                    return [];
                }

                // If `separator` is not a regex, use native split
                if (!isRegex(separator)) {
                    return strSplit(this, separator, limit);
                }

                var output = [];
                var flags = (separator.ignoreCase ? 'i' : '')
                            + (separator.multiline ? 'm' : '')
                            + (separator.unicode ? 'u' : '') // in ES6
                            + (separator.sticky ? 'y' : ''), // Firefox 3+ and ES6
                    lastLastIndex = 0,
                    // Make `global` and avoid `lastIndex` issues by working with a copy
                    separator2, match, lastIndex, lastLength;
                var separatorCopy = new RegExp(separator.source, flags + 'g');
                if (!compliantExecNpcg) {
                    // Doesn't need flags gy, but they don't hurt
                    separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
                }
                /* Values for `limit`, per the spec:
                 * If undefined: 4294967295 // maxSafe32BitInt
                 * If 0, Infinity, or NaN: 0
                 * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
                 * If negative number: 4294967296 - Math.floor(Math.abs(limit))
                 * If other: Type-convert, then use the above rules
                 */
                var splitLimit = typeof limit === 'undefined' ? maxSafe32BitInt : ES.ToUint32(limit);
                match = separatorCopy.exec(string);
                while (match) {
                    // `separatorCopy.lastIndex` is not reliable cross-browser
                    lastIndex = match.index + match[0].length;
                    if (lastIndex > lastLastIndex) {
                        pushCall(output, strSlice(string, lastLastIndex, match.index));
                        // Fix browsers whose `exec` methods don't consistently return `undefined` for
                        // nonparticipating capturing groups
                        if (!compliantExecNpcg && match.length > 1) {
                            /* eslint-disable no-loop-func */
                            match[0].replace(separator2, function () {
                                for (var i = 1; i < arguments.length - 2; i++) {
                                    if (typeof arguments[i] === 'undefined') {
                                        match[i] = void 0;
                                    }
                                }
                            });
                            /* eslint-enable no-loop-func */
                        }
                        if (match.length > 1 && match.index < string.length) {
                            array_push.apply(output, arraySlice(match, 1));
                        }
                        lastLength = match[0].length;
                        lastLastIndex = lastIndex;
                        if (output.length >= splitLimit) {
                            break;
                        }
                    }
                    if (separatorCopy.lastIndex === match.index) {
                        separatorCopy.lastIndex++; // Avoid an infinite loop
                    }
                    match = separatorCopy.exec(string);
                }
                if (lastLastIndex === string.length) {
                    if (lastLength || !separatorCopy.test('')) {
                        pushCall(output, '');
                    }
                } else {
                    pushCall(output, strSlice(string, lastLastIndex));
                }
                return output.length > splitLimit ? arraySlice(output, 0, splitLimit) : output;
            };
        }());

    // [bugfix, chrome]
    // If separator is undefined, then the result array contains just one String,
    // which is the this value (converted to a String). If limit is not undefined,
    // then the output array is truncated so that it contains no more than limit
    // elements.
    // "0".split(undefined, 0) -> []
    } else if ('0'.split(void 0, 0).length) {
        StringPrototype.split = function split(separator, limit) {
            if (typeof separator === 'undefined' && limit === 0) {
                return [];
            }
            return strSplit(this, separator, limit);
        };
    }

    var str_replace = StringPrototype.replace;
    var replaceReportsGroupsCorrectly = (function () {
        var groups = [];
        'x'.replace(/x(.)?/g, function (match, group) {
            pushCall(groups, group);
        });
        return groups.length === 1 && typeof groups[0] === 'undefined';
    }());

    if (!replaceReportsGroupsCorrectly) {
        StringPrototype.replace = function replace(searchValue, replaceValue) {
            var isFn = isCallable(replaceValue);
            var hasCapturingGroups = isRegex(searchValue) && (/\)[*?]/).test(searchValue.source);
            if (!isFn || !hasCapturingGroups) {
                return str_replace.call(this, searchValue, replaceValue);
            } else {
                var wrappedReplaceValue = function (match) {
                    var length = arguments.length;
                    var originalLastIndex = searchValue.lastIndex;
                    searchValue.lastIndex = 0;
                    var args = searchValue.exec(match) || [];
                    searchValue.lastIndex = originalLastIndex;
                    pushCall(args, arguments[length - 2], arguments[length - 1]);
                    return replaceValue.apply(this, args);
                };
                return str_replace.call(this, searchValue, wrappedReplaceValue);
            }
        };
    }

    // ECMA-262, 3rd B.2.3
    // Not an ECMAScript standard, although ECMAScript 3rd Edition has a
    // non-normative section suggesting uniform semantics and it should be
    // normalized across all browsers
    // [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
    var string_substr = StringPrototype.substr;
    var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
    defineProperties(StringPrototype, {
        substr: function substr(start, length) {
            var normalizedStart = start;
            if (start < 0) {
                normalizedStart = max(this.length + start, 0);
            }
            return string_substr.call(this, normalizedStart, length);
        }
    }, hasNegativeSubstrBug);

    // ES5 15.5.4.20
    // whitespace from: http://es5.github.io/#x15.5.4.20
    var ws = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003'
        + '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028'
        + '\u2029\uFEFF';
    var zeroWidth = '\u200b';
    var wsRegexChars = '[' + ws + ']';
    var trimBeginRegexp = new RegExp('^' + wsRegexChars + wsRegexChars + '*');
    var trimEndRegexp = new RegExp(wsRegexChars + wsRegexChars + '*$');
    var hasTrimWhitespaceBug = StringPrototype.trim && (ws.trim() || !zeroWidth.trim());
    defineProperties(StringPrototype, {
        // http://blog.stevenlevithan.com/archives/faster-trim-javascript
        // http://perfectionkills.com/whitespace-deviations/
        trim: function trim() {
            if (typeof this === 'undefined' || this === null) {
                throw new TypeError("can't convert " + this + ' to object');
            }
            return $String(this).replace(trimBeginRegexp, '').replace(trimEndRegexp, '');
        }
    }, hasTrimWhitespaceBug);
    var trim = call.bind(String.prototype.trim);

    var hasLastIndexBug = StringPrototype.lastIndexOf && 'abcあい'.lastIndexOf('あい', 2) !== -1;
    defineProperties(StringPrototype, {
        lastIndexOf: function lastIndexOf(searchString) {
            if (typeof this === 'undefined' || this === null) {
                throw new TypeError("can't convert " + this + ' to object');
            }
            var S = $String(this);
            var searchStr = $String(searchString);
            var numPos = arguments.length > 1 ? $Number(arguments[1]) : NaN;
            var pos = isActualNaN(numPos) ? Infinity : ES.ToInteger(numPos);
            var start = min(max(pos, 0), S.length);
            var searchLen = searchStr.length;
            var k = start + searchLen;
            while (k > 0) {
                k = max(0, k - searchLen);
                var index = strIndexOf(strSlice(S, k, start + searchLen), searchStr);
                if (index !== -1) {
                    return k + index;
                }
            }
            return -1;
        }
    }, hasLastIndexBug);

    var originalLastIndexOf = StringPrototype.lastIndexOf;
    defineProperties(StringPrototype, {
        lastIndexOf: function lastIndexOf(searchString) {
            return originalLastIndexOf.apply(this, arguments);
        }
    }, StringPrototype.lastIndexOf.length !== 1);

    // ES-5 15.1.2.2
    // eslint-disable-next-line radix
    if (parseInt(ws + '08') !== 8 || parseInt(ws + '0x16') !== 22) {
        /* global parseInt: true */
        parseInt = (function (origParseInt) {
            var hexRegex = /^[-+]?0[xX]/;
            return function parseInt(str, radix) {
                if (typeof str === 'symbol') {
                    // handle Symbols in node 8.3/8.4
                    // eslint-disable-next-line no-implicit-coercion, no-unused-expressions
                    '' + str; // jscs:ignore disallowImplicitTypeConversion
                }

                var string = trim(String(str));
                var defaultedRadix = $Number(radix) || (hexRegex.test(string) ? 16 : 10);
                return origParseInt(string, defaultedRadix);
            };
        }(parseInt));
    }

    // https://es5.github.io/#x15.1.2.3
    if (1 / parseFloat('-0') !== -Infinity) {
        /* global parseFloat: true */
        parseFloat = (function (origParseFloat) {
            return function parseFloat(string) {
                var inputString = trim(String(string));
                var result = origParseFloat(inputString);
                return result === 0 && strSlice(inputString, 0, 1) === '-' ? -0 : result;
            };
        }(parseFloat));
    }

    if (String(new RangeError('test')) !== 'RangeError: test') {
        var errorToStringShim = function toString() {
            if (typeof this === 'undefined' || this === null) {
                throw new TypeError("can't convert " + this + ' to object');
            }
            var name = this.name;
            if (typeof name === 'undefined') {
                name = 'Error';
            } else if (typeof name !== 'string') {
                name = $String(name);
            }
            var msg = this.message;
            if (typeof msg === 'undefined') {
                msg = '';
            } else if (typeof msg !== 'string') {
                msg = $String(msg);
            }
            if (!name) {
                return msg;
            }
            if (!msg) {
                return name;
            }
            return name + ': ' + msg;
        };
        // can't use defineProperties here because of toString enumeration issue in IE <= 8
        Error.prototype.toString = errorToStringShim;
    }

    if (supportsDescriptors) {
        var ensureNonEnumerable = function (obj, prop) {
            if (isEnum(obj, prop)) {
                var desc = Object.getOwnPropertyDescriptor(obj, prop);
                if (desc.configurable) {
                    desc.enumerable = false;
                    Object.defineProperty(obj, prop, desc);
                }
            }
        };
        ensureNonEnumerable(Error.prototype, 'message');
        if (Error.prototype.message !== '') {
            Error.prototype.message = '';
        }
        ensureNonEnumerable(Error.prototype, 'name');
    }

    if (String(/a/mig) !== '/a/gim') {
        var regexToString = function toString() {
            var str = '/' + this.source + '/';
            if (this.global) {
                str += 'g';
            }
            if (this.ignoreCase) {
                str += 'i';
            }
            if (this.multiline) {
                str += 'm';
            }
            return str;
        };
        // can't use defineProperties here because of toString enumeration issue in IE <= 8
        RegExp.prototype.toString = regexToString;
    }
}));

/*!
 * https://github.com/es-shims/es5-shim
 * @license es5-shim Copyright 2009-2015 by contributors, MIT License
 * see https://github.com/es-shims/es5-shim/blob/master/LICENSE
 */

// vim: ts=4 sts=4 sw=4 expandtab

// Add semicolon to prevent IIFE from being passed as argument to concatenated code.
;

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
    'use strict';

    /* global define, exports, module */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {

    var call = Function.call;
    var prototypeOfObject = Object.prototype;
    var owns = call.bind(prototypeOfObject.hasOwnProperty);
    var isEnumerable = call.bind(prototypeOfObject.propertyIsEnumerable);
    var toStr = call.bind(prototypeOfObject.toString);

    // If JS engine supports accessors creating shortcuts.
    var defineGetter;
    var defineSetter;
    var lookupGetter;
    var lookupSetter;
    var supportsAccessors = owns(prototypeOfObject, '__defineGetter__');
    if (supportsAccessors) {
        /* eslint-disable no-underscore-dangle, no-restricted-properties */
        defineGetter = call.bind(prototypeOfObject.__defineGetter__);
        defineSetter = call.bind(prototypeOfObject.__defineSetter__);
        lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
        lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
        /* eslint-enable no-underscore-dangle, no-restricted-properties */
    }

    var isPrimitive = function isPrimitive(o) {
        return o == null || (typeof o !== 'object' && typeof o !== 'function');
    };

    // ES5 15.2.3.2
    // http://es5.github.com/#x15.2.3.2
    if (!Object.getPrototypeOf) {
        // https://github.com/es-shims/es5-shim/issues#issue/2
        // http://ejohn.org/blog/objectgetprototypeof/
        // recommended by fschaefer on github
        //
        // sure, and webreflection says ^_^
        // ... this will nerever possibly return null
        // ... Opera Mini breaks here with infinite loops
        Object.getPrototypeOf = function getPrototypeOf(object) {
            // eslint-disable-next-line no-proto
            var proto = object.__proto__;
            if (proto || proto === null) {
                return proto;
            } else if (toStr(object.constructor) === '[object Function]') {
                return object.constructor.prototype;
            } else if (object instanceof Object) {
                return prototypeOfObject;
            } else {
                // Correctly return null for Objects created with `Object.create(null)`
                // (shammed or native) or `{ __proto__: null}`.  Also returns null for
                // cross-realm objects on browsers that lack `__proto__` support (like
                // IE <11), but that's the best we can do.
                return null;
            }
        };
    }

    // ES5 15.2.3.3
    // http://es5.github.com/#x15.2.3.3

    var doesGetOwnPropertyDescriptorWork = function doesGetOwnPropertyDescriptorWork(object) {
        try {
            object.sentinel = 0;
            return Object.getOwnPropertyDescriptor(object, 'sentinel').value === 0;
        } catch (exception) {
            return false;
        }
    };

    // check whether getOwnPropertyDescriptor works if it's given. Otherwise, shim partially.
    if (Object.defineProperty) {
        var getOwnPropertyDescriptorWorksOnObject = doesGetOwnPropertyDescriptorWork({});
        var getOwnPropertyDescriptorWorksOnDom = typeof document === 'undefined'
            || doesGetOwnPropertyDescriptorWork(document.createElement('div'));
        if (!getOwnPropertyDescriptorWorksOnDom || !getOwnPropertyDescriptorWorksOnObject) {
            var getOwnPropertyDescriptorFallback = Object.getOwnPropertyDescriptor;
        }
    }

    if (!Object.getOwnPropertyDescriptor || getOwnPropertyDescriptorFallback) {
        var ERR_NON_OBJECT = 'Object.getOwnPropertyDescriptor called on a non-object: ';

        /* eslint-disable no-proto */
        Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
            if (isPrimitive(object)) {
                throw new TypeError(ERR_NON_OBJECT + object);
            }

            // make a valiant attempt to use the real getOwnPropertyDescriptor
            // for I8's DOM elements.
            if (getOwnPropertyDescriptorFallback) {
                try {
                    return getOwnPropertyDescriptorFallback.call(Object, object, property);
                } catch (exception) {
                    // try the shim if the real one doesn't work
                }
            }

            var descriptor;

            // If object does not owns property return undefined immediately.
            if (!owns(object, property)) {
                return descriptor;
            }

            // If object has a property then it's for sure `configurable`, and
            // probably `enumerable`. Detect enumerability though.
            descriptor = {
                enumerable: isEnumerable(object, property),
                configurable: true
            };

            // If JS engine supports accessor properties then property may be a
            // getter or setter.
            if (supportsAccessors) {
                // Unfortunately `__lookupGetter__` will return a getter even
                // if object has own non getter property along with a same named
                // inherited getter. To avoid misbehavior we temporary remove
                // `__proto__` so that `__lookupGetter__` will return getter only
                // if it's owned by an object.
                var prototype = object.__proto__;
                var notPrototypeOfObject = object !== prototypeOfObject;
                // avoid recursion problem, breaking in Opera Mini when
                // Object.getOwnPropertyDescriptor(Object.prototype, 'toString')
                // or any other Object.prototype accessor
                if (notPrototypeOfObject) {
                    object.__proto__ = prototypeOfObject;
                }

                var getter = lookupGetter(object, property);
                var setter = lookupSetter(object, property);

                if (notPrototypeOfObject) {
                    // Once we have getter and setter we can put values back.
                    object.__proto__ = prototype;
                }

                if (getter || setter) {
                    if (getter) {
                        descriptor.get = getter;
                    }
                    if (setter) {
                        descriptor.set = setter;
                    }
                    // If it was accessor property we're done and return here
                    // in order to avoid adding `value` to the descriptor.
                    return descriptor;
                }
            }

            // If we got this far we know that object has an own property that is
            // not an accessor so we set it as a value and return descriptor.
            descriptor.value = object[property];
            descriptor.writable = true;
            return descriptor;
        };
        /* eslint-enable no-proto */
    }

    // ES5 15.2.3.4
    // http://es5.github.com/#x15.2.3.4
    if (!Object.getOwnPropertyNames) {
        Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
            return Object.keys(object);
        };
    }

    // ES5 15.2.3.5
    // http://es5.github.com/#x15.2.3.5
    if (!Object.create) {

        // Contributed by Brandon Benvie, October, 2012
        var createEmpty;
        var supportsProto = !({ __proto__: null } instanceof Object);
        // the following produces false positives
        // in Opera Mini => not a reliable check
        // Object.prototype.__proto__ === null

        // Check for document.domain and active x support
        // No need to use active x approach when document.domain is not set
        // see https://github.com/es-shims/es5-shim/issues/150
        // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
        /* global ActiveXObject */
        var shouldUseActiveX = function shouldUseActiveX() {
            // return early if document.domain not set
            if (!document.domain) {
                return false;
            }

            try {
                return !!new ActiveXObject('htmlfile');
            } catch (exception) {
                return false;
            }
        };

        // This supports IE8 when document.domain is used
        // see https://github.com/es-shims/es5-shim/issues/150
        // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
        var getEmptyViaActiveX = function getEmptyViaActiveX() {
            var empty;
            var xDoc;

            xDoc = new ActiveXObject('htmlfile');

            var script = 'script';
            xDoc.write('<' + script + '></' + script + '>');
            xDoc.close();

            empty = xDoc.parentWindow.Object.prototype;
            xDoc = null;

            return empty;
        };

        // The original implementation using an iframe
        // before the activex approach was added
        // see https://github.com/es-shims/es5-shim/issues/150
        var getEmptyViaIFrame = function getEmptyViaIFrame() {
            var iframe = document.createElement('iframe');
            var parent = document.body || document.documentElement;
            var empty;

            iframe.style.display = 'none';
            parent.appendChild(iframe);
            // eslint-disable-next-line no-script-url
            iframe.src = 'javascript:';

            empty = iframe.contentWindow.Object.prototype;
            parent.removeChild(iframe);
            iframe = null;

            return empty;
        };

        /* global document */
        if (supportsProto || typeof document === 'undefined') {
            createEmpty = function () {
                return { __proto__: null };
            };
        } else {
            // In old IE __proto__ can't be used to manually set `null`, nor does
            // any other method exist to make an object that inherits from nothing,
            // aside from Object.prototype itself. Instead, create a new global
            // object and *steal* its Object.prototype and strip it bare. This is
            // used as the prototype to create nullary objects.
            createEmpty = function () {
                // Determine which approach to use
                // see https://github.com/es-shims/es5-shim/issues/150
                var empty = shouldUseActiveX() ? getEmptyViaActiveX() : getEmptyViaIFrame();

                delete empty.constructor;
                delete empty.hasOwnProperty;
                delete empty.propertyIsEnumerable;
                delete empty.isPrototypeOf;
                delete empty.toLocaleString;
                delete empty.toString;
                delete empty.valueOf;

                var Empty = function Empty() {};
                Empty.prototype = empty;
                // short-circuit future calls
                createEmpty = function () {
                    return new Empty();
                };
                return new Empty();
            };
        }

        Object.create = function create(prototype, properties) {

            var object;
            var Type = function Type() {}; // An empty constructor.

            if (prototype === null) {
                object = createEmpty();
            } else {
                if (prototype !== null && isPrimitive(prototype)) {
                    // In the native implementation `parent` can be `null`
                    // OR *any* `instanceof Object`  (Object|Function|Array|RegExp|etc)
                    // Use `typeof` tho, b/c in old IE, DOM elements are not `instanceof Object`
                    // like they are in modern browsers. Using `Object.create` on DOM elements
                    // is...err...probably inappropriate, but the native version allows for it.
                    throw new TypeError('Object prototype may only be an Object or null'); // same msg as Chrome
                }
                Type.prototype = prototype;
                object = new Type();
                // IE has no built-in implementation of `Object.getPrototypeOf`
                // neither `__proto__`, but this manually setting `__proto__` will
                // guarantee that `Object.getPrototypeOf` will work as expected with
                // objects created using `Object.create`
                // eslint-disable-next-line no-proto
                object.__proto__ = prototype;
            }

            if (properties !== void 0) {
                Object.defineProperties(object, properties);
            }

            return object;
        };
    }

    // ES5 15.2.3.6
    // http://es5.github.com/#x15.2.3.6

    // Patch for WebKit and IE8 standard mode
    // Designed by hax <hax.github.com>
    // related issue: https://github.com/es-shims/es5-shim/issues#issue/5
    // IE8 Reference:
    //     http://msdn.microsoft.com/en-us/library/dd282900.aspx
    //     http://msdn.microsoft.com/en-us/library/dd229916.aspx
    // WebKit Bugs:
    //     https://bugs.webkit.org/show_bug.cgi?id=36423

    var doesDefinePropertyWork = function doesDefinePropertyWork(object) {
        try {
            Object.defineProperty(object, 'sentinel', {});
            return 'sentinel' in object;
        } catch (exception) {
            return false;
        }
    };

    // check whether defineProperty works if it's given. Otherwise,
    // shim partially.
    if (Object.defineProperty) {
        var definePropertyWorksOnObject = doesDefinePropertyWork({});
        var definePropertyWorksOnDom = typeof document === 'undefined'
            || doesDefinePropertyWork(document.createElement('div'));
        if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
            var definePropertyFallback = Object.defineProperty,
                definePropertiesFallback = Object.defineProperties;
        }
    }

    if (!Object.defineProperty || definePropertyFallback) {
        var ERR_NON_OBJECT_DESCRIPTOR = 'Property description must be an object: ';
        var ERR_NON_OBJECT_TARGET = 'Object.defineProperty called on non-object: ';
        var ERR_ACCESSORS_NOT_SUPPORTED = 'getters & setters can not be defined on this javascript engine';

        Object.defineProperty = function defineProperty(object, property, descriptor) {
            if (isPrimitive(object)) {
                throw new TypeError(ERR_NON_OBJECT_TARGET + object);
            }
            if (isPrimitive(descriptor)) {
                throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
            }
            // make a valiant attempt to use the real defineProperty
            // for I8's DOM elements.
            if (definePropertyFallback) {
                try {
                    return definePropertyFallback.call(Object, object, property, descriptor);
                } catch (exception) {
                    // try the shim if the real one doesn't work
                }
            }

            // If it's a data property.
            if ('value' in descriptor) {
                // fail silently if 'writable', 'enumerable', or 'configurable'
                // are requested but not supported
                /*
                // alternate approach:
                if ( // can't implement these features; allow false but not true
                    ('writable' in descriptor && !descriptor.writable) ||
                    ('enumerable' in descriptor && !descriptor.enumerable) ||
                    ('configurable' in descriptor && !descriptor.configurable)
                ))
                    throw new RangeError(
                        'This implementation of Object.defineProperty does not support configurable, enumerable, or writable.'
                    );
                */

                if (supportsAccessors && (lookupGetter(object, property) || lookupSetter(object, property))) {
                    // As accessors are supported only on engines implementing
                    // `__proto__` we can safely override `__proto__` while defining
                    // a property to make sure that we don't hit an inherited
                    // accessor.
                    /* eslint-disable no-proto */
                    var prototype = object.__proto__;
                    object.__proto__ = prototypeOfObject;
                    // Deleting a property anyway since getter / setter may be
                    // defined on object itself.
                    delete object[property];
                    object[property] = descriptor.value;
                    // Setting original `__proto__` back now.
                    object.__proto__ = prototype;
                    /* eslint-enable no-proto */
                } else {
                    object[property] = descriptor.value;
                }
            } else {
                var hasGetter = 'get' in descriptor;
                var hasSetter = 'set' in descriptor;
                if (!supportsAccessors && (hasGetter || hasSetter)) {
                    throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
                }
                // If we got that far then getters and setters can be defined !!
                if (hasGetter) {
                    defineGetter(object, property, descriptor.get);
                }
                if (hasSetter) {
                    defineSetter(object, property, descriptor.set);
                }
            }
            return object;
        };
    }

    // ES5 15.2.3.7
    // http://es5.github.com/#x15.2.3.7
    if (!Object.defineProperties || definePropertiesFallback) {
        Object.defineProperties = function defineProperties(object, properties) {
            // make a valiant attempt to use the real defineProperties
            if (definePropertiesFallback) {
                try {
                    return definePropertiesFallback.call(Object, object, properties);
                } catch (exception) {
                    // try the shim if the real one doesn't work
                }
            }

            Object.keys(properties).forEach(function (property) {
                if (property !== '__proto__') {
                    Object.defineProperty(object, property, properties[property]);
                }
            });
            return object;
        };
    }

    // ES5 15.2.3.8
    // http://es5.github.com/#x15.2.3.8
    if (!Object.seal) {
        Object.seal = function seal(object) {
            if (Object(object) !== object) {
                throw new TypeError('Object.seal can only be called on Objects.');
            }
            // this is misleading and breaks feature-detection, but
            // allows "securable" code to "gracefully" degrade to working
            // but insecure code.
            return object;
        };
    }

    // ES5 15.2.3.9
    // http://es5.github.com/#x15.2.3.9
    if (!Object.freeze) {
        Object.freeze = function freeze(object) {
            if (Object(object) !== object) {
                throw new TypeError('Object.freeze can only be called on Objects.');
            }
            // this is misleading and breaks feature-detection, but
            // allows "securable" code to "gracefully" degrade to working
            // but insecure code.
            return object;
        };
    }

    // detect a Rhino bug and patch it
    try {
        Object.freeze(function () {});
    } catch (exception) {
        Object.freeze = (function (freezeObject) {
            return function freeze(object) {
                if (typeof object === 'function') {
                    return object;
                } else {
                    return freezeObject(object);
                }
            };
        }(Object.freeze));
    }

    // ES5 15.2.3.10
    // http://es5.github.com/#x15.2.3.10
    if (!Object.preventExtensions) {
        Object.preventExtensions = function preventExtensions(object) {
            if (Object(object) !== object) {
                throw new TypeError('Object.preventExtensions can only be called on Objects.');
            }
            // this is misleading and breaks feature-detection, but
            // allows "securable" code to "gracefully" degrade to working
            // but insecure code.
            return object;
        };
    }

    // ES5 15.2.3.11
    // http://es5.github.com/#x15.2.3.11
    if (!Object.isSealed) {
        Object.isSealed = function isSealed(object) {
            if (Object(object) !== object) {
                throw new TypeError('Object.isSealed can only be called on Objects.');
            }
            return false;
        };
    }

    // ES5 15.2.3.12
    // http://es5.github.com/#x15.2.3.12
    if (!Object.isFrozen) {
        Object.isFrozen = function isFrozen(object) {
            if (Object(object) !== object) {
                throw new TypeError('Object.isFrozen can only be called on Objects.');
            }
            return false;
        };
    }

    // ES5 15.2.3.13
    // http://es5.github.com/#x15.2.3.13
    if (!Object.isExtensible) {
        Object.isExtensible = function isExtensible(object) {
            // 1. If Type(O) is not Object throw a TypeError exception.
            if (Object(object) !== object) {
                throw new TypeError('Object.isExtensible can only be called on Objects.');
            }
            // 2. Return the Boolean value of the [[Extensible]] internal property of O.
            var name = '';
            while (owns(object, name)) {
                name += '?';
            }
            object[name] = true;
            var returnValue = owns(object, name);
            delete object[name];
            return returnValue;
        };
    }

}));

 /*!
  * https://github.com/paulmillr/es6-shim
  * @license es6-shim Copyright 2013-2016 by Paul Miller (http://paulmillr.com)
  *   and contributors,  MIT License
  * es6-shim: v0.35.1
  * see https://github.com/paulmillr/es6-shim/blob/0.35.1/LICENSE
  * Details and documentation:
  * https://github.com/paulmillr/es6-shim/
  */

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
  /*global define, module, exports */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.returnExports = factory();
  }
}(this, function () {
  'use strict';

  var _apply = Function.call.bind(Function.apply);
  var _call = Function.call.bind(Function.call);
  var isArray = Array.isArray;
  var keys = Object.keys;

  var not = function notThunker(func) {
    return function notThunk() {
      return !_apply(func, this, arguments);
    };
  };
  var throwsError = function (func) {
    try {
      func();
      return false;
    } catch (e) {
      return true;
    }
  };
  var valueOrFalseIfThrows = function valueOrFalseIfThrows(func) {
    try {
      return func();
    } catch (e) {
      return false;
    }
  };

  var isCallableWithoutNew = not(throwsError);
  var arePropertyDescriptorsSupported = function () {
    // if Object.defineProperty exists but throws, it's IE 8
    return !throwsError(function () {
      Object.defineProperty({}, 'x', { get: function () {} });
    });
  };
  var supportsDescriptors = !!Object.defineProperty && arePropertyDescriptorsSupported();
  var functionsHaveNames = (function foo() {}).name === 'foo'; // eslint-disable-line no-extra-parens

  var _forEach = Function.call.bind(Array.prototype.forEach);
  var _reduce = Function.call.bind(Array.prototype.reduce);
  var _filter = Function.call.bind(Array.prototype.filter);
  var _some = Function.call.bind(Array.prototype.some);

  var defineProperty = function (object, name, value, force) {
    if (!force && name in object) { return; }
    if (supportsDescriptors) {
      Object.defineProperty(object, name, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: value
      });
    } else {
      object[name] = value;
    }
  };

  // Define configurable, writable and non-enumerable props
  // if they don’t exist.
  var defineProperties = function (object, map, forceOverride) {
    _forEach(keys(map), function (name) {
      var method = map[name];
      defineProperty(object, name, method, !!forceOverride);
    });
  };

  var _toString = Function.call.bind(Object.prototype.toString);
  var isCallable = typeof /abc/ === 'function' ? function IsCallableSlow(x) {
    // Some old browsers (IE, FF) say that typeof /abc/ === 'function'
    return typeof x === 'function' && _toString(x) === '[object Function]';
  } : function IsCallableFast(x) { return typeof x === 'function'; };

  var Value = {
    getter: function (object, name, getter) {
      if (!supportsDescriptors) {
        throw new TypeError('getters require true ES5 support');
      }
      Object.defineProperty(object, name, {
        configurable: true,
        enumerable: false,
        get: getter
      });
    },
    proxy: function (originalObject, key, targetObject) {
      if (!supportsDescriptors) {
        throw new TypeError('getters require true ES5 support');
      }
      var originalDescriptor = Object.getOwnPropertyDescriptor(originalObject, key);
      Object.defineProperty(targetObject, key, {
        configurable: originalDescriptor.configurable,
        enumerable: originalDescriptor.enumerable,
        get: function getKey() { return originalObject[key]; },
        set: function setKey(value) { originalObject[key] = value; }
      });
    },
    redefine: function (object, property, newValue) {
      if (supportsDescriptors) {
        var descriptor = Object.getOwnPropertyDescriptor(object, property);
        descriptor.value = newValue;
        Object.defineProperty(object, property, descriptor);
      } else {
        object[property] = newValue;
      }
    },
    defineByDescriptor: function (object, property, descriptor) {
      if (supportsDescriptors) {
        Object.defineProperty(object, property, descriptor);
      } else if ('value' in descriptor) {
        object[property] = descriptor.value;
      }
    },
    preserveToString: function (target, source) {
      if (source && isCallable(source.toString)) {
        defineProperty(target, 'toString', source.toString.bind(source), true);
      }
    }
  };

  // Simple shim for Object.create on ES3 browsers
  // (unlike real shim, no attempt to support `prototype === null`)
  var create = Object.create || function (prototype, properties) {
    var Prototype = function Prototype() {};
    Prototype.prototype = prototype;
    var object = new Prototype();
    if (typeof properties !== 'undefined') {
      keys(properties).forEach(function (key) {
        Value.defineByDescriptor(object, key, properties[key]);
      });
    }
    return object;
  };

  var supportsSubclassing = function (C, f) {
    if (!Object.setPrototypeOf) { return false; /* skip test on IE < 11 */ }
    return valueOrFalseIfThrows(function () {
      var Sub = function Subclass(arg) {
        var o = new C(arg);
        Object.setPrototypeOf(o, Subclass.prototype);
        return o;
      };
      Object.setPrototypeOf(Sub, C);
      Sub.prototype = create(C.prototype, {
        constructor: { value: Sub }
      });
      return f(Sub);
    });
  };

  var getGlobal = function () {
    /* global self, window, global */
    // the only reliable means to get the global object is
    // `Function('return this')()`
    // However, this causes CSP violations in Chrome apps.
    if (typeof self !== 'undefined') { return self; }
    if (typeof window !== 'undefined') { return window; }
    if (typeof global !== 'undefined') { return global; }
    throw new Error('unable to locate global object');
  };

  var globals = getGlobal();
  var globalIsFinite = globals.isFinite;
  var _indexOf = Function.call.bind(String.prototype.indexOf);
  var _arrayIndexOfApply = Function.apply.bind(Array.prototype.indexOf);
  var _concat = Function.call.bind(Array.prototype.concat);
  // var _sort = Function.call.bind(Array.prototype.sort);
  var _strSlice = Function.call.bind(String.prototype.slice);
  var _push = Function.call.bind(Array.prototype.push);
  var _pushApply = Function.apply.bind(Array.prototype.push);
  var _shift = Function.call.bind(Array.prototype.shift);
  var _max = Math.max;
  var _min = Math.min;
  var _floor = Math.floor;
  var _abs = Math.abs;
  var _exp = Math.exp;
  var _log = Math.log;
  var _sqrt = Math.sqrt;
  var _hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
  var ArrayIterator; // make our implementation private
  var noop = function () {};

  var OrigMap = globals.Map;
  var origMapDelete = OrigMap && OrigMap.prototype['delete'];
  var origMapGet = OrigMap && OrigMap.prototype.get;
  var origMapHas = OrigMap && OrigMap.prototype.has;
  var origMapSet = OrigMap && OrigMap.prototype.set;

  var Symbol = globals.Symbol || {};
  var symbolSpecies = Symbol.species || '@@species';

  var numberIsNaN = Number.isNaN || function isNaN(value) {
    // NaN !== NaN, but they are identical.
    // NaNs are the only non-reflexive value, i.e., if x !== x,
    // then x is NaN.
    // isNaN is broken: it converts its argument to number, so
    // isNaN('foo') => true
    return value !== value;
  };
  var numberIsFinite = Number.isFinite || function isFinite(value) {
    return typeof value === 'number' && globalIsFinite(value);
  };
  var _sign = isCallable(Math.sign) ? Math.sign : function sign(value) {
    var number = Number(value);
    if (number === 0) { return number; }
    if (numberIsNaN(number)) { return number; }
    return number < 0 ? -1 : 1;
  };

  // taken directly from https://github.com/ljharb/is-arguments/blob/master/index.js
  // can be replaced with require('is-arguments') if we ever use a build process instead
  var isStandardArguments = function isArguments(value) {
    return _toString(value) === '[object Arguments]';
  };
  var isLegacyArguments = function isArguments(value) {
    return value !== null &&
      typeof value === 'object' &&
      typeof value.length === 'number' &&
      value.length >= 0 &&
      _toString(value) !== '[object Array]' &&
      _toString(value.callee) === '[object Function]';
  };
  var isArguments = isStandardArguments(arguments) ? isStandardArguments : isLegacyArguments;

  var Type = {
    primitive: function (x) { return x === null || (typeof x !== 'function' && typeof x !== 'object'); },
    string: function (x) { return _toString(x) === '[object String]'; },
    regex: function (x) { return _toString(x) === '[object RegExp]'; },
    symbol: function (x) {
      return typeof globals.Symbol === 'function' && typeof x === 'symbol';
    }
  };

  var overrideNative = function overrideNative(object, property, replacement) {
    var original = object[property];
    defineProperty(object, property, replacement, true);
    Value.preserveToString(object[property], original);
  };

  // eslint-disable-next-line no-restricted-properties
  var hasSymbols = typeof Symbol === 'function' && typeof Symbol['for'] === 'function' && Type.symbol(Symbol());

  // This is a private name in the es6 spec, equal to '[Symbol.iterator]'
  // we're going to use an arbitrary _-prefixed name to make our shims
  // work properly with each other, even though we don't have full Iterator
  // support.  That is, `Array.from(map.keys())` will work, but we don't
  // pretend to export a "real" Iterator interface.
  var $iterator$ = Type.symbol(Symbol.iterator) ? Symbol.iterator : '_es6-shim iterator_';
  // Firefox ships a partial implementation using the name @@iterator.
  // https://bugzilla.mozilla.org/show_bug.cgi?id=907077#c14
  // So use that name if we detect it.
  if (globals.Set && typeof new globals.Set()['@@iterator'] === 'function') {
    $iterator$ = '@@iterator';
  }

  // Reflect
  if (!globals.Reflect) {
    defineProperty(globals, 'Reflect', {}, true);
  }
  var Reflect = globals.Reflect;

  var $String = String;

  /* global document */
  var domAll = (typeof document === 'undefined' || !document) ? null : document.all;
  /* jshint eqnull:true */
  var isNullOrUndefined = domAll == null ? function isNullOrUndefined(x) {
    /* jshint eqnull:true */
    return x == null;
  } : function isNullOrUndefinedAndNotDocumentAll(x) {
    /* jshint eqnull:true */
    return x == null && x !== domAll;
  };

  var ES = {
    // http://www.ecma-international.org/ecma-262/6.0/#sec-call
    Call: function Call(F, V) {
      var args = arguments.length > 2 ? arguments[2] : [];
      if (!ES.IsCallable(F)) {
        throw new TypeError(F + ' is not a function');
      }
      return _apply(F, V, args);
    },

    RequireObjectCoercible: function (x, optMessage) {
      if (isNullOrUndefined(x)) {
        throw new TypeError(optMessage || 'Cannot call method on ' + x);
      }
      return x;
    },

    // This might miss the "(non-standard exotic and does not implement
    // [[Call]])" case from
    // http://www.ecma-international.org/ecma-262/6.0/#sec-typeof-operator-runtime-semantics-evaluation
    // but we can't find any evidence these objects exist in practice.
    // If we find some in the future, you could test `Object(x) === x`,
    // which is reliable according to
    // http://www.ecma-international.org/ecma-262/6.0/#sec-toobject
    // but is not well optimized by runtimes and creates an object
    // whenever it returns false, and thus is very slow.
    TypeIsObject: function (x) {
      if (x === void 0 || x === null || x === true || x === false) {
        return false;
      }
      return typeof x === 'function' || typeof x === 'object' || x === domAll;
    },

    ToObject: function (o, optMessage) {
      return Object(ES.RequireObjectCoercible(o, optMessage));
    },

    IsCallable: isCallable,

    IsConstructor: function (x) {
      // We can't tell callables from constructors in ES5
      return ES.IsCallable(x);
    },

    ToInt32: function (x) {
      return ES.ToNumber(x) >> 0;
    },

    ToUint32: function (x) {
      return ES.ToNumber(x) >>> 0;
    },

    ToNumber: function (value) {
      if (_toString(value) === '[object Symbol]') {
        throw new TypeError('Cannot convert a Symbol value to a number');
      }
      return +value;
    },

    ToInteger: function (value) {
      var number = ES.ToNumber(value);
      if (numberIsNaN(number)) { return 0; }
      if (number === 0 || !numberIsFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * _floor(_abs(number));
    },

    ToLength: function (value) {
      var len = ES.ToInteger(value);
      if (len <= 0) { return 0; } // includes converting -0 to +0
      if (len > Number.MAX_SAFE_INTEGER) { return Number.MAX_SAFE_INTEGER; }
      return len;
    },

    SameValue: function (a, b) {
      if (a === b) {
        // 0 === -0, but they are not identical.
        if (a === 0) { return 1 / a === 1 / b; }
        return true;
      }
      return numberIsNaN(a) && numberIsNaN(b);
    },

    SameValueZero: function (a, b) {
      // same as SameValue except for SameValueZero(+0, -0) == true
      return (a === b) || (numberIsNaN(a) && numberIsNaN(b));
    },

    IsIterable: function (o) {
      return ES.TypeIsObject(o) && (typeof o[$iterator$] !== 'undefined' || isArguments(o));
    },

    GetIterator: function (o) {
      if (isArguments(o)) {
        // special case support for `arguments`
        return new ArrayIterator(o, 'value');
      }
      var itFn = ES.GetMethod(o, $iterator$);
      if (!ES.IsCallable(itFn)) {
        // Better diagnostics if itFn is null or undefined
        throw new TypeError('value is not an iterable');
      }
      var it = ES.Call(itFn, o);
      if (!ES.TypeIsObject(it)) {
        throw new TypeError('bad iterator');
      }
      return it;
    },

    GetMethod: function (o, p) {
      var func = ES.ToObject(o)[p];
      if (isNullOrUndefined(func)) {
        return void 0;
      }
      if (!ES.IsCallable(func)) {
        throw new TypeError('Method not callable: ' + p);
      }
      return func;
    },

    IteratorComplete: function (iterResult) {
      return !!iterResult.done;
    },

    IteratorClose: function (iterator, completionIsThrow) {
      var returnMethod = ES.GetMethod(iterator, 'return');
      if (returnMethod === void 0) {
        return;
      }
      var innerResult, innerException;
      try {
        innerResult = ES.Call(returnMethod, iterator);
      } catch (e) {
        innerException = e;
      }
      if (completionIsThrow) {
        return;
      }
      if (innerException) {
        throw innerException;
      }
      if (!ES.TypeIsObject(innerResult)) {
        throw new TypeError("Iterator's return method returned a non-object.");
      }
    },

    IteratorNext: function (it) {
      var result = arguments.length > 1 ? it.next(arguments[1]) : it.next();
      if (!ES.TypeIsObject(result)) {
        throw new TypeError('bad iterator');
      }
      return result;
    },

    IteratorStep: function (it) {
      var result = ES.IteratorNext(it);
      var done = ES.IteratorComplete(result);
      return done ? false : result;
    },

    Construct: function (C, args, newTarget, isES6internal) {
      var target = typeof newTarget === 'undefined' ? C : newTarget;

      if (!isES6internal && Reflect.construct) {
        // Try to use Reflect.construct if available
        return Reflect.construct(C, args, target);
      }
      // OK, we have to fake it.  This will only work if the
      // C.[[ConstructorKind]] == "base" -- but that's the only
      // kind we can make in ES5 code anyway.

      // OrdinaryCreateFromConstructor(target, "%ObjectPrototype%")
      var proto = target.prototype;
      if (!ES.TypeIsObject(proto)) {
        proto = Object.prototype;
      }
      var obj = create(proto);
      // Call the constructor.
      var result = ES.Call(C, obj, args);
      return ES.TypeIsObject(result) ? result : obj;
    },

    SpeciesConstructor: function (O, defaultConstructor) {
      var C = O.constructor;
      if (C === void 0) {
        return defaultConstructor;
      }
      if (!ES.TypeIsObject(C)) {
        throw new TypeError('Bad constructor');
      }
      var S = C[symbolSpecies];
      if (isNullOrUndefined(S)) {
        return defaultConstructor;
      }
      if (!ES.IsConstructor(S)) {
        throw new TypeError('Bad @@species');
      }
      return S;
    },

    CreateHTML: function (string, tag, attribute, value) {
      var S = ES.ToString(string);
      var p1 = '<' + tag;
      if (attribute !== '') {
        var V = ES.ToString(value);
        var escapedV = V.replace(/"/g, '&quot;');
        p1 += ' ' + attribute + '="' + escapedV + '"';
      }
      var p2 = p1 + '>';
      var p3 = p2 + S;
      return p3 + '</' + tag + '>';
    },

    IsRegExp: function IsRegExp(argument) {
      if (!ES.TypeIsObject(argument)) {
        return false;
      }
      var isRegExp = argument[Symbol.match];
      if (typeof isRegExp !== 'undefined') {
        return !!isRegExp;
      }
      return Type.regex(argument);
    },

    ToString: function ToString(string) {
      return $String(string);
    }
  };

  // Well-known Symbol shims
  if (supportsDescriptors && hasSymbols) {
    var defineWellKnownSymbol = function defineWellKnownSymbol(name) {
      if (Type.symbol(Symbol[name])) {
        return Symbol[name];
      }
      // eslint-disable-next-line no-restricted-properties
      var sym = Symbol['for']('Symbol.' + name);
      Object.defineProperty(Symbol, name, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: sym
      });
      return sym;
    };
    if (!Type.symbol(Symbol.search)) {
      var symbolSearch = defineWellKnownSymbol('search');
      var originalSearch = String.prototype.search;
      defineProperty(RegExp.prototype, symbolSearch, function search(string) {
        return ES.Call(originalSearch, string, [this]);
      });
      var searchShim = function search(regexp) {
        var O = ES.RequireObjectCoercible(this);
        if (!isNullOrUndefined(regexp)) {
          var searcher = ES.GetMethod(regexp, symbolSearch);
          if (typeof searcher !== 'undefined') {
            return ES.Call(searcher, regexp, [O]);
          }
        }
        return ES.Call(originalSearch, O, [ES.ToString(regexp)]);
      };
      overrideNative(String.prototype, 'search', searchShim);
    }
    if (!Type.symbol(Symbol.replace)) {
      var symbolReplace = defineWellKnownSymbol('replace');
      var originalReplace = String.prototype.replace;
      defineProperty(RegExp.prototype, symbolReplace, function replace(string, replaceValue) {
        return ES.Call(originalReplace, string, [this, replaceValue]);
      });
      var replaceShim = function replace(searchValue, replaceValue) {
        var O = ES.RequireObjectCoercible(this);
        if (!isNullOrUndefined(searchValue)) {
          var replacer = ES.GetMethod(searchValue, symbolReplace);
          if (typeof replacer !== 'undefined') {
            return ES.Call(replacer, searchValue, [O, replaceValue]);
          }
        }
        return ES.Call(originalReplace, O, [ES.ToString(searchValue), replaceValue]);
      };
      overrideNative(String.prototype, 'replace', replaceShim);
    }
    if (!Type.symbol(Symbol.split)) {
      var symbolSplit = defineWellKnownSymbol('split');
      var originalSplit = String.prototype.split;
      defineProperty(RegExp.prototype, symbolSplit, function split(string, limit) {
        return ES.Call(originalSplit, string, [this, limit]);
      });
      var splitShim = function split(separator, limit) {
        var O = ES.RequireObjectCoercible(this);
        if (!isNullOrUndefined(separator)) {
          var splitter = ES.GetMethod(separator, symbolSplit);
          if (typeof splitter !== 'undefined') {
            return ES.Call(splitter, separator, [O, limit]);
          }
        }
        return ES.Call(originalSplit, O, [ES.ToString(separator), limit]);
      };
      overrideNative(String.prototype, 'split', splitShim);
    }
    var symbolMatchExists = Type.symbol(Symbol.match);
    var stringMatchIgnoresSymbolMatch = symbolMatchExists && (function () {
      // Firefox 41, through Nightly 45 has Symbol.match, but String#match ignores it.
      // Firefox 40 and below have Symbol.match but String#match works fine.
      var o = {};
      o[Symbol.match] = function () { return 42; };
      return 'a'.match(o) !== 42;
    }());
    if (!symbolMatchExists || stringMatchIgnoresSymbolMatch) {
      var symbolMatch = defineWellKnownSymbol('match');

      var originalMatch = String.prototype.match;
      defineProperty(RegExp.prototype, symbolMatch, function match(string) {
        return ES.Call(originalMatch, string, [this]);
      });

      var matchShim = function match(regexp) {
        var O = ES.RequireObjectCoercible(this);
        if (!isNullOrUndefined(regexp)) {
          var matcher = ES.GetMethod(regexp, symbolMatch);
          if (typeof matcher !== 'undefined') {
            return ES.Call(matcher, regexp, [O]);
          }
        }
        return ES.Call(originalMatch, O, [ES.ToString(regexp)]);
      };
      overrideNative(String.prototype, 'match', matchShim);
    }
  }

  var wrapConstructor = function wrapConstructor(original, replacement, keysToSkip) {
    Value.preserveToString(replacement, original);
    if (Object.setPrototypeOf) {
      // sets up proper prototype chain where possible
      Object.setPrototypeOf(original, replacement);
    }
    if (supportsDescriptors) {
      _forEach(Object.getOwnPropertyNames(original), function (key) {
        if (key in noop || keysToSkip[key]) { return; }
        Value.proxy(original, key, replacement);
      });
    } else {
      _forEach(Object.keys(original), function (key) {
        if (key in noop || keysToSkip[key]) { return; }
        replacement[key] = original[key];
      });
    }
    replacement.prototype = original.prototype;
    Value.redefine(original.prototype, 'constructor', replacement);
  };

  var defaultSpeciesGetter = function () { return this; };
  var addDefaultSpecies = function (C) {
    if (supportsDescriptors && !_hasOwnProperty(C, symbolSpecies)) {
      Value.getter(C, symbolSpecies, defaultSpeciesGetter);
    }
  };

  var addIterator = function (prototype, impl) {
    var implementation = impl || function iterator() { return this; };
    defineProperty(prototype, $iterator$, implementation);
    if (!prototype[$iterator$] && Type.symbol($iterator$)) {
      // implementations are buggy when $iterator$ is a Symbol
      prototype[$iterator$] = implementation;
    }
  };

  var createDataProperty = function createDataProperty(object, name, value) {
    if (supportsDescriptors) {
      Object.defineProperty(object, name, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: value
      });
    } else {
      object[name] = value;
    }
  };
  var createDataPropertyOrThrow = function createDataPropertyOrThrow(object, name, value) {
    createDataProperty(object, name, value);
    if (!ES.SameValue(object[name], value)) {
      throw new TypeError('property is nonconfigurable');
    }
  };

  var emulateES6construct = function (o, defaultNewTarget, defaultProto, slots) {
    // This is an es5 approximation to es6 construct semantics.  in es6,
    // 'new Foo' invokes Foo.[[Construct]] which (for almost all objects)
    // just sets the internal variable NewTarget (in es6 syntax `new.target`)
    // to Foo and then returns Foo().

    // Many ES6 object then have constructors of the form:
    // 1. If NewTarget is undefined, throw a TypeError exception
    // 2. Let xxx by OrdinaryCreateFromConstructor(NewTarget, yyy, zzz)

    // So we're going to emulate those first two steps.
    if (!ES.TypeIsObject(o)) {
      throw new TypeError('Constructor requires `new`: ' + defaultNewTarget.name);
    }
    var proto = defaultNewTarget.prototype;
    if (!ES.TypeIsObject(proto)) {
      proto = defaultProto;
    }
    var obj = create(proto);
    for (var name in slots) {
      if (_hasOwnProperty(slots, name)) {
        var value = slots[name];
        defineProperty(obj, name, value, true);
      }
    }
    return obj;
  };

  // Firefox 31 reports this function's length as 0
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1062484
  if (String.fromCodePoint && String.fromCodePoint.length !== 1) {
    var originalFromCodePoint = String.fromCodePoint;
    overrideNative(String, 'fromCodePoint', function fromCodePoint(codePoints) {
      return ES.Call(originalFromCodePoint, this, arguments);
    });
  }

  var StringShims = {
    fromCodePoint: function fromCodePoint(codePoints) {
      var result = [];
      var next;
      for (var i = 0, length = arguments.length; i < length; i++) {
        next = Number(arguments[i]);
        if (!ES.SameValue(next, ES.ToInteger(next)) || next < 0 || next > 0x10FFFF) {
          throw new RangeError('Invalid code point ' + next);
        }

        if (next < 0x10000) {
          _push(result, String.fromCharCode(next));
        } else {
          next -= 0x10000;
          _push(result, String.fromCharCode((next >> 10) + 0xD800));
          _push(result, String.fromCharCode((next % 0x400) + 0xDC00));
        }
      }
      return result.join('');
    },

    raw: function raw(callSite) {
      var cooked = ES.ToObject(callSite, 'bad callSite');
      var rawString = ES.ToObject(cooked.raw, 'bad raw value');
      var len = rawString.length;
      var literalsegments = ES.ToLength(len);
      if (literalsegments <= 0) {
        return '';
      }

      var stringElements = [];
      var nextIndex = 0;
      var nextKey, next, nextSeg, nextSub;
      while (nextIndex < literalsegments) {
        nextKey = ES.ToString(nextIndex);
        nextSeg = ES.ToString(rawString[nextKey]);
        _push(stringElements, nextSeg);
        if (nextIndex + 1 >= literalsegments) {
          break;
        }
        next = nextIndex + 1 < arguments.length ? arguments[nextIndex + 1] : '';
        nextSub = ES.ToString(next);
        _push(stringElements, nextSub);
        nextIndex += 1;
      }
      return stringElements.join('');
    }
  };
  if (String.raw && String.raw({ raw: { 0: 'x', 1: 'y', length: 2 } }) !== 'xy') {
    // IE 11 TP has a broken String.raw implementation
    overrideNative(String, 'raw', StringShims.raw);
  }
  defineProperties(String, StringShims);

  // Fast repeat, uses the `Exponentiation by squaring` algorithm.
  // Perf: http://jsperf.com/string-repeat2/2
  var stringRepeat = function repeat(s, times) {
    if (times < 1) { return ''; }
    if (times % 2) { return repeat(s, times - 1) + s; }
    var half = repeat(s, times / 2);
    return half + half;
  };
  var stringMaxLength = Infinity;

  var StringPrototypeShims = {
    repeat: function repeat(times) {
      var thisStr = ES.ToString(ES.RequireObjectCoercible(this));
      var numTimes = ES.ToInteger(times);
      if (numTimes < 0 || numTimes >= stringMaxLength) {
        throw new RangeError('repeat count must be less than infinity and not overflow maximum string size');
      }
      return stringRepeat(thisStr, numTimes);
    },

    startsWith: function startsWith(searchString) {
      var S = ES.ToString(ES.RequireObjectCoercible(this));
      if (ES.IsRegExp(searchString)) {
        throw new TypeError('Cannot call method "startsWith" with a regex');
      }
      var searchStr = ES.ToString(searchString);
      var position;
      if (arguments.length > 1) {
        position = arguments[1];
      }
      var start = _max(ES.ToInteger(position), 0);
      return _strSlice(S, start, start + searchStr.length) === searchStr;
    },

    endsWith: function endsWith(searchString) {
      var S = ES.ToString(ES.RequireObjectCoercible(this));
      if (ES.IsRegExp(searchString)) {
        throw new TypeError('Cannot call method "endsWith" with a regex');
      }
      var searchStr = ES.ToString(searchString);
      var len = S.length;
      var endPosition;
      if (arguments.length > 1) {
        endPosition = arguments[1];
      }
      var pos = typeof endPosition === 'undefined' ? len : ES.ToInteger(endPosition);
      var end = _min(_max(pos, 0), len);
      return _strSlice(S, end - searchStr.length, end) === searchStr;
    },

    includes: function includes(searchString) {
      if (ES.IsRegExp(searchString)) {
        throw new TypeError('"includes" does not accept a RegExp');
      }
      var searchStr = ES.ToString(searchString);
      var position;
      if (arguments.length > 1) {
        position = arguments[1];
      }
      // Somehow this trick makes method 100% compat with the spec.
      return _indexOf(this, searchStr, position) !== -1;
    },

    codePointAt: function codePointAt(pos) {
      var thisStr = ES.ToString(ES.RequireObjectCoercible(this));
      var position = ES.ToInteger(pos);
      var length = thisStr.length;
      if (position >= 0 && position < length) {
        var first = thisStr.charCodeAt(position);
        var isEnd = position + 1 === length;
        if (first < 0xD800 || first > 0xDBFF || isEnd) { return first; }
        var second = thisStr.charCodeAt(position + 1);
        if (second < 0xDC00 || second > 0xDFFF) { return first; }
        return ((first - 0xD800) * 1024) + (second - 0xDC00) + 0x10000;
      }
    }
  };
  if (String.prototype.includes && 'a'.includes('a', Infinity) !== false) {
    overrideNative(String.prototype, 'includes', StringPrototypeShims.includes);
  }

  if (String.prototype.startsWith && String.prototype.endsWith) {
    var startsWithRejectsRegex = throwsError(function () {
      /* throws if spec-compliant */
      '/a/'.startsWith(/a/);
    });
    var startsWithHandlesInfinity = valueOrFalseIfThrows(function () {
      return 'abc'.startsWith('a', Infinity) === false;
    });
    if (!startsWithRejectsRegex || !startsWithHandlesInfinity) {
      // Firefox (< 37?) and IE 11 TP have a noncompliant startsWith implementation
      overrideNative(String.prototype, 'startsWith', StringPrototypeShims.startsWith);
      overrideNative(String.prototype, 'endsWith', StringPrototypeShims.endsWith);
    }
  }
  if (hasSymbols) {
    var startsWithSupportsSymbolMatch = valueOrFalseIfThrows(function () {
      var re = /a/;
      re[Symbol.match] = false;
      return '/a/'.startsWith(re);
    });
    if (!startsWithSupportsSymbolMatch) {
      overrideNative(String.prototype, 'startsWith', StringPrototypeShims.startsWith);
    }
    var endsWithSupportsSymbolMatch = valueOrFalseIfThrows(function () {
      var re = /a/;
      re[Symbol.match] = false;
      return '/a/'.endsWith(re);
    });
    if (!endsWithSupportsSymbolMatch) {
      overrideNative(String.prototype, 'endsWith', StringPrototypeShims.endsWith);
    }
    var includesSupportsSymbolMatch = valueOrFalseIfThrows(function () {
      var re = /a/;
      re[Symbol.match] = false;
      return '/a/'.includes(re);
    });
    if (!includesSupportsSymbolMatch) {
      overrideNative(String.prototype, 'includes', StringPrototypeShims.includes);
    }
  }

  defineProperties(String.prototype, StringPrototypeShims);

  // whitespace from: http://es5.github.io/#x15.5.4.20
  // implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
  var ws = [
    '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003',
    '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028',
    '\u2029\uFEFF'
  ].join('');
  var trimRegexp = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
  var trimShim = function trim() {
    return ES.ToString(ES.RequireObjectCoercible(this)).replace(trimRegexp, '');
  };
  var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
  var nonWSregex = new RegExp('[' + nonWS + ']', 'g');
  var isBadHexRegex = /^[-+]0x[0-9a-f]+$/i;
  var hasStringTrimBug = nonWS.trim().length !== nonWS.length;
  defineProperty(String.prototype, 'trim', trimShim, hasStringTrimBug);

  // Given an argument x, it will return an IteratorResult object,
  // with value set to x and done to false.
  // Given no arguments, it will return an iterator completion object.
  var iteratorResult = function (x) {
    return { value: x, done: arguments.length === 0 };
  };

  // see http://www.ecma-international.org/ecma-262/6.0/#sec-string.prototype-@@iterator
  var StringIterator = function (s) {
    ES.RequireObjectCoercible(s);
    this._s = ES.ToString(s);
    this._i = 0;
  };
  StringIterator.prototype.next = function () {
    var s = this._s;
    var i = this._i;
    if (typeof s === 'undefined' || i >= s.length) {
      this._s = void 0;
      return iteratorResult();
    }
    var first = s.charCodeAt(i);
    var second, len;
    if (first < 0xD800 || first > 0xDBFF || (i + 1) === s.length) {
      len = 1;
    } else {
      second = s.charCodeAt(i + 1);
      len = (second < 0xDC00 || second > 0xDFFF) ? 1 : 2;
    }
    this._i = i + len;
    return iteratorResult(s.substr(i, len));
  };
  addIterator(StringIterator.prototype);
  addIterator(String.prototype, function () {
    return new StringIterator(this);
  });

  var ArrayShims = {
    from: function from(items) {
      var C = this;
      var mapFn;
      if (arguments.length > 1) {
        mapFn = arguments[1];
      }
      var mapping, T;
      if (typeof mapFn === 'undefined') {
        mapping = false;
      } else {
        if (!ES.IsCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }
        if (arguments.length > 2) {
          T = arguments[2];
        }
        mapping = true;
      }

      // Note that that Arrays will use ArrayIterator:
      // https://bugs.ecmascript.org/show_bug.cgi?id=2416
      var usingIterator = typeof (isArguments(items) || ES.GetMethod(items, $iterator$)) !== 'undefined';

      var length, result, i;
      if (usingIterator) {
        result = ES.IsConstructor(C) ? Object(new C()) : [];
        var iterator = ES.GetIterator(items);
        var next, nextValue;

        i = 0;
        while (true) {
          next = ES.IteratorStep(iterator);
          if (next === false) {
            break;
          }
          nextValue = next.value;
          try {
            if (mapping) {
              nextValue = typeof T === 'undefined' ? mapFn(nextValue, i) : _call(mapFn, T, nextValue, i);
            }
            result[i] = nextValue;
          } catch (e) {
            ES.IteratorClose(iterator, true);
            throw e;
          }
          i += 1;
        }
        length = i;
      } else {
        var arrayLike = ES.ToObject(items);
        length = ES.ToLength(arrayLike.length);
        result = ES.IsConstructor(C) ? Object(new C(length)) : new Array(length);
        var value;
        for (i = 0; i < length; ++i) {
          value = arrayLike[i];
          if (mapping) {
            value = typeof T === 'undefined' ? mapFn(value, i) : _call(mapFn, T, value, i);
          }
          createDataPropertyOrThrow(result, i, value);
        }
      }

      result.length = length;
      return result;
    },

    of: function of() {
      var len = arguments.length;
      var C = this;
      var A = isArray(C) || !ES.IsCallable(C) ? new Array(len) : ES.Construct(C, [len]);
      for (var k = 0; k < len; ++k) {
        createDataPropertyOrThrow(A, k, arguments[k]);
      }
      A.length = len;
      return A;
    }
  };
  defineProperties(Array, ArrayShims);
  addDefaultSpecies(Array);

  // Our ArrayIterator is private; see
  // https://github.com/paulmillr/es6-shim/issues/252
  ArrayIterator = function (array, kind) {
    this.i = 0;
    this.array = array;
    this.kind = kind;
  };

  defineProperties(ArrayIterator.prototype, {
    next: function () {
      var i = this.i;
      var array = this.array;
      if (!(this instanceof ArrayIterator)) {
        throw new TypeError('Not an ArrayIterator');
      }
      if (typeof array !== 'undefined') {
        var len = ES.ToLength(array.length);
        for (; i < len; i++) {
          var kind = this.kind;
          var retval;
          if (kind === 'key') {
            retval = i;
          } else if (kind === 'value') {
            retval = array[i];
          } else if (kind === 'entry') {
            retval = [i, array[i]];
          }
          this.i = i + 1;
          return iteratorResult(retval);
        }
      }
      this.array = void 0;
      return iteratorResult();
    }
  });
  addIterator(ArrayIterator.prototype);

/*
  var orderKeys = function orderKeys(a, b) {
    var aNumeric = String(ES.ToInteger(a)) === a;
    var bNumeric = String(ES.ToInteger(b)) === b;
    if (aNumeric && bNumeric) {
      return b - a;
    } else if (aNumeric && !bNumeric) {
      return -1;
    } else if (!aNumeric && bNumeric) {
      return 1;
    } else {
      return a.localeCompare(b);
    }
  };

  var getAllKeys = function getAllKeys(object) {
    var ownKeys = [];
    var keys = [];

    for (var key in object) {
      _push(_hasOwnProperty(object, key) ? ownKeys : keys, key);
    }
    _sort(ownKeys, orderKeys);
    _sort(keys, orderKeys);

    return _concat(ownKeys, keys);
  };
  */

  // note: this is positioned here because it depends on ArrayIterator
  var arrayOfSupportsSubclassing = Array.of === ArrayShims.of || (function () {
    // Detects a bug in Webkit nightly r181886
    var Foo = function Foo(len) { this.length = len; };
    Foo.prototype = [];
    var fooArr = Array.of.apply(Foo, [1, 2]);
    return fooArr instanceof Foo && fooArr.length === 2;
  }());
  if (!arrayOfSupportsSubclassing) {
    overrideNative(Array, 'of', ArrayShims.of);
  }

  var ArrayPrototypeShims = {
    copyWithin: function copyWithin(target, start) {
      var o = ES.ToObject(this);
      var len = ES.ToLength(o.length);
      var relativeTarget = ES.ToInteger(target);
      var relativeStart = ES.ToInteger(start);
      var to = relativeTarget < 0 ? _max(len + relativeTarget, 0) : _min(relativeTarget, len);
      var from = relativeStart < 0 ? _max(len + relativeStart, 0) : _min(relativeStart, len);
      var end;
      if (arguments.length > 2) {
        end = arguments[2];
      }
      var relativeEnd = typeof end === 'undefined' ? len : ES.ToInteger(end);
      var finalItem = relativeEnd < 0 ? _max(len + relativeEnd, 0) : _min(relativeEnd, len);
      var count = _min(finalItem - from, len - to);
      var direction = 1;
      if (from < to && to < (from + count)) {
        direction = -1;
        from += count - 1;
        to += count - 1;
      }
      while (count > 0) {
        if (from in o) {
          o[to] = o[from];
        } else {
          delete o[to];
        }
        from += direction;
        to += direction;
        count -= 1;
      }
      return o;
    },

    fill: function fill(value) {
      var start;
      if (arguments.length > 1) {
        start = arguments[1];
      }
      var end;
      if (arguments.length > 2) {
        end = arguments[2];
      }
      var O = ES.ToObject(this);
      var len = ES.ToLength(O.length);
      start = ES.ToInteger(typeof start === 'undefined' ? 0 : start);
      end = ES.ToInteger(typeof end === 'undefined' ? len : end);

      var relativeStart = start < 0 ? _max(len + start, 0) : _min(start, len);
      var relativeEnd = end < 0 ? len + end : end;

      for (var i = relativeStart; i < len && i < relativeEnd; ++i) {
        O[i] = value;
      }
      return O;
    },

    find: function find(predicate) {
      var list = ES.ToObject(this);
      var length = ES.ToLength(list.length);
      if (!ES.IsCallable(predicate)) {
        throw new TypeError('Array#find: predicate must be a function');
      }
      var thisArg = arguments.length > 1 ? arguments[1] : null;
      for (var i = 0, value; i < length; i++) {
        value = list[i];
        if (thisArg) {
          if (_call(predicate, thisArg, value, i, list)) {
            return value;
          }
        } else if (predicate(value, i, list)) {
          return value;
        }
      }
    },

    findIndex: function findIndex(predicate) {
      var list = ES.ToObject(this);
      var length = ES.ToLength(list.length);
      if (!ES.IsCallable(predicate)) {
        throw new TypeError('Array#findIndex: predicate must be a function');
      }
      var thisArg = arguments.length > 1 ? arguments[1] : null;
      for (var i = 0; i < length; i++) {
        if (thisArg) {
          if (_call(predicate, thisArg, list[i], i, list)) {
            return i;
          }
        } else if (predicate(list[i], i, list)) {
          return i;
        }
      }
      return -1;
    },

    keys: function keys() {
      return new ArrayIterator(this, 'key');
    },

    values: function values() {
      return new ArrayIterator(this, 'value');
    },

    entries: function entries() {
      return new ArrayIterator(this, 'entry');
    }
  };
  // Safari 7.1 defines Array#keys and Array#entries natively,
  // but the resulting ArrayIterator objects don't have a "next" method.
  if (Array.prototype.keys && !ES.IsCallable([1].keys().next)) {
    delete Array.prototype.keys;
  }
  if (Array.prototype.entries && !ES.IsCallable([1].entries().next)) {
    delete Array.prototype.entries;
  }

  // Chrome 38 defines Array#keys and Array#entries, and Array#@@iterator, but not Array#values
  if (Array.prototype.keys && Array.prototype.entries && !Array.prototype.values && Array.prototype[$iterator$]) {
    defineProperties(Array.prototype, {
      values: Array.prototype[$iterator$]
    });
    if (Type.symbol(Symbol.unscopables)) {
      Array.prototype[Symbol.unscopables].values = true;
    }
  }
  // Chrome 40 defines Array#values with the incorrect name, although Array#{keys,entries} have the correct name
  if (functionsHaveNames && Array.prototype.values && Array.prototype.values.name !== 'values') {
    var originalArrayPrototypeValues = Array.prototype.values;
    overrideNative(Array.prototype, 'values', function values() { return ES.Call(originalArrayPrototypeValues, this, arguments); });
    defineProperty(Array.prototype, $iterator$, Array.prototype.values, true);
  }
  defineProperties(Array.prototype, ArrayPrototypeShims);

  if (1 / [true].indexOf(true, -0) < 0) {
    // indexOf when given a position arg of -0 should return +0.
    // https://github.com/tc39/ecma262/pull/316
    defineProperty(Array.prototype, 'indexOf', function indexOf(searchElement) {
      var value = _arrayIndexOfApply(this, arguments);
      if (value === 0 && (1 / value) < 0) {
        return 0;
      }
      return value;
    }, true);
  }

  addIterator(Array.prototype, function () { return this.values(); });
  // Chrome defines keys/values/entries on Array, but doesn't give us
  // any way to identify its iterator.  So add our own shimmed field.
  if (Object.getPrototypeOf) {
    addIterator(Object.getPrototypeOf([].values()));
  }

  // note: this is positioned here because it relies on Array#entries
  var arrayFromSwallowsNegativeLengths = (function () {
    // Detects a Firefox bug in v32
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1063993
    return valueOrFalseIfThrows(function () {
      return Array.from({ length: -1 }).length === 0;
    });
  }());
  var arrayFromHandlesIterables = (function () {
    // Detects a bug in Webkit nightly r181886
    var arr = Array.from([0].entries());
    return arr.length === 1 && isArray(arr[0]) && arr[0][0] === 0 && arr[0][1] === 0;
  }());
  if (!arrayFromSwallowsNegativeLengths || !arrayFromHandlesIterables) {
    overrideNative(Array, 'from', ArrayShims.from);
  }
  var arrayFromHandlesUndefinedMapFunction = (function () {
    // Microsoft Edge v0.11 throws if the mapFn argument is *provided* but undefined,
    // but the spec doesn't care if it's provided or not - undefined doesn't throw.
    return valueOrFalseIfThrows(function () {
      return Array.from([0], void 0);
    });
  }());
  if (!arrayFromHandlesUndefinedMapFunction) {
    var origArrayFrom = Array.from;
    overrideNative(Array, 'from', function from(items) {
      if (arguments.length > 1 && typeof arguments[1] !== 'undefined') {
        return ES.Call(origArrayFrom, this, arguments);
      } else {
        return _call(origArrayFrom, this, items);
      }
    });
  }

  var int32sAsOne = -(Math.pow(2, 32) - 1);
  var toLengthsCorrectly = function (method, reversed) {
    var obj = { length: int32sAsOne };
    obj[reversed ? (obj.length >>> 0) - 1 : 0] = true;
    return valueOrFalseIfThrows(function () {
      _call(method, obj, function () {
        // note: in nonconforming browsers, this will be called
        // -1 >>> 0 times, which is 4294967295, so the throw matters.
        throw new RangeError('should not reach here');
      }, []);
      return true;
    });
  };
  if (!toLengthsCorrectly(Array.prototype.forEach)) {
    var originalForEach = Array.prototype.forEach;
    overrideNative(Array.prototype, 'forEach', function forEach(callbackFn) {
      return ES.Call(originalForEach, this.length >= 0 ? this : [], arguments);
    }, true);
  }
  if (!toLengthsCorrectly(Array.prototype.map)) {
    var originalMap = Array.prototype.map;
    overrideNative(Array.prototype, 'map', function map(callbackFn) {
      return ES.Call(originalMap, this.length >= 0 ? this : [], arguments);
    }, true);
  }
  if (!toLengthsCorrectly(Array.prototype.filter)) {
    var originalFilter = Array.prototype.filter;
    overrideNative(Array.prototype, 'filter', function filter(callbackFn) {
      return ES.Call(originalFilter, this.length >= 0 ? this : [], arguments);
    }, true);
  }
  if (!toLengthsCorrectly(Array.prototype.some)) {
    var originalSome = Array.prototype.some;
    overrideNative(Array.prototype, 'some', function some(callbackFn) {
      return ES.Call(originalSome, this.length >= 0 ? this : [], arguments);
    }, true);
  }
  if (!toLengthsCorrectly(Array.prototype.every)) {
    var originalEvery = Array.prototype.every;
    overrideNative(Array.prototype, 'every', function every(callbackFn) {
      return ES.Call(originalEvery, this.length >= 0 ? this : [], arguments);
    }, true);
  }
  if (!toLengthsCorrectly(Array.prototype.reduce)) {
    var originalReduce = Array.prototype.reduce;
    overrideNative(Array.prototype, 'reduce', function reduce(callbackFn) {
      return ES.Call(originalReduce, this.length >= 0 ? this : [], arguments);
    }, true);
  }
  if (!toLengthsCorrectly(Array.prototype.reduceRight, true)) {
    var originalReduceRight = Array.prototype.reduceRight;
    overrideNative(Array.prototype, 'reduceRight', function reduceRight(callbackFn) {
      return ES.Call(originalReduceRight, this.length >= 0 ? this : [], arguments);
    }, true);
  }

  var lacksOctalSupport = Number('0o10') !== 8;
  var lacksBinarySupport = Number('0b10') !== 2;
  var trimsNonWhitespace = _some(nonWS, function (c) {
    return Number(c + 0 + c) === 0;
  });
  if (lacksOctalSupport || lacksBinarySupport || trimsNonWhitespace) {
    var OrigNumber = Number;
    var binaryRegex = /^0b[01]+$/i;
    var octalRegex = /^0o[0-7]+$/i;
    // Note that in IE 8, RegExp.prototype.test doesn't seem to exist: ie, "test" is an own property of regexes. wtf.
    var isBinary = binaryRegex.test.bind(binaryRegex);
    var isOctal = octalRegex.test.bind(octalRegex);
    var toPrimitive = function (O) { // need to replace this with `es-to-primitive/es6`
      var result;
      if (typeof O.valueOf === 'function') {
        result = O.valueOf();
        if (Type.primitive(result)) {
          return result;
        }
      }
      if (typeof O.toString === 'function') {
        result = O.toString();
        if (Type.primitive(result)) {
          return result;
        }
      }
      throw new TypeError('No default value');
    };
    var hasNonWS = nonWSregex.test.bind(nonWSregex);
    var isBadHex = isBadHexRegex.test.bind(isBadHexRegex);
    var NumberShim = (function () {
      // this is wrapped in an IIFE because of IE 6-8's wacky scoping issues with named function expressions.
      var NumberShim = function Number(value) {
        var primValue;
        if (arguments.length > 0) {
          primValue = Type.primitive(value) ? value : toPrimitive(value, 'number');
        } else {
          primValue = 0;
        }
        if (typeof primValue === 'string') {
          primValue = ES.Call(trimShim, primValue);
          if (isBinary(primValue)) {
            primValue = parseInt(_strSlice(primValue, 2), 2);
          } else if (isOctal(primValue)) {
            primValue = parseInt(_strSlice(primValue, 2), 8);
          } else if (hasNonWS(primValue) || isBadHex(primValue)) {
            primValue = NaN;
          }
        }
        var receiver = this;
        var valueOfSucceeds = valueOrFalseIfThrows(function () {
          OrigNumber.prototype.valueOf.call(receiver);
          return true;
        });
        if (receiver instanceof NumberShim && !valueOfSucceeds) {
          return new OrigNumber(primValue);
        }
        /* jshint newcap: false */
        return OrigNumber(primValue);
        /* jshint newcap: true */
      };
      return NumberShim;
    }());
    wrapConstructor(OrigNumber, NumberShim, {});
    // this is necessary for ES3 browsers, where these properties are non-enumerable.
    defineProperties(NumberShim, {
      NaN: OrigNumber.NaN,
      MAX_VALUE: OrigNumber.MAX_VALUE,
      MIN_VALUE: OrigNumber.MIN_VALUE,
      NEGATIVE_INFINITY: OrigNumber.NEGATIVE_INFINITY,
      POSITIVE_INFINITY: OrigNumber.POSITIVE_INFINITY
    });
    /* globals Number: true */
    /* eslint-disable no-undef, no-global-assign */
    /* jshint -W020 */
    Number = NumberShim;
    Value.redefine(globals, 'Number', NumberShim);
    /* jshint +W020 */
    /* eslint-enable no-undef, no-global-assign */
    /* globals Number: false */
  }

  var maxSafeInteger = Math.pow(2, 53) - 1;
  defineProperties(Number, {
    MAX_SAFE_INTEGER: maxSafeInteger,
    MIN_SAFE_INTEGER: -maxSafeInteger,
    EPSILON: 2.220446049250313e-16,

    parseInt: globals.parseInt,
    parseFloat: globals.parseFloat,

    isFinite: numberIsFinite,

    isInteger: function isInteger(value) {
      return numberIsFinite(value) && ES.ToInteger(value) === value;
    },

    isSafeInteger: function isSafeInteger(value) {
      return Number.isInteger(value) && _abs(value) <= Number.MAX_SAFE_INTEGER;
    },

    isNaN: numberIsNaN
  });
  // Firefox 37 has a conforming Number.parseInt, but it's not === to the global parseInt (fixed in v40)
  defineProperty(Number, 'parseInt', globals.parseInt, Number.parseInt !== globals.parseInt);

  // Work around bugs in Array#find and Array#findIndex -- early
  // implementations skipped holes in sparse arrays. (Note that the
  // implementations of find/findIndex indirectly use shimmed
  // methods of Number, so this test has to happen down here.)
  /*jshint elision: true */
  /* eslint-disable no-sparse-arrays */
  if ([, 1].find(function () { return true; }) === 1) {
    overrideNative(Array.prototype, 'find', ArrayPrototypeShims.find);
  }
  if ([, 1].findIndex(function () { return true; }) !== 0) {
    overrideNative(Array.prototype, 'findIndex', ArrayPrototypeShims.findIndex);
  }
  /* eslint-enable no-sparse-arrays */
  /*jshint elision: false */

  var isEnumerableOn = Function.bind.call(Function.bind, Object.prototype.propertyIsEnumerable);
  var ensureEnumerable = function ensureEnumerable(obj, prop) {
    if (supportsDescriptors && isEnumerableOn(obj, prop)) {
      Object.defineProperty(obj, prop, { enumerable: false });
    }
  };
  var sliceArgs = function sliceArgs() {
    // per https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
    // and https://gist.github.com/WebReflection/4327762cb87a8c634a29
    var initial = Number(this);
    var len = arguments.length;
    var desiredArgCount = len - initial;
    var args = new Array(desiredArgCount < 0 ? 0 : desiredArgCount);
    for (var i = initial; i < len; ++i) {
      args[i - initial] = arguments[i];
    }
    return args;
  };
  var assignTo = function assignTo(source) {
    return function assignToSource(target, key) {
      target[key] = source[key];
      return target;
    };
  };
  var assignReducer = function (target, source) {
    var sourceKeys = keys(Object(source));
    var symbols;
    if (ES.IsCallable(Object.getOwnPropertySymbols)) {
      symbols = _filter(Object.getOwnPropertySymbols(Object(source)), isEnumerableOn(source));
    }
    return _reduce(_concat(sourceKeys, symbols || []), assignTo(source), target);
  };

  var ObjectShims = {
    // 19.1.3.1
    assign: function (target, source) {
      var to = ES.ToObject(target, 'Cannot convert undefined or null to object');
      return _reduce(ES.Call(sliceArgs, 1, arguments), assignReducer, to);
    },

    // Added in WebKit in https://bugs.webkit.org/show_bug.cgi?id=143865
    is: function is(a, b) {
      return ES.SameValue(a, b);
    }
  };
  var assignHasPendingExceptions = Object.assign && Object.preventExtensions && (function () {
    // Firefox 37 still has "pending exception" logic in its Object.assign implementation,
    // which is 72% slower than our shim, and Firefox 40's native implementation.
    var thrower = Object.preventExtensions({ 1: 2 });
    try {
      Object.assign(thrower, 'xy');
    } catch (e) {
      return thrower[1] === 'y';
    }
  }());
  if (assignHasPendingExceptions) {
    overrideNative(Object, 'assign', ObjectShims.assign);
  }
  defineProperties(Object, ObjectShims);

  if (supportsDescriptors) {
    var ES5ObjectShims = {
      // 19.1.3.9
      // shim from https://gist.github.com/WebReflection/5593554
      setPrototypeOf: (function (Object, magic) {
        var set;

        var checkArgs = function (O, proto) {
          if (!ES.TypeIsObject(O)) {
            throw new TypeError('cannot set prototype on a non-object');
          }
          if (!(proto === null || ES.TypeIsObject(proto))) {
            throw new TypeError('can only set prototype to an object or null' + proto);
          }
        };

        var setPrototypeOf = function (O, proto) {
          checkArgs(O, proto);
          _call(set, O, proto);
          return O;
        };

        try {
          // this works already in Firefox and Safari
          set = Object.getOwnPropertyDescriptor(Object.prototype, magic).set;
          _call(set, {}, null);
        } catch (e) {
          if (Object.prototype !== {}[magic]) {
            // IE < 11 cannot be shimmed
            return;
          }
          // probably Chrome or some old Mobile stock browser
          set = function (proto) {
            this[magic] = proto;
          };
          // please note that this will **not** work
          // in those browsers that do not inherit
          // __proto__ by mistake from Object.prototype
          // in these cases we should probably throw an error
          // or at least be informed about the issue
          setPrototypeOf.polyfill = setPrototypeOf(
            setPrototypeOf({}, null),
            Object.prototype
          ) instanceof Object;
          // setPrototypeOf.polyfill === true means it works as meant
          // setPrototypeOf.polyfill === false means it's not 100% reliable
          // setPrototypeOf.polyfill === undefined
          // or
          // setPrototypeOf.polyfill ==  null means it's not a polyfill
          // which means it works as expected
          // we can even delete Object.prototype.__proto__;
        }
        return setPrototypeOf;
      }(Object, '__proto__'))
    };

    defineProperties(Object, ES5ObjectShims);
  }

  // Workaround bug in Opera 12 where setPrototypeOf(x, null) doesn't work,
  // but Object.create(null) does.
  if (Object.setPrototypeOf && Object.getPrototypeOf &&
      Object.getPrototypeOf(Object.setPrototypeOf({}, null)) !== null &&
      Object.getPrototypeOf(Object.create(null)) === null) {
    (function () {
      var FAKENULL = Object.create(null);
      var gpo = Object.getPrototypeOf;
      var spo = Object.setPrototypeOf;
      Object.getPrototypeOf = function (o) {
        var result = gpo(o);
        return result === FAKENULL ? null : result;
      };
      Object.setPrototypeOf = function (o, p) {
        var proto = p === null ? FAKENULL : p;
        return spo(o, proto);
      };
      Object.setPrototypeOf.polyfill = false;
    }());
  }

  var objectKeysAcceptsPrimitives = !throwsError(function () { Object.keys('foo'); });
  if (!objectKeysAcceptsPrimitives) {
    var originalObjectKeys = Object.keys;
    overrideNative(Object, 'keys', function keys(value) {
      return originalObjectKeys(ES.ToObject(value));
    });
    keys = Object.keys;
  }
  var objectKeysRejectsRegex = throwsError(function () { Object.keys(/a/g); });
  if (objectKeysRejectsRegex) {
    var regexRejectingObjectKeys = Object.keys;
    overrideNative(Object, 'keys', function keys(value) {
      if (Type.regex(value)) {
        var regexKeys = [];
        for (var k in value) {
          if (_hasOwnProperty(value, k)) {
            _push(regexKeys, k);
          }
        }
        return regexKeys;
      }
      return regexRejectingObjectKeys(value);
    });
    keys = Object.keys;
  }

  if (Object.getOwnPropertyNames) {
    var objectGOPNAcceptsPrimitives = !throwsError(function () { Object.getOwnPropertyNames('foo'); });
    if (!objectGOPNAcceptsPrimitives) {
      var cachedWindowNames = typeof window === 'object' ? Object.getOwnPropertyNames(window) : [];
      var originalObjectGetOwnPropertyNames = Object.getOwnPropertyNames;
      overrideNative(Object, 'getOwnPropertyNames', function getOwnPropertyNames(value) {
        var val = ES.ToObject(value);
        if (_toString(val) === '[object Window]') {
          try {
            return originalObjectGetOwnPropertyNames(val);
          } catch (e) {
            // IE bug where layout engine calls userland gOPN for cross-domain `window` objects
            return _concat([], cachedWindowNames);
          }
        }
        return originalObjectGetOwnPropertyNames(val);
      });
    }
  }
  if (Object.getOwnPropertyDescriptor) {
    var objectGOPDAcceptsPrimitives = !throwsError(function () { Object.getOwnPropertyDescriptor('foo', 'bar'); });
    if (!objectGOPDAcceptsPrimitives) {
      var originalObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      overrideNative(Object, 'getOwnPropertyDescriptor', function getOwnPropertyDescriptor(value, property) {
        return originalObjectGetOwnPropertyDescriptor(ES.ToObject(value), property);
      });
    }
  }
  if (Object.seal) {
    var objectSealAcceptsPrimitives = !throwsError(function () { Object.seal('foo'); });
    if (!objectSealAcceptsPrimitives) {
      var originalObjectSeal = Object.seal;
      overrideNative(Object, 'seal', function seal(value) {
        if (!ES.TypeIsObject(value)) { return value; }
        return originalObjectSeal(value);
      });
    }
  }
  if (Object.isSealed) {
    var objectIsSealedAcceptsPrimitives = !throwsError(function () { Object.isSealed('foo'); });
    if (!objectIsSealedAcceptsPrimitives) {
      var originalObjectIsSealed = Object.isSealed;
      overrideNative(Object, 'isSealed', function isSealed(value) {
        if (!ES.TypeIsObject(value)) { return true; }
        return originalObjectIsSealed(value);
      });
    }
  }
  if (Object.freeze) {
    var objectFreezeAcceptsPrimitives = !throwsError(function () { Object.freeze('foo'); });
    if (!objectFreezeAcceptsPrimitives) {
      var originalObjectFreeze = Object.freeze;
      overrideNative(Object, 'freeze', function freeze(value) {
        if (!ES.TypeIsObject(value)) { return value; }
        return originalObjectFreeze(value);
      });
    }
  }
  if (Object.isFrozen) {
    var objectIsFrozenAcceptsPrimitives = !throwsError(function () { Object.isFrozen('foo'); });
    if (!objectIsFrozenAcceptsPrimitives) {
      var originalObjectIsFrozen = Object.isFrozen;
      overrideNative(Object, 'isFrozen', function isFrozen(value) {
        if (!ES.TypeIsObject(value)) { return true; }
        return originalObjectIsFrozen(value);
      });
    }
  }
  if (Object.preventExtensions) {
    var objectPreventExtensionsAcceptsPrimitives = !throwsError(function () { Object.preventExtensions('foo'); });
    if (!objectPreventExtensionsAcceptsPrimitives) {
      var originalObjectPreventExtensions = Object.preventExtensions;
      overrideNative(Object, 'preventExtensions', function preventExtensions(value) {
        if (!ES.TypeIsObject(value)) { return value; }
        return originalObjectPreventExtensions(value);
      });
    }
  }
  if (Object.isExtensible) {
    var objectIsExtensibleAcceptsPrimitives = !throwsError(function () { Object.isExtensible('foo'); });
    if (!objectIsExtensibleAcceptsPrimitives) {
      var originalObjectIsExtensible = Object.isExtensible;
      overrideNative(Object, 'isExtensible', function isExtensible(value) {
        if (!ES.TypeIsObject(value)) { return false; }
        return originalObjectIsExtensible(value);
      });
    }
  }
  if (Object.getPrototypeOf) {
    var objectGetProtoAcceptsPrimitives = !throwsError(function () { Object.getPrototypeOf('foo'); });
    if (!objectGetProtoAcceptsPrimitives) {
      var originalGetProto = Object.getPrototypeOf;
      overrideNative(Object, 'getPrototypeOf', function getPrototypeOf(value) {
        return originalGetProto(ES.ToObject(value));
      });
    }
  }

  var hasFlags = supportsDescriptors && (function () {
    var desc = Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags');
    return desc && ES.IsCallable(desc.get);
  }());
  if (supportsDescriptors && !hasFlags) {
    var regExpFlagsGetter = function flags() {
      if (!ES.TypeIsObject(this)) {
        throw new TypeError('Method called on incompatible type: must be an object.');
      }
      var result = '';
      if (this.global) {
        result += 'g';
      }
      if (this.ignoreCase) {
        result += 'i';
      }
      if (this.multiline) {
        result += 'm';
      }
      if (this.unicode) {
        result += 'u';
      }
      if (this.sticky) {
        result += 'y';
      }
      return result;
    };

    Value.getter(RegExp.prototype, 'flags', regExpFlagsGetter);
  }

  var regExpSupportsFlagsWithRegex = supportsDescriptors && valueOrFalseIfThrows(function () {
    return String(new RegExp(/a/g, 'i')) === '/a/i';
  });
  var regExpNeedsToSupportSymbolMatch = hasSymbols && supportsDescriptors && (function () {
    // Edge 0.12 supports flags fully, but does not support Symbol.match
    var regex = /./;
    regex[Symbol.match] = false;
    return RegExp(regex) === regex;
  }());

  var regexToStringIsGeneric = valueOrFalseIfThrows(function () {
    return RegExp.prototype.toString.call({ source: 'abc' }) === '/abc/';
  });
  var regexToStringSupportsGenericFlags = regexToStringIsGeneric && valueOrFalseIfThrows(function () {
    return RegExp.prototype.toString.call({ source: 'a', flags: 'b' }) === '/a/b';
  });
  if (!regexToStringIsGeneric || !regexToStringSupportsGenericFlags) {
    var origRegExpToString = RegExp.prototype.toString;
    defineProperty(RegExp.prototype, 'toString', function toString() {
      var R = ES.RequireObjectCoercible(this);
      if (Type.regex(R)) {
        return _call(origRegExpToString, R);
      }
      var pattern = $String(R.source);
      var flags = $String(R.flags);
      return '/' + pattern + '/' + flags;
    }, true);
    Value.preserveToString(RegExp.prototype.toString, origRegExpToString);
  }

  if (supportsDescriptors && (!regExpSupportsFlagsWithRegex || regExpNeedsToSupportSymbolMatch)) {
    var flagsGetter = Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags').get;
    var sourceDesc = Object.getOwnPropertyDescriptor(RegExp.prototype, 'source') || {};
    var legacySourceGetter = function () {
      // prior to it being a getter, it's own + nonconfigurable
      return this.source;
    };
    var sourceGetter = ES.IsCallable(sourceDesc.get) ? sourceDesc.get : legacySourceGetter;

    var OrigRegExp = RegExp;
    var RegExpShim = (function () {
      return function RegExp(pattern, flags) {
        var patternIsRegExp = ES.IsRegExp(pattern);
        var calledWithNew = this instanceof RegExp;
        if (!calledWithNew && patternIsRegExp && typeof flags === 'undefined' && pattern.constructor === RegExp) {
          return pattern;
        }

        var P = pattern;
        var F = flags;
        if (Type.regex(pattern)) {
          P = ES.Call(sourceGetter, pattern);
          F = typeof flags === 'undefined' ? ES.Call(flagsGetter, pattern) : flags;
          return new RegExp(P, F);
        } else if (patternIsRegExp) {
          P = pattern.source;
          F = typeof flags === 'undefined' ? pattern.flags : flags;
        }
        return new OrigRegExp(pattern, flags);
      };
    }());
    wrapConstructor(OrigRegExp, RegExpShim, {
      $input: true // Chrome < v39 & Opera < 26 have a nonstandard "$input" property
    });
    /* globals RegExp: true */
    /* eslint-disable no-undef, no-global-assign */
    /* jshint -W020 */
    RegExp = RegExpShim;
    Value.redefine(globals, 'RegExp', RegExpShim);
    /* jshint +W020 */
    /* eslint-enable no-undef, no-global-assign */
    /* globals RegExp: false */
  }

  if (supportsDescriptors) {
    var regexGlobals = {
      input: '$_',
      lastMatch: '$&',
      lastParen: '$+',
      leftContext: '$`',
      rightContext: '$\''
    };
    _forEach(keys(regexGlobals), function (prop) {
      if (prop in RegExp && !(regexGlobals[prop] in RegExp)) {
        Value.getter(RegExp, regexGlobals[prop], function get() {
          return RegExp[prop];
        });
      }
    });
  }
  addDefaultSpecies(RegExp);

  var inverseEpsilon = 1 / Number.EPSILON;
  var roundTiesToEven = function roundTiesToEven(n) {
    // Even though this reduces down to `return n`, it takes advantage of built-in rounding.
    return (n + inverseEpsilon) - inverseEpsilon;
  };
  var BINARY_32_EPSILON = Math.pow(2, -23);
  var BINARY_32_MAX_VALUE = Math.pow(2, 127) * (2 - BINARY_32_EPSILON);
  var BINARY_32_MIN_VALUE = Math.pow(2, -126);
  var E = Math.E;
  var LOG2E = Math.LOG2E;
  var LOG10E = Math.LOG10E;
  var numberCLZ = Number.prototype.clz;
  delete Number.prototype.clz; // Safari 8 has Number#clz

  var MathShims = {
    acosh: function acosh(value) {
      var x = Number(value);
      if (numberIsNaN(x) || value < 1) { return NaN; }
      if (x === 1) { return 0; }
      if (x === Infinity) { return x; }
      return _log((x / E) + (_sqrt(x + 1) * _sqrt(x - 1) / E)) + 1;
    },

    asinh: function asinh(value) {
      var x = Number(value);
      if (x === 0 || !globalIsFinite(x)) {
        return x;
      }
      return x < 0 ? -asinh(-x) : _log(x + _sqrt((x * x) + 1));
    },

    atanh: function atanh(value) {
      var x = Number(value);
      if (numberIsNaN(x) || x < -1 || x > 1) {
        return NaN;
      }
      if (x === -1) { return -Infinity; }
      if (x === 1) { return Infinity; }
      if (x === 0) { return x; }
      return 0.5 * _log((1 + x) / (1 - x));
    },

    cbrt: function cbrt(value) {
      var x = Number(value);
      if (x === 0) { return x; }
      var negate = x < 0;
      var result;
      if (negate) { x = -x; }
      if (x === Infinity) {
        result = Infinity;
      } else {
        result = _exp(_log(x) / 3);
        // from http://en.wikipedia.org/wiki/Cube_root#Numerical_methods
        result = ((x / (result * result)) + (2 * result)) / 3;
      }
      return negate ? -result : result;
    },

    clz32: function clz32(value) {
      // See https://bugs.ecmascript.org/show_bug.cgi?id=2465
      var x = Number(value);
      var number = ES.ToUint32(x);
      if (number === 0) {
        return 32;
      }
      return numberCLZ ? ES.Call(numberCLZ, number) : 31 - _floor(_log(number + 0.5) * LOG2E);
    },

    cosh: function cosh(value) {
      var x = Number(value);
      if (x === 0) { return 1; } // +0 or -0
      if (numberIsNaN(x)) { return NaN; }
      if (!globalIsFinite(x)) { return Infinity; }
      if (x < 0) { x = -x; }
      if (x > 21) { return _exp(x) / 2; }
      return (_exp(x) + _exp(-x)) / 2;
    },

    expm1: function expm1(value) {
      var x = Number(value);
      if (x === -Infinity) { return -1; }
      if (!globalIsFinite(x) || x === 0) { return x; }
      if (_abs(x) > 0.5) {
        return _exp(x) - 1;
      }
      // A more precise approximation using Taylor series expansion
      // from https://github.com/paulmillr/es6-shim/issues/314#issuecomment-70293986
      var t = x;
      var sum = 0;
      var n = 1;
      while (sum + t !== sum) {
        sum += t;
        n += 1;
        t *= x / n;
      }
      return sum;
    },

    hypot: function hypot(x, y) {
      var result = 0;
      var largest = 0;
      for (var i = 0; i < arguments.length; ++i) {
        var value = _abs(Number(arguments[i]));
        if (largest < value) {
          result *= (largest / value) * (largest / value);
          result += 1;
          largest = value;
        } else {
          result += value > 0 ? (value / largest) * (value / largest) : value;
        }
      }
      return largest === Infinity ? Infinity : largest * _sqrt(result);
    },

    log2: function log2(value) {
      return _log(value) * LOG2E;
    },

    log10: function log10(value) {
      return _log(value) * LOG10E;
    },

    log1p: function log1p(value) {
      var x = Number(value);
      if (x < -1 || numberIsNaN(x)) { return NaN; }
      if (x === 0 || x === Infinity) { return x; }
      if (x === -1) { return -Infinity; }

      return (1 + x) - 1 === 0 ? x : x * (_log(1 + x) / ((1 + x) - 1));
    },

    sign: _sign,

    sinh: function sinh(value) {
      var x = Number(value);
      if (!globalIsFinite(x) || x === 0) { return x; }

      if (_abs(x) < 1) {
        return (Math.expm1(x) - Math.expm1(-x)) / 2;
      }
      return (_exp(x - 1) - _exp(-x - 1)) * E / 2;
    },

    tanh: function tanh(value) {
      var x = Number(value);
      if (numberIsNaN(x) || x === 0) { return x; }
      // can exit early at +-20 as JS loses precision for true value at this integer
      if (x >= 20) { return 1; }
      if (x <= -20) { return -1; }

      return (Math.expm1(x) - Math.expm1(-x)) / (_exp(x) + _exp(-x));
    },

    trunc: function trunc(value) {
      var x = Number(value);
      return x < 0 ? -_floor(-x) : _floor(x);
    },

    imul: function imul(x, y) {
      // taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul
      var a = ES.ToUint32(x);
      var b = ES.ToUint32(y);
      var ah = (a >>> 16) & 0xffff;
      var al = a & 0xffff;
      var bh = (b >>> 16) & 0xffff;
      var bl = b & 0xffff;
      // the shift by 0 fixes the sign on the high part
      // the final |0 converts the unsigned value into a signed value
      return (al * bl) + ((((ah * bl) + (al * bh)) << 16) >>> 0) | 0;
    },

    fround: function fround(x) {
      var v = Number(x);
      if (v === 0 || v === Infinity || v === -Infinity || numberIsNaN(v)) {
        return v;
      }
      var sign = _sign(v);
      var abs = _abs(v);
      if (abs < BINARY_32_MIN_VALUE) {
        return sign * roundTiesToEven(
          abs / BINARY_32_MIN_VALUE / BINARY_32_EPSILON
        ) * BINARY_32_MIN_VALUE * BINARY_32_EPSILON;
      }
      // Veltkamp's splitting (?)
      var a = (1 + (BINARY_32_EPSILON / Number.EPSILON)) * abs;
      var result = a - (a - abs);
      if (result > BINARY_32_MAX_VALUE || numberIsNaN(result)) {
        return sign * Infinity;
      }
      return sign * result;
    }
  };
  defineProperties(Math, MathShims);
  // IE 11 TP has an imprecise log1p: reports Math.log1p(-1e-17) as 0
  defineProperty(Math, 'log1p', MathShims.log1p, Math.log1p(-1e-17) !== -1e-17);
  // IE 11 TP has an imprecise asinh: reports Math.asinh(-1e7) as not exactly equal to -Math.asinh(1e7)
  defineProperty(Math, 'asinh', MathShims.asinh, Math.asinh(-1e7) !== -Math.asinh(1e7));
  // Chrome 40 has an imprecise Math.tanh with very small numbers
  defineProperty(Math, 'tanh', MathShims.tanh, Math.tanh(-2e-17) !== -2e-17);
  // Chrome 40 loses Math.acosh precision with high numbers
  defineProperty(Math, 'acosh', MathShims.acosh, Math.acosh(Number.MAX_VALUE) === Infinity);
  // Firefox 38 on Windows
  defineProperty(Math, 'cbrt', MathShims.cbrt, Math.abs(1 - (Math.cbrt(1e-300) / 1e-100)) / Number.EPSILON > 8);
  // node 0.11 has an imprecise Math.sinh with very small numbers
  defineProperty(Math, 'sinh', MathShims.sinh, Math.sinh(-2e-17) !== -2e-17);
  // FF 35 on Linux reports 22025.465794806725 for Math.expm1(10)
  var expm1OfTen = Math.expm1(10);
  defineProperty(Math, 'expm1', MathShims.expm1, expm1OfTen > 22025.465794806719 || expm1OfTen < 22025.4657948067165168);

  var origMathRound = Math.round;
  // breaks in e.g. Safari 8, Internet Explorer 11, Opera 12
  var roundHandlesBoundaryConditions = Math.round(0.5 - (Number.EPSILON / 4)) === 0 &&
    Math.round(-0.5 + (Number.EPSILON / 3.99)) === 1;

  // When engines use Math.floor(x + 0.5) internally, Math.round can be buggy for large integers.
  // This behavior should be governed by "round to nearest, ties to even mode"
  // see http://www.ecma-international.org/ecma-262/6.0/#sec-terms-and-definitions-number-type
  // These are the boundary cases where it breaks.
  var smallestPositiveNumberWhereRoundBreaks = inverseEpsilon + 1;
  var largestPositiveNumberWhereRoundBreaks = (2 * inverseEpsilon) - 1;
  var roundDoesNotIncreaseIntegers = [
    smallestPositiveNumberWhereRoundBreaks,
    largestPositiveNumberWhereRoundBreaks
  ].every(function (num) {
    return Math.round(num) === num;
  });
  defineProperty(Math, 'round', function round(x) {
    var floor = _floor(x);
    var ceil = floor === -1 ? -0 : floor + 1;
    return x - floor < 0.5 ? floor : ceil;
  }, !roundHandlesBoundaryConditions || !roundDoesNotIncreaseIntegers);
  Value.preserveToString(Math.round, origMathRound);

  var origImul = Math.imul;
  if (Math.imul(0xffffffff, 5) !== -5) {
    // Safari 6.1, at least, reports "0" for this value
    Math.imul = MathShims.imul;
    Value.preserveToString(Math.imul, origImul);
  }
  if (Math.imul.length !== 2) {
    // Safari 8.0.4 has a length of 1
    // fixed in https://bugs.webkit.org/show_bug.cgi?id=143658
    overrideNative(Math, 'imul', function imul(x, y) {
      return ES.Call(origImul, Math, arguments);
    });
  }

  // Promises
  // Simplest possible implementation; use a 3rd-party library if you
  // want the best possible speed and/or long stack traces.
  var PromiseShim = (function () {
    var setTimeout = globals.setTimeout;
    // some environments don't have setTimeout - no way to shim here.
    if (typeof setTimeout !== 'function' && typeof setTimeout !== 'object') { return; }

    ES.IsPromise = function (promise) {
      if (!ES.TypeIsObject(promise)) {
        return false;
      }
      if (typeof promise._promise === 'undefined') {
        return false; // uninitialized, or missing our hidden field.
      }
      return true;
    };

    // "PromiseCapability" in the spec is what most promise implementations
    // call a "deferred".
    var PromiseCapability = function (C) {
      if (!ES.IsConstructor(C)) {
        throw new TypeError('Bad promise constructor');
      }
      var capability = this;
      var resolver = function (resolve, reject) {
        if (capability.resolve !== void 0 || capability.reject !== void 0) {
          throw new TypeError('Bad Promise implementation!');
        }
        capability.resolve = resolve;
        capability.reject = reject;
      };
      // Initialize fields to inform optimizers about the object shape.
      capability.resolve = void 0;
      capability.reject = void 0;
      capability.promise = new C(resolver);
      if (!(ES.IsCallable(capability.resolve) && ES.IsCallable(capability.reject))) {
        throw new TypeError('Bad promise constructor');
      }
    };

    // find an appropriate setImmediate-alike
    var makeZeroTimeout;
    /*global window */
    if (typeof window !== 'undefined' && ES.IsCallable(window.postMessage)) {
      makeZeroTimeout = function () {
        // from http://dbaron.org/log/20100309-faster-timeouts
        var timeouts = [];
        var messageName = 'zero-timeout-message';
        var setZeroTimeout = function (fn) {
          _push(timeouts, fn);
          window.postMessage(messageName, '*');
        };
        var handleMessage = function (event) {
          if (event.source === window && event.data === messageName) {
            event.stopPropagation();
            if (timeouts.length === 0) { return; }
            var fn = _shift(timeouts);
            fn();
          }
        };
        window.addEventListener('message', handleMessage, true);
        return setZeroTimeout;
      };
    }
    var makePromiseAsap = function () {
      // An efficient task-scheduler based on a pre-existing Promise
      // implementation, which we can use even if we override the
      // global Promise below (in order to workaround bugs)
      // https://github.com/Raynos/observ-hash/issues/2#issuecomment-35857671
      var P = globals.Promise;
      var pr = P && P.resolve && P.resolve();
      return pr && function (task) {
        return pr.then(task);
      };
    };
    /*global process */
    /* jscs:disable disallowMultiLineTernary */
    var enqueue = ES.IsCallable(globals.setImmediate) ?
      globals.setImmediate :
      typeof process === 'object' && process.nextTick ? process.nextTick :
      makePromiseAsap() ||
      (ES.IsCallable(makeZeroTimeout) ? makeZeroTimeout() :
      function (task) { setTimeout(task, 0); }); // fallback
    /* jscs:enable disallowMultiLineTernary */

    // Constants for Promise implementation
    var PROMISE_IDENTITY = function (x) { return x; };
    var PROMISE_THROWER = function (e) { throw e; };
    var PROMISE_PENDING = 0;
    var PROMISE_FULFILLED = 1;
    var PROMISE_REJECTED = 2;
    // We store fulfill/reject handlers and capabilities in a single array.
    var PROMISE_FULFILL_OFFSET = 0;
    var PROMISE_REJECT_OFFSET = 1;
    var PROMISE_CAPABILITY_OFFSET = 2;
    // This is used in an optimization for chaining promises via then.
    var PROMISE_FAKE_CAPABILITY = {};

    var enqueuePromiseReactionJob = function (handler, capability, argument) {
      enqueue(function () {
        promiseReactionJob(handler, capability, argument);
      });
    };

    var promiseReactionJob = function (handler, promiseCapability, argument) {
      var handlerResult, f;
      if (promiseCapability === PROMISE_FAKE_CAPABILITY) {
        // Fast case, when we don't actually need to chain through to a
        // (real) promiseCapability.
        return handler(argument);
      }
      try {
        handlerResult = handler(argument);
        f = promiseCapability.resolve;
      } catch (e) {
        handlerResult = e;
        f = promiseCapability.reject;
      }
      f(handlerResult);
    };

    var fulfillPromise = function (promise, value) {
      var _promise = promise._promise;
      var length = _promise.reactionLength;
      if (length > 0) {
        enqueuePromiseReactionJob(
          _promise.fulfillReactionHandler0,
          _promise.reactionCapability0,
          value
        );
        _promise.fulfillReactionHandler0 = void 0;
        _promise.rejectReactions0 = void 0;
        _promise.reactionCapability0 = void 0;
        if (length > 1) {
          for (var i = 1, idx = 0; i < length; i++, idx += 3) {
            enqueuePromiseReactionJob(
              _promise[idx + PROMISE_FULFILL_OFFSET],
              _promise[idx + PROMISE_CAPABILITY_OFFSET],
              value
            );
            promise[idx + PROMISE_FULFILL_OFFSET] = void 0;
            promise[idx + PROMISE_REJECT_OFFSET] = void 0;
            promise[idx + PROMISE_CAPABILITY_OFFSET] = void 0;
          }
        }
      }
      _promise.result = value;
      _promise.state = PROMISE_FULFILLED;
      _promise.reactionLength = 0;
    };

    var rejectPromise = function (promise, reason) {
      var _promise = promise._promise;
      var length = _promise.reactionLength;
      if (length > 0) {
        enqueuePromiseReactionJob(
          _promise.rejectReactionHandler0,
          _promise.reactionCapability0,
          reason
        );
        _promise.fulfillReactionHandler0 = void 0;
        _promise.rejectReactions0 = void 0;
        _promise.reactionCapability0 = void 0;
        if (length > 1) {
          for (var i = 1, idx = 0; i < length; i++, idx += 3) {
            enqueuePromiseReactionJob(
              _promise[idx + PROMISE_REJECT_OFFSET],
              _promise[idx + PROMISE_CAPABILITY_OFFSET],
              reason
            );
            promise[idx + PROMISE_FULFILL_OFFSET] = void 0;
            promise[idx + PROMISE_REJECT_OFFSET] = void 0;
            promise[idx + PROMISE_CAPABILITY_OFFSET] = void 0;
          }
        }
      }
      _promise.result = reason;
      _promise.state = PROMISE_REJECTED;
      _promise.reactionLength = 0;
    };

    var createResolvingFunctions = function (promise) {
      var alreadyResolved = false;
      var resolve = function (resolution) {
        var then;
        if (alreadyResolved) { return; }
        alreadyResolved = true;
        if (resolution === promise) {
          return rejectPromise(promise, new TypeError('Self resolution'));
        }
        if (!ES.TypeIsObject(resolution)) {
          return fulfillPromise(promise, resolution);
        }
        try {
          then = resolution.then;
        } catch (e) {
          return rejectPromise(promise, e);
        }
        if (!ES.IsCallable(then)) {
          return fulfillPromise(promise, resolution);
        }
        enqueue(function () {
          promiseResolveThenableJob(promise, resolution, then);
        });
      };
      var reject = function (reason) {
        if (alreadyResolved) { return; }
        alreadyResolved = true;
        return rejectPromise(promise, reason);
      };
      return { resolve: resolve, reject: reject };
    };

    var optimizedThen = function (then, thenable, resolve, reject) {
      // Optimization: since we discard the result, we can pass our
      // own then implementation a special hint to let it know it
      // doesn't have to create it.  (The PROMISE_FAKE_CAPABILITY
      // object is local to this implementation and unforgeable outside.)
      if (then === Promise$prototype$then) {
        _call(then, thenable, resolve, reject, PROMISE_FAKE_CAPABILITY);
      } else {
        _call(then, thenable, resolve, reject);
      }
    };
    var promiseResolveThenableJob = function (promise, thenable, then) {
      var resolvingFunctions = createResolvingFunctions(promise);
      var resolve = resolvingFunctions.resolve;
      var reject = resolvingFunctions.reject;
      try {
        optimizedThen(then, thenable, resolve, reject);
      } catch (e) {
        reject(e);
      }
    };

    var Promise$prototype, Promise$prototype$then;
    var Promise = (function () {
      var PromiseShim = function Promise(resolver) {
        if (!(this instanceof PromiseShim)) {
          throw new TypeError('Constructor Promise requires "new"');
        }
        if (this && this._promise) {
          throw new TypeError('Bad construction');
        }
        // see https://bugs.ecmascript.org/show_bug.cgi?id=2482
        if (!ES.IsCallable(resolver)) {
          throw new TypeError('not a valid resolver');
        }
        var promise = emulateES6construct(this, PromiseShim, Promise$prototype, {
          _promise: {
            result: void 0,
            state: PROMISE_PENDING,
            // The first member of the "reactions" array is inlined here,
            // since most promises only have one reaction.
            // We've also exploded the 'reaction' object to inline the
            // "handler" and "capability" fields, since both fulfill and
            // reject reactions share the same capability.
            reactionLength: 0,
            fulfillReactionHandler0: void 0,
            rejectReactionHandler0: void 0,
            reactionCapability0: void 0
          }
        });
        var resolvingFunctions = createResolvingFunctions(promise);
        var reject = resolvingFunctions.reject;
        try {
          resolver(resolvingFunctions.resolve, reject);
        } catch (e) {
          reject(e);
        }
        return promise;
      };
      return PromiseShim;
    }());
    Promise$prototype = Promise.prototype;

    var _promiseAllResolver = function (index, values, capability, remaining) {
      var alreadyCalled = false;
      return function (x) {
        if (alreadyCalled) { return; }
        alreadyCalled = true;
        values[index] = x;
        if ((--remaining.count) === 0) {
          var resolve = capability.resolve;
          resolve(values); // call w/ this===undefined
        }
      };
    };

    var performPromiseAll = function (iteratorRecord, C, resultCapability) {
      var it = iteratorRecord.iterator;
      var values = [];
      var remaining = { count: 1 };
      var next, nextValue;
      var index = 0;
      while (true) {
        try {
          next = ES.IteratorStep(it);
          if (next === false) {
            iteratorRecord.done = true;
            break;
          }
          nextValue = next.value;
        } catch (e) {
          iteratorRecord.done = true;
          throw e;
        }
        values[index] = void 0;
        var nextPromise = C.resolve(nextValue);
        var resolveElement = _promiseAllResolver(
          index, values, resultCapability, remaining
        );
        remaining.count += 1;
        optimizedThen(nextPromise.then, nextPromise, resolveElement, resultCapability.reject);
        index += 1;
      }
      if ((--remaining.count) === 0) {
        var resolve = resultCapability.resolve;
        resolve(values); // call w/ this===undefined
      }
      return resultCapability.promise;
    };

    var performPromiseRace = function (iteratorRecord, C, resultCapability) {
      var it = iteratorRecord.iterator;
      var next, nextValue, nextPromise;
      while (true) {
        try {
          next = ES.IteratorStep(it);
          if (next === false) {
            // NOTE: If iterable has no items, resulting promise will never
            // resolve; see:
            // https://github.com/domenic/promises-unwrapping/issues/75
            // https://bugs.ecmascript.org/show_bug.cgi?id=2515
            iteratorRecord.done = true;
            break;
          }
          nextValue = next.value;
        } catch (e) {
          iteratorRecord.done = true;
          throw e;
        }
        nextPromise = C.resolve(nextValue);
        optimizedThen(nextPromise.then, nextPromise, resultCapability.resolve, resultCapability.reject);
      }
      return resultCapability.promise;
    };

    defineProperties(Promise, {
      all: function all(iterable) {
        var C = this;
        if (!ES.TypeIsObject(C)) {
          throw new TypeError('Promise is not object');
        }
        var capability = new PromiseCapability(C);
        var iterator, iteratorRecord;
        try {
          iterator = ES.GetIterator(iterable);
          iteratorRecord = { iterator: iterator, done: false };
          return performPromiseAll(iteratorRecord, C, capability);
        } catch (e) {
          var exception = e;
          if (iteratorRecord && !iteratorRecord.done) {
            try {
              ES.IteratorClose(iterator, true);
            } catch (ee) {
              exception = ee;
            }
          }
          var reject = capability.reject;
          reject(exception);
          return capability.promise;
        }
      },

      race: function race(iterable) {
        var C = this;
        if (!ES.TypeIsObject(C)) {
          throw new TypeError('Promise is not object');
        }
        var capability = new PromiseCapability(C);
        var iterator, iteratorRecord;
        try {
          iterator = ES.GetIterator(iterable);
          iteratorRecord = { iterator: iterator, done: false };
          return performPromiseRace(iteratorRecord, C, capability);
        } catch (e) {
          var exception = e;
          if (iteratorRecord && !iteratorRecord.done) {
            try {
              ES.IteratorClose(iterator, true);
            } catch (ee) {
              exception = ee;
            }
          }
          var reject = capability.reject;
          reject(exception);
          return capability.promise;
        }
      },

      reject: function reject(reason) {
        var C = this;
        if (!ES.TypeIsObject(C)) {
          throw new TypeError('Bad promise constructor');
        }
        var capability = new PromiseCapability(C);
        var rejectFunc = capability.reject;
        rejectFunc(reason); // call with this===undefined
        return capability.promise;
      },

      resolve: function resolve(v) {
        // See https://esdiscuss.org/topic/fixing-promise-resolve for spec
        var C = this;
        if (!ES.TypeIsObject(C)) {
          throw new TypeError('Bad promise constructor');
        }
        if (ES.IsPromise(v)) {
          var constructor = v.constructor;
          if (constructor === C) {
            return v;
          }
        }
        var capability = new PromiseCapability(C);
        var resolveFunc = capability.resolve;
        resolveFunc(v); // call with this===undefined
        return capability.promise;
      }
    });

    defineProperties(Promise$prototype, {
      'catch': function (onRejected) {
        return this.then(null, onRejected);
      },

      then: function then(onFulfilled, onRejected) {
        var promise = this;
        if (!ES.IsPromise(promise)) { throw new TypeError('not a promise'); }
        var C = ES.SpeciesConstructor(promise, Promise);
        var resultCapability;
        var returnValueIsIgnored = arguments.length > 2 && arguments[2] === PROMISE_FAKE_CAPABILITY;
        if (returnValueIsIgnored && C === Promise) {
          resultCapability = PROMISE_FAKE_CAPABILITY;
        } else {
          resultCapability = new PromiseCapability(C);
        }
        // PerformPromiseThen(promise, onFulfilled, onRejected, resultCapability)
        // Note that we've split the 'reaction' object into its two
        // components, "capabilities" and "handler"
        // "capabilities" is always equal to `resultCapability`
        var fulfillReactionHandler = ES.IsCallable(onFulfilled) ? onFulfilled : PROMISE_IDENTITY;
        var rejectReactionHandler = ES.IsCallable(onRejected) ? onRejected : PROMISE_THROWER;
        var _promise = promise._promise;
        var value;
        if (_promise.state === PROMISE_PENDING) {
          if (_promise.reactionLength === 0) {
            _promise.fulfillReactionHandler0 = fulfillReactionHandler;
            _promise.rejectReactionHandler0 = rejectReactionHandler;
            _promise.reactionCapability0 = resultCapability;
          } else {
            var idx = 3 * (_promise.reactionLength - 1);
            _promise[idx + PROMISE_FULFILL_OFFSET] = fulfillReactionHandler;
            _promise[idx + PROMISE_REJECT_OFFSET] = rejectReactionHandler;
            _promise[idx + PROMISE_CAPABILITY_OFFSET] = resultCapability;
          }
          _promise.reactionLength += 1;
        } else if (_promise.state === PROMISE_FULFILLED) {
          value = _promise.result;
          enqueuePromiseReactionJob(
            fulfillReactionHandler, resultCapability, value
          );
        } else if (_promise.state === PROMISE_REJECTED) {
          value = _promise.result;
          enqueuePromiseReactionJob(
            rejectReactionHandler, resultCapability, value
          );
        } else {
          throw new TypeError('unexpected Promise state');
        }
        return resultCapability.promise;
      }
    });
    // This helps the optimizer by ensuring that methods which take
    // capabilities aren't polymorphic.
    PROMISE_FAKE_CAPABILITY = new PromiseCapability(Promise);
    Promise$prototype$then = Promise$prototype.then;

    return Promise;
  }());

  // Chrome's native Promise has extra methods that it shouldn't have. Let's remove them.
  if (globals.Promise) {
    delete globals.Promise.accept;
    delete globals.Promise.defer;
    delete globals.Promise.prototype.chain;
  }

  if (typeof PromiseShim === 'function') {
    // export the Promise constructor.
    defineProperties(globals, { Promise: PromiseShim });
    // In Chrome 33 (and thereabouts) Promise is defined, but the
    // implementation is buggy in a number of ways.  Let's check subclassing
    // support to see if we have a buggy implementation.
    var promiseSupportsSubclassing = supportsSubclassing(globals.Promise, function (S) {
      return S.resolve(42).then(function () {}) instanceof S;
    });
    var promiseIgnoresNonFunctionThenCallbacks = !throwsError(function () {
      globals.Promise.reject(42).then(null, 5).then(null, noop);
    });
    var promiseRequiresObjectContext = throwsError(function () { globals.Promise.call(3, noop); });
    // Promise.resolve() was errata'ed late in the ES6 process.
    // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1170742
    //      https://code.google.com/p/v8/issues/detail?id=4161
    // It serves as a proxy for a number of other bugs in early Promise
    // implementations.
    var promiseResolveBroken = (function (Promise) {
      var p = Promise.resolve(5);
      p.constructor = {};
      var p2 = Promise.resolve(p);
      try {
        p2.then(null, noop).then(null, noop); // avoid "uncaught rejection" warnings in console
      } catch (e) {
        return true; // v8 native Promises break here https://code.google.com/p/chromium/issues/detail?id=575314
      }
      return p === p2; // This *should* be false!
    }(globals.Promise));

    // Chrome 46 (probably older too) does not retrieve a thenable's .then synchronously
    var getsThenSynchronously = supportsDescriptors && (function () {
      var count = 0;
      var thenable = Object.defineProperty({}, 'then', { get: function () { count += 1; } });
      Promise.resolve(thenable);
      return count === 1;
    }());

    var BadResolverPromise = function BadResolverPromise(executor) {
      var p = new Promise(executor);
      executor(3, function () {});
      this.then = p.then;
      this.constructor = BadResolverPromise;
    };
    BadResolverPromise.prototype = Promise.prototype;
    BadResolverPromise.all = Promise.all;
    // Chrome Canary 49 (probably older too) has some implementation bugs
    var hasBadResolverPromise = valueOrFalseIfThrows(function () {
      return !!BadResolverPromise.all([1, 2]);
    });

    if (!promiseSupportsSubclassing || !promiseIgnoresNonFunctionThenCallbacks ||
        !promiseRequiresObjectContext || promiseResolveBroken ||
        !getsThenSynchronously || hasBadResolverPromise) {
      /* globals Promise: true */
      /* eslint-disable no-undef, no-global-assign */
      /* jshint -W020 */
      Promise = PromiseShim;
      /* jshint +W020 */
      /* eslint-enable no-undef, no-global-assign */
      /* globals Promise: false */
      overrideNative(globals, 'Promise', PromiseShim);
    }
    if (Promise.all.length !== 1) {
      var origAll = Promise.all;
      overrideNative(Promise, 'all', function all(iterable) {
        return ES.Call(origAll, this, arguments);
      });
    }
    if (Promise.race.length !== 1) {
      var origRace = Promise.race;
      overrideNative(Promise, 'race', function race(iterable) {
        return ES.Call(origRace, this, arguments);
      });
    }
    if (Promise.resolve.length !== 1) {
      var origResolve = Promise.resolve;
      overrideNative(Promise, 'resolve', function resolve(x) {
        return ES.Call(origResolve, this, arguments);
      });
    }
    if (Promise.reject.length !== 1) {
      var origReject = Promise.reject;
      overrideNative(Promise, 'reject', function reject(r) {
        return ES.Call(origReject, this, arguments);
      });
    }
    ensureEnumerable(Promise, 'all');
    ensureEnumerable(Promise, 'race');
    ensureEnumerable(Promise, 'resolve');
    ensureEnumerable(Promise, 'reject');
    addDefaultSpecies(Promise);
  }

  // Map and Set require a true ES5 environment
  // Their fast path also requires that the environment preserve
  // property insertion order, which is not guaranteed by the spec.
  var testOrder = function (a) {
    var b = keys(_reduce(a, function (o, k) {
      o[k] = true;
      return o;
    }, {}));
    return a.join(':') === b.join(':');
  };
  var preservesInsertionOrder = testOrder(['z', 'a', 'bb']);
  // some engines (eg, Chrome) only preserve insertion order for string keys
  var preservesNumericInsertionOrder = testOrder(['z', 1, 'a', '3', 2]);

  if (supportsDescriptors) {

    var fastkey = function fastkey(key, skipInsertionOrderCheck) {
      if (!skipInsertionOrderCheck && !preservesInsertionOrder) {
        return null;
      }
      if (isNullOrUndefined(key)) {
        return '^' + ES.ToString(key);
      } else if (typeof key === 'string') {
        return '$' + key;
      } else if (typeof key === 'number') {
        // note that -0 will get coerced to "0" when used as a property key
        if (!preservesNumericInsertionOrder) {
          return 'n' + key;
        }
        return key;
      } else if (typeof key === 'boolean') {
        return 'b' + key;
      }
      return null;
    };

    var emptyObject = function emptyObject() {
      // accomodate some older not-quite-ES5 browsers
      return Object.create ? Object.create(null) : {};
    };

    var addIterableToMap = function addIterableToMap(MapConstructor, map, iterable) {
      if (isArray(iterable) || Type.string(iterable)) {
        _forEach(iterable, function (entry) {
          if (!ES.TypeIsObject(entry)) {
            throw new TypeError('Iterator value ' + entry + ' is not an entry object');
          }
          map.set(entry[0], entry[1]);
        });
      } else if (iterable instanceof MapConstructor) {
        _call(MapConstructor.prototype.forEach, iterable, function (value, key) {
          map.set(key, value);
        });
      } else {
        var iter, adder;
        if (!isNullOrUndefined(iterable)) {
          adder = map.set;
          if (!ES.IsCallable(adder)) { throw new TypeError('bad map'); }
          iter = ES.GetIterator(iterable);
        }
        if (typeof iter !== 'undefined') {
          while (true) {
            var next = ES.IteratorStep(iter);
            if (next === false) { break; }
            var nextItem = next.value;
            try {
              if (!ES.TypeIsObject(nextItem)) {
                throw new TypeError('Iterator value ' + nextItem + ' is not an entry object');
              }
              _call(adder, map, nextItem[0], nextItem[1]);
            } catch (e) {
              ES.IteratorClose(iter, true);
              throw e;
            }
          }
        }
      }
    };
    var addIterableToSet = function addIterableToSet(SetConstructor, set, iterable) {
      if (isArray(iterable) || Type.string(iterable)) {
        _forEach(iterable, function (value) {
          set.add(value);
        });
      } else if (iterable instanceof SetConstructor) {
        _call(SetConstructor.prototype.forEach, iterable, function (value) {
          set.add(value);
        });
      } else {
        var iter, adder;
        if (!isNullOrUndefined(iterable)) {
          adder = set.add;
          if (!ES.IsCallable(adder)) { throw new TypeError('bad set'); }
          iter = ES.GetIterator(iterable);
        }
        if (typeof iter !== 'undefined') {
          while (true) {
            var next = ES.IteratorStep(iter);
            if (next === false) { break; }
            var nextValue = next.value;
            try {
              _call(adder, set, nextValue);
            } catch (e) {
              ES.IteratorClose(iter, true);
              throw e;
            }
          }
        }
      }
    };

    var collectionShims = {
      Map: (function () {

        var empty = {};

        var MapEntry = function MapEntry(key, value) {
          this.key = key;
          this.value = value;
          this.next = null;
          this.prev = null;
        };

        MapEntry.prototype.isRemoved = function isRemoved() {
          return this.key === empty;
        };

        var isMap = function isMap(map) {
          return !!map._es6map;
        };

        var requireMapSlot = function requireMapSlot(map, method) {
          if (!ES.TypeIsObject(map) || !isMap(map)) {
            throw new TypeError('Method Map.prototype.' + method + ' called on incompatible receiver ' + ES.ToString(map));
          }
        };

        var MapIterator = function MapIterator(map, kind) {
          requireMapSlot(map, '[[MapIterator]]');
          this.head = map._head;
          this.i = this.head;
          this.kind = kind;
        };

        MapIterator.prototype = {
          next: function next() {
            var i = this.i;
            var kind = this.kind;
            var head = this.head;
            if (typeof this.i === 'undefined') {
              return iteratorResult();
            }
            while (i.isRemoved() && i !== head) {
              // back up off of removed entries
              i = i.prev;
            }
            // advance to next unreturned element.
            var result;
            while (i.next !== head) {
              i = i.next;
              if (!i.isRemoved()) {
                if (kind === 'key') {
                  result = i.key;
                } else if (kind === 'value') {
                  result = i.value;
                } else {
                  result = [i.key, i.value];
                }
                this.i = i;
                return iteratorResult(result);
              }
            }
            // once the iterator is done, it is done forever.
            this.i = void 0;
            return iteratorResult();
          }
        };
        addIterator(MapIterator.prototype);

        var Map$prototype;
        var MapShim = function Map() {
          if (!(this instanceof Map)) {
            throw new TypeError('Constructor Map requires "new"');
          }
          if (this && this._es6map) {
            throw new TypeError('Bad construction');
          }
          var map = emulateES6construct(this, Map, Map$prototype, {
            _es6map: true,
            _head: null,
            _map: OrigMap ? new OrigMap() : null,
            _size: 0,
            _storage: emptyObject()
          });

          var head = new MapEntry(null, null);
          // circular doubly-linked list.
          /* eslint no-multi-assign: 1 */
          head.next = head.prev = head;
          map._head = head;

          // Optionally initialize map from iterable
          if (arguments.length > 0) {
            addIterableToMap(Map, map, arguments[0]);
          }
          return map;
        };
        Map$prototype = MapShim.prototype;

        Value.getter(Map$prototype, 'size', function () {
          if (typeof this._size === 'undefined') {
            throw new TypeError('size method called on incompatible Map');
          }
          return this._size;
        });

        defineProperties(Map$prototype, {
          get: function get(key) {
            requireMapSlot(this, 'get');
            var entry;
            var fkey = fastkey(key, true);
            if (fkey !== null) {
              // fast O(1) path
              entry = this._storage[fkey];
              if (entry) {
                return entry.value;
              } else {
                return;
              }
            }
            if (this._map) {
              // fast object key path
              entry = origMapGet.call(this._map, key);
              if (entry) {
                return entry.value;
              } else {
                return;
              }
            }
            var head = this._head;
            var i = head;
            while ((i = i.next) !== head) {
              if (ES.SameValueZero(i.key, key)) {
                return i.value;
              }
            }
          },

          has: function has(key) {
            requireMapSlot(this, 'has');
            var fkey = fastkey(key, true);
            if (fkey !== null) {
              // fast O(1) path
              return typeof this._storage[fkey] !== 'undefined';
            }
            if (this._map) {
              // fast object key path
              return origMapHas.call(this._map, key);
            }
            var head = this._head;
            var i = head;
            while ((i = i.next) !== head) {
              if (ES.SameValueZero(i.key, key)) {
                return true;
              }
            }
            return false;
          },

          set: function set(key, value) {
            requireMapSlot(this, 'set');
            var head = this._head;
            var i = head;
            var entry;
            var fkey = fastkey(key, true);
            if (fkey !== null) {
              // fast O(1) path
              if (typeof this._storage[fkey] !== 'undefined') {
                this._storage[fkey].value = value;
                return this;
              } else {
                entry = this._storage[fkey] = new MapEntry(key, value); /* eslint no-multi-assign: 1 */
                i = head.prev;
                // fall through
              }
            } else if (this._map) {
              // fast object key path
              if (origMapHas.call(this._map, key)) {
                origMapGet.call(this._map, key).value = value;
              } else {
                entry = new MapEntry(key, value);
                origMapSet.call(this._map, key, entry);
                i = head.prev;
                // fall through
              }
            }
            while ((i = i.next) !== head) {
              if (ES.SameValueZero(i.key, key)) {
                i.value = value;
                return this;
              }
            }
            entry = entry || new MapEntry(key, value);
            if (ES.SameValue(-0, key)) {
              entry.key = +0; // coerce -0 to +0 in entry
            }
            entry.next = this._head;
            entry.prev = this._head.prev;
            entry.prev.next = entry;
            entry.next.prev = entry;
            this._size += 1;
            return this;
          },

          'delete': function (key) {
            requireMapSlot(this, 'delete');
            var head = this._head;
            var i = head;
            var fkey = fastkey(key, true);
            if (fkey !== null) {
              // fast O(1) path
              if (typeof this._storage[fkey] === 'undefined') {
                return false;
              }
              i = this._storage[fkey].prev;
              delete this._storage[fkey];
              // fall through
            } else if (this._map) {
              // fast object key path
              if (!origMapHas.call(this._map, key)) {
                return false;
              }
              i = origMapGet.call(this._map, key).prev;
              origMapDelete.call(this._map, key);
              // fall through
            }
            while ((i = i.next) !== head) {
              if (ES.SameValueZero(i.key, key)) {
                i.key = empty;
                i.value = empty;
                i.prev.next = i.next;
                i.next.prev = i.prev;
                this._size -= 1;
                return true;
              }
            }
            return false;
          },

          clear: function clear() {
             /* eslint no-multi-assign: 1 */
            requireMapSlot(this, 'clear');
            this._map = OrigMap ? new OrigMap() : null;
            this._size = 0;
            this._storage = emptyObject();
            var head = this._head;
            var i = head;
            var p = i.next;
            while ((i = p) !== head) {
              i.key = empty;
              i.value = empty;
              p = i.next;
              i.next = i.prev = head;
            }
            head.next = head.prev = head;
          },

          keys: function keys() {
            requireMapSlot(this, 'keys');
            return new MapIterator(this, 'key');
          },

          values: function values() {
            requireMapSlot(this, 'values');
            return new MapIterator(this, 'value');
          },

          entries: function entries() {
            requireMapSlot(this, 'entries');
            return new MapIterator(this, 'key+value');
          },

          forEach: function forEach(callback) {
            requireMapSlot(this, 'forEach');
            var context = arguments.length > 1 ? arguments[1] : null;
            var it = this.entries();
            for (var entry = it.next(); !entry.done; entry = it.next()) {
              if (context) {
                _call(callback, context, entry.value[1], entry.value[0], this);
              } else {
                callback(entry.value[1], entry.value[0], this);
              }
            }
          }
        });
        addIterator(Map$prototype, Map$prototype.entries);

        return MapShim;
      }()),

      Set: (function () {
        var isSet = function isSet(set) {
          return set._es6set && typeof set._storage !== 'undefined';
        };
        var requireSetSlot = function requireSetSlot(set, method) {
          if (!ES.TypeIsObject(set) || !isSet(set)) {
            // https://github.com/paulmillr/es6-shim/issues/176
            throw new TypeError('Set.prototype.' + method + ' called on incompatible receiver ' + ES.ToString(set));
          }
        };

        // Creating a Map is expensive.  To speed up the common case of
        // Sets containing only string or numeric keys, we use an object
        // as backing storage and lazily create a full Map only when
        // required.
        var Set$prototype;
        var SetShim = function Set() {
          if (!(this instanceof Set)) {
            throw new TypeError('Constructor Set requires "new"');
          }
          if (this && this._es6set) {
            throw new TypeError('Bad construction');
          }
          var set = emulateES6construct(this, Set, Set$prototype, {
            _es6set: true,
            '[[SetData]]': null,
            _storage: emptyObject()
          });
          if (!set._es6set) {
            throw new TypeError('bad set');
          }

          // Optionally initialize Set from iterable
          if (arguments.length > 0) {
            addIterableToSet(Set, set, arguments[0]);
          }
          return set;
        };
        Set$prototype = SetShim.prototype;

        var decodeKey = function (key) {
          var k = key;
          if (k === '^null') {
            return null;
          } else if (k === '^undefined') {
            return void 0;
          } else {
            var first = k.charAt(0);
            if (first === '$') {
              return _strSlice(k, 1);
            } else if (first === 'n') {
              return +_strSlice(k, 1);
            } else if (first === 'b') {
              return k === 'btrue';
            }
          }
          return +k;
        };
        // Switch from the object backing storage to a full Map.
        var ensureMap = function ensureMap(set) {
          if (!set['[[SetData]]']) {
            var m = new collectionShims.Map();
            set['[[SetData]]'] = m;
            _forEach(keys(set._storage), function (key) {
              var k = decodeKey(key);
              m.set(k, k);
            });
            set['[[SetData]]'] = m;
          }
          set._storage = null; // free old backing storage
        };

        Value.getter(SetShim.prototype, 'size', function () {
          requireSetSlot(this, 'size');
          if (this._storage) {
            return keys(this._storage).length;
          }
          ensureMap(this);
          return this['[[SetData]]'].size;
        });

        defineProperties(SetShim.prototype, {
          has: function has(key) {
            requireSetSlot(this, 'has');
            var fkey;
            if (this._storage && (fkey = fastkey(key)) !== null) {
              return !!this._storage[fkey];
            }
            ensureMap(this);
            return this['[[SetData]]'].has(key);
          },

          add: function add(key) {
            requireSetSlot(this, 'add');
            var fkey;
            if (this._storage && (fkey = fastkey(key)) !== null) {
              this._storage[fkey] = true;
              return this;
            }
            ensureMap(this);
            this['[[SetData]]'].set(key, key);
            return this;
          },

          'delete': function (key) {
            requireSetSlot(this, 'delete');
            var fkey;
            if (this._storage && (fkey = fastkey(key)) !== null) {
              var hasFKey = _hasOwnProperty(this._storage, fkey);
              return (delete this._storage[fkey]) && hasFKey;
            }
            ensureMap(this);
            return this['[[SetData]]']['delete'](key);
          },

          clear: function clear() {
            requireSetSlot(this, 'clear');
            if (this._storage) {
              this._storage = emptyObject();
            }
            if (this['[[SetData]]']) {
              this['[[SetData]]'].clear();
            }
          },

          values: function values() {
            requireSetSlot(this, 'values');
            ensureMap(this);
            return this['[[SetData]]'].values();
          },

          entries: function entries() {
            requireSetSlot(this, 'entries');
            ensureMap(this);
            return this['[[SetData]]'].entries();
          },

          forEach: function forEach(callback) {
            requireSetSlot(this, 'forEach');
            var context = arguments.length > 1 ? arguments[1] : null;
            var entireSet = this;
            ensureMap(entireSet);
            this['[[SetData]]'].forEach(function (value, key) {
              if (context) {
                _call(callback, context, key, key, entireSet);
              } else {
                callback(key, key, entireSet);
              }
            });
          }
        });
        defineProperty(SetShim.prototype, 'keys', SetShim.prototype.values, true);
        addIterator(SetShim.prototype, SetShim.prototype.values);

        return SetShim;
      }())
    };

    if (globals.Map || globals.Set) {
      // Safari 8, for example, doesn't accept an iterable.
      var mapAcceptsArguments = valueOrFalseIfThrows(function () { return new Map([[1, 2]]).get(1) === 2; });
      if (!mapAcceptsArguments) {
        globals.Map = function Map() {
          if (!(this instanceof Map)) {
            throw new TypeError('Constructor Map requires "new"');
          }
          var m = new OrigMap();
          if (arguments.length > 0) {
            addIterableToMap(Map, m, arguments[0]);
          }
          delete m.constructor;
          Object.setPrototypeOf(m, globals.Map.prototype);
          return m;
        };
        globals.Map.prototype = create(OrigMap.prototype);
        defineProperty(globals.Map.prototype, 'constructor', globals.Map, true);
        Value.preserveToString(globals.Map, OrigMap);
      }
      var testMap = new Map();
      var mapUsesSameValueZero = (function () {
        // Chrome 38-42, node 0.11/0.12, iojs 1/2 also have a bug when the Map has a size > 4
        var m = new Map([[1, 0], [2, 0], [3, 0], [4, 0]]);
        m.set(-0, m);
        return m.get(0) === m && m.get(-0) === m && m.has(0) && m.has(-0);
      }());
      var mapSupportsChaining = testMap.set(1, 2) === testMap;
      if (!mapUsesSameValueZero || !mapSupportsChaining) {
        overrideNative(Map.prototype, 'set', function set(k, v) {
          _call(origMapSet, this, k === 0 ? 0 : k, v);
          return this;
        });
      }
      if (!mapUsesSameValueZero) {
        defineProperties(Map.prototype, {
          get: function get(k) {
            return _call(origMapGet, this, k === 0 ? 0 : k);
          },
          has: function has(k) {
            return _call(origMapHas, this, k === 0 ? 0 : k);
          }
        }, true);
        Value.preserveToString(Map.prototype.get, origMapGet);
        Value.preserveToString(Map.prototype.has, origMapHas);
      }
      var testSet = new Set();
      var setUsesSameValueZero = (function (s) {
        s['delete'](0);
        s.add(-0);
        return !s.has(0);
      }(testSet));
      var setSupportsChaining = testSet.add(1) === testSet;
      if (!setUsesSameValueZero || !setSupportsChaining) {
        var origSetAdd = Set.prototype.add;
        Set.prototype.add = function add(v) {
          _call(origSetAdd, this, v === 0 ? 0 : v);
          return this;
        };
        Value.preserveToString(Set.prototype.add, origSetAdd);
      }
      if (!setUsesSameValueZero) {
        var origSetHas = Set.prototype.has;
        Set.prototype.has = function has(v) {
          return _call(origSetHas, this, v === 0 ? 0 : v);
        };
        Value.preserveToString(Set.prototype.has, origSetHas);
        var origSetDel = Set.prototype['delete'];
        Set.prototype['delete'] = function SetDelete(v) {
          return _call(origSetDel, this, v === 0 ? 0 : v);
        };
        Value.preserveToString(Set.prototype['delete'], origSetDel);
      }
      var mapSupportsSubclassing = supportsSubclassing(globals.Map, function (M) {
        var m = new M([]);
        // Firefox 32 is ok with the instantiating the subclass but will
        // throw when the map is used.
        m.set(42, 42);
        return m instanceof M;
      });
      // without Object.setPrototypeOf, subclassing is not possible
      var mapFailsToSupportSubclassing = Object.setPrototypeOf && !mapSupportsSubclassing;
      var mapRequiresNew = (function () {
        try {
          return !(globals.Map() instanceof globals.Map);
        } catch (e) {
          return e instanceof TypeError;
        }
      }());
      if (globals.Map.length !== 0 || mapFailsToSupportSubclassing || !mapRequiresNew) {
        globals.Map = function Map() {
          if (!(this instanceof Map)) {
            throw new TypeError('Constructor Map requires "new"');
          }
          var m = new OrigMap();
          if (arguments.length > 0) {
            addIterableToMap(Map, m, arguments[0]);
          }
          delete m.constructor;
          Object.setPrototypeOf(m, Map.prototype);
          return m;
        };
        globals.Map.prototype = OrigMap.prototype;
        defineProperty(globals.Map.prototype, 'constructor', globals.Map, true);
        Value.preserveToString(globals.Map, OrigMap);
      }
      var setSupportsSubclassing = supportsSubclassing(globals.Set, function (S) {
        var s = new S([]);
        s.add(42, 42);
        return s instanceof S;
      });
      // without Object.setPrototypeOf, subclassing is not possible
      var setFailsToSupportSubclassing = Object.setPrototypeOf && !setSupportsSubclassing;
      var setRequiresNew = (function () {
        try {
          return !(globals.Set() instanceof globals.Set);
        } catch (e) {
          return e instanceof TypeError;
        }
      }());
      if (globals.Set.length !== 0 || setFailsToSupportSubclassing || !setRequiresNew) {
        var OrigSet = globals.Set;
        globals.Set = function Set() {
          if (!(this instanceof Set)) {
            throw new TypeError('Constructor Set requires "new"');
          }
          var s = new OrigSet();
          if (arguments.length > 0) {
            addIterableToSet(Set, s, arguments[0]);
          }
          delete s.constructor;
          Object.setPrototypeOf(s, Set.prototype);
          return s;
        };
        globals.Set.prototype = OrigSet.prototype;
        defineProperty(globals.Set.prototype, 'constructor', globals.Set, true);
        Value.preserveToString(globals.Set, OrigSet);
      }
      var newMap = new globals.Map();
      var mapIterationThrowsStopIterator = !valueOrFalseIfThrows(function () {
        return newMap.keys().next().done;
      });
      /*
        - In Firefox < 23, Map#size is a function.
        - In all current Firefox, Set#entries/keys/values & Map#clear do not exist
        - https://bugzilla.mozilla.org/show_bug.cgi?id=869996
        - In Firefox 24, Map and Set do not implement forEach
        - In Firefox 25 at least, Map and Set are callable without "new"
      */
      if (
        typeof globals.Map.prototype.clear !== 'function' ||
        new globals.Set().size !== 0 ||
        newMap.size !== 0 ||
        typeof globals.Map.prototype.keys !== 'function' ||
        typeof globals.Set.prototype.keys !== 'function' ||
        typeof globals.Map.prototype.forEach !== 'function' ||
        typeof globals.Set.prototype.forEach !== 'function' ||
        isCallableWithoutNew(globals.Map) ||
        isCallableWithoutNew(globals.Set) ||
        typeof newMap.keys().next !== 'function' || // Safari 8
        mapIterationThrowsStopIterator || // Firefox 25
        !mapSupportsSubclassing
      ) {
        defineProperties(globals, {
          Map: collectionShims.Map,
          Set: collectionShims.Set
        }, true);
      }

      if (globals.Set.prototype.keys !== globals.Set.prototype.values) {
        // Fixed in WebKit with https://bugs.webkit.org/show_bug.cgi?id=144190
        defineProperty(globals.Set.prototype, 'keys', globals.Set.prototype.values, true);
      }

      // Shim incomplete iterator implementations.
      addIterator(Object.getPrototypeOf((new globals.Map()).keys()));
      addIterator(Object.getPrototypeOf((new globals.Set()).keys()));

      if (functionsHaveNames && globals.Set.prototype.has.name !== 'has') {
        // Microsoft Edge v0.11.10074.0 is missing a name on Set#has
        var anonymousSetHas = globals.Set.prototype.has;
        overrideNative(globals.Set.prototype, 'has', function has(key) {
          return _call(anonymousSetHas, this, key);
        });
      }
    }
    defineProperties(globals, collectionShims);
    addDefaultSpecies(globals.Map);
    addDefaultSpecies(globals.Set);
  }

  var throwUnlessTargetIsObject = function throwUnlessTargetIsObject(target) {
    if (!ES.TypeIsObject(target)) {
      throw new TypeError('target must be an object');
    }
  };

  // Some Reflect methods are basically the same as
  // those on the Object global, except that a TypeError is thrown if
  // target isn't an object. As well as returning a boolean indicating
  // the success of the operation.
  var ReflectShims = {
    // Apply method in a functional form.
    apply: function apply() {
      return ES.Call(ES.Call, null, arguments);
    },

    // New operator in a functional form.
    construct: function construct(constructor, args) {
      if (!ES.IsConstructor(constructor)) {
        throw new TypeError('First argument must be a constructor.');
      }
      var newTarget = arguments.length > 2 ? arguments[2] : constructor;
      if (!ES.IsConstructor(newTarget)) {
        throw new TypeError('new.target must be a constructor.');
      }
      return ES.Construct(constructor, args, newTarget, 'internal');
    },

    // When deleting a non-existent or configurable property,
    // true is returned.
    // When attempting to delete a non-configurable property,
    // it will return false.
    deleteProperty: function deleteProperty(target, key) {
      throwUnlessTargetIsObject(target);
      if (supportsDescriptors) {
        var desc = Object.getOwnPropertyDescriptor(target, key);

        if (desc && !desc.configurable) {
          return false;
        }
      }

      // Will return true.
      return delete target[key];
    },

    has: function has(target, key) {
      throwUnlessTargetIsObject(target);
      return key in target;
    }
  };

  if (Object.getOwnPropertyNames) {
    Object.assign(ReflectShims, {
      // Basically the result of calling the internal [[OwnPropertyKeys]].
      // Concatenating propertyNames and propertySymbols should do the trick.
      // This should continue to work together with a Symbol shim
      // which overrides Object.getOwnPropertyNames and implements
      // Object.getOwnPropertySymbols.
      ownKeys: function ownKeys(target) {
        throwUnlessTargetIsObject(target);
        var keys = Object.getOwnPropertyNames(target);

        if (ES.IsCallable(Object.getOwnPropertySymbols)) {
          _pushApply(keys, Object.getOwnPropertySymbols(target));
        }

        return keys;
      }
    });
  }

  var callAndCatchException = function ConvertExceptionToBoolean(func) {
    return !throwsError(func);
  };

  if (Object.preventExtensions) {
    Object.assign(ReflectShims, {
      isExtensible: function isExtensible(target) {
        throwUnlessTargetIsObject(target);
        return Object.isExtensible(target);
      },
      preventExtensions: function preventExtensions(target) {
        throwUnlessTargetIsObject(target);
        return callAndCatchException(function () {
          Object.preventExtensions(target);
        });
      }
    });
  }

  if (supportsDescriptors) {
    var internalGet = function get(target, key, receiver) {
      var desc = Object.getOwnPropertyDescriptor(target, key);

      if (!desc) {
        var parent = Object.getPrototypeOf(target);

        if (parent === null) {
          return void 0;
        }

        return internalGet(parent, key, receiver);
      }

      if ('value' in desc) {
        return desc.value;
      }

      if (desc.get) {
        return ES.Call(desc.get, receiver);
      }

      return void 0;
    };

    var internalSet = function set(target, key, value, receiver) {
      var desc = Object.getOwnPropertyDescriptor(target, key);

      if (!desc) {
        var parent = Object.getPrototypeOf(target);

        if (parent !== null) {
          return internalSet(parent, key, value, receiver);
        }

        desc = {
          value: void 0,
          writable: true,
          enumerable: true,
          configurable: true
        };
      }

      if ('value' in desc) {
        if (!desc.writable) {
          return false;
        }

        if (!ES.TypeIsObject(receiver)) {
          return false;
        }

        var existingDesc = Object.getOwnPropertyDescriptor(receiver, key);

        if (existingDesc) {
          return Reflect.defineProperty(receiver, key, {
            value: value
          });
        } else {
          return Reflect.defineProperty(receiver, key, {
            value: value,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }

      if (desc.set) {
        _call(desc.set, receiver, value);
        return true;
      }

      return false;
    };

    Object.assign(ReflectShims, {
      defineProperty: function defineProperty(target, propertyKey, attributes) {
        throwUnlessTargetIsObject(target);
        return callAndCatchException(function () {
          Object.defineProperty(target, propertyKey, attributes);
        });
      },

      getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
        throwUnlessTargetIsObject(target);
        return Object.getOwnPropertyDescriptor(target, propertyKey);
      },

      // Syntax in a functional form.
      get: function get(target, key) {
        throwUnlessTargetIsObject(target);
        var receiver = arguments.length > 2 ? arguments[2] : target;

        return internalGet(target, key, receiver);
      },

      set: function set(target, key, value) {
        throwUnlessTargetIsObject(target);
        var receiver = arguments.length > 3 ? arguments[3] : target;

        return internalSet(target, key, value, receiver);
      }
    });
  }

  if (Object.getPrototypeOf) {
    var objectDotGetPrototypeOf = Object.getPrototypeOf;
    ReflectShims.getPrototypeOf = function getPrototypeOf(target) {
      throwUnlessTargetIsObject(target);
      return objectDotGetPrototypeOf(target);
    };
  }

  if (Object.setPrototypeOf && ReflectShims.getPrototypeOf) {
    var willCreateCircularPrototype = function (object, lastProto) {
      var proto = lastProto;
      while (proto) {
        if (object === proto) {
          return true;
        }
        proto = ReflectShims.getPrototypeOf(proto);
      }
      return false;
    };

    Object.assign(ReflectShims, {
      // Sets the prototype of the given object.
      // Returns true on success, otherwise false.
      setPrototypeOf: function setPrototypeOf(object, proto) {
        throwUnlessTargetIsObject(object);
        if (proto !== null && !ES.TypeIsObject(proto)) {
          throw new TypeError('proto must be an object or null');
        }

        // If they already are the same, we're done.
        if (proto === Reflect.getPrototypeOf(object)) {
          return true;
        }

        // Cannot alter prototype if object not extensible.
        if (Reflect.isExtensible && !Reflect.isExtensible(object)) {
          return false;
        }

        // Ensure that we do not create a circular prototype chain.
        if (willCreateCircularPrototype(object, proto)) {
          return false;
        }

        Object.setPrototypeOf(object, proto);

        return true;
      }
    });
  }
  var defineOrOverrideReflectProperty = function (key, shim) {
    if (!ES.IsCallable(globals.Reflect[key])) {
      defineProperty(globals.Reflect, key, shim);
    } else {
      var acceptsPrimitives = valueOrFalseIfThrows(function () {
        globals.Reflect[key](1);
        globals.Reflect[key](NaN);
        globals.Reflect[key](true);
        return true;
      });
      if (acceptsPrimitives) {
        overrideNative(globals.Reflect, key, shim);
      }
    }
  };
  Object.keys(ReflectShims).forEach(function (key) {
    defineOrOverrideReflectProperty(key, ReflectShims[key]);
  });
  var originalReflectGetProto = globals.Reflect.getPrototypeOf;
  if (functionsHaveNames && originalReflectGetProto && originalReflectGetProto.name !== 'getPrototypeOf') {
    overrideNative(globals.Reflect, 'getPrototypeOf', function getPrototypeOf(target) {
      return _call(originalReflectGetProto, globals.Reflect, target);
    });
  }
  if (globals.Reflect.setPrototypeOf) {
    if (valueOrFalseIfThrows(function () {
      globals.Reflect.setPrototypeOf(1, {});
      return true;
    })) {
      overrideNative(globals.Reflect, 'setPrototypeOf', ReflectShims.setPrototypeOf);
    }
  }
  if (globals.Reflect.defineProperty) {
    if (!valueOrFalseIfThrows(function () {
      var basic = !globals.Reflect.defineProperty(1, 'test', { value: 1 });
      // "extensible" fails on Edge 0.12
      var extensible = typeof Object.preventExtensions !== 'function' || !globals.Reflect.defineProperty(Object.preventExtensions({}), 'test', {});
      return basic && extensible;
    })) {
      overrideNative(globals.Reflect, 'defineProperty', ReflectShims.defineProperty);
    }
  }
  if (globals.Reflect.construct) {
    if (!valueOrFalseIfThrows(function () {
      var F = function F() {};
      return globals.Reflect.construct(function () {}, [], F) instanceof F;
    })) {
      overrideNative(globals.Reflect, 'construct', ReflectShims.construct);
    }
  }

  if (String(new Date(NaN)) !== 'Invalid Date') {
    var dateToString = Date.prototype.toString;
    var shimmedDateToString = function toString() {
      var valueOf = +this;
      if (valueOf !== valueOf) {
        return 'Invalid Date';
      }
      return ES.Call(dateToString, this);
    };
    overrideNative(Date.prototype, 'toString', shimmedDateToString);
  }

  // Annex B HTML methods
  // http://www.ecma-international.org/ecma-262/6.0/#sec-additional-properties-of-the-string.prototype-object
  var stringHTMLshims = {
    anchor: function anchor(name) { return ES.CreateHTML(this, 'a', 'name', name); },
    big: function big() { return ES.CreateHTML(this, 'big', '', ''); },
    blink: function blink() { return ES.CreateHTML(this, 'blink', '', ''); },
    bold: function bold() { return ES.CreateHTML(this, 'b', '', ''); },
    fixed: function fixed() { return ES.CreateHTML(this, 'tt', '', ''); },
    fontcolor: function fontcolor(color) { return ES.CreateHTML(this, 'font', 'color', color); },
    fontsize: function fontsize(size) { return ES.CreateHTML(this, 'font', 'size', size); },
    italics: function italics() { return ES.CreateHTML(this, 'i', '', ''); },
    link: function link(url) { return ES.CreateHTML(this, 'a', 'href', url); },
    small: function small() { return ES.CreateHTML(this, 'small', '', ''); },
    strike: function strike() { return ES.CreateHTML(this, 'strike', '', ''); },
    sub: function sub() { return ES.CreateHTML(this, 'sub', '', ''); },
    sup: function sub() { return ES.CreateHTML(this, 'sup', '', ''); }
  };
  _forEach(Object.keys(stringHTMLshims), function (key) {
    var method = String.prototype[key];
    var shouldOverwrite = false;
    if (ES.IsCallable(method)) {
      var output = _call(method, '', ' " ');
      var quotesCount = _concat([], output.match(/"/g)).length;
      shouldOverwrite = output !== output.toLowerCase() || quotesCount > 2;
    } else {
      shouldOverwrite = true;
    }
    if (shouldOverwrite) {
      overrideNative(String.prototype, key, stringHTMLshims[key]);
    }
  });

  var JSONstringifiesSymbols = (function () {
    // Microsoft Edge v0.12 stringifies Symbols incorrectly
    if (!hasSymbols) { return false; } // Symbols are not supported
    var stringify = typeof JSON === 'object' && typeof JSON.stringify === 'function' ? JSON.stringify : null;
    if (!stringify) { return false; } // JSON.stringify is not supported
    if (typeof stringify(Symbol()) !== 'undefined') { return true; } // Symbols should become `undefined`
    if (stringify([Symbol()]) !== '[null]') { return true; } // Symbols in arrays should become `null`
    var obj = { a: Symbol() };
    obj[Symbol()] = true;
    if (stringify(obj) !== '{}') { return true; } // Symbol-valued keys *and* Symbol-valued properties should be omitted
    return false;
  }());
  var JSONstringifyAcceptsObjectSymbol = valueOrFalseIfThrows(function () {
    // Chrome 45 throws on stringifying object symbols
    if (!hasSymbols) { return true; } // Symbols are not supported
    return JSON.stringify(Object(Symbol())) === '{}' && JSON.stringify([Object(Symbol())]) === '[{}]';
  });
  if (JSONstringifiesSymbols || !JSONstringifyAcceptsObjectSymbol) {
    var origStringify = JSON.stringify;
    overrideNative(JSON, 'stringify', function stringify(value) {
      if (typeof value === 'symbol') { return; }
      var replacer;
      if (arguments.length > 1) {
        replacer = arguments[1];
      }
      var args = [value];
      if (!isArray(replacer)) {
        var replaceFn = ES.IsCallable(replacer) ? replacer : null;
        var wrappedReplacer = function (key, val) {
          var parsedValue = replaceFn ? _call(replaceFn, this, key, val) : val;
          if (typeof parsedValue !== 'symbol') {
            if (Type.symbol(parsedValue)) {
              return assignTo({})(parsedValue);
            } else {
              return parsedValue;
            }
          }
        };
        args.push(wrappedReplacer);
      } else {
        // create wrapped replacer that handles an array replacer?
        args.push(replacer);
      }
      if (arguments.length > 2) {
        args.push(arguments[2]);
      }
      return origStringify.apply(this, args);
    });
  }

  return globals;
}));

/*!
 * https://github.com/paulmillr/es6-shim
 * @license es6-shim Copyright 2013-2016 by Paul Miller (http://paulmillr.com)
 *   and contributors,  MIT License
 * es6-sham: v0.35.1
 * see https://github.com/paulmillr/es6-shim/blob/0.35.1/LICENSE
 * Details and documentation:
 * https://github.com/paulmillr/es6-shim/
 */

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
  /*global define, exports, module */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.returnExports = factory();
  }
}(this, function () {
  'use strict';

  /*jshint evil: true */
  /* eslint-disable no-new-func */
  var getGlobal = new Function('return this;');
  /* eslint-enable no-new-func */
  /*jshint evil: false */

  var globals = getGlobal();
  var Object = globals.Object;
  var _call = Function.call.bind(Function.call);
  var functionToString = Function.toString;
  var _strMatch = String.prototype.match;

  var throwsError = function (func) {
    try {
      func();
      return false;
    } catch (e) {
      return true;
    }
  };
  var arePropertyDescriptorsSupported = function () {
    // if Object.defineProperty exists but throws, it's IE 8
    return !throwsError(function () {
      Object.defineProperty({}, 'x', { get: function () { } });
    });
  };
  var supportsDescriptors = !!Object.defineProperty && arePropertyDescriptorsSupported();

  // NOTE:  This versions needs object ownership
  //        because every promoted object needs to be reassigned
  //        otherwise uncompatible browsers cannot work as expected
  //
  // NOTE:  This might need es5-shim or polyfills upfront
  //        because it's based on ES5 API.
  //        (probably just an IE <= 8 problem)
  //
  // NOTE:  nodejs is fine in version 0.8, 0.10, and future versions.
  (function () {
    if (Object.setPrototypeOf) { return; }

    /*jshint proto: true */
    // @author    Andrea Giammarchi - @WebReflection

    var getOwnPropertyNames = Object.getOwnPropertyNames;
    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var create = Object.create;
    var defineProperty = Object.defineProperty;
    var getPrototypeOf = Object.getPrototypeOf;
    var objProto = Object.prototype;

    var copyDescriptors = function (target, source) {
      // define into target descriptors from source
      getOwnPropertyNames(source).forEach(function (key) {
        defineProperty(
          target,
          key,
          getOwnPropertyDescriptor(source, key)
        );
      });
      return target;
    };
    // used as fallback when no promotion is possible
    var createAndCopy = function (origin, proto) {
      return copyDescriptors(create(proto), origin);
    };
    var set, setPrototypeOf;
    try {
      // this might fail for various reasons
      // ignore if Chrome cought it at runtime
      set = getOwnPropertyDescriptor(objProto, '__proto__').set;
      set.call({}, null);
      // setter not poisoned, it can promote
      // Firefox, Chrome
      setPrototypeOf = function (origin, proto) {
        set.call(origin, proto);
        return origin;
      };
    } catch (e) {
      // do one or more feature detections
      set = { __proto__: null };
      // if proto does not work, needs to fallback
      // some Opera, Rhino, ducktape
      if (set instanceof Object) {
        setPrototypeOf = createAndCopy;
      } else {
        // verify if null objects are buggy
        /* eslint-disable no-proto */
        set.__proto__ = objProto;
        /* eslint-enable no-proto */
        // if null objects are buggy
        // nodejs 0.8 to 0.10
        if (set instanceof Object) {
          setPrototypeOf = function (origin, proto) {
            // use such bug to promote
            /* eslint-disable no-proto */
            origin.__proto__ = proto;
            /* eslint-enable no-proto */
            return origin;
          };
        } else {
          // try to use proto or fallback
          // Safari, old Firefox, many others
          setPrototypeOf = function (origin, proto) {
            // if proto is not null
            if (getPrototypeOf(origin)) {
              // use __proto__ to promote
              /* eslint-disable no-proto */
              origin.__proto__ = proto;
              /* eslint-enable no-proto */
              return origin;
            } else {
              // otherwise unable to promote: fallback
              return createAndCopy(origin, proto);
            }
          };
        }
      }
    }
    Object.setPrototypeOf = setPrototypeOf;
  }());

  if (supportsDescriptors && function foo() { }.name !== 'foo') {
    try {
      /* eslint no-extend-native: 1 */
      Object.defineProperty(Function.prototype, 'name', {
        configurable: true,
        enumerable: false,
        get: function () {
          var str = _call(functionToString, this);
          var match = _call(_strMatch, str, /\s*function\s+([^(\s]*)\s*/);
          var name = match && match[1];
          Object.defineProperty(this, 'name', {
            configurable: true,
            enumerable: false,
            writable: false,
            value: name
          });
          return name;
        }
      });
    } catch (e) {
      console.error(e);
      console.log('error  Object.defineProperty');
    }
  }
}));
//requestAnimationFrame 
(function () {
  var requestAnimaton = typeof window.requestAnimationFrame != 'undefined' ? window.requestAnimationFrame : function (callback) {
    return setTimeout(function () {
      callback(Date.now());
    }, 25);
  };

  var cancelAnimation = typeof window.requestAnimationFrame != 'undefined' ? window.cancelAnimationFrame : function (token) {
    return clearTimeout(token);
  };
  window.requestAnimationFrame = requestAnimaton;
  window.cancelAnimationFrame = cancelAnimation;

})();
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var proto = require('./Array.prototype');

module.exports = {
	prototype: proto,
	shim: function shimArray() {
		proto.shim();
	}
};

},{"./Array.prototype":3}],2:[function(require,module,exports){
'use strict';

module.exports = require('array-includes');

},{"array-includes":14}],3:[function(require,module,exports){
'use strict';

var includes = require('./Array.prototype.includes');

module.exports = {
	includes: includes,
	shim: function shimArrayPrototype() {
		includes.shim();
	}
};

},{"./Array.prototype.includes":2}],4:[function(require,module,exports){
'use strict';

var getDescriptors = require('object.getownpropertydescriptors');
var entries = require('object.entries');
var values = require('object.values');

module.exports = {
	entries: entries,
	getOwnPropertyDescriptors: getDescriptors,
	shim: function shimObject() {
		getDescriptors.shim();
		entries.shim();
		values.shim();
	},
	values: values
};

},{"object.entries":38,"object.getownpropertydescriptors":64,"object.values":89}],5:[function(require,module,exports){
'use strict';

var stringPrototype = require('./String.prototype');

module.exports = {
	prototype: stringPrototype,
	shim: function shimString() {
		stringPrototype.shim();
	}
};

},{"./String.prototype":7}],6:[function(require,module,exports){
'use strict';

module.exports = require('string-at');

},{"string-at":114}],7:[function(require,module,exports){
'use strict';

var at = require('./String.prototype.at');
var padStart = require('./String.prototype.padStart');
var padEnd = require('./String.prototype.padEnd');
var trimLeft = require('./String.prototype.trimLeft');
var trimRight = require('./String.prototype.trimRight');

module.exports = {
	at: at,
	padStart: padStart,
	padEnd: padEnd,
	trimLeft: trimLeft,
	trimRight: trimRight,
	shim: function shimStringPrototype() {
		at.shim();
		padStart.shim();
		padEnd.shim();
		trimLeft.shim();
		trimRight.shim();
	}
};

},{"./String.prototype.at":6,"./String.prototype.padEnd":8,"./String.prototype.padStart":9,"./String.prototype.trimLeft":10,"./String.prototype.trimRight":11}],8:[function(require,module,exports){
'use strict';

module.exports = require('string.prototype.padend');

},{"string.prototype.padend":137}],9:[function(require,module,exports){
'use strict';

module.exports = require('string.prototype.padstart');

},{"string.prototype.padstart":162}],10:[function(require,module,exports){
'use strict';

module.exports = require('string.prototype.trimleft');

},{"string.prototype.trimleft":187}],11:[function(require,module,exports){
'use strict';

module.exports = require('string.prototype.trimright');

},{"string.prototype.trimright":197}],12:[function(require,module,exports){
/*!
 * https://github.com/es-shims/es7-shim
 * @license es7-shim Copyright 2014 by contributors, MIT License
 * see https://github.com/es-shims/es7-shim/blob/master/LICENSE
 */

'use strict';

var $Array = require('./Array');
var $Object = require('./Object');
var $String = require('./String');

module.exports = {
	Array: $Array,
	Object: $Object,
	String: $String,
	shim: function shimES7() {
		$Array.shim();
		$Object.shim();
		$String.shim();
	}
};

},{"./Array":1,"./Object":4,"./String":5}],13:[function(require,module,exports){
(function (global){
'use strict';

var ES = require('es-abstract/es6');
var $isNaN = Number.isNaN || function (a) { return a !== a; };
var $isFinite = Number.isFinite || function (n) { return typeof n === 'number' && global.isFinite(n); };
var indexOf = Array.prototype.indexOf;

module.exports = function includes(searchElement) {
	var fromIndex = arguments.length > 1 ? ES.ToInteger(arguments[1]) : 0;
	if (indexOf && !$isNaN(searchElement) && $isFinite(fromIndex) && typeof searchElement !== 'undefined') {
		return indexOf.apply(this, arguments) > -1;
	}

	var O = ES.ToObject(this);
	var length = ES.ToLength(O.length);
	if (length === 0) {
		return false;
	}
	var k = fromIndex >= 0 ? fromIndex : Math.max(0, length + fromIndex);
	while (k < length) {
		if (ES.SameValueZero(searchElement, O[k])) {
			return true;
		}
		k += 1;
	}
	return false;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"es-abstract/es6":17}],14:[function(require,module,exports){
'use strict';

var define = require('define-properties');
var ES = require('es-abstract/es6');

var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var polyfill = getPolyfill();
var shim = require('./shim');

var slice = Array.prototype.slice;

/* eslint-disable no-unused-vars */
var boundIncludesShim = function includes(array, searchElement) {
/* eslint-enable no-unused-vars */
	ES.RequireObjectCoercible(array);
	return polyfill.apply(array, slice.call(arguments, 1));
};
define(boundIncludesShim, {
	implementation: implementation,
	getPolyfill: getPolyfill,
	shim: shim
});

module.exports = boundIncludesShim;

},{"./implementation":13,"./polyfill":35,"./shim":36,"define-properties":15,"es-abstract/es6":17}],15:[function(require,module,exports){
'use strict';

var keys = require('object-keys');
var foreach = require('foreach');
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

var toStr = Object.prototype.toString;

var isFunction = function (fn) {
	return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
        /* eslint-disable no-unused-vars, no-restricted-syntax */
        for (var _ in obj) { return false; }
        /* eslint-enable no-unused-vars, no-restricted-syntax */
		return obj.x === obj;
	} catch (e) { /* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, predicate) {
	if (name in object && (!isFunction(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		Object.defineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function (object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = keys(map);
	if (hasSymbols) {
		props = props.concat(Object.getOwnPropertySymbols(map));
	}
	foreach(props, function (name) {
		defineProperty(object, name, map[name], predicates[name]);
	});
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

module.exports = defineProperties;

},{"foreach":26,"object-keys":33}],16:[function(require,module,exports){
'use strict';

var $isNaN = Number.isNaN || function (a) { return a !== a; };
var $isFinite = require('./helpers/isFinite');

var sign = require('./helpers/sign');
var mod = require('./helpers/mod');

var IsCallable = require('is-callable');
var toPrimitive = require('es-to-primitive/es5');

// https://es5.github.io/#x9
var ES5 = {
	ToPrimitive: toPrimitive,

	ToBoolean: function ToBoolean(value) {
		return Boolean(value);
	},
	ToNumber: function ToNumber(value) {
		return Number(value);
	},
	ToInteger: function ToInteger(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number)) { return 0; }
		if (number === 0 || !$isFinite(number)) { return number; }
		return sign(number) * Math.floor(Math.abs(number));
	},
	ToInt32: function ToInt32(x) {
		return this.ToNumber(x) >> 0;
	},
	ToUint32: function ToUint32(x) {
		return this.ToNumber(x) >>> 0;
	},
	ToUint16: function ToUint16(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
		var posInt = sign(number) * Math.floor(Math.abs(number));
		return mod(posInt, 0x10000);
	},
	ToString: function ToString(value) {
		return String(value);
	},
	ToObject: function ToObject(value) {
		this.CheckObjectCoercible(value);
		return Object(value);
	},
	CheckObjectCoercible: function CheckObjectCoercible(value, optMessage) {
		/* jshint eqnull:true */
		if (value == null) {
			throw new TypeError(optMessage || 'Cannot call method on ' + value);
		}
		return value;
	},
	IsCallable: IsCallable,
	SameValue: function SameValue(x, y) {
		if (x === y) { // 0 === -0, but they are not identical.
			if (x === 0) { return 1 / x === 1 / y; }
			return true;
		}
        return $isNaN(x) && $isNaN(y);
	}
};

module.exports = ES5;

},{"./helpers/isFinite":19,"./helpers/mod":21,"./helpers/sign":22,"es-to-primitive/es5":23,"is-callable":29}],17:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';
var symbolToStr = hasSymbols ? Symbol.prototype.toString : toStr;

var $isNaN = Number.isNaN || function (a) { return a !== a; };
var $isFinite = require('./helpers/isFinite');
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;

var assign = require('./helpers/assign');
var sign = require('./helpers/sign');
var mod = require('./helpers/mod');
var isPrimitive = require('./helpers/isPrimitive');
var toPrimitive = require('es-to-primitive/es6');
var parseInteger = parseInt;
var bind = require('function-bind');
var strSlice = bind.call(Function.call, String.prototype.slice);
var isBinary = bind.call(Function.call, RegExp.prototype.test, /^0b[01]+$/i);
var isOctal = bind.call(Function.call, RegExp.prototype.test, /^0o[0-7]+$/i);
var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
var nonWSregex = new RegExp('[' + nonWS + ']', 'g');
var hasNonWS = bind.call(Function.call, RegExp.prototype.test, nonWSregex);
var invalidHexLiteral = /^[\-\+]0x[0-9a-f]+$/i;
var isInvalidHexLiteral = bind.call(Function.call, RegExp.prototype.test, invalidHexLiteral);

// whitespace from: http://es5.github.io/#x15.5.4.20
// implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
var ws = [
	'\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003',
	'\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028',
	'\u2029\uFEFF'
].join('');
var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
var replace = bind.call(Function.call, String.prototype.replace);
var trim = function (value) {
	return replace(value, trimRegex, '');
};

var ES5 = require('./es5');

var hasRegExpMatcher = require('is-regex');

// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-abstract-operations
var ES6 = assign(assign({}, ES5), {

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-call-f-v-args
	Call: function Call(F, V) {
		var args = arguments.length > 2 ? arguments[2] : [];
		if (!this.IsCallable(F)) {
			throw new TypeError(F + ' is not a function');
		}
		return F.apply(V, args);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toprimitive
	ToPrimitive: toPrimitive,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toboolean
	// ToBoolean: ES5.ToBoolean,

	// http://www.ecma-international.org/ecma-262/6.0/#sec-tonumber
	ToNumber: function ToNumber(argument) {
		var value = isPrimitive(argument) ? argument : toPrimitive(argument, 'number');
		if (typeof value === 'symbol') {
			throw new TypeError('Cannot convert a Symbol value to a number');
		}
		if (typeof value === 'string') {
			if (isBinary(value)) {
				return this.ToNumber(parseInteger(strSlice(value, 2), 2));
			} else if (isOctal(value)) {
				return this.ToNumber(parseInteger(strSlice(value, 2), 8));
			} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
				return NaN;
			} else {
				var trimmed = trim(value);
				if (trimmed !== value) {
					return this.ToNumber(trimmed);
				}
			}
		}
		return Number(value);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tointeger
	// ToInteger: ES5.ToNumber,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint32
	// ToInt32: ES5.ToInt32,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint32
	// ToUint32: ES5.ToUint32,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint16
	ToInt16: function ToInt16(argument) {
		var int16bit = this.ToUint16(argument);
		return int16bit >= 0x8000 ? int16bit - 0x10000 : int16bit;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint16
	// ToUint16: ES5.ToUint16,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint8
	ToInt8: function ToInt8(argument) {
		var int8bit = this.ToUint8(argument);
		return int8bit >= 0x80 ? int8bit - 0x100 : int8bit;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8
	ToUint8: function ToUint8(argument) {
		var number = this.ToNumber(argument);
		if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
		var posInt = sign(number) * Math.floor(Math.abs(number));
		return mod(posInt, 0x100);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8clamp
	ToUint8Clamp: function ToUint8Clamp(argument) {
		var number = this.ToNumber(argument);
		if ($isNaN(number) || number <= 0) { return 0; }
		if (number >= 0xFF) { return 0xFF; }
		var f = Math.floor(argument);
		if (f + 0.5 < number) { return f + 1; }
		if (number < f + 0.5) { return f; }
		if (f % 2 !== 0) { return f + 1; }
		return f;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tostring
	ToString: function ToString(argument) {
		if (typeof argument === 'symbol') {
			throw new TypeError('Cannot convert a Symbol value to a string');
		}
		return String(argument);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toobject
	ToObject: function ToObject(value) {
		this.RequireObjectCoercible(value);
		return Object(value);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-topropertykey
	ToPropertyKey: function ToPropertyKey(argument) {
		var key = this.ToPrimitive(argument, String);
		return typeof key === 'symbol' ? symbolToStr.call(key) : this.ToString(key);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	ToLength: function ToLength(argument) {
		var len = this.ToInteger(argument);
		if (len <= 0) { return 0; } // includes converting -0 to +0
		if (len > MAX_SAFE_INTEGER) { return MAX_SAFE_INTEGER; }
		return len;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-canonicalnumericindexstring
	CanonicalNumericIndexString: function CanonicalNumericIndexString(argument) {
		if (toStr.call(argument) !== '[object String]') {
			throw new TypeError('must be a string');
		}
		if (argument === '-0') { return -0; }
		var n = this.ToNumber(argument);
		if (this.SameValue(this.ToString(n), argument)) { return n; }
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-requireobjectcoercible
	RequireObjectCoercible: ES5.CheckObjectCoercible,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isarray
	IsArray: Array.isArray || function IsArray(argument) {
		return toStr.call(argument) === '[object Array]';
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-iscallable
	// IsCallable: ES5.IsCallable,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isconstructor
	IsConstructor: function IsConstructor(argument) {
		return this.IsCallable(argument); // unfortunately there's no way to truly check this without try/catch `new argument`
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isextensible-o
	IsExtensible: function IsExtensible(obj) {
		if (!Object.preventExtensions) { return true; }
		if (isPrimitive(obj)) {
			return false;
		}
		return Object.isExtensible(obj);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isinteger
	IsInteger: function IsInteger(argument) {
		if (typeof argument !== 'number' || $isNaN(argument) || !$isFinite(argument)) {
			return false;
		}
		var abs = Math.abs(argument);
		return Math.floor(abs) === abs;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-ispropertykey
	IsPropertyKey: function IsPropertyKey(argument) {
		return typeof argument === 'string' || typeof argument === 'symbol';
	},

	// http://www.ecma-international.org/ecma-262/6.0/#sec-isregexp
	IsRegExp: function IsRegExp(argument) {
		if (!argument || typeof argument !== 'object') {
			return false;
		}
		if (hasSymbols) {
			var isRegExp = RegExp[Symbol.match];
			if (typeof isRegExp !== 'undefined') {
				return ES5.ToBoolean(isRegExp);
			}
		}
		return hasRegExpMatcher(argument);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevalue
	// SameValue: ES5.SameValue,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero
	SameValueZero: function SameValueZero(x, y) {
		return (x === y) || ($isNaN(x) && $isNaN(y));
	}
});

delete ES6.CheckObjectCoercible; // renamed in ES6 to RequireObjectCoercible

module.exports = ES6;

},{"./es5":16,"./helpers/assign":18,"./helpers/isFinite":19,"./helpers/isPrimitive":20,"./helpers/mod":21,"./helpers/sign":22,"es-to-primitive/es6":24,"function-bind":28,"is-regex":31}],18:[function(require,module,exports){
var has = Object.prototype.hasOwnProperty;
module.exports = Object.assign || function assign(target, source) {
	for (var key in source) {
		if (has.call(source, key)) {
			target[key] = source[key];
		}
	}
	return target;
};

},{}],19:[function(require,module,exports){
var $isNaN = Number.isNaN || function (a) { return a !== a; };

module.exports = Number.isFinite || function (x) { return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity; };

},{}],20:[function(require,module,exports){
module.exports = function isPrimitive(value) {
	return value === null || (typeof value !== 'function' && typeof value !== 'object');
};

},{}],21:[function(require,module,exports){
module.exports = function mod(number, modulo) {
	var remain = number % modulo;
	return Math.floor(remain >= 0 ? remain : remain + modulo);
};

},{}],22:[function(require,module,exports){
module.exports = function sign(number) {
	return number >= 0 ? 1 : -1;
};

},{}],23:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;

var isPrimitive = require('./helpers/isPrimitive');

var isCallable = require('is-callable');

// https://es5.github.io/#x8.12
var ES5internalSlots = {
	'[[DefaultValue]]': function (O, hint) {
		var actualHint = hint || (toStr.call(O) === '[object Date]' ? String : Number);

		if (actualHint === String || actualHint === Number) {
			var methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
			var value, i;
			for (i = 0; i < methods.length; ++i) {
				if (isCallable(O[methods[i]])) {
					value = O[methods[i]]();
					if (isPrimitive(value)) {
						return value;
					}
				}
			}
			throw new TypeError('No default value');
		}
		throw new TypeError('invalid [[DefaultValue]] hint supplied');
	}
};

// https://es5.github.io/#x9
module.exports = function ToPrimitive(input, PreferredType) {
	if (isPrimitive(input)) {
		return input;
	}
	return ES5internalSlots['[[DefaultValue]]'](input, PreferredType);
};

},{"./helpers/isPrimitive":25,"is-callable":29}],24:[function(require,module,exports){
'use strict';

var hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';

var isPrimitive = require('./helpers/isPrimitive');
var isCallable = require('is-callable');
var isDate = require('is-date-object');
var isSymbol = require('is-symbol');

var ordinaryToPrimitive = function OrdinaryToPrimitive(O, hint) {
	if (typeof O === 'undefined' || O === null) {
		throw new TypeError('Cannot call method on ' + O);
	}
	if (typeof hint !== 'string' || (hint !== 'number' && hint !== 'string')) {
		throw new TypeError('hint must be "string" or "number"');
	}
	var methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
	var method, result, i;
	for (i = 0; i < methodNames.length; ++i) {
		method = O[methodNames[i]];
		if (isCallable(method)) {
			result = method.call(O);
			if (isPrimitive(result)) {
				return result;
			}
		}
	}
	throw new TypeError('No default value');
};

var GetMethod = function GetMethod(O, P) {
	var func = O[P];
	if (func !== null && typeof func !== 'undefined') {
		if (!isCallable(func)) {
			throw new TypeError(func + ' returned for property ' + P + ' of object ' + O + ' is not a function');
		}
		return func;
	}
};

// http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive
module.exports = function ToPrimitive(input, PreferredType) {
	if (isPrimitive(input)) {
		return input;
	}
	var hint = 'default';
	if (arguments.length > 1) {
		if (PreferredType === String) {
			hint = 'string';
		} else if (PreferredType === Number) {
			hint = 'number';
		}
	}

	var exoticToPrim;
	if (hasSymbols) {
		if (Symbol.toPrimitive) {
			exoticToPrim = GetMethod(input, Symbol.toPrimitive);
		} else if (isSymbol(input)) {
			exoticToPrim = Symbol.prototype.valueOf;
		}
	}
	if (typeof exoticToPrim !== 'undefined') {
		var result = exoticToPrim.call(input, hint);
		if (isPrimitive(result)) {
			return result;
		}
		throw new TypeError('unable to convert exotic object to primitive');
	}
	if (hint === 'default' && (isDate(input) || isSymbol(input))) {
		hint = 'string';
	}
	return ordinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
};

},{"./helpers/isPrimitive":25,"is-callable":29,"is-date-object":30,"is-symbol":32}],25:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],26:[function(require,module,exports){

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};


},{}],27:[function(require,module,exports){
var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],28:[function(require,module,exports){
var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":27}],29:[function(require,module,exports){
'use strict';

var fnToStr = Function.prototype.toString;

var constructorRegex = /^\s*class /;
var isES6ClassFn = function isES6ClassFn(value) {
	try {
		var fnStr = fnToStr.call(value);
		var singleStripped = fnStr.replace(/\/\/.*\n/g, '');
		var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, '');
		var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' ');
		return constructorRegex.test(spaceStripped);
	} catch (e) {
		return false; // not a function
	}
};

var tryFunctionObject = function tryFunctionObject(value) {
	try {
		if (isES6ClassFn(value)) { return false; }
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isCallable(value) {
	if (!value) { return false; }
	if (typeof value !== 'function' && typeof value !== 'object') { return false; }
	if (hasToStringTag) { return tryFunctionObject(value); }
	if (isES6ClassFn(value)) { return false; }
	var strClass = toStr.call(value);
	return strClass === fnClass || strClass === genClass;
};

},{}],30:[function(require,module,exports){
'use strict';

var getDay = Date.prototype.getDay;
var tryDateObject = function tryDateObject(value) {
	try {
		getDay.call(value);
		return true;
	} catch (e) {
		return false;
	}
};

var toStr = Object.prototype.toString;
var dateClass = '[object Date]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isDateObject(value) {
	if (typeof value !== 'object' || value === null) { return false; }
	return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
};

},{}],31:[function(require,module,exports){
'use strict';

var regexExec = RegExp.prototype.exec;
var tryRegexExec = function tryRegexExec(value) {
	try {
		regexExec.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var regexClass = '[object RegExp]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isRegex(value) {
	if (typeof value !== 'object') { return false; }
	return hasToStringTag ? tryRegexExec(value) : toStr.call(value) === regexClass;
};

},{}],32:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

if (hasSymbols) {
	var symToStr = Symbol.prototype.toString;
	var symStringRegex = /^Symbol\(.*\)$/;
	var isSymbolObject = function isSymbolObject(value) {
		if (typeof value.valueOf() !== 'symbol') { return false; }
		return symStringRegex.test(symToStr.call(value));
	};
	module.exports = function isSymbol(value) {
		if (typeof value === 'symbol') { return true; }
		if (toStr.call(value) !== '[object Symbol]') { return false; }
		try {
			return isSymbolObject(value);
		} catch (e) {
			return false;
		}
	};
} else {
	module.exports = function isSymbol(value) {
		// this environment does not support Symbols.
		return false;
	};
}

},{}],33:[function(require,module,exports){
'use strict';

// modified from https://github.com/es-shims/es5-shim
var has = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var slice = Array.prototype.slice;
var isArgs = require('./isArguments');
var hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString');
var hasProtoEnumBug = function () {}.propertyIsEnumerable('prototype');
var dontEnums = [
	'toString',
	'toLocaleString',
	'valueOf',
	'hasOwnProperty',
	'isPrototypeOf',
	'propertyIsEnumerable',
	'constructor'
];
var equalsConstructorPrototype = function (o) {
	var ctor = o.constructor;
	return ctor && ctor.prototype === o;
};
var blacklistedKeys = {
	$console: true,
	$frame: true,
	$frameElement: true,
	$frames: true,
	$parent: true,
	$self: true,
	$webkitIndexedDB: true,
	$webkitStorageInfo: true,
	$window: true
};
var hasAutomationEqualityBug = (function () {
	/* global window */
	if (typeof window === 'undefined') { return false; }
	for (var k in window) {
		try {
			if (!blacklistedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
				try {
					equalsConstructorPrototype(window[k]);
				} catch (e) {
					return true;
				}
			}
		} catch (e) {
			return true;
		}
	}
	return false;
}());
var equalsConstructorPrototypeIfNotBuggy = function (o) {
	/* global window */
	if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
		return equalsConstructorPrototype(o);
	}
	try {
		return equalsConstructorPrototype(o);
	} catch (e) {
		return false;
	}
};

var keysShim = function keys(object) {
	var isObject = object !== null && typeof object === 'object';
	var isFunction = toStr.call(object) === '[object Function]';
	var isArguments = isArgs(object);
	var isString = isObject && toStr.call(object) === '[object String]';
	var theKeys = [];

	if (!isObject && !isFunction && !isArguments) {
		throw new TypeError('Object.keys called on a non-object');
	}

	var skipProto = hasProtoEnumBug && isFunction;
	if (isString && object.length > 0 && !has.call(object, 0)) {
		for (var i = 0; i < object.length; ++i) {
			theKeys.push(String(i));
		}
	}

	if (isArguments && object.length > 0) {
		for (var j = 0; j < object.length; ++j) {
			theKeys.push(String(j));
		}
	} else {
		for (var name in object) {
			if (!(skipProto && name === 'prototype') && has.call(object, name)) {
				theKeys.push(String(name));
			}
		}
	}

	if (hasDontEnumBug) {
		var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2));
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;

},{"./isArguments":34}],34:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

},{}],35:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = function getPolyfill() {
	return Array.prototype.includes || implementation;
};

},{"./implementation":13}],36:[function(require,module,exports){
'use strict';

var define = require('define-properties');
var getPolyfill = require('./polyfill');

module.exports = function shimArrayPrototypeIncludes() {
	var polyfill = getPolyfill();
	if (Array.prototype.includes !== polyfill) {
		define(Array.prototype, { includes: polyfill });
	}
	return polyfill;
};

},{"./polyfill":35,"define-properties":15}],37:[function(require,module,exports){
'use strict';

var ES = require('es-abstract/es7');
var has = require('has');
var bind = require('function-bind');
var isEnumerable = bind.call(Function.call, Object.prototype.propertyIsEnumerable);

module.exports = function entries(O) {
	var obj = ES.RequireObjectCoercible(O);
	var entrys = [];
	for (var key in obj) {
		if (has(obj, key) && isEnumerable(obj, key)) {
			entrys.push([key, obj[key]]);
		}
	}
	return entrys;
};

},{"es-abstract/es7":42,"function-bind":53,"has":54}],38:[function(require,module,exports){
'use strict';

var define = require('define-properties');

var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var shim = require('./shim');

define(implementation, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = implementation;

},{"./implementation":37,"./polyfill":61,"./shim":62,"define-properties":39}],39:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15,"foreach":51,"object-keys":59}],40:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"./helpers/isFinite":44,"./helpers/mod":46,"./helpers/sign":47,"dup":16,"es-to-primitive/es5":48,"is-callable":55}],41:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"./es5":40,"./helpers/assign":43,"./helpers/isFinite":44,"./helpers/isPrimitive":45,"./helpers/mod":46,"./helpers/sign":47,"dup":17,"es-to-primitive/es6":49,"function-bind":53,"is-regex":57}],42:[function(require,module,exports){
'use strict';

var ES6 = require('./es6');
var assign = require('./helpers/assign');

var ES7 = assign(ES6, {
	// https://github.com/tc39/ecma262/pull/60
	SameValueNonNumber: function SameValueNonNumber(x, y) {
		if (typeof x === 'number' || typeof x !== typeof y) {
			throw new TypeError('SameValueNonNumber requires two non-number values of the same type.');
		}
		return this.SameValue(x, y);
	}
});

module.exports = ES7;

},{"./es6":41,"./helpers/assign":43}],43:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],44:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],45:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],46:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],47:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],48:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"./helpers/isPrimitive":50,"dup":23,"is-callable":55}],49:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"./helpers/isPrimitive":50,"dup":24,"is-callable":55,"is-date-object":56,"is-symbol":58}],50:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],51:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],52:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],53:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"./implementation":52,"dup":28}],54:[function(require,module,exports){
var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":53}],55:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],56:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],57:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],58:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],59:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"./isArguments":60,"dup":33}],60:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],61:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = function getPolyfill() {
	return typeof Object.entries === 'function' ? Object.entries : implementation;
};

},{"./implementation":37}],62:[function(require,module,exports){
'use strict';

var getPolyfill = require('./polyfill');
var define = require('define-properties');

module.exports = function shimEntries() {
	var polyfill = getPolyfill();
	define(Object, { entries: polyfill }, { entries: function () { return Object.entries !== polyfill; } });
	return polyfill;
};

},{"./polyfill":61,"define-properties":39}],63:[function(require,module,exports){
'use strict';

var ES = require('es-abstract/es7');

var defineProperty = Object.defineProperty;
var getDescriptor = Object.getOwnPropertyDescriptor;
var getOwnNames = Object.getOwnPropertyNames;
var getSymbols = Object.getOwnPropertySymbols;
var concat = Function.call.bind(Array.prototype.concat);
var reduce = Function.call.bind(Array.prototype.reduce);
var getAll = getSymbols ? function (obj) {
	return concat(getOwnNames(obj), getSymbols(obj));
} : getOwnNames;

var isES5 = ES.IsCallable(getDescriptor) && ES.IsCallable(getOwnNames);

var safePut = function put(obj, prop, val) {
	if (defineProperty && prop in obj) {
		defineProperty(obj, prop, {
			configurable: true,
			enumerable: true,
			value: val,
			writable: true
		});
	} else {
		obj[prop] = val;
	}
};

module.exports = function getOwnPropertyDescriptors(value) {
	ES.RequireObjectCoercible(value);
	if (!isES5) { throw new TypeError('getOwnPropertyDescriptors requires Object.getOwnPropertyDescriptor'); }

	var O = ES.ToObject(value);
	return reduce(getAll(O), function (acc, key) {
		safePut(acc, key, getDescriptor(O, key));
		return acc;
	}, {});
};

},{"es-abstract/es7":68}],64:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"./implementation":63,"./polyfill":86,"./shim":87,"define-properties":65,"dup":38}],65:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15,"foreach":77,"object-keys":84}],66:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"./helpers/isFinite":70,"./helpers/mod":72,"./helpers/sign":73,"dup":16,"es-to-primitive/es5":74,"is-callable":80}],67:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"./es5":66,"./helpers/assign":69,"./helpers/isFinite":70,"./helpers/isPrimitive":71,"./helpers/mod":72,"./helpers/sign":73,"dup":17,"es-to-primitive/es6":75,"function-bind":79,"is-regex":82}],68:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./es6":67,"./helpers/assign":69,"dup":42}],69:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],70:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],71:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],72:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],73:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],74:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"./helpers/isPrimitive":76,"dup":23,"is-callable":80}],75:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"./helpers/isPrimitive":76,"dup":24,"is-callable":80,"is-date-object":81,"is-symbol":83}],76:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],77:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],78:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],79:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"./implementation":78,"dup":28}],80:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],81:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],82:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],83:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],84:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"./isArguments":85,"dup":33}],85:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],86:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = function getPolyfill() {
	return typeof Object.getOwnPropertyDescriptors === 'function' ? Object.getOwnPropertyDescriptors : implementation;
};

},{"./implementation":63}],87:[function(require,module,exports){
'use strict';

var getPolyfill = require('./polyfill');
var define = require('define-properties');

module.exports = function shimGetOwnPropertyDescriptors() {
	var polyfill = getPolyfill();
	define(Object, { getOwnPropertyDescriptors: polyfill }, {
		getOwnPropertyDescriptors: function () { return Object.getOwnPropertyDescriptors !== polyfill; }
	});
	return polyfill;
};

},{"./polyfill":86,"define-properties":65}],88:[function(require,module,exports){
'use strict';

var ES = require('es-abstract/es7');
var has = require('has');
var bind = require('function-bind');
var isEnumerable = bind.call(Function.call, Object.prototype.propertyIsEnumerable);

module.exports = function values(O) {
	var obj = ES.RequireObjectCoercible(O);
	var vals = [];
	for (var key in obj) {
		if (has(obj, key) && isEnumerable(obj, key)) {
			vals.push(obj[key]);
		}
	}
	return vals;
};

},{"es-abstract/es7":93,"function-bind":104,"has":105}],89:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"./implementation":88,"./polyfill":112,"./shim":113,"define-properties":90,"dup":38}],90:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15,"foreach":102,"object-keys":110}],91:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"./helpers/isFinite":95,"./helpers/mod":97,"./helpers/sign":98,"dup":16,"es-to-primitive/es5":99,"is-callable":106}],92:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"./es5":91,"./helpers/assign":94,"./helpers/isFinite":95,"./helpers/isPrimitive":96,"./helpers/mod":97,"./helpers/sign":98,"dup":17,"es-to-primitive/es6":100,"function-bind":104,"is-regex":108}],93:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./es6":92,"./helpers/assign":94,"dup":42}],94:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],95:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],96:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],97:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],98:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],99:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"./helpers/isPrimitive":101,"dup":23,"is-callable":106}],100:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"./helpers/isPrimitive":101,"dup":24,"is-callable":106,"is-date-object":107,"is-symbol":109}],101:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],102:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],103:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],104:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"./implementation":103,"dup":28}],105:[function(require,module,exports){
arguments[4][54][0].apply(exports,arguments)
},{"dup":54,"function-bind":104}],106:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],107:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],108:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],109:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],110:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"./isArguments":111,"dup":33}],111:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],112:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = function getPolyfill() {
	return typeof Object.values === 'function' ? Object.values : implementation;
};

},{"./implementation":88}],113:[function(require,module,exports){
'use strict';

var getPolyfill = require('./polyfill');
var define = require('define-properties');

module.exports = function shimValues() {
	var polyfill = getPolyfill();
	define(Object, { values: polyfill }, { values: function () { return Object.values !== polyfill; } });
	return polyfill;
};

},{"./polyfill":112,"define-properties":90}],114:[function(require,module,exports){
'use strict';

var define = require('define-properties');
var ES = require('es-abstract/es7');
var bind = require('function-bind');

var atShim = function at(pos) {
	ES.RequireObjectCoercible(this);
	var O = ES.ToObject(this);
	var S = ES.ToString(O);
	var position = ES.ToInteger(pos);
	var size = S.length;
	if (position < 0 || position >= size) {
		return '';
	}
	// Get the first code unit and code unit value
	var cuFirst = S.charCodeAt(position);
	var cuSecond;
	var nextIndex = position + 1;
	var len = 1;
	// Check if it’s the start of a surrogate pair.
	var isHighSurrogate = cuFirst >= 0xD800 && cuFirst <= 0xDBFF;
	if (isHighSurrogate && size > nextIndex /* there is a next code unit */) {
		cuSecond = S.charCodeAt(nextIndex);
		if (cuSecond >= 0xDC00 && cuSecond <= 0xDFFF) { // low surrogate
			len = 2;
		}
	}
	return S.slice(position, position + len);
};

var at = bind.call(Function.call, atShim);
define(at, {
	method: atShim,
	shim: function shimStringPrototypeAt() {
		define(String.prototype, {
			at: atShim
		});
		return String.prototype.at;
	}
});

module.exports = at;

},{"define-properties":115,"es-abstract/es7":118,"function-bind":129}],115:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15,"foreach":127,"object-keys":134}],116:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"./helpers/isFinite":120,"./helpers/mod":122,"./helpers/sign":123,"dup":16,"es-to-primitive/es5":124,"is-callable":130}],117:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"./es5":116,"./helpers/assign":119,"./helpers/isFinite":120,"./helpers/isPrimitive":121,"./helpers/mod":122,"./helpers/sign":123,"dup":17,"es-to-primitive/es6":125,"function-bind":129,"is-regex":132}],118:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./es6":117,"./helpers/assign":119,"dup":42}],119:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],120:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],121:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],122:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],123:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],124:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"./helpers/isPrimitive":126,"dup":23,"is-callable":130}],125:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"./helpers/isPrimitive":126,"dup":24,"is-callable":130,"is-date-object":131,"is-symbol":133}],126:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],127:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],128:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],129:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"./implementation":128,"dup":28}],130:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],131:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],132:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],133:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],134:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"./isArguments":135,"dup":33}],135:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],136:[function(require,module,exports){
'use strict';

var bind = require('function-bind');
var ES = require('es-abstract/es7');
var slice = bind.call(Function.call, String.prototype.slice);

module.exports = function padEnd(maxLength) {
	var O = ES.RequireObjectCoercible(this);
	var S = ES.ToString(O);
	var stringLength = ES.ToLength(S.length);
	var fillString;
	if (arguments.length > 1) {
		fillString = arguments[1];
	}
	var filler = typeof fillString === 'undefined' ? '' : ES.ToString(fillString);
	if (filler === '') {
		filler = ' ';
	}
	var intMaxLength = ES.ToLength(maxLength);
	if (intMaxLength <= stringLength) {
		return S;
	}
	var fillLen = intMaxLength - stringLength;
	while (filler.length < fillLen) {
		var fLen = filler.length;
		var remainingCodeUnits = fillLen - fLen;
		filler += fLen > remainingCodeUnits ? slice(filler, 0, remainingCodeUnits) : filler;
	}

	var truncatedStringFiller = filler.length > fillLen ? slice(filler, 0, fillLen) : filler;
	return S + truncatedStringFiller;
};

},{"es-abstract/es7":141,"function-bind":152}],137:[function(require,module,exports){
'use strict';

var bind = require('function-bind');
var define = require('define-properties');
var ES = require('es-abstract/es7');

var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var shim = require('./shim');

var bound = bind.call(Function.apply, implementation);

var boundPadEnd = function padEnd(str, maxLength) {
	ES.RequireObjectCoercible(str);
	var args = [maxLength];
	if (arguments.length > 2) {
		args.push(arguments[2]);
	}
	return bound(str, args);
};

define(boundPadEnd, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = boundPadEnd;

},{"./implementation":136,"./polyfill":159,"./shim":160,"define-properties":138,"es-abstract/es7":141,"function-bind":152}],138:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15,"foreach":150,"object-keys":157}],139:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"./helpers/isFinite":143,"./helpers/mod":145,"./helpers/sign":146,"dup":16,"es-to-primitive/es5":147,"is-callable":153}],140:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"./es5":139,"./helpers/assign":142,"./helpers/isFinite":143,"./helpers/isPrimitive":144,"./helpers/mod":145,"./helpers/sign":146,"dup":17,"es-to-primitive/es6":148,"function-bind":152,"is-regex":155}],141:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./es6":140,"./helpers/assign":142,"dup":42}],142:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],143:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],144:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],145:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],146:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],147:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"./helpers/isPrimitive":149,"dup":23,"is-callable":153}],148:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"./helpers/isPrimitive":149,"dup":24,"is-callable":153,"is-date-object":154,"is-symbol":156}],149:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],150:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],151:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],152:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"./implementation":151,"dup":28}],153:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],154:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],155:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],156:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],157:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"./isArguments":158,"dup":33}],158:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],159:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = function getPolyfill() {
	return typeof String.prototype.padEnd === 'function' ? String.prototype.padEnd : implementation;
};

},{"./implementation":136}],160:[function(require,module,exports){
'use strict';

var getPolyfill = require('./polyfill');
var define = require('define-properties');

module.exports = function shimPadEnd() {
	var polyfill = getPolyfill();
	define(String.prototype, { padEnd: polyfill }, { padEnd: function () { return String.prototype.padEnd !== polyfill; } });
	return polyfill;
};

},{"./polyfill":159,"define-properties":138}],161:[function(require,module,exports){
'use strict';

var bind = require('function-bind');
var ES = require('es-abstract/es7');
var slice = bind.call(Function.call, String.prototype.slice);

module.exports = function padStart(maxLength) {
	var O = ES.RequireObjectCoercible(this);
	var S = ES.ToString(O);
	var stringLength = ES.ToLength(S.length);
	var fillString;
	if (arguments.length > 1) {
		fillString = arguments[1];
	}
	var filler = typeof fillString === 'undefined' ? '' : ES.ToString(fillString);
	if (filler === '') {
		filler = ' ';
	}
	var intMaxLength = ES.ToLength(maxLength);
	if (intMaxLength <= stringLength) {
		return S;
	}
	var fillLen = intMaxLength - stringLength;
	while (filler.length < fillLen) {
		var fLen = filler.length;
		var remainingCodeUnits = fillLen - fLen;
		filler += fLen > remainingCodeUnits ? slice(filler, 0, remainingCodeUnits) : filler;
	}

	var truncatedStringFiller = filler.length > fillLen ? slice(filler, 0, fillLen) : filler;
	return truncatedStringFiller + S;
};

},{"es-abstract/es7":166,"function-bind":177}],162:[function(require,module,exports){
'use strict';

var bind = require('function-bind');
var define = require('define-properties');
var ES = require('es-abstract/es7');

var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var shim = require('./shim');

var bound = bind.call(Function.apply, implementation);

var boundPadStart = function padStart(str, maxLength) {
	ES.RequireObjectCoercible(str);
	var args = [maxLength];
	if (arguments.length > 2) {
		args.push(arguments[2]);
	}
	return bound(str, args);
};

define(boundPadStart, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = boundPadStart;

},{"./implementation":161,"./polyfill":184,"./shim":185,"define-properties":163,"es-abstract/es7":166,"function-bind":177}],163:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15,"foreach":175,"object-keys":182}],164:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"./helpers/isFinite":168,"./helpers/mod":170,"./helpers/sign":171,"dup":16,"es-to-primitive/es5":172,"is-callable":178}],165:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"./es5":164,"./helpers/assign":167,"./helpers/isFinite":168,"./helpers/isPrimitive":169,"./helpers/mod":170,"./helpers/sign":171,"dup":17,"es-to-primitive/es6":173,"function-bind":177,"is-regex":180}],166:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./es6":165,"./helpers/assign":167,"dup":42}],167:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],168:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],169:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],170:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],171:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],172:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"./helpers/isPrimitive":174,"dup":23,"is-callable":178}],173:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"./helpers/isPrimitive":174,"dup":24,"is-callable":178,"is-date-object":179,"is-symbol":181}],174:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],175:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],176:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],177:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"./implementation":176,"dup":28}],178:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],179:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],180:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],181:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],182:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"./isArguments":183,"dup":33}],183:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],184:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = function getPolyfill() {
	return typeof String.prototype.padStart === 'function' ? String.prototype.padStart : implementation;
};

},{"./implementation":161}],185:[function(require,module,exports){
'use strict';

var getPolyfill = require('./polyfill');
var define = require('define-properties');

module.exports = function shimPadStart() {
	var polyfill = getPolyfill();
	define(String.prototype, { padStart: polyfill }, { padStart: function () { return String.prototype.padStart !== polyfill; } });
	return polyfill;
};

},{"./polyfill":184,"define-properties":163}],186:[function(require,module,exports){
'use strict';

var bind = require('function-bind');
var replace = bind.call(Function.call, String.prototype.replace);

var leftWhitespace = /^[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]*/;

module.exports = function trimLeft() {
	return replace(this, leftWhitespace, '');
};

},{"function-bind":191}],187:[function(require,module,exports){
'use strict';

var bind = require('function-bind');
var define = require('define-properties');

var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var shim = require('./shim');

var bound = bind.call(Function.call, getPolyfill());

define(bound, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = bound;

},{"./implementation":186,"./polyfill":194,"./shim":195,"define-properties":188,"function-bind":191}],188:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15,"foreach":189,"object-keys":192}],189:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],190:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],191:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"./implementation":190,"dup":28}],192:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"./isArguments":193,"dup":33}],193:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],194:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = function getPolyfill() {
	if (!String.prototype.trimLeft) {
		return implementation;
	}
	var zeroWidthSpace = '\u200b';
	if (zeroWidthSpace.trimLeft() !== zeroWidthSpace) {
		return implementation;
	}
	return String.prototype.trimLeft;
};

},{"./implementation":186}],195:[function(require,module,exports){
'use strict';

var define = require('define-properties');
var getPolyfill = require('./polyfill');

module.exports = function shimTrimLeft() {
	var polyfill = getPolyfill();
	define(
		String.prototype,
		{ trimLeft: polyfill },
		{ trimLeft: function () { return String.prototype.trimLeft !== polyfill; } }
	);
	return polyfill;
};

},{"./polyfill":194,"define-properties":188}],196:[function(require,module,exports){
'use strict';

var bind = require('function-bind');
var replace = bind.call(Function.call, String.prototype.replace);

var rightWhitespace = /[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]*$/;

module.exports = function trimRight() {
	return replace(this, rightWhitespace, '');
};

},{"function-bind":201}],197:[function(require,module,exports){
arguments[4][187][0].apply(exports,arguments)
},{"./implementation":196,"./polyfill":204,"./shim":205,"define-properties":198,"dup":187,"function-bind":201}],198:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15,"foreach":199,"object-keys":202}],199:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],200:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],201:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"./implementation":200,"dup":28}],202:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"./isArguments":203,"dup":33}],203:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],204:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = function getPolyfill() {
	if (!String.prototype.trimRight) {
		return implementation;
	}
	var zeroWidthSpace = '\u200b';
	if (zeroWidthSpace.trimRight() !== zeroWidthSpace) {
		return implementation;
	}
	return String.prototype.trimRight;
};

},{"./implementation":196}],205:[function(require,module,exports){
'use strict';

var define = require('define-properties');
var getPolyfill = require('./polyfill');

module.exports = function shimTrimRight() {
	var polyfill = getPolyfill();
	define(
		String.prototype,
		{ trimRight: polyfill },
		{ trimRight: function () { return String.prototype.trimRight !== polyfill; } }
	);
	return polyfill;
};

},{"./polyfill":204,"define-properties":198}],206:[function(require,module,exports){
'use strict';

module.exports = require('./es7-shim').shim();

},{"./es7-shim":12}]},{},[206]);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNS1zaGltLmpzIiwiZXM1LXNoYW0uanMiLCJlczYtc2hpbS5qcyIsImVzNi1zaGFtLmpzIiwiZXM3LXNoaW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaGpCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsd0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2hpbS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltXG4gKiBAbGljZW5zZSBlczUtc2hpbSBDb3B5cmlnaHQgMjAwOS0yMDE1IGJ5IGNvbnRyaWJ1dG9ycywgTUlUIExpY2Vuc2VcbiAqIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW0vYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cbi8vIHZpbTogdHM9NCBzdHM9NCBzdz00IGV4cGFuZHRhYlxuXG4vLyBBZGQgc2VtaWNvbG9uIHRvIHByZXZlbnQgSUlGRSBmcm9tIGJlaW5nIHBhc3NlZCBhcyBhcmd1bWVudCB0byBjb25jYXRlbmF0ZWQgY29kZS5cbjtcblxuLy8gVU1EIChVbml2ZXJzYWwgTW9kdWxlIERlZmluaXRpb24pXG4vLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3VtZGpzL3VtZC9ibG9iL21hc3Rlci90ZW1wbGF0ZXMvcmV0dXJuRXhwb3J0cy5qc1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyogZ2xvYmFsIGRlZmluZSwgZXhwb3J0cywgbW9kdWxlICovXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgICAgIGRlZmluZShmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcbiAgICAgICAgLy8gb25seSBDb21tb25KUy1saWtlIGVudmlyb21lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cyxcbiAgICAgICAgLy8gbGlrZSBOb2RlLlxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBCcm93c2VyIGdsb2JhbHMgKHJvb3QgaXMgd2luZG93KVxuICAgICAgICByb290LnJldHVybkV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogQnJpbmdzIGFuIGVudmlyb25tZW50IGFzIGNsb3NlIHRvIEVDTUFTY3JpcHQgNSBjb21wbGlhbmNlXG4gICAgICogYXMgaXMgcG9zc2libGUgd2l0aCB0aGUgZmFjaWxpdGllcyBvZiBlcnN0d2hpbGUgZW5naW5lcy5cbiAgICAgKlxuICAgICAqIEFubm90YXRlZCBFUzU6IGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8gKHNwZWNpZmljIGxpbmtzIGJlbG93KVxuICAgICAqIEVTNSBTcGVjOiBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvcHVibGljYXRpb25zL2ZpbGVzL0VDTUEtU1QvRWNtYS0yNjIucGRmXG4gICAgICogUmVxdWlyZWQgcmVhZGluZzogaHR0cDovL2phdmFzY3JpcHR3ZWJsb2cud29yZHByZXNzLmNvbS8yMDExLzEyLzA1L2V4dGVuZGluZy1qYXZhc2NyaXB0LW5hdGl2ZXMvXG4gICAgICovXG5cbiAgICAvLyBTaG9ydGN1dCB0byBhbiBvZnRlbiBhY2Nlc3NlZCBwcm9wZXJ0aWVzLCBpbiBvcmRlciB0byBhdm9pZCBtdWx0aXBsZVxuICAgIC8vIGRlcmVmZXJlbmNlIHRoYXQgY29zdHMgdW5pdmVyc2FsbHkuIFRoaXMgYWxzbyBob2xkcyBhIHJlZmVyZW5jZSB0byBrbm93bi1nb29kXG4gICAgLy8gZnVuY3Rpb25zLlxuICAgIHZhciAkQXJyYXkgPSBBcnJheTtcbiAgICB2YXIgQXJyYXlQcm90b3R5cGUgPSAkQXJyYXkucHJvdG90eXBlO1xuICAgIHZhciAkT2JqZWN0ID0gT2JqZWN0O1xuICAgIHZhciBPYmplY3RQcm90b3R5cGUgPSAkT2JqZWN0LnByb3RvdHlwZTtcbiAgICB2YXIgJEZ1bmN0aW9uID0gRnVuY3Rpb247XG4gICAgdmFyIEZ1bmN0aW9uUHJvdG90eXBlID0gJEZ1bmN0aW9uLnByb3RvdHlwZTtcbiAgICB2YXIgJFN0cmluZyA9IFN0cmluZztcbiAgICB2YXIgU3RyaW5nUHJvdG90eXBlID0gJFN0cmluZy5wcm90b3R5cGU7XG4gICAgdmFyICROdW1iZXIgPSBOdW1iZXI7XG4gICAgdmFyIE51bWJlclByb3RvdHlwZSA9ICROdW1iZXIucHJvdG90eXBlO1xuICAgIHZhciBhcnJheV9zbGljZSA9IEFycmF5UHJvdG90eXBlLnNsaWNlO1xuICAgIHZhciBhcnJheV9zcGxpY2UgPSBBcnJheVByb3RvdHlwZS5zcGxpY2U7XG4gICAgdmFyIGFycmF5X3B1c2ggPSBBcnJheVByb3RvdHlwZS5wdXNoO1xuICAgIHZhciBhcnJheV91bnNoaWZ0ID0gQXJyYXlQcm90b3R5cGUudW5zaGlmdDtcbiAgICB2YXIgYXJyYXlfY29uY2F0ID0gQXJyYXlQcm90b3R5cGUuY29uY2F0O1xuICAgIHZhciBhcnJheV9qb2luID0gQXJyYXlQcm90b3R5cGUuam9pbjtcbiAgICB2YXIgY2FsbCA9IEZ1bmN0aW9uUHJvdG90eXBlLmNhbGw7XG4gICAgdmFyIGFwcGx5ID0gRnVuY3Rpb25Qcm90b3R5cGUuYXBwbHk7XG4gICAgdmFyIG1heCA9IE1hdGgubWF4O1xuICAgIHZhciBtaW4gPSBNYXRoLm1pbjtcblxuICAgIC8vIEhhdmluZyBhIHRvU3RyaW5nIGxvY2FsIHZhcmlhYmxlIG5hbWUgYnJlYWtzIGluIE9wZXJhIHNvIHVzZSB0b19zdHJpbmcuXG4gICAgdmFyIHRvX3N0cmluZyA9IE9iamVjdFByb3RvdHlwZS50b1N0cmluZztcblxuICAgIC8qIGdsb2JhbCBTeW1ib2wgKi9cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBvbmUtdmFyLWRlY2xhcmF0aW9uLXBlci1saW5lLCBuby1yZWRlY2xhcmUsIG1heC1zdGF0ZW1lbnRzLXBlci1saW5lICovXG4gICAgdmFyIGhhc1RvU3RyaW5nVGFnID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJztcbiAgICB2YXIgaXNDYWxsYWJsZTsgLyogaW5saW5lZCBmcm9tIGh0dHBzOi8vbnBtanMuY29tL2lzLWNhbGxhYmxlICovIHZhciBmblRvU3RyID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nLCBjb25zdHJ1Y3RvclJlZ2V4ID0gL15cXHMqY2xhc3MgLywgaXNFUzZDbGFzc0ZuID0gZnVuY3Rpb24gaXNFUzZDbGFzc0ZuKHZhbHVlKSB7IHRyeSB7IHZhciBmblN0ciA9IGZuVG9TdHIuY2FsbCh2YWx1ZSk7IHZhciBzaW5nbGVTdHJpcHBlZCA9IGZuU3RyLnJlcGxhY2UoL1xcL1xcLy4qXFxuL2csICcnKTsgdmFyIG11bHRpU3RyaXBwZWQgPSBzaW5nbGVTdHJpcHBlZC5yZXBsYWNlKC9cXC9cXCpbLlxcc1xcU10qXFwqXFwvL2csICcnKTsgdmFyIHNwYWNlU3RyaXBwZWQgPSBtdWx0aVN0cmlwcGVkLnJlcGxhY2UoL1xcbi9tZywgJyAnKS5yZXBsYWNlKC8gezJ9L2csICcgJyk7IHJldHVybiBjb25zdHJ1Y3RvclJlZ2V4LnRlc3Qoc3BhY2VTdHJpcHBlZCk7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyAvKiBub3QgYSBmdW5jdGlvbiAqLyB9IH0sIHRyeUZ1bmN0aW9uT2JqZWN0ID0gZnVuY3Rpb24gdHJ5RnVuY3Rpb25PYmplY3QodmFsdWUpIHsgdHJ5IHsgaWYgKGlzRVM2Q2xhc3NGbih2YWx1ZSkpIHsgcmV0dXJuIGZhbHNlOyB9IGZuVG9TdHIuY2FsbCh2YWx1ZSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9LCBmbkNsYXNzID0gJ1tvYmplY3QgRnVuY3Rpb25dJywgZ2VuQ2xhc3MgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLCBpc0NhbGxhYmxlID0gZnVuY3Rpb24gaXNDYWxsYWJsZSh2YWx1ZSkgeyBpZiAoIXZhbHVlKSB7IHJldHVybiBmYWxzZTsgfSBpZiAodHlwZW9mIHZhbHVlICE9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHsgcmV0dXJuIGZhbHNlOyB9IGlmIChoYXNUb1N0cmluZ1RhZykgeyByZXR1cm4gdHJ5RnVuY3Rpb25PYmplY3QodmFsdWUpOyB9IGlmIChpc0VTNkNsYXNzRm4odmFsdWUpKSB7IHJldHVybiBmYWxzZTsgfSB2YXIgc3RyQ2xhc3MgPSB0b19zdHJpbmcuY2FsbCh2YWx1ZSk7IHJldHVybiBzdHJDbGFzcyA9PT0gZm5DbGFzcyB8fCBzdHJDbGFzcyA9PT0gZ2VuQ2xhc3M7IH07XG5cbiAgICB2YXIgaXNSZWdleDsgLyogaW5saW5lZCBmcm9tIGh0dHBzOi8vbnBtanMuY29tL2lzLXJlZ2V4ICovIHZhciByZWdleEV4ZWMgPSBSZWdFeHAucHJvdG90eXBlLmV4ZWMsIHRyeVJlZ2V4RXhlYyA9IGZ1bmN0aW9uIHRyeVJlZ2V4RXhlYyh2YWx1ZSkgeyB0cnkgeyByZWdleEV4ZWMuY2FsbCh2YWx1ZSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9LCByZWdleENsYXNzID0gJ1tvYmplY3QgUmVnRXhwXSc7IGlzUmVnZXggPSBmdW5jdGlvbiBpc1JlZ2V4KHZhbHVlKSB7IGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7IHJldHVybiBmYWxzZTsgfSByZXR1cm4gaGFzVG9TdHJpbmdUYWcgPyB0cnlSZWdleEV4ZWModmFsdWUpIDogdG9fc3RyaW5nLmNhbGwodmFsdWUpID09PSByZWdleENsYXNzOyB9O1xuICAgIHZhciBpc1N0cmluZzsgLyogaW5saW5lZCBmcm9tIGh0dHBzOi8vbnBtanMuY29tL2lzLXN0cmluZyAqLyB2YXIgc3RyVmFsdWUgPSBTdHJpbmcucHJvdG90eXBlLnZhbHVlT2YsIHRyeVN0cmluZ09iamVjdCA9IGZ1bmN0aW9uIHRyeVN0cmluZ09iamVjdCh2YWx1ZSkgeyB0cnkgeyBzdHJWYWx1ZS5jYWxsKHZhbHVlKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH0sIHN0cmluZ0NsYXNzID0gJ1tvYmplY3QgU3RyaW5nXSc7IGlzU3RyaW5nID0gZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHsgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHsgcmV0dXJuIHRydWU7IH0gaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHsgcmV0dXJuIGZhbHNlOyB9IHJldHVybiBoYXNUb1N0cmluZ1RhZyA/IHRyeVN0cmluZ09iamVjdCh2YWx1ZSkgOiB0b19zdHJpbmcuY2FsbCh2YWx1ZSkgPT09IHN0cmluZ0NsYXNzOyB9O1xuICAgIC8qIGVzbGludC1lbmFibGUgb25lLXZhci1kZWNsYXJhdGlvbi1wZXItbGluZSwgbm8tcmVkZWNsYXJlLCBtYXgtc3RhdGVtZW50cy1wZXItbGluZSAqL1xuXG4gICAgLyogaW5saW5lZCBmcm9tIGh0dHA6Ly9ucG1qcy5jb20vZGVmaW5lLXByb3BlcnRpZXMgKi9cbiAgICB2YXIgc3VwcG9ydHNEZXNjcmlwdG9ycyA9ICRPYmplY3QuZGVmaW5lUHJvcGVydHkgJiYgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgICAgICAgICRPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCAneCcsIHsgZW51bWVyYWJsZTogZmFsc2UsIHZhbHVlOiBvYmogfSk7XG4gICAgICAgICAgICBmb3IgKHZhciBfIGluIG9iaikgeyAvLyBqc2NzOmlnbm9yZSBkaXNhbGxvd1VudXNlZFZhcmlhYmxlc1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvYmoueCA9PT0gb2JqO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIHRoaXMgaXMgRVMzICovXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KCkpO1xuICAgIHZhciBkZWZpbmVQcm9wZXJ0aWVzID0gKGZ1bmN0aW9uIChoYXMpIHtcbiAgICAgICAgLy8gRGVmaW5lIGNvbmZpZ3VyYWJsZSwgd3JpdGFibGUsIGFuZCBub24tZW51bWVyYWJsZSBwcm9wc1xuICAgICAgICAvLyBpZiB0aGV5IGRvbid0IGV4aXN0LlxuICAgICAgICB2YXIgZGVmaW5lUHJvcGVydHk7XG4gICAgICAgIGlmIChzdXBwb3J0c0Rlc2NyaXB0b3JzKSB7XG4gICAgICAgICAgICBkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWUsIG1ldGhvZCwgZm9yY2VBc3NpZ24pIHtcbiAgICAgICAgICAgICAgICBpZiAoIWZvcmNlQXNzaWduICYmIChuYW1lIGluIG9iamVjdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwge1xuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IG1ldGhvZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZSwgbWV0aG9kLCBmb3JjZUFzc2lnbikge1xuICAgICAgICAgICAgICAgIGlmICghZm9yY2VBc3NpZ24gJiYgKG5hbWUgaW4gb2JqZWN0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9iamVjdFtuYW1lXSA9IG1ldGhvZDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMob2JqZWN0LCBtYXAsIGZvcmNlQXNzaWduKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBuYW1lIGluIG1hcCkge1xuICAgICAgICAgICAgICAgIGlmIChoYXMuY2FsbChtYXAsIG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwgbWFwW25hbWVdLCBmb3JjZUFzc2lnbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0oT2JqZWN0UHJvdG90eXBlLmhhc093blByb3BlcnR5KSk7XG5cbiAgICAvL1xuICAgIC8vIFV0aWxcbiAgICAvLyA9PT09PT1cbiAgICAvL1xuXG4gICAgLyogcmVwbGFjZWFibGUgd2l0aCBodHRwczovL25wbWpzLmNvbS9wYWNrYWdlL2VzLWFic3RyYWN0IC9oZWxwZXJzL2lzUHJpbWl0aXZlICovXG4gICAgdmFyIGlzUHJpbWl0aXZlID0gZnVuY3Rpb24gaXNQcmltaXRpdmUoaW5wdXQpIHtcbiAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgaW5wdXQ7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PT0gbnVsbCB8fCAodHlwZSAhPT0gJ29iamVjdCcgJiYgdHlwZSAhPT0gJ2Z1bmN0aW9uJyk7XG4gICAgfTtcblxuICAgIHZhciBpc0FjdHVhbE5hTiA9ICROdW1iZXIuaXNOYU4gfHwgZnVuY3Rpb24gaXNBY3R1YWxOYU4oeCkge1xuICAgICAgICByZXR1cm4geCAhPT0geDtcbiAgICB9O1xuXG4gICAgdmFyIEVTID0ge1xuICAgICAgICAvLyBFUzUgOS40XG4gICAgICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDkuNFxuICAgICAgICAvLyBodHRwOi8vanNwZXJmLmNvbS90by1pbnRlZ2VyXG4gICAgICAgIC8qIHJlcGxhY2VhYmxlIHdpdGggaHR0cHM6Ly9ucG1qcy5jb20vcGFja2FnZS9lcy1hYnN0cmFjdCBFUzUuVG9JbnRlZ2VyICovXG4gICAgICAgIFRvSW50ZWdlcjogZnVuY3Rpb24gVG9JbnRlZ2VyKG51bSkge1xuICAgICAgICAgICAgdmFyIG4gPSArbnVtO1xuICAgICAgICAgICAgaWYgKGlzQWN0dWFsTmFOKG4pKSB7XG4gICAgICAgICAgICAgICAgbiA9IDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG4gIT09IDAgJiYgbiAhPT0gKDEgLyAwKSAmJiBuICE9PSAtKDEgLyAwKSkge1xuICAgICAgICAgICAgICAgIG4gPSAobiA+IDAgfHwgLTEpICogTWF0aC5mbG9vcihNYXRoLmFicyhuKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgfSxcblxuICAgICAgICAvKiByZXBsYWNlYWJsZSB3aXRoIGh0dHBzOi8vbnBtanMuY29tL3BhY2thZ2UvZXMtYWJzdHJhY3QgRVM1LlRvUHJpbWl0aXZlICovXG4gICAgICAgIFRvUHJpbWl0aXZlOiBmdW5jdGlvbiBUb1ByaW1pdGl2ZShpbnB1dCkge1xuICAgICAgICAgICAgdmFyIHZhbCwgdmFsdWVPZiwgdG9TdHI7XG4gICAgICAgICAgICBpZiAoaXNQcmltaXRpdmUoaW5wdXQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWVPZiA9IGlucHV0LnZhbHVlT2Y7XG4gICAgICAgICAgICBpZiAoaXNDYWxsYWJsZSh2YWx1ZU9mKSkge1xuICAgICAgICAgICAgICAgIHZhbCA9IHZhbHVlT2YuY2FsbChpbnB1dCk7XG4gICAgICAgICAgICAgICAgaWYgKGlzUHJpbWl0aXZlKHZhbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b1N0ciA9IGlucHV0LnRvU3RyaW5nO1xuICAgICAgICAgICAgaWYgKGlzQ2FsbGFibGUodG9TdHIpKSB7XG4gICAgICAgICAgICAgICAgdmFsID0gdG9TdHIuY2FsbChpbnB1dCk7XG4gICAgICAgICAgICAgICAgaWYgKGlzUHJpbWl0aXZlKHZhbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gRVM1IDkuOVxuICAgICAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3g5LjlcbiAgICAgICAgLyogcmVwbGFjZWFibGUgd2l0aCBodHRwczovL25wbWpzLmNvbS9wYWNrYWdlL2VzLWFic3RyYWN0IEVTNS5Ub09iamVjdCAqL1xuICAgICAgICBUb09iamVjdDogZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgICAgIGlmIChvID09IG51bGwpIHsgLy8gdGhpcyBtYXRjaGVzIGJvdGggbnVsbCBhbmQgdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbid0IGNvbnZlcnQgXCIgKyBvICsgJyB0byBvYmplY3QnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAkT2JqZWN0KG8pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qIHJlcGxhY2VhYmxlIHdpdGggaHR0cHM6Ly9ucG1qcy5jb20vcGFja2FnZS9lcy1hYnN0cmFjdCBFUzUuVG9VaW50MzIgKi9cbiAgICAgICAgVG9VaW50MzI6IGZ1bmN0aW9uIFRvVWludDMyKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB4ID4+PiAwO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vXG4gICAgLy8gRnVuY3Rpb25cbiAgICAvLyA9PT09PT09PVxuICAgIC8vXG5cbiAgICAvLyBFUy01IDE1LjMuNC41XG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMy40LjVcblxuICAgIHZhciBFbXB0eSA9IGZ1bmN0aW9uIEVtcHR5KCkge307XG5cbiAgICBkZWZpbmVQcm9wZXJ0aWVzKEZ1bmN0aW9uUHJvdG90eXBlLCB7XG4gICAgICAgIGJpbmQ6IGZ1bmN0aW9uIGJpbmQodGhhdCkgeyAvLyAubGVuZ3RoIGlzIDFcbiAgICAgICAgICAgIC8vIDEuIExldCBUYXJnZXQgYmUgdGhlIHRoaXMgdmFsdWUuXG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcztcbiAgICAgICAgICAgIC8vIDIuIElmIElzQ2FsbGFibGUoVGFyZ2V0KSBpcyBmYWxzZSwgdGhyb3cgYSBUeXBlRXJyb3IgZXhjZXB0aW9uLlxuICAgICAgICAgICAgaWYgKCFpc0NhbGxhYmxlKHRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBjYWxsZWQgb24gaW5jb21wYXRpYmxlICcgKyB0YXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gMy4gTGV0IEEgYmUgYSBuZXcgKHBvc3NpYmx5IGVtcHR5KSBpbnRlcm5hbCBsaXN0IG9mIGFsbCBvZiB0aGVcbiAgICAgICAgICAgIC8vICAgYXJndW1lbnQgdmFsdWVzIHByb3ZpZGVkIGFmdGVyIHRoaXNBcmcgKGFyZzEsIGFyZzIgZXRjKSwgaW4gb3JkZXIuXG4gICAgICAgICAgICAvLyBYWFggc2xpY2VkQXJncyB3aWxsIHN0YW5kIGluIGZvciBcIkFcIiBpZiB1c2VkXG4gICAgICAgICAgICB2YXIgYXJncyA9IGFycmF5X3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTsgLy8gZm9yIG5vcm1hbCBjYWxsXG4gICAgICAgICAgICAvLyA0LiBMZXQgRiBiZSBhIG5ldyBuYXRpdmUgRUNNQVNjcmlwdCBvYmplY3QuXG4gICAgICAgICAgICAvLyAxMS4gU2V0IHRoZSBbW1Byb3RvdHlwZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgdG8gdGhlIHN0YW5kYXJkXG4gICAgICAgICAgICAvLyAgIGJ1aWx0LWluIEZ1bmN0aW9uIHByb3RvdHlwZSBvYmplY3QgYXMgc3BlY2lmaWVkIGluIDE1LjMuMy4xLlxuICAgICAgICAgICAgLy8gMTIuIFNldCB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiBhcyBkZXNjcmliZWQgaW5cbiAgICAgICAgICAgIC8vICAgMTUuMy40LjUuMS5cbiAgICAgICAgICAgIC8vIDEzLiBTZXQgdGhlIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiBhcyBkZXNjcmliZWQgaW5cbiAgICAgICAgICAgIC8vICAgMTUuMy40LjUuMi5cbiAgICAgICAgICAgIC8vIDE0LiBTZXQgdGhlIFtbSGFzSW5zdGFuY2VdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxuICAgICAgICAgICAgLy8gICAxNS4zLjQuNS4zLlxuICAgICAgICAgICAgdmFyIGJvdW5kO1xuICAgICAgICAgICAgdmFyIGJpbmRlciA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgYm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gMTUuMy40LjUuMiBbW0NvbnN0cnVjdF1dXG4gICAgICAgICAgICAgICAgICAgIC8vIFdoZW4gdGhlIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgbWV0aG9kIG9mIGEgZnVuY3Rpb24gb2JqZWN0LFxuICAgICAgICAgICAgICAgICAgICAvLyBGIHRoYXQgd2FzIGNyZWF0ZWQgdXNpbmcgdGhlIGJpbmQgZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggYVxuICAgICAgICAgICAgICAgICAgICAvLyBsaXN0IG9mIGFyZ3VtZW50cyBFeHRyYUFyZ3MsIHRoZSBmb2xsb3dpbmcgc3RlcHMgYXJlIHRha2VuOlxuICAgICAgICAgICAgICAgICAgICAvLyAxLiBMZXQgdGFyZ2V0IGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tUYXJnZXRGdW5jdGlvbl1dXG4gICAgICAgICAgICAgICAgICAgIC8vICAgaW50ZXJuYWwgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgICAgIC8vIDIuIElmIHRhcmdldCBoYXMgbm8gW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBtZXRob2QsIGFcbiAgICAgICAgICAgICAgICAgICAgLy8gICBUeXBlRXJyb3IgZXhjZXB0aW9uIGlzIHRocm93bi5cbiAgICAgICAgICAgICAgICAgICAgLy8gMy4gTGV0IGJvdW5kQXJncyBiZSB0aGUgdmFsdWUgb2YgRidzIFtbQm91bmRBcmdzXV0gaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAgICAgLy8gICBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAgICAgICAgLy8gNC4gTGV0IGFyZ3MgYmUgYSBuZXcgbGlzdCBjb250YWluaW5nIHRoZSBzYW1lIHZhbHVlcyBhcyB0aGVcbiAgICAgICAgICAgICAgICAgICAgLy8gICBsaXN0IGJvdW5kQXJncyBpbiB0aGUgc2FtZSBvcmRlciBmb2xsb3dlZCBieSB0aGUgc2FtZVxuICAgICAgICAgICAgICAgICAgICAvLyAgIHZhbHVlcyBhcyB0aGUgbGlzdCBFeHRyYUFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIuXG4gICAgICAgICAgICAgICAgICAgIC8vIDUuIFJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbQ29uc3RydWN0XV0gaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAgICAgLy8gICBtZXRob2Qgb2YgdGFyZ2V0IHByb3ZpZGluZyBhcmdzIGFzIHRoZSBhcmd1bWVudHMuXG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGFwcGx5LmNhbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXlfY29uY2F0LmNhbGwoYXJncywgYXJyYXlfc2xpY2UuY2FsbChhcmd1bWVudHMpKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoJE9iamVjdChyZXN1bHQpID09PSByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyAxNS4zLjQuNS4xIFtbQ2FsbF1dXG4gICAgICAgICAgICAgICAgICAgIC8vIFdoZW4gdGhlIFtbQ2FsbF1dIGludGVybmFsIG1ldGhvZCBvZiBhIGZ1bmN0aW9uIG9iamVjdCwgRixcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggd2FzIGNyZWF0ZWQgdXNpbmcgdGhlIGJpbmQgZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggYVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIHZhbHVlIGFuZCBhIGxpc3Qgb2YgYXJndW1lbnRzIEV4dHJhQXJncywgdGhlIGZvbGxvd2luZ1xuICAgICAgICAgICAgICAgICAgICAvLyBzdGVwcyBhcmUgdGFrZW46XG4gICAgICAgICAgICAgICAgICAgIC8vIDEuIExldCBib3VuZEFyZ3MgYmUgdGhlIHZhbHVlIG9mIEYncyBbW0JvdW5kQXJnc11dIGludGVybmFsXG4gICAgICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgICAgIC8vIDIuIExldCBib3VuZFRoaXMgYmUgdGhlIHZhbHVlIG9mIEYncyBbW0JvdW5kVGhpc11dIGludGVybmFsXG4gICAgICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgICAgIC8vIDMuIExldCB0YXJnZXQgYmUgdGhlIHZhbHVlIG9mIEYncyBbW1RhcmdldEZ1bmN0aW9uXV0gaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAgICAgLy8gICBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAgICAgICAgLy8gNC4gTGV0IGFyZ3MgYmUgYSBuZXcgbGlzdCBjb250YWluaW5nIHRoZSBzYW1lIHZhbHVlcyBhcyB0aGVcbiAgICAgICAgICAgICAgICAgICAgLy8gICBsaXN0IGJvdW5kQXJncyBpbiB0aGUgc2FtZSBvcmRlciBmb2xsb3dlZCBieSB0aGUgc2FtZVxuICAgICAgICAgICAgICAgICAgICAvLyAgIHZhbHVlcyBhcyB0aGUgbGlzdCBFeHRyYUFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIuXG4gICAgICAgICAgICAgICAgICAgIC8vIDUuIFJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbQ2FsbF1dIGludGVybmFsIG1ldGhvZFxuICAgICAgICAgICAgICAgICAgICAvLyAgIG9mIHRhcmdldCBwcm92aWRpbmcgYm91bmRUaGlzIGFzIHRoZSB0aGlzIHZhbHVlIGFuZFxuICAgICAgICAgICAgICAgICAgICAvLyAgIHByb3ZpZGluZyBhcmdzIGFzIHRoZSBhcmd1bWVudHMuXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZXF1aXY6IHRhcmdldC5jYWxsKHRoaXMsIC4uLmJvdW5kQXJncywgLi4uYXJncylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwcGx5LmNhbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXlfY29uY2F0LmNhbGwoYXJncywgYXJyYXlfc2xpY2UuY2FsbChhcmd1bWVudHMpKVxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyAxNS4gSWYgdGhlIFtbQ2xhc3NdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBUYXJnZXQgaXMgXCJGdW5jdGlvblwiLCB0aGVuXG4gICAgICAgICAgICAvLyAgICAgYS4gTGV0IEwgYmUgdGhlIGxlbmd0aCBwcm9wZXJ0eSBvZiBUYXJnZXQgbWludXMgdGhlIGxlbmd0aCBvZiBBLlxuICAgICAgICAgICAgLy8gICAgIGIuIFNldCB0aGUgbGVuZ3RoIG93biBwcm9wZXJ0eSBvZiBGIHRvIGVpdGhlciAwIG9yIEwsIHdoaWNoZXZlciBpc1xuICAgICAgICAgICAgLy8gICAgICAgbGFyZ2VyLlxuICAgICAgICAgICAgLy8gMTYuIEVsc2Ugc2V0IHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gMC5cblxuICAgICAgICAgICAgdmFyIGJvdW5kTGVuZ3RoID0gbWF4KDAsIHRhcmdldC5sZW5ndGggLSBhcmdzLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIC8vIDE3LiBTZXQgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byB0aGUgdmFsdWVzXG4gICAgICAgICAgICAvLyAgIHNwZWNpZmllZCBpbiAxNS4zLjUuMS5cbiAgICAgICAgICAgIHZhciBib3VuZEFyZ3MgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm91bmRMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGFycmF5X3B1c2guY2FsbChib3VuZEFyZ3MsICckJyArIGkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBYWFggQnVpbGQgYSBkeW5hbWljIGZ1bmN0aW9uIHdpdGggZGVzaXJlZCBhbW91bnQgb2YgYXJndW1lbnRzIGlzIHRoZSBvbmx5XG4gICAgICAgICAgICAvLyB3YXkgdG8gc2V0IHRoZSBsZW5ndGggcHJvcGVydHkgb2YgYSBmdW5jdGlvbi5cbiAgICAgICAgICAgIC8vIEluIGVudmlyb25tZW50cyB3aGVyZSBDb250ZW50IFNlY3VyaXR5IFBvbGljaWVzIGVuYWJsZWQgKENocm9tZSBleHRlbnNpb25zLFxuICAgICAgICAgICAgLy8gZm9yIGV4LikgYWxsIHVzZSBvZiBldmFsIG9yIEZ1bmN0aW9uIGNvc3RydWN0b3IgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAgICAgIC8vIEhvd2V2ZXIgaW4gYWxsIG9mIHRoZXNlIGVudmlyb25tZW50cyBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBleGlzdHNcbiAgICAgICAgICAgIC8vIGFuZCBzbyB0aGlzIGNvZGUgd2lsbCBuZXZlciBiZSBleGVjdXRlZC5cbiAgICAgICAgICAgIGJvdW5kID0gJEZ1bmN0aW9uKCdiaW5kZXInLCAncmV0dXJuIGZ1bmN0aW9uICgnICsgYXJyYXlfam9pbi5jYWxsKGJvdW5kQXJncywgJywnKSArICcpeyByZXR1cm4gYmluZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH0nKShiaW5kZXIpO1xuXG4gICAgICAgICAgICBpZiAodGFyZ2V0LnByb3RvdHlwZSkge1xuICAgICAgICAgICAgICAgIEVtcHR5LnByb3RvdHlwZSA9IHRhcmdldC5wcm90b3R5cGU7XG4gICAgICAgICAgICAgICAgYm91bmQucHJvdG90eXBlID0gbmV3IEVtcHR5KCk7XG4gICAgICAgICAgICAgICAgLy8gQ2xlYW4gdXAgZGFuZ2xpbmcgcmVmZXJlbmNlcy5cbiAgICAgICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUT0RPXG4gICAgICAgICAgICAvLyAxOC4gU2V0IHRoZSBbW0V4dGVuc2libGVdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIHRvIHRydWUuXG5cbiAgICAgICAgICAgIC8vIFRPRE9cbiAgICAgICAgICAgIC8vIDE5LiBMZXQgdGhyb3dlciBiZSB0aGUgW1tUaHJvd1R5cGVFcnJvcl1dIGZ1bmN0aW9uIE9iamVjdCAoMTMuMi4zKS5cbiAgICAgICAgICAgIC8vIDIwLiBDYWxsIHRoZSBbW0RlZmluZU93blByb3BlcnR5XV0gaW50ZXJuYWwgbWV0aG9kIG9mIEYgd2l0aFxuICAgICAgICAgICAgLy8gICBhcmd1bWVudHMgXCJjYWxsZXJcIiwgUHJvcGVydHlEZXNjcmlwdG9yIHtbW0dldF1dOiB0aHJvd2VyLCBbW1NldF1dOlxuICAgICAgICAgICAgLy8gICB0aHJvd2VyLCBbW0VudW1lcmFibGVdXTogZmFsc2UsIFtbQ29uZmlndXJhYmxlXV06IGZhbHNlfSwgYW5kXG4gICAgICAgICAgICAvLyAgIGZhbHNlLlxuICAgICAgICAgICAgLy8gMjEuIENhbGwgdGhlIFtbRGVmaW5lT3duUHJvcGVydHldXSBpbnRlcm5hbCBtZXRob2Qgb2YgRiB3aXRoXG4gICAgICAgICAgICAvLyAgIGFyZ3VtZW50cyBcImFyZ3VtZW50c1wiLCBQcm9wZXJ0eURlc2NyaXB0b3Ige1tbR2V0XV06IHRocm93ZXIsXG4gICAgICAgICAgICAvLyAgIFtbU2V0XV06IHRocm93ZXIsIFtbRW51bWVyYWJsZV1dOiBmYWxzZSwgW1tDb25maWd1cmFibGVdXTogZmFsc2V9LFxuICAgICAgICAgICAgLy8gICBhbmQgZmFsc2UuXG5cbiAgICAgICAgICAgIC8vIFRPRE9cbiAgICAgICAgICAgIC8vIE5PVEUgRnVuY3Rpb24gb2JqZWN0cyBjcmVhdGVkIHVzaW5nIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGRvIG5vdFxuICAgICAgICAgICAgLy8gaGF2ZSBhIHByb3RvdHlwZSBwcm9wZXJ0eSBvciB0aGUgW1tDb2RlXV0sIFtbRm9ybWFsUGFyYW1ldGVyc11dLCBhbmRcbiAgICAgICAgICAgIC8vIFtbU2NvcGVdXSBpbnRlcm5hbCBwcm9wZXJ0aWVzLlxuICAgICAgICAgICAgLy8gWFhYIGNhbid0IGRlbGV0ZSBwcm90b3R5cGUgaW4gcHVyZS1qcy5cblxuICAgICAgICAgICAgLy8gMjIuIFJldHVybiBGLlxuICAgICAgICAgICAgcmV0dXJuIGJvdW5kO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBfUGxlYXNlIG5vdGU6IFNob3J0Y3V0cyBhcmUgZGVmaW5lZCBhZnRlciBgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRgIGFzIHdlXG4gICAgLy8gdXNlIGl0IGluIGRlZmluaW5nIHNob3J0Y3V0cy5cbiAgICB2YXIgb3ducyA9IGNhbGwuYmluZChPYmplY3RQcm90b3R5cGUuaGFzT3duUHJvcGVydHkpO1xuICAgIHZhciB0b1N0ciA9IGNhbGwuYmluZChPYmplY3RQcm90b3R5cGUudG9TdHJpbmcpO1xuICAgIHZhciBhcnJheVNsaWNlID0gY2FsbC5iaW5kKGFycmF5X3NsaWNlKTtcbiAgICB2YXIgYXJyYXlTbGljZUFwcGx5ID0gYXBwbHkuYmluZChhcnJheV9zbGljZSk7XG4gICAgLyogZ2xvYmFscyBkb2N1bWVudCAqL1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICdvYmplY3QnICYmIGRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXJyYXlTbGljZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2hpbGROb2Rlcyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciBvcmlnQXJyYXlTbGljZSA9IGFycmF5U2xpY2U7XG4gICAgICAgICAgICB2YXIgb3JpZ0FycmF5U2xpY2VBcHBseSA9IGFycmF5U2xpY2VBcHBseTtcbiAgICAgICAgICAgIGFycmF5U2xpY2UgPSBmdW5jdGlvbiBhcnJheVNsaWNlSUUoYXJyKSB7XG4gICAgICAgICAgICAgICAgdmFyIHIgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IGFyci5sZW5ndGg7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGktLSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcltpXSA9IGFycltpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdBcnJheVNsaWNlQXBwbHkociwgb3JpZ0FycmF5U2xpY2UoYXJndW1lbnRzLCAxKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYXJyYXlTbGljZUFwcGx5ID0gZnVuY3Rpb24gYXJyYXlTbGljZUFwcGx5SUUoYXJyLCBhcmdzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdBcnJheVNsaWNlQXBwbHkoYXJyYXlTbGljZShhcnIpLCBhcmdzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIHN0clNsaWNlID0gY2FsbC5iaW5kKFN0cmluZ1Byb3RvdHlwZS5zbGljZSk7XG4gICAgdmFyIHN0clNwbGl0ID0gY2FsbC5iaW5kKFN0cmluZ1Byb3RvdHlwZS5zcGxpdCk7XG4gICAgdmFyIHN0ckluZGV4T2YgPSBjYWxsLmJpbmQoU3RyaW5nUHJvdG90eXBlLmluZGV4T2YpO1xuICAgIHZhciBwdXNoQ2FsbCA9IGNhbGwuYmluZChhcnJheV9wdXNoKTtcbiAgICB2YXIgaXNFbnVtID0gY2FsbC5iaW5kKE9iamVjdFByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZSk7XG4gICAgdmFyIGFycmF5U29ydCA9IGNhbGwuYmluZChBcnJheVByb3RvdHlwZS5zb3J0KTtcblxuICAgIC8vXG4gICAgLy8gQXJyYXlcbiAgICAvLyA9PT09PVxuICAgIC8vXG5cbiAgICB2YXIgaXNBcnJheSA9ICRBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG4gICAgICAgIHJldHVybiB0b1N0cihvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH07XG5cbiAgICAvLyBFUzUgMTUuNC40LjEyXG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjEzXG4gICAgLy8gUmV0dXJuIGxlbithcmdDb3VudC5cbiAgICAvLyBbYnVnZml4LCBpZWx0OF1cbiAgICAvLyBJRSA8IDggYnVnOiBbXS51bnNoaWZ0KDApID09PSB1bmRlZmluZWQgYnV0IHNob3VsZCBiZSBcIjFcIlxuICAgIHZhciBoYXNVbnNoaWZ0UmV0dXJuVmFsdWVCdWcgPSBbXS51bnNoaWZ0KDApICE9PSAxO1xuICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgdW5zaGlmdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYXJyYXlfdW5zaGlmdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoO1xuICAgICAgICB9XG4gICAgfSwgaGFzVW5zaGlmdFJldHVyblZhbHVlQnVnKTtcblxuICAgIC8vIEVTNSAxNS40LjMuMlxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuMy4yXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvaXNBcnJheVxuICAgIGRlZmluZVByb3BlcnRpZXMoJEFycmF5LCB7IGlzQXJyYXk6IGlzQXJyYXkgfSk7XG5cbiAgICAvLyBUaGUgSXNDYWxsYWJsZSgpIGNoZWNrIGluIHRoZSBBcnJheSBmdW5jdGlvbnNcbiAgICAvLyBoYXMgYmVlbiByZXBsYWNlZCB3aXRoIGEgc3RyaWN0IGNoZWNrIG9uIHRoZVxuICAgIC8vIGludGVybmFsIGNsYXNzIG9mIHRoZSBvYmplY3QgdG8gdHJhcCBjYXNlcyB3aGVyZVxuICAgIC8vIHRoZSBwcm92aWRlZCBmdW5jdGlvbiB3YXMgYWN0dWFsbHkgYSByZWd1bGFyXG4gICAgLy8gZXhwcmVzc2lvbiBsaXRlcmFsLCB3aGljaCBpbiBWOCBhbmRcbiAgICAvLyBKYXZhU2NyaXB0Q29yZSBpcyBhIHR5cGVvZiBcImZ1bmN0aW9uXCIuICBPbmx5IGluXG4gICAgLy8gVjggYXJlIHJlZ3VsYXIgZXhwcmVzc2lvbiBsaXRlcmFscyBwZXJtaXR0ZWQgYXNcbiAgICAvLyByZWR1Y2UgcGFyYW1ldGVycywgc28gaXQgaXMgZGVzaXJhYmxlIGluIHRoZVxuICAgIC8vIGdlbmVyYWwgY2FzZSBmb3IgdGhlIHNoaW0gdG8gbWF0Y2ggdGhlIG1vcmVcbiAgICAvLyBzdHJpY3QgYW5kIGNvbW1vbiBiZWhhdmlvciBvZiByZWplY3RpbmcgcmVndWxhclxuICAgIC8vIGV4cHJlc3Npb25zLlxuXG4gICAgLy8gRVM1IDE1LjQuNC4xOFxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xOFxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL2FycmF5L2ZvckVhY2hcblxuICAgIC8vIENoZWNrIGZhaWx1cmUgb2YgYnktaW5kZXggYWNjZXNzIG9mIHN0cmluZyBjaGFyYWN0ZXJzIChJRSA8IDkpXG4gICAgLy8gYW5kIGZhaWx1cmUgb2YgYDAgaW4gYm94ZWRTdHJpbmdgIChSaGlubylcbiAgICB2YXIgYm94ZWRTdHJpbmcgPSAkT2JqZWN0KCdhJyk7XG4gICAgdmFyIHNwbGl0U3RyaW5nID0gYm94ZWRTdHJpbmdbMF0gIT09ICdhJyB8fCAhKDAgaW4gYm94ZWRTdHJpbmcpO1xuXG4gICAgdmFyIHByb3Blcmx5Qm94ZXNDb250ZXh0ID0gZnVuY3Rpb24gcHJvcGVybHlCb3hlZChtZXRob2QpIHtcbiAgICAgICAgLy8gQ2hlY2sgbm9kZSAwLjYuMjEgYnVnIHdoZXJlIHRoaXJkIHBhcmFtZXRlciBpcyBub3QgYm94ZWRcbiAgICAgICAgdmFyIHByb3Blcmx5Qm94ZXNOb25TdHJpY3QgPSB0cnVlO1xuICAgICAgICB2YXIgcHJvcGVybHlCb3hlc1N0cmljdCA9IHRydWU7XG4gICAgICAgIHZhciB0aHJld0V4Y2VwdGlvbiA9IGZhbHNlO1xuICAgICAgICBpZiAobWV0aG9kKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG1ldGhvZC5jYWxsKCdmb28nLCBmdW5jdGlvbiAoXywgX18sIGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb250ZXh0ICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVybHlCb3hlc05vblN0cmljdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBtZXRob2QuY2FsbChbMV0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgICAgICAgICAgICAgIHByb3Blcmx5Qm94ZXNTdHJpY3QgPSB0eXBlb2YgdGhpcyA9PT0gJ3N0cmluZyc7XG4gICAgICAgICAgICAgICAgfSwgJ3gnKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICB0aHJld0V4Y2VwdGlvbiA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICEhbWV0aG9kICYmICF0aHJld0V4Y2VwdGlvbiAmJiBwcm9wZXJseUJveGVzTm9uU3RyaWN0ICYmIHByb3Blcmx5Qm94ZXNTdHJpY3Q7XG4gICAgfTtcblxuICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgZm9yRWFjaDogZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuLyosIHRoaXNBcmcqLykge1xuICAgICAgICAgICAgdmFyIG9iamVjdCA9IEVTLlRvT2JqZWN0KHRoaXMpO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBpc1N0cmluZyh0aGlzKSA/IHN0clNwbGl0KHRoaXMsICcnKSA6IG9iamVjdDtcbiAgICAgICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gRVMuVG9VaW50MzIoc2VsZi5sZW5ndGgpO1xuICAgICAgICAgICAgdmFyIFQ7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICBUID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBubyBjYWxsYmFjayBmdW5jdGlvbiBvciBpZiBjYWxsYmFjayBpcyBub3QgYSBjYWxsYWJsZSBmdW5jdGlvblxuICAgICAgICAgICAgaWYgKCFpc0NhbGxhYmxlKGNhbGxiYWNrZm4pKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkucHJvdG90eXBlLmZvckVhY2ggY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdoaWxlICgrK2kgPCBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAoaSBpbiBzZWxmKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEludm9rZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gd2l0aCBjYWxsLCBwYXNzaW5nIGFyZ3VtZW50czpcbiAgICAgICAgICAgICAgICAgICAgLy8gY29udGV4dCwgcHJvcGVydHkgdmFsdWUsIHByb3BlcnR5IGtleSwgdGhpc0FyZyBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBUID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tmbihzZWxmW2ldLCBpLCBvYmplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tmbi5jYWxsKFQsIHNlbGZbaV0sIGksIG9iamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCAhcHJvcGVybHlCb3hlc0NvbnRleHQoQXJyYXlQcm90b3R5cGUuZm9yRWFjaCkpO1xuXG4gICAgLy8gRVM1IDE1LjQuNC4xOVxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xOVxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0NvcmVfSmF2YVNjcmlwdF8xLjVfUmVmZXJlbmNlL09iamVjdHMvQXJyYXkvbWFwXG4gICAgZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwge1xuICAgICAgICBtYXA6IGZ1bmN0aW9uIG1hcChjYWxsYmFja2ZuLyosIHRoaXNBcmcqLykge1xuICAgICAgICAgICAgdmFyIG9iamVjdCA9IEVTLlRvT2JqZWN0KHRoaXMpO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBpc1N0cmluZyh0aGlzKSA/IHN0clNwbGl0KHRoaXMsICcnKSA6IG9iamVjdDtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBFUy5Ub1VpbnQzMihzZWxmLmxlbmd0aCk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gJEFycmF5KGxlbmd0aCk7XG4gICAgICAgICAgICB2YXIgVDtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIFQgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIG5vIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIGlmIGNhbGxiYWNrIGlzIG5vdCBhIGNhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgICAgICBpZiAoIWlzQ2FsbGFibGUoY2FsbGJhY2tmbikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcnJheS5wcm90b3R5cGUubWFwIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgaW4gc2VsZikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIFQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbaV0gPSBjYWxsYmFja2ZuKHNlbGZbaV0sIGksIG9iamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbaV0gPSBjYWxsYmFja2ZuLmNhbGwoVCwgc2VsZltpXSwgaSwgb2JqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9LCAhcHJvcGVybHlCb3hlc0NvbnRleHQoQXJyYXlQcm90b3R5cGUubWFwKSk7XG5cbiAgICAvLyBFUzUgMTUuNC40LjIwXG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjIwXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vQ29yZV9KYXZhU2NyaXB0XzEuNV9SZWZlcmVuY2UvT2JqZWN0cy9BcnJheS9maWx0ZXJcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgICAgIGZpbHRlcjogZnVuY3Rpb24gZmlsdGVyKGNhbGxiYWNrZm4vKiwgdGhpc0FyZyovKSB7XG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0gRVMuVG9PYmplY3QodGhpcyk7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHNwbGl0U3RyaW5nICYmIGlzU3RyaW5nKHRoaXMpID8gc3RyU3BsaXQodGhpcywgJycpIDogb2JqZWN0O1xuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IEVTLlRvVWludDMyKHNlbGYubGVuZ3RoKTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIHZhciB2YWx1ZTtcbiAgICAgICAgICAgIHZhciBUO1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgVCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgICAgIGlmICghaXNDYWxsYWJsZShjYWxsYmFja2ZuKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FycmF5LnByb3RvdHlwZS5maWx0ZXIgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaSBpbiBzZWxmKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gc2VsZltpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBUID09PSAndW5kZWZpbmVkJyA/IGNhbGxiYWNrZm4odmFsdWUsIGksIG9iamVjdCkgOiBjYWxsYmFja2ZuLmNhbGwoVCwgdmFsdWUsIGksIG9iamVjdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hDYWxsKHJlc3VsdCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH0sICFwcm9wZXJseUJveGVzQ29udGV4dChBcnJheVByb3RvdHlwZS5maWx0ZXIpKTtcblxuICAgIC8vIEVTNSAxNS40LjQuMTZcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMTZcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9ldmVyeVxuICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgZXZlcnk6IGZ1bmN0aW9uIGV2ZXJ5KGNhbGxiYWNrZm4vKiwgdGhpc0FyZyovKSB7XG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0gRVMuVG9PYmplY3QodGhpcyk7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHNwbGl0U3RyaW5nICYmIGlzU3RyaW5nKHRoaXMpID8gc3RyU3BsaXQodGhpcywgJycpIDogb2JqZWN0O1xuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IEVTLlRvVWludDMyKHNlbGYubGVuZ3RoKTtcbiAgICAgICAgICAgIHZhciBUO1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgVCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgICAgIGlmICghaXNDYWxsYWJsZShjYWxsYmFja2ZuKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FycmF5LnByb3RvdHlwZS5ldmVyeSBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpIGluIHNlbGYgJiYgISh0eXBlb2YgVCA9PT0gJ3VuZGVmaW5lZCcgPyBjYWxsYmFja2ZuKHNlbGZbaV0sIGksIG9iamVjdCkgOiBjYWxsYmFja2ZuLmNhbGwoVCwgc2VsZltpXSwgaSwgb2JqZWN0KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfSwgIXByb3Blcmx5Qm94ZXNDb250ZXh0KEFycmF5UHJvdG90eXBlLmV2ZXJ5KSk7XG5cbiAgICAvLyBFUzUgMTUuNC40LjE3XG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjE3XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvc29tZVxuICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgc29tZTogZnVuY3Rpb24gc29tZShjYWxsYmFja2ZuLyosIHRoaXNBcmcgKi8pIHtcbiAgICAgICAgICAgIHZhciBvYmplY3QgPSBFUy5Ub09iamVjdCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBzZWxmID0gc3BsaXRTdHJpbmcgJiYgaXNTdHJpbmcodGhpcykgPyBzdHJTcGxpdCh0aGlzLCAnJykgOiBvYmplY3Q7XG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gRVMuVG9VaW50MzIoc2VsZi5sZW5ndGgpO1xuICAgICAgICAgICAgdmFyIFQ7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICBUID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBubyBjYWxsYmFjayBmdW5jdGlvbiBvciBpZiBjYWxsYmFjayBpcyBub3QgYSBjYWxsYWJsZSBmdW5jdGlvblxuICAgICAgICAgICAgaWYgKCFpc0NhbGxhYmxlKGNhbGxiYWNrZm4pKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkucHJvdG90eXBlLnNvbWUgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaSBpbiBzZWxmICYmICh0eXBlb2YgVCA9PT0gJ3VuZGVmaW5lZCcgPyBjYWxsYmFja2ZuKHNlbGZbaV0sIGksIG9iamVjdCkgOiBjYWxsYmFja2ZuLmNhbGwoVCwgc2VsZltpXSwgaSwgb2JqZWN0KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSwgIXByb3Blcmx5Qm94ZXNDb250ZXh0KEFycmF5UHJvdG90eXBlLnNvbWUpKTtcblxuICAgIC8vIEVTNSAxNS40LjQuMjFcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMjFcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9Db3JlX0phdmFTY3JpcHRfMS41X1JlZmVyZW5jZS9PYmplY3RzL0FycmF5L3JlZHVjZVxuICAgIHZhciByZWR1Y2VDb2VyY2VzVG9PYmplY3QgPSBmYWxzZTtcbiAgICBpZiAoQXJyYXlQcm90b3R5cGUucmVkdWNlKSB7XG4gICAgICAgIHJlZHVjZUNvZXJjZXNUb09iamVjdCA9IHR5cGVvZiBBcnJheVByb3RvdHlwZS5yZWR1Y2UuY2FsbCgnZXM1JywgZnVuY3Rpb24gKF8sIF9fLCBfX18sIGxpc3QpIHtcbiAgICAgICAgICAgIHJldHVybiBsaXN0O1xuICAgICAgICB9KSA9PT0gJ29iamVjdCc7XG4gICAgfVxuICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgcmVkdWNlOiBmdW5jdGlvbiByZWR1Y2UoY2FsbGJhY2tmbi8qLCBpbml0aWFsVmFsdWUqLykge1xuICAgICAgICAgICAgdmFyIG9iamVjdCA9IEVTLlRvT2JqZWN0KHRoaXMpO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBpc1N0cmluZyh0aGlzKSA/IHN0clNwbGl0KHRoaXMsICcnKSA6IG9iamVjdDtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBFUy5Ub1VpbnQzMihzZWxmLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIC8vIElmIG5vIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIGlmIGNhbGxiYWNrIGlzIG5vdCBhIGNhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgICAgICBpZiAoIWlzQ2FsbGFibGUoY2FsbGJhY2tmbikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcnJheS5wcm90b3R5cGUucmVkdWNlIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBubyB2YWx1ZSB0byByZXR1cm4gaWYgbm8gaW5pdGlhbCB2YWx1ZSBhbmQgYW4gZW1wdHkgYXJyYXlcbiAgICAgICAgICAgIGlmIChsZW5ndGggPT09IDAgJiYgYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3JlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgaW4gc2VsZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gc2VsZltpKytdO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBpZiBhcnJheSBjb250YWlucyBubyB2YWx1ZXMsIG5vIGluaXRpYWwgdmFsdWUgdG8gcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgIGlmICgrK2kgPj0gbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdyZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IHdoaWxlICh0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpIGluIHNlbGYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gY2FsbGJhY2tmbihyZXN1bHQsIHNlbGZbaV0sIGksIG9iamVjdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgfSwgIXJlZHVjZUNvZXJjZXNUb09iamVjdCk7XG5cbiAgICAvLyBFUzUgMTUuNC40LjIyXG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjIyXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vQ29yZV9KYXZhU2NyaXB0XzEuNV9SZWZlcmVuY2UvT2JqZWN0cy9BcnJheS9yZWR1Y2VSaWdodFxuICAgIHZhciByZWR1Y2VSaWdodENvZXJjZXNUb09iamVjdCA9IGZhbHNlO1xuICAgIGlmIChBcnJheVByb3RvdHlwZS5yZWR1Y2VSaWdodCkge1xuICAgICAgICByZWR1Y2VSaWdodENvZXJjZXNUb09iamVjdCA9IHR5cGVvZiBBcnJheVByb3RvdHlwZS5yZWR1Y2VSaWdodC5jYWxsKCdlczUnLCBmdW5jdGlvbiAoXywgX18sIF9fXywgbGlzdCkge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgICAgIH0pID09PSAnb2JqZWN0JztcbiAgICB9XG4gICAgZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwge1xuICAgICAgICByZWR1Y2VSaWdodDogZnVuY3Rpb24gcmVkdWNlUmlnaHQoY2FsbGJhY2tmbi8qLCBpbml0aWFsKi8pIHtcbiAgICAgICAgICAgIHZhciBvYmplY3QgPSBFUy5Ub09iamVjdCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBzZWxmID0gc3BsaXRTdHJpbmcgJiYgaXNTdHJpbmcodGhpcykgPyBzdHJTcGxpdCh0aGlzLCAnJykgOiBvYmplY3Q7XG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gRVMuVG9VaW50MzIoc2VsZi5sZW5ndGgpO1xuXG4gICAgICAgICAgICAvLyBJZiBubyBjYWxsYmFjayBmdW5jdGlvbiBvciBpZiBjYWxsYmFjayBpcyBub3QgYSBjYWxsYWJsZSBmdW5jdGlvblxuICAgICAgICAgICAgaWYgKCFpc0NhbGxhYmxlKGNhbGxiYWNrZm4pKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkucHJvdG90eXBlLnJlZHVjZVJpZ2h0IGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBubyB2YWx1ZSB0byByZXR1cm4gaWYgbm8gaW5pdGlhbCB2YWx1ZSwgZW1wdHkgYXJyYXlcbiAgICAgICAgICAgIGlmIChsZW5ndGggPT09IDAgJiYgYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3JlZHVjZVJpZ2h0IG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICAgICAgdmFyIGkgPSBsZW5ndGggLSAxO1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaSBpbiBzZWxmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBzZWxmW2ktLV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGFycmF5IGNvbnRhaW5zIG5vIHZhbHVlcywgbm8gaW5pdGlhbCB2YWx1ZSB0byByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgaWYgKC0taSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3JlZHVjZVJpZ2h0IG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSB3aGlsZSAodHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpIDwgMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBpZiAoaSBpbiBzZWxmKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGNhbGxiYWNrZm4ocmVzdWx0LCBzZWxmW2ldLCBpLCBvYmplY3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gd2hpbGUgKGktLSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9LCAhcmVkdWNlUmlnaHRDb2VyY2VzVG9PYmplY3QpO1xuXG4gICAgLy8gRVM1IDE1LjQuNC4xNFxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xNFxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2luZGV4T2ZcbiAgICB2YXIgaGFzRmlyZWZveDJJbmRleE9mQnVnID0gQXJyYXlQcm90b3R5cGUuaW5kZXhPZiAmJiBbMCwgMV0uaW5kZXhPZigxLCAyKSAhPT0gLTE7XG4gICAgZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwge1xuICAgICAgICBpbmRleE9mOiBmdW5jdGlvbiBpbmRleE9mKHNlYXJjaEVsZW1lbnQvKiwgZnJvbUluZGV4ICovKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHNwbGl0U3RyaW5nICYmIGlzU3RyaW5nKHRoaXMpID8gc3RyU3BsaXQodGhpcywgJycpIDogRVMuVG9PYmplY3QodGhpcyk7XG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gRVMuVG9VaW50MzIoc2VsZi5sZW5ndGgpO1xuXG4gICAgICAgICAgICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICBpID0gRVMuVG9JbnRlZ2VyKGFyZ3VtZW50c1sxXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGhhbmRsZSBuZWdhdGl2ZSBpbmRpY2VzXG4gICAgICAgICAgICBpID0gaSA+PSAwID8gaSA6IG1heCgwLCBsZW5ndGggKyBpKTtcbiAgICAgICAgICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaSBpbiBzZWxmICYmIHNlbGZbaV0gPT09IHNlYXJjaEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgfSwgaGFzRmlyZWZveDJJbmRleE9mQnVnKTtcblxuICAgIC8vIEVTNSAxNS40LjQuMTVcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMTVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9sYXN0SW5kZXhPZlxuICAgIHZhciBoYXNGaXJlZm94Mkxhc3RJbmRleE9mQnVnID0gQXJyYXlQcm90b3R5cGUubGFzdEluZGV4T2YgJiYgWzAsIDFdLmxhc3RJbmRleE9mKDAsIC0zKSAhPT0gLTE7XG4gICAgZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwge1xuICAgICAgICBsYXN0SW5kZXhPZjogZnVuY3Rpb24gbGFzdEluZGV4T2Yoc2VhcmNoRWxlbWVudC8qLCBmcm9tSW5kZXggKi8pIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gc3BsaXRTdHJpbmcgJiYgaXNTdHJpbmcodGhpcykgPyBzdHJTcGxpdCh0aGlzLCAnJykgOiBFUy5Ub09iamVjdCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBFUy5Ub1VpbnQzMihzZWxmLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIGlmIChsZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaSA9IGxlbmd0aCAtIDE7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICBpID0gbWluKGksIEVTLlRvSW50ZWdlcihhcmd1bWVudHNbMV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGhhbmRsZSBuZWdhdGl2ZSBpbmRpY2VzXG4gICAgICAgICAgICBpID0gaSA+PSAwID8gaSA6IGxlbmd0aCAtIE1hdGguYWJzKGkpO1xuICAgICAgICAgICAgZm9yICg7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgaW4gc2VsZiAmJiBzZWFyY2hFbGVtZW50ID09PSBzZWxmW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgIH0sIGhhc0ZpcmVmb3gyTGFzdEluZGV4T2ZCdWcpO1xuXG4gICAgLy8gRVM1IDE1LjQuNC4xMlxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xMlxuICAgIHZhciBzcGxpY2VOb29wUmV0dXJuc0VtcHR5QXJyYXkgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYSA9IFsxLCAyXTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGEuc3BsaWNlKCk7XG4gICAgICAgIHJldHVybiBhLmxlbmd0aCA9PT0gMiAmJiBpc0FycmF5KHJlc3VsdCkgJiYgcmVzdWx0Lmxlbmd0aCA9PT0gMDtcbiAgICB9KCkpO1xuICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgLy8gU2FmYXJpIDUuMCBidWcgd2hlcmUgLnNwbGljZSgpIHJldHVybnMgdW5kZWZpbmVkXG4gICAgICAgIHNwbGljZTogZnVuY3Rpb24gc3BsaWNlKHN0YXJ0LCBkZWxldGVDb3VudCkge1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBhcnJheV9zcGxpY2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sICFzcGxpY2VOb29wUmV0dXJuc0VtcHR5QXJyYXkpO1xuXG4gICAgdmFyIHNwbGljZVdvcmtzV2l0aEVtcHR5T2JqZWN0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAgICBBcnJheVByb3RvdHlwZS5zcGxpY2UuY2FsbChvYmosIDAsIDAsIDEpO1xuICAgICAgICByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMTtcbiAgICB9KCkpO1xuICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgc3BsaWNlOiBmdW5jdGlvbiBzcGxpY2Uoc3RhcnQsIGRlbGV0ZUNvdW50KSB7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgdGhpcy5sZW5ndGggPSBtYXgoRVMuVG9JbnRlZ2VyKHRoaXMubGVuZ3RoKSwgMCk7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgdHlwZW9mIGRlbGV0ZUNvdW50ICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIGFyZ3MgPSBhcnJheVNsaWNlKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgICAgICAgICBwdXNoQ2FsbChhcmdzLCB0aGlzLmxlbmd0aCAtIHN0YXJ0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhcmdzWzFdID0gRVMuVG9JbnRlZ2VyKGRlbGV0ZUNvdW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXJyYXlfc3BsaWNlLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgfSwgIXNwbGljZVdvcmtzV2l0aEVtcHR5T2JqZWN0KTtcbiAgICB2YXIgc3BsaWNlV29ya3NXaXRoTGFyZ2VTcGFyc2VBcnJheXMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBQZXIgaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltL2lzc3Vlcy8yOTVcbiAgICAgICAgLy8gU2FmYXJpIDcvOCBicmVha3Mgd2l0aCBzcGFyc2UgYXJyYXlzIG9mIHNpemUgMWU1IG9yIGdyZWF0ZXJcbiAgICAgICAgdmFyIGFyciA9IG5ldyAkQXJyYXkoMWU1KTtcbiAgICAgICAgLy8gbm90ZTogdGhlIGluZGV4IE1VU1QgYmUgOCBvciBsYXJnZXIgb3IgdGhlIHRlc3Qgd2lsbCBmYWxzZSBwYXNzXG4gICAgICAgIGFycls4XSA9ICd4JztcbiAgICAgICAgYXJyLnNwbGljZSgxLCAxKTtcbiAgICAgICAgLy8gbm90ZTogdGhpcyB0ZXN0IG11c3QgYmUgZGVmaW5lZCAqYWZ0ZXIqIHRoZSBpbmRleE9mIHNoaW1cbiAgICAgICAgLy8gcGVyIGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczUtc2hpbS9pc3N1ZXMvMzEzXG4gICAgICAgIHJldHVybiBhcnIuaW5kZXhPZigneCcpID09PSA3O1xuICAgIH0oKSk7XG4gICAgdmFyIHNwbGljZVdvcmtzV2l0aFNtYWxsU3BhcnNlQXJyYXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gUGVyIGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczUtc2hpbS9pc3N1ZXMvMjk1XG4gICAgICAgIC8vIE9wZXJhIDEyLjE1IGJyZWFrcyBvbiB0aGlzLCBubyBpZGVhIHdoeS5cbiAgICAgICAgdmFyIG4gPSAyNTY7XG4gICAgICAgIHZhciBhcnIgPSBbXTtcbiAgICAgICAgYXJyW25dID0gJ2EnO1xuICAgICAgICBhcnIuc3BsaWNlKG4gKyAxLCAwLCAnYicpO1xuICAgICAgICByZXR1cm4gYXJyW25dID09PSAnYSc7XG4gICAgfSgpKTtcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgICAgIHNwbGljZTogZnVuY3Rpb24gc3BsaWNlKHN0YXJ0LCBkZWxldGVDb3VudCkge1xuICAgICAgICAgICAgdmFyIE8gPSBFUy5Ub09iamVjdCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBBID0gW107XG4gICAgICAgICAgICB2YXIgbGVuID0gRVMuVG9VaW50MzIoTy5sZW5ndGgpO1xuICAgICAgICAgICAgdmFyIHJlbGF0aXZlU3RhcnQgPSBFUy5Ub0ludGVnZXIoc3RhcnQpO1xuICAgICAgICAgICAgdmFyIGFjdHVhbFN0YXJ0ID0gcmVsYXRpdmVTdGFydCA8IDAgPyBtYXgoKGxlbiArIHJlbGF0aXZlU3RhcnQpLCAwKSA6IG1pbihyZWxhdGl2ZVN0YXJ0LCBsZW4pO1xuICAgICAgICAgICAgdmFyIGFjdHVhbERlbGV0ZUNvdW50ID0gbWluKG1heChFUy5Ub0ludGVnZXIoZGVsZXRlQ291bnQpLCAwKSwgbGVuIC0gYWN0dWFsU3RhcnQpO1xuXG4gICAgICAgICAgICB2YXIgayA9IDA7XG4gICAgICAgICAgICB2YXIgZnJvbTtcbiAgICAgICAgICAgIHdoaWxlIChrIDwgYWN0dWFsRGVsZXRlQ291bnQpIHtcbiAgICAgICAgICAgICAgICBmcm9tID0gJFN0cmluZyhhY3R1YWxTdGFydCArIGspO1xuICAgICAgICAgICAgICAgIGlmIChvd25zKE8sIGZyb20pKSB7XG4gICAgICAgICAgICAgICAgICAgIEFba10gPSBPW2Zyb21dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBrICs9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpdGVtcyA9IGFycmF5U2xpY2UoYXJndW1lbnRzLCAyKTtcbiAgICAgICAgICAgIHZhciBpdGVtQ291bnQgPSBpdGVtcy5sZW5ndGg7XG4gICAgICAgICAgICB2YXIgdG87XG4gICAgICAgICAgICBpZiAoaXRlbUNvdW50IDwgYWN0dWFsRGVsZXRlQ291bnQpIHtcbiAgICAgICAgICAgICAgICBrID0gYWN0dWFsU3RhcnQ7XG4gICAgICAgICAgICAgICAgdmFyIG1heEsgPSBsZW4gLSBhY3R1YWxEZWxldGVDb3VudDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoayA8IG1heEspIHtcbiAgICAgICAgICAgICAgICAgICAgZnJvbSA9ICRTdHJpbmcoayArIGFjdHVhbERlbGV0ZUNvdW50KTtcbiAgICAgICAgICAgICAgICAgICAgdG8gPSAkU3RyaW5nKGsgKyBpdGVtQ291bnQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3ducyhPLCBmcm9tKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgT1t0b10gPSBPW2Zyb21dO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIE9bdG9dO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGsgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgayA9IGxlbjtcbiAgICAgICAgICAgICAgICB2YXIgbWluSyA9IGxlbiAtIGFjdHVhbERlbGV0ZUNvdW50ICsgaXRlbUNvdW50O1xuICAgICAgICAgICAgICAgIHdoaWxlIChrID4gbWluSykge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgT1trIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIGsgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW1Db3VudCA+IGFjdHVhbERlbGV0ZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgayA9IGxlbiAtIGFjdHVhbERlbGV0ZUNvdW50O1xuICAgICAgICAgICAgICAgIHdoaWxlIChrID4gYWN0dWFsU3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgZnJvbSA9ICRTdHJpbmcoayArIGFjdHVhbERlbGV0ZUNvdW50IC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIHRvID0gJFN0cmluZyhrICsgaXRlbUNvdW50IC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvd25zKE8sIGZyb20pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBPW3RvXSA9IE9bZnJvbV07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgT1t0b107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgayAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGsgPSBhY3R1YWxTdGFydDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBPW2tdID0gaXRlbXNbaV07XG4gICAgICAgICAgICAgICAgayArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgTy5sZW5ndGggPSBsZW4gLSBhY3R1YWxEZWxldGVDb3VudCArIGl0ZW1Db3VudDtcblxuICAgICAgICAgICAgcmV0dXJuIEE7XG4gICAgICAgIH1cbiAgICB9LCAhc3BsaWNlV29ya3NXaXRoTGFyZ2VTcGFyc2VBcnJheXMgfHwgIXNwbGljZVdvcmtzV2l0aFNtYWxsU3BhcnNlQXJyYXlzKTtcblxuICAgIHZhciBvcmlnaW5hbEpvaW4gPSBBcnJheVByb3RvdHlwZS5qb2luO1xuICAgIHZhciBoYXNTdHJpbmdKb2luQnVnO1xuICAgIHRyeSB7XG4gICAgICAgIGhhc1N0cmluZ0pvaW5CdWcgPSBBcnJheS5wcm90b3R5cGUuam9pbi5jYWxsKCcxMjMnLCAnLCcpICE9PSAnMSwyLDMnO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaGFzU3RyaW5nSm9pbkJ1ZyA9IHRydWU7XG4gICAgfVxuICAgIGlmIChoYXNTdHJpbmdKb2luQnVnKSB7XG4gICAgICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgICAgIGpvaW46IGZ1bmN0aW9uIGpvaW4oc2VwYXJhdG9yKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlcCA9IHR5cGVvZiBzZXBhcmF0b3IgPT09ICd1bmRlZmluZWQnID8gJywnIDogc2VwYXJhdG9yO1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEpvaW4uY2FsbChpc1N0cmluZyh0aGlzKSA/IHN0clNwbGl0KHRoaXMsICcnKSA6IHRoaXMsIHNlcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGhhc1N0cmluZ0pvaW5CdWcpO1xuICAgIH1cblxuICAgIHZhciBoYXNKb2luVW5kZWZpbmVkQnVnID0gWzEsIDJdLmpvaW4odW5kZWZpbmVkKSAhPT0gJzEsMic7XG4gICAgaWYgKGhhc0pvaW5VbmRlZmluZWRCdWcpIHtcbiAgICAgICAgZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwge1xuICAgICAgICAgICAgam9pbjogZnVuY3Rpb24gam9pbihzZXBhcmF0b3IpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VwID0gdHlwZW9mIHNlcGFyYXRvciA9PT0gJ3VuZGVmaW5lZCcgPyAnLCcgOiBzZXBhcmF0b3I7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsSm9pbi5jYWxsKHRoaXMsIHNlcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGhhc0pvaW5VbmRlZmluZWRCdWcpO1xuICAgIH1cblxuICAgIHZhciBwdXNoU2hpbSA9IGZ1bmN0aW9uIHB1c2goaXRlbSkge1xuICAgICAgICB2YXIgTyA9IEVTLlRvT2JqZWN0KHRoaXMpO1xuICAgICAgICB2YXIgbiA9IEVTLlRvVWludDMyKE8ubGVuZ3RoKTtcbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIE9bbiArIGldID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgaSArPSAxO1xuICAgICAgICB9XG4gICAgICAgIE8ubGVuZ3RoID0gbiArIGk7XG4gICAgICAgIHJldHVybiBuICsgaTtcbiAgICB9O1xuXG4gICAgdmFyIHB1c2hJc05vdEdlbmVyaWMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgb2JqID0ge307XG4gICAgICAgIHZhciByZXN1bHQgPSBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKG9iaiwgdW5kZWZpbmVkKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCAhPT0gMSB8fCBvYmoubGVuZ3RoICE9PSAxIHx8IHR5cGVvZiBvYmpbMF0gIT09ICd1bmRlZmluZWQnIHx8ICFvd25zKG9iaiwgMCk7XG4gICAgfSgpKTtcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgICAgIHB1c2g6IGZ1bmN0aW9uIHB1c2goaXRlbSkge1xuICAgICAgICAgICAgaWYgKGlzQXJyYXkodGhpcykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXlfcHVzaC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHB1c2hTaGltLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICB9LCBwdXNoSXNOb3RHZW5lcmljKTtcblxuICAgIC8vIFRoaXMgZml4ZXMgYSB2ZXJ5IHdlaXJkIGJ1ZyBpbiBPcGVyYSAxMC42IHdoZW4gcHVzaGluZyBgdW5kZWZpbmVkXG4gICAgdmFyIHB1c2hVbmRlZmluZWRJc1dlaXJkID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFyciA9IFtdO1xuICAgICAgICB2YXIgcmVzdWx0ID0gYXJyLnB1c2godW5kZWZpbmVkKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCAhPT0gMSB8fCBhcnIubGVuZ3RoICE9PSAxIHx8IHR5cGVvZiBhcnJbMF0gIT09ICd1bmRlZmluZWQnIHx8ICFvd25zKGFyciwgMCk7XG4gICAgfSgpKTtcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7IHB1c2g6IHB1c2hTaGltIH0sIHB1c2hVbmRlZmluZWRJc1dlaXJkKTtcblxuICAgIC8vIEVTNSAxNS4yLjMuMTRcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5pby8jeDE1LjQuNC4xMFxuICAgIC8vIEZpeCBib3hlZCBzdHJpbmcgYnVnXG4gICAgZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwge1xuICAgICAgICBzbGljZTogZnVuY3Rpb24gKHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgICAgIHZhciBhcnIgPSBpc1N0cmluZyh0aGlzKSA/IHN0clNwbGl0KHRoaXMsICcnKSA6IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXlTbGljZUFwcGx5KGFyciwgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgIH0sIHNwbGl0U3RyaW5nKTtcblxuICAgIHZhciBzb3J0SWdub3Jlc05vbkZ1bmN0aW9ucyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBbMSwgMl0uc29ydChudWxsKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBbMSwgMl0uc29ydCh7fSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KCkpO1xuICAgIHZhciBzb3J0VGhyb3dzT25SZWdleCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHRoaXMgaXMgYSBwcm9ibGVtIGluIEZpcmVmb3ggNCwgaW4gd2hpY2ggYHR5cGVvZiAvYS8gPT09ICdmdW5jdGlvbidgXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBbMSwgMl0uc29ydCgvYS8pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KCkpO1xuICAgIHZhciBzb3J0SWdub3Jlc1VuZGVmaW5lZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGFwcGxpZXMgaW4gSUUgOCwgZm9yIG9uZS5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFsxLCAyXS5zb3J0KHVuZGVmaW5lZCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0oKSk7XG4gICAgZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwge1xuICAgICAgICBzb3J0OiBmdW5jdGlvbiBzb3J0KGNvbXBhcmVGbikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wYXJlRm4gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5U29ydCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNDYWxsYWJsZShjb21wYXJlRm4pKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkucHJvdG90eXBlLnNvcnQgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXJyYXlTb3J0KHRoaXMsIGNvbXBhcmVGbik7XG4gICAgICAgIH1cbiAgICB9LCBzb3J0SWdub3Jlc05vbkZ1bmN0aW9ucyB8fCAhc29ydElnbm9yZXNVbmRlZmluZWQgfHwgIXNvcnRUaHJvd3NPblJlZ2V4KTtcblxuICAgIC8vXG4gICAgLy8gT2JqZWN0XG4gICAgLy8gPT09PT09XG4gICAgLy9cblxuICAgIC8vIEVTNSAxNS4yLjMuMTRcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuMTRcblxuICAgIC8vIGh0dHA6Ly93aGF0dGhlaGVhZHNhaWQuY29tLzIwMTAvMTAvYS1zYWZlci1vYmplY3Qta2V5cy1jb21wYXRpYmlsaXR5LWltcGxlbWVudGF0aW9uXG4gICAgdmFyIGhhc0RvbnRFbnVtQnVnID0gIWlzRW51bSh7ICd0b1N0cmluZyc6IG51bGwgfSwgJ3RvU3RyaW5nJyk7IC8vIGpzY3M6aWdub3JlIGRpc2FsbG93UXVvdGVkS2V5c0luT2JqZWN0c1xuICAgIHZhciBoYXNQcm90b0VudW1CdWcgPSBpc0VudW0oZnVuY3Rpb24gKCkge30sICdwcm90b3R5cGUnKTtcbiAgICB2YXIgaGFzU3RyaW5nRW51bUJ1ZyA9ICFvd25zKCd4JywgJzAnKTtcbiAgICB2YXIgZXF1YWxzQ29uc3RydWN0b3JQcm90b3R5cGUgPSBmdW5jdGlvbiAobykge1xuICAgICAgICB2YXIgY3RvciA9IG8uY29uc3RydWN0b3I7XG4gICAgICAgIHJldHVybiBjdG9yICYmIGN0b3IucHJvdG90eXBlID09PSBvO1xuICAgIH07XG4gICAgdmFyIGV4Y2x1ZGVkS2V5cyA9IHtcbiAgICAgICAgJHdpbmRvdzogdHJ1ZSxcbiAgICAgICAgJGNvbnNvbGU6IHRydWUsXG4gICAgICAgICRwYXJlbnQ6IHRydWUsXG4gICAgICAgICRzZWxmOiB0cnVlLFxuICAgICAgICAkZnJhbWU6IHRydWUsXG4gICAgICAgICRmcmFtZXM6IHRydWUsXG4gICAgICAgICRmcmFtZUVsZW1lbnQ6IHRydWUsXG4gICAgICAgICR3ZWJraXRJbmRleGVkREI6IHRydWUsXG4gICAgICAgICR3ZWJraXRTdG9yYWdlSW5mbzogdHJ1ZSxcbiAgICAgICAgJGV4dGVybmFsOiB0cnVlLFxuICAgICAgICAkd2lkdGg6IHRydWUsXG4gICAgICAgICRoZWlnaHQ6IHRydWUsXG4gICAgICAgICR0b3A6IHRydWUsXG4gICAgICAgICRsb2NhbFN0b3JhZ2U6IHRydWVcbiAgICB9O1xuICAgIHZhciBoYXNBdXRvbWF0aW9uRXF1YWxpdHlCdWcgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAvKiBnbG9iYWxzIHdpbmRvdyAqL1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBrIGluIHdpbmRvdykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoIWV4Y2x1ZGVkS2V5c1snJCcgKyBrXSAmJiBvd25zKHdpbmRvdywgaykgJiYgd2luZG93W2tdICE9PSBudWxsICYmIHR5cGVvZiB3aW5kb3dba10gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIGVxdWFsc0NvbnN0cnVjdG9yUHJvdG90eXBlKHdpbmRvd1trXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KCkpO1xuICAgIHZhciBlcXVhbHNDb25zdHJ1Y3RvclByb3RvdHlwZUlmTm90QnVnZ3kgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fCAhaGFzQXV0b21hdGlvbkVxdWFsaXR5QnVnKSB7XG4gICAgICAgICAgICByZXR1cm4gZXF1YWxzQ29uc3RydWN0b3JQcm90b3R5cGUob2JqZWN0KTtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGVxdWFsc0NvbnN0cnVjdG9yUHJvdG90eXBlKG9iamVjdCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIGRvbnRFbnVtcyA9IFtcbiAgICAgICAgJ3RvU3RyaW5nJyxcbiAgICAgICAgJ3RvTG9jYWxlU3RyaW5nJyxcbiAgICAgICAgJ3ZhbHVlT2YnLFxuICAgICAgICAnaGFzT3duUHJvcGVydHknLFxuICAgICAgICAnaXNQcm90b3R5cGVPZicsXG4gICAgICAgICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsXG4gICAgICAgICdjb25zdHJ1Y3RvcidcbiAgICBdO1xuICAgIHZhciBkb250RW51bXNMZW5ndGggPSBkb250RW51bXMubGVuZ3RoO1xuXG4gICAgLy8gdGFrZW4gZGlyZWN0bHkgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbGpoYXJiL2lzLWFyZ3VtZW50cy9ibG9iL21hc3Rlci9pbmRleC5qc1xuICAgIC8vIGNhbiBiZSByZXBsYWNlZCB3aXRoIHJlcXVpcmUoJ2lzLWFyZ3VtZW50cycpIGlmIHdlIGV2ZXIgdXNlIGEgYnVpbGQgcHJvY2VzcyBpbnN0ZWFkXG4gICAgdmFyIGlzU3RhbmRhcmRBcmd1bWVudHMgPSBmdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdG9TdHIodmFsdWUpID09PSAnW29iamVjdCBBcmd1bWVudHNdJztcbiAgICB9O1xuICAgIHZhciBpc0xlZ2FjeUFyZ3VtZW50cyA9IGZ1bmN0aW9uIGlzQXJndW1lbnRzKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSAhPT0gbnVsbFxuICAgICAgICAgICAgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0J1xuICAgICAgICAgICAgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcidcbiAgICAgICAgICAgICYmIHZhbHVlLmxlbmd0aCA+PSAwXG4gICAgICAgICAgICAmJiAhaXNBcnJheSh2YWx1ZSlcbiAgICAgICAgICAgICYmIGlzQ2FsbGFibGUodmFsdWUuY2FsbGVlKTtcbiAgICB9O1xuICAgIHZhciBpc0FyZ3VtZW50cyA9IGlzU3RhbmRhcmRBcmd1bWVudHMoYXJndW1lbnRzKSA/IGlzU3RhbmRhcmRBcmd1bWVudHMgOiBpc0xlZ2FjeUFyZ3VtZW50cztcblxuICAgIGRlZmluZVByb3BlcnRpZXMoJE9iamVjdCwge1xuICAgICAgICBrZXlzOiBmdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICAgICAgICAgICAgdmFyIGlzRm4gPSBpc0NhbGxhYmxlKG9iamVjdCk7XG4gICAgICAgICAgICB2YXIgaXNBcmdzID0gaXNBcmd1bWVudHMob2JqZWN0KTtcbiAgICAgICAgICAgIHZhciBpc09iamVjdCA9IG9iamVjdCAhPT0gbnVsbCAmJiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JztcbiAgICAgICAgICAgIHZhciBpc1N0ciA9IGlzT2JqZWN0ICYmIGlzU3RyaW5nKG9iamVjdCk7XG5cbiAgICAgICAgICAgIGlmICghaXNPYmplY3QgJiYgIWlzRm4gJiYgIWlzQXJncykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5rZXlzIGNhbGxlZCBvbiBhIG5vbi1vYmplY3QnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHRoZUtleXMgPSBbXTtcbiAgICAgICAgICAgIHZhciBza2lwUHJvdG8gPSBoYXNQcm90b0VudW1CdWcgJiYgaXNGbjtcbiAgICAgICAgICAgIGlmICgoaXNTdHIgJiYgaGFzU3RyaW5nRW51bUJ1ZykgfHwgaXNBcmdzKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmplY3QubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgcHVzaENhbGwodGhlS2V5cywgJFN0cmluZyhpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWlzQXJncykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIG5hbWUgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHNraXBQcm90byAmJiBuYW1lID09PSAncHJvdG90eXBlJykgJiYgb3ducyhvYmplY3QsIG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwdXNoQ2FsbCh0aGVLZXlzLCAkU3RyaW5nKG5hbWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGhhc0RvbnRFbnVtQnVnKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNraXBDb25zdHJ1Y3RvciA9IGVxdWFsc0NvbnN0cnVjdG9yUHJvdG90eXBlSWZOb3RCdWdneShvYmplY3QpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZG9udEVudW1zTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRvbnRFbnVtID0gZG9udEVudW1zW2pdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIShza2lwQ29uc3RydWN0b3IgJiYgZG9udEVudW0gPT09ICdjb25zdHJ1Y3RvcicpICYmIG93bnMob2JqZWN0LCBkb250RW51bSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hDYWxsKHRoZUtleXMsIGRvbnRFbnVtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGVLZXlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIga2V5c1dvcmtzV2l0aEFyZ3VtZW50cyA9ICRPYmplY3Qua2V5cyAmJiAoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBTYWZhcmkgNS4wIGJ1Z1xuICAgICAgICByZXR1cm4gJE9iamVjdC5rZXlzKGFyZ3VtZW50cykubGVuZ3RoID09PSAyO1xuICAgIH0oMSwgMikpO1xuICAgIHZhciBrZXlzSGFzQXJndW1lbnRzTGVuZ3RoQnVnID0gJE9iamVjdC5rZXlzICYmIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdLZXlzID0gJE9iamVjdC5rZXlzKGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoICE9PSAxIHx8IGFyZ0tleXMubGVuZ3RoICE9PSAxIHx8IGFyZ0tleXNbMF0gIT09IDE7XG4gICAgfSgxKSk7XG4gICAgdmFyIG9yaWdpbmFsS2V5cyA9ICRPYmplY3Qua2V5cztcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKCRPYmplY3QsIHtcbiAgICAgICAga2V5czogZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChpc0FyZ3VtZW50cyhvYmplY3QpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsS2V5cyhhcnJheVNsaWNlKG9iamVjdCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxLZXlzKG9iamVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCAha2V5c1dvcmtzV2l0aEFyZ3VtZW50cyB8fCBrZXlzSGFzQXJndW1lbnRzTGVuZ3RoQnVnKTtcblxuICAgIC8vXG4gICAgLy8gRGF0ZVxuICAgIC8vID09PT1cbiAgICAvL1xuXG4gICAgdmFyIGhhc05lZ2F0aXZlTW9udGhZZWFyQnVnID0gbmV3IERhdGUoLTM1MDk4MjczMjk2MDAyOTIpLmdldFVUQ01vbnRoKCkgIT09IDA7XG4gICAgdmFyIGFOZWdhdGl2ZVRlc3REYXRlID0gbmV3IERhdGUoLTE1MDk4NDIyODk2MDAyOTIpO1xuICAgIHZhciBhUG9zaXRpdmVUZXN0RGF0ZSA9IG5ldyBEYXRlKDE0NDk2NjI0MDAwMDApO1xuICAgIHZhciBoYXNUb1VUQ1N0cmluZ0Zvcm1hdEJ1ZyA9IGFOZWdhdGl2ZVRlc3REYXRlLnRvVVRDU3RyaW5nKCkgIT09ICdNb24sIDAxIEphbiAtNDU4NzUgMTE6NTk6NTkgR01UJztcbiAgICB2YXIgaGFzVG9EYXRlU3RyaW5nRm9ybWF0QnVnO1xuICAgIHZhciBoYXNUb1N0cmluZ0Zvcm1hdEJ1ZztcbiAgICB2YXIgdGltZVpvbmVPZmZzZXQgPSBhTmVnYXRpdmVUZXN0RGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpO1xuICAgIGlmICh0aW1lWm9uZU9mZnNldCA8IC03MjApIHtcbiAgICAgICAgaGFzVG9EYXRlU3RyaW5nRm9ybWF0QnVnID0gYU5lZ2F0aXZlVGVzdERhdGUudG9EYXRlU3RyaW5nKCkgIT09ICdUdWUgSmFuIDAyIC00NTg3NSc7XG4gICAgICAgIGhhc1RvU3RyaW5nRm9ybWF0QnVnID0gISgvXlRodSBEZWMgMTAgMjAxNSBcXGRcXGQ6XFxkXFxkOlxcZFxcZCBHTVRbLStdXFxkXFxkXFxkXFxkKD86IHwkKS8pLnRlc3QoU3RyaW5nKGFQb3NpdGl2ZVRlc3REYXRlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaGFzVG9EYXRlU3RyaW5nRm9ybWF0QnVnID0gYU5lZ2F0aXZlVGVzdERhdGUudG9EYXRlU3RyaW5nKCkgIT09ICdNb24gSmFuIDAxIC00NTg3NSc7XG4gICAgICAgIGhhc1RvU3RyaW5nRm9ybWF0QnVnID0gISgvXldlZCBEZWMgMDkgMjAxNSBcXGRcXGQ6XFxkXFxkOlxcZFxcZCBHTVRbLStdXFxkXFxkXFxkXFxkKD86IHwkKS8pLnRlc3QoU3RyaW5nKGFQb3NpdGl2ZVRlc3REYXRlKSk7XG4gICAgfVxuXG4gICAgdmFyIG9yaWdpbmFsR2V0RnVsbFllYXIgPSBjYWxsLmJpbmQoRGF0ZS5wcm90b3R5cGUuZ2V0RnVsbFllYXIpO1xuICAgIHZhciBvcmlnaW5hbEdldE1vbnRoID0gY2FsbC5iaW5kKERhdGUucHJvdG90eXBlLmdldE1vbnRoKTtcbiAgICB2YXIgb3JpZ2luYWxHZXREYXRlID0gY2FsbC5iaW5kKERhdGUucHJvdG90eXBlLmdldERhdGUpO1xuICAgIHZhciBvcmlnaW5hbEdldFVUQ0Z1bGxZZWFyID0gY2FsbC5iaW5kKERhdGUucHJvdG90eXBlLmdldFVUQ0Z1bGxZZWFyKTtcbiAgICB2YXIgb3JpZ2luYWxHZXRVVENNb250aCA9IGNhbGwuYmluZChEYXRlLnByb3RvdHlwZS5nZXRVVENNb250aCk7XG4gICAgdmFyIG9yaWdpbmFsR2V0VVRDRGF0ZSA9IGNhbGwuYmluZChEYXRlLnByb3RvdHlwZS5nZXRVVENEYXRlKTtcbiAgICB2YXIgb3JpZ2luYWxHZXRVVENEYXkgPSBjYWxsLmJpbmQoRGF0ZS5wcm90b3R5cGUuZ2V0VVRDRGF5KTtcbiAgICB2YXIgb3JpZ2luYWxHZXRVVENIb3VycyA9IGNhbGwuYmluZChEYXRlLnByb3RvdHlwZS5nZXRVVENIb3Vycyk7XG4gICAgdmFyIG9yaWdpbmFsR2V0VVRDTWludXRlcyA9IGNhbGwuYmluZChEYXRlLnByb3RvdHlwZS5nZXRVVENNaW51dGVzKTtcbiAgICB2YXIgb3JpZ2luYWxHZXRVVENTZWNvbmRzID0gY2FsbC5iaW5kKERhdGUucHJvdG90eXBlLmdldFVUQ1NlY29uZHMpO1xuICAgIHZhciBvcmlnaW5hbEdldFVUQ01pbGxpc2Vjb25kcyA9IGNhbGwuYmluZChEYXRlLnByb3RvdHlwZS5nZXRVVENNaWxsaXNlY29uZHMpO1xuICAgIHZhciBkYXlOYW1lID0gWydTdW4nLCAnTW9uJywgJ1R1ZScsICdXZWQnLCAnVGh1JywgJ0ZyaScsICdTYXQnXTtcbiAgICB2YXIgbW9udGhOYW1lID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsICdPY3QnLCAnTm92JywgJ0RlYyddO1xuICAgIHZhciBkYXlzSW5Nb250aCA9IGZ1bmN0aW9uIGRheXNJbk1vbnRoKG1vbnRoLCB5ZWFyKSB7XG4gICAgICAgIHJldHVybiBvcmlnaW5hbEdldERhdGUobmV3IERhdGUoeWVhciwgbW9udGgsIDApKTtcbiAgICB9O1xuXG4gICAgZGVmaW5lUHJvcGVydGllcyhEYXRlLnByb3RvdHlwZSwge1xuICAgICAgICBnZXRGdWxsWWVhcjogZnVuY3Rpb24gZ2V0RnVsbFllYXIoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMgfHwgISh0aGlzIGluc3RhbmNlb2YgRGF0ZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0aGlzIGlzIG5vdCBhIERhdGUgb2JqZWN0LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHllYXIgPSBvcmlnaW5hbEdldEZ1bGxZZWFyKHRoaXMpO1xuICAgICAgICAgICAgaWYgKHllYXIgPCAwICYmIG9yaWdpbmFsR2V0TW9udGgodGhpcykgPiAxMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB5ZWFyICsgMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB5ZWFyO1xuICAgICAgICB9LFxuICAgICAgICBnZXRNb250aDogZnVuY3Rpb24gZ2V0TW9udGgoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMgfHwgISh0aGlzIGluc3RhbmNlb2YgRGF0ZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0aGlzIGlzIG5vdCBhIERhdGUgb2JqZWN0LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHllYXIgPSBvcmlnaW5hbEdldEZ1bGxZZWFyKHRoaXMpO1xuICAgICAgICAgICAgdmFyIG1vbnRoID0gb3JpZ2luYWxHZXRNb250aCh0aGlzKTtcbiAgICAgICAgICAgIGlmICh5ZWFyIDwgMCAmJiBtb250aCA+IDExKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbW9udGg7XG4gICAgICAgIH0sXG4gICAgICAgIGdldERhdGU6IGZ1bmN0aW9uIGdldERhdGUoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMgfHwgISh0aGlzIGluc3RhbmNlb2YgRGF0ZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0aGlzIGlzIG5vdCBhIERhdGUgb2JqZWN0LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHllYXIgPSBvcmlnaW5hbEdldEZ1bGxZZWFyKHRoaXMpO1xuICAgICAgICAgICAgdmFyIG1vbnRoID0gb3JpZ2luYWxHZXRNb250aCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBkYXRlID0gb3JpZ2luYWxHZXREYXRlKHRoaXMpO1xuICAgICAgICAgICAgaWYgKHllYXIgPCAwICYmIG1vbnRoID4gMTEpIHtcbiAgICAgICAgICAgICAgICBpZiAobW9udGggPT09IDEyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgZGF5cyA9IGRheXNJbk1vbnRoKDAsIHllYXIgKyAxKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGRheXMgLSBkYXRlKSArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VVRDRnVsbFllYXI6IGZ1bmN0aW9uIGdldFVUQ0Z1bGxZZWFyKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzIHx8ICEodGhpcyBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGhpcyBpcyBub3QgYSBEYXRlIG9iamVjdC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB5ZWFyID0gb3JpZ2luYWxHZXRVVENGdWxsWWVhcih0aGlzKTtcbiAgICAgICAgICAgIGlmICh5ZWFyIDwgMCAmJiBvcmlnaW5hbEdldFVUQ01vbnRoKHRoaXMpID4gMTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geWVhciArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geWVhcjtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VVRDTW9udGg6IGZ1bmN0aW9uIGdldFVUQ01vbnRoKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzIHx8ICEodGhpcyBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGhpcyBpcyBub3QgYSBEYXRlIG9iamVjdC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB5ZWFyID0gb3JpZ2luYWxHZXRVVENGdWxsWWVhcih0aGlzKTtcbiAgICAgICAgICAgIHZhciBtb250aCA9IG9yaWdpbmFsR2V0VVRDTW9udGgodGhpcyk7XG4gICAgICAgICAgICBpZiAoeWVhciA8IDAgJiYgbW9udGggPiAxMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1vbnRoO1xuICAgICAgICB9LFxuICAgICAgICBnZXRVVENEYXRlOiBmdW5jdGlvbiBnZXRVVENEYXRlKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzIHx8ICEodGhpcyBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGhpcyBpcyBub3QgYSBEYXRlIG9iamVjdC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB5ZWFyID0gb3JpZ2luYWxHZXRVVENGdWxsWWVhcih0aGlzKTtcbiAgICAgICAgICAgIHZhciBtb250aCA9IG9yaWdpbmFsR2V0VVRDTW9udGgodGhpcyk7XG4gICAgICAgICAgICB2YXIgZGF0ZSA9IG9yaWdpbmFsR2V0VVRDRGF0ZSh0aGlzKTtcbiAgICAgICAgICAgIGlmICh5ZWFyIDwgMCAmJiBtb250aCA+IDExKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vbnRoID09PSAxMikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGRheXMgPSBkYXlzSW5Nb250aCgwLCB5ZWFyICsgMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChkYXlzIC0gZGF0ZSkgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgICAgIH1cbiAgICB9LCBoYXNOZWdhdGl2ZU1vbnRoWWVhckJ1Zyk7XG5cbiAgICBkZWZpbmVQcm9wZXJ0aWVzKERhdGUucHJvdG90eXBlLCB7XG4gICAgICAgIHRvVVRDU3RyaW5nOiBmdW5jdGlvbiB0b1VUQ1N0cmluZygpIHtcbiAgICAgICAgICAgIGlmICghdGhpcyB8fCAhKHRoaXMgaW5zdGFuY2VvZiBEYXRlKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RoaXMgaXMgbm90IGEgRGF0ZSBvYmplY3QuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZGF5ID0gb3JpZ2luYWxHZXRVVENEYXkodGhpcyk7XG4gICAgICAgICAgICB2YXIgZGF0ZSA9IG9yaWdpbmFsR2V0VVRDRGF0ZSh0aGlzKTtcbiAgICAgICAgICAgIHZhciBtb250aCA9IG9yaWdpbmFsR2V0VVRDTW9udGgodGhpcyk7XG4gICAgICAgICAgICB2YXIgeWVhciA9IG9yaWdpbmFsR2V0VVRDRnVsbFllYXIodGhpcyk7XG4gICAgICAgICAgICB2YXIgaG91ciA9IG9yaWdpbmFsR2V0VVRDSG91cnModGhpcyk7XG4gICAgICAgICAgICB2YXIgbWludXRlID0gb3JpZ2luYWxHZXRVVENNaW51dGVzKHRoaXMpO1xuICAgICAgICAgICAgdmFyIHNlY29uZCA9IG9yaWdpbmFsR2V0VVRDU2Vjb25kcyh0aGlzKTtcbiAgICAgICAgICAgIHJldHVybiBkYXlOYW1lW2RheV0gKyAnLCAnXG4gICAgICAgICAgICAgICAgKyAoZGF0ZSA8IDEwID8gJzAnICsgZGF0ZSA6IGRhdGUpICsgJyAnXG4gICAgICAgICAgICAgICAgKyBtb250aE5hbWVbbW9udGhdICsgJyAnXG4gICAgICAgICAgICAgICAgKyB5ZWFyICsgJyAnXG4gICAgICAgICAgICAgICAgKyAoaG91ciA8IDEwID8gJzAnICsgaG91ciA6IGhvdXIpICsgJzonXG4gICAgICAgICAgICAgICAgKyAobWludXRlIDwgMTAgPyAnMCcgKyBtaW51dGUgOiBtaW51dGUpICsgJzonXG4gICAgICAgICAgICAgICAgKyAoc2Vjb25kIDwgMTAgPyAnMCcgKyBzZWNvbmQgOiBzZWNvbmQpICsgJyBHTVQnO1xuICAgICAgICB9XG4gICAgfSwgaGFzTmVnYXRpdmVNb250aFllYXJCdWcgfHwgaGFzVG9VVENTdHJpbmdGb3JtYXRCdWcpO1xuXG4gICAgLy8gT3BlcmEgMTIgaGFzIGAsYFxuICAgIGRlZmluZVByb3BlcnRpZXMoRGF0ZS5wcm90b3R5cGUsIHtcbiAgICAgICAgdG9EYXRlU3RyaW5nOiBmdW5jdGlvbiB0b0RhdGVTdHJpbmcoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMgfHwgISh0aGlzIGluc3RhbmNlb2YgRGF0ZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0aGlzIGlzIG5vdCBhIERhdGUgb2JqZWN0LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGRheSA9IHRoaXMuZ2V0RGF5KCk7XG4gICAgICAgICAgICB2YXIgZGF0ZSA9IHRoaXMuZ2V0RGF0ZSgpO1xuICAgICAgICAgICAgdmFyIG1vbnRoID0gdGhpcy5nZXRNb250aCgpO1xuICAgICAgICAgICAgdmFyIHllYXIgPSB0aGlzLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgICByZXR1cm4gZGF5TmFtZVtkYXldICsgJyAnXG4gICAgICAgICAgICAgICAgKyBtb250aE5hbWVbbW9udGhdICsgJyAnXG4gICAgICAgICAgICAgICAgKyAoZGF0ZSA8IDEwID8gJzAnICsgZGF0ZSA6IGRhdGUpICsgJyAnXG4gICAgICAgICAgICAgICAgKyB5ZWFyO1xuICAgICAgICB9XG4gICAgfSwgaGFzTmVnYXRpdmVNb250aFllYXJCdWcgfHwgaGFzVG9EYXRlU3RyaW5nRm9ybWF0QnVnKTtcblxuICAgIC8vIGNhbid0IHVzZSBkZWZpbmVQcm9wZXJ0aWVzIGhlcmUgYmVjYXVzZSBvZiB0b1N0cmluZyBlbnVtZXJhdGlvbiBpc3N1ZSBpbiBJRSA8PSA4XG4gICAgaWYgKGhhc05lZ2F0aXZlTW9udGhZZWFyQnVnIHx8IGhhc1RvU3RyaW5nRm9ybWF0QnVnKSB7XG4gICAgICAgIERhdGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMgfHwgISh0aGlzIGluc3RhbmNlb2YgRGF0ZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0aGlzIGlzIG5vdCBhIERhdGUgb2JqZWN0LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGRheSA9IHRoaXMuZ2V0RGF5KCk7XG4gICAgICAgICAgICB2YXIgZGF0ZSA9IHRoaXMuZ2V0RGF0ZSgpO1xuICAgICAgICAgICAgdmFyIG1vbnRoID0gdGhpcy5nZXRNb250aCgpO1xuICAgICAgICAgICAgdmFyIHllYXIgPSB0aGlzLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgICB2YXIgaG91ciA9IHRoaXMuZ2V0SG91cnMoKTtcbiAgICAgICAgICAgIHZhciBtaW51dGUgPSB0aGlzLmdldE1pbnV0ZXMoKTtcbiAgICAgICAgICAgIHZhciBzZWNvbmQgPSB0aGlzLmdldFNlY29uZHMoKTtcbiAgICAgICAgICAgIHZhciB0aW1lem9uZU9mZnNldCA9IHRoaXMuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgICAgICAgICAgIHZhciBob3Vyc09mZnNldCA9IE1hdGguZmxvb3IoTWF0aC5hYnModGltZXpvbmVPZmZzZXQpIC8gNjApO1xuICAgICAgICAgICAgdmFyIG1pbnV0ZXNPZmZzZXQgPSBNYXRoLmZsb29yKE1hdGguYWJzKHRpbWV6b25lT2Zmc2V0KSAlIDYwKTtcbiAgICAgICAgICAgIHJldHVybiBkYXlOYW1lW2RheV0gKyAnICdcbiAgICAgICAgICAgICAgICArIG1vbnRoTmFtZVttb250aF0gKyAnICdcbiAgICAgICAgICAgICAgICArIChkYXRlIDwgMTAgPyAnMCcgKyBkYXRlIDogZGF0ZSkgKyAnICdcbiAgICAgICAgICAgICAgICArIHllYXIgKyAnICdcbiAgICAgICAgICAgICAgICArIChob3VyIDwgMTAgPyAnMCcgKyBob3VyIDogaG91cikgKyAnOidcbiAgICAgICAgICAgICAgICArIChtaW51dGUgPCAxMCA/ICcwJyArIG1pbnV0ZSA6IG1pbnV0ZSkgKyAnOidcbiAgICAgICAgICAgICAgICArIChzZWNvbmQgPCAxMCA/ICcwJyArIHNlY29uZCA6IHNlY29uZCkgKyAnIEdNVCdcbiAgICAgICAgICAgICAgICArICh0aW1lem9uZU9mZnNldCA+IDAgPyAnLScgOiAnKycpXG4gICAgICAgICAgICAgICAgKyAoaG91cnNPZmZzZXQgPCAxMCA/ICcwJyArIGhvdXJzT2Zmc2V0IDogaG91cnNPZmZzZXQpXG4gICAgICAgICAgICAgICAgKyAobWludXRlc09mZnNldCA8IDEwID8gJzAnICsgbWludXRlc09mZnNldCA6IG1pbnV0ZXNPZmZzZXQpO1xuICAgICAgICB9O1xuICAgICAgICBpZiAoc3VwcG9ydHNEZXNjcmlwdG9ycykge1xuICAgICAgICAgICAgJE9iamVjdC5kZWZpbmVQcm9wZXJ0eShEYXRlLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFUzUgMTUuOS41LjQzXG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuOS41LjQzXG4gICAgLy8gVGhpcyBmdW5jdGlvbiByZXR1cm5zIGEgU3RyaW5nIHZhbHVlIHJlcHJlc2VudCB0aGUgaW5zdGFuY2UgaW4gdGltZVxuICAgIC8vIHJlcHJlc2VudGVkIGJ5IHRoaXMgRGF0ZSBvYmplY3QuIFRoZSBmb3JtYXQgb2YgdGhlIFN0cmluZyBpcyB0aGUgRGF0ZSBUaW1lXG4gICAgLy8gc3RyaW5nIGZvcm1hdCBkZWZpbmVkIGluIDE1LjkuMS4xNS4gQWxsIGZpZWxkcyBhcmUgcHJlc2VudCBpbiB0aGUgU3RyaW5nLlxuICAgIC8vIFRoZSB0aW1lIHpvbmUgaXMgYWx3YXlzIFVUQywgZGVub3RlZCBieSB0aGUgc3VmZml4IFouIElmIHRoZSB0aW1lIHZhbHVlIG9mXG4gICAgLy8gdGhpcyBvYmplY3QgaXMgbm90IGEgZmluaXRlIE51bWJlciBhIFJhbmdlRXJyb3IgZXhjZXB0aW9uIGlzIHRocm93bi5cbiAgICB2YXIgbmVnYXRpdmVEYXRlID0gLTYyMTk4NzU1MjAwMDAwO1xuICAgIHZhciBuZWdhdGl2ZVllYXJTdHJpbmcgPSAnLTAwMDAwMSc7XG4gICAgdmFyIGhhc05lZ2F0aXZlRGF0ZUJ1ZyA9IERhdGUucHJvdG90eXBlLnRvSVNPU3RyaW5nICYmIG5ldyBEYXRlKG5lZ2F0aXZlRGF0ZSkudG9JU09TdHJpbmcoKS5pbmRleE9mKG5lZ2F0aXZlWWVhclN0cmluZykgPT09IC0xOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG1heC1sZW5cbiAgICB2YXIgaGFzU2FmYXJpNTFEYXRlQnVnID0gRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcgJiYgbmV3IERhdGUoLTEpLnRvSVNPU3RyaW5nKCkgIT09ICcxOTY5LTEyLTMxVDIzOjU5OjU5Ljk5OVonO1xuXG4gICAgdmFyIGdldFRpbWUgPSBjYWxsLmJpbmQoRGF0ZS5wcm90b3R5cGUuZ2V0VGltZSk7XG5cbiAgICBkZWZpbmVQcm9wZXJ0aWVzKERhdGUucHJvdG90eXBlLCB7XG4gICAgICAgIHRvSVNPU3RyaW5nOiBmdW5jdGlvbiB0b0lTT1N0cmluZygpIHtcbiAgICAgICAgICAgIGlmICghaXNGaW5pdGUodGhpcykgfHwgIWlzRmluaXRlKGdldFRpbWUodGhpcykpKSB7XG4gICAgICAgICAgICAgICAgLy8gQWRvcGUgUGhvdG9zaG9wIHJlcXVpcmVzIHRoZSBzZWNvbmQgY2hlY2suXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0RhdGUucHJvdG90eXBlLnRvSVNPU3RyaW5nIGNhbGxlZCBvbiBub24tZmluaXRlIHZhbHVlLicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgeWVhciA9IG9yaWdpbmFsR2V0VVRDRnVsbFllYXIodGhpcyk7XG5cbiAgICAgICAgICAgIHZhciBtb250aCA9IG9yaWdpbmFsR2V0VVRDTW9udGgodGhpcyk7XG4gICAgICAgICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltL2lzc3Vlcy8xMTFcbiAgICAgICAgICAgIHllYXIgKz0gTWF0aC5mbG9vcihtb250aCAvIDEyKTtcbiAgICAgICAgICAgIG1vbnRoID0gKChtb250aCAlIDEyKSArIDEyKSAlIDEyO1xuXG4gICAgICAgICAgICAvLyB0aGUgZGF0ZSB0aW1lIHN0cmluZyBmb3JtYXQgaXMgc3BlY2lmaWVkIGluIDE1LjkuMS4xNS5cbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXG4gICAgICAgICAgICAgICAgbW9udGggKyAxLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsR2V0VVRDRGF0ZSh0aGlzKSxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEdldFVUQ0hvdXJzKHRoaXMpLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsR2V0VVRDTWludXRlcyh0aGlzKSxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEdldFVUQ1NlY29uZHModGhpcylcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICB5ZWFyID0gKFxuICAgICAgICAgICAgICAgICh5ZWFyIDwgMCA/ICctJyA6ICh5ZWFyID4gOTk5OSA/ICcrJyA6ICcnKSlcbiAgICAgICAgICAgICAgICArIHN0clNsaWNlKCcwMDAwMCcgKyBNYXRoLmFicyh5ZWFyKSwgKDAgPD0geWVhciAmJiB5ZWFyIDw9IDk5OTkpID8gLTQgOiAtNilcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgLy8gcGFkIG1vbnRocywgZGF5cywgaG91cnMsIG1pbnV0ZXMsIGFuZCBzZWNvbmRzIHRvIGhhdmUgdHdvIGRpZ2l0cy5cbiAgICAgICAgICAgICAgICByZXN1bHRbaV0gPSBzdHJTbGljZSgnMDAnICsgcmVzdWx0W2ldLCAtMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBwYWQgbWlsbGlzZWNvbmRzIHRvIGhhdmUgdGhyZWUgZGlnaXRzLlxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICB5ZWFyICsgJy0nICsgYXJyYXlTbGljZShyZXN1bHQsIDAsIDIpLmpvaW4oJy0nKVxuICAgICAgICAgICAgICAgICsgJ1QnICsgYXJyYXlTbGljZShyZXN1bHQsIDIpLmpvaW4oJzonKSArICcuJ1xuICAgICAgICAgICAgICAgICsgc3RyU2xpY2UoJzAwMCcgKyBvcmlnaW5hbEdldFVUQ01pbGxpc2Vjb25kcyh0aGlzKSwgLTMpICsgJ1onXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfSwgaGFzTmVnYXRpdmVEYXRlQnVnIHx8IGhhc1NhZmFyaTUxRGF0ZUJ1Zyk7XG5cbiAgICAvLyBFUzUgMTUuOS41LjQ0XG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuOS41LjQ0XG4gICAgLy8gVGhpcyBmdW5jdGlvbiBwcm92aWRlcyBhIFN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIERhdGUgb2JqZWN0IGZvciB1c2UgYnlcbiAgICAvLyBKU09OLnN0cmluZ2lmeSAoMTUuMTIuMykuXG4gICAgdmFyIGRhdGVUb0pTT05Jc1N1cHBvcnRlZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gRGF0ZS5wcm90b3R5cGUudG9KU09OXG4gICAgICAgICAgICAgICAgJiYgbmV3IERhdGUoTmFOKS50b0pTT04oKSA9PT0gbnVsbFxuICAgICAgICAgICAgICAgICYmIG5ldyBEYXRlKG5lZ2F0aXZlRGF0ZSkudG9KU09OKCkuaW5kZXhPZihuZWdhdGl2ZVllYXJTdHJpbmcpICE9PSAtMVxuICAgICAgICAgICAgICAgICYmIERhdGUucHJvdG90eXBlLnRvSlNPTi5jYWxsKHsgLy8gZ2VuZXJpY1xuICAgICAgICAgICAgICAgICAgICB0b0lTT1N0cmluZzogZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KCkpO1xuICAgIGlmICghZGF0ZVRvSlNPTklzU3VwcG9ydGVkKSB7XG4gICAgICAgIERhdGUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTihrZXkpIHtcbiAgICAgICAgICAgIC8vIFdoZW4gdGhlIHRvSlNPTiBtZXRob2QgaXMgY2FsbGVkIHdpdGggYXJndW1lbnQga2V5LCB0aGUgZm9sbG93aW5nXG4gICAgICAgICAgICAvLyBzdGVwcyBhcmUgdGFrZW46XG5cbiAgICAgICAgICAgIC8vIDEuICBMZXQgTyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgVG9PYmplY3QsIGdpdmluZyBpdCB0aGUgdGhpc1xuICAgICAgICAgICAgLy8gdmFsdWUgYXMgaXRzIGFyZ3VtZW50LlxuICAgICAgICAgICAgLy8gMi4gTGV0IHR2IGJlIEVTLlRvUHJpbWl0aXZlKE8sIGhpbnQgTnVtYmVyKS5cbiAgICAgICAgICAgIHZhciBPID0gJE9iamVjdCh0aGlzKTtcbiAgICAgICAgICAgIHZhciB0diA9IEVTLlRvUHJpbWl0aXZlKE8pO1xuICAgICAgICAgICAgLy8gMy4gSWYgdHYgaXMgYSBOdW1iZXIgYW5kIGlzIG5vdCBmaW5pdGUsIHJldHVybiBudWxsLlxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0diA9PT0gJ251bWJlcicgJiYgIWlzRmluaXRlKHR2KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gNC4gTGV0IHRvSVNPIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbCBtZXRob2Qgb2ZcbiAgICAgICAgICAgIC8vIE8gd2l0aCBhcmd1bWVudCBcInRvSVNPU3RyaW5nXCIuXG4gICAgICAgICAgICB2YXIgdG9JU08gPSBPLnRvSVNPU3RyaW5nO1xuICAgICAgICAgICAgLy8gNS4gSWYgSXNDYWxsYWJsZSh0b0lTTykgaXMgZmFsc2UsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cbiAgICAgICAgICAgIGlmICghaXNDYWxsYWJsZSh0b0lTTykpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0b0lTT1N0cmluZyBwcm9wZXJ0eSBpcyBub3QgY2FsbGFibGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIDYuIFJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbQ2FsbF1dIGludGVybmFsIG1ldGhvZCBvZlxuICAgICAgICAgICAgLy8gIHRvSVNPIHdpdGggTyBhcyB0aGUgdGhpcyB2YWx1ZSBhbmQgYW4gZW1wdHkgYXJndW1lbnQgbGlzdC5cbiAgICAgICAgICAgIHJldHVybiB0b0lTTy5jYWxsKE8pO1xuXG4gICAgICAgICAgICAvLyBOT1RFIDEgVGhlIGFyZ3VtZW50IGlzIGlnbm9yZWQuXG5cbiAgICAgICAgICAgIC8vIE5PVEUgMiBUaGUgdG9KU09OIGZ1bmN0aW9uIGlzIGludGVudGlvbmFsbHkgZ2VuZXJpYzsgaXQgZG9lcyBub3RcbiAgICAgICAgICAgIC8vIHJlcXVpcmUgdGhhdCBpdHMgdGhpcyB2YWx1ZSBiZSBhIERhdGUgb2JqZWN0LiBUaGVyZWZvcmUsIGl0IGNhbiBiZVxuICAgICAgICAgICAgLy8gdHJhbnNmZXJyZWQgdG8gb3RoZXIga2luZHMgb2Ygb2JqZWN0cyBmb3IgdXNlIGFzIGEgbWV0aG9kLiBIb3dldmVyLFxuICAgICAgICAgICAgLy8gaXQgZG9lcyByZXF1aXJlIHRoYXQgYW55IHN1Y2ggb2JqZWN0IGhhdmUgYSB0b0lTT1N0cmluZyBtZXRob2QuIEFuXG4gICAgICAgICAgICAvLyBvYmplY3QgaXMgZnJlZSB0byB1c2UgdGhlIGFyZ3VtZW50IGtleSB0byBmaWx0ZXIgaXRzXG4gICAgICAgICAgICAvLyBzdHJpbmdpZmljYXRpb24uXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRVM1IDE1LjkuNC4yXG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuOS40LjJcbiAgICAvLyBiYXNlZCBvbiB3b3JrIHNoYXJlZCBieSBEYW5pZWwgRnJpZXNlbiAoZGFudG1hbilcbiAgICAvLyBodHRwOi8vZ2lzdC5naXRodWIuY29tLzMwMzI0OVxuICAgIHZhciBzdXBwb3J0c0V4dGVuZGVkWWVhcnMgPSBEYXRlLnBhcnNlKCcrMDMzNjU4LTA5LTI3VDAxOjQ2OjQwLjAwMFonKSA9PT0gMWUxNTtcbiAgICB2YXIgYWNjZXB0c0ludmFsaWREYXRlcyA9ICFpc05hTihEYXRlLnBhcnNlKCcyMDEyLTA0LTA0VDI0OjAwOjAwLjUwMFonKSkgfHwgIWlzTmFOKERhdGUucGFyc2UoJzIwMTItMTEtMzFUMjM6NTk6NTkuMDAwWicpKSB8fCAhaXNOYU4oRGF0ZS5wYXJzZSgnMjAxMi0xMi0zMVQyMzo1OTo2MC4wMDBaJykpO1xuICAgIHZhciBkb2VzTm90UGFyc2VZMktOZXdZZWFyID0gaXNOYU4oRGF0ZS5wYXJzZSgnMjAwMC0wMS0wMVQwMDowMDowMC4wMDBaJykpO1xuICAgIGlmIChkb2VzTm90UGFyc2VZMktOZXdZZWFyIHx8IGFjY2VwdHNJbnZhbGlkRGF0ZXMgfHwgIXN1cHBvcnRzRXh0ZW5kZWRZZWFycykge1xuICAgICAgICAvLyBYWFggZ2xvYmFsIGFzc2lnbm1lbnQgd29uJ3Qgd29yayBpbiBlbWJlZGRpbmdzIHRoYXQgdXNlXG4gICAgICAgIC8vIGFuIGFsdGVybmF0ZSBvYmplY3QgZm9yIHRoZSBjb250ZXh0LlxuICAgICAgICAvKiBnbG9iYWwgRGF0ZTogdHJ1ZSAqL1xuICAgICAgICB2YXIgbWF4U2FmZVVuc2lnbmVkMzJCaXQgPSBNYXRoLnBvdygyLCAzMSkgLSAxO1xuICAgICAgICB2YXIgaGFzU2FmYXJpU2lnbmVkSW50QnVnID0gaXNBY3R1YWxOYU4obmV3IERhdGUoMTk3MCwgMCwgMSwgMCwgMCwgMCwgbWF4U2FmZVVuc2lnbmVkMzJCaXQgKyAxKS5nZXRUaW1lKCkpO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8taW1wbGljaXQtZ2xvYmFscywgbm8tZ2xvYmFsLWFzc2lnblxuICAgICAgICBEYXRlID0gKGZ1bmN0aW9uIChOYXRpdmVEYXRlKSB7XG4gICAgICAgICAgICAvLyBEYXRlLmxlbmd0aCA9PT0gN1xuICAgICAgICAgICAgdmFyIERhdGVTaGltID0gZnVuY3Rpb24gRGF0ZShZLCBNLCBELCBoLCBtLCBzLCBtcykge1xuICAgICAgICAgICAgICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHZhciBkYXRlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgTmF0aXZlRGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2Vjb25kcyA9IHM7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtaWxsaXMgPSBtcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhhc1NhZmFyaVNpZ25lZEludEJ1ZyAmJiBsZW5ndGggPj0gNyAmJiBtcyA+IG1heFNhZmVVbnNpZ25lZDMyQml0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3b3JrIGFyb3VuZCBhIFNhZmFyaSA4LzkgYnVnIHdoZXJlIGl0IHRyZWF0cyB0aGUgc2Vjb25kcyBhcyBzaWduZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtc1RvU2hpZnQgPSBNYXRoLmZsb29yKG1zIC8gbWF4U2FmZVVuc2lnbmVkMzJCaXQpICogbWF4U2FmZVVuc2lnbmVkMzJCaXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc1RvU2hpZnQgPSBNYXRoLmZsb29yKG1zVG9TaGlmdCAvIDFlMyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWNvbmRzICs9IHNUb1NoaWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbWlsbGlzIC09IHNUb1NoaWZ0ICogMWUzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRhdGUgPSBsZW5ndGggPT09IDEgJiYgJFN0cmluZyhZKSA9PT0gWSAvLyBpc1N0cmluZyhZKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgZXhwbGljaXRseSBwYXNzIGl0IHRocm91Z2ggcGFyc2U6XG4gICAgICAgICAgICAgICAgICAgICAgICA/IG5ldyBOYXRpdmVEYXRlKERhdGVTaGltLnBhcnNlKFkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byBtYW51YWxseSBtYWtlIGNhbGxzIGRlcGVuZGluZyBvbiBhcmd1bWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGVuZ3RoIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIDogbGVuZ3RoID49IDcgPyBuZXcgTmF0aXZlRGF0ZShZLCBNLCBELCBoLCBtLCBzZWNvbmRzLCBtaWxsaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBsZW5ndGggPj0gNiA/IG5ldyBOYXRpdmVEYXRlKFksIE0sIEQsIGgsIG0sIHNlY29uZHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbGVuZ3RoID49IDUgPyBuZXcgTmF0aXZlRGF0ZShZLCBNLCBELCBoLCBtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBsZW5ndGggPj0gNCA/IG5ldyBOYXRpdmVEYXRlKFksIE0sIEQsIGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBsZW5ndGggPj0gMyA/IG5ldyBOYXRpdmVEYXRlKFksIE0sIEQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbGVuZ3RoID49IDIgPyBuZXcgTmF0aXZlRGF0ZShZLCBNKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBsZW5ndGggPj0gMSA/IG5ldyBOYXRpdmVEYXRlKFkgaW5zdGFuY2VvZiBOYXRpdmVEYXRlID8gK1kgOiBZKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbmV3IE5hdGl2ZURhdGUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkYXRlID0gTmF0aXZlRGF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWlzUHJpbWl0aXZlKGRhdGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFByZXZlbnQgbWl4dXBzIHdpdGggdW5maXhlZCBEYXRlIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICBkZWZpbmVQcm9wZXJ0aWVzKGRhdGUsIHsgY29uc3RydWN0b3I6IERhdGVTaGltIH0sIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIDE1LjkuMS4xNSBEYXRlIFRpbWUgU3RyaW5nIEZvcm1hdC5cbiAgICAgICAgICAgIHZhciBpc29EYXRlRXhwcmVzc2lvbiA9IG5ldyBSZWdFeHAoJ14nXG4gICAgICAgICAgICAgICAgKyAnKFxcXFxkezR9fFsrLV1cXFxcZHs2fSknIC8vIGZvdXItZGlnaXQgeWVhciBjYXB0dXJlIG9yIHNpZ24gKyA2LWRpZ2l0IGV4dGVuZGVkIHllYXJcbiAgICAgICAgICAgICAgICArICcoPzotKFxcXFxkezJ9KScgLy8gb3B0aW9uYWwgbW9udGggY2FwdHVyZVxuICAgICAgICAgICAgICAgICsgJyg/Oi0oXFxcXGR7Mn0pJyAvLyBvcHRpb25hbCBkYXkgY2FwdHVyZVxuICAgICAgICAgICAgICAgICsgJyg/OicgLy8gY2FwdHVyZSBob3VyczptaW51dGVzOnNlY29uZHMubWlsbGlzZWNvbmRzXG4gICAgICAgICAgICAgICAgICAgICsgJ1QoXFxcXGR7Mn0pJyAvLyBob3VycyBjYXB0dXJlXG4gICAgICAgICAgICAgICAgICAgICsgJzooXFxcXGR7Mn0pJyAvLyBtaW51dGVzIGNhcHR1cmVcbiAgICAgICAgICAgICAgICAgICAgKyAnKD86JyAvLyBvcHRpb25hbCA6c2Vjb25kcy5taWxsaXNlY29uZHNcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJzooXFxcXGR7Mn0pJyAvLyBzZWNvbmRzIGNhcHR1cmVcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJyg/OihcXFxcLlxcXFxkezEsfSkpPycgLy8gbWlsbGlzZWNvbmRzIGNhcHR1cmVcbiAgICAgICAgICAgICAgICAgICAgKyAnKT8nXG4gICAgICAgICAgICAgICAgKyAnKCcgLy8gY2FwdHVyZSBVVEMgb2Zmc2V0IGNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICArICdafCcgLy8gVVRDIGNhcHR1cmVcbiAgICAgICAgICAgICAgICAgICAgKyAnKD86JyAvLyBvZmZzZXQgc3BlY2lmaWVyICsvLWhvdXJzOm1pbnV0ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJyhbLStdKScgLy8gc2lnbiBjYXB0dXJlXG4gICAgICAgICAgICAgICAgICAgICAgICArICcoXFxcXGR7Mn0pJyAvLyBob3VycyBvZmZzZXQgY2FwdHVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnOihcXFxcZHsyfSknIC8vIG1pbnV0ZXMgb2Zmc2V0IGNhcHR1cmVcbiAgICAgICAgICAgICAgICAgICAgKyAnKSdcbiAgICAgICAgICAgICAgICArICcpPyk/KT8pPydcbiAgICAgICAgICAgICsgJyQnKTtcblxuICAgICAgICAgICAgdmFyIG1vbnRocyA9IFswLCAzMSwgNTksIDkwLCAxMjAsIDE1MSwgMTgxLCAyMTIsIDI0MywgMjczLCAzMDQsIDMzNCwgMzY1XTtcblxuICAgICAgICAgICAgdmFyIGRheUZyb21Nb250aCA9IGZ1bmN0aW9uIGRheUZyb21Nb250aCh5ZWFyLCBtb250aCkge1xuICAgICAgICAgICAgICAgIHZhciB0ID0gbW9udGggPiAxID8gMSA6IDA7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgbW9udGhzW21vbnRoXVxuICAgICAgICAgICAgICAgICAgICArIE1hdGguZmxvb3IoKHllYXIgLSAxOTY5ICsgdCkgLyA0KVxuICAgICAgICAgICAgICAgICAgICAtIE1hdGguZmxvb3IoKHllYXIgLSAxOTAxICsgdCkgLyAxMDApXG4gICAgICAgICAgICAgICAgICAgICsgTWF0aC5mbG9vcigoeWVhciAtIDE2MDEgKyB0KSAvIDQwMClcbiAgICAgICAgICAgICAgICAgICAgKyAoMzY1ICogKHllYXIgLSAxOTcwKSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIHRvVVRDID0gZnVuY3Rpb24gdG9VVEModCkge1xuICAgICAgICAgICAgICAgIHZhciBzID0gMDtcbiAgICAgICAgICAgICAgICB2YXIgbXMgPSB0O1xuICAgICAgICAgICAgICAgIGlmIChoYXNTYWZhcmlTaWduZWRJbnRCdWcgJiYgbXMgPiBtYXhTYWZlVW5zaWduZWQzMkJpdCkge1xuICAgICAgICAgICAgICAgICAgICAvLyB3b3JrIGFyb3VuZCBhIFNhZmFyaSA4LzkgYnVnIHdoZXJlIGl0IHRyZWF0cyB0aGUgc2Vjb25kcyBhcyBzaWduZWRcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1zVG9TaGlmdCA9IE1hdGguZmxvb3IobXMgLyBtYXhTYWZlVW5zaWduZWQzMkJpdCkgKiBtYXhTYWZlVW5zaWduZWQzMkJpdDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNUb1NoaWZ0ID0gTWF0aC5mbG9vcihtc1RvU2hpZnQgLyAxZTMpO1xuICAgICAgICAgICAgICAgICAgICBzICs9IHNUb1NoaWZ0O1xuICAgICAgICAgICAgICAgICAgICBtcyAtPSBzVG9TaGlmdCAqIDFlMztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuICROdW1iZXIobmV3IE5hdGl2ZURhdGUoMTk3MCwgMCwgMSwgMCwgMCwgcywgbXMpKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIENvcHkgYW55IGN1c3RvbSBtZXRob2RzIGEgM3JkIHBhcnR5IGxpYnJhcnkgbWF5IGhhdmUgYWRkZWRcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBOYXRpdmVEYXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG93bnMoTmF0aXZlRGF0ZSwga2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBEYXRlU2hpbVtrZXldID0gTmF0aXZlRGF0ZVtrZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ29weSBcIm5hdGl2ZVwiIG1ldGhvZHMgZXhwbGljaXRseTsgdGhleSBtYXkgYmUgbm9uLWVudW1lcmFibGVcbiAgICAgICAgICAgIGRlZmluZVByb3BlcnRpZXMoRGF0ZVNoaW0sIHtcbiAgICAgICAgICAgICAgICBub3c6IE5hdGl2ZURhdGUubm93LFxuICAgICAgICAgICAgICAgIFVUQzogTmF0aXZlRGF0ZS5VVENcbiAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICAgICAgRGF0ZVNoaW0ucHJvdG90eXBlID0gTmF0aXZlRGF0ZS5wcm90b3R5cGU7XG4gICAgICAgICAgICBkZWZpbmVQcm9wZXJ0aWVzKERhdGVTaGltLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogRGF0ZVNoaW0gfSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vIFVwZ3JhZGUgRGF0ZS5wYXJzZSB0byBoYW5kbGUgc2ltcGxpZmllZCBJU08gODYwMSBzdHJpbmdzXG4gICAgICAgICAgICB2YXIgcGFyc2VTaGltID0gZnVuY3Rpb24gcGFyc2Uoc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gaXNvRGF0ZUV4cHJlc3Npb24uZXhlYyhzdHJpbmcpO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBwYXJzZSBtb250aHMsIGRheXMsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzLCBhbmQgbWlsbGlzZWNvbmRzXG4gICAgICAgICAgICAgICAgICAgIC8vIHByb3ZpZGUgZGVmYXVsdCB2YWx1ZXMgaWYgbmVjZXNzYXJ5XG4gICAgICAgICAgICAgICAgICAgIC8vIHBhcnNlIHRoZSBVVEMgb2Zmc2V0IGNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICB2YXIgeWVhciA9ICROdW1iZXIobWF0Y2hbMV0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGggPSAkTnVtYmVyKG1hdGNoWzJdIHx8IDEpIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRheSA9ICROdW1iZXIobWF0Y2hbM10gfHwgMSkgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgaG91ciA9ICROdW1iZXIobWF0Y2hbNF0gfHwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW51dGUgPSAkTnVtYmVyKG1hdGNoWzVdIHx8IDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kID0gJE51bWJlcihtYXRjaFs2XSB8fCAwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbGxpc2Vjb25kID0gTWF0aC5mbG9vcigkTnVtYmVyKG1hdGNoWzddIHx8IDApICogMTAwMCksXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIHRpbWUgem9uZSBpcyBtaXNzZWQsIGxvY2FsIG9mZnNldCBzaG91bGQgYmUgdXNlZFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gKEVTIDUuMSBidWcpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZWUgaHR0cHM6Ly9idWdzLmVjbWFzY3JpcHQub3JnL3Nob3dfYnVnLmNnaT9pZD0xMTJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzTG9jYWxUaW1lID0gQm9vbGVhbihtYXRjaFs0XSAmJiAhbWF0Y2hbOF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbk9mZnNldCA9IG1hdGNoWzldID09PSAnLScgPyAxIDogLTEsXG4gICAgICAgICAgICAgICAgICAgICAgICBob3VyT2Zmc2V0ID0gJE51bWJlcihtYXRjaFsxMF0gfHwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW51dGVPZmZzZXQgPSAkTnVtYmVyKG1hdGNoWzExXSB8fCAwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhc01pbnV0ZXNPclNlY29uZHNPck1pbGxpc2Vjb25kcyA9IG1pbnV0ZSA+IDAgfHwgc2Vjb25kID4gMCB8fCBtaWxsaXNlY29uZCA+IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdXIgPCAoaGFzTWludXRlc09yU2Vjb25kc09yTWlsbGlzZWNvbmRzID8gMjQgOiAyNSlcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIG1pbnV0ZSA8IDYwICYmIHNlY29uZCA8IDYwICYmIG1pbGxpc2Vjb25kIDwgMTAwMFxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgbW9udGggPiAtMSAmJiBtb250aCA8IDEyICYmIGhvdXJPZmZzZXQgPCAyNFxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgbWludXRlT2Zmc2V0IDwgNjAgLy8gZGV0ZWN0IGludmFsaWQgb2Zmc2V0c1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgZGF5ID4gLTFcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIGRheSA8IChkYXlGcm9tTW9udGgoeWVhciwgbW9udGggKyAxKSAtIGRheUZyb21Nb250aCh5ZWFyLCBtb250aCkpXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoZGF5RnJvbU1vbnRoKHllYXIsIG1vbnRoKSArIGRheSkgKiAyNClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArIGhvdXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArIChob3VyT2Zmc2V0ICogc2lnbk9mZnNldClcbiAgICAgICAgICAgICAgICAgICAgICAgICkgKiA2MDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9ICgoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKChyZXN1bHQgKyBtaW51dGUgKyAobWludXRlT2Zmc2V0ICogc2lnbk9mZnNldCkpICogNjApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBzZWNvbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICkgKiAxMDAwKSArIG1pbGxpc2Vjb25kO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTG9jYWxUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdG9VVEMocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgtOC42NGUxNSA8PSByZXN1bHQgJiYgcmVzdWx0IDw9IDguNjRlMTUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBOYXRpdmVEYXRlLnBhcnNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZGVmaW5lUHJvcGVydGllcyhEYXRlU2hpbSwgeyBwYXJzZTogcGFyc2VTaGltIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gRGF0ZVNoaW07XG4gICAgICAgIH0oRGF0ZSkpO1xuICAgICAgICAvKiBnbG9iYWwgRGF0ZTogZmFsc2UgKi9cbiAgICB9XG5cbiAgICAvLyBFUzUgMTUuOS40LjRcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS45LjQuNFxuICAgIGlmICghRGF0ZS5ub3cpIHtcbiAgICAgICAgRGF0ZS5ub3cgPSBmdW5jdGlvbiBub3coKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy9cbiAgICAvLyBOdW1iZXJcbiAgICAvLyA9PT09PT1cbiAgICAvL1xuXG4gICAgLy8gRVM1LjEgMTUuNy40LjVcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS43LjQuNVxuICAgIHZhciBoYXNUb0ZpeGVkQnVncyA9IE51bWJlclByb3RvdHlwZS50b0ZpeGVkICYmIChcbiAgICAgICAgKDAuMDAwMDgpLnRvRml4ZWQoMykgIT09ICcwLjAwMCdcbiAgICAgICAgfHwgKDAuOSkudG9GaXhlZCgwKSAhPT0gJzEnXG4gICAgICAgIHx8ICgxLjI1NSkudG9GaXhlZCgyKSAhPT0gJzEuMjUnXG4gICAgICAgIHx8ICgxMDAwMDAwMDAwMDAwMDAwMTI4KS50b0ZpeGVkKDApICE9PSAnMTAwMDAwMDAwMDAwMDAwMDEyOCdcbiAgICApO1xuXG4gICAgdmFyIHRvRml4ZWRIZWxwZXJzID0ge1xuICAgICAgICBiYXNlOiAxZTcsXG4gICAgICAgIHNpemU6IDYsXG4gICAgICAgIGRhdGE6IFswLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgbXVsdGlwbHk6IGZ1bmN0aW9uIG11bHRpcGx5KG4sIGMpIHtcbiAgICAgICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgICAgICB2YXIgYzIgPSBjO1xuICAgICAgICAgICAgd2hpbGUgKCsraSA8IHRvRml4ZWRIZWxwZXJzLnNpemUpIHtcbiAgICAgICAgICAgICAgICBjMiArPSBuICogdG9GaXhlZEhlbHBlcnMuZGF0YVtpXTtcbiAgICAgICAgICAgICAgICB0b0ZpeGVkSGVscGVycy5kYXRhW2ldID0gYzIgJSB0b0ZpeGVkSGVscGVycy5iYXNlO1xuICAgICAgICAgICAgICAgIGMyID0gTWF0aC5mbG9vcihjMiAvIHRvRml4ZWRIZWxwZXJzLmJhc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBkaXZpZGU6IGZ1bmN0aW9uIGRpdmlkZShuKSB7XG4gICAgICAgICAgICB2YXIgaSA9IHRvRml4ZWRIZWxwZXJzLnNpemU7XG4gICAgICAgICAgICB2YXIgYyA9IDA7XG4gICAgICAgICAgICB3aGlsZSAoLS1pID49IDApIHtcbiAgICAgICAgICAgICAgICBjICs9IHRvRml4ZWRIZWxwZXJzLmRhdGFbaV07XG4gICAgICAgICAgICAgICAgdG9GaXhlZEhlbHBlcnMuZGF0YVtpXSA9IE1hdGguZmxvb3IoYyAvIG4pO1xuICAgICAgICAgICAgICAgIGMgPSAoYyAlIG4pICogdG9GaXhlZEhlbHBlcnMuYmFzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbnVtVG9TdHJpbmc6IGZ1bmN0aW9uIG51bVRvU3RyaW5nKCkge1xuICAgICAgICAgICAgdmFyIGkgPSB0b0ZpeGVkSGVscGVycy5zaXplO1xuICAgICAgICAgICAgdmFyIHMgPSAnJztcbiAgICAgICAgICAgIHdoaWxlICgtLWkgPj0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChzICE9PSAnJyB8fCBpID09PSAwIHx8IHRvRml4ZWRIZWxwZXJzLmRhdGFbaV0gIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSAkU3RyaW5nKHRvRml4ZWRIZWxwZXJzLmRhdGFbaV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAocyA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMgPSB0O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcyArPSBzdHJTbGljZSgnMDAwMDAwMCcsIDAsIDcgLSB0Lmxlbmd0aCkgKyB0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH0sXG4gICAgICAgIHBvdzogZnVuY3Rpb24gcG93KHgsIG4sIGFjYykge1xuICAgICAgICAgICAgcmV0dXJuIChuID09PSAwID8gYWNjIDogKG4gJSAyID09PSAxID8gcG93KHgsIG4gLSAxLCBhY2MgKiB4KSA6IHBvdyh4ICogeCwgbiAvIDIsIGFjYykpKTtcbiAgICAgICAgfSxcbiAgICAgICAgbG9nOiBmdW5jdGlvbiBsb2coeCkge1xuICAgICAgICAgICAgdmFyIG4gPSAwO1xuICAgICAgICAgICAgdmFyIHgyID0geDtcbiAgICAgICAgICAgIHdoaWxlICh4MiA+PSA0MDk2KSB7XG4gICAgICAgICAgICAgICAgbiArPSAxMjtcbiAgICAgICAgICAgICAgICB4MiAvPSA0MDk2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2hpbGUgKHgyID49IDIpIHtcbiAgICAgICAgICAgICAgICBuICs9IDE7XG4gICAgICAgICAgICAgICAgeDIgLz0gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciB0b0ZpeGVkU2hpbSA9IGZ1bmN0aW9uIHRvRml4ZWQoZnJhY3Rpb25EaWdpdHMpIHtcbiAgICAgICAgdmFyIGYsIHgsIHMsIG0sIGUsIHosIGosIGs7XG5cbiAgICAgICAgLy8gVGVzdCBmb3IgTmFOIGFuZCByb3VuZCBmcmFjdGlvbkRpZ2l0cyBkb3duXG4gICAgICAgIGYgPSAkTnVtYmVyKGZyYWN0aW9uRGlnaXRzKTtcbiAgICAgICAgZiA9IGlzQWN0dWFsTmFOKGYpID8gMCA6IE1hdGguZmxvb3IoZik7XG5cbiAgICAgICAgaWYgKGYgPCAwIHx8IGYgPiAyMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ051bWJlci50b0ZpeGVkIGNhbGxlZCB3aXRoIGludmFsaWQgbnVtYmVyIG9mIGRlY2ltYWxzJyk7XG4gICAgICAgIH1cblxuICAgICAgICB4ID0gJE51bWJlcih0aGlzKTtcblxuICAgICAgICBpZiAoaXNBY3R1YWxOYU4oeCkpIHtcbiAgICAgICAgICAgIHJldHVybiAnTmFOJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIGl0IGlzIHRvbyBiaWcgb3Igc21hbGwsIHJldHVybiB0aGUgc3RyaW5nIHZhbHVlIG9mIHRoZSBudW1iZXJcbiAgICAgICAgaWYgKHggPD0gLTFlMjEgfHwgeCA+PSAxZTIxKSB7XG4gICAgICAgICAgICByZXR1cm4gJFN0cmluZyh4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHMgPSAnJztcblxuICAgICAgICBpZiAoeCA8IDApIHtcbiAgICAgICAgICAgIHMgPSAnLSc7XG4gICAgICAgICAgICB4ID0gLXg7XG4gICAgICAgIH1cblxuICAgICAgICBtID0gJzAnO1xuXG4gICAgICAgIGlmICh4ID4gMWUtMjEpIHtcbiAgICAgICAgICAgIC8vIDFlLTIxIDwgeCA8IDFlMjFcbiAgICAgICAgICAgIC8vIC03MCA8IGxvZzIoeCkgPCA3MFxuICAgICAgICAgICAgZSA9IHRvRml4ZWRIZWxwZXJzLmxvZyh4ICogdG9GaXhlZEhlbHBlcnMucG93KDIsIDY5LCAxKSkgLSA2OTtcbiAgICAgICAgICAgIHogPSAoZSA8IDAgPyB4ICogdG9GaXhlZEhlbHBlcnMucG93KDIsIC1lLCAxKSA6IHggLyB0b0ZpeGVkSGVscGVycy5wb3coMiwgZSwgMSkpO1xuICAgICAgICAgICAgeiAqPSAweDEwMDAwMDAwMDAwMDAwOyAvLyBNYXRoLnBvdygyLCA1Mik7XG4gICAgICAgICAgICBlID0gNTIgLSBlO1xuXG4gICAgICAgICAgICAvLyAtMTggPCBlIDwgMTIyXG4gICAgICAgICAgICAvLyB4ID0geiAvIDIgXiBlXG4gICAgICAgICAgICBpZiAoZSA+IDApIHtcbiAgICAgICAgICAgICAgICB0b0ZpeGVkSGVscGVycy5tdWx0aXBseSgwLCB6KTtcbiAgICAgICAgICAgICAgICBqID0gZjtcblxuICAgICAgICAgICAgICAgIHdoaWxlIChqID49IDcpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9GaXhlZEhlbHBlcnMubXVsdGlwbHkoMWU3LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgaiAtPSA3O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRvRml4ZWRIZWxwZXJzLm11bHRpcGx5KHRvRml4ZWRIZWxwZXJzLnBvdygxMCwgaiwgMSksIDApO1xuICAgICAgICAgICAgICAgIGogPSBlIC0gMTtcblxuICAgICAgICAgICAgICAgIHdoaWxlIChqID49IDIzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvRml4ZWRIZWxwZXJzLmRpdmlkZSgxIDw8IDIzKTtcbiAgICAgICAgICAgICAgICAgICAgaiAtPSAyMztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0b0ZpeGVkSGVscGVycy5kaXZpZGUoMSA8PCBqKTtcbiAgICAgICAgICAgICAgICB0b0ZpeGVkSGVscGVycy5tdWx0aXBseSgxLCAxKTtcbiAgICAgICAgICAgICAgICB0b0ZpeGVkSGVscGVycy5kaXZpZGUoMik7XG4gICAgICAgICAgICAgICAgbSA9IHRvRml4ZWRIZWxwZXJzLm51bVRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRvRml4ZWRIZWxwZXJzLm11bHRpcGx5KDAsIHopO1xuICAgICAgICAgICAgICAgIHRvRml4ZWRIZWxwZXJzLm11bHRpcGx5KDEgPDwgKC1lKSwgMCk7XG4gICAgICAgICAgICAgICAgbSA9IHRvRml4ZWRIZWxwZXJzLm51bVRvU3RyaW5nKCkgKyBzdHJTbGljZSgnMC4wMDAwMDAwMDAwMDAwMDAwMDAwMCcsIDIsIDIgKyBmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmID4gMCkge1xuICAgICAgICAgICAgayA9IG0ubGVuZ3RoO1xuXG4gICAgICAgICAgICBpZiAoayA8PSBmKSB7XG4gICAgICAgICAgICAgICAgbSA9IHMgKyBzdHJTbGljZSgnMC4wMDAwMDAwMDAwMDAwMDAwMDAwJywgMCwgZiAtIGsgKyAyKSArIG07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG0gPSBzICsgc3RyU2xpY2UobSwgMCwgayAtIGYpICsgJy4nICsgc3RyU2xpY2UobSwgayAtIGYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbSA9IHMgKyBtO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfTtcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKE51bWJlclByb3RvdHlwZSwgeyB0b0ZpeGVkOiB0b0ZpeGVkU2hpbSB9LCBoYXNUb0ZpeGVkQnVncyk7XG5cbiAgICB2YXIgaGFzVG9QcmVjaXNpb25VbmRlZmluZWRCdWcgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIDEuMC50b1ByZWNpc2lvbih1bmRlZmluZWQpID09PSAnMSc7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfSgpKTtcbiAgICB2YXIgb3JpZ2luYWxUb1ByZWNpc2lvbiA9IE51bWJlclByb3RvdHlwZS50b1ByZWNpc2lvbjtcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKE51bWJlclByb3RvdHlwZSwge1xuICAgICAgICB0b1ByZWNpc2lvbjogZnVuY3Rpb24gdG9QcmVjaXNpb24ocHJlY2lzaW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHByZWNpc2lvbiA9PT0gJ3VuZGVmaW5lZCcgPyBvcmlnaW5hbFRvUHJlY2lzaW9uLmNhbGwodGhpcykgOiBvcmlnaW5hbFRvUHJlY2lzaW9uLmNhbGwodGhpcywgcHJlY2lzaW9uKTtcbiAgICAgICAgfVxuICAgIH0sIGhhc1RvUHJlY2lzaW9uVW5kZWZpbmVkQnVnKTtcblxuICAgIC8vXG4gICAgLy8gU3RyaW5nXG4gICAgLy8gPT09PT09XG4gICAgLy9cblxuICAgIC8vIEVTNSAxNS41LjQuMTRcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS41LjQuMTRcblxuICAgIC8vIFtidWdmaXgsIElFIGx0IDksIGZpcmVmb3ggNCwgS29ucXVlcm9yLCBPcGVyYSwgb2JzY3VyZSBicm93c2Vyc11cbiAgICAvLyBNYW55IGJyb3dzZXJzIGRvIG5vdCBzcGxpdCBwcm9wZXJseSB3aXRoIHJlZ3VsYXIgZXhwcmVzc2lvbnMgb3IgdGhleVxuICAgIC8vIGRvIG5vdCBwZXJmb3JtIHRoZSBzcGxpdCBjb3JyZWN0bHkgdW5kZXIgb2JzY3VyZSBjb25kaXRpb25zLlxuICAgIC8vIFNlZSBodHRwOi8vYmxvZy5zdGV2ZW5sZXZpdGhhbi5jb20vYXJjaGl2ZXMvY3Jvc3MtYnJvd3Nlci1zcGxpdFxuICAgIC8vIEkndmUgdGVzdGVkIGluIG1hbnkgYnJvd3NlcnMgYW5kIHRoaXMgc2VlbXMgdG8gY292ZXIgdGhlIGRldmlhbnQgb25lczpcbiAgICAvLyAgICAnYWInLnNwbGl0KC8oPzphYikqLykgc2hvdWxkIGJlIFtcIlwiLCBcIlwiXSwgbm90IFtcIlwiXVxuICAgIC8vICAgICcuJy5zcGxpdCgvKC4/KSguPykvKSBzaG91bGQgYmUgW1wiXCIsIFwiLlwiLCBcIlwiLCBcIlwiXSwgbm90IFtcIlwiLCBcIlwiXVxuICAgIC8vICAgICd0ZXNzdCcuc3BsaXQoLyhzKSovKSBzaG91bGQgYmUgW1widFwiLCB1bmRlZmluZWQsIFwiZVwiLCBcInNcIiwgXCJ0XCJdLCBub3RcbiAgICAvLyAgICAgICBbdW5kZWZpbmVkLCBcInRcIiwgdW5kZWZpbmVkLCBcImVcIiwgLi4uXVxuICAgIC8vICAgICcnLnNwbGl0KC8uPy8pIHNob3VsZCBiZSBbXSwgbm90IFtcIlwiXVxuICAgIC8vICAgICcuJy5zcGxpdCgvKCkoKS8pIHNob3VsZCBiZSBbXCIuXCJdLCBub3QgW1wiXCIsIFwiXCIsIFwiLlwiXVxuXG4gICAgaWYgKFxuICAgICAgICAnYWInLnNwbGl0KC8oPzphYikqLykubGVuZ3RoICE9PSAyXG4gICAgICAgIHx8ICcuJy5zcGxpdCgvKC4/KSguPykvKS5sZW5ndGggIT09IDRcbiAgICAgICAgfHwgJ3Rlc3N0Jy5zcGxpdCgvKHMpKi8pWzFdID09PSAndCdcbiAgICAgICAgfHwgJ3Rlc3QnLnNwbGl0KC8oPzopLywgLTEpLmxlbmd0aCAhPT0gNFxuICAgICAgICB8fCAnJy5zcGxpdCgvLj8vKS5sZW5ndGhcbiAgICAgICAgfHwgJy4nLnNwbGl0KC8oKSgpLykubGVuZ3RoID4gMVxuICAgICkge1xuICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNvbXBsaWFudEV4ZWNOcGNnID0gdHlwZW9mICgvKCk/Py8pLmV4ZWMoJycpWzFdID09PSAndW5kZWZpbmVkJzsgLy8gTlBDRzogbm9ucGFydGljaXBhdGluZyBjYXB0dXJpbmcgZ3JvdXBcbiAgICAgICAgICAgIHZhciBtYXhTYWZlMzJCaXRJbnQgPSBNYXRoLnBvdygyLCAzMikgLSAxO1xuXG4gICAgICAgICAgICBTdHJpbmdQcm90b3R5cGUuc3BsaXQgPSBmdW5jdGlvbiAoc2VwYXJhdG9yLCBsaW1pdCkge1xuICAgICAgICAgICAgICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzZXBhcmF0b3IgPT09ICd1bmRlZmluZWQnICYmIGxpbWl0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBJZiBgc2VwYXJhdG9yYCBpcyBub3QgYSByZWdleCwgdXNlIG5hdGl2ZSBzcGxpdFxuICAgICAgICAgICAgICAgIGlmICghaXNSZWdleChzZXBhcmF0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHJTcGxpdCh0aGlzLCBzZXBhcmF0b3IsIGxpbWl0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgICAgICAgICAgICAgdmFyIGZsYWdzID0gKHNlcGFyYXRvci5pZ25vcmVDYXNlID8gJ2knIDogJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAoc2VwYXJhdG9yLm11bHRpbGluZSA/ICdtJyA6ICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgKHNlcGFyYXRvci51bmljb2RlID8gJ3UnIDogJycpIC8vIGluIEVTNlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgKHNlcGFyYXRvci5zdGlja3kgPyAneScgOiAnJyksIC8vIEZpcmVmb3ggMysgYW5kIEVTNlxuICAgICAgICAgICAgICAgICAgICBsYXN0TGFzdEluZGV4ID0gMCxcbiAgICAgICAgICAgICAgICAgICAgLy8gTWFrZSBgZ2xvYmFsYCBhbmQgYXZvaWQgYGxhc3RJbmRleGAgaXNzdWVzIGJ5IHdvcmtpbmcgd2l0aCBhIGNvcHlcbiAgICAgICAgICAgICAgICAgICAgc2VwYXJhdG9yMiwgbWF0Y2gsIGxhc3RJbmRleCwgbGFzdExlbmd0aDtcbiAgICAgICAgICAgICAgICB2YXIgc2VwYXJhdG9yQ29weSA9IG5ldyBSZWdFeHAoc2VwYXJhdG9yLnNvdXJjZSwgZmxhZ3MgKyAnZycpO1xuICAgICAgICAgICAgICAgIGlmICghY29tcGxpYW50RXhlY05wY2cpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRG9lc24ndCBuZWVkIGZsYWdzIGd5LCBidXQgdGhleSBkb24ndCBodXJ0XG4gICAgICAgICAgICAgICAgICAgIHNlcGFyYXRvcjIgPSBuZXcgUmVnRXhwKCdeJyArIHNlcGFyYXRvckNvcHkuc291cmNlICsgJyQoPyFcXFxccyknLCBmbGFncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qIFZhbHVlcyBmb3IgYGxpbWl0YCwgcGVyIHRoZSBzcGVjOlxuICAgICAgICAgICAgICAgICAqIElmIHVuZGVmaW5lZDogNDI5NDk2NzI5NSAvLyBtYXhTYWZlMzJCaXRJbnRcbiAgICAgICAgICAgICAgICAgKiBJZiAwLCBJbmZpbml0eSwgb3IgTmFOOiAwXG4gICAgICAgICAgICAgICAgICogSWYgcG9zaXRpdmUgbnVtYmVyOiBsaW1pdCA9IE1hdGguZmxvb3IobGltaXQpOyBpZiAobGltaXQgPiA0Mjk0OTY3Mjk1KSBsaW1pdCAtPSA0Mjk0OTY3Mjk2O1xuICAgICAgICAgICAgICAgICAqIElmIG5lZ2F0aXZlIG51bWJlcjogNDI5NDk2NzI5NiAtIE1hdGguZmxvb3IoTWF0aC5hYnMobGltaXQpKVxuICAgICAgICAgICAgICAgICAqIElmIG90aGVyOiBUeXBlLWNvbnZlcnQsIHRoZW4gdXNlIHRoZSBhYm92ZSBydWxlc1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHZhciBzcGxpdExpbWl0ID0gdHlwZW9mIGxpbWl0ID09PSAndW5kZWZpbmVkJyA/IG1heFNhZmUzMkJpdEludCA6IEVTLlRvVWludDMyKGxpbWl0KTtcbiAgICAgICAgICAgICAgICBtYXRjaCA9IHNlcGFyYXRvckNvcHkuZXhlYyhzdHJpbmcpO1xuICAgICAgICAgICAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBgc2VwYXJhdG9yQ29weS5sYXN0SW5kZXhgIGlzIG5vdCByZWxpYWJsZSBjcm9zcy1icm93c2VyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RJbmRleCA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdEluZGV4ID4gbGFzdExhc3RJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHVzaENhbGwob3V0cHV0LCBzdHJTbGljZShzdHJpbmcsIGxhc3RMYXN0SW5kZXgsIG1hdGNoLmluZGV4KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXggYnJvd3NlcnMgd2hvc2UgYGV4ZWNgIG1ldGhvZHMgZG9uJ3QgY29uc2lzdGVudGx5IHJldHVybiBgdW5kZWZpbmVkYCBmb3JcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vbnBhcnRpY2lwYXRpbmcgY2FwdHVyaW5nIGdyb3Vwc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb21wbGlhbnRFeGVjTnBjZyAmJiBtYXRjaC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tbG9vcC1mdW5jICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hbMF0ucmVwbGFjZShzZXBhcmF0b3IyLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aCAtIDI7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbaV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hbaV0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWxvb3AtZnVuYyAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoLmxlbmd0aCA+IDEgJiYgbWF0Y2guaW5kZXggPCBzdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXlfcHVzaC5hcHBseShvdXRwdXQsIGFycmF5U2xpY2UobWF0Y2gsIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RMZW5ndGggPSBtYXRjaFswXS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0TGFzdEluZGV4ID0gbGFzdEluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG91dHB1dC5sZW5ndGggPj0gc3BsaXRMaW1pdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXBhcmF0b3JDb3B5Lmxhc3RJbmRleCA9PT0gbWF0Y2guaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcGFyYXRvckNvcHkubGFzdEluZGV4Kys7IC8vIEF2b2lkIGFuIGluZmluaXRlIGxvb3BcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IHNlcGFyYXRvckNvcHkuZXhlYyhzdHJpbmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobGFzdExhc3RJbmRleCA9PT0gc3RyaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdExlbmd0aCB8fCAhc2VwYXJhdG9yQ29weS50ZXN0KCcnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHVzaENhbGwob3V0cHV0LCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwdXNoQ2FsbChvdXRwdXQsIHN0clNsaWNlKHN0cmluZywgbGFzdExhc3RJbmRleCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0cHV0Lmxlbmd0aCA+IHNwbGl0TGltaXQgPyBhcnJheVNsaWNlKG91dHB1dCwgMCwgc3BsaXRMaW1pdCkgOiBvdXRwdXQ7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KCkpO1xuXG4gICAgLy8gW2J1Z2ZpeCwgY2hyb21lXVxuICAgIC8vIElmIHNlcGFyYXRvciBpcyB1bmRlZmluZWQsIHRoZW4gdGhlIHJlc3VsdCBhcnJheSBjb250YWlucyBqdXN0IG9uZSBTdHJpbmcsXG4gICAgLy8gd2hpY2ggaXMgdGhlIHRoaXMgdmFsdWUgKGNvbnZlcnRlZCB0byBhIFN0cmluZykuIElmIGxpbWl0IGlzIG5vdCB1bmRlZmluZWQsXG4gICAgLy8gdGhlbiB0aGUgb3V0cHV0IGFycmF5IGlzIHRydW5jYXRlZCBzbyB0aGF0IGl0IGNvbnRhaW5zIG5vIG1vcmUgdGhhbiBsaW1pdFxuICAgIC8vIGVsZW1lbnRzLlxuICAgIC8vIFwiMFwiLnNwbGl0KHVuZGVmaW5lZCwgMCkgLT4gW11cbiAgICB9IGVsc2UgaWYgKCcwJy5zcGxpdCh2b2lkIDAsIDApLmxlbmd0aCkge1xuICAgICAgICBTdHJpbmdQcm90b3R5cGUuc3BsaXQgPSBmdW5jdGlvbiBzcGxpdChzZXBhcmF0b3IsIGxpbWl0KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHNlcGFyYXRvciA9PT0gJ3VuZGVmaW5lZCcgJiYgbGltaXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RyU3BsaXQodGhpcywgc2VwYXJhdG9yLCBsaW1pdCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIHN0cl9yZXBsYWNlID0gU3RyaW5nUHJvdG90eXBlLnJlcGxhY2U7XG4gICAgdmFyIHJlcGxhY2VSZXBvcnRzR3JvdXBzQ29ycmVjdGx5ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGdyb3VwcyA9IFtdO1xuICAgICAgICAneCcucmVwbGFjZSgveCguKT8vZywgZnVuY3Rpb24gKG1hdGNoLCBncm91cCkge1xuICAgICAgICAgICAgcHVzaENhbGwoZ3JvdXBzLCBncm91cCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZ3JvdXBzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgZ3JvdXBzWzBdID09PSAndW5kZWZpbmVkJztcbiAgICB9KCkpO1xuXG4gICAgaWYgKCFyZXBsYWNlUmVwb3J0c0dyb3Vwc0NvcnJlY3RseSkge1xuICAgICAgICBTdHJpbmdQcm90b3R5cGUucmVwbGFjZSA9IGZ1bmN0aW9uIHJlcGxhY2Uoc2VhcmNoVmFsdWUsIHJlcGxhY2VWYWx1ZSkge1xuICAgICAgICAgICAgdmFyIGlzRm4gPSBpc0NhbGxhYmxlKHJlcGxhY2VWYWx1ZSk7XG4gICAgICAgICAgICB2YXIgaGFzQ2FwdHVyaW5nR3JvdXBzID0gaXNSZWdleChzZWFyY2hWYWx1ZSkgJiYgKC9cXClbKj9dLykudGVzdChzZWFyY2hWYWx1ZS5zb3VyY2UpO1xuICAgICAgICAgICAgaWYgKCFpc0ZuIHx8ICFoYXNDYXB0dXJpbmdHcm91cHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyX3JlcGxhY2UuY2FsbCh0aGlzLCBzZWFyY2hWYWx1ZSwgcmVwbGFjZVZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHdyYXBwZWRSZXBsYWNlVmFsdWUgPSBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcmlnaW5hbExhc3RJbmRleCA9IHNlYXJjaFZhbHVlLmxhc3RJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoVmFsdWUubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBzZWFyY2hWYWx1ZS5leGVjKG1hdGNoKSB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoVmFsdWUubGFzdEluZGV4ID0gb3JpZ2luYWxMYXN0SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIHB1c2hDYWxsKGFyZ3MsIGFyZ3VtZW50c1tsZW5ndGggLSAyXSwgYXJndW1lbnRzW2xlbmd0aCAtIDFdKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcGxhY2VWYWx1ZS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHJfcmVwbGFjZS5jYWxsKHRoaXMsIHNlYXJjaFZhbHVlLCB3cmFwcGVkUmVwbGFjZVZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBFQ01BLTI2MiwgM3JkIEIuMi4zXG4gICAgLy8gTm90IGFuIEVDTUFTY3JpcHQgc3RhbmRhcmQsIGFsdGhvdWdoIEVDTUFTY3JpcHQgM3JkIEVkaXRpb24gaGFzIGFcbiAgICAvLyBub24tbm9ybWF0aXZlIHNlY3Rpb24gc3VnZ2VzdGluZyB1bmlmb3JtIHNlbWFudGljcyBhbmQgaXQgc2hvdWxkIGJlXG4gICAgLy8gbm9ybWFsaXplZCBhY3Jvc3MgYWxsIGJyb3dzZXJzXG4gICAgLy8gW2J1Z2ZpeCwgSUUgbHQgOV0gSUUgPCA5IHN1YnN0cigpIHdpdGggbmVnYXRpdmUgdmFsdWUgbm90IHdvcmtpbmcgaW4gSUVcbiAgICB2YXIgc3RyaW5nX3N1YnN0ciA9IFN0cmluZ1Byb3RvdHlwZS5zdWJzdHI7XG4gICAgdmFyIGhhc05lZ2F0aXZlU3Vic3RyQnVnID0gJycuc3Vic3RyICYmICcwYicuc3Vic3RyKC0xKSAhPT0gJ2InO1xuICAgIGRlZmluZVByb3BlcnRpZXMoU3RyaW5nUHJvdG90eXBlLCB7XG4gICAgICAgIHN1YnN0cjogZnVuY3Rpb24gc3Vic3RyKHN0YXJ0LCBsZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciBub3JtYWxpemVkU3RhcnQgPSBzdGFydDtcbiAgICAgICAgICAgIGlmIChzdGFydCA8IDApIHtcbiAgICAgICAgICAgICAgICBub3JtYWxpemVkU3RhcnQgPSBtYXgodGhpcy5sZW5ndGggKyBzdGFydCwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RyaW5nX3N1YnN0ci5jYWxsKHRoaXMsIG5vcm1hbGl6ZWRTdGFydCwgbGVuZ3RoKTtcbiAgICAgICAgfVxuICAgIH0sIGhhc05lZ2F0aXZlU3Vic3RyQnVnKTtcblxuICAgIC8vIEVTNSAxNS41LjQuMjBcbiAgICAvLyB3aGl0ZXNwYWNlIGZyb206IGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTUuNS40LjIwXG4gICAgdmFyIHdzID0gJ1xceDA5XFx4MEFcXHgwQlxceDBDXFx4MERcXHgyMFxceEEwXFx1MTY4MFxcdTE4MEVcXHUyMDAwXFx1MjAwMVxcdTIwMDJcXHUyMDAzJ1xuICAgICAgICArICdcXHUyMDA0XFx1MjAwNVxcdTIwMDZcXHUyMDA3XFx1MjAwOFxcdTIwMDlcXHUyMDBBXFx1MjAyRlxcdTIwNUZcXHUzMDAwXFx1MjAyOCdcbiAgICAgICAgKyAnXFx1MjAyOVxcdUZFRkYnO1xuICAgIHZhciB6ZXJvV2lkdGggPSAnXFx1MjAwYic7XG4gICAgdmFyIHdzUmVnZXhDaGFycyA9ICdbJyArIHdzICsgJ10nO1xuICAgIHZhciB0cmltQmVnaW5SZWdleHAgPSBuZXcgUmVnRXhwKCdeJyArIHdzUmVnZXhDaGFycyArIHdzUmVnZXhDaGFycyArICcqJyk7XG4gICAgdmFyIHRyaW1FbmRSZWdleHAgPSBuZXcgUmVnRXhwKHdzUmVnZXhDaGFycyArIHdzUmVnZXhDaGFycyArICcqJCcpO1xuICAgIHZhciBoYXNUcmltV2hpdGVzcGFjZUJ1ZyA9IFN0cmluZ1Byb3RvdHlwZS50cmltICYmICh3cy50cmltKCkgfHwgIXplcm9XaWR0aC50cmltKCkpO1xuICAgIGRlZmluZVByb3BlcnRpZXMoU3RyaW5nUHJvdG90eXBlLCB7XG4gICAgICAgIC8vIGh0dHA6Ly9ibG9nLnN0ZXZlbmxldml0aGFuLmNvbS9hcmNoaXZlcy9mYXN0ZXItdHJpbS1qYXZhc2NyaXB0XG4gICAgICAgIC8vIGh0dHA6Ly9wZXJmZWN0aW9ua2lsbHMuY29tL3doaXRlc3BhY2UtZGV2aWF0aW9ucy9cbiAgICAgICAgdHJpbTogZnVuY3Rpb24gdHJpbSgpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcyA9PT0gJ3VuZGVmaW5lZCcgfHwgdGhpcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW4ndCBjb252ZXJ0IFwiICsgdGhpcyArICcgdG8gb2JqZWN0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gJFN0cmluZyh0aGlzKS5yZXBsYWNlKHRyaW1CZWdpblJlZ2V4cCwgJycpLnJlcGxhY2UodHJpbUVuZFJlZ2V4cCwgJycpO1xuICAgICAgICB9XG4gICAgfSwgaGFzVHJpbVdoaXRlc3BhY2VCdWcpO1xuICAgIHZhciB0cmltID0gY2FsbC5iaW5kKFN0cmluZy5wcm90b3R5cGUudHJpbSk7XG5cbiAgICB2YXIgaGFzTGFzdEluZGV4QnVnID0gU3RyaW5nUHJvdG90eXBlLmxhc3RJbmRleE9mICYmICdhYmPjgYLjgYQnLmxhc3RJbmRleE9mKCfjgYLjgYQnLCAyKSAhPT0gLTE7XG4gICAgZGVmaW5lUHJvcGVydGllcyhTdHJpbmdQcm90b3R5cGUsIHtcbiAgICAgICAgbGFzdEluZGV4T2Y6IGZ1bmN0aW9uIGxhc3RJbmRleE9mKHNlYXJjaFN0cmluZykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzID09PSAndW5kZWZpbmVkJyB8fCB0aGlzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbid0IGNvbnZlcnQgXCIgKyB0aGlzICsgJyB0byBvYmplY3QnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBTID0gJFN0cmluZyh0aGlzKTtcbiAgICAgICAgICAgIHZhciBzZWFyY2hTdHIgPSAkU3RyaW5nKHNlYXJjaFN0cmluZyk7XG4gICAgICAgICAgICB2YXIgbnVtUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyAkTnVtYmVyKGFyZ3VtZW50c1sxXSkgOiBOYU47XG4gICAgICAgICAgICB2YXIgcG9zID0gaXNBY3R1YWxOYU4obnVtUG9zKSA/IEluZmluaXR5IDogRVMuVG9JbnRlZ2VyKG51bVBvcyk7XG4gICAgICAgICAgICB2YXIgc3RhcnQgPSBtaW4obWF4KHBvcywgMCksIFMubGVuZ3RoKTtcbiAgICAgICAgICAgIHZhciBzZWFyY2hMZW4gPSBzZWFyY2hTdHIubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIGsgPSBzdGFydCArIHNlYXJjaExlbjtcbiAgICAgICAgICAgIHdoaWxlIChrID4gMCkge1xuICAgICAgICAgICAgICAgIGsgPSBtYXgoMCwgayAtIHNlYXJjaExlbik7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gc3RySW5kZXhPZihzdHJTbGljZShTLCBrLCBzdGFydCArIHNlYXJjaExlbiksIHNlYXJjaFN0cik7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gayArIGluZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgIH0sIGhhc0xhc3RJbmRleEJ1Zyk7XG5cbiAgICB2YXIgb3JpZ2luYWxMYXN0SW5kZXhPZiA9IFN0cmluZ1Byb3RvdHlwZS5sYXN0SW5kZXhPZjtcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKFN0cmluZ1Byb3RvdHlwZSwge1xuICAgICAgICBsYXN0SW5kZXhPZjogZnVuY3Rpb24gbGFzdEluZGV4T2Yoc2VhcmNoU3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxMYXN0SW5kZXhPZi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgfSwgU3RyaW5nUHJvdG90eXBlLmxhc3RJbmRleE9mLmxlbmd0aCAhPT0gMSk7XG5cbiAgICAvLyBFUy01IDE1LjEuMi4yXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJhZGl4XG4gICAgaWYgKHBhcnNlSW50KHdzICsgJzA4JykgIT09IDggfHwgcGFyc2VJbnQod3MgKyAnMHgxNicpICE9PSAyMikge1xuICAgICAgICAvKiBnbG9iYWwgcGFyc2VJbnQ6IHRydWUgKi9cbiAgICAgICAgcGFyc2VJbnQgPSAoZnVuY3Rpb24gKG9yaWdQYXJzZUludCkge1xuICAgICAgICAgICAgdmFyIGhleFJlZ2V4ID0gL15bLStdPzBbeFhdLztcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBwYXJzZUludChzdHIsIHJhZGl4KSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzdHIgPT09ICdzeW1ib2wnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGhhbmRsZSBTeW1ib2xzIGluIG5vZGUgOC4zLzguNFxuICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8taW1wbGljaXQtY29lcmNpb24sIG5vLXVudXNlZC1leHByZXNzaW9uc1xuICAgICAgICAgICAgICAgICAgICAnJyArIHN0cjsgLy8ganNjczppZ25vcmUgZGlzYWxsb3dJbXBsaWNpdFR5cGVDb252ZXJzaW9uXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHN0cmluZyA9IHRyaW0oU3RyaW5nKHN0cikpO1xuICAgICAgICAgICAgICAgIHZhciBkZWZhdWx0ZWRSYWRpeCA9ICROdW1iZXIocmFkaXgpIHx8IChoZXhSZWdleC50ZXN0KHN0cmluZykgPyAxNiA6IDEwKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ1BhcnNlSW50KHN0cmluZywgZGVmYXVsdGVkUmFkaXgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfShwYXJzZUludCkpO1xuICAgIH1cblxuICAgIC8vIGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDE1LjEuMi4zXG4gICAgaWYgKDEgLyBwYXJzZUZsb2F0KCctMCcpICE9PSAtSW5maW5pdHkpIHtcbiAgICAgICAgLyogZ2xvYmFsIHBhcnNlRmxvYXQ6IHRydWUgKi9cbiAgICAgICAgcGFyc2VGbG9hdCA9IChmdW5jdGlvbiAob3JpZ1BhcnNlRmxvYXQpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBwYXJzZUZsb2F0KHN0cmluZykge1xuICAgICAgICAgICAgICAgIHZhciBpbnB1dFN0cmluZyA9IHRyaW0oU3RyaW5nKHN0cmluZykpO1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBvcmlnUGFyc2VGbG9hdChpbnB1dFN0cmluZyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCA9PT0gMCAmJiBzdHJTbGljZShpbnB1dFN0cmluZywgMCwgMSkgPT09ICctJyA/IC0wIDogcmVzdWx0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfShwYXJzZUZsb2F0KSk7XG4gICAgfVxuXG4gICAgaWYgKFN0cmluZyhuZXcgUmFuZ2VFcnJvcigndGVzdCcpKSAhPT0gJ1JhbmdlRXJyb3I6IHRlc3QnKSB7XG4gICAgICAgIHZhciBlcnJvclRvU3RyaW5nU2hpbSA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzID09PSAndW5kZWZpbmVkJyB8fCB0aGlzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbid0IGNvbnZlcnQgXCIgKyB0aGlzICsgJyB0byBvYmplY3QnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBuYW1lID0gdGhpcy5uYW1lO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIG5hbWUgPSAnRXJyb3InO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBuYW1lID0gJFN0cmluZyhuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBtc2cgPSB0aGlzLm1lc3NhZ2U7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG1zZyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBtc2cgPSAnJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG1zZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBtc2cgPSAkU3RyaW5nKG1zZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbXNnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFtc2cpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuYW1lICsgJzogJyArIG1zZztcbiAgICAgICAgfTtcbiAgICAgICAgLy8gY2FuJ3QgdXNlIGRlZmluZVByb3BlcnRpZXMgaGVyZSBiZWNhdXNlIG9mIHRvU3RyaW5nIGVudW1lcmF0aW9uIGlzc3VlIGluIElFIDw9IDhcbiAgICAgICAgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nID0gZXJyb3JUb1N0cmluZ1NoaW07XG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnRzRGVzY3JpcHRvcnMpIHtcbiAgICAgICAgdmFyIGVuc3VyZU5vbkVudW1lcmFibGUgPSBmdW5jdGlvbiAob2JqLCBwcm9wKSB7XG4gICAgICAgICAgICBpZiAoaXNFbnVtKG9iaiwgcHJvcCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBwcm9wKTtcbiAgICAgICAgICAgICAgICBpZiAoZGVzYy5jb25maWd1cmFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzYy5lbnVtZXJhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIGRlc2MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgZW5zdXJlTm9uRW51bWVyYWJsZShFcnJvci5wcm90b3R5cGUsICdtZXNzYWdlJyk7XG4gICAgICAgIGlmIChFcnJvci5wcm90b3R5cGUubWVzc2FnZSAhPT0gJycpIHtcbiAgICAgICAgICAgIEVycm9yLnByb3RvdHlwZS5tZXNzYWdlID0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgZW5zdXJlTm9uRW51bWVyYWJsZShFcnJvci5wcm90b3R5cGUsICduYW1lJyk7XG4gICAgfVxuXG4gICAgaWYgKFN0cmluZygvYS9taWcpICE9PSAnL2EvZ2ltJykge1xuICAgICAgICB2YXIgcmVnZXhUb1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgICAgICAgdmFyIHN0ciA9ICcvJyArIHRoaXMuc291cmNlICsgJy8nO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2xvYmFsKSB7XG4gICAgICAgICAgICAgICAgc3RyICs9ICdnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlnbm9yZUNhc2UpIHtcbiAgICAgICAgICAgICAgICBzdHIgKz0gJ2knO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMubXVsdGlsaW5lKSB7XG4gICAgICAgICAgICAgICAgc3RyICs9ICdtJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgIH07XG4gICAgICAgIC8vIGNhbid0IHVzZSBkZWZpbmVQcm9wZXJ0aWVzIGhlcmUgYmVjYXVzZSBvZiB0b1N0cmluZyBlbnVtZXJhdGlvbiBpc3N1ZSBpbiBJRSA8PSA4XG4gICAgICAgIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcgPSByZWdleFRvU3RyaW5nO1xuICAgIH1cbn0pKTtcbiIsIi8qIVxuICogaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltXG4gKiBAbGljZW5zZSBlczUtc2hpbSBDb3B5cmlnaHQgMjAwOS0yMDE1IGJ5IGNvbnRyaWJ1dG9ycywgTUlUIExpY2Vuc2VcbiAqIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW0vYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cbi8vIHZpbTogdHM9NCBzdHM9NCBzdz00IGV4cGFuZHRhYlxuXG4vLyBBZGQgc2VtaWNvbG9uIHRvIHByZXZlbnQgSUlGRSBmcm9tIGJlaW5nIHBhc3NlZCBhcyBhcmd1bWVudCB0byBjb25jYXRlbmF0ZWQgY29kZS5cbjtcblxuLy8gVU1EIChVbml2ZXJzYWwgTW9kdWxlIERlZmluaXRpb24pXG4vLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3VtZGpzL3VtZC9ibG9iL21hc3Rlci90ZW1wbGF0ZXMvcmV0dXJuRXhwb3J0cy5qc1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyogZ2xvYmFsIGRlZmluZSwgZXhwb3J0cywgbW9kdWxlICovXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgICAgIGRlZmluZShmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcbiAgICAgICAgLy8gb25seSBDb21tb25KUy1saWtlIGVudmlyb21lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cyxcbiAgICAgICAgLy8gbGlrZSBOb2RlLlxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBCcm93c2VyIGdsb2JhbHMgKHJvb3QgaXMgd2luZG93KVxuICAgICAgICByb290LnJldHVybkV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgY2FsbCA9IEZ1bmN0aW9uLmNhbGw7XG4gICAgdmFyIHByb3RvdHlwZU9mT2JqZWN0ID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgICB2YXIgb3ducyA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5oYXNPd25Qcm9wZXJ0eSk7XG4gICAgdmFyIGlzRW51bWVyYWJsZSA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5wcm9wZXJ0eUlzRW51bWVyYWJsZSk7XG4gICAgdmFyIHRvU3RyID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0LnRvU3RyaW5nKTtcblxuICAgIC8vIElmIEpTIGVuZ2luZSBzdXBwb3J0cyBhY2Nlc3NvcnMgY3JlYXRpbmcgc2hvcnRjdXRzLlxuICAgIHZhciBkZWZpbmVHZXR0ZXI7XG4gICAgdmFyIGRlZmluZVNldHRlcjtcbiAgICB2YXIgbG9va3VwR2V0dGVyO1xuICAgIHZhciBsb29rdXBTZXR0ZXI7XG4gICAgdmFyIHN1cHBvcnRzQWNjZXNzb3JzID0gb3ducyhwcm90b3R5cGVPZk9iamVjdCwgJ19fZGVmaW5lR2V0dGVyX18nKTtcbiAgICBpZiAoc3VwcG9ydHNBY2Nlc3NvcnMpIHtcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZXJzY29yZS1kYW5nbGUsIG5vLXJlc3RyaWN0ZWQtcHJvcGVydGllcyAqL1xuICAgICAgICBkZWZpbmVHZXR0ZXIgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuX19kZWZpbmVHZXR0ZXJfXyk7XG4gICAgICAgIGRlZmluZVNldHRlciA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5fX2RlZmluZVNldHRlcl9fKTtcbiAgICAgICAgbG9va3VwR2V0dGVyID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0Ll9fbG9va3VwR2V0dGVyX18pO1xuICAgICAgICBsb29rdXBTZXR0ZXIgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuX19sb29rdXBTZXR0ZXJfXyk7XG4gICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW5kZXJzY29yZS1kYW5nbGUsIG5vLXJlc3RyaWN0ZWQtcHJvcGVydGllcyAqL1xuICAgIH1cblxuICAgIHZhciBpc1ByaW1pdGl2ZSA9IGZ1bmN0aW9uIGlzUHJpbWl0aXZlKG8pIHtcbiAgICAgICAgcmV0dXJuIG8gPT0gbnVsbCB8fCAodHlwZW9mIG8gIT09ICdvYmplY3QnICYmIHR5cGVvZiBvICE9PSAnZnVuY3Rpb24nKTtcbiAgICB9O1xuXG4gICAgLy8gRVM1IDE1LjIuMy4yXG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjJcbiAgICBpZiAoIU9iamVjdC5nZXRQcm90b3R5cGVPZikge1xuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW0vaXNzdWVzI2lzc3VlLzJcbiAgICAgICAgLy8gaHR0cDovL2Vqb2huLm9yZy9ibG9nL29iamVjdGdldHByb3RvdHlwZW9mL1xuICAgICAgICAvLyByZWNvbW1lbmRlZCBieSBmc2NoYWVmZXIgb24gZ2l0aHViXG4gICAgICAgIC8vXG4gICAgICAgIC8vIHN1cmUsIGFuZCB3ZWJyZWZsZWN0aW9uIHNheXMgXl9eXG4gICAgICAgIC8vIC4uLiB0aGlzIHdpbGwgbmVyZXZlciBwb3NzaWJseSByZXR1cm4gbnVsbFxuICAgICAgICAvLyAuLi4gT3BlcmEgTWluaSBicmVha3MgaGVyZSB3aXRoIGluZmluaXRlIGxvb3BzXG4gICAgICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZiA9IGZ1bmN0aW9uIGdldFByb3RvdHlwZU9mKG9iamVjdCkge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvXG4gICAgICAgICAgICB2YXIgcHJvdG8gPSBvYmplY3QuX19wcm90b19fO1xuICAgICAgICAgICAgaWYgKHByb3RvIHx8IHByb3RvID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3RvO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0b1N0cihvYmplY3QuY29uc3RydWN0b3IpID09PSAnW29iamVjdCBGdW5jdGlvbl0nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdC5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9iamVjdCBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm90b3R5cGVPZk9iamVjdDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gQ29ycmVjdGx5IHJldHVybiBudWxsIGZvciBPYmplY3RzIGNyZWF0ZWQgd2l0aCBgT2JqZWN0LmNyZWF0ZShudWxsKWBcbiAgICAgICAgICAgICAgICAvLyAoc2hhbW1lZCBvciBuYXRpdmUpIG9yIGB7IF9fcHJvdG9fXzogbnVsbH1gLiAgQWxzbyByZXR1cm5zIG51bGwgZm9yXG4gICAgICAgICAgICAgICAgLy8gY3Jvc3MtcmVhbG0gb2JqZWN0cyBvbiBicm93c2VycyB0aGF0IGxhY2sgYF9fcHJvdG9fX2Agc3VwcG9ydCAobGlrZVxuICAgICAgICAgICAgICAgIC8vIElFIDwxMSksIGJ1dCB0aGF0J3MgdGhlIGJlc3Qgd2UgY2FuIGRvLlxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIEVTNSAxNS4yLjMuM1xuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy4zXG5cbiAgICB2YXIgZG9lc0dldE93blByb3BlcnR5RGVzY3JpcHRvcldvcmsgPSBmdW5jdGlvbiBkb2VzR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yV29yayhvYmplY3QpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIG9iamVjdC5zZW50aW5lbCA9IDA7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsICdzZW50aW5lbCcpLnZhbHVlID09PSAwO1xuICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBjaGVjayB3aGV0aGVyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciB3b3JrcyBpZiBpdCdzIGdpdmVuLiBPdGhlcndpc2UsIHNoaW0gcGFydGlhbGx5LlxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHtcbiAgICAgICAgdmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvcldvcmtzT25PYmplY3QgPSBkb2VzR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yV29yayh7fSk7XG4gICAgICAgIHZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JXb3Jrc09uRG9tID0gdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgfHwgZG9lc0dldE93blByb3BlcnR5RGVzY3JpcHRvcldvcmsoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xuICAgICAgICBpZiAoIWdldE93blByb3BlcnR5RGVzY3JpcHRvcldvcmtzT25Eb20gfHwgIWdldE93blByb3BlcnR5RGVzY3JpcHRvcldvcmtzT25PYmplY3QpIHtcbiAgICAgICAgICAgIHZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JGYWxsYmFjayA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgfHwgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yRmFsbGJhY2spIHtcbiAgICAgICAgdmFyIEVSUl9OT05fT0JKRUNUID0gJ09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgY2FsbGVkIG9uIGEgbm9uLW9iamVjdDogJztcblxuICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICAgICAgICAgIGlmIChpc1ByaW1pdGl2ZShvYmplY3QpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfTk9OX09CSkVDVCArIG9iamVjdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG1ha2UgYSB2YWxpYW50IGF0dGVtcHQgdG8gdXNlIHRoZSByZWFsIGdldE93blByb3BlcnR5RGVzY3JpcHRvclxuICAgICAgICAgICAgLy8gZm9yIEk4J3MgRE9NIGVsZW1lbnRzLlxuICAgICAgICAgICAgaWYgKGdldE93blByb3BlcnR5RGVzY3JpcHRvckZhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldE93blByb3BlcnR5RGVzY3JpcHRvckZhbGxiYWNrLmNhbGwoT2JqZWN0LCBvYmplY3QsIHByb3BlcnR5KTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdHJ5IHRoZSBzaGltIGlmIHRoZSByZWFsIG9uZSBkb2Vzbid0IHdvcmtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBkZXNjcmlwdG9yO1xuXG4gICAgICAgICAgICAvLyBJZiBvYmplY3QgZG9lcyBub3Qgb3ducyBwcm9wZXJ0eSByZXR1cm4gdW5kZWZpbmVkIGltbWVkaWF0ZWx5LlxuICAgICAgICAgICAgaWYgKCFvd25zKG9iamVjdCwgcHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIG9iamVjdCBoYXMgYSBwcm9wZXJ0eSB0aGVuIGl0J3MgZm9yIHN1cmUgYGNvbmZpZ3VyYWJsZWAsIGFuZFxuICAgICAgICAgICAgLy8gcHJvYmFibHkgYGVudW1lcmFibGVgLiBEZXRlY3QgZW51bWVyYWJpbGl0eSB0aG91Z2guXG4gICAgICAgICAgICBkZXNjcmlwdG9yID0ge1xuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGlzRW51bWVyYWJsZShvYmplY3QsIHByb3BlcnR5KSxcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIElmIEpTIGVuZ2luZSBzdXBwb3J0cyBhY2Nlc3NvciBwcm9wZXJ0aWVzIHRoZW4gcHJvcGVydHkgbWF5IGJlIGFcbiAgICAgICAgICAgIC8vIGdldHRlciBvciBzZXR0ZXIuXG4gICAgICAgICAgICBpZiAoc3VwcG9ydHNBY2Nlc3NvcnMpIHtcbiAgICAgICAgICAgICAgICAvLyBVbmZvcnR1bmF0ZWx5IGBfX2xvb2t1cEdldHRlcl9fYCB3aWxsIHJldHVybiBhIGdldHRlciBldmVuXG4gICAgICAgICAgICAgICAgLy8gaWYgb2JqZWN0IGhhcyBvd24gbm9uIGdldHRlciBwcm9wZXJ0eSBhbG9uZyB3aXRoIGEgc2FtZSBuYW1lZFxuICAgICAgICAgICAgICAgIC8vIGluaGVyaXRlZCBnZXR0ZXIuIFRvIGF2b2lkIG1pc2JlaGF2aW9yIHdlIHRlbXBvcmFyeSByZW1vdmVcbiAgICAgICAgICAgICAgICAvLyBgX19wcm90b19fYCBzbyB0aGF0IGBfX2xvb2t1cEdldHRlcl9fYCB3aWxsIHJldHVybiBnZXR0ZXIgb25seVxuICAgICAgICAgICAgICAgIC8vIGlmIGl0J3Mgb3duZWQgYnkgYW4gb2JqZWN0LlxuICAgICAgICAgICAgICAgIHZhciBwcm90b3R5cGUgPSBvYmplY3QuX19wcm90b19fO1xuICAgICAgICAgICAgICAgIHZhciBub3RQcm90b3R5cGVPZk9iamVjdCA9IG9iamVjdCAhPT0gcHJvdG90eXBlT2ZPYmplY3Q7XG4gICAgICAgICAgICAgICAgLy8gYXZvaWQgcmVjdXJzaW9uIHByb2JsZW0sIGJyZWFraW5nIGluIE9wZXJhIE1pbmkgd2hlblxuICAgICAgICAgICAgICAgIC8vIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoT2JqZWN0LnByb3RvdHlwZSwgJ3RvU3RyaW5nJylcbiAgICAgICAgICAgICAgICAvLyBvciBhbnkgb3RoZXIgT2JqZWN0LnByb3RvdHlwZSBhY2Nlc3NvclxuICAgICAgICAgICAgICAgIGlmIChub3RQcm90b3R5cGVPZk9iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICBvYmplY3QuX19wcm90b19fID0gcHJvdG90eXBlT2ZPYmplY3Q7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGdldHRlciA9IGxvb2t1cEdldHRlcihvYmplY3QsIHByb3BlcnR5KTtcbiAgICAgICAgICAgICAgICB2YXIgc2V0dGVyID0gbG9va3VwU2V0dGVyKG9iamVjdCwgcHJvcGVydHkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5vdFByb3RvdHlwZU9mT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE9uY2Ugd2UgaGF2ZSBnZXR0ZXIgYW5kIHNldHRlciB3ZSBjYW4gcHV0IHZhbHVlcyBiYWNrLlxuICAgICAgICAgICAgICAgICAgICBvYmplY3QuX19wcm90b19fID0gcHJvdG90eXBlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChnZXR0ZXIgfHwgc2V0dGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChnZXR0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0b3IuZ2V0ID0gZ2V0dGVyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXR0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0b3Iuc2V0ID0gc2V0dGVyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGl0IHdhcyBhY2Nlc3NvciBwcm9wZXJ0eSB3ZSdyZSBkb25lIGFuZCByZXR1cm4gaGVyZVxuICAgICAgICAgICAgICAgICAgICAvLyBpbiBvcmRlciB0byBhdm9pZCBhZGRpbmcgYHZhbHVlYCB0byB0aGUgZGVzY3JpcHRvci5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiB3ZSBnb3QgdGhpcyBmYXIgd2Uga25vdyB0aGF0IG9iamVjdCBoYXMgYW4gb3duIHByb3BlcnR5IHRoYXQgaXNcbiAgICAgICAgICAgIC8vIG5vdCBhbiBhY2Nlc3NvciBzbyB3ZSBzZXQgaXQgYXMgYSB2YWx1ZSBhbmQgcmV0dXJuIGRlc2NyaXB0b3IuXG4gICAgICAgICAgICBkZXNjcmlwdG9yLnZhbHVlID0gb2JqZWN0W3Byb3BlcnR5XTtcbiAgICAgICAgICAgIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gICAgICAgIH07XG4gICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tcHJvdG8gKi9cbiAgICB9XG5cbiAgICAvLyBFUzUgMTUuMi4zLjRcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuNFxuICAgIGlmICghT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMpIHtcbiAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iamVjdCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRVM1IDE1LjIuMy41XG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjVcbiAgICBpZiAoIU9iamVjdC5jcmVhdGUpIHtcblxuICAgICAgICAvLyBDb250cmlidXRlZCBieSBCcmFuZG9uIEJlbnZpZSwgT2N0b2JlciwgMjAxMlxuICAgICAgICB2YXIgY3JlYXRlRW1wdHk7XG4gICAgICAgIHZhciBzdXBwb3J0c1Byb3RvID0gISh7IF9fcHJvdG9fXzogbnVsbCB9IGluc3RhbmNlb2YgT2JqZWN0KTtcbiAgICAgICAgLy8gdGhlIGZvbGxvd2luZyBwcm9kdWNlcyBmYWxzZSBwb3NpdGl2ZXNcbiAgICAgICAgLy8gaW4gT3BlcmEgTWluaSA9PiBub3QgYSByZWxpYWJsZSBjaGVja1xuICAgICAgICAvLyBPYmplY3QucHJvdG90eXBlLl9fcHJvdG9fXyA9PT0gbnVsbFxuXG4gICAgICAgIC8vIENoZWNrIGZvciBkb2N1bWVudC5kb21haW4gYW5kIGFjdGl2ZSB4IHN1cHBvcnRcbiAgICAgICAgLy8gTm8gbmVlZCB0byB1c2UgYWN0aXZlIHggYXBwcm9hY2ggd2hlbiBkb2N1bWVudC5kb21haW4gaXMgbm90IHNldFxuICAgICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltL2lzc3Vlcy8xNTBcbiAgICAgICAgLy8gdmFyaWF0aW9uIG9mIGh0dHBzOi8vZ2l0aHViLmNvbS9raXRjYW1icmlkZ2UvZXM1LXNoaW0vY29tbWl0LzRmNzM4YWMwNjYzNDZcbiAgICAgICAgLyogZ2xvYmFsIEFjdGl2ZVhPYmplY3QgKi9cbiAgICAgICAgdmFyIHNob3VsZFVzZUFjdGl2ZVggPSBmdW5jdGlvbiBzaG91bGRVc2VBY3RpdmVYKCkge1xuICAgICAgICAgICAgLy8gcmV0dXJuIGVhcmx5IGlmIGRvY3VtZW50LmRvbWFpbiBub3Qgc2V0XG4gICAgICAgICAgICBpZiAoIWRvY3VtZW50LmRvbWFpbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFuZXcgQWN0aXZlWE9iamVjdCgnaHRtbGZpbGUnKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBUaGlzIHN1cHBvcnRzIElFOCB3aGVuIGRvY3VtZW50LmRvbWFpbiBpcyB1c2VkXG4gICAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW0vaXNzdWVzLzE1MFxuICAgICAgICAvLyB2YXJpYXRpb24gb2YgaHR0cHM6Ly9naXRodWIuY29tL2tpdGNhbWJyaWRnZS9lczUtc2hpbS9jb21taXQvNGY3MzhhYzA2NjM0NlxuICAgICAgICB2YXIgZ2V0RW1wdHlWaWFBY3RpdmVYID0gZnVuY3Rpb24gZ2V0RW1wdHlWaWFBY3RpdmVYKCkge1xuICAgICAgICAgICAgdmFyIGVtcHR5O1xuICAgICAgICAgICAgdmFyIHhEb2M7XG5cbiAgICAgICAgICAgIHhEb2MgPSBuZXcgQWN0aXZlWE9iamVjdCgnaHRtbGZpbGUnKTtcblxuICAgICAgICAgICAgdmFyIHNjcmlwdCA9ICdzY3JpcHQnO1xuICAgICAgICAgICAgeERvYy53cml0ZSgnPCcgKyBzY3JpcHQgKyAnPjwvJyArIHNjcmlwdCArICc+Jyk7XG4gICAgICAgICAgICB4RG9jLmNsb3NlKCk7XG5cbiAgICAgICAgICAgIGVtcHR5ID0geERvYy5wYXJlbnRXaW5kb3cuT2JqZWN0LnByb3RvdHlwZTtcbiAgICAgICAgICAgIHhEb2MgPSBudWxsO1xuXG4gICAgICAgICAgICByZXR1cm4gZW1wdHk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gVGhlIG9yaWdpbmFsIGltcGxlbWVudGF0aW9uIHVzaW5nIGFuIGlmcmFtZVxuICAgICAgICAvLyBiZWZvcmUgdGhlIGFjdGl2ZXggYXBwcm9hY2ggd2FzIGFkZGVkXG4gICAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW0vaXNzdWVzLzE1MFxuICAgICAgICB2YXIgZ2V0RW1wdHlWaWFJRnJhbWUgPSBmdW5jdGlvbiBnZXRFbXB0eVZpYUlGcmFtZSgpIHtcbiAgICAgICAgICAgIHZhciBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBkb2N1bWVudC5ib2R5IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgICAgIHZhciBlbXB0eTtcblxuICAgICAgICAgICAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zY3JpcHQtdXJsXG4gICAgICAgICAgICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JztcblxuICAgICAgICAgICAgZW1wdHkgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3QucHJvdG90eXBlO1xuICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gICAgICAgICAgICBpZnJhbWUgPSBudWxsO1xuXG4gICAgICAgICAgICByZXR1cm4gZW1wdHk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogZ2xvYmFsIGRvY3VtZW50ICovXG4gICAgICAgIGlmIChzdXBwb3J0c1Byb3RvIHx8IHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGNyZWF0ZUVtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IF9fcHJvdG9fXzogbnVsbCB9O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEluIG9sZCBJRSBfX3Byb3RvX18gY2FuJ3QgYmUgdXNlZCB0byBtYW51YWxseSBzZXQgYG51bGxgLCBub3IgZG9lc1xuICAgICAgICAgICAgLy8gYW55IG90aGVyIG1ldGhvZCBleGlzdCB0byBtYWtlIGFuIG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gbm90aGluZyxcbiAgICAgICAgICAgIC8vIGFzaWRlIGZyb20gT2JqZWN0LnByb3RvdHlwZSBpdHNlbGYuIEluc3RlYWQsIGNyZWF0ZSBhIG5ldyBnbG9iYWxcbiAgICAgICAgICAgIC8vIG9iamVjdCBhbmQgKnN0ZWFsKiBpdHMgT2JqZWN0LnByb3RvdHlwZSBhbmQgc3RyaXAgaXQgYmFyZS4gVGhpcyBpc1xuICAgICAgICAgICAgLy8gdXNlZCBhcyB0aGUgcHJvdG90eXBlIHRvIGNyZWF0ZSBudWxsYXJ5IG9iamVjdHMuXG4gICAgICAgICAgICBjcmVhdGVFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyBEZXRlcm1pbmUgd2hpY2ggYXBwcm9hY2ggdG8gdXNlXG4gICAgICAgICAgICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczUtc2hpbS9pc3N1ZXMvMTUwXG4gICAgICAgICAgICAgICAgdmFyIGVtcHR5ID0gc2hvdWxkVXNlQWN0aXZlWCgpID8gZ2V0RW1wdHlWaWFBY3RpdmVYKCkgOiBnZXRFbXB0eVZpYUlGcmFtZSgpO1xuXG4gICAgICAgICAgICAgICAgZGVsZXRlIGVtcHR5LmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBlbXB0eS5oYXNPd25Qcm9wZXJ0eTtcbiAgICAgICAgICAgICAgICBkZWxldGUgZW1wdHkucHJvcGVydHlJc0VudW1lcmFibGU7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGVtcHR5LmlzUHJvdG90eXBlT2Y7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGVtcHR5LnRvTG9jYWxlU3RyaW5nO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBlbXB0eS50b1N0cmluZztcbiAgICAgICAgICAgICAgICBkZWxldGUgZW1wdHkudmFsdWVPZjtcblxuICAgICAgICAgICAgICAgIHZhciBFbXB0eSA9IGZ1bmN0aW9uIEVtcHR5KCkge307XG4gICAgICAgICAgICAgICAgRW1wdHkucHJvdG90eXBlID0gZW1wdHk7XG4gICAgICAgICAgICAgICAgLy8gc2hvcnQtY2lyY3VpdCBmdXR1cmUgY2FsbHNcbiAgICAgICAgICAgICAgICBjcmVhdGVFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFbXB0eSgpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFbXB0eSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUocHJvdG90eXBlLCBwcm9wZXJ0aWVzKSB7XG5cbiAgICAgICAgICAgIHZhciBvYmplY3Q7XG4gICAgICAgICAgICB2YXIgVHlwZSA9IGZ1bmN0aW9uIFR5cGUoKSB7fTsgLy8gQW4gZW1wdHkgY29uc3RydWN0b3IuXG5cbiAgICAgICAgICAgIGlmIChwcm90b3R5cGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBvYmplY3QgPSBjcmVhdGVFbXB0eSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvdG90eXBlICE9PSBudWxsICYmIGlzUHJpbWl0aXZlKHByb3RvdHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSW4gdGhlIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbiBgcGFyZW50YCBjYW4gYmUgYG51bGxgXG4gICAgICAgICAgICAgICAgICAgIC8vIE9SICphbnkqIGBpbnN0YW5jZW9mIE9iamVjdGAgIChPYmplY3R8RnVuY3Rpb258QXJyYXl8UmVnRXhwfGV0YylcbiAgICAgICAgICAgICAgICAgICAgLy8gVXNlIGB0eXBlb2ZgIHRobywgYi9jIGluIG9sZCBJRSwgRE9NIGVsZW1lbnRzIGFyZSBub3QgYGluc3RhbmNlb2YgT2JqZWN0YFxuICAgICAgICAgICAgICAgICAgICAvLyBsaWtlIHRoZXkgYXJlIGluIG1vZGVybiBicm93c2Vycy4gVXNpbmcgYE9iamVjdC5jcmVhdGVgIG9uIERPTSBlbGVtZW50c1xuICAgICAgICAgICAgICAgICAgICAvLyBpcy4uLmVyci4uLnByb2JhYmx5IGluYXBwcm9wcmlhdGUsIGJ1dCB0aGUgbmF0aXZlIHZlcnNpb24gYWxsb3dzIGZvciBpdC5cbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0IHByb3RvdHlwZSBtYXkgb25seSBiZSBhbiBPYmplY3Qgb3IgbnVsbCcpOyAvLyBzYW1lIG1zZyBhcyBDaHJvbWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgVHlwZS5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG4gICAgICAgICAgICAgICAgb2JqZWN0ID0gbmV3IFR5cGUoKTtcbiAgICAgICAgICAgICAgICAvLyBJRSBoYXMgbm8gYnVpbHQtaW4gaW1wbGVtZW50YXRpb24gb2YgYE9iamVjdC5nZXRQcm90b3R5cGVPZmBcbiAgICAgICAgICAgICAgICAvLyBuZWl0aGVyIGBfX3Byb3RvX19gLCBidXQgdGhpcyBtYW51YWxseSBzZXR0aW5nIGBfX3Byb3RvX19gIHdpbGxcbiAgICAgICAgICAgICAgICAvLyBndWFyYW50ZWUgdGhhdCBgT2JqZWN0LmdldFByb3RvdHlwZU9mYCB3aWxsIHdvcmsgYXMgZXhwZWN0ZWQgd2l0aFxuICAgICAgICAgICAgICAgIC8vIG9iamVjdHMgY3JlYXRlZCB1c2luZyBgT2JqZWN0LmNyZWF0ZWBcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG9cbiAgICAgICAgICAgICAgICBvYmplY3QuX19wcm90b19fID0gcHJvdG90eXBlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocHJvcGVydGllcyAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMob2JqZWN0LCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBFUzUgMTUuMi4zLjZcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuNlxuXG4gICAgLy8gUGF0Y2ggZm9yIFdlYktpdCBhbmQgSUU4IHN0YW5kYXJkIG1vZGVcbiAgICAvLyBEZXNpZ25lZCBieSBoYXggPGhheC5naXRodWIuY29tPlxuICAgIC8vIHJlbGF0ZWQgaXNzdWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczUtc2hpbS9pc3N1ZXMjaXNzdWUvNVxuICAgIC8vIElFOCBSZWZlcmVuY2U6XG4gICAgLy8gICAgIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9kZDI4MjkwMC5hc3B4XG4gICAgLy8gICAgIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9kZDIyOTkxNi5hc3B4XG4gICAgLy8gV2ViS2l0IEJ1Z3M6XG4gICAgLy8gICAgIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0zNjQyM1xuXG4gICAgdmFyIGRvZXNEZWZpbmVQcm9wZXJ0eVdvcmsgPSBmdW5jdGlvbiBkb2VzRGVmaW5lUHJvcGVydHlXb3JrKG9iamVjdCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ3NlbnRpbmVsJywge30pO1xuICAgICAgICAgICAgcmV0dXJuICdzZW50aW5lbCcgaW4gb2JqZWN0O1xuICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBjaGVjayB3aGV0aGVyIGRlZmluZVByb3BlcnR5IHdvcmtzIGlmIGl0J3MgZ2l2ZW4uIE90aGVyd2lzZSxcbiAgICAvLyBzaGltIHBhcnRpYWxseS5cbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7XG4gICAgICAgIHZhciBkZWZpbmVQcm9wZXJ0eVdvcmtzT25PYmplY3QgPSBkb2VzRGVmaW5lUHJvcGVydHlXb3JrKHt9KTtcbiAgICAgICAgdmFyIGRlZmluZVByb3BlcnR5V29ya3NPbkRvbSA9IHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgIHx8IGRvZXNEZWZpbmVQcm9wZXJ0eVdvcmsoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xuICAgICAgICBpZiAoIWRlZmluZVByb3BlcnR5V29ya3NPbk9iamVjdCB8fCAhZGVmaW5lUHJvcGVydHlXb3Jrc09uRG9tKSB7XG4gICAgICAgICAgICB2YXIgZGVmaW5lUHJvcGVydHlGYWxsYmFjayA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICBkZWZpbmVQcm9wZXJ0aWVzRmFsbGJhY2sgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghT2JqZWN0LmRlZmluZVByb3BlcnR5IHx8IGRlZmluZVByb3BlcnR5RmFsbGJhY2spIHtcbiAgICAgICAgdmFyIEVSUl9OT05fT0JKRUNUX0RFU0NSSVBUT1IgPSAnUHJvcGVydHkgZGVzY3JpcHRpb24gbXVzdCBiZSBhbiBvYmplY3Q6ICc7XG4gICAgICAgIHZhciBFUlJfTk9OX09CSkVDVF9UQVJHRVQgPSAnT2JqZWN0LmRlZmluZVByb3BlcnR5IGNhbGxlZCBvbiBub24tb2JqZWN0OiAnO1xuICAgICAgICB2YXIgRVJSX0FDQ0VTU09SU19OT1RfU1VQUE9SVEVEID0gJ2dldHRlcnMgJiBzZXR0ZXJzIGNhbiBub3QgYmUgZGVmaW5lZCBvbiB0aGlzIGphdmFzY3JpcHQgZW5naW5lJztcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yKSB7XG4gICAgICAgICAgICBpZiAoaXNQcmltaXRpdmUob2JqZWN0KSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX05PTl9PQkpFQ1RfVEFSR0VUICsgb2JqZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc1ByaW1pdGl2ZShkZXNjcmlwdG9yKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX05PTl9PQkpFQ1RfREVTQ1JJUFRPUiArIGRlc2NyaXB0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbWFrZSBhIHZhbGlhbnQgYXR0ZW1wdCB0byB1c2UgdGhlIHJlYWwgZGVmaW5lUHJvcGVydHlcbiAgICAgICAgICAgIC8vIGZvciBJOCdzIERPTSBlbGVtZW50cy5cbiAgICAgICAgICAgIGlmIChkZWZpbmVQcm9wZXJ0eUZhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlZmluZVByb3BlcnR5RmFsbGJhY2suY2FsbChPYmplY3QsIG9iamVjdCwgcHJvcGVydHksIGRlc2NyaXB0b3IpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAvLyB0cnkgdGhlIHNoaW0gaWYgdGhlIHJlYWwgb25lIGRvZXNuJ3Qgd29ya1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgaXQncyBhIGRhdGEgcHJvcGVydHkuXG4gICAgICAgICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKSB7XG4gICAgICAgICAgICAgICAgLy8gZmFpbCBzaWxlbnRseSBpZiAnd3JpdGFibGUnLCAnZW51bWVyYWJsZScsIG9yICdjb25maWd1cmFibGUnXG4gICAgICAgICAgICAgICAgLy8gYXJlIHJlcXVlc3RlZCBidXQgbm90IHN1cHBvcnRlZFxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgLy8gYWx0ZXJuYXRlIGFwcHJvYWNoOlxuICAgICAgICAgICAgICAgIGlmICggLy8gY2FuJ3QgaW1wbGVtZW50IHRoZXNlIGZlYXR1cmVzOyBhbGxvdyBmYWxzZSBidXQgbm90IHRydWVcbiAgICAgICAgICAgICAgICAgICAgKCd3cml0YWJsZScgaW4gZGVzY3JpcHRvciAmJiAhZGVzY3JpcHRvci53cml0YWJsZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgKCdlbnVtZXJhYmxlJyBpbiBkZXNjcmlwdG9yICYmICFkZXNjcmlwdG9yLmVudW1lcmFibGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICgnY29uZmlndXJhYmxlJyBpbiBkZXNjcmlwdG9yICYmICFkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSlcbiAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICdUaGlzIGltcGxlbWVudGF0aW9uIG9mIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBkb2VzIG5vdCBzdXBwb3J0IGNvbmZpZ3VyYWJsZSwgZW51bWVyYWJsZSwgb3Igd3JpdGFibGUuJ1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgICAgICBpZiAoc3VwcG9ydHNBY2Nlc3NvcnMgJiYgKGxvb2t1cEdldHRlcihvYmplY3QsIHByb3BlcnR5KSB8fCBsb29rdXBTZXR0ZXIob2JqZWN0LCBwcm9wZXJ0eSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFzIGFjY2Vzc29ycyBhcmUgc3VwcG9ydGVkIG9ubHkgb24gZW5naW5lcyBpbXBsZW1lbnRpbmdcbiAgICAgICAgICAgICAgICAgICAgLy8gYF9fcHJvdG9fX2Agd2UgY2FuIHNhZmVseSBvdmVycmlkZSBgX19wcm90b19fYCB3aGlsZSBkZWZpbmluZ1xuICAgICAgICAgICAgICAgICAgICAvLyBhIHByb3BlcnR5IHRvIG1ha2Ugc3VyZSB0aGF0IHdlIGRvbid0IGhpdCBhbiBpbmhlcml0ZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gYWNjZXNzb3IuXG4gICAgICAgICAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm90b3R5cGUgPSBvYmplY3QuX19wcm90b19fO1xuICAgICAgICAgICAgICAgICAgICBvYmplY3QuX19wcm90b19fID0gcHJvdG90eXBlT2ZPYmplY3Q7XG4gICAgICAgICAgICAgICAgICAgIC8vIERlbGV0aW5nIGEgcHJvcGVydHkgYW55d2F5IHNpbmNlIGdldHRlciAvIHNldHRlciBtYXkgYmVcbiAgICAgICAgICAgICAgICAgICAgLy8gZGVmaW5lZCBvbiBvYmplY3QgaXRzZWxmLlxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgb2JqZWN0W3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0W3Byb3BlcnR5XSA9IGRlc2NyaXB0b3IudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNldHRpbmcgb3JpZ2luYWwgYF9fcHJvdG9fX2AgYmFjayBub3cuXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5fX3Byb3RvX18gPSBwcm90b3R5cGU7XG4gICAgICAgICAgICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tcHJvdG8gKi9cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RbcHJvcGVydHldID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBoYXNHZXR0ZXIgPSAnZ2V0JyBpbiBkZXNjcmlwdG9yO1xuICAgICAgICAgICAgICAgIHZhciBoYXNTZXR0ZXIgPSAnc2V0JyBpbiBkZXNjcmlwdG9yO1xuICAgICAgICAgICAgICAgIGlmICghc3VwcG9ydHNBY2Nlc3NvcnMgJiYgKGhhc0dldHRlciB8fCBoYXNTZXR0ZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX0FDQ0VTU09SU19OT1RfU1VQUE9SVEVEKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSWYgd2UgZ290IHRoYXQgZmFyIHRoZW4gZ2V0dGVycyBhbmQgc2V0dGVycyBjYW4gYmUgZGVmaW5lZCAhIVxuICAgICAgICAgICAgICAgIGlmIChoYXNHZXR0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5lR2V0dGVyKG9iamVjdCwgcHJvcGVydHksIGRlc2NyaXB0b3IuZ2V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGhhc1NldHRlcikge1xuICAgICAgICAgICAgICAgICAgICBkZWZpbmVTZXR0ZXIob2JqZWN0LCBwcm9wZXJ0eSwgZGVzY3JpcHRvci5zZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRVM1IDE1LjIuMy43XG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjdcbiAgICBpZiAoIU9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIHx8IGRlZmluZVByb3BlcnRpZXNGYWxsYmFjaykge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMob2JqZWN0LCBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAvLyBtYWtlIGEgdmFsaWFudCBhdHRlbXB0IHRvIHVzZSB0aGUgcmVhbCBkZWZpbmVQcm9wZXJ0aWVzXG4gICAgICAgICAgICBpZiAoZGVmaW5lUHJvcGVydGllc0ZhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlZmluZVByb3BlcnRpZXNGYWxsYmFjay5jYWxsKE9iamVjdCwgb2JqZWN0LCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdHJ5IHRoZSBzaGltIGlmIHRoZSByZWFsIG9uZSBkb2Vzbid0IHdvcmtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHByb3BlcnRpZXMpLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ICE9PSAnX19wcm90b19fJykge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSwgcHJvcGVydGllc1twcm9wZXJ0eV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBFUzUgMTUuMi4zLjhcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuOFxuICAgIGlmICghT2JqZWN0LnNlYWwpIHtcbiAgICAgICAgT2JqZWN0LnNlYWwgPSBmdW5jdGlvbiBzZWFsKG9iamVjdCkge1xuICAgICAgICAgICAgaWYgKE9iamVjdChvYmplY3QpICE9PSBvYmplY3QpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3Quc2VhbCBjYW4gb25seSBiZSBjYWxsZWQgb24gT2JqZWN0cy4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRoaXMgaXMgbWlzbGVhZGluZyBhbmQgYnJlYWtzIGZlYXR1cmUtZGV0ZWN0aW9uLCBidXRcbiAgICAgICAgICAgIC8vIGFsbG93cyBcInNlY3VyYWJsZVwiIGNvZGUgdG8gXCJncmFjZWZ1bGx5XCIgZGVncmFkZSB0byB3b3JraW5nXG4gICAgICAgICAgICAvLyBidXQgaW5zZWN1cmUgY29kZS5cbiAgICAgICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRVM1IDE1LjIuMy45XG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjlcbiAgICBpZiAoIU9iamVjdC5mcmVlemUpIHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZSA9IGZ1bmN0aW9uIGZyZWV6ZShvYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3Qob2JqZWN0KSAhPT0gb2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmZyZWV6ZSBjYW4gb25seSBiZSBjYWxsZWQgb24gT2JqZWN0cy4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRoaXMgaXMgbWlzbGVhZGluZyBhbmQgYnJlYWtzIGZlYXR1cmUtZGV0ZWN0aW9uLCBidXRcbiAgICAgICAgICAgIC8vIGFsbG93cyBcInNlY3VyYWJsZVwiIGNvZGUgdG8gXCJncmFjZWZ1bGx5XCIgZGVncmFkZSB0byB3b3JraW5nXG4gICAgICAgICAgICAvLyBidXQgaW5zZWN1cmUgY29kZS5cbiAgICAgICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gZGV0ZWN0IGEgUmhpbm8gYnVnIGFuZCBwYXRjaCBpdFxuICAgIHRyeSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUoZnVuY3Rpb24gKCkge30pO1xuICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICBPYmplY3QuZnJlZXplID0gKGZ1bmN0aW9uIChmcmVlemVPYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBmcmVlemUob2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnJlZXplT2JqZWN0KG9iamVjdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfShPYmplY3QuZnJlZXplKSk7XG4gICAgfVxuXG4gICAgLy8gRVM1IDE1LjIuMy4xMFxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy4xMFxuICAgIGlmICghT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKSB7XG4gICAgICAgIE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyA9IGZ1bmN0aW9uIHByZXZlbnRFeHRlbnNpb25zKG9iamVjdCkge1xuICAgICAgICAgICAgaWYgKE9iamVjdChvYmplY3QpICE9PSBvYmplY3QpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QucHJldmVudEV4dGVuc2lvbnMgY2FuIG9ubHkgYmUgY2FsbGVkIG9uIE9iamVjdHMuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0aGlzIGlzIG1pc2xlYWRpbmcgYW5kIGJyZWFrcyBmZWF0dXJlLWRldGVjdGlvbiwgYnV0XG4gICAgICAgICAgICAvLyBhbGxvd3MgXCJzZWN1cmFibGVcIiBjb2RlIHRvIFwiZ3JhY2VmdWxseVwiIGRlZ3JhZGUgdG8gd29ya2luZ1xuICAgICAgICAgICAgLy8gYnV0IGluc2VjdXJlIGNvZGUuXG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIEVTNSAxNS4yLjMuMTFcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuMTFcbiAgICBpZiAoIU9iamVjdC5pc1NlYWxlZCkge1xuICAgICAgICBPYmplY3QuaXNTZWFsZWQgPSBmdW5jdGlvbiBpc1NlYWxlZChvYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3Qob2JqZWN0KSAhPT0gb2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmlzU2VhbGVkIGNhbiBvbmx5IGJlIGNhbGxlZCBvbiBPYmplY3RzLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIEVTNSAxNS4yLjMuMTJcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuMTJcbiAgICBpZiAoIU9iamVjdC5pc0Zyb3plbikge1xuICAgICAgICBPYmplY3QuaXNGcm96ZW4gPSBmdW5jdGlvbiBpc0Zyb3plbihvYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3Qob2JqZWN0KSAhPT0gb2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmlzRnJvemVuIGNhbiBvbmx5IGJlIGNhbGxlZCBvbiBPYmplY3RzLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIEVTNSAxNS4yLjMuMTNcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuMTNcbiAgICBpZiAoIU9iamVjdC5pc0V4dGVuc2libGUpIHtcbiAgICAgICAgT2JqZWN0LmlzRXh0ZW5zaWJsZSA9IGZ1bmN0aW9uIGlzRXh0ZW5zaWJsZShvYmplY3QpIHtcbiAgICAgICAgICAgIC8vIDEuIElmIFR5cGUoTykgaXMgbm90IE9iamVjdCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXG4gICAgICAgICAgICBpZiAoT2JqZWN0KG9iamVjdCkgIT09IG9iamVjdCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5pc0V4dGVuc2libGUgY2FuIG9ubHkgYmUgY2FsbGVkIG9uIE9iamVjdHMuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAyLiBSZXR1cm4gdGhlIEJvb2xlYW4gdmFsdWUgb2YgdGhlIFtbRXh0ZW5zaWJsZV1dIGludGVybmFsIHByb3BlcnR5IG9mIE8uXG4gICAgICAgICAgICB2YXIgbmFtZSA9ICcnO1xuICAgICAgICAgICAgd2hpbGUgKG93bnMob2JqZWN0LCBuYW1lKSkge1xuICAgICAgICAgICAgICAgIG5hbWUgKz0gJz8nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2JqZWN0W25hbWVdID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciByZXR1cm5WYWx1ZSA9IG93bnMob2JqZWN0LCBuYW1lKTtcbiAgICAgICAgICAgIGRlbGV0ZSBvYmplY3RbbmFtZV07XG4gICAgICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSk7XG4iLCIgLyohXG4gICogaHR0cHM6Ly9naXRodWIuY29tL3BhdWxtaWxsci9lczYtc2hpbVxuICAqIEBsaWNlbnNlIGVzNi1zaGltIENvcHlyaWdodCAyMDEzLTIwMTYgYnkgUGF1bCBNaWxsZXIgKGh0dHA6Ly9wYXVsbWlsbHIuY29tKVxuICAqICAgYW5kIGNvbnRyaWJ1dG9ycywgIE1JVCBMaWNlbnNlXG4gICogZXM2LXNoaW06IHYwLjM1LjFcbiAgKiBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3BhdWxtaWxsci9lczYtc2hpbS9ibG9iLzAuMzUuMS9MSUNFTlNFXG4gICogRGV0YWlscyBhbmQgZG9jdW1lbnRhdGlvbjpcbiAgKiBodHRwczovL2dpdGh1Yi5jb20vcGF1bG1pbGxyL2VzNi1zaGltL1xuICAqL1xuXG4vLyBVTUQgKFVuaXZlcnNhbCBNb2R1bGUgRGVmaW5pdGlvbilcbi8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kL2Jsb2IvbWFzdGVyL3JldHVybkV4cG9ydHMuanNcbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAvKmdsb2JhbCBkZWZpbmUsIG1vZHVsZSwgZXhwb3J0cyAqL1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgIGRlZmluZShmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcbiAgICAvLyBvbmx5IENvbW1vbkpTLWxpa2UgZW52aXJvbm1lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cyxcbiAgICAvLyBsaWtlIE5vZGUuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcbiAgICByb290LnJldHVybkV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIF9hcHBseSA9IEZ1bmN0aW9uLmNhbGwuYmluZChGdW5jdGlvbi5hcHBseSk7XG4gIHZhciBfY2FsbCA9IEZ1bmN0aW9uLmNhbGwuYmluZChGdW5jdGlvbi5jYWxsKTtcbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzO1xuXG4gIHZhciBub3QgPSBmdW5jdGlvbiBub3RUaHVua2VyKGZ1bmMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gbm90VGh1bmsoKSB7XG4gICAgICByZXR1cm4gIV9hcHBseShmdW5jLCB0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH07XG4gIHZhciB0aHJvd3NFcnJvciA9IGZ1bmN0aW9uIChmdW5jKSB7XG4gICAgdHJ5IHtcbiAgICAgIGZ1bmMoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH07XG4gIHZhciB2YWx1ZU9yRmFsc2VJZlRocm93cyA9IGZ1bmN0aW9uIHZhbHVlT3JGYWxzZUlmVGhyb3dzKGZ1bmMpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmMoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIHZhciBpc0NhbGxhYmxlV2l0aG91dE5ldyA9IG5vdCh0aHJvd3NFcnJvcik7XG4gIHZhciBhcmVQcm9wZXJ0eURlc2NyaXB0b3JzU3VwcG9ydGVkID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIGlmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBleGlzdHMgYnV0IHRocm93cywgaXQncyBJRSA4XG4gICAgcmV0dXJuICF0aHJvd3NFcnJvcihmdW5jdGlvbiAoKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICd4JywgeyBnZXQ6IGZ1bmN0aW9uICgpIHt9IH0pO1xuICAgIH0pO1xuICB9O1xuICB2YXIgc3VwcG9ydHNEZXNjcmlwdG9ycyA9ICEhT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIGFyZVByb3BlcnR5RGVzY3JpcHRvcnNTdXBwb3J0ZWQoKTtcbiAgdmFyIGZ1bmN0aW9uc0hhdmVOYW1lcyA9IChmdW5jdGlvbiBmb28oKSB7fSkubmFtZSA9PT0gJ2Zvbyc7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tZXh0cmEtcGFyZW5zXG5cbiAgdmFyIF9mb3JFYWNoID0gRnVuY3Rpb24uY2FsbC5iaW5kKEFycmF5LnByb3RvdHlwZS5mb3JFYWNoKTtcbiAgdmFyIF9yZWR1Y2UgPSBGdW5jdGlvbi5jYWxsLmJpbmQoQXJyYXkucHJvdG90eXBlLnJlZHVjZSk7XG4gIHZhciBfZmlsdGVyID0gRnVuY3Rpb24uY2FsbC5iaW5kKEFycmF5LnByb3RvdHlwZS5maWx0ZXIpO1xuICB2YXIgX3NvbWUgPSBGdW5jdGlvbi5jYWxsLmJpbmQoQXJyYXkucHJvdG90eXBlLnNvbWUpO1xuXG4gIHZhciBkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWUsIHZhbHVlLCBmb3JjZSkge1xuICAgIGlmICghZm9yY2UgJiYgbmFtZSBpbiBvYmplY3QpIHsgcmV0dXJuOyB9XG4gICAgaWYgKHN1cHBvcnRzRGVzY3JpcHRvcnMpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iamVjdFtuYW1lXSA9IHZhbHVlO1xuICAgIH1cbiAgfTtcblxuICAvLyBEZWZpbmUgY29uZmlndXJhYmxlLCB3cml0YWJsZSBhbmQgbm9uLWVudW1lcmFibGUgcHJvcHNcbiAgLy8gaWYgdGhleSBkb27igJl0IGV4aXN0LlxuICB2YXIgZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIChvYmplY3QsIG1hcCwgZm9yY2VPdmVycmlkZSkge1xuICAgIF9mb3JFYWNoKGtleXMobWFwKSwgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHZhciBtZXRob2QgPSBtYXBbbmFtZV07XG4gICAgICBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIG1ldGhvZCwgISFmb3JjZU92ZXJyaWRlKTtcbiAgICB9KTtcbiAgfTtcblxuICB2YXIgX3RvU3RyaW5nID0gRnVuY3Rpb24uY2FsbC5iaW5kKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcpO1xuICB2YXIgaXNDYWxsYWJsZSA9IHR5cGVvZiAvYWJjLyA9PT0gJ2Z1bmN0aW9uJyA/IGZ1bmN0aW9uIElzQ2FsbGFibGVTbG93KHgpIHtcbiAgICAvLyBTb21lIG9sZCBicm93c2VycyAoSUUsIEZGKSBzYXkgdGhhdCB0eXBlb2YgL2FiYy8gPT09ICdmdW5jdGlvbidcbiAgICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbicgJiYgX3RvU3RyaW5nKHgpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuICB9IDogZnVuY3Rpb24gSXNDYWxsYWJsZUZhc3QoeCkgeyByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbic7IH07XG5cbiAgdmFyIFZhbHVlID0ge1xuICAgIGdldHRlcjogZnVuY3Rpb24gKG9iamVjdCwgbmFtZSwgZ2V0dGVyKSB7XG4gICAgICBpZiAoIXN1cHBvcnRzRGVzY3JpcHRvcnMpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZ2V0dGVycyByZXF1aXJlIHRydWUgRVM1IHN1cHBvcnQnKTtcbiAgICAgIH1cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgZ2V0OiBnZXR0ZXJcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgcHJveHk6IGZ1bmN0aW9uIChvcmlnaW5hbE9iamVjdCwga2V5LCB0YXJnZXRPYmplY3QpIHtcbiAgICAgIGlmICghc3VwcG9ydHNEZXNjcmlwdG9ycykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdnZXR0ZXJzIHJlcXVpcmUgdHJ1ZSBFUzUgc3VwcG9ydCcpO1xuICAgICAgfVxuICAgICAgdmFyIG9yaWdpbmFsRGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob3JpZ2luYWxPYmplY3QsIGtleSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0T2JqZWN0LCBrZXksIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiBvcmlnaW5hbERlc2NyaXB0b3IuY29uZmlndXJhYmxlLFxuICAgICAgICBlbnVtZXJhYmxlOiBvcmlnaW5hbERlc2NyaXB0b3IuZW51bWVyYWJsZSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXRLZXkoKSB7IHJldHVybiBvcmlnaW5hbE9iamVjdFtrZXldOyB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldEtleSh2YWx1ZSkgeyBvcmlnaW5hbE9iamVjdFtrZXldID0gdmFsdWU7IH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgcmVkZWZpbmU6IGZ1bmN0aW9uIChvYmplY3QsIHByb3BlcnR5LCBuZXdWYWx1ZSkge1xuICAgICAgaWYgKHN1cHBvcnRzRGVzY3JpcHRvcnMpIHtcbiAgICAgICAgdmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpO1xuICAgICAgICBkZXNjcmlwdG9yLnZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9iamVjdFtwcm9wZXJ0eV0gPSBuZXdWYWx1ZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGRlZmluZUJ5RGVzY3JpcHRvcjogZnVuY3Rpb24gKG9iamVjdCwgcHJvcGVydHksIGRlc2NyaXB0b3IpIHtcbiAgICAgIGlmIChzdXBwb3J0c0Rlc2NyaXB0b3JzKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yKTtcbiAgICAgIH0gZWxzZSBpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKSB7XG4gICAgICAgIG9iamVjdFtwcm9wZXJ0eV0gPSBkZXNjcmlwdG9yLnZhbHVlO1xuICAgICAgfVxuICAgIH0sXG4gICAgcHJlc2VydmVUb1N0cmluZzogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlICYmIGlzQ2FsbGFibGUoc291cmNlLnRvU3RyaW5nKSkge1xuICAgICAgICBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsICd0b1N0cmluZycsIHNvdXJjZS50b1N0cmluZy5iaW5kKHNvdXJjZSksIHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvLyBTaW1wbGUgc2hpbSBmb3IgT2JqZWN0LmNyZWF0ZSBvbiBFUzMgYnJvd3NlcnNcbiAgLy8gKHVubGlrZSByZWFsIHNoaW0sIG5vIGF0dGVtcHQgdG8gc3VwcG9ydCBgcHJvdG90eXBlID09PSBudWxsYClcbiAgdmFyIGNyZWF0ZSA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gKHByb3RvdHlwZSwgcHJvcGVydGllcykge1xuICAgIHZhciBQcm90b3R5cGUgPSBmdW5jdGlvbiBQcm90b3R5cGUoKSB7fTtcbiAgICBQcm90b3R5cGUucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICAgIHZhciBvYmplY3QgPSBuZXcgUHJvdG90eXBlKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAga2V5cyhwcm9wZXJ0aWVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgVmFsdWUuZGVmaW5lQnlEZXNjcmlwdG9yKG9iamVjdCwga2V5LCBwcm9wZXJ0aWVzW2tleV0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG5cbiAgdmFyIHN1cHBvcnRzU3ViY2xhc3NpbmcgPSBmdW5jdGlvbiAoQywgZikge1xuICAgIGlmICghT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7IHJldHVybiBmYWxzZTsgLyogc2tpcCB0ZXN0IG9uIElFIDwgMTEgKi8gfVxuICAgIHJldHVybiB2YWx1ZU9yRmFsc2VJZlRocm93cyhmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgU3ViID0gZnVuY3Rpb24gU3ViY2xhc3MoYXJnKSB7XG4gICAgICAgIHZhciBvID0gbmV3IEMoYXJnKTtcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKG8sIFN1YmNsYXNzLnByb3RvdHlwZSk7XG4gICAgICAgIHJldHVybiBvO1xuICAgICAgfTtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihTdWIsIEMpO1xuICAgICAgU3ViLnByb3RvdHlwZSA9IGNyZWF0ZShDLnByb3RvdHlwZSwge1xuICAgICAgICBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogU3ViIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGYoU3ViKTtcbiAgICB9KTtcbiAgfTtcblxuICB2YXIgZ2V0R2xvYmFsID0gZnVuY3Rpb24gKCkge1xuICAgIC8qIGdsb2JhbCBzZWxmLCB3aW5kb3csIGdsb2JhbCAqL1xuICAgIC8vIHRoZSBvbmx5IHJlbGlhYmxlIG1lYW5zIHRvIGdldCB0aGUgZ2xvYmFsIG9iamVjdCBpc1xuICAgIC8vIGBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpYFxuICAgIC8vIEhvd2V2ZXIsIHRoaXMgY2F1c2VzIENTUCB2aW9sYXRpb25zIGluIENocm9tZSBhcHBzLlxuICAgIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuIHNlbGY7IH1cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuIHdpbmRvdzsgfVxuICAgIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykgeyByZXR1cm4gZ2xvYmFsOyB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1bmFibGUgdG8gbG9jYXRlIGdsb2JhbCBvYmplY3QnKTtcbiAgfTtcblxuICB2YXIgZ2xvYmFscyA9IGdldEdsb2JhbCgpO1xuICB2YXIgZ2xvYmFsSXNGaW5pdGUgPSBnbG9iYWxzLmlzRmluaXRlO1xuICB2YXIgX2luZGV4T2YgPSBGdW5jdGlvbi5jYWxsLmJpbmQoU3RyaW5nLnByb3RvdHlwZS5pbmRleE9mKTtcbiAgdmFyIF9hcnJheUluZGV4T2ZBcHBseSA9IEZ1bmN0aW9uLmFwcGx5LmJpbmQoQXJyYXkucHJvdG90eXBlLmluZGV4T2YpO1xuICB2YXIgX2NvbmNhdCA9IEZ1bmN0aW9uLmNhbGwuYmluZChBcnJheS5wcm90b3R5cGUuY29uY2F0KTtcbiAgLy8gdmFyIF9zb3J0ID0gRnVuY3Rpb24uY2FsbC5iaW5kKEFycmF5LnByb3RvdHlwZS5zb3J0KTtcbiAgdmFyIF9zdHJTbGljZSA9IEZ1bmN0aW9uLmNhbGwuYmluZChTdHJpbmcucHJvdG90eXBlLnNsaWNlKTtcbiAgdmFyIF9wdXNoID0gRnVuY3Rpb24uY2FsbC5iaW5kKEFycmF5LnByb3RvdHlwZS5wdXNoKTtcbiAgdmFyIF9wdXNoQXBwbHkgPSBGdW5jdGlvbi5hcHBseS5iaW5kKEFycmF5LnByb3RvdHlwZS5wdXNoKTtcbiAgdmFyIF9zaGlmdCA9IEZ1bmN0aW9uLmNhbGwuYmluZChBcnJheS5wcm90b3R5cGUuc2hpZnQpO1xuICB2YXIgX21heCA9IE1hdGgubWF4O1xuICB2YXIgX21pbiA9IE1hdGgubWluO1xuICB2YXIgX2Zsb29yID0gTWF0aC5mbG9vcjtcbiAgdmFyIF9hYnMgPSBNYXRoLmFicztcbiAgdmFyIF9leHAgPSBNYXRoLmV4cDtcbiAgdmFyIF9sb2cgPSBNYXRoLmxvZztcbiAgdmFyIF9zcXJ0ID0gTWF0aC5zcXJ0O1xuICB2YXIgX2hhc093blByb3BlcnR5ID0gRnVuY3Rpb24uY2FsbC5iaW5kKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkpO1xuICB2YXIgQXJyYXlJdGVyYXRvcjsgLy8gbWFrZSBvdXIgaW1wbGVtZW50YXRpb24gcHJpdmF0ZVxuICB2YXIgbm9vcCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gIHZhciBPcmlnTWFwID0gZ2xvYmFscy5NYXA7XG4gIHZhciBvcmlnTWFwRGVsZXRlID0gT3JpZ01hcCAmJiBPcmlnTWFwLnByb3RvdHlwZVsnZGVsZXRlJ107XG4gIHZhciBvcmlnTWFwR2V0ID0gT3JpZ01hcCAmJiBPcmlnTWFwLnByb3RvdHlwZS5nZXQ7XG4gIHZhciBvcmlnTWFwSGFzID0gT3JpZ01hcCAmJiBPcmlnTWFwLnByb3RvdHlwZS5oYXM7XG4gIHZhciBvcmlnTWFwU2V0ID0gT3JpZ01hcCAmJiBPcmlnTWFwLnByb3RvdHlwZS5zZXQ7XG5cbiAgdmFyIFN5bWJvbCA9IGdsb2JhbHMuU3ltYm9sIHx8IHt9O1xuICB2YXIgc3ltYm9sU3BlY2llcyA9IFN5bWJvbC5zcGVjaWVzIHx8ICdAQHNwZWNpZXMnO1xuXG4gIHZhciBudW1iZXJJc05hTiA9IE51bWJlci5pc05hTiB8fCBmdW5jdGlvbiBpc05hTih2YWx1ZSkge1xuICAgIC8vIE5hTiAhPT0gTmFOLCBidXQgdGhleSBhcmUgaWRlbnRpY2FsLlxuICAgIC8vIE5hTnMgYXJlIHRoZSBvbmx5IG5vbi1yZWZsZXhpdmUgdmFsdWUsIGkuZS4sIGlmIHggIT09IHgsXG4gICAgLy8gdGhlbiB4IGlzIE5hTi5cbiAgICAvLyBpc05hTiBpcyBicm9rZW46IGl0IGNvbnZlcnRzIGl0cyBhcmd1bWVudCB0byBudW1iZXIsIHNvXG4gICAgLy8gaXNOYU4oJ2ZvbycpID0+IHRydWVcbiAgICByZXR1cm4gdmFsdWUgIT09IHZhbHVlO1xuICB9O1xuICB2YXIgbnVtYmVySXNGaW5pdGUgPSBOdW1iZXIuaXNGaW5pdGUgfHwgZnVuY3Rpb24gaXNGaW5pdGUodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBnbG9iYWxJc0Zpbml0ZSh2YWx1ZSk7XG4gIH07XG4gIHZhciBfc2lnbiA9IGlzQ2FsbGFibGUoTWF0aC5zaWduKSA/IE1hdGguc2lnbiA6IGZ1bmN0aW9uIHNpZ24odmFsdWUpIHtcbiAgICB2YXIgbnVtYmVyID0gTnVtYmVyKHZhbHVlKTtcbiAgICBpZiAobnVtYmVyID09PSAwKSB7IHJldHVybiBudW1iZXI7IH1cbiAgICBpZiAobnVtYmVySXNOYU4obnVtYmVyKSkgeyByZXR1cm4gbnVtYmVyOyB9XG4gICAgcmV0dXJuIG51bWJlciA8IDAgPyAtMSA6IDE7XG4gIH07XG5cbiAgLy8gdGFrZW4gZGlyZWN0bHkgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbGpoYXJiL2lzLWFyZ3VtZW50cy9ibG9iL21hc3Rlci9pbmRleC5qc1xuICAvLyBjYW4gYmUgcmVwbGFjZWQgd2l0aCByZXF1aXJlKCdpcy1hcmd1bWVudHMnKSBpZiB3ZSBldmVyIHVzZSBhIGJ1aWxkIHByb2Nlc3MgaW5zdGVhZFxuICB2YXIgaXNTdGFuZGFyZEFyZ3VtZW50cyA9IGZ1bmN0aW9uIGlzQXJndW1lbnRzKHZhbHVlKSB7XG4gICAgcmV0dXJuIF90b1N0cmluZyh2YWx1ZSkgPT09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuICB9O1xuICB2YXIgaXNMZWdhY3lBcmd1bWVudHMgPSBmdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJlxuICAgICAgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuICAgICAgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcicgJiZcbiAgICAgIHZhbHVlLmxlbmd0aCA+PSAwICYmXG4gICAgICBfdG9TdHJpbmcodmFsdWUpICE9PSAnW29iamVjdCBBcnJheV0nICYmXG4gICAgICBfdG9TdHJpbmcodmFsdWUuY2FsbGVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgfTtcbiAgdmFyIGlzQXJndW1lbnRzID0gaXNTdGFuZGFyZEFyZ3VtZW50cyhhcmd1bWVudHMpID8gaXNTdGFuZGFyZEFyZ3VtZW50cyA6IGlzTGVnYWN5QXJndW1lbnRzO1xuXG4gIHZhciBUeXBlID0ge1xuICAgIHByaW1pdGl2ZTogZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHggPT09IG51bGwgfHwgKHR5cGVvZiB4ICE9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiB4ICE9PSAnb2JqZWN0Jyk7IH0sXG4gICAgc3RyaW5nOiBmdW5jdGlvbiAoeCkgeyByZXR1cm4gX3RvU3RyaW5nKHgpID09PSAnW29iamVjdCBTdHJpbmddJzsgfSxcbiAgICByZWdleDogZnVuY3Rpb24gKHgpIHsgcmV0dXJuIF90b1N0cmluZyh4KSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7IH0sXG4gICAgc3ltYm9sOiBmdW5jdGlvbiAoeCkge1xuICAgICAgcmV0dXJuIHR5cGVvZiBnbG9iYWxzLlN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgeCA9PT0gJ3N5bWJvbCc7XG4gICAgfVxuICB9O1xuXG4gIHZhciBvdmVycmlkZU5hdGl2ZSA9IGZ1bmN0aW9uIG92ZXJyaWRlTmF0aXZlKG9iamVjdCwgcHJvcGVydHksIHJlcGxhY2VtZW50KSB7XG4gICAgdmFyIG9yaWdpbmFsID0gb2JqZWN0W3Byb3BlcnR5XTtcbiAgICBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCByZXBsYWNlbWVudCwgdHJ1ZSk7XG4gICAgVmFsdWUucHJlc2VydmVUb1N0cmluZyhvYmplY3RbcHJvcGVydHldLCBvcmlnaW5hbCk7XG4gIH07XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtcHJvcGVydGllc1xuICB2YXIgaGFzU3ltYm9scyA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIFN5bWJvbFsnZm9yJ10gPT09ICdmdW5jdGlvbicgJiYgVHlwZS5zeW1ib2woU3ltYm9sKCkpO1xuXG4gIC8vIFRoaXMgaXMgYSBwcml2YXRlIG5hbWUgaW4gdGhlIGVzNiBzcGVjLCBlcXVhbCB0byAnW1N5bWJvbC5pdGVyYXRvcl0nXG4gIC8vIHdlJ3JlIGdvaW5nIHRvIHVzZSBhbiBhcmJpdHJhcnkgXy1wcmVmaXhlZCBuYW1lIHRvIG1ha2Ugb3VyIHNoaW1zXG4gIC8vIHdvcmsgcHJvcGVybHkgd2l0aCBlYWNoIG90aGVyLCBldmVuIHRob3VnaCB3ZSBkb24ndCBoYXZlIGZ1bGwgSXRlcmF0b3JcbiAgLy8gc3VwcG9ydC4gIFRoYXQgaXMsIGBBcnJheS5mcm9tKG1hcC5rZXlzKCkpYCB3aWxsIHdvcmssIGJ1dCB3ZSBkb24ndFxuICAvLyBwcmV0ZW5kIHRvIGV4cG9ydCBhIFwicmVhbFwiIEl0ZXJhdG9yIGludGVyZmFjZS5cbiAgdmFyICRpdGVyYXRvciQgPSBUeXBlLnN5bWJvbChTeW1ib2wuaXRlcmF0b3IpID8gU3ltYm9sLml0ZXJhdG9yIDogJ19lczYtc2hpbSBpdGVyYXRvcl8nO1xuICAvLyBGaXJlZm94IHNoaXBzIGEgcGFydGlhbCBpbXBsZW1lbnRhdGlvbiB1c2luZyB0aGUgbmFtZSBAQGl0ZXJhdG9yLlxuICAvLyBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD05MDcwNzcjYzE0XG4gIC8vIFNvIHVzZSB0aGF0IG5hbWUgaWYgd2UgZGV0ZWN0IGl0LlxuICBpZiAoZ2xvYmFscy5TZXQgJiYgdHlwZW9mIG5ldyBnbG9iYWxzLlNldCgpWydAQGl0ZXJhdG9yJ10gPT09ICdmdW5jdGlvbicpIHtcbiAgICAkaXRlcmF0b3IkID0gJ0BAaXRlcmF0b3InO1xuICB9XG5cbiAgLy8gUmVmbGVjdFxuICBpZiAoIWdsb2JhbHMuUmVmbGVjdCkge1xuICAgIGRlZmluZVByb3BlcnR5KGdsb2JhbHMsICdSZWZsZWN0Jywge30sIHRydWUpO1xuICB9XG4gIHZhciBSZWZsZWN0ID0gZ2xvYmFscy5SZWZsZWN0O1xuXG4gIHZhciAkU3RyaW5nID0gU3RyaW5nO1xuXG4gIC8qIGdsb2JhbCBkb2N1bWVudCAqL1xuICB2YXIgZG9tQWxsID0gKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcgfHwgIWRvY3VtZW50KSA/IG51bGwgOiBkb2N1bWVudC5hbGw7XG4gIC8qIGpzaGludCBlcW51bGw6dHJ1ZSAqL1xuICB2YXIgaXNOdWxsT3JVbmRlZmluZWQgPSBkb21BbGwgPT0gbnVsbCA/IGZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKHgpIHtcbiAgICAvKiBqc2hpbnQgZXFudWxsOnRydWUgKi9cbiAgICByZXR1cm4geCA9PSBudWxsO1xuICB9IDogZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWRBbmROb3REb2N1bWVudEFsbCh4KSB7XG4gICAgLyoganNoaW50IGVxbnVsbDp0cnVlICovXG4gICAgcmV0dXJuIHggPT0gbnVsbCAmJiB4ICE9PSBkb21BbGw7XG4gIH07XG5cbiAgdmFyIEVTID0ge1xuICAgIC8vIGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1jYWxsXG4gICAgQ2FsbDogZnVuY3Rpb24gQ2FsbChGLCBWKSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyID8gYXJndW1lbnRzWzJdIDogW107XG4gICAgICBpZiAoIUVTLklzQ2FsbGFibGUoRikpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9hcHBseShGLCBWLCBhcmdzKTtcbiAgICB9LFxuXG4gICAgUmVxdWlyZU9iamVjdENvZXJjaWJsZTogZnVuY3Rpb24gKHgsIG9wdE1lc3NhZ2UpIHtcbiAgICAgIGlmIChpc051bGxPclVuZGVmaW5lZCh4KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKG9wdE1lc3NhZ2UgfHwgJ0Nhbm5vdCBjYWxsIG1ldGhvZCBvbiAnICsgeCk7XG4gICAgICB9XG4gICAgICByZXR1cm4geDtcbiAgICB9LFxuXG4gICAgLy8gVGhpcyBtaWdodCBtaXNzIHRoZSBcIihub24tc3RhbmRhcmQgZXhvdGljIGFuZCBkb2VzIG5vdCBpbXBsZW1lbnRcbiAgICAvLyBbW0NhbGxdXSlcIiBjYXNlIGZyb21cbiAgICAvLyBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtdHlwZW9mLW9wZXJhdG9yLXJ1bnRpbWUtc2VtYW50aWNzLWV2YWx1YXRpb25cbiAgICAvLyBidXQgd2UgY2FuJ3QgZmluZCBhbnkgZXZpZGVuY2UgdGhlc2Ugb2JqZWN0cyBleGlzdCBpbiBwcmFjdGljZS5cbiAgICAvLyBJZiB3ZSBmaW5kIHNvbWUgaW4gdGhlIGZ1dHVyZSwgeW91IGNvdWxkIHRlc3QgYE9iamVjdCh4KSA9PT0geGAsXG4gICAgLy8gd2hpY2ggaXMgcmVsaWFibGUgYWNjb3JkaW5nIHRvXG4gICAgLy8gaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRvb2JqZWN0XG4gICAgLy8gYnV0IGlzIG5vdCB3ZWxsIG9wdGltaXplZCBieSBydW50aW1lcyBhbmQgY3JlYXRlcyBhbiBvYmplY3RcbiAgICAvLyB3aGVuZXZlciBpdCByZXR1cm5zIGZhbHNlLCBhbmQgdGh1cyBpcyB2ZXJ5IHNsb3cuXG4gICAgVHlwZUlzT2JqZWN0OiBmdW5jdGlvbiAoeCkge1xuICAgICAgaWYgKHggPT09IHZvaWQgMCB8fCB4ID09PSBudWxsIHx8IHggPT09IHRydWUgfHwgeCA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiB4ID09PSAnb2JqZWN0JyB8fCB4ID09PSBkb21BbGw7XG4gICAgfSxcblxuICAgIFRvT2JqZWN0OiBmdW5jdGlvbiAobywgb3B0TWVzc2FnZSkge1xuICAgICAgcmV0dXJuIE9iamVjdChFUy5SZXF1aXJlT2JqZWN0Q29lcmNpYmxlKG8sIG9wdE1lc3NhZ2UpKTtcbiAgICB9LFxuXG4gICAgSXNDYWxsYWJsZTogaXNDYWxsYWJsZSxcblxuICAgIElzQ29uc3RydWN0b3I6IGZ1bmN0aW9uICh4KSB7XG4gICAgICAvLyBXZSBjYW4ndCB0ZWxsIGNhbGxhYmxlcyBmcm9tIGNvbnN0cnVjdG9ycyBpbiBFUzVcbiAgICAgIHJldHVybiBFUy5Jc0NhbGxhYmxlKHgpO1xuICAgIH0sXG5cbiAgICBUb0ludDMyOiBmdW5jdGlvbiAoeCkge1xuICAgICAgcmV0dXJuIEVTLlRvTnVtYmVyKHgpID4+IDA7XG4gICAgfSxcblxuICAgIFRvVWludDMyOiBmdW5jdGlvbiAoeCkge1xuICAgICAgcmV0dXJuIEVTLlRvTnVtYmVyKHgpID4+PiAwO1xuICAgIH0sXG5cbiAgICBUb051bWJlcjogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAoX3RvU3RyaW5nKHZhbHVlKSA9PT0gJ1tvYmplY3QgU3ltYm9sXScpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgYSBTeW1ib2wgdmFsdWUgdG8gYSBudW1iZXInKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiArdmFsdWU7XG4gICAgfSxcblxuICAgIFRvSW50ZWdlcjogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICB2YXIgbnVtYmVyID0gRVMuVG9OdW1iZXIodmFsdWUpO1xuICAgICAgaWYgKG51bWJlcklzTmFOKG51bWJlcikpIHsgcmV0dXJuIDA7IH1cbiAgICAgIGlmIChudW1iZXIgPT09IDAgfHwgIW51bWJlcklzRmluaXRlKG51bWJlcikpIHsgcmV0dXJuIG51bWJlcjsgfVxuICAgICAgcmV0dXJuIChudW1iZXIgPiAwID8gMSA6IC0xKSAqIF9mbG9vcihfYWJzKG51bWJlcikpO1xuICAgIH0sXG5cbiAgICBUb0xlbmd0aDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICB2YXIgbGVuID0gRVMuVG9JbnRlZ2VyKHZhbHVlKTtcbiAgICAgIGlmIChsZW4gPD0gMCkgeyByZXR1cm4gMDsgfSAvLyBpbmNsdWRlcyBjb252ZXJ0aW5nIC0wIHRvICswXG4gICAgICBpZiAobGVuID4gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpIHsgcmV0dXJuIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSOyB9XG4gICAgICByZXR1cm4gbGVuO1xuICAgIH0sXG5cbiAgICBTYW1lVmFsdWU6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICBpZiAoYSA9PT0gYikge1xuICAgICAgICAvLyAwID09PSAtMCwgYnV0IHRoZXkgYXJlIG5vdCBpZGVudGljYWwuXG4gICAgICAgIGlmIChhID09PSAwKSB7IHJldHVybiAxIC8gYSA9PT0gMSAvIGI7IH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVtYmVySXNOYU4oYSkgJiYgbnVtYmVySXNOYU4oYik7XG4gICAgfSxcblxuICAgIFNhbWVWYWx1ZVplcm86IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAvLyBzYW1lIGFzIFNhbWVWYWx1ZSBleGNlcHQgZm9yIFNhbWVWYWx1ZVplcm8oKzAsIC0wKSA9PSB0cnVlXG4gICAgICByZXR1cm4gKGEgPT09IGIpIHx8IChudW1iZXJJc05hTihhKSAmJiBudW1iZXJJc05hTihiKSk7XG4gICAgfSxcblxuICAgIElzSXRlcmFibGU6IGZ1bmN0aW9uIChvKSB7XG4gICAgICByZXR1cm4gRVMuVHlwZUlzT2JqZWN0KG8pICYmICh0eXBlb2Ygb1skaXRlcmF0b3IkXSAhPT0gJ3VuZGVmaW5lZCcgfHwgaXNBcmd1bWVudHMobykpO1xuICAgIH0sXG5cbiAgICBHZXRJdGVyYXRvcjogZnVuY3Rpb24gKG8pIHtcbiAgICAgIGlmIChpc0FyZ3VtZW50cyhvKSkge1xuICAgICAgICAvLyBzcGVjaWFsIGNhc2Ugc3VwcG9ydCBmb3IgYGFyZ3VtZW50c2BcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheUl0ZXJhdG9yKG8sICd2YWx1ZScpO1xuICAgICAgfVxuICAgICAgdmFyIGl0Rm4gPSBFUy5HZXRNZXRob2QobywgJGl0ZXJhdG9yJCk7XG4gICAgICBpZiAoIUVTLklzQ2FsbGFibGUoaXRGbikpIHtcbiAgICAgICAgLy8gQmV0dGVyIGRpYWdub3N0aWNzIGlmIGl0Rm4gaXMgbnVsbCBvciB1bmRlZmluZWRcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmFsdWUgaXMgbm90IGFuIGl0ZXJhYmxlJyk7XG4gICAgICB9XG4gICAgICB2YXIgaXQgPSBFUy5DYWxsKGl0Rm4sIG8pO1xuICAgICAgaWYgKCFFUy5UeXBlSXNPYmplY3QoaXQpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2JhZCBpdGVyYXRvcicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl0O1xuICAgIH0sXG5cbiAgICBHZXRNZXRob2Q6IGZ1bmN0aW9uIChvLCBwKSB7XG4gICAgICB2YXIgZnVuYyA9IEVTLlRvT2JqZWN0KG8pW3BdO1xuICAgICAgaWYgKGlzTnVsbE9yVW5kZWZpbmVkKGZ1bmMpKSB7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICB9XG4gICAgICBpZiAoIUVTLklzQ2FsbGFibGUoZnVuYykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTWV0aG9kIG5vdCBjYWxsYWJsZTogJyArIHApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmM7XG4gICAgfSxcblxuICAgIEl0ZXJhdG9yQ29tcGxldGU6IGZ1bmN0aW9uIChpdGVyUmVzdWx0KSB7XG4gICAgICByZXR1cm4gISFpdGVyUmVzdWx0LmRvbmU7XG4gICAgfSxcblxuICAgIEl0ZXJhdG9yQ2xvc2U6IGZ1bmN0aW9uIChpdGVyYXRvciwgY29tcGxldGlvbklzVGhyb3cpIHtcbiAgICAgIHZhciByZXR1cm5NZXRob2QgPSBFUy5HZXRNZXRob2QoaXRlcmF0b3IsICdyZXR1cm4nKTtcbiAgICAgIGlmIChyZXR1cm5NZXRob2QgPT09IHZvaWQgMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgaW5uZXJSZXN1bHQsIGlubmVyRXhjZXB0aW9uO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaW5uZXJSZXN1bHQgPSBFUy5DYWxsKHJldHVybk1ldGhvZCwgaXRlcmF0b3IpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpbm5lckV4Y2VwdGlvbiA9IGU7XG4gICAgICB9XG4gICAgICBpZiAoY29tcGxldGlvbklzVGhyb3cpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGlubmVyRXhjZXB0aW9uKSB7XG4gICAgICAgIHRocm93IGlubmVyRXhjZXB0aW9uO1xuICAgICAgfVxuICAgICAgaWYgKCFFUy5UeXBlSXNPYmplY3QoaW5uZXJSZXN1bHQpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJdGVyYXRvcidzIHJldHVybiBtZXRob2QgcmV0dXJuZWQgYSBub24tb2JqZWN0LlwiKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgSXRlcmF0b3JOZXh0OiBmdW5jdGlvbiAoaXQpIHtcbiAgICAgIHZhciByZXN1bHQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGl0Lm5leHQoYXJndW1lbnRzWzFdKSA6IGl0Lm5leHQoKTtcbiAgICAgIGlmICghRVMuVHlwZUlzT2JqZWN0KHJlc3VsdCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYmFkIGl0ZXJhdG9yJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBJdGVyYXRvclN0ZXA6IGZ1bmN0aW9uIChpdCkge1xuICAgICAgdmFyIHJlc3VsdCA9IEVTLkl0ZXJhdG9yTmV4dChpdCk7XG4gICAgICB2YXIgZG9uZSA9IEVTLkl0ZXJhdG9yQ29tcGxldGUocmVzdWx0KTtcbiAgICAgIHJldHVybiBkb25lID8gZmFsc2UgOiByZXN1bHQ7XG4gICAgfSxcblxuICAgIENvbnN0cnVjdDogZnVuY3Rpb24gKEMsIGFyZ3MsIG5ld1RhcmdldCwgaXNFUzZpbnRlcm5hbCkge1xuICAgICAgdmFyIHRhcmdldCA9IHR5cGVvZiBuZXdUYXJnZXQgPT09ICd1bmRlZmluZWQnID8gQyA6IG5ld1RhcmdldDtcblxuICAgICAgaWYgKCFpc0VTNmludGVybmFsICYmIFJlZmxlY3QuY29uc3RydWN0KSB7XG4gICAgICAgIC8vIFRyeSB0byB1c2UgUmVmbGVjdC5jb25zdHJ1Y3QgaWYgYXZhaWxhYmxlXG4gICAgICAgIHJldHVybiBSZWZsZWN0LmNvbnN0cnVjdChDLCBhcmdzLCB0YXJnZXQpO1xuICAgICAgfVxuICAgICAgLy8gT0ssIHdlIGhhdmUgdG8gZmFrZSBpdC4gIFRoaXMgd2lsbCBvbmx5IHdvcmsgaWYgdGhlXG4gICAgICAvLyBDLltbQ29uc3RydWN0b3JLaW5kXV0gPT0gXCJiYXNlXCIgLS0gYnV0IHRoYXQncyB0aGUgb25seVxuICAgICAgLy8ga2luZCB3ZSBjYW4gbWFrZSBpbiBFUzUgY29kZSBhbnl3YXkuXG5cbiAgICAgIC8vIE9yZGluYXJ5Q3JlYXRlRnJvbUNvbnN0cnVjdG9yKHRhcmdldCwgXCIlT2JqZWN0UHJvdG90eXBlJVwiKVxuICAgICAgdmFyIHByb3RvID0gdGFyZ2V0LnByb3RvdHlwZTtcbiAgICAgIGlmICghRVMuVHlwZUlzT2JqZWN0KHByb3RvKSkge1xuICAgICAgICBwcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG4gICAgICB9XG4gICAgICB2YXIgb2JqID0gY3JlYXRlKHByb3RvKTtcbiAgICAgIC8vIENhbGwgdGhlIGNvbnN0cnVjdG9yLlxuICAgICAgdmFyIHJlc3VsdCA9IEVTLkNhbGwoQywgb2JqLCBhcmdzKTtcbiAgICAgIHJldHVybiBFUy5UeXBlSXNPYmplY3QocmVzdWx0KSA/IHJlc3VsdCA6IG9iajtcbiAgICB9LFxuXG4gICAgU3BlY2llc0NvbnN0cnVjdG9yOiBmdW5jdGlvbiAoTywgZGVmYXVsdENvbnN0cnVjdG9yKSB7XG4gICAgICB2YXIgQyA9IE8uY29uc3RydWN0b3I7XG4gICAgICBpZiAoQyA9PT0gdm9pZCAwKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0Q29uc3RydWN0b3I7XG4gICAgICB9XG4gICAgICBpZiAoIUVTLlR5cGVJc09iamVjdChDKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCYWQgY29uc3RydWN0b3InKTtcbiAgICAgIH1cbiAgICAgIHZhciBTID0gQ1tzeW1ib2xTcGVjaWVzXTtcbiAgICAgIGlmIChpc051bGxPclVuZGVmaW5lZChTKSkge1xuICAgICAgICByZXR1cm4gZGVmYXVsdENvbnN0cnVjdG9yO1xuICAgICAgfVxuICAgICAgaWYgKCFFUy5Jc0NvbnN0cnVjdG9yKFMpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JhZCBAQHNwZWNpZXMnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBTO1xuICAgIH0sXG5cbiAgICBDcmVhdGVIVE1MOiBmdW5jdGlvbiAoc3RyaW5nLCB0YWcsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICAgIHZhciBTID0gRVMuVG9TdHJpbmcoc3RyaW5nKTtcbiAgICAgIHZhciBwMSA9ICc8JyArIHRhZztcbiAgICAgIGlmIChhdHRyaWJ1dGUgIT09ICcnKSB7XG4gICAgICAgIHZhciBWID0gRVMuVG9TdHJpbmcodmFsdWUpO1xuICAgICAgICB2YXIgZXNjYXBlZFYgPSBWLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKTtcbiAgICAgICAgcDEgKz0gJyAnICsgYXR0cmlidXRlICsgJz1cIicgKyBlc2NhcGVkViArICdcIic7XG4gICAgICB9XG4gICAgICB2YXIgcDIgPSBwMSArICc+JztcbiAgICAgIHZhciBwMyA9IHAyICsgUztcbiAgICAgIHJldHVybiBwMyArICc8LycgKyB0YWcgKyAnPic7XG4gICAgfSxcblxuICAgIElzUmVnRXhwOiBmdW5jdGlvbiBJc1JlZ0V4cChhcmd1bWVudCkge1xuICAgICAgaWYgKCFFUy5UeXBlSXNPYmplY3QoYXJndW1lbnQpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHZhciBpc1JlZ0V4cCA9IGFyZ3VtZW50W1N5bWJvbC5tYXRjaF07XG4gICAgICBpZiAodHlwZW9mIGlzUmVnRXhwICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gISFpc1JlZ0V4cDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBUeXBlLnJlZ2V4KGFyZ3VtZW50KTtcbiAgICB9LFxuXG4gICAgVG9TdHJpbmc6IGZ1bmN0aW9uIFRvU3RyaW5nKHN0cmluZykge1xuICAgICAgcmV0dXJuICRTdHJpbmcoc3RyaW5nKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gV2VsbC1rbm93biBTeW1ib2wgc2hpbXNcbiAgaWYgKHN1cHBvcnRzRGVzY3JpcHRvcnMgJiYgaGFzU3ltYm9scykge1xuICAgIHZhciBkZWZpbmVXZWxsS25vd25TeW1ib2wgPSBmdW5jdGlvbiBkZWZpbmVXZWxsS25vd25TeW1ib2wobmFtZSkge1xuICAgICAgaWYgKFR5cGUuc3ltYm9sKFN5bWJvbFtuYW1lXSkpIHtcbiAgICAgICAgcmV0dXJuIFN5bWJvbFtuYW1lXTtcbiAgICAgIH1cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXByb3BlcnRpZXNcbiAgICAgIHZhciBzeW0gPSBTeW1ib2xbJ2ZvciddKCdTeW1ib2wuJyArIG5hbWUpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN5bWJvbCwgbmFtZSwge1xuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogc3ltXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBzeW07XG4gICAgfTtcbiAgICBpZiAoIVR5cGUuc3ltYm9sKFN5bWJvbC5zZWFyY2gpKSB7XG4gICAgICB2YXIgc3ltYm9sU2VhcmNoID0gZGVmaW5lV2VsbEtub3duU3ltYm9sKCdzZWFyY2gnKTtcbiAgICAgIHZhciBvcmlnaW5hbFNlYXJjaCA9IFN0cmluZy5wcm90b3R5cGUuc2VhcmNoO1xuICAgICAgZGVmaW5lUHJvcGVydHkoUmVnRXhwLnByb3RvdHlwZSwgc3ltYm9sU2VhcmNoLCBmdW5jdGlvbiBzZWFyY2goc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBFUy5DYWxsKG9yaWdpbmFsU2VhcmNoLCBzdHJpbmcsIFt0aGlzXSk7XG4gICAgICB9KTtcbiAgICAgIHZhciBzZWFyY2hTaGltID0gZnVuY3Rpb24gc2VhcmNoKHJlZ2V4cCkge1xuICAgICAgICB2YXIgTyA9IEVTLlJlcXVpcmVPYmplY3RDb2VyY2libGUodGhpcyk7XG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQocmVnZXhwKSkge1xuICAgICAgICAgIHZhciBzZWFyY2hlciA9IEVTLkdldE1ldGhvZChyZWdleHAsIHN5bWJvbFNlYXJjaCk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBzZWFyY2hlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBFUy5DYWxsKHNlYXJjaGVyLCByZWdleHAsIFtPXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBFUy5DYWxsKG9yaWdpbmFsU2VhcmNoLCBPLCBbRVMuVG9TdHJpbmcocmVnZXhwKV0pO1xuICAgICAgfTtcbiAgICAgIG92ZXJyaWRlTmF0aXZlKFN0cmluZy5wcm90b3R5cGUsICdzZWFyY2gnLCBzZWFyY2hTaGltKTtcbiAgICB9XG4gICAgaWYgKCFUeXBlLnN5bWJvbChTeW1ib2wucmVwbGFjZSkpIHtcbiAgICAgIHZhciBzeW1ib2xSZXBsYWNlID0gZGVmaW5lV2VsbEtub3duU3ltYm9sKCdyZXBsYWNlJyk7XG4gICAgICB2YXIgb3JpZ2luYWxSZXBsYWNlID0gU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlO1xuICAgICAgZGVmaW5lUHJvcGVydHkoUmVnRXhwLnByb3RvdHlwZSwgc3ltYm9sUmVwbGFjZSwgZnVuY3Rpb24gcmVwbGFjZShzdHJpbmcsIHJlcGxhY2VWYWx1ZSkge1xuICAgICAgICByZXR1cm4gRVMuQ2FsbChvcmlnaW5hbFJlcGxhY2UsIHN0cmluZywgW3RoaXMsIHJlcGxhY2VWYWx1ZV0pO1xuICAgICAgfSk7XG4gICAgICB2YXIgcmVwbGFjZVNoaW0gPSBmdW5jdGlvbiByZXBsYWNlKHNlYXJjaFZhbHVlLCByZXBsYWNlVmFsdWUpIHtcbiAgICAgICAgdmFyIE8gPSBFUy5SZXF1aXJlT2JqZWN0Q29lcmNpYmxlKHRoaXMpO1xuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHNlYXJjaFZhbHVlKSkge1xuICAgICAgICAgIHZhciByZXBsYWNlciA9IEVTLkdldE1ldGhvZChzZWFyY2hWYWx1ZSwgc3ltYm9sUmVwbGFjZSk7XG4gICAgICAgICAgaWYgKHR5cGVvZiByZXBsYWNlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBFUy5DYWxsKHJlcGxhY2VyLCBzZWFyY2hWYWx1ZSwgW08sIHJlcGxhY2VWYWx1ZV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRVMuQ2FsbChvcmlnaW5hbFJlcGxhY2UsIE8sIFtFUy5Ub1N0cmluZyhzZWFyY2hWYWx1ZSksIHJlcGxhY2VWYWx1ZV0pO1xuICAgICAgfTtcbiAgICAgIG92ZXJyaWRlTmF0aXZlKFN0cmluZy5wcm90b3R5cGUsICdyZXBsYWNlJywgcmVwbGFjZVNoaW0pO1xuICAgIH1cbiAgICBpZiAoIVR5cGUuc3ltYm9sKFN5bWJvbC5zcGxpdCkpIHtcbiAgICAgIHZhciBzeW1ib2xTcGxpdCA9IGRlZmluZVdlbGxLbm93blN5bWJvbCgnc3BsaXQnKTtcbiAgICAgIHZhciBvcmlnaW5hbFNwbGl0ID0gU3RyaW5nLnByb3RvdHlwZS5zcGxpdDtcbiAgICAgIGRlZmluZVByb3BlcnR5KFJlZ0V4cC5wcm90b3R5cGUsIHN5bWJvbFNwbGl0LCBmdW5jdGlvbiBzcGxpdChzdHJpbmcsIGxpbWl0KSB7XG4gICAgICAgIHJldHVybiBFUy5DYWxsKG9yaWdpbmFsU3BsaXQsIHN0cmluZywgW3RoaXMsIGxpbWl0XSk7XG4gICAgICB9KTtcbiAgICAgIHZhciBzcGxpdFNoaW0gPSBmdW5jdGlvbiBzcGxpdChzZXBhcmF0b3IsIGxpbWl0KSB7XG4gICAgICAgIHZhciBPID0gRVMuUmVxdWlyZU9iamVjdENvZXJjaWJsZSh0aGlzKTtcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChzZXBhcmF0b3IpKSB7XG4gICAgICAgICAgdmFyIHNwbGl0dGVyID0gRVMuR2V0TWV0aG9kKHNlcGFyYXRvciwgc3ltYm9sU3BsaXQpO1xuICAgICAgICAgIGlmICh0eXBlb2Ygc3BsaXR0ZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gRVMuQ2FsbChzcGxpdHRlciwgc2VwYXJhdG9yLCBbTywgbGltaXRdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEVTLkNhbGwob3JpZ2luYWxTcGxpdCwgTywgW0VTLlRvU3RyaW5nKHNlcGFyYXRvciksIGxpbWl0XSk7XG4gICAgICB9O1xuICAgICAgb3ZlcnJpZGVOYXRpdmUoU3RyaW5nLnByb3RvdHlwZSwgJ3NwbGl0Jywgc3BsaXRTaGltKTtcbiAgICB9XG4gICAgdmFyIHN5bWJvbE1hdGNoRXhpc3RzID0gVHlwZS5zeW1ib2woU3ltYm9sLm1hdGNoKTtcbiAgICB2YXIgc3RyaW5nTWF0Y2hJZ25vcmVzU3ltYm9sTWF0Y2ggPSBzeW1ib2xNYXRjaEV4aXN0cyAmJiAoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gRmlyZWZveCA0MSwgdGhyb3VnaCBOaWdodGx5IDQ1IGhhcyBTeW1ib2wubWF0Y2gsIGJ1dCBTdHJpbmcjbWF0Y2ggaWdub3JlcyBpdC5cbiAgICAgIC8vIEZpcmVmb3ggNDAgYW5kIGJlbG93IGhhdmUgU3ltYm9sLm1hdGNoIGJ1dCBTdHJpbmcjbWF0Y2ggd29ya3MgZmluZS5cbiAgICAgIHZhciBvID0ge307XG4gICAgICBvW1N5bWJvbC5tYXRjaF0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MjsgfTtcbiAgICAgIHJldHVybiAnYScubWF0Y2gobykgIT09IDQyO1xuICAgIH0oKSk7XG4gICAgaWYgKCFzeW1ib2xNYXRjaEV4aXN0cyB8fCBzdHJpbmdNYXRjaElnbm9yZXNTeW1ib2xNYXRjaCkge1xuICAgICAgdmFyIHN5bWJvbE1hdGNoID0gZGVmaW5lV2VsbEtub3duU3ltYm9sKCdtYXRjaCcpO1xuXG4gICAgICB2YXIgb3JpZ2luYWxNYXRjaCA9IFN0cmluZy5wcm90b3R5cGUubWF0Y2g7XG4gICAgICBkZWZpbmVQcm9wZXJ0eShSZWdFeHAucHJvdG90eXBlLCBzeW1ib2xNYXRjaCwgZnVuY3Rpb24gbWF0Y2goc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBFUy5DYWxsKG9yaWdpbmFsTWF0Y2gsIHN0cmluZywgW3RoaXNdKTtcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgbWF0Y2hTaGltID0gZnVuY3Rpb24gbWF0Y2gocmVnZXhwKSB7XG4gICAgICAgIHZhciBPID0gRVMuUmVxdWlyZU9iamVjdENvZXJjaWJsZSh0aGlzKTtcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChyZWdleHApKSB7XG4gICAgICAgICAgdmFyIG1hdGNoZXIgPSBFUy5HZXRNZXRob2QocmVnZXhwLCBzeW1ib2xNYXRjaCk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBtYXRjaGVyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIEVTLkNhbGwobWF0Y2hlciwgcmVnZXhwLCBbT10pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRVMuQ2FsbChvcmlnaW5hbE1hdGNoLCBPLCBbRVMuVG9TdHJpbmcocmVnZXhwKV0pO1xuICAgICAgfTtcbiAgICAgIG92ZXJyaWRlTmF0aXZlKFN0cmluZy5wcm90b3R5cGUsICdtYXRjaCcsIG1hdGNoU2hpbSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIHdyYXBDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uIHdyYXBDb25zdHJ1Y3RvcihvcmlnaW5hbCwgcmVwbGFjZW1lbnQsIGtleXNUb1NraXApIHtcbiAgICBWYWx1ZS5wcmVzZXJ2ZVRvU3RyaW5nKHJlcGxhY2VtZW50LCBvcmlnaW5hbCk7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgLy8gc2V0cyB1cCBwcm9wZXIgcHJvdG90eXBlIGNoYWluIHdoZXJlIHBvc3NpYmxlXG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2Yob3JpZ2luYWwsIHJlcGxhY2VtZW50KTtcbiAgICB9XG4gICAgaWYgKHN1cHBvcnRzRGVzY3JpcHRvcnMpIHtcbiAgICAgIF9mb3JFYWNoKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9yaWdpbmFsKSwgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAoa2V5IGluIG5vb3AgfHwga2V5c1RvU2tpcFtrZXldKSB7IHJldHVybjsgfVxuICAgICAgICBWYWx1ZS5wcm94eShvcmlnaW5hbCwga2V5LCByZXBsYWNlbWVudCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgX2ZvckVhY2goT2JqZWN0LmtleXMob3JpZ2luYWwpLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmIChrZXkgaW4gbm9vcCB8fCBrZXlzVG9Ta2lwW2tleV0pIHsgcmV0dXJuOyB9XG4gICAgICAgIHJlcGxhY2VtZW50W2tleV0gPSBvcmlnaW5hbFtrZXldO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJlcGxhY2VtZW50LnByb3RvdHlwZSA9IG9yaWdpbmFsLnByb3RvdHlwZTtcbiAgICBWYWx1ZS5yZWRlZmluZShvcmlnaW5hbC5wcm90b3R5cGUsICdjb25zdHJ1Y3RvcicsIHJlcGxhY2VtZW50KTtcbiAgfTtcblxuICB2YXIgZGVmYXVsdFNwZWNpZXNHZXR0ZXIgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuICB2YXIgYWRkRGVmYXVsdFNwZWNpZXMgPSBmdW5jdGlvbiAoQykge1xuICAgIGlmIChzdXBwb3J0c0Rlc2NyaXB0b3JzICYmICFfaGFzT3duUHJvcGVydHkoQywgc3ltYm9sU3BlY2llcykpIHtcbiAgICAgIFZhbHVlLmdldHRlcihDLCBzeW1ib2xTcGVjaWVzLCBkZWZhdWx0U3BlY2llc0dldHRlcik7XG4gICAgfVxuICB9O1xuXG4gIHZhciBhZGRJdGVyYXRvciA9IGZ1bmN0aW9uIChwcm90b3R5cGUsIGltcGwpIHtcbiAgICB2YXIgaW1wbGVtZW50YXRpb24gPSBpbXBsIHx8IGZ1bmN0aW9uIGl0ZXJhdG9yKCkgeyByZXR1cm4gdGhpczsgfTtcbiAgICBkZWZpbmVQcm9wZXJ0eShwcm90b3R5cGUsICRpdGVyYXRvciQsIGltcGxlbWVudGF0aW9uKTtcbiAgICBpZiAoIXByb3RvdHlwZVskaXRlcmF0b3IkXSAmJiBUeXBlLnN5bWJvbCgkaXRlcmF0b3IkKSkge1xuICAgICAgLy8gaW1wbGVtZW50YXRpb25zIGFyZSBidWdneSB3aGVuICRpdGVyYXRvciQgaXMgYSBTeW1ib2xcbiAgICAgIHByb3RvdHlwZVskaXRlcmF0b3IkXSA9IGltcGxlbWVudGF0aW9uO1xuICAgIH1cbiAgfTtcblxuICB2YXIgY3JlYXRlRGF0YVByb3BlcnR5ID0gZnVuY3Rpb24gY3JlYXRlRGF0YVByb3BlcnR5KG9iamVjdCwgbmFtZSwgdmFsdWUpIHtcbiAgICBpZiAoc3VwcG9ydHNEZXNjcmlwdG9ycykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmplY3RbbmFtZV0gPSB2YWx1ZTtcbiAgICB9XG4gIH07XG4gIHZhciBjcmVhdGVEYXRhUHJvcGVydHlPclRocm93ID0gZnVuY3Rpb24gY3JlYXRlRGF0YVByb3BlcnR5T3JUaHJvdyhvYmplY3QsIG5hbWUsIHZhbHVlKSB7XG4gICAgY3JlYXRlRGF0YVByb3BlcnR5KG9iamVjdCwgbmFtZSwgdmFsdWUpO1xuICAgIGlmICghRVMuU2FtZVZhbHVlKG9iamVjdFtuYW1lXSwgdmFsdWUpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdwcm9wZXJ0eSBpcyBub25jb25maWd1cmFibGUnKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGVtdWxhdGVFUzZjb25zdHJ1Y3QgPSBmdW5jdGlvbiAobywgZGVmYXVsdE5ld1RhcmdldCwgZGVmYXVsdFByb3RvLCBzbG90cykge1xuICAgIC8vIFRoaXMgaXMgYW4gZXM1IGFwcHJveGltYXRpb24gdG8gZXM2IGNvbnN0cnVjdCBzZW1hbnRpY3MuICBpbiBlczYsXG4gICAgLy8gJ25ldyBGb28nIGludm9rZXMgRm9vLltbQ29uc3RydWN0XV0gd2hpY2ggKGZvciBhbG1vc3QgYWxsIG9iamVjdHMpXG4gICAgLy8ganVzdCBzZXRzIHRoZSBpbnRlcm5hbCB2YXJpYWJsZSBOZXdUYXJnZXQgKGluIGVzNiBzeW50YXggYG5ldy50YXJnZXRgKVxuICAgIC8vIHRvIEZvbyBhbmQgdGhlbiByZXR1cm5zIEZvbygpLlxuXG4gICAgLy8gTWFueSBFUzYgb2JqZWN0IHRoZW4gaGF2ZSBjb25zdHJ1Y3RvcnMgb2YgdGhlIGZvcm06XG4gICAgLy8gMS4gSWYgTmV3VGFyZ2V0IGlzIHVuZGVmaW5lZCwgdGhyb3cgYSBUeXBlRXJyb3IgZXhjZXB0aW9uXG4gICAgLy8gMi4gTGV0IHh4eCBieSBPcmRpbmFyeUNyZWF0ZUZyb21Db25zdHJ1Y3RvcihOZXdUYXJnZXQsIHl5eSwgenp6KVxuXG4gICAgLy8gU28gd2UncmUgZ29pbmcgdG8gZW11bGF0ZSB0aG9zZSBmaXJzdCB0d28gc3RlcHMuXG4gICAgaWYgKCFFUy5UeXBlSXNPYmplY3QobykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0NvbnN0cnVjdG9yIHJlcXVpcmVzIGBuZXdgOiAnICsgZGVmYXVsdE5ld1RhcmdldC5uYW1lKTtcbiAgICB9XG4gICAgdmFyIHByb3RvID0gZGVmYXVsdE5ld1RhcmdldC5wcm90b3R5cGU7XG4gICAgaWYgKCFFUy5UeXBlSXNPYmplY3QocHJvdG8pKSB7XG4gICAgICBwcm90byA9IGRlZmF1bHRQcm90bztcbiAgICB9XG4gICAgdmFyIG9iaiA9IGNyZWF0ZShwcm90byk7XG4gICAgZm9yICh2YXIgbmFtZSBpbiBzbG90cykge1xuICAgICAgaWYgKF9oYXNPd25Qcm9wZXJ0eShzbG90cywgbmFtZSkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gc2xvdHNbbmFtZV07XG4gICAgICAgIGRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwgdmFsdWUsIHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIEZpcmVmb3ggMzEgcmVwb3J0cyB0aGlzIGZ1bmN0aW9uJ3MgbGVuZ3RoIGFzIDBcbiAgLy8gaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTA2MjQ4NFxuICBpZiAoU3RyaW5nLmZyb21Db2RlUG9pbnQgJiYgU3RyaW5nLmZyb21Db2RlUG9pbnQubGVuZ3RoICE9PSAxKSB7XG4gICAgdmFyIG9yaWdpbmFsRnJvbUNvZGVQb2ludCA9IFN0cmluZy5mcm9tQ29kZVBvaW50O1xuICAgIG92ZXJyaWRlTmF0aXZlKFN0cmluZywgJ2Zyb21Db2RlUG9pbnQnLCBmdW5jdGlvbiBmcm9tQ29kZVBvaW50KGNvZGVQb2ludHMpIHtcbiAgICAgIHJldHVybiBFUy5DYWxsKG9yaWdpbmFsRnJvbUNvZGVQb2ludCwgdGhpcywgYXJndW1lbnRzKTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBTdHJpbmdTaGltcyA9IHtcbiAgICBmcm9tQ29kZVBvaW50OiBmdW5jdGlvbiBmcm9tQ29kZVBvaW50KGNvZGVQb2ludHMpIHtcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgIHZhciBuZXh0O1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBuZXh0ID0gTnVtYmVyKGFyZ3VtZW50c1tpXSk7XG4gICAgICAgIGlmICghRVMuU2FtZVZhbHVlKG5leHQsIEVTLlRvSW50ZWdlcihuZXh0KSkgfHwgbmV4dCA8IDAgfHwgbmV4dCA+IDB4MTBGRkZGKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludCAnICsgbmV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV4dCA8IDB4MTAwMDApIHtcbiAgICAgICAgICBfcHVzaChyZXN1bHQsIFN0cmluZy5mcm9tQ2hhckNvZGUobmV4dCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5leHQgLT0gMHgxMDAwMDtcbiAgICAgICAgICBfcHVzaChyZXN1bHQsIFN0cmluZy5mcm9tQ2hhckNvZGUoKG5leHQgPj4gMTApICsgMHhEODAwKSk7XG4gICAgICAgICAgX3B1c2gocmVzdWx0LCBTdHJpbmcuZnJvbUNoYXJDb2RlKChuZXh0ICUgMHg0MDApICsgMHhEQzAwKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQuam9pbignJyk7XG4gICAgfSxcblxuICAgIHJhdzogZnVuY3Rpb24gcmF3KGNhbGxTaXRlKSB7XG4gICAgICB2YXIgY29va2VkID0gRVMuVG9PYmplY3QoY2FsbFNpdGUsICdiYWQgY2FsbFNpdGUnKTtcbiAgICAgIHZhciByYXdTdHJpbmcgPSBFUy5Ub09iamVjdChjb29rZWQucmF3LCAnYmFkIHJhdyB2YWx1ZScpO1xuICAgICAgdmFyIGxlbiA9IHJhd1N0cmluZy5sZW5ndGg7XG4gICAgICB2YXIgbGl0ZXJhbHNlZ21lbnRzID0gRVMuVG9MZW5ndGgobGVuKTtcbiAgICAgIGlmIChsaXRlcmFsc2VnbWVudHMgPD0gMCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG5cbiAgICAgIHZhciBzdHJpbmdFbGVtZW50cyA9IFtdO1xuICAgICAgdmFyIG5leHRJbmRleCA9IDA7XG4gICAgICB2YXIgbmV4dEtleSwgbmV4dCwgbmV4dFNlZywgbmV4dFN1YjtcbiAgICAgIHdoaWxlIChuZXh0SW5kZXggPCBsaXRlcmFsc2VnbWVudHMpIHtcbiAgICAgICAgbmV4dEtleSA9IEVTLlRvU3RyaW5nKG5leHRJbmRleCk7XG4gICAgICAgIG5leHRTZWcgPSBFUy5Ub1N0cmluZyhyYXdTdHJpbmdbbmV4dEtleV0pO1xuICAgICAgICBfcHVzaChzdHJpbmdFbGVtZW50cywgbmV4dFNlZyk7XG4gICAgICAgIGlmIChuZXh0SW5kZXggKyAxID49IGxpdGVyYWxzZWdtZW50cykge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG5leHQgPSBuZXh0SW5kZXggKyAxIDwgYXJndW1lbnRzLmxlbmd0aCA/IGFyZ3VtZW50c1tuZXh0SW5kZXggKyAxXSA6ICcnO1xuICAgICAgICBuZXh0U3ViID0gRVMuVG9TdHJpbmcobmV4dCk7XG4gICAgICAgIF9wdXNoKHN0cmluZ0VsZW1lbnRzLCBuZXh0U3ViKTtcbiAgICAgICAgbmV4dEluZGV4ICs9IDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RyaW5nRWxlbWVudHMuam9pbignJyk7XG4gICAgfVxuICB9O1xuICBpZiAoU3RyaW5nLnJhdyAmJiBTdHJpbmcucmF3KHsgcmF3OiB7IDA6ICd4JywgMTogJ3knLCBsZW5ndGg6IDIgfSB9KSAhPT0gJ3h5Jykge1xuICAgIC8vIElFIDExIFRQIGhhcyBhIGJyb2tlbiBTdHJpbmcucmF3IGltcGxlbWVudGF0aW9uXG4gICAgb3ZlcnJpZGVOYXRpdmUoU3RyaW5nLCAncmF3JywgU3RyaW5nU2hpbXMucmF3KTtcbiAgfVxuICBkZWZpbmVQcm9wZXJ0aWVzKFN0cmluZywgU3RyaW5nU2hpbXMpO1xuXG4gIC8vIEZhc3QgcmVwZWF0LCB1c2VzIHRoZSBgRXhwb25lbnRpYXRpb24gYnkgc3F1YXJpbmdgIGFsZ29yaXRobS5cbiAgLy8gUGVyZjogaHR0cDovL2pzcGVyZi5jb20vc3RyaW5nLXJlcGVhdDIvMlxuICB2YXIgc3RyaW5nUmVwZWF0ID0gZnVuY3Rpb24gcmVwZWF0KHMsIHRpbWVzKSB7XG4gICAgaWYgKHRpbWVzIDwgMSkgeyByZXR1cm4gJyc7IH1cbiAgICBpZiAodGltZXMgJSAyKSB7IHJldHVybiByZXBlYXQocywgdGltZXMgLSAxKSArIHM7IH1cbiAgICB2YXIgaGFsZiA9IHJlcGVhdChzLCB0aW1lcyAvIDIpO1xuICAgIHJldHVybiBoYWxmICsgaGFsZjtcbiAgfTtcbiAgdmFyIHN0cmluZ01heExlbmd0aCA9IEluZmluaXR5O1xuXG4gIHZhciBTdHJpbmdQcm90b3R5cGVTaGltcyA9IHtcbiAgICByZXBlYXQ6IGZ1bmN0aW9uIHJlcGVhdCh0aW1lcykge1xuICAgICAgdmFyIHRoaXNTdHIgPSBFUy5Ub1N0cmluZyhFUy5SZXF1aXJlT2JqZWN0Q29lcmNpYmxlKHRoaXMpKTtcbiAgICAgIHZhciBudW1UaW1lcyA9IEVTLlRvSW50ZWdlcih0aW1lcyk7XG4gICAgICBpZiAobnVtVGltZXMgPCAwIHx8IG51bVRpbWVzID49IHN0cmluZ01heExlbmd0aCkge1xuICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcigncmVwZWF0IGNvdW50IG11c3QgYmUgbGVzcyB0aGFuIGluZmluaXR5IGFuZCBub3Qgb3ZlcmZsb3cgbWF4aW11bSBzdHJpbmcgc2l6ZScpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0cmluZ1JlcGVhdCh0aGlzU3RyLCBudW1UaW1lcyk7XG4gICAgfSxcblxuICAgIHN0YXJ0c1dpdGg6IGZ1bmN0aW9uIHN0YXJ0c1dpdGgoc2VhcmNoU3RyaW5nKSB7XG4gICAgICB2YXIgUyA9IEVTLlRvU3RyaW5nKEVTLlJlcXVpcmVPYmplY3RDb2VyY2libGUodGhpcykpO1xuICAgICAgaWYgKEVTLklzUmVnRXhwKHNlYXJjaFN0cmluZykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgbWV0aG9kIFwic3RhcnRzV2l0aFwiIHdpdGggYSByZWdleCcpO1xuICAgICAgfVxuICAgICAgdmFyIHNlYXJjaFN0ciA9IEVTLlRvU3RyaW5nKHNlYXJjaFN0cmluZyk7XG4gICAgICB2YXIgcG9zaXRpb247XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgcG9zaXRpb24gPSBhcmd1bWVudHNbMV07XG4gICAgICB9XG4gICAgICB2YXIgc3RhcnQgPSBfbWF4KEVTLlRvSW50ZWdlcihwb3NpdGlvbiksIDApO1xuICAgICAgcmV0dXJuIF9zdHJTbGljZShTLCBzdGFydCwgc3RhcnQgKyBzZWFyY2hTdHIubGVuZ3RoKSA9PT0gc2VhcmNoU3RyO1xuICAgIH0sXG5cbiAgICBlbmRzV2l0aDogZnVuY3Rpb24gZW5kc1dpdGgoc2VhcmNoU3RyaW5nKSB7XG4gICAgICB2YXIgUyA9IEVTLlRvU3RyaW5nKEVTLlJlcXVpcmVPYmplY3RDb2VyY2libGUodGhpcykpO1xuICAgICAgaWYgKEVTLklzUmVnRXhwKHNlYXJjaFN0cmluZykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgbWV0aG9kIFwiZW5kc1dpdGhcIiB3aXRoIGEgcmVnZXgnKTtcbiAgICAgIH1cbiAgICAgIHZhciBzZWFyY2hTdHIgPSBFUy5Ub1N0cmluZyhzZWFyY2hTdHJpbmcpO1xuICAgICAgdmFyIGxlbiA9IFMubGVuZ3RoO1xuICAgICAgdmFyIGVuZFBvc2l0aW9uO1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGVuZFBvc2l0aW9uID0gYXJndW1lbnRzWzFdO1xuICAgICAgfVxuICAgICAgdmFyIHBvcyA9IHR5cGVvZiBlbmRQb3NpdGlvbiA9PT0gJ3VuZGVmaW5lZCcgPyBsZW4gOiBFUy5Ub0ludGVnZXIoZW5kUG9zaXRpb24pO1xuICAgICAgdmFyIGVuZCA9IF9taW4oX21heChwb3MsIDApLCBsZW4pO1xuICAgICAgcmV0dXJuIF9zdHJTbGljZShTLCBlbmQgLSBzZWFyY2hTdHIubGVuZ3RoLCBlbmQpID09PSBzZWFyY2hTdHI7XG4gICAgfSxcblxuICAgIGluY2x1ZGVzOiBmdW5jdGlvbiBpbmNsdWRlcyhzZWFyY2hTdHJpbmcpIHtcbiAgICAgIGlmIChFUy5Jc1JlZ0V4cChzZWFyY2hTdHJpbmcpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiaW5jbHVkZXNcIiBkb2VzIG5vdCBhY2NlcHQgYSBSZWdFeHAnKTtcbiAgICAgIH1cbiAgICAgIHZhciBzZWFyY2hTdHIgPSBFUy5Ub1N0cmluZyhzZWFyY2hTdHJpbmcpO1xuICAgICAgdmFyIHBvc2l0aW9uO1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHBvc2l0aW9uID0gYXJndW1lbnRzWzFdO1xuICAgICAgfVxuICAgICAgLy8gU29tZWhvdyB0aGlzIHRyaWNrIG1ha2VzIG1ldGhvZCAxMDAlIGNvbXBhdCB3aXRoIHRoZSBzcGVjLlxuICAgICAgcmV0dXJuIF9pbmRleE9mKHRoaXMsIHNlYXJjaFN0ciwgcG9zaXRpb24pICE9PSAtMTtcbiAgICB9LFxuXG4gICAgY29kZVBvaW50QXQ6IGZ1bmN0aW9uIGNvZGVQb2ludEF0KHBvcykge1xuICAgICAgdmFyIHRoaXNTdHIgPSBFUy5Ub1N0cmluZyhFUy5SZXF1aXJlT2JqZWN0Q29lcmNpYmxlKHRoaXMpKTtcbiAgICAgIHZhciBwb3NpdGlvbiA9IEVTLlRvSW50ZWdlcihwb3MpO1xuICAgICAgdmFyIGxlbmd0aCA9IHRoaXNTdHIubGVuZ3RoO1xuICAgICAgaWYgKHBvc2l0aW9uID49IDAgJiYgcG9zaXRpb24gPCBsZW5ndGgpIHtcbiAgICAgICAgdmFyIGZpcnN0ID0gdGhpc1N0ci5jaGFyQ29kZUF0KHBvc2l0aW9uKTtcbiAgICAgICAgdmFyIGlzRW5kID0gcG9zaXRpb24gKyAxID09PSBsZW5ndGg7XG4gICAgICAgIGlmIChmaXJzdCA8IDB4RDgwMCB8fCBmaXJzdCA+IDB4REJGRiB8fCBpc0VuZCkgeyByZXR1cm4gZmlyc3Q7IH1cbiAgICAgICAgdmFyIHNlY29uZCA9IHRoaXNTdHIuY2hhckNvZGVBdChwb3NpdGlvbiArIDEpO1xuICAgICAgICBpZiAoc2Vjb25kIDwgMHhEQzAwIHx8IHNlY29uZCA+IDB4REZGRikgeyByZXR1cm4gZmlyc3Q7IH1cbiAgICAgICAgcmV0dXJuICgoZmlyc3QgLSAweEQ4MDApICogMTAyNCkgKyAoc2Vjb25kIC0gMHhEQzAwKSArIDB4MTAwMDA7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBpZiAoU3RyaW5nLnByb3RvdHlwZS5pbmNsdWRlcyAmJiAnYScuaW5jbHVkZXMoJ2EnLCBJbmZpbml0eSkgIT09IGZhbHNlKSB7XG4gICAgb3ZlcnJpZGVOYXRpdmUoU3RyaW5nLnByb3RvdHlwZSwgJ2luY2x1ZGVzJywgU3RyaW5nUHJvdG90eXBlU2hpbXMuaW5jbHVkZXMpO1xuICB9XG5cbiAgaWYgKFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCAmJiBTdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoKSB7XG4gICAgdmFyIHN0YXJ0c1dpdGhSZWplY3RzUmVnZXggPSB0aHJvd3NFcnJvcihmdW5jdGlvbiAoKSB7XG4gICAgICAvKiB0aHJvd3MgaWYgc3BlYy1jb21wbGlhbnQgKi9cbiAgICAgICcvYS8nLnN0YXJ0c1dpdGgoL2EvKTtcbiAgICB9KTtcbiAgICB2YXIgc3RhcnRzV2l0aEhhbmRsZXNJbmZpbml0eSA9IHZhbHVlT3JGYWxzZUlmVGhyb3dzKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAnYWJjJy5zdGFydHNXaXRoKCdhJywgSW5maW5pdHkpID09PSBmYWxzZTtcbiAgICB9KTtcbiAgICBpZiAoIXN0YXJ0c1dpdGhSZWplY3RzUmVnZXggfHwgIXN0YXJ0c1dpdGhIYW5kbGVzSW5maW5pdHkpIHtcbiAgICAgIC8vIEZpcmVmb3ggKDwgMzc/KSBhbmQgSUUgMTEgVFAgaGF2ZSBhIG5vbmNvbXBsaWFudCBzdGFydHNXaXRoIGltcGxlbWVudGF0aW9uXG4gICAgICBvdmVycmlkZU5hdGl2ZShTdHJpbmcucHJvdG90eXBlLCAnc3RhcnRzV2l0aCcsIFN0cmluZ1Byb3RvdHlwZVNoaW1zLnN0YXJ0c1dpdGgpO1xuICAgICAgb3ZlcnJpZGVOYXRpdmUoU3RyaW5nLnByb3RvdHlwZSwgJ2VuZHNXaXRoJywgU3RyaW5nUHJvdG90eXBlU2hpbXMuZW5kc1dpdGgpO1xuICAgIH1cbiAgfVxuICBpZiAoaGFzU3ltYm9scykge1xuICAgIHZhciBzdGFydHNXaXRoU3VwcG9ydHNTeW1ib2xNYXRjaCA9IHZhbHVlT3JGYWxzZUlmVGhyb3dzKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciByZSA9IC9hLztcbiAgICAgIHJlW1N5bWJvbC5tYXRjaF0gPSBmYWxzZTtcbiAgICAgIHJldHVybiAnL2EvJy5zdGFydHNXaXRoKHJlKTtcbiAgICB9KTtcbiAgICBpZiAoIXN0YXJ0c1dpdGhTdXBwb3J0c1N5bWJvbE1hdGNoKSB7XG4gICAgICBvdmVycmlkZU5hdGl2ZShTdHJpbmcucHJvdG90eXBlLCAnc3RhcnRzV2l0aCcsIFN0cmluZ1Byb3RvdHlwZVNoaW1zLnN0YXJ0c1dpdGgpO1xuICAgIH1cbiAgICB2YXIgZW5kc1dpdGhTdXBwb3J0c1N5bWJvbE1hdGNoID0gdmFsdWVPckZhbHNlSWZUaHJvd3MoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHJlID0gL2EvO1xuICAgICAgcmVbU3ltYm9sLm1hdGNoXSA9IGZhbHNlO1xuICAgICAgcmV0dXJuICcvYS8nLmVuZHNXaXRoKHJlKTtcbiAgICB9KTtcbiAgICBpZiAoIWVuZHNXaXRoU3VwcG9ydHNTeW1ib2xNYXRjaCkge1xuICAgICAgb3ZlcnJpZGVOYXRpdmUoU3RyaW5nLnByb3RvdHlwZSwgJ2VuZHNXaXRoJywgU3RyaW5nUHJvdG90eXBlU2hpbXMuZW5kc1dpdGgpO1xuICAgIH1cbiAgICB2YXIgaW5jbHVkZXNTdXBwb3J0c1N5bWJvbE1hdGNoID0gdmFsdWVPckZhbHNlSWZUaHJvd3MoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHJlID0gL2EvO1xuICAgICAgcmVbU3ltYm9sLm1hdGNoXSA9IGZhbHNlO1xuICAgICAgcmV0dXJuICcvYS8nLmluY2x1ZGVzKHJlKTtcbiAgICB9KTtcbiAgICBpZiAoIWluY2x1ZGVzU3VwcG9ydHNTeW1ib2xNYXRjaCkge1xuICAgICAgb3ZlcnJpZGVOYXRpdmUoU3RyaW5nLnByb3RvdHlwZSwgJ2luY2x1ZGVzJywgU3RyaW5nUHJvdG90eXBlU2hpbXMuaW5jbHVkZXMpO1xuICAgIH1cbiAgfVxuXG4gIGRlZmluZVByb3BlcnRpZXMoU3RyaW5nLnByb3RvdHlwZSwgU3RyaW5nUHJvdG90eXBlU2hpbXMpO1xuXG4gIC8vIHdoaXRlc3BhY2UgZnJvbTogaHR0cDovL2VzNS5naXRodWIuaW8vI3gxNS41LjQuMjBcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW0vYmxvYi92My40LjAvZXM1LXNoaW0uanMjTDEzMDQtTDEzMjRcbiAgdmFyIHdzID0gW1xuICAgICdcXHgwOVxceDBBXFx4MEJcXHgwQ1xceDBEXFx4MjBcXHhBMFxcdTE2ODBcXHUxODBFXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwMycsXG4gICAgJ1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMEFcXHUyMDJGXFx1MjA1RlxcdTMwMDBcXHUyMDI4JyxcbiAgICAnXFx1MjAyOVxcdUZFRkYnXG4gIF0uam9pbignJyk7XG4gIHZhciB0cmltUmVnZXhwID0gbmV3IFJlZ0V4cCgnKF5bJyArIHdzICsgJ10rKXwoWycgKyB3cyArICddKyQpJywgJ2cnKTtcbiAgdmFyIHRyaW1TaGltID0gZnVuY3Rpb24gdHJpbSgpIHtcbiAgICByZXR1cm4gRVMuVG9TdHJpbmcoRVMuUmVxdWlyZU9iamVjdENvZXJjaWJsZSh0aGlzKSkucmVwbGFjZSh0cmltUmVnZXhwLCAnJyk7XG4gIH07XG4gIHZhciBub25XUyA9IFsnXFx1MDA4NScsICdcXHUyMDBiJywgJ1xcdWZmZmUnXS5qb2luKCcnKTtcbiAgdmFyIG5vbldTcmVnZXggPSBuZXcgUmVnRXhwKCdbJyArIG5vbldTICsgJ10nLCAnZycpO1xuICB2YXIgaXNCYWRIZXhSZWdleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuICB2YXIgaGFzU3RyaW5nVHJpbUJ1ZyA9IG5vbldTLnRyaW0oKS5sZW5ndGggIT09IG5vbldTLmxlbmd0aDtcbiAgZGVmaW5lUHJvcGVydHkoU3RyaW5nLnByb3RvdHlwZSwgJ3RyaW0nLCB0cmltU2hpbSwgaGFzU3RyaW5nVHJpbUJ1Zyk7XG5cbiAgLy8gR2l2ZW4gYW4gYXJndW1lbnQgeCwgaXQgd2lsbCByZXR1cm4gYW4gSXRlcmF0b3JSZXN1bHQgb2JqZWN0LFxuICAvLyB3aXRoIHZhbHVlIHNldCB0byB4IGFuZCBkb25lIHRvIGZhbHNlLlxuICAvLyBHaXZlbiBubyBhcmd1bWVudHMsIGl0IHdpbGwgcmV0dXJuIGFuIGl0ZXJhdG9yIGNvbXBsZXRpb24gb2JqZWN0LlxuICB2YXIgaXRlcmF0b3JSZXN1bHQgPSBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB4LCBkb25lOiBhcmd1bWVudHMubGVuZ3RoID09PSAwIH07XG4gIH07XG5cbiAgLy8gc2VlIGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1zdHJpbmcucHJvdG90eXBlLUBAaXRlcmF0b3JcbiAgdmFyIFN0cmluZ0l0ZXJhdG9yID0gZnVuY3Rpb24gKHMpIHtcbiAgICBFUy5SZXF1aXJlT2JqZWN0Q29lcmNpYmxlKHMpO1xuICAgIHRoaXMuX3MgPSBFUy5Ub1N0cmluZyhzKTtcbiAgICB0aGlzLl9pID0gMDtcbiAgfTtcbiAgU3RyaW5nSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHMgPSB0aGlzLl9zO1xuICAgIHZhciBpID0gdGhpcy5faTtcbiAgICBpZiAodHlwZW9mIHMgPT09ICd1bmRlZmluZWQnIHx8IGkgPj0gcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuX3MgPSB2b2lkIDA7XG4gICAgICByZXR1cm4gaXRlcmF0b3JSZXN1bHQoKTtcbiAgICB9XG4gICAgdmFyIGZpcnN0ID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHZhciBzZWNvbmQsIGxlbjtcbiAgICBpZiAoZmlyc3QgPCAweEQ4MDAgfHwgZmlyc3QgPiAweERCRkYgfHwgKGkgKyAxKSA9PT0gcy5sZW5ndGgpIHtcbiAgICAgIGxlbiA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlY29uZCA9IHMuY2hhckNvZGVBdChpICsgMSk7XG4gICAgICBsZW4gPSAoc2Vjb25kIDwgMHhEQzAwIHx8IHNlY29uZCA+IDB4REZGRikgPyAxIDogMjtcbiAgICB9XG4gICAgdGhpcy5faSA9IGkgKyBsZW47XG4gICAgcmV0dXJuIGl0ZXJhdG9yUmVzdWx0KHMuc3Vic3RyKGksIGxlbikpO1xuICB9O1xuICBhZGRJdGVyYXRvcihTdHJpbmdJdGVyYXRvci5wcm90b3R5cGUpO1xuICBhZGRJdGVyYXRvcihTdHJpbmcucHJvdG90eXBlLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBTdHJpbmdJdGVyYXRvcih0aGlzKTtcbiAgfSk7XG5cbiAgdmFyIEFycmF5U2hpbXMgPSB7XG4gICAgZnJvbTogZnVuY3Rpb24gZnJvbShpdGVtcykge1xuICAgICAgdmFyIEMgPSB0aGlzO1xuICAgICAgdmFyIG1hcEZuO1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIG1hcEZuID0gYXJndW1lbnRzWzFdO1xuICAgICAgfVxuICAgICAgdmFyIG1hcHBpbmcsIFQ7XG4gICAgICBpZiAodHlwZW9mIG1hcEZuID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBtYXBwaW5nID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIUVTLklzQ2FsbGFibGUobWFwRm4pKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkuZnJvbTogd2hlbiBwcm92aWRlZCwgdGhlIHNlY29uZCBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICBUID0gYXJndW1lbnRzWzJdO1xuICAgICAgICB9XG4gICAgICAgIG1hcHBpbmcgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBOb3RlIHRoYXQgdGhhdCBBcnJheXMgd2lsbCB1c2UgQXJyYXlJdGVyYXRvcjpcbiAgICAgIC8vIGh0dHBzOi8vYnVncy5lY21hc2NyaXB0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MjQxNlxuICAgICAgdmFyIHVzaW5nSXRlcmF0b3IgPSB0eXBlb2YgKGlzQXJndW1lbnRzKGl0ZW1zKSB8fCBFUy5HZXRNZXRob2QoaXRlbXMsICRpdGVyYXRvciQpKSAhPT0gJ3VuZGVmaW5lZCc7XG5cbiAgICAgIHZhciBsZW5ndGgsIHJlc3VsdCwgaTtcbiAgICAgIGlmICh1c2luZ0l0ZXJhdG9yKSB7XG4gICAgICAgIHJlc3VsdCA9IEVTLklzQ29uc3RydWN0b3IoQykgPyBPYmplY3QobmV3IEMoKSkgOiBbXTtcbiAgICAgICAgdmFyIGl0ZXJhdG9yID0gRVMuR2V0SXRlcmF0b3IoaXRlbXMpO1xuICAgICAgICB2YXIgbmV4dCwgbmV4dFZhbHVlO1xuXG4gICAgICAgIGkgPSAwO1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgIG5leHQgPSBFUy5JdGVyYXRvclN0ZXAoaXRlcmF0b3IpO1xuICAgICAgICAgIGlmIChuZXh0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5leHRWYWx1ZSA9IG5leHQudmFsdWU7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChtYXBwaW5nKSB7XG4gICAgICAgICAgICAgIG5leHRWYWx1ZSA9IHR5cGVvZiBUID09PSAndW5kZWZpbmVkJyA/IG1hcEZuKG5leHRWYWx1ZSwgaSkgOiBfY2FsbChtYXBGbiwgVCwgbmV4dFZhbHVlLCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3VsdFtpXSA9IG5leHRWYWx1ZTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBFUy5JdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCB0cnVlKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBsZW5ndGggPSBpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGFycmF5TGlrZSA9IEVTLlRvT2JqZWN0KGl0ZW1zKTtcbiAgICAgICAgbGVuZ3RoID0gRVMuVG9MZW5ndGgoYXJyYXlMaWtlLmxlbmd0aCk7XG4gICAgICAgIHJlc3VsdCA9IEVTLklzQ29uc3RydWN0b3IoQykgPyBPYmplY3QobmV3IEMobGVuZ3RoKSkgOiBuZXcgQXJyYXkobGVuZ3RoKTtcbiAgICAgICAgdmFyIHZhbHVlO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICB2YWx1ZSA9IGFycmF5TGlrZVtpXTtcbiAgICAgICAgICBpZiAobWFwcGluZykge1xuICAgICAgICAgICAgdmFsdWUgPSB0eXBlb2YgVCA9PT0gJ3VuZGVmaW5lZCcgPyBtYXBGbih2YWx1ZSwgaSkgOiBfY2FsbChtYXBGbiwgVCwgdmFsdWUsIGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjcmVhdGVEYXRhUHJvcGVydHlPclRocm93KHJlc3VsdCwgaSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdC5sZW5ndGggPSBsZW5ndGg7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBvZjogZnVuY3Rpb24gb2YoKSB7XG4gICAgICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIHZhciBDID0gdGhpcztcbiAgICAgIHZhciBBID0gaXNBcnJheShDKSB8fCAhRVMuSXNDYWxsYWJsZShDKSA/IG5ldyBBcnJheShsZW4pIDogRVMuQ29uc3RydWN0KEMsIFtsZW5dKTtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgbGVuOyArK2spIHtcbiAgICAgICAgY3JlYXRlRGF0YVByb3BlcnR5T3JUaHJvdyhBLCBrLCBhcmd1bWVudHNba10pO1xuICAgICAgfVxuICAgICAgQS5sZW5ndGggPSBsZW47XG4gICAgICByZXR1cm4gQTtcbiAgICB9XG4gIH07XG4gIGRlZmluZVByb3BlcnRpZXMoQXJyYXksIEFycmF5U2hpbXMpO1xuICBhZGREZWZhdWx0U3BlY2llcyhBcnJheSk7XG5cbiAgLy8gT3VyIEFycmF5SXRlcmF0b3IgaXMgcHJpdmF0ZTsgc2VlXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wYXVsbWlsbHIvZXM2LXNoaW0vaXNzdWVzLzI1MlxuICBBcnJheUl0ZXJhdG9yID0gZnVuY3Rpb24gKGFycmF5LCBraW5kKSB7XG4gICAgdGhpcy5pID0gMDtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG4gICAgdGhpcy5raW5kID0ga2luZDtcbiAgfTtcblxuICBkZWZpbmVQcm9wZXJ0aWVzKEFycmF5SXRlcmF0b3IucHJvdG90eXBlLCB7XG4gICAgbmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGkgPSB0aGlzLmk7XG4gICAgICB2YXIgYXJyYXkgPSB0aGlzLmFycmF5O1xuICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEFycmF5SXRlcmF0b3IpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ05vdCBhbiBBcnJheUl0ZXJhdG9yJyk7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGFycmF5ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB2YXIgbGVuID0gRVMuVG9MZW5ndGgoYXJyYXkubGVuZ3RoKTtcbiAgICAgICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIHZhciBraW5kID0gdGhpcy5raW5kO1xuICAgICAgICAgIHZhciByZXR2YWw7XG4gICAgICAgICAgaWYgKGtpbmQgPT09ICdrZXknKSB7XG4gICAgICAgICAgICByZXR2YWwgPSBpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoa2luZCA9PT0gJ3ZhbHVlJykge1xuICAgICAgICAgICAgcmV0dmFsID0gYXJyYXlbaV07XG4gICAgICAgICAgfSBlbHNlIGlmIChraW5kID09PSAnZW50cnknKSB7XG4gICAgICAgICAgICByZXR2YWwgPSBbaSwgYXJyYXlbaV1dO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmkgPSBpICsgMTtcbiAgICAgICAgICByZXR1cm4gaXRlcmF0b3JSZXN1bHQocmV0dmFsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5hcnJheSA9IHZvaWQgMDtcbiAgICAgIHJldHVybiBpdGVyYXRvclJlc3VsdCgpO1xuICAgIH1cbiAgfSk7XG4gIGFkZEl0ZXJhdG9yKEFycmF5SXRlcmF0b3IucHJvdG90eXBlKTtcblxuLypcbiAgdmFyIG9yZGVyS2V5cyA9IGZ1bmN0aW9uIG9yZGVyS2V5cyhhLCBiKSB7XG4gICAgdmFyIGFOdW1lcmljID0gU3RyaW5nKEVTLlRvSW50ZWdlcihhKSkgPT09IGE7XG4gICAgdmFyIGJOdW1lcmljID0gU3RyaW5nKEVTLlRvSW50ZWdlcihiKSkgPT09IGI7XG4gICAgaWYgKGFOdW1lcmljICYmIGJOdW1lcmljKSB7XG4gICAgICByZXR1cm4gYiAtIGE7XG4gICAgfSBlbHNlIGlmIChhTnVtZXJpYyAmJiAhYk51bWVyaWMpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9IGVsc2UgaWYgKCFhTnVtZXJpYyAmJiBiTnVtZXJpYykge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBhLmxvY2FsZUNvbXBhcmUoYik7XG4gICAgfVxuICB9O1xuXG4gIHZhciBnZXRBbGxLZXlzID0gZnVuY3Rpb24gZ2V0QWxsS2V5cyhvYmplY3QpIHtcbiAgICB2YXIgb3duS2V5cyA9IFtdO1xuICAgIHZhciBrZXlzID0gW107XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBfcHVzaChfaGFzT3duUHJvcGVydHkob2JqZWN0LCBrZXkpID8gb3duS2V5cyA6IGtleXMsIGtleSk7XG4gICAgfVxuICAgIF9zb3J0KG93bktleXMsIG9yZGVyS2V5cyk7XG4gICAgX3NvcnQoa2V5cywgb3JkZXJLZXlzKTtcblxuICAgIHJldHVybiBfY29uY2F0KG93bktleXMsIGtleXMpO1xuICB9O1xuICAqL1xuXG4gIC8vIG5vdGU6IHRoaXMgaXMgcG9zaXRpb25lZCBoZXJlIGJlY2F1c2UgaXQgZGVwZW5kcyBvbiBBcnJheUl0ZXJhdG9yXG4gIHZhciBhcnJheU9mU3VwcG9ydHNTdWJjbGFzc2luZyA9IEFycmF5Lm9mID09PSBBcnJheVNoaW1zLm9mIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgLy8gRGV0ZWN0cyBhIGJ1ZyBpbiBXZWJraXQgbmlnaHRseSByMTgxODg2XG4gICAgdmFyIEZvbyA9IGZ1bmN0aW9uIEZvbyhsZW4pIHsgdGhpcy5sZW5ndGggPSBsZW47IH07XG4gICAgRm9vLnByb3RvdHlwZSA9IFtdO1xuICAgIHZhciBmb29BcnIgPSBBcnJheS5vZi5hcHBseShGb28sIFsxLCAyXSk7XG4gICAgcmV0dXJuIGZvb0FyciBpbnN0YW5jZW9mIEZvbyAmJiBmb29BcnIubGVuZ3RoID09PSAyO1xuICB9KCkpO1xuICBpZiAoIWFycmF5T2ZTdXBwb3J0c1N1YmNsYXNzaW5nKSB7XG4gICAgb3ZlcnJpZGVOYXRpdmUoQXJyYXksICdvZicsIEFycmF5U2hpbXMub2YpO1xuICB9XG5cbiAgdmFyIEFycmF5UHJvdG90eXBlU2hpbXMgPSB7XG4gICAgY29weVdpdGhpbjogZnVuY3Rpb24gY29weVdpdGhpbih0YXJnZXQsIHN0YXJ0KSB7XG4gICAgICB2YXIgbyA9IEVTLlRvT2JqZWN0KHRoaXMpO1xuICAgICAgdmFyIGxlbiA9IEVTLlRvTGVuZ3RoKG8ubGVuZ3RoKTtcbiAgICAgIHZhciByZWxhdGl2ZVRhcmdldCA9IEVTLlRvSW50ZWdlcih0YXJnZXQpO1xuICAgICAgdmFyIHJlbGF0aXZlU3RhcnQgPSBFUy5Ub0ludGVnZXIoc3RhcnQpO1xuICAgICAgdmFyIHRvID0gcmVsYXRpdmVUYXJnZXQgPCAwID8gX21heChsZW4gKyByZWxhdGl2ZVRhcmdldCwgMCkgOiBfbWluKHJlbGF0aXZlVGFyZ2V0LCBsZW4pO1xuICAgICAgdmFyIGZyb20gPSByZWxhdGl2ZVN0YXJ0IDwgMCA/IF9tYXgobGVuICsgcmVsYXRpdmVTdGFydCwgMCkgOiBfbWluKHJlbGF0aXZlU3RhcnQsIGxlbik7XG4gICAgICB2YXIgZW5kO1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG4gICAgICAgIGVuZCA9IGFyZ3VtZW50c1syXTtcbiAgICAgIH1cbiAgICAgIHZhciByZWxhdGl2ZUVuZCA9IHR5cGVvZiBlbmQgPT09ICd1bmRlZmluZWQnID8gbGVuIDogRVMuVG9JbnRlZ2VyKGVuZCk7XG4gICAgICB2YXIgZmluYWxJdGVtID0gcmVsYXRpdmVFbmQgPCAwID8gX21heChsZW4gKyByZWxhdGl2ZUVuZCwgMCkgOiBfbWluKHJlbGF0aXZlRW5kLCBsZW4pO1xuICAgICAgdmFyIGNvdW50ID0gX21pbihmaW5hbEl0ZW0gLSBmcm9tLCBsZW4gLSB0byk7XG4gICAgICB2YXIgZGlyZWN0aW9uID0gMTtcbiAgICAgIGlmIChmcm9tIDwgdG8gJiYgdG8gPCAoZnJvbSArIGNvdW50KSkge1xuICAgICAgICBkaXJlY3Rpb24gPSAtMTtcbiAgICAgICAgZnJvbSArPSBjb3VudCAtIDE7XG4gICAgICAgIHRvICs9IGNvdW50IC0gMTtcbiAgICAgIH1cbiAgICAgIHdoaWxlIChjb3VudCA+IDApIHtcbiAgICAgICAgaWYgKGZyb20gaW4gbykge1xuICAgICAgICAgIG9bdG9dID0gb1tmcm9tXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgb1t0b107XG4gICAgICAgIH1cbiAgICAgICAgZnJvbSArPSBkaXJlY3Rpb247XG4gICAgICAgIHRvICs9IGRpcmVjdGlvbjtcbiAgICAgICAgY291bnQgLT0gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvO1xuICAgIH0sXG5cbiAgICBmaWxsOiBmdW5jdGlvbiBmaWxsKHZhbHVlKSB7XG4gICAgICB2YXIgc3RhcnQ7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgc3RhcnQgPSBhcmd1bWVudHNbMV07XG4gICAgICB9XG4gICAgICB2YXIgZW5kO1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG4gICAgICAgIGVuZCA9IGFyZ3VtZW50c1syXTtcbiAgICAgIH1cbiAgICAgIHZhciBPID0gRVMuVG9PYmplY3QodGhpcyk7XG4gICAgICB2YXIgbGVuID0gRVMuVG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgICAgc3RhcnQgPSBFUy5Ub0ludGVnZXIodHlwZW9mIHN0YXJ0ID09PSAndW5kZWZpbmVkJyA/IDAgOiBzdGFydCk7XG4gICAgICBlbmQgPSBFUy5Ub0ludGVnZXIodHlwZW9mIGVuZCA9PT0gJ3VuZGVmaW5lZCcgPyBsZW4gOiBlbmQpO1xuXG4gICAgICB2YXIgcmVsYXRpdmVTdGFydCA9IHN0YXJ0IDwgMCA/IF9tYXgobGVuICsgc3RhcnQsIDApIDogX21pbihzdGFydCwgbGVuKTtcbiAgICAgIHZhciByZWxhdGl2ZUVuZCA9IGVuZCA8IDAgPyBsZW4gKyBlbmQgOiBlbmQ7XG5cbiAgICAgIGZvciAodmFyIGkgPSByZWxhdGl2ZVN0YXJ0OyBpIDwgbGVuICYmIGkgPCByZWxhdGl2ZUVuZDsgKytpKSB7XG4gICAgICAgIE9baV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBPO1xuICAgIH0sXG5cbiAgICBmaW5kOiBmdW5jdGlvbiBmaW5kKHByZWRpY2F0ZSkge1xuICAgICAgdmFyIGxpc3QgPSBFUy5Ub09iamVjdCh0aGlzKTtcbiAgICAgIHZhciBsZW5ndGggPSBFUy5Ub0xlbmd0aChsaXN0Lmxlbmd0aCk7XG4gICAgICBpZiAoIUVTLklzQ2FsbGFibGUocHJlZGljYXRlKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcnJheSNmaW5kOiBwcmVkaWNhdGUgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgICB9XG4gICAgICB2YXIgdGhpc0FyZyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogbnVsbDtcbiAgICAgIGZvciAodmFyIGkgPSAwLCB2YWx1ZTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlID0gbGlzdFtpXTtcbiAgICAgICAgaWYgKHRoaXNBcmcpIHtcbiAgICAgICAgICBpZiAoX2NhbGwocHJlZGljYXRlLCB0aGlzQXJnLCB2YWx1ZSwgaSwgbGlzdCkpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocHJlZGljYXRlKHZhbHVlLCBpLCBsaXN0KSkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBmaW5kSW5kZXg6IGZ1bmN0aW9uIGZpbmRJbmRleChwcmVkaWNhdGUpIHtcbiAgICAgIHZhciBsaXN0ID0gRVMuVG9PYmplY3QodGhpcyk7XG4gICAgICB2YXIgbGVuZ3RoID0gRVMuVG9MZW5ndGgobGlzdC5sZW5ndGgpO1xuICAgICAgaWYgKCFFUy5Jc0NhbGxhYmxlKHByZWRpY2F0ZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkjZmluZEluZGV4OiBwcmVkaWNhdGUgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgICB9XG4gICAgICB2YXIgdGhpc0FyZyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogbnVsbDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXNBcmcpIHtcbiAgICAgICAgICBpZiAoX2NhbGwocHJlZGljYXRlLCB0aGlzQXJnLCBsaXN0W2ldLCBpLCBsaXN0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHByZWRpY2F0ZShsaXN0W2ldLCBpLCBsaXN0KSkge1xuICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfSxcblxuICAgIGtleXM6IGZ1bmN0aW9uIGtleXMoKSB7XG4gICAgICByZXR1cm4gbmV3IEFycmF5SXRlcmF0b3IodGhpcywgJ2tleScpO1xuICAgIH0sXG5cbiAgICB2YWx1ZXM6IGZ1bmN0aW9uIHZhbHVlcygpIHtcbiAgICAgIHJldHVybiBuZXcgQXJyYXlJdGVyYXRvcih0aGlzLCAndmFsdWUnKTtcbiAgICB9LFxuXG4gICAgZW50cmllczogZnVuY3Rpb24gZW50cmllcygpIHtcbiAgICAgIHJldHVybiBuZXcgQXJyYXlJdGVyYXRvcih0aGlzLCAnZW50cnknKTtcbiAgICB9XG4gIH07XG4gIC8vIFNhZmFyaSA3LjEgZGVmaW5lcyBBcnJheSNrZXlzIGFuZCBBcnJheSNlbnRyaWVzIG5hdGl2ZWx5LFxuICAvLyBidXQgdGhlIHJlc3VsdGluZyBBcnJheUl0ZXJhdG9yIG9iamVjdHMgZG9uJ3QgaGF2ZSBhIFwibmV4dFwiIG1ldGhvZC5cbiAgaWYgKEFycmF5LnByb3RvdHlwZS5rZXlzICYmICFFUy5Jc0NhbGxhYmxlKFsxXS5rZXlzKCkubmV4dCkpIHtcbiAgICBkZWxldGUgQXJyYXkucHJvdG90eXBlLmtleXM7XG4gIH1cbiAgaWYgKEFycmF5LnByb3RvdHlwZS5lbnRyaWVzICYmICFFUy5Jc0NhbGxhYmxlKFsxXS5lbnRyaWVzKCkubmV4dCkpIHtcbiAgICBkZWxldGUgQXJyYXkucHJvdG90eXBlLmVudHJpZXM7XG4gIH1cblxuICAvLyBDaHJvbWUgMzggZGVmaW5lcyBBcnJheSNrZXlzIGFuZCBBcnJheSNlbnRyaWVzLCBhbmQgQXJyYXkjQEBpdGVyYXRvciwgYnV0IG5vdCBBcnJheSN2YWx1ZXNcbiAgaWYgKEFycmF5LnByb3RvdHlwZS5rZXlzICYmIEFycmF5LnByb3RvdHlwZS5lbnRyaWVzICYmICFBcnJheS5wcm90b3R5cGUudmFsdWVzICYmIEFycmF5LnByb3RvdHlwZVskaXRlcmF0b3IkXSkge1xuICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXkucHJvdG90eXBlLCB7XG4gICAgICB2YWx1ZXM6IEFycmF5LnByb3RvdHlwZVskaXRlcmF0b3IkXVxuICAgIH0pO1xuICAgIGlmIChUeXBlLnN5bWJvbChTeW1ib2wudW5zY29wYWJsZXMpKSB7XG4gICAgICBBcnJheS5wcm90b3R5cGVbU3ltYm9sLnVuc2NvcGFibGVzXS52YWx1ZXMgPSB0cnVlO1xuICAgIH1cbiAgfVxuICAvLyBDaHJvbWUgNDAgZGVmaW5lcyBBcnJheSN2YWx1ZXMgd2l0aCB0aGUgaW5jb3JyZWN0IG5hbWUsIGFsdGhvdWdoIEFycmF5I3trZXlzLGVudHJpZXN9IGhhdmUgdGhlIGNvcnJlY3QgbmFtZVxuICBpZiAoZnVuY3Rpb25zSGF2ZU5hbWVzICYmIEFycmF5LnByb3RvdHlwZS52YWx1ZXMgJiYgQXJyYXkucHJvdG90eXBlLnZhbHVlcy5uYW1lICE9PSAndmFsdWVzJykge1xuICAgIHZhciBvcmlnaW5hbEFycmF5UHJvdG90eXBlVmFsdWVzID0gQXJyYXkucHJvdG90eXBlLnZhbHVlcztcbiAgICBvdmVycmlkZU5hdGl2ZShBcnJheS5wcm90b3R5cGUsICd2YWx1ZXMnLCBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiBFUy5DYWxsKG9yaWdpbmFsQXJyYXlQcm90b3R5cGVWYWx1ZXMsIHRoaXMsIGFyZ3VtZW50cyk7IH0pO1xuICAgIGRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSwgJGl0ZXJhdG9yJCwgQXJyYXkucHJvdG90eXBlLnZhbHVlcywgdHJ1ZSk7XG4gIH1cbiAgZGVmaW5lUHJvcGVydGllcyhBcnJheS5wcm90b3R5cGUsIEFycmF5UHJvdG90eXBlU2hpbXMpO1xuXG4gIGlmICgxIC8gW3RydWVdLmluZGV4T2YodHJ1ZSwgLTApIDwgMCkge1xuICAgIC8vIGluZGV4T2Ygd2hlbiBnaXZlbiBhIHBvc2l0aW9uIGFyZyBvZiAtMCBzaG91bGQgcmV0dXJuICswLlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L2VjbWEyNjIvcHVsbC8zMTZcbiAgICBkZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsICdpbmRleE9mJywgZnVuY3Rpb24gaW5kZXhPZihzZWFyY2hFbGVtZW50KSB7XG4gICAgICB2YXIgdmFsdWUgPSBfYXJyYXlJbmRleE9mQXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIGlmICh2YWx1ZSA9PT0gMCAmJiAoMSAvIHZhbHVlKSA8IDApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSwgdHJ1ZSk7XG4gIH1cblxuICBhZGRJdGVyYXRvcihBcnJheS5wcm90b3R5cGUsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMudmFsdWVzKCk7IH0pO1xuICAvLyBDaHJvbWUgZGVmaW5lcyBrZXlzL3ZhbHVlcy9lbnRyaWVzIG9uIEFycmF5LCBidXQgZG9lc24ndCBnaXZlIHVzXG4gIC8vIGFueSB3YXkgdG8gaWRlbnRpZnkgaXRzIGl0ZXJhdG9yLiAgU28gYWRkIG91ciBvd24gc2hpbW1lZCBmaWVsZC5cbiAgaWYgKE9iamVjdC5nZXRQcm90b3R5cGVPZikge1xuICAgIGFkZEl0ZXJhdG9yKE9iamVjdC5nZXRQcm90b3R5cGVPZihbXS52YWx1ZXMoKSkpO1xuICB9XG5cbiAgLy8gbm90ZTogdGhpcyBpcyBwb3NpdGlvbmVkIGhlcmUgYmVjYXVzZSBpdCByZWxpZXMgb24gQXJyYXkjZW50cmllc1xuICB2YXIgYXJyYXlGcm9tU3dhbGxvd3NOZWdhdGl2ZUxlbmd0aHMgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8vIERldGVjdHMgYSBGaXJlZm94IGJ1ZyBpbiB2MzJcbiAgICAvLyBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD0xMDYzOTkzXG4gICAgcmV0dXJuIHZhbHVlT3JGYWxzZUlmVGhyb3dzKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKHsgbGVuZ3RoOiAtMSB9KS5sZW5ndGggPT09IDA7XG4gICAgfSk7XG4gIH0oKSk7XG4gIHZhciBhcnJheUZyb21IYW5kbGVzSXRlcmFibGVzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBEZXRlY3RzIGEgYnVnIGluIFdlYmtpdCBuaWdodGx5IHIxODE4ODZcbiAgICB2YXIgYXJyID0gQXJyYXkuZnJvbShbMF0uZW50cmllcygpKTtcbiAgICByZXR1cm4gYXJyLmxlbmd0aCA9PT0gMSAmJiBpc0FycmF5KGFyclswXSkgJiYgYXJyWzBdWzBdID09PSAwICYmIGFyclswXVsxXSA9PT0gMDtcbiAgfSgpKTtcbiAgaWYgKCFhcnJheUZyb21Td2FsbG93c05lZ2F0aXZlTGVuZ3RocyB8fCAhYXJyYXlGcm9tSGFuZGxlc0l0ZXJhYmxlcykge1xuICAgIG92ZXJyaWRlTmF0aXZlKEFycmF5LCAnZnJvbScsIEFycmF5U2hpbXMuZnJvbSk7XG4gIH1cbiAgdmFyIGFycmF5RnJvbUhhbmRsZXNVbmRlZmluZWRNYXBGdW5jdGlvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgLy8gTWljcm9zb2Z0IEVkZ2UgdjAuMTEgdGhyb3dzIGlmIHRoZSBtYXBGbiBhcmd1bWVudCBpcyAqcHJvdmlkZWQqIGJ1dCB1bmRlZmluZWQsXG4gICAgLy8gYnV0IHRoZSBzcGVjIGRvZXNuJ3QgY2FyZSBpZiBpdCdzIHByb3ZpZGVkIG9yIG5vdCAtIHVuZGVmaW5lZCBkb2Vzbid0IHRocm93LlxuICAgIHJldHVybiB2YWx1ZU9yRmFsc2VJZlRocm93cyhmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShbMF0sIHZvaWQgMCk7XG4gICAgfSk7XG4gIH0oKSk7XG4gIGlmICghYXJyYXlGcm9tSGFuZGxlc1VuZGVmaW5lZE1hcEZ1bmN0aW9uKSB7XG4gICAgdmFyIG9yaWdBcnJheUZyb20gPSBBcnJheS5mcm9tO1xuICAgIG92ZXJyaWRlTmF0aXZlKEFycmF5LCAnZnJvbScsIGZ1bmN0aW9uIGZyb20oaXRlbXMpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSAmJiB0eXBlb2YgYXJndW1lbnRzWzFdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gRVMuQ2FsbChvcmlnQXJyYXlGcm9tLCB0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIF9jYWxsKG9yaWdBcnJheUZyb20sIHRoaXMsIGl0ZW1zKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHZhciBpbnQzMnNBc09uZSA9IC0oTWF0aC5wb3coMiwgMzIpIC0gMSk7XG4gIHZhciB0b0xlbmd0aHNDb3JyZWN0bHkgPSBmdW5jdGlvbiAobWV0aG9kLCByZXZlcnNlZCkge1xuICAgIHZhciBvYmogPSB7IGxlbmd0aDogaW50MzJzQXNPbmUgfTtcbiAgICBvYmpbcmV2ZXJzZWQgPyAob2JqLmxlbmd0aCA+Pj4gMCkgLSAxIDogMF0gPSB0cnVlO1xuICAgIHJldHVybiB2YWx1ZU9yRmFsc2VJZlRocm93cyhmdW5jdGlvbiAoKSB7XG4gICAgICBfY2FsbChtZXRob2QsIG9iaiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBub3RlOiBpbiBub25jb25mb3JtaW5nIGJyb3dzZXJzLCB0aGlzIHdpbGwgYmUgY2FsbGVkXG4gICAgICAgIC8vIC0xID4+PiAwIHRpbWVzLCB3aGljaCBpcyA0Mjk0OTY3Mjk1LCBzbyB0aGUgdGhyb3cgbWF0dGVycy5cbiAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3Nob3VsZCBub3QgcmVhY2ggaGVyZScpO1xuICAgICAgfSwgW10pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH07XG4gIGlmICghdG9MZW5ndGhzQ29ycmVjdGx5KEFycmF5LnByb3RvdHlwZS5mb3JFYWNoKSkge1xuICAgIHZhciBvcmlnaW5hbEZvckVhY2ggPSBBcnJheS5wcm90b3R5cGUuZm9yRWFjaDtcbiAgICBvdmVycmlkZU5hdGl2ZShBcnJheS5wcm90b3R5cGUsICdmb3JFYWNoJywgZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja0ZuKSB7XG4gICAgICByZXR1cm4gRVMuQ2FsbChvcmlnaW5hbEZvckVhY2gsIHRoaXMubGVuZ3RoID49IDAgPyB0aGlzIDogW10sIGFyZ3VtZW50cyk7XG4gICAgfSwgdHJ1ZSk7XG4gIH1cbiAgaWYgKCF0b0xlbmd0aHNDb3JyZWN0bHkoQXJyYXkucHJvdG90eXBlLm1hcCkpIHtcbiAgICB2YXIgb3JpZ2luYWxNYXAgPSBBcnJheS5wcm90b3R5cGUubWFwO1xuICAgIG92ZXJyaWRlTmF0aXZlKEFycmF5LnByb3RvdHlwZSwgJ21hcCcsIGZ1bmN0aW9uIG1hcChjYWxsYmFja0ZuKSB7XG4gICAgICByZXR1cm4gRVMuQ2FsbChvcmlnaW5hbE1hcCwgdGhpcy5sZW5ndGggPj0gMCA/IHRoaXMgOiBbXSwgYXJndW1lbnRzKTtcbiAgICB9LCB0cnVlKTtcbiAgfVxuICBpZiAoIXRvTGVuZ3Roc0NvcnJlY3RseShBcnJheS5wcm90b3R5cGUuZmlsdGVyKSkge1xuICAgIHZhciBvcmlnaW5hbEZpbHRlciA9IEFycmF5LnByb3RvdHlwZS5maWx0ZXI7XG4gICAgb3ZlcnJpZGVOYXRpdmUoQXJyYXkucHJvdG90eXBlLCAnZmlsdGVyJywgZnVuY3Rpb24gZmlsdGVyKGNhbGxiYWNrRm4pIHtcbiAgICAgIHJldHVybiBFUy5DYWxsKG9yaWdpbmFsRmlsdGVyLCB0aGlzLmxlbmd0aCA+PSAwID8gdGhpcyA6IFtdLCBhcmd1bWVudHMpO1xuICAgIH0sIHRydWUpO1xuICB9XG4gIGlmICghdG9MZW5ndGhzQ29ycmVjdGx5KEFycmF5LnByb3RvdHlwZS5zb21lKSkge1xuICAgIHZhciBvcmlnaW5hbFNvbWUgPSBBcnJheS5wcm90b3R5cGUuc29tZTtcbiAgICBvdmVycmlkZU5hdGl2ZShBcnJheS5wcm90b3R5cGUsICdzb21lJywgZnVuY3Rpb24gc29tZShjYWxsYmFja0ZuKSB7XG4gICAgICByZXR1cm4gRVMuQ2FsbChvcmlnaW5hbFNvbWUsIHRoaXMubGVuZ3RoID49IDAgPyB0aGlzIDogW10sIGFyZ3VtZW50cyk7XG4gICAgfSwgdHJ1ZSk7XG4gIH1cbiAgaWYgKCF0b0xlbmd0aHNDb3JyZWN0bHkoQXJyYXkucHJvdG90eXBlLmV2ZXJ5KSkge1xuICAgIHZhciBvcmlnaW5hbEV2ZXJ5ID0gQXJyYXkucHJvdG90eXBlLmV2ZXJ5O1xuICAgIG92ZXJyaWRlTmF0aXZlKEFycmF5LnByb3RvdHlwZSwgJ2V2ZXJ5JywgZnVuY3Rpb24gZXZlcnkoY2FsbGJhY2tGbikge1xuICAgICAgcmV0dXJuIEVTLkNhbGwob3JpZ2luYWxFdmVyeSwgdGhpcy5sZW5ndGggPj0gMCA/IHRoaXMgOiBbXSwgYXJndW1lbnRzKTtcbiAgICB9LCB0cnVlKTtcbiAgfVxuICBpZiAoIXRvTGVuZ3Roc0NvcnJlY3RseShBcnJheS5wcm90b3R5cGUucmVkdWNlKSkge1xuICAgIHZhciBvcmlnaW5hbFJlZHVjZSA9IEFycmF5LnByb3RvdHlwZS5yZWR1Y2U7XG4gICAgb3ZlcnJpZGVOYXRpdmUoQXJyYXkucHJvdG90eXBlLCAncmVkdWNlJywgZnVuY3Rpb24gcmVkdWNlKGNhbGxiYWNrRm4pIHtcbiAgICAgIHJldHVybiBFUy5DYWxsKG9yaWdpbmFsUmVkdWNlLCB0aGlzLmxlbmd0aCA+PSAwID8gdGhpcyA6IFtdLCBhcmd1bWVudHMpO1xuICAgIH0sIHRydWUpO1xuICB9XG4gIGlmICghdG9MZW5ndGhzQ29ycmVjdGx5KEFycmF5LnByb3RvdHlwZS5yZWR1Y2VSaWdodCwgdHJ1ZSkpIHtcbiAgICB2YXIgb3JpZ2luYWxSZWR1Y2VSaWdodCA9IEFycmF5LnByb3RvdHlwZS5yZWR1Y2VSaWdodDtcbiAgICBvdmVycmlkZU5hdGl2ZShBcnJheS5wcm90b3R5cGUsICdyZWR1Y2VSaWdodCcsIGZ1bmN0aW9uIHJlZHVjZVJpZ2h0KGNhbGxiYWNrRm4pIHtcbiAgICAgIHJldHVybiBFUy5DYWxsKG9yaWdpbmFsUmVkdWNlUmlnaHQsIHRoaXMubGVuZ3RoID49IDAgPyB0aGlzIDogW10sIGFyZ3VtZW50cyk7XG4gICAgfSwgdHJ1ZSk7XG4gIH1cblxuICB2YXIgbGFja3NPY3RhbFN1cHBvcnQgPSBOdW1iZXIoJzBvMTAnKSAhPT0gODtcbiAgdmFyIGxhY2tzQmluYXJ5U3VwcG9ydCA9IE51bWJlcignMGIxMCcpICE9PSAyO1xuICB2YXIgdHJpbXNOb25XaGl0ZXNwYWNlID0gX3NvbWUobm9uV1MsIGZ1bmN0aW9uIChjKSB7XG4gICAgcmV0dXJuIE51bWJlcihjICsgMCArIGMpID09PSAwO1xuICB9KTtcbiAgaWYgKGxhY2tzT2N0YWxTdXBwb3J0IHx8IGxhY2tzQmluYXJ5U3VwcG9ydCB8fCB0cmltc05vbldoaXRlc3BhY2UpIHtcbiAgICB2YXIgT3JpZ051bWJlciA9IE51bWJlcjtcbiAgICB2YXIgYmluYXJ5UmVnZXggPSAvXjBiWzAxXSskL2k7XG4gICAgdmFyIG9jdGFsUmVnZXggPSAvXjBvWzAtN10rJC9pO1xuICAgIC8vIE5vdGUgdGhhdCBpbiBJRSA4LCBSZWdFeHAucHJvdG90eXBlLnRlc3QgZG9lc24ndCBzZWVtIHRvIGV4aXN0OiBpZSwgXCJ0ZXN0XCIgaXMgYW4gb3duIHByb3BlcnR5IG9mIHJlZ2V4ZXMuIHd0Zi5cbiAgICB2YXIgaXNCaW5hcnkgPSBiaW5hcnlSZWdleC50ZXN0LmJpbmQoYmluYXJ5UmVnZXgpO1xuICAgIHZhciBpc09jdGFsID0gb2N0YWxSZWdleC50ZXN0LmJpbmQob2N0YWxSZWdleCk7XG4gICAgdmFyIHRvUHJpbWl0aXZlID0gZnVuY3Rpb24gKE8pIHsgLy8gbmVlZCB0byByZXBsYWNlIHRoaXMgd2l0aCBgZXMtdG8tcHJpbWl0aXZlL2VzNmBcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICBpZiAodHlwZW9mIE8udmFsdWVPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXN1bHQgPSBPLnZhbHVlT2YoKTtcbiAgICAgICAgaWYgKFR5cGUucHJpbWl0aXZlKHJlc3VsdCkpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIE8udG9TdHJpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmVzdWx0ID0gTy50b1N0cmluZygpO1xuICAgICAgICBpZiAoVHlwZS5wcmltaXRpdmUocmVzdWx0KSkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ05vIGRlZmF1bHQgdmFsdWUnKTtcbiAgICB9O1xuICAgIHZhciBoYXNOb25XUyA9IG5vbldTcmVnZXgudGVzdC5iaW5kKG5vbldTcmVnZXgpO1xuICAgIHZhciBpc0JhZEhleCA9IGlzQmFkSGV4UmVnZXgudGVzdC5iaW5kKGlzQmFkSGV4UmVnZXgpO1xuICAgIHZhciBOdW1iZXJTaGltID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHRoaXMgaXMgd3JhcHBlZCBpbiBhbiBJSUZFIGJlY2F1c2Ugb2YgSUUgNi04J3Mgd2Fja3kgc2NvcGluZyBpc3N1ZXMgd2l0aCBuYW1lZCBmdW5jdGlvbiBleHByZXNzaW9ucy5cbiAgICAgIHZhciBOdW1iZXJTaGltID0gZnVuY3Rpb24gTnVtYmVyKHZhbHVlKSB7XG4gICAgICAgIHZhciBwcmltVmFsdWU7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHByaW1WYWx1ZSA9IFR5cGUucHJpbWl0aXZlKHZhbHVlKSA/IHZhbHVlIDogdG9QcmltaXRpdmUodmFsdWUsICdudW1iZXInKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcmltVmFsdWUgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgcHJpbVZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHByaW1WYWx1ZSA9IEVTLkNhbGwodHJpbVNoaW0sIHByaW1WYWx1ZSk7XG4gICAgICAgICAgaWYgKGlzQmluYXJ5KHByaW1WYWx1ZSkpIHtcbiAgICAgICAgICAgIHByaW1WYWx1ZSA9IHBhcnNlSW50KF9zdHJTbGljZShwcmltVmFsdWUsIDIpLCAyKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGlzT2N0YWwocHJpbVZhbHVlKSkge1xuICAgICAgICAgICAgcHJpbVZhbHVlID0gcGFyc2VJbnQoX3N0clNsaWNlKHByaW1WYWx1ZSwgMiksIDgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzTm9uV1MocHJpbVZhbHVlKSB8fCBpc0JhZEhleChwcmltVmFsdWUpKSB7XG4gICAgICAgICAgICBwcmltVmFsdWUgPSBOYU47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciByZWNlaXZlciA9IHRoaXM7XG4gICAgICAgIHZhciB2YWx1ZU9mU3VjY2VlZHMgPSB2YWx1ZU9yRmFsc2VJZlRocm93cyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgT3JpZ051bWJlci5wcm90b3R5cGUudmFsdWVPZi5jYWxsKHJlY2VpdmVyKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyZWNlaXZlciBpbnN0YW5jZW9mIE51bWJlclNoaW0gJiYgIXZhbHVlT2ZTdWNjZWVkcykge1xuICAgICAgICAgIHJldHVybiBuZXcgT3JpZ051bWJlcihwcmltVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIC8qIGpzaGludCBuZXdjYXA6IGZhbHNlICovXG4gICAgICAgIHJldHVybiBPcmlnTnVtYmVyKHByaW1WYWx1ZSk7XG4gICAgICAgIC8qIGpzaGludCBuZXdjYXA6IHRydWUgKi9cbiAgICAgIH07XG4gICAgICByZXR1cm4gTnVtYmVyU2hpbTtcbiAgICB9KCkpO1xuICAgIHdyYXBDb25zdHJ1Y3RvcihPcmlnTnVtYmVyLCBOdW1iZXJTaGltLCB7fSk7XG4gICAgLy8gdGhpcyBpcyBuZWNlc3NhcnkgZm9yIEVTMyBicm93c2Vycywgd2hlcmUgdGhlc2UgcHJvcGVydGllcyBhcmUgbm9uLWVudW1lcmFibGUuXG4gICAgZGVmaW5lUHJvcGVydGllcyhOdW1iZXJTaGltLCB7XG4gICAgICBOYU46IE9yaWdOdW1iZXIuTmFOLFxuICAgICAgTUFYX1ZBTFVFOiBPcmlnTnVtYmVyLk1BWF9WQUxVRSxcbiAgICAgIE1JTl9WQUxVRTogT3JpZ051bWJlci5NSU5fVkFMVUUsXG4gICAgICBORUdBVElWRV9JTkZJTklUWTogT3JpZ051bWJlci5ORUdBVElWRV9JTkZJTklUWSxcbiAgICAgIFBPU0lUSVZFX0lORklOSVRZOiBPcmlnTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZXG4gICAgfSk7XG4gICAgLyogZ2xvYmFscyBOdW1iZXI6IHRydWUgKi9cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiwgbm8tZ2xvYmFsLWFzc2lnbiAqL1xuICAgIC8qIGpzaGludCAtVzAyMCAqL1xuICAgIE51bWJlciA9IE51bWJlclNoaW07XG4gICAgVmFsdWUucmVkZWZpbmUoZ2xvYmFscywgJ051bWJlcicsIE51bWJlclNoaW0pO1xuICAgIC8qIGpzaGludCArVzAyMCAqL1xuICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW5kZWYsIG5vLWdsb2JhbC1hc3NpZ24gKi9cbiAgICAvKiBnbG9iYWxzIE51bWJlcjogZmFsc2UgKi9cbiAgfVxuXG4gIHZhciBtYXhTYWZlSW50ZWdlciA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG4gIGRlZmluZVByb3BlcnRpZXMoTnVtYmVyLCB7XG4gICAgTUFYX1NBRkVfSU5URUdFUjogbWF4U2FmZUludGVnZXIsXG4gICAgTUlOX1NBRkVfSU5URUdFUjogLW1heFNhZmVJbnRlZ2VyLFxuICAgIEVQU0lMT046IDIuMjIwNDQ2MDQ5MjUwMzEzZS0xNixcblxuICAgIHBhcnNlSW50OiBnbG9iYWxzLnBhcnNlSW50LFxuICAgIHBhcnNlRmxvYXQ6IGdsb2JhbHMucGFyc2VGbG9hdCxcblxuICAgIGlzRmluaXRlOiBudW1iZXJJc0Zpbml0ZSxcblxuICAgIGlzSW50ZWdlcjogZnVuY3Rpb24gaXNJbnRlZ2VyKHZhbHVlKSB7XG4gICAgICByZXR1cm4gbnVtYmVySXNGaW5pdGUodmFsdWUpICYmIEVTLlRvSW50ZWdlcih2YWx1ZSkgPT09IHZhbHVlO1xuICAgIH0sXG5cbiAgICBpc1NhZmVJbnRlZ2VyOiBmdW5jdGlvbiBpc1NhZmVJbnRlZ2VyKHZhbHVlKSB7XG4gICAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSkgJiYgX2Ficyh2YWx1ZSkgPD0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgfSxcblxuICAgIGlzTmFOOiBudW1iZXJJc05hTlxuICB9KTtcbiAgLy8gRmlyZWZveCAzNyBoYXMgYSBjb25mb3JtaW5nIE51bWJlci5wYXJzZUludCwgYnV0IGl0J3Mgbm90ID09PSB0byB0aGUgZ2xvYmFsIHBhcnNlSW50IChmaXhlZCBpbiB2NDApXG4gIGRlZmluZVByb3BlcnR5KE51bWJlciwgJ3BhcnNlSW50JywgZ2xvYmFscy5wYXJzZUludCwgTnVtYmVyLnBhcnNlSW50ICE9PSBnbG9iYWxzLnBhcnNlSW50KTtcblxuICAvLyBXb3JrIGFyb3VuZCBidWdzIGluIEFycmF5I2ZpbmQgYW5kIEFycmF5I2ZpbmRJbmRleCAtLSBlYXJseVxuICAvLyBpbXBsZW1lbnRhdGlvbnMgc2tpcHBlZCBob2xlcyBpbiBzcGFyc2UgYXJyYXlzLiAoTm90ZSB0aGF0IHRoZVxuICAvLyBpbXBsZW1lbnRhdGlvbnMgb2YgZmluZC9maW5kSW5kZXggaW5kaXJlY3RseSB1c2Ugc2hpbW1lZFxuICAvLyBtZXRob2RzIG9mIE51bWJlciwgc28gdGhpcyB0ZXN0IGhhcyB0byBoYXBwZW4gZG93biBoZXJlLilcbiAgLypqc2hpbnQgZWxpc2lvbjogdHJ1ZSAqL1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby1zcGFyc2UtYXJyYXlzICovXG4gIGlmIChbLCAxXS5maW5kKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH0pID09PSAxKSB7XG4gICAgb3ZlcnJpZGVOYXRpdmUoQXJyYXkucHJvdG90eXBlLCAnZmluZCcsIEFycmF5UHJvdG90eXBlU2hpbXMuZmluZCk7XG4gIH1cbiAgaWYgKFssIDFdLmZpbmRJbmRleChmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9KSAhPT0gMCkge1xuICAgIG92ZXJyaWRlTmF0aXZlKEFycmF5LnByb3RvdHlwZSwgJ2ZpbmRJbmRleCcsIEFycmF5UHJvdG90eXBlU2hpbXMuZmluZEluZGV4KTtcbiAgfVxuICAvKiBlc2xpbnQtZW5hYmxlIG5vLXNwYXJzZS1hcnJheXMgKi9cbiAgLypqc2hpbnQgZWxpc2lvbjogZmFsc2UgKi9cblxuICB2YXIgaXNFbnVtZXJhYmxlT24gPSBGdW5jdGlvbi5iaW5kLmNhbGwoRnVuY3Rpb24uYmluZCwgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZSk7XG4gIHZhciBlbnN1cmVFbnVtZXJhYmxlID0gZnVuY3Rpb24gZW5zdXJlRW51bWVyYWJsZShvYmosIHByb3ApIHtcbiAgICBpZiAoc3VwcG9ydHNEZXNjcmlwdG9ycyAmJiBpc0VudW1lcmFibGVPbihvYmosIHByb3ApKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCB7IGVudW1lcmFibGU6IGZhbHNlIH0pO1xuICAgIH1cbiAgfTtcbiAgdmFyIHNsaWNlQXJncyA9IGZ1bmN0aW9uIHNsaWNlQXJncygpIHtcbiAgICAvLyBwZXIgaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC93aWtpL09wdGltaXphdGlvbi1raWxsZXJzIzMyLWxlYWtpbmctYXJndW1lbnRzXG4gICAgLy8gYW5kIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL1dlYlJlZmxlY3Rpb24vNDMyNzc2MmNiODdhOGM2MzRhMjlcbiAgICB2YXIgaW5pdGlhbCA9IE51bWJlcih0aGlzKTtcbiAgICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgZGVzaXJlZEFyZ0NvdW50ID0gbGVuIC0gaW5pdGlhbDtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShkZXNpcmVkQXJnQ291bnQgPCAwID8gMCA6IGRlc2lyZWRBcmdDb3VudCk7XG4gICAgZm9yICh2YXIgaSA9IGluaXRpYWw7IGkgPCBsZW47ICsraSkge1xuICAgICAgYXJnc1tpIC0gaW5pdGlhbF0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuICAgIHJldHVybiBhcmdzO1xuICB9O1xuICB2YXIgYXNzaWduVG8gPSBmdW5jdGlvbiBhc3NpZ25Ubyhzb3VyY2UpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gYXNzaWduVG9Tb3VyY2UodGFyZ2V0LCBrZXkpIHtcbiAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH07XG4gIH07XG4gIHZhciBhc3NpZ25SZWR1Y2VyID0gZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG4gICAgdmFyIHNvdXJjZUtleXMgPSBrZXlzKE9iamVjdChzb3VyY2UpKTtcbiAgICB2YXIgc3ltYm9scztcbiAgICBpZiAoRVMuSXNDYWxsYWJsZShPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSkge1xuICAgICAgc3ltYm9scyA9IF9maWx0ZXIoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPYmplY3Qoc291cmNlKSksIGlzRW51bWVyYWJsZU9uKHNvdXJjZSkpO1xuICAgIH1cbiAgICByZXR1cm4gX3JlZHVjZShfY29uY2F0KHNvdXJjZUtleXMsIHN5bWJvbHMgfHwgW10pLCBhc3NpZ25Ubyhzb3VyY2UpLCB0YXJnZXQpO1xuICB9O1xuXG4gIHZhciBPYmplY3RTaGltcyA9IHtcbiAgICAvLyAxOS4xLjMuMVxuICAgIGFzc2lnbjogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG4gICAgICB2YXIgdG8gPSBFUy5Ub09iamVjdCh0YXJnZXQsICdDYW5ub3QgY29udmVydCB1bmRlZmluZWQgb3IgbnVsbCB0byBvYmplY3QnKTtcbiAgICAgIHJldHVybiBfcmVkdWNlKEVTLkNhbGwoc2xpY2VBcmdzLCAxLCBhcmd1bWVudHMpLCBhc3NpZ25SZWR1Y2VyLCB0byk7XG4gICAgfSxcblxuICAgIC8vIEFkZGVkIGluIFdlYktpdCBpbiBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTQzODY1XG4gICAgaXM6IGZ1bmN0aW9uIGlzKGEsIGIpIHtcbiAgICAgIHJldHVybiBFUy5TYW1lVmFsdWUoYSwgYik7XG4gICAgfVxuICB9O1xuICB2YXIgYXNzaWduSGFzUGVuZGluZ0V4Y2VwdGlvbnMgPSBPYmplY3QuYXNzaWduICYmIE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyAmJiAoZnVuY3Rpb24gKCkge1xuICAgIC8vIEZpcmVmb3ggMzcgc3RpbGwgaGFzIFwicGVuZGluZyBleGNlcHRpb25cIiBsb2dpYyBpbiBpdHMgT2JqZWN0LmFzc2lnbiBpbXBsZW1lbnRhdGlvbixcbiAgICAvLyB3aGljaCBpcyA3MiUgc2xvd2VyIHRoYW4gb3VyIHNoaW0sIGFuZCBGaXJlZm94IDQwJ3MgbmF0aXZlIGltcGxlbWVudGF0aW9uLlxuICAgIHZhciB0aHJvd2VyID0gT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKHsgMTogMiB9KTtcbiAgICB0cnkge1xuICAgICAgT2JqZWN0LmFzc2lnbih0aHJvd2VyLCAneHknKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gdGhyb3dlclsxXSA9PT0gJ3knO1xuICAgIH1cbiAgfSgpKTtcbiAgaWYgKGFzc2lnbkhhc1BlbmRpbmdFeGNlcHRpb25zKSB7XG4gICAgb3ZlcnJpZGVOYXRpdmUoT2JqZWN0LCAnYXNzaWduJywgT2JqZWN0U2hpbXMuYXNzaWduKTtcbiAgfVxuICBkZWZpbmVQcm9wZXJ0aWVzKE9iamVjdCwgT2JqZWN0U2hpbXMpO1xuXG4gIGlmIChzdXBwb3J0c0Rlc2NyaXB0b3JzKSB7XG4gICAgdmFyIEVTNU9iamVjdFNoaW1zID0ge1xuICAgICAgLy8gMTkuMS4zLjlcbiAgICAgIC8vIHNoaW0gZnJvbSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9XZWJSZWZsZWN0aW9uLzU1OTM1NTRcbiAgICAgIHNldFByb3RvdHlwZU9mOiAoZnVuY3Rpb24gKE9iamVjdCwgbWFnaWMpIHtcbiAgICAgICAgdmFyIHNldDtcblxuICAgICAgICB2YXIgY2hlY2tBcmdzID0gZnVuY3Rpb24gKE8sIHByb3RvKSB7XG4gICAgICAgICAgaWYgKCFFUy5UeXBlSXNPYmplY3QoTykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2Nhbm5vdCBzZXQgcHJvdG90eXBlIG9uIGEgbm9uLW9iamVjdCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIShwcm90byA9PT0gbnVsbCB8fCBFUy5UeXBlSXNPYmplY3QocHJvdG8pKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY2FuIG9ubHkgc2V0IHByb3RvdHlwZSB0byBhbiBvYmplY3Qgb3IgbnVsbCcgKyBwcm90byk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBzZXRQcm90b3R5cGVPZiA9IGZ1bmN0aW9uIChPLCBwcm90bykge1xuICAgICAgICAgIGNoZWNrQXJncyhPLCBwcm90byk7XG4gICAgICAgICAgX2NhbGwoc2V0LCBPLCBwcm90byk7XG4gICAgICAgICAgcmV0dXJuIE87XG4gICAgICAgIH07XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyB0aGlzIHdvcmtzIGFscmVhZHkgaW4gRmlyZWZveCBhbmQgU2FmYXJpXG4gICAgICAgICAgc2V0ID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPYmplY3QucHJvdG90eXBlLCBtYWdpYykuc2V0O1xuICAgICAgICAgIF9jYWxsKHNldCwge30sIG51bGwpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUgIT09IHt9W21hZ2ljXSkge1xuICAgICAgICAgICAgLy8gSUUgPCAxMSBjYW5ub3QgYmUgc2hpbW1lZFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBwcm9iYWJseSBDaHJvbWUgb3Igc29tZSBvbGQgTW9iaWxlIHN0b2NrIGJyb3dzZXJcbiAgICAgICAgICBzZXQgPSBmdW5jdGlvbiAocHJvdG8pIHtcbiAgICAgICAgICAgIHRoaXNbbWFnaWNdID0gcHJvdG87XG4gICAgICAgICAgfTtcbiAgICAgICAgICAvLyBwbGVhc2Ugbm90ZSB0aGF0IHRoaXMgd2lsbCAqKm5vdCoqIHdvcmtcbiAgICAgICAgICAvLyBpbiB0aG9zZSBicm93c2VycyB0aGF0IGRvIG5vdCBpbmhlcml0XG4gICAgICAgICAgLy8gX19wcm90b19fIGJ5IG1pc3Rha2UgZnJvbSBPYmplY3QucHJvdG90eXBlXG4gICAgICAgICAgLy8gaW4gdGhlc2UgY2FzZXMgd2Ugc2hvdWxkIHByb2JhYmx5IHRocm93IGFuIGVycm9yXG4gICAgICAgICAgLy8gb3IgYXQgbGVhc3QgYmUgaW5mb3JtZWQgYWJvdXQgdGhlIGlzc3VlXG4gICAgICAgICAgc2V0UHJvdG90eXBlT2YucG9seWZpbGwgPSBzZXRQcm90b3R5cGVPZihcbiAgICAgICAgICAgIHNldFByb3RvdHlwZU9mKHt9LCBudWxsKSxcbiAgICAgICAgICAgIE9iamVjdC5wcm90b3R5cGVcbiAgICAgICAgICApIGluc3RhbmNlb2YgT2JqZWN0O1xuICAgICAgICAgIC8vIHNldFByb3RvdHlwZU9mLnBvbHlmaWxsID09PSB0cnVlIG1lYW5zIGl0IHdvcmtzIGFzIG1lYW50XG4gICAgICAgICAgLy8gc2V0UHJvdG90eXBlT2YucG9seWZpbGwgPT09IGZhbHNlIG1lYW5zIGl0J3Mgbm90IDEwMCUgcmVsaWFibGVcbiAgICAgICAgICAvLyBzZXRQcm90b3R5cGVPZi5wb2x5ZmlsbCA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgLy8gb3JcbiAgICAgICAgICAvLyBzZXRQcm90b3R5cGVPZi5wb2x5ZmlsbCA9PSAgbnVsbCBtZWFucyBpdCdzIG5vdCBhIHBvbHlmaWxsXG4gICAgICAgICAgLy8gd2hpY2ggbWVhbnMgaXQgd29ya3MgYXMgZXhwZWN0ZWRcbiAgICAgICAgICAvLyB3ZSBjYW4gZXZlbiBkZWxldGUgT2JqZWN0LnByb3RvdHlwZS5fX3Byb3RvX187XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNldFByb3RvdHlwZU9mO1xuICAgICAgfShPYmplY3QsICdfX3Byb3RvX18nKSlcbiAgICB9O1xuXG4gICAgZGVmaW5lUHJvcGVydGllcyhPYmplY3QsIEVTNU9iamVjdFNoaW1zKTtcbiAgfVxuXG4gIC8vIFdvcmthcm91bmQgYnVnIGluIE9wZXJhIDEyIHdoZXJlIHNldFByb3RvdHlwZU9mKHgsIG51bGwpIGRvZXNuJ3Qgd29yayxcbiAgLy8gYnV0IE9iamVjdC5jcmVhdGUobnVsbCkgZG9lcy5cbiAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZiAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YgJiZcbiAgICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihPYmplY3Quc2V0UHJvdG90eXBlT2Yoe30sIG51bGwpKSAhPT0gbnVsbCAmJlxuICAgICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKE9iamVjdC5jcmVhdGUobnVsbCkpID09PSBudWxsKSB7XG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBGQUtFTlVMTCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICB2YXIgZ3BvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICAgICAgdmFyIHNwbyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZjtcbiAgICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZiA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBncG8obyk7XG4gICAgICAgIHJldHVybiByZXN1bHQgPT09IEZBS0VOVUxMID8gbnVsbCA6IHJlc3VsdDtcbiAgICAgIH07XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YgPSBmdW5jdGlvbiAobywgcCkge1xuICAgICAgICB2YXIgcHJvdG8gPSBwID09PSBudWxsID8gRkFLRU5VTEwgOiBwO1xuICAgICAgICByZXR1cm4gc3BvKG8sIHByb3RvKTtcbiAgICAgIH07XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YucG9seWZpbGwgPSBmYWxzZTtcbiAgICB9KCkpO1xuICB9XG5cbiAgdmFyIG9iamVjdEtleXNBY2NlcHRzUHJpbWl0aXZlcyA9ICF0aHJvd3NFcnJvcihmdW5jdGlvbiAoKSB7IE9iamVjdC5rZXlzKCdmb28nKTsgfSk7XG4gIGlmICghb2JqZWN0S2V5c0FjY2VwdHNQcmltaXRpdmVzKSB7XG4gICAgdmFyIG9yaWdpbmFsT2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzO1xuICAgIG92ZXJyaWRlTmF0aXZlKE9iamVjdCwgJ2tleXMnLCBmdW5jdGlvbiBrZXlzKHZhbHVlKSB7XG4gICAgICByZXR1cm4gb3JpZ2luYWxPYmplY3RLZXlzKEVTLlRvT2JqZWN0KHZhbHVlKSk7XG4gICAgfSk7XG4gICAga2V5cyA9IE9iamVjdC5rZXlzO1xuICB9XG4gIHZhciBvYmplY3RLZXlzUmVqZWN0c1JlZ2V4ID0gdGhyb3dzRXJyb3IoZnVuY3Rpb24gKCkgeyBPYmplY3Qua2V5cygvYS9nKTsgfSk7XG4gIGlmIChvYmplY3RLZXlzUmVqZWN0c1JlZ2V4KSB7XG4gICAgdmFyIHJlZ2V4UmVqZWN0aW5nT2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzO1xuICAgIG92ZXJyaWRlTmF0aXZlKE9iamVjdCwgJ2tleXMnLCBmdW5jdGlvbiBrZXlzKHZhbHVlKSB7XG4gICAgICBpZiAoVHlwZS5yZWdleCh2YWx1ZSkpIHtcbiAgICAgICAgdmFyIHJlZ2V4S2V5cyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBrIGluIHZhbHVlKSB7XG4gICAgICAgICAgaWYgKF9oYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgaykpIHtcbiAgICAgICAgICAgIF9wdXNoKHJlZ2V4S2V5cywgayk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZWdleEtleXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVnZXhSZWplY3RpbmdPYmplY3RLZXlzKHZhbHVlKTtcbiAgICB9KTtcbiAgICBrZXlzID0gT2JqZWN0LmtleXM7XG4gIH1cblxuICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMpIHtcbiAgICB2YXIgb2JqZWN0R09QTkFjY2VwdHNQcmltaXRpdmVzID0gIXRocm93c0Vycm9yKGZ1bmN0aW9uICgpIHsgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoJ2ZvbycpOyB9KTtcbiAgICBpZiAoIW9iamVjdEdPUE5BY2NlcHRzUHJpbWl0aXZlcykge1xuICAgICAgdmFyIGNhY2hlZFdpbmRvd05hbWVzID0gdHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh3aW5kb3cpIDogW107XG4gICAgICB2YXIgb3JpZ2luYWxPYmplY3RHZXRPd25Qcm9wZXJ0eU5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG4gICAgICBvdmVycmlkZU5hdGl2ZShPYmplY3QsICdnZXRPd25Qcm9wZXJ0eU5hbWVzJywgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSkge1xuICAgICAgICB2YXIgdmFsID0gRVMuVG9PYmplY3QodmFsdWUpO1xuICAgICAgICBpZiAoX3RvU3RyaW5nKHZhbCkgPT09ICdbb2JqZWN0IFdpbmRvd10nKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbE9iamVjdEdldE93blByb3BlcnR5TmFtZXModmFsKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvLyBJRSBidWcgd2hlcmUgbGF5b3V0IGVuZ2luZSBjYWxscyB1c2VybGFuZCBnT1BOIGZvciBjcm9zcy1kb21haW4gYHdpbmRvd2Agb2JqZWN0c1xuICAgICAgICAgICAgcmV0dXJuIF9jb25jYXQoW10sIGNhY2hlZFdpbmRvd05hbWVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsT2JqZWN0R2V0T3duUHJvcGVydHlOYW1lcyh2YWwpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKSB7XG4gICAgdmFyIG9iamVjdEdPUERBY2NlcHRzUHJpbWl0aXZlcyA9ICF0aHJvd3NFcnJvcihmdW5jdGlvbiAoKSB7IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoJ2ZvbycsICdiYXInKTsgfSk7XG4gICAgaWYgKCFvYmplY3RHT1BEQWNjZXB0c1ByaW1pdGl2ZXMpIHtcbiAgICAgIHZhciBvcmlnaW5hbE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gICAgICBvdmVycmlkZU5hdGl2ZShPYmplY3QsICdnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3InLCBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIHByb3BlcnR5KSB7XG4gICAgICAgIHJldHVybiBvcmlnaW5hbE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihFUy5Ub09iamVjdCh2YWx1ZSksIHByb3BlcnR5KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBpZiAoT2JqZWN0LnNlYWwpIHtcbiAgICB2YXIgb2JqZWN0U2VhbEFjY2VwdHNQcmltaXRpdmVzID0gIXRocm93c0Vycm9yKGZ1bmN0aW9uICgpIHsgT2JqZWN0LnNlYWwoJ2ZvbycpOyB9KTtcbiAgICBpZiAoIW9iamVjdFNlYWxBY2NlcHRzUHJpbWl0aXZlcykge1xuICAgICAgdmFyIG9yaWdpbmFsT2JqZWN0U2VhbCA9IE9iamVjdC5zZWFsO1xuICAgICAgb3ZlcnJpZGVOYXRpdmUoT2JqZWN0LCAnc2VhbCcsIGZ1bmN0aW9uIHNlYWwodmFsdWUpIHtcbiAgICAgICAgaWYgKCFFUy5UeXBlSXNPYmplY3QodmFsdWUpKSB7IHJldHVybiB2YWx1ZTsgfVxuICAgICAgICByZXR1cm4gb3JpZ2luYWxPYmplY3RTZWFsKHZhbHVlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBpZiAoT2JqZWN0LmlzU2VhbGVkKSB7XG4gICAgdmFyIG9iamVjdElzU2VhbGVkQWNjZXB0c1ByaW1pdGl2ZXMgPSAhdGhyb3dzRXJyb3IoZnVuY3Rpb24gKCkgeyBPYmplY3QuaXNTZWFsZWQoJ2ZvbycpOyB9KTtcbiAgICBpZiAoIW9iamVjdElzU2VhbGVkQWNjZXB0c1ByaW1pdGl2ZXMpIHtcbiAgICAgIHZhciBvcmlnaW5hbE9iamVjdElzU2VhbGVkID0gT2JqZWN0LmlzU2VhbGVkO1xuICAgICAgb3ZlcnJpZGVOYXRpdmUoT2JqZWN0LCAnaXNTZWFsZWQnLCBmdW5jdGlvbiBpc1NlYWxlZCh2YWx1ZSkge1xuICAgICAgICBpZiAoIUVTLlR5cGVJc09iamVjdCh2YWx1ZSkpIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsT2JqZWN0SXNTZWFsZWQodmFsdWUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChPYmplY3QuZnJlZXplKSB7XG4gICAgdmFyIG9iamVjdEZyZWV6ZUFjY2VwdHNQcmltaXRpdmVzID0gIXRocm93c0Vycm9yKGZ1bmN0aW9uICgpIHsgT2JqZWN0LmZyZWV6ZSgnZm9vJyk7IH0pO1xuICAgIGlmICghb2JqZWN0RnJlZXplQWNjZXB0c1ByaW1pdGl2ZXMpIHtcbiAgICAgIHZhciBvcmlnaW5hbE9iamVjdEZyZWV6ZSA9IE9iamVjdC5mcmVlemU7XG4gICAgICBvdmVycmlkZU5hdGl2ZShPYmplY3QsICdmcmVlemUnLCBmdW5jdGlvbiBmcmVlemUodmFsdWUpIHtcbiAgICAgICAgaWYgKCFFUy5UeXBlSXNPYmplY3QodmFsdWUpKSB7IHJldHVybiB2YWx1ZTsgfVxuICAgICAgICByZXR1cm4gb3JpZ2luYWxPYmplY3RGcmVlemUodmFsdWUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChPYmplY3QuaXNGcm96ZW4pIHtcbiAgICB2YXIgb2JqZWN0SXNGcm96ZW5BY2NlcHRzUHJpbWl0aXZlcyA9ICF0aHJvd3NFcnJvcihmdW5jdGlvbiAoKSB7IE9iamVjdC5pc0Zyb3plbignZm9vJyk7IH0pO1xuICAgIGlmICghb2JqZWN0SXNGcm96ZW5BY2NlcHRzUHJpbWl0aXZlcykge1xuICAgICAgdmFyIG9yaWdpbmFsT2JqZWN0SXNGcm96ZW4gPSBPYmplY3QuaXNGcm96ZW47XG4gICAgICBvdmVycmlkZU5hdGl2ZShPYmplY3QsICdpc0Zyb3plbicsIGZ1bmN0aW9uIGlzRnJvemVuKHZhbHVlKSB7XG4gICAgICAgIGlmICghRVMuVHlwZUlzT2JqZWN0KHZhbHVlKSkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICByZXR1cm4gb3JpZ2luYWxPYmplY3RJc0Zyb3plbih2YWx1ZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucykge1xuICAgIHZhciBvYmplY3RQcmV2ZW50RXh0ZW5zaW9uc0FjY2VwdHNQcmltaXRpdmVzID0gIXRocm93c0Vycm9yKGZ1bmN0aW9uICgpIHsgT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKCdmb28nKTsgfSk7XG4gICAgaWYgKCFvYmplY3RQcmV2ZW50RXh0ZW5zaW9uc0FjY2VwdHNQcmltaXRpdmVzKSB7XG4gICAgICB2YXIgb3JpZ2luYWxPYmplY3RQcmV2ZW50RXh0ZW5zaW9ucyA9IE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucztcbiAgICAgIG92ZXJyaWRlTmF0aXZlKE9iamVjdCwgJ3ByZXZlbnRFeHRlbnNpb25zJywgZnVuY3Rpb24gcHJldmVudEV4dGVuc2lvbnModmFsdWUpIHtcbiAgICAgICAgaWYgKCFFUy5UeXBlSXNPYmplY3QodmFsdWUpKSB7IHJldHVybiB2YWx1ZTsgfVxuICAgICAgICByZXR1cm4gb3JpZ2luYWxPYmplY3RQcmV2ZW50RXh0ZW5zaW9ucyh2YWx1ZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKE9iamVjdC5pc0V4dGVuc2libGUpIHtcbiAgICB2YXIgb2JqZWN0SXNFeHRlbnNpYmxlQWNjZXB0c1ByaW1pdGl2ZXMgPSAhdGhyb3dzRXJyb3IoZnVuY3Rpb24gKCkgeyBPYmplY3QuaXNFeHRlbnNpYmxlKCdmb28nKTsgfSk7XG4gICAgaWYgKCFvYmplY3RJc0V4dGVuc2libGVBY2NlcHRzUHJpbWl0aXZlcykge1xuICAgICAgdmFyIG9yaWdpbmFsT2JqZWN0SXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZTtcbiAgICAgIG92ZXJyaWRlTmF0aXZlKE9iamVjdCwgJ2lzRXh0ZW5zaWJsZScsIGZ1bmN0aW9uIGlzRXh0ZW5zaWJsZSh2YWx1ZSkge1xuICAgICAgICBpZiAoIUVTLlR5cGVJc09iamVjdCh2YWx1ZSkpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICAgIHJldHVybiBvcmlnaW5hbE9iamVjdElzRXh0ZW5zaWJsZSh2YWx1ZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKE9iamVjdC5nZXRQcm90b3R5cGVPZikge1xuICAgIHZhciBvYmplY3RHZXRQcm90b0FjY2VwdHNQcmltaXRpdmVzID0gIXRocm93c0Vycm9yKGZ1bmN0aW9uICgpIHsgT2JqZWN0LmdldFByb3RvdHlwZU9mKCdmb28nKTsgfSk7XG4gICAgaWYgKCFvYmplY3RHZXRQcm90b0FjY2VwdHNQcmltaXRpdmVzKSB7XG4gICAgICB2YXIgb3JpZ2luYWxHZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgICAgIG92ZXJyaWRlTmF0aXZlKE9iamVjdCwgJ2dldFByb3RvdHlwZU9mJywgZnVuY3Rpb24gZ2V0UHJvdG90eXBlT2YodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsR2V0UHJvdG8oRVMuVG9PYmplY3QodmFsdWUpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHZhciBoYXNGbGFncyA9IHN1cHBvcnRzRGVzY3JpcHRvcnMgJiYgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoUmVnRXhwLnByb3RvdHlwZSwgJ2ZsYWdzJyk7XG4gICAgcmV0dXJuIGRlc2MgJiYgRVMuSXNDYWxsYWJsZShkZXNjLmdldCk7XG4gIH0oKSk7XG4gIGlmIChzdXBwb3J0c0Rlc2NyaXB0b3JzICYmICFoYXNGbGFncykge1xuICAgIHZhciByZWdFeHBGbGFnc0dldHRlciA9IGZ1bmN0aW9uIGZsYWdzKCkge1xuICAgICAgaWYgKCFFUy5UeXBlSXNPYmplY3QodGhpcykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTWV0aG9kIGNhbGxlZCBvbiBpbmNvbXBhdGlibGUgdHlwZTogbXVzdCBiZSBhbiBvYmplY3QuJyk7XG4gICAgICB9XG4gICAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgICBpZiAodGhpcy5nbG9iYWwpIHtcbiAgICAgICAgcmVzdWx0ICs9ICdnJztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmlnbm9yZUNhc2UpIHtcbiAgICAgICAgcmVzdWx0ICs9ICdpJztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm11bHRpbGluZSkge1xuICAgICAgICByZXN1bHQgKz0gJ20nO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMudW5pY29kZSkge1xuICAgICAgICByZXN1bHQgKz0gJ3UnO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc3RpY2t5KSB7XG4gICAgICAgIHJlc3VsdCArPSAneSc7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICBWYWx1ZS5nZXR0ZXIoUmVnRXhwLnByb3RvdHlwZSwgJ2ZsYWdzJywgcmVnRXhwRmxhZ3NHZXR0ZXIpO1xuICB9XG5cbiAgdmFyIHJlZ0V4cFN1cHBvcnRzRmxhZ3NXaXRoUmVnZXggPSBzdXBwb3J0c0Rlc2NyaXB0b3JzICYmIHZhbHVlT3JGYWxzZUlmVGhyb3dzKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gU3RyaW5nKG5ldyBSZWdFeHAoL2EvZywgJ2knKSkgPT09ICcvYS9pJztcbiAgfSk7XG4gIHZhciByZWdFeHBOZWVkc1RvU3VwcG9ydFN5bWJvbE1hdGNoID0gaGFzU3ltYm9scyAmJiBzdXBwb3J0c0Rlc2NyaXB0b3JzICYmIChmdW5jdGlvbiAoKSB7XG4gICAgLy8gRWRnZSAwLjEyIHN1cHBvcnRzIGZsYWdzIGZ1bGx5LCBidXQgZG9lcyBub3Qgc3VwcG9ydCBTeW1ib2wubWF0Y2hcbiAgICB2YXIgcmVnZXggPSAvLi87XG4gICAgcmVnZXhbU3ltYm9sLm1hdGNoXSA9IGZhbHNlO1xuICAgIHJldHVybiBSZWdFeHAocmVnZXgpID09PSByZWdleDtcbiAgfSgpKTtcblxuICB2YXIgcmVnZXhUb1N0cmluZ0lzR2VuZXJpYyA9IHZhbHVlT3JGYWxzZUlmVGhyb3dzKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHsgc291cmNlOiAnYWJjJyB9KSA9PT0gJy9hYmMvJztcbiAgfSk7XG4gIHZhciByZWdleFRvU3RyaW5nU3VwcG9ydHNHZW5lcmljRmxhZ3MgPSByZWdleFRvU3RyaW5nSXNHZW5lcmljICYmIHZhbHVlT3JGYWxzZUlmVGhyb3dzKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHsgc291cmNlOiAnYScsIGZsYWdzOiAnYicgfSkgPT09ICcvYS9iJztcbiAgfSk7XG4gIGlmICghcmVnZXhUb1N0cmluZ0lzR2VuZXJpYyB8fCAhcmVnZXhUb1N0cmluZ1N1cHBvcnRzR2VuZXJpY0ZsYWdzKSB7XG4gICAgdmFyIG9yaWdSZWdFeHBUb1N0cmluZyA9IFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmc7XG4gICAgZGVmaW5lUHJvcGVydHkoUmVnRXhwLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgICB2YXIgUiA9IEVTLlJlcXVpcmVPYmplY3RDb2VyY2libGUodGhpcyk7XG4gICAgICBpZiAoVHlwZS5yZWdleChSKSkge1xuICAgICAgICByZXR1cm4gX2NhbGwob3JpZ1JlZ0V4cFRvU3RyaW5nLCBSKTtcbiAgICAgIH1cbiAgICAgIHZhciBwYXR0ZXJuID0gJFN0cmluZyhSLnNvdXJjZSk7XG4gICAgICB2YXIgZmxhZ3MgPSAkU3RyaW5nKFIuZmxhZ3MpO1xuICAgICAgcmV0dXJuICcvJyArIHBhdHRlcm4gKyAnLycgKyBmbGFncztcbiAgICB9LCB0cnVlKTtcbiAgICBWYWx1ZS5wcmVzZXJ2ZVRvU3RyaW5nKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcsIG9yaWdSZWdFeHBUb1N0cmluZyk7XG4gIH1cblxuICBpZiAoc3VwcG9ydHNEZXNjcmlwdG9ycyAmJiAoIXJlZ0V4cFN1cHBvcnRzRmxhZ3NXaXRoUmVnZXggfHwgcmVnRXhwTmVlZHNUb1N1cHBvcnRTeW1ib2xNYXRjaCkpIHtcbiAgICB2YXIgZmxhZ3NHZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFJlZ0V4cC5wcm90b3R5cGUsICdmbGFncycpLmdldDtcbiAgICB2YXIgc291cmNlRGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoUmVnRXhwLnByb3RvdHlwZSwgJ3NvdXJjZScpIHx8IHt9O1xuICAgIHZhciBsZWdhY3lTb3VyY2VHZXR0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBwcmlvciB0byBpdCBiZWluZyBhIGdldHRlciwgaXQncyBvd24gKyBub25jb25maWd1cmFibGVcbiAgICAgIHJldHVybiB0aGlzLnNvdXJjZTtcbiAgICB9O1xuICAgIHZhciBzb3VyY2VHZXR0ZXIgPSBFUy5Jc0NhbGxhYmxlKHNvdXJjZURlc2MuZ2V0KSA/IHNvdXJjZURlc2MuZ2V0IDogbGVnYWN5U291cmNlR2V0dGVyO1xuXG4gICAgdmFyIE9yaWdSZWdFeHAgPSBSZWdFeHA7XG4gICAgdmFyIFJlZ0V4cFNoaW0gPSAoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIFJlZ0V4cChwYXR0ZXJuLCBmbGFncykge1xuICAgICAgICB2YXIgcGF0dGVybklzUmVnRXhwID0gRVMuSXNSZWdFeHAocGF0dGVybik7XG4gICAgICAgIHZhciBjYWxsZWRXaXRoTmV3ID0gdGhpcyBpbnN0YW5jZW9mIFJlZ0V4cDtcbiAgICAgICAgaWYgKCFjYWxsZWRXaXRoTmV3ICYmIHBhdHRlcm5Jc1JlZ0V4cCAmJiB0eXBlb2YgZmxhZ3MgPT09ICd1bmRlZmluZWQnICYmIHBhdHRlcm4uY29uc3RydWN0b3IgPT09IFJlZ0V4cCkge1xuICAgICAgICAgIHJldHVybiBwYXR0ZXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIFAgPSBwYXR0ZXJuO1xuICAgICAgICB2YXIgRiA9IGZsYWdzO1xuICAgICAgICBpZiAoVHlwZS5yZWdleChwYXR0ZXJuKSkge1xuICAgICAgICAgIFAgPSBFUy5DYWxsKHNvdXJjZUdldHRlciwgcGF0dGVybik7XG4gICAgICAgICAgRiA9IHR5cGVvZiBmbGFncyA9PT0gJ3VuZGVmaW5lZCcgPyBFUy5DYWxsKGZsYWdzR2V0dGVyLCBwYXR0ZXJuKSA6IGZsYWdzO1xuICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKFAsIEYpO1xuICAgICAgICB9IGVsc2UgaWYgKHBhdHRlcm5Jc1JlZ0V4cCkge1xuICAgICAgICAgIFAgPSBwYXR0ZXJuLnNvdXJjZTtcbiAgICAgICAgICBGID0gdHlwZW9mIGZsYWdzID09PSAndW5kZWZpbmVkJyA/IHBhdHRlcm4uZmxhZ3MgOiBmbGFncztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IE9yaWdSZWdFeHAocGF0dGVybiwgZmxhZ3MpO1xuICAgICAgfTtcbiAgICB9KCkpO1xuICAgIHdyYXBDb25zdHJ1Y3RvcihPcmlnUmVnRXhwLCBSZWdFeHBTaGltLCB7XG4gICAgICAkaW5wdXQ6IHRydWUgLy8gQ2hyb21lIDwgdjM5ICYgT3BlcmEgPCAyNiBoYXZlIGEgbm9uc3RhbmRhcmQgXCIkaW5wdXRcIiBwcm9wZXJ0eVxuICAgIH0pO1xuICAgIC8qIGdsb2JhbHMgUmVnRXhwOiB0cnVlICovXG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYsIG5vLWdsb2JhbC1hc3NpZ24gKi9cbiAgICAvKiBqc2hpbnQgLVcwMjAgKi9cbiAgICBSZWdFeHAgPSBSZWdFeHBTaGltO1xuICAgIFZhbHVlLnJlZGVmaW5lKGdsb2JhbHMsICdSZWdFeHAnLCBSZWdFeHBTaGltKTtcbiAgICAvKiBqc2hpbnQgK1cwMjAgKi9cbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVuZGVmLCBuby1nbG9iYWwtYXNzaWduICovXG4gICAgLyogZ2xvYmFscyBSZWdFeHA6IGZhbHNlICovXG4gIH1cblxuICBpZiAoc3VwcG9ydHNEZXNjcmlwdG9ycykge1xuICAgIHZhciByZWdleEdsb2JhbHMgPSB7XG4gICAgICBpbnB1dDogJyRfJyxcbiAgICAgIGxhc3RNYXRjaDogJyQmJyxcbiAgICAgIGxhc3RQYXJlbjogJyQrJyxcbiAgICAgIGxlZnRDb250ZXh0OiAnJGAnLFxuICAgICAgcmlnaHRDb250ZXh0OiAnJFxcJydcbiAgICB9O1xuICAgIF9mb3JFYWNoKGtleXMocmVnZXhHbG9iYWxzKSwgZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgIGlmIChwcm9wIGluIFJlZ0V4cCAmJiAhKHJlZ2V4R2xvYmFsc1twcm9wXSBpbiBSZWdFeHApKSB7XG4gICAgICAgIFZhbHVlLmdldHRlcihSZWdFeHAsIHJlZ2V4R2xvYmFsc1twcm9wXSwgZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgIHJldHVybiBSZWdFeHBbcHJvcF07XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGFkZERlZmF1bHRTcGVjaWVzKFJlZ0V4cCk7XG5cbiAgdmFyIGludmVyc2VFcHNpbG9uID0gMSAvIE51bWJlci5FUFNJTE9OO1xuICB2YXIgcm91bmRUaWVzVG9FdmVuID0gZnVuY3Rpb24gcm91bmRUaWVzVG9FdmVuKG4pIHtcbiAgICAvLyBFdmVuIHRob3VnaCB0aGlzIHJlZHVjZXMgZG93biB0byBgcmV0dXJuIG5gLCBpdCB0YWtlcyBhZHZhbnRhZ2Ugb2YgYnVpbHQtaW4gcm91bmRpbmcuXG4gICAgcmV0dXJuIChuICsgaW52ZXJzZUVwc2lsb24pIC0gaW52ZXJzZUVwc2lsb247XG4gIH07XG4gIHZhciBCSU5BUllfMzJfRVBTSUxPTiA9IE1hdGgucG93KDIsIC0yMyk7XG4gIHZhciBCSU5BUllfMzJfTUFYX1ZBTFVFID0gTWF0aC5wb3coMiwgMTI3KSAqICgyIC0gQklOQVJZXzMyX0VQU0lMT04pO1xuICB2YXIgQklOQVJZXzMyX01JTl9WQUxVRSA9IE1hdGgucG93KDIsIC0xMjYpO1xuICB2YXIgRSA9IE1hdGguRTtcbiAgdmFyIExPRzJFID0gTWF0aC5MT0cyRTtcbiAgdmFyIExPRzEwRSA9IE1hdGguTE9HMTBFO1xuICB2YXIgbnVtYmVyQ0xaID0gTnVtYmVyLnByb3RvdHlwZS5jbHo7XG4gIGRlbGV0ZSBOdW1iZXIucHJvdG90eXBlLmNsejsgLy8gU2FmYXJpIDggaGFzIE51bWJlciNjbHpcblxuICB2YXIgTWF0aFNoaW1zID0ge1xuICAgIGFjb3NoOiBmdW5jdGlvbiBhY29zaCh2YWx1ZSkge1xuICAgICAgdmFyIHggPSBOdW1iZXIodmFsdWUpO1xuICAgICAgaWYgKG51bWJlcklzTmFOKHgpIHx8IHZhbHVlIDwgMSkgeyByZXR1cm4gTmFOOyB9XG4gICAgICBpZiAoeCA9PT0gMSkgeyByZXR1cm4gMDsgfVxuICAgICAgaWYgKHggPT09IEluZmluaXR5KSB7IHJldHVybiB4OyB9XG4gICAgICByZXR1cm4gX2xvZygoeCAvIEUpICsgKF9zcXJ0KHggKyAxKSAqIF9zcXJ0KHggLSAxKSAvIEUpKSArIDE7XG4gICAgfSxcblxuICAgIGFzaW5oOiBmdW5jdGlvbiBhc2luaCh2YWx1ZSkge1xuICAgICAgdmFyIHggPSBOdW1iZXIodmFsdWUpO1xuICAgICAgaWYgKHggPT09IDAgfHwgIWdsb2JhbElzRmluaXRlKHgpKSB7XG4gICAgICAgIHJldHVybiB4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHggPCAwID8gLWFzaW5oKC14KSA6IF9sb2coeCArIF9zcXJ0KCh4ICogeCkgKyAxKSk7XG4gICAgfSxcblxuICAgIGF0YW5oOiBmdW5jdGlvbiBhdGFuaCh2YWx1ZSkge1xuICAgICAgdmFyIHggPSBOdW1iZXIodmFsdWUpO1xuICAgICAgaWYgKG51bWJlcklzTmFOKHgpIHx8IHggPCAtMSB8fCB4ID4gMSkge1xuICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgfVxuICAgICAgaWYgKHggPT09IC0xKSB7IHJldHVybiAtSW5maW5pdHk7IH1cbiAgICAgIGlmICh4ID09PSAxKSB7IHJldHVybiBJbmZpbml0eTsgfVxuICAgICAgaWYgKHggPT09IDApIHsgcmV0dXJuIHg7IH1cbiAgICAgIHJldHVybiAwLjUgKiBfbG9nKCgxICsgeCkgLyAoMSAtIHgpKTtcbiAgICB9LFxuXG4gICAgY2JydDogZnVuY3Rpb24gY2JydCh2YWx1ZSkge1xuICAgICAgdmFyIHggPSBOdW1iZXIodmFsdWUpO1xuICAgICAgaWYgKHggPT09IDApIHsgcmV0dXJuIHg7IH1cbiAgICAgIHZhciBuZWdhdGUgPSB4IDwgMDtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICBpZiAobmVnYXRlKSB7IHggPSAteDsgfVxuICAgICAgaWYgKHggPT09IEluZmluaXR5KSB7XG4gICAgICAgIHJlc3VsdCA9IEluZmluaXR5O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gX2V4cChfbG9nKHgpIC8gMyk7XG4gICAgICAgIC8vIGZyb20gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9DdWJlX3Jvb3QjTnVtZXJpY2FsX21ldGhvZHNcbiAgICAgICAgcmVzdWx0ID0gKCh4IC8gKHJlc3VsdCAqIHJlc3VsdCkpICsgKDIgKiByZXN1bHQpKSAvIDM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmVnYXRlID8gLXJlc3VsdCA6IHJlc3VsdDtcbiAgICB9LFxuXG4gICAgY2x6MzI6IGZ1bmN0aW9uIGNsejMyKHZhbHVlKSB7XG4gICAgICAvLyBTZWUgaHR0cHM6Ly9idWdzLmVjbWFzY3JpcHQub3JnL3Nob3dfYnVnLmNnaT9pZD0yNDY1XG4gICAgICB2YXIgeCA9IE51bWJlcih2YWx1ZSk7XG4gICAgICB2YXIgbnVtYmVyID0gRVMuVG9VaW50MzIoeCk7XG4gICAgICBpZiAobnVtYmVyID09PSAwKSB7XG4gICAgICAgIHJldHVybiAzMjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudW1iZXJDTFogPyBFUy5DYWxsKG51bWJlckNMWiwgbnVtYmVyKSA6IDMxIC0gX2Zsb29yKF9sb2cobnVtYmVyICsgMC41KSAqIExPRzJFKTtcbiAgICB9LFxuXG4gICAgY29zaDogZnVuY3Rpb24gY29zaCh2YWx1ZSkge1xuICAgICAgdmFyIHggPSBOdW1iZXIodmFsdWUpO1xuICAgICAgaWYgKHggPT09IDApIHsgcmV0dXJuIDE7IH0gLy8gKzAgb3IgLTBcbiAgICAgIGlmIChudW1iZXJJc05hTih4KSkgeyByZXR1cm4gTmFOOyB9XG4gICAgICBpZiAoIWdsb2JhbElzRmluaXRlKHgpKSB7IHJldHVybiBJbmZpbml0eTsgfVxuICAgICAgaWYgKHggPCAwKSB7IHggPSAteDsgfVxuICAgICAgaWYgKHggPiAyMSkgeyByZXR1cm4gX2V4cCh4KSAvIDI7IH1cbiAgICAgIHJldHVybiAoX2V4cCh4KSArIF9leHAoLXgpKSAvIDI7XG4gICAgfSxcblxuICAgIGV4cG0xOiBmdW5jdGlvbiBleHBtMSh2YWx1ZSkge1xuICAgICAgdmFyIHggPSBOdW1iZXIodmFsdWUpO1xuICAgICAgaWYgKHggPT09IC1JbmZpbml0eSkgeyByZXR1cm4gLTE7IH1cbiAgICAgIGlmICghZ2xvYmFsSXNGaW5pdGUoeCkgfHwgeCA9PT0gMCkgeyByZXR1cm4geDsgfVxuICAgICAgaWYgKF9hYnMoeCkgPiAwLjUpIHtcbiAgICAgICAgcmV0dXJuIF9leHAoeCkgLSAxO1xuICAgICAgfVxuICAgICAgLy8gQSBtb3JlIHByZWNpc2UgYXBwcm94aW1hdGlvbiB1c2luZyBUYXlsb3Igc2VyaWVzIGV4cGFuc2lvblxuICAgICAgLy8gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vcGF1bG1pbGxyL2VzNi1zaGltL2lzc3Vlcy8zMTQjaXNzdWVjb21tZW50LTcwMjkzOTg2XG4gICAgICB2YXIgdCA9IHg7XG4gICAgICB2YXIgc3VtID0gMDtcbiAgICAgIHZhciBuID0gMTtcbiAgICAgIHdoaWxlIChzdW0gKyB0ICE9PSBzdW0pIHtcbiAgICAgICAgc3VtICs9IHQ7XG4gICAgICAgIG4gKz0gMTtcbiAgICAgICAgdCAqPSB4IC8gbjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdW07XG4gICAgfSxcblxuICAgIGh5cG90OiBmdW5jdGlvbiBoeXBvdCh4LCB5KSB7XG4gICAgICB2YXIgcmVzdWx0ID0gMDtcbiAgICAgIHZhciBsYXJnZXN0ID0gMDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IF9hYnMoTnVtYmVyKGFyZ3VtZW50c1tpXSkpO1xuICAgICAgICBpZiAobGFyZ2VzdCA8IHZhbHVlKSB7XG4gICAgICAgICAgcmVzdWx0ICo9IChsYXJnZXN0IC8gdmFsdWUpICogKGxhcmdlc3QgLyB2YWx1ZSk7XG4gICAgICAgICAgcmVzdWx0ICs9IDE7XG4gICAgICAgICAgbGFyZ2VzdCA9IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdCArPSB2YWx1ZSA+IDAgPyAodmFsdWUgLyBsYXJnZXN0KSAqICh2YWx1ZSAvIGxhcmdlc3QpIDogdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBsYXJnZXN0ID09PSBJbmZpbml0eSA/IEluZmluaXR5IDogbGFyZ2VzdCAqIF9zcXJ0KHJlc3VsdCk7XG4gICAgfSxcblxuICAgIGxvZzI6IGZ1bmN0aW9uIGxvZzIodmFsdWUpIHtcbiAgICAgIHJldHVybiBfbG9nKHZhbHVlKSAqIExPRzJFO1xuICAgIH0sXG5cbiAgICBsb2cxMDogZnVuY3Rpb24gbG9nMTAodmFsdWUpIHtcbiAgICAgIHJldHVybiBfbG9nKHZhbHVlKSAqIExPRzEwRTtcbiAgICB9LFxuXG4gICAgbG9nMXA6IGZ1bmN0aW9uIGxvZzFwKHZhbHVlKSB7XG4gICAgICB2YXIgeCA9IE51bWJlcih2YWx1ZSk7XG4gICAgICBpZiAoeCA8IC0xIHx8IG51bWJlcklzTmFOKHgpKSB7IHJldHVybiBOYU47IH1cbiAgICAgIGlmICh4ID09PSAwIHx8IHggPT09IEluZmluaXR5KSB7IHJldHVybiB4OyB9XG4gICAgICBpZiAoeCA9PT0gLTEpIHsgcmV0dXJuIC1JbmZpbml0eTsgfVxuXG4gICAgICByZXR1cm4gKDEgKyB4KSAtIDEgPT09IDAgPyB4IDogeCAqIChfbG9nKDEgKyB4KSAvICgoMSArIHgpIC0gMSkpO1xuICAgIH0sXG5cbiAgICBzaWduOiBfc2lnbixcblxuICAgIHNpbmg6IGZ1bmN0aW9uIHNpbmgodmFsdWUpIHtcbiAgICAgIHZhciB4ID0gTnVtYmVyKHZhbHVlKTtcbiAgICAgIGlmICghZ2xvYmFsSXNGaW5pdGUoeCkgfHwgeCA9PT0gMCkgeyByZXR1cm4geDsgfVxuXG4gICAgICBpZiAoX2Ficyh4KSA8IDEpIHtcbiAgICAgICAgcmV0dXJuIChNYXRoLmV4cG0xKHgpIC0gTWF0aC5leHBtMSgteCkpIC8gMjtcbiAgICAgIH1cbiAgICAgIHJldHVybiAoX2V4cCh4IC0gMSkgLSBfZXhwKC14IC0gMSkpICogRSAvIDI7XG4gICAgfSxcblxuICAgIHRhbmg6IGZ1bmN0aW9uIHRhbmgodmFsdWUpIHtcbiAgICAgIHZhciB4ID0gTnVtYmVyKHZhbHVlKTtcbiAgICAgIGlmIChudW1iZXJJc05hTih4KSB8fCB4ID09PSAwKSB7IHJldHVybiB4OyB9XG4gICAgICAvLyBjYW4gZXhpdCBlYXJseSBhdCArLTIwIGFzIEpTIGxvc2VzIHByZWNpc2lvbiBmb3IgdHJ1ZSB2YWx1ZSBhdCB0aGlzIGludGVnZXJcbiAgICAgIGlmICh4ID49IDIwKSB7IHJldHVybiAxOyB9XG4gICAgICBpZiAoeCA8PSAtMjApIHsgcmV0dXJuIC0xOyB9XG5cbiAgICAgIHJldHVybiAoTWF0aC5leHBtMSh4KSAtIE1hdGguZXhwbTEoLXgpKSAvIChfZXhwKHgpICsgX2V4cCgteCkpO1xuICAgIH0sXG5cbiAgICB0cnVuYzogZnVuY3Rpb24gdHJ1bmModmFsdWUpIHtcbiAgICAgIHZhciB4ID0gTnVtYmVyKHZhbHVlKTtcbiAgICAgIHJldHVybiB4IDwgMCA/IC1fZmxvb3IoLXgpIDogX2Zsb29yKHgpO1xuICAgIH0sXG5cbiAgICBpbXVsOiBmdW5jdGlvbiBpbXVsKHgsIHkpIHtcbiAgICAgIC8vIHRha2VuIGZyb20gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTWF0aC9pbXVsXG4gICAgICB2YXIgYSA9IEVTLlRvVWludDMyKHgpO1xuICAgICAgdmFyIGIgPSBFUy5Ub1VpbnQzMih5KTtcbiAgICAgIHZhciBhaCA9IChhID4+PiAxNikgJiAweGZmZmY7XG4gICAgICB2YXIgYWwgPSBhICYgMHhmZmZmO1xuICAgICAgdmFyIGJoID0gKGIgPj4+IDE2KSAmIDB4ZmZmZjtcbiAgICAgIHZhciBibCA9IGIgJiAweGZmZmY7XG4gICAgICAvLyB0aGUgc2hpZnQgYnkgMCBmaXhlcyB0aGUgc2lnbiBvbiB0aGUgaGlnaCBwYXJ0XG4gICAgICAvLyB0aGUgZmluYWwgfDAgY29udmVydHMgdGhlIHVuc2lnbmVkIHZhbHVlIGludG8gYSBzaWduZWQgdmFsdWVcbiAgICAgIHJldHVybiAoYWwgKiBibCkgKyAoKCgoYWggKiBibCkgKyAoYWwgKiBiaCkpIDw8IDE2KSA+Pj4gMCkgfCAwO1xuICAgIH0sXG5cbiAgICBmcm91bmQ6IGZ1bmN0aW9uIGZyb3VuZCh4KSB7XG4gICAgICB2YXIgdiA9IE51bWJlcih4KTtcbiAgICAgIGlmICh2ID09PSAwIHx8IHYgPT09IEluZmluaXR5IHx8IHYgPT09IC1JbmZpbml0eSB8fCBudW1iZXJJc05hTih2KSkge1xuICAgICAgICByZXR1cm4gdjtcbiAgICAgIH1cbiAgICAgIHZhciBzaWduID0gX3NpZ24odik7XG4gICAgICB2YXIgYWJzID0gX2Ficyh2KTtcbiAgICAgIGlmIChhYnMgPCBCSU5BUllfMzJfTUlOX1ZBTFVFKSB7XG4gICAgICAgIHJldHVybiBzaWduICogcm91bmRUaWVzVG9FdmVuKFxuICAgICAgICAgIGFicyAvIEJJTkFSWV8zMl9NSU5fVkFMVUUgLyBCSU5BUllfMzJfRVBTSUxPTlxuICAgICAgICApICogQklOQVJZXzMyX01JTl9WQUxVRSAqIEJJTkFSWV8zMl9FUFNJTE9OO1xuICAgICAgfVxuICAgICAgLy8gVmVsdGthbXAncyBzcGxpdHRpbmcgKD8pXG4gICAgICB2YXIgYSA9ICgxICsgKEJJTkFSWV8zMl9FUFNJTE9OIC8gTnVtYmVyLkVQU0lMT04pKSAqIGFicztcbiAgICAgIHZhciByZXN1bHQgPSBhIC0gKGEgLSBhYnMpO1xuICAgICAgaWYgKHJlc3VsdCA+IEJJTkFSWV8zMl9NQVhfVkFMVUUgfHwgbnVtYmVySXNOYU4ocmVzdWx0KSkge1xuICAgICAgICByZXR1cm4gc2lnbiAqIEluZmluaXR5O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNpZ24gKiByZXN1bHQ7XG4gICAgfVxuICB9O1xuICBkZWZpbmVQcm9wZXJ0aWVzKE1hdGgsIE1hdGhTaGltcyk7XG4gIC8vIElFIDExIFRQIGhhcyBhbiBpbXByZWNpc2UgbG9nMXA6IHJlcG9ydHMgTWF0aC5sb2cxcCgtMWUtMTcpIGFzIDBcbiAgZGVmaW5lUHJvcGVydHkoTWF0aCwgJ2xvZzFwJywgTWF0aFNoaW1zLmxvZzFwLCBNYXRoLmxvZzFwKC0xZS0xNykgIT09IC0xZS0xNyk7XG4gIC8vIElFIDExIFRQIGhhcyBhbiBpbXByZWNpc2UgYXNpbmg6IHJlcG9ydHMgTWF0aC5hc2luaCgtMWU3KSBhcyBub3QgZXhhY3RseSBlcXVhbCB0byAtTWF0aC5hc2luaCgxZTcpXG4gIGRlZmluZVByb3BlcnR5KE1hdGgsICdhc2luaCcsIE1hdGhTaGltcy5hc2luaCwgTWF0aC5hc2luaCgtMWU3KSAhPT0gLU1hdGguYXNpbmgoMWU3KSk7XG4gIC8vIENocm9tZSA0MCBoYXMgYW4gaW1wcmVjaXNlIE1hdGgudGFuaCB3aXRoIHZlcnkgc21hbGwgbnVtYmVyc1xuICBkZWZpbmVQcm9wZXJ0eShNYXRoLCAndGFuaCcsIE1hdGhTaGltcy50YW5oLCBNYXRoLnRhbmgoLTJlLTE3KSAhPT0gLTJlLTE3KTtcbiAgLy8gQ2hyb21lIDQwIGxvc2VzIE1hdGguYWNvc2ggcHJlY2lzaW9uIHdpdGggaGlnaCBudW1iZXJzXG4gIGRlZmluZVByb3BlcnR5KE1hdGgsICdhY29zaCcsIE1hdGhTaGltcy5hY29zaCwgTWF0aC5hY29zaChOdW1iZXIuTUFYX1ZBTFVFKSA9PT0gSW5maW5pdHkpO1xuICAvLyBGaXJlZm94IDM4IG9uIFdpbmRvd3NcbiAgZGVmaW5lUHJvcGVydHkoTWF0aCwgJ2NicnQnLCBNYXRoU2hpbXMuY2JydCwgTWF0aC5hYnMoMSAtIChNYXRoLmNicnQoMWUtMzAwKSAvIDFlLTEwMCkpIC8gTnVtYmVyLkVQU0lMT04gPiA4KTtcbiAgLy8gbm9kZSAwLjExIGhhcyBhbiBpbXByZWNpc2UgTWF0aC5zaW5oIHdpdGggdmVyeSBzbWFsbCBudW1iZXJzXG4gIGRlZmluZVByb3BlcnR5KE1hdGgsICdzaW5oJywgTWF0aFNoaW1zLnNpbmgsIE1hdGguc2luaCgtMmUtMTcpICE9PSAtMmUtMTcpO1xuICAvLyBGRiAzNSBvbiBMaW51eCByZXBvcnRzIDIyMDI1LjQ2NTc5NDgwNjcyNSBmb3IgTWF0aC5leHBtMSgxMClcbiAgdmFyIGV4cG0xT2ZUZW4gPSBNYXRoLmV4cG0xKDEwKTtcbiAgZGVmaW5lUHJvcGVydHkoTWF0aCwgJ2V4cG0xJywgTWF0aFNoaW1zLmV4cG0xLCBleHBtMU9mVGVuID4gMjIwMjUuNDY1Nzk0ODA2NzE5IHx8IGV4cG0xT2ZUZW4gPCAyMjAyNS40NjU3OTQ4MDY3MTY1MTY4KTtcblxuICB2YXIgb3JpZ01hdGhSb3VuZCA9IE1hdGgucm91bmQ7XG4gIC8vIGJyZWFrcyBpbiBlLmcuIFNhZmFyaSA4LCBJbnRlcm5ldCBFeHBsb3JlciAxMSwgT3BlcmEgMTJcbiAgdmFyIHJvdW5kSGFuZGxlc0JvdW5kYXJ5Q29uZGl0aW9ucyA9IE1hdGgucm91bmQoMC41IC0gKE51bWJlci5FUFNJTE9OIC8gNCkpID09PSAwICYmXG4gICAgTWF0aC5yb3VuZCgtMC41ICsgKE51bWJlci5FUFNJTE9OIC8gMy45OSkpID09PSAxO1xuXG4gIC8vIFdoZW4gZW5naW5lcyB1c2UgTWF0aC5mbG9vcih4ICsgMC41KSBpbnRlcm5hbGx5LCBNYXRoLnJvdW5kIGNhbiBiZSBidWdneSBmb3IgbGFyZ2UgaW50ZWdlcnMuXG4gIC8vIFRoaXMgYmVoYXZpb3Igc2hvdWxkIGJlIGdvdmVybmVkIGJ5IFwicm91bmQgdG8gbmVhcmVzdCwgdGllcyB0byBldmVuIG1vZGVcIlxuICAvLyBzZWUgaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRlcm1zLWFuZC1kZWZpbml0aW9ucy1udW1iZXItdHlwZVxuICAvLyBUaGVzZSBhcmUgdGhlIGJvdW5kYXJ5IGNhc2VzIHdoZXJlIGl0IGJyZWFrcy5cbiAgdmFyIHNtYWxsZXN0UG9zaXRpdmVOdW1iZXJXaGVyZVJvdW5kQnJlYWtzID0gaW52ZXJzZUVwc2lsb24gKyAxO1xuICB2YXIgbGFyZ2VzdFBvc2l0aXZlTnVtYmVyV2hlcmVSb3VuZEJyZWFrcyA9ICgyICogaW52ZXJzZUVwc2lsb24pIC0gMTtcbiAgdmFyIHJvdW5kRG9lc05vdEluY3JlYXNlSW50ZWdlcnMgPSBbXG4gICAgc21hbGxlc3RQb3NpdGl2ZU51bWJlcldoZXJlUm91bmRCcmVha3MsXG4gICAgbGFyZ2VzdFBvc2l0aXZlTnVtYmVyV2hlcmVSb3VuZEJyZWFrc1xuICBdLmV2ZXJ5KGZ1bmN0aW9uIChudW0pIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChudW0pID09PSBudW07XG4gIH0pO1xuICBkZWZpbmVQcm9wZXJ0eShNYXRoLCAncm91bmQnLCBmdW5jdGlvbiByb3VuZCh4KSB7XG4gICAgdmFyIGZsb29yID0gX2Zsb29yKHgpO1xuICAgIHZhciBjZWlsID0gZmxvb3IgPT09IC0xID8gLTAgOiBmbG9vciArIDE7XG4gICAgcmV0dXJuIHggLSBmbG9vciA8IDAuNSA/IGZsb29yIDogY2VpbDtcbiAgfSwgIXJvdW5kSGFuZGxlc0JvdW5kYXJ5Q29uZGl0aW9ucyB8fCAhcm91bmREb2VzTm90SW5jcmVhc2VJbnRlZ2Vycyk7XG4gIFZhbHVlLnByZXNlcnZlVG9TdHJpbmcoTWF0aC5yb3VuZCwgb3JpZ01hdGhSb3VuZCk7XG5cbiAgdmFyIG9yaWdJbXVsID0gTWF0aC5pbXVsO1xuICBpZiAoTWF0aC5pbXVsKDB4ZmZmZmZmZmYsIDUpICE9PSAtNSkge1xuICAgIC8vIFNhZmFyaSA2LjEsIGF0IGxlYXN0LCByZXBvcnRzIFwiMFwiIGZvciB0aGlzIHZhbHVlXG4gICAgTWF0aC5pbXVsID0gTWF0aFNoaW1zLmltdWw7XG4gICAgVmFsdWUucHJlc2VydmVUb1N0cmluZyhNYXRoLmltdWwsIG9yaWdJbXVsKTtcbiAgfVxuICBpZiAoTWF0aC5pbXVsLmxlbmd0aCAhPT0gMikge1xuICAgIC8vIFNhZmFyaSA4LjAuNCBoYXMgYSBsZW5ndGggb2YgMVxuICAgIC8vIGZpeGVkIGluIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNDM2NThcbiAgICBvdmVycmlkZU5hdGl2ZShNYXRoLCAnaW11bCcsIGZ1bmN0aW9uIGltdWwoeCwgeSkge1xuICAgICAgcmV0dXJuIEVTLkNhbGwob3JpZ0ltdWwsIE1hdGgsIGFyZ3VtZW50cyk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBQcm9taXNlc1xuICAvLyBTaW1wbGVzdCBwb3NzaWJsZSBpbXBsZW1lbnRhdGlvbjsgdXNlIGEgM3JkLXBhcnR5IGxpYnJhcnkgaWYgeW91XG4gIC8vIHdhbnQgdGhlIGJlc3QgcG9zc2libGUgc3BlZWQgYW5kL29yIGxvbmcgc3RhY2sgdHJhY2VzLlxuICB2YXIgUHJvbWlzZVNoaW0gPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZXRUaW1lb3V0ID0gZ2xvYmFscy5zZXRUaW1lb3V0O1xuICAgIC8vIHNvbWUgZW52aXJvbm1lbnRzIGRvbid0IGhhdmUgc2V0VGltZW91dCAtIG5vIHdheSB0byBzaGltIGhlcmUuXG4gICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ICE9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBzZXRUaW1lb3V0ICE9PSAnb2JqZWN0JykgeyByZXR1cm47IH1cblxuICAgIEVTLklzUHJvbWlzZSA9IGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICBpZiAoIUVTLlR5cGVJc09iamVjdChwcm9taXNlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHByb21pc2UuX3Byb21pc2UgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTsgLy8gdW5pbml0aWFsaXplZCwgb3IgbWlzc2luZyBvdXIgaGlkZGVuIGZpZWxkLlxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIC8vIFwiUHJvbWlzZUNhcGFiaWxpdHlcIiBpbiB0aGUgc3BlYyBpcyB3aGF0IG1vc3QgcHJvbWlzZSBpbXBsZW1lbnRhdGlvbnNcbiAgICAvLyBjYWxsIGEgXCJkZWZlcnJlZFwiLlxuICAgIHZhciBQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uIChDKSB7XG4gICAgICBpZiAoIUVTLklzQ29uc3RydWN0b3IoQykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQmFkIHByb21pc2UgY29uc3RydWN0b3InKTtcbiAgICAgIH1cbiAgICAgIHZhciBjYXBhYmlsaXR5ID0gdGhpcztcbiAgICAgIHZhciByZXNvbHZlciA9IGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgaWYgKGNhcGFiaWxpdHkucmVzb2x2ZSAhPT0gdm9pZCAwIHx8IGNhcGFiaWxpdHkucmVqZWN0ICE9PSB2b2lkIDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCYWQgUHJvbWlzZSBpbXBsZW1lbnRhdGlvbiEnKTtcbiAgICAgICAgfVxuICAgICAgICBjYXBhYmlsaXR5LnJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgICBjYXBhYmlsaXR5LnJlamVjdCA9IHJlamVjdDtcbiAgICAgIH07XG4gICAgICAvLyBJbml0aWFsaXplIGZpZWxkcyB0byBpbmZvcm0gb3B0aW1pemVycyBhYm91dCB0aGUgb2JqZWN0IHNoYXBlLlxuICAgICAgY2FwYWJpbGl0eS5yZXNvbHZlID0gdm9pZCAwO1xuICAgICAgY2FwYWJpbGl0eS5yZWplY3QgPSB2b2lkIDA7XG4gICAgICBjYXBhYmlsaXR5LnByb21pc2UgPSBuZXcgQyhyZXNvbHZlcik7XG4gICAgICBpZiAoIShFUy5Jc0NhbGxhYmxlKGNhcGFiaWxpdHkucmVzb2x2ZSkgJiYgRVMuSXNDYWxsYWJsZShjYXBhYmlsaXR5LnJlamVjdCkpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JhZCBwcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIGZpbmQgYW4gYXBwcm9wcmlhdGUgc2V0SW1tZWRpYXRlLWFsaWtlXG4gICAgdmFyIG1ha2VaZXJvVGltZW91dDtcbiAgICAvKmdsb2JhbCB3aW5kb3cgKi9cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgRVMuSXNDYWxsYWJsZSh3aW5kb3cucG9zdE1lc3NhZ2UpKSB7XG4gICAgICBtYWtlWmVyb1RpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGZyb20gaHR0cDovL2RiYXJvbi5vcmcvbG9nLzIwMTAwMzA5LWZhc3Rlci10aW1lb3V0c1xuICAgICAgICB2YXIgdGltZW91dHMgPSBbXTtcbiAgICAgICAgdmFyIG1lc3NhZ2VOYW1lID0gJ3plcm8tdGltZW91dC1tZXNzYWdlJztcbiAgICAgICAgdmFyIHNldFplcm9UaW1lb3V0ID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgX3B1c2godGltZW91dHMsIGZuKTtcbiAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UobWVzc2FnZU5hbWUsICcqJyk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBoYW5kbGVNZXNzYWdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gd2luZG93ICYmIGV2ZW50LmRhdGEgPT09IG1lc3NhZ2VOYW1lKSB7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGlmICh0aW1lb3V0cy5sZW5ndGggPT09IDApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICB2YXIgZm4gPSBfc2hpZnQodGltZW91dHMpO1xuICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgaGFuZGxlTWVzc2FnZSwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBzZXRaZXJvVGltZW91dDtcbiAgICAgIH07XG4gICAgfVxuICAgIHZhciBtYWtlUHJvbWlzZUFzYXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBBbiBlZmZpY2llbnQgdGFzay1zY2hlZHVsZXIgYmFzZWQgb24gYSBwcmUtZXhpc3RpbmcgUHJvbWlzZVxuICAgICAgLy8gaW1wbGVtZW50YXRpb24sIHdoaWNoIHdlIGNhbiB1c2UgZXZlbiBpZiB3ZSBvdmVycmlkZSB0aGVcbiAgICAgIC8vIGdsb2JhbCBQcm9taXNlIGJlbG93IChpbiBvcmRlciB0byB3b3JrYXJvdW5kIGJ1Z3MpXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vUmF5bm9zL29ic2Vydi1oYXNoL2lzc3Vlcy8yI2lzc3VlY29tbWVudC0zNTg1NzY3MVxuICAgICAgdmFyIFAgPSBnbG9iYWxzLlByb21pc2U7XG4gICAgICB2YXIgcHIgPSBQICYmIFAucmVzb2x2ZSAmJiBQLnJlc29sdmUoKTtcbiAgICAgIHJldHVybiBwciAmJiBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICByZXR1cm4gcHIudGhlbih0YXNrKTtcbiAgICAgIH07XG4gICAgfTtcbiAgICAvKmdsb2JhbCBwcm9jZXNzICovXG4gICAgLyoganNjczpkaXNhYmxlIGRpc2FsbG93TXVsdGlMaW5lVGVybmFyeSAqL1xuICAgIHZhciBlbnF1ZXVlID0gRVMuSXNDYWxsYWJsZShnbG9iYWxzLnNldEltbWVkaWF0ZSkgP1xuICAgICAgZ2xvYmFscy5zZXRJbW1lZGlhdGUgOlxuICAgICAgdHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnICYmIHByb2Nlc3MubmV4dFRpY2sgPyBwcm9jZXNzLm5leHRUaWNrIDpcbiAgICAgIG1ha2VQcm9taXNlQXNhcCgpIHx8XG4gICAgICAoRVMuSXNDYWxsYWJsZShtYWtlWmVyb1RpbWVvdXQpID8gbWFrZVplcm9UaW1lb3V0KCkgOlxuICAgICAgZnVuY3Rpb24gKHRhc2spIHsgc2V0VGltZW91dCh0YXNrLCAwKTsgfSk7IC8vIGZhbGxiYWNrXG4gICAgLyoganNjczplbmFibGUgZGlzYWxsb3dNdWx0aUxpbmVUZXJuYXJ5ICovXG5cbiAgICAvLyBDb25zdGFudHMgZm9yIFByb21pc2UgaW1wbGVtZW50YXRpb25cbiAgICB2YXIgUFJPTUlTRV9JREVOVElUWSA9IGZ1bmN0aW9uICh4KSB7IHJldHVybiB4OyB9O1xuICAgIHZhciBQUk9NSVNFX1RIUk9XRVIgPSBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9O1xuICAgIHZhciBQUk9NSVNFX1BFTkRJTkcgPSAwO1xuICAgIHZhciBQUk9NSVNFX0ZVTEZJTExFRCA9IDE7XG4gICAgdmFyIFBST01JU0VfUkVKRUNURUQgPSAyO1xuICAgIC8vIFdlIHN0b3JlIGZ1bGZpbGwvcmVqZWN0IGhhbmRsZXJzIGFuZCBjYXBhYmlsaXRpZXMgaW4gYSBzaW5nbGUgYXJyYXkuXG4gICAgdmFyIFBST01JU0VfRlVMRklMTF9PRkZTRVQgPSAwO1xuICAgIHZhciBQUk9NSVNFX1JFSkVDVF9PRkZTRVQgPSAxO1xuICAgIHZhciBQUk9NSVNFX0NBUEFCSUxJVFlfT0ZGU0VUID0gMjtcbiAgICAvLyBUaGlzIGlzIHVzZWQgaW4gYW4gb3B0aW1pemF0aW9uIGZvciBjaGFpbmluZyBwcm9taXNlcyB2aWEgdGhlbi5cbiAgICB2YXIgUFJPTUlTRV9GQUtFX0NBUEFCSUxJVFkgPSB7fTtcblxuICAgIHZhciBlbnF1ZXVlUHJvbWlzZVJlYWN0aW9uSm9iID0gZnVuY3Rpb24gKGhhbmRsZXIsIGNhcGFiaWxpdHksIGFyZ3VtZW50KSB7XG4gICAgICBlbnF1ZXVlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcHJvbWlzZVJlYWN0aW9uSm9iKGhhbmRsZXIsIGNhcGFiaWxpdHksIGFyZ3VtZW50KTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2YXIgcHJvbWlzZVJlYWN0aW9uSm9iID0gZnVuY3Rpb24gKGhhbmRsZXIsIHByb21pc2VDYXBhYmlsaXR5LCBhcmd1bWVudCkge1xuICAgICAgdmFyIGhhbmRsZXJSZXN1bHQsIGY7XG4gICAgICBpZiAocHJvbWlzZUNhcGFiaWxpdHkgPT09IFBST01JU0VfRkFLRV9DQVBBQklMSVRZKSB7XG4gICAgICAgIC8vIEZhc3QgY2FzZSwgd2hlbiB3ZSBkb24ndCBhY3R1YWxseSBuZWVkIHRvIGNoYWluIHRocm91Z2ggdG8gYVxuICAgICAgICAvLyAocmVhbCkgcHJvbWlzZUNhcGFiaWxpdHkuXG4gICAgICAgIHJldHVybiBoYW5kbGVyKGFyZ3VtZW50KTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIGhhbmRsZXJSZXN1bHQgPSBoYW5kbGVyKGFyZ3VtZW50KTtcbiAgICAgICAgZiA9IHByb21pc2VDYXBhYmlsaXR5LnJlc29sdmU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGhhbmRsZXJSZXN1bHQgPSBlO1xuICAgICAgICBmID0gcHJvbWlzZUNhcGFiaWxpdHkucmVqZWN0O1xuICAgICAgfVxuICAgICAgZihoYW5kbGVyUmVzdWx0KTtcbiAgICB9O1xuXG4gICAgdmFyIGZ1bGZpbGxQcm9taXNlID0gZnVuY3Rpb24gKHByb21pc2UsIHZhbHVlKSB7XG4gICAgICB2YXIgX3Byb21pc2UgPSBwcm9taXNlLl9wcm9taXNlO1xuICAgICAgdmFyIGxlbmd0aCA9IF9wcm9taXNlLnJlYWN0aW9uTGVuZ3RoO1xuICAgICAgaWYgKGxlbmd0aCA+IDApIHtcbiAgICAgICAgZW5xdWV1ZVByb21pc2VSZWFjdGlvbkpvYihcbiAgICAgICAgICBfcHJvbWlzZS5mdWxmaWxsUmVhY3Rpb25IYW5kbGVyMCxcbiAgICAgICAgICBfcHJvbWlzZS5yZWFjdGlvbkNhcGFiaWxpdHkwLFxuICAgICAgICAgIHZhbHVlXG4gICAgICAgICk7XG4gICAgICAgIF9wcm9taXNlLmZ1bGZpbGxSZWFjdGlvbkhhbmRsZXIwID0gdm9pZCAwO1xuICAgICAgICBfcHJvbWlzZS5yZWplY3RSZWFjdGlvbnMwID0gdm9pZCAwO1xuICAgICAgICBfcHJvbWlzZS5yZWFjdGlvbkNhcGFiaWxpdHkwID0gdm9pZCAwO1xuICAgICAgICBpZiAobGVuZ3RoID4gMSkge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAxLCBpZHggPSAwOyBpIDwgbGVuZ3RoOyBpKyssIGlkeCArPSAzKSB7XG4gICAgICAgICAgICBlbnF1ZXVlUHJvbWlzZVJlYWN0aW9uSm9iKFxuICAgICAgICAgICAgICBfcHJvbWlzZVtpZHggKyBQUk9NSVNFX0ZVTEZJTExfT0ZGU0VUXSxcbiAgICAgICAgICAgICAgX3Byb21pc2VbaWR4ICsgUFJPTUlTRV9DQVBBQklMSVRZX09GRlNFVF0sXG4gICAgICAgICAgICAgIHZhbHVlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcHJvbWlzZVtpZHggKyBQUk9NSVNFX0ZVTEZJTExfT0ZGU0VUXSA9IHZvaWQgMDtcbiAgICAgICAgICAgIHByb21pc2VbaWR4ICsgUFJPTUlTRV9SRUpFQ1RfT0ZGU0VUXSA9IHZvaWQgMDtcbiAgICAgICAgICAgIHByb21pc2VbaWR4ICsgUFJPTUlTRV9DQVBBQklMSVRZX09GRlNFVF0gPSB2b2lkIDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBfcHJvbWlzZS5yZXN1bHQgPSB2YWx1ZTtcbiAgICAgIF9wcm9taXNlLnN0YXRlID0gUFJPTUlTRV9GVUxGSUxMRUQ7XG4gICAgICBfcHJvbWlzZS5yZWFjdGlvbkxlbmd0aCA9IDA7XG4gICAgfTtcblxuICAgIHZhciByZWplY3RQcm9taXNlID0gZnVuY3Rpb24gKHByb21pc2UsIHJlYXNvbikge1xuICAgICAgdmFyIF9wcm9taXNlID0gcHJvbWlzZS5fcHJvbWlzZTtcbiAgICAgIHZhciBsZW5ndGggPSBfcHJvbWlzZS5yZWFjdGlvbkxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggPiAwKSB7XG4gICAgICAgIGVucXVldWVQcm9taXNlUmVhY3Rpb25Kb2IoXG4gICAgICAgICAgX3Byb21pc2UucmVqZWN0UmVhY3Rpb25IYW5kbGVyMCxcbiAgICAgICAgICBfcHJvbWlzZS5yZWFjdGlvbkNhcGFiaWxpdHkwLFxuICAgICAgICAgIHJlYXNvblxuICAgICAgICApO1xuICAgICAgICBfcHJvbWlzZS5mdWxmaWxsUmVhY3Rpb25IYW5kbGVyMCA9IHZvaWQgMDtcbiAgICAgICAgX3Byb21pc2UucmVqZWN0UmVhY3Rpb25zMCA9IHZvaWQgMDtcbiAgICAgICAgX3Byb21pc2UucmVhY3Rpb25DYXBhYmlsaXR5MCA9IHZvaWQgMDtcbiAgICAgICAgaWYgKGxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMSwgaWR4ID0gMDsgaSA8IGxlbmd0aDsgaSsrLCBpZHggKz0gMykge1xuICAgICAgICAgICAgZW5xdWV1ZVByb21pc2VSZWFjdGlvbkpvYihcbiAgICAgICAgICAgICAgX3Byb21pc2VbaWR4ICsgUFJPTUlTRV9SRUpFQ1RfT0ZGU0VUXSxcbiAgICAgICAgICAgICAgX3Byb21pc2VbaWR4ICsgUFJPTUlTRV9DQVBBQklMSVRZX09GRlNFVF0sXG4gICAgICAgICAgICAgIHJlYXNvblxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHByb21pc2VbaWR4ICsgUFJPTUlTRV9GVUxGSUxMX09GRlNFVF0gPSB2b2lkIDA7XG4gICAgICAgICAgICBwcm9taXNlW2lkeCArIFBST01JU0VfUkVKRUNUX09GRlNFVF0gPSB2b2lkIDA7XG4gICAgICAgICAgICBwcm9taXNlW2lkeCArIFBST01JU0VfQ0FQQUJJTElUWV9PRkZTRVRdID0gdm9pZCAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgX3Byb21pc2UucmVzdWx0ID0gcmVhc29uO1xuICAgICAgX3Byb21pc2Uuc3RhdGUgPSBQUk9NSVNFX1JFSkVDVEVEO1xuICAgICAgX3Byb21pc2UucmVhY3Rpb25MZW5ndGggPSAwO1xuICAgIH07XG5cbiAgICB2YXIgY3JlYXRlUmVzb2x2aW5nRnVuY3Rpb25zID0gZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgIHZhciBhbHJlYWR5UmVzb2x2ZWQgPSBmYWxzZTtcbiAgICAgIHZhciByZXNvbHZlID0gZnVuY3Rpb24gKHJlc29sdXRpb24pIHtcbiAgICAgICAgdmFyIHRoZW47XG4gICAgICAgIGlmIChhbHJlYWR5UmVzb2x2ZWQpIHsgcmV0dXJuOyB9XG4gICAgICAgIGFscmVhZHlSZXNvbHZlZCA9IHRydWU7XG4gICAgICAgIGlmIChyZXNvbHV0aW9uID09PSBwcm9taXNlKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdFByb21pc2UocHJvbWlzZSwgbmV3IFR5cGVFcnJvcignU2VsZiByZXNvbHV0aW9uJykpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghRVMuVHlwZUlzT2JqZWN0KHJlc29sdXRpb24pKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bGZpbGxQcm9taXNlKHByb21pc2UsIHJlc29sdXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhlbiA9IHJlc29sdXRpb24udGhlbjtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHJldHVybiByZWplY3RQcm9taXNlKHByb21pc2UsIGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghRVMuSXNDYWxsYWJsZSh0aGVuKSkge1xuICAgICAgICAgIHJldHVybiBmdWxmaWxsUHJvbWlzZShwcm9taXNlLCByZXNvbHV0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBlbnF1ZXVlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBwcm9taXNlUmVzb2x2ZVRoZW5hYmxlSm9iKHByb21pc2UsIHJlc29sdXRpb24sIHRoZW4pO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICB2YXIgcmVqZWN0ID0gZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICBpZiAoYWxyZWFkeVJlc29sdmVkKSB7IHJldHVybjsgfVxuICAgICAgICBhbHJlYWR5UmVzb2x2ZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gcmVqZWN0UHJvbWlzZShwcm9taXNlLCByZWFzb24pO1xuICAgICAgfTtcbiAgICAgIHJldHVybiB7IHJlc29sdmU6IHJlc29sdmUsIHJlamVjdDogcmVqZWN0IH07XG4gICAgfTtcblxuICAgIHZhciBvcHRpbWl6ZWRUaGVuID0gZnVuY3Rpb24gKHRoZW4sIHRoZW5hYmxlLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIC8vIE9wdGltaXphdGlvbjogc2luY2Ugd2UgZGlzY2FyZCB0aGUgcmVzdWx0LCB3ZSBjYW4gcGFzcyBvdXJcbiAgICAgIC8vIG93biB0aGVuIGltcGxlbWVudGF0aW9uIGEgc3BlY2lhbCBoaW50IHRvIGxldCBpdCBrbm93IGl0XG4gICAgICAvLyBkb2Vzbid0IGhhdmUgdG8gY3JlYXRlIGl0LiAgKFRoZSBQUk9NSVNFX0ZBS0VfQ0FQQUJJTElUWVxuICAgICAgLy8gb2JqZWN0IGlzIGxvY2FsIHRvIHRoaXMgaW1wbGVtZW50YXRpb24gYW5kIHVuZm9yZ2VhYmxlIG91dHNpZGUuKVxuICAgICAgaWYgKHRoZW4gPT09IFByb21pc2UkcHJvdG90eXBlJHRoZW4pIHtcbiAgICAgICAgX2NhbGwodGhlbiwgdGhlbmFibGUsIHJlc29sdmUsIHJlamVjdCwgUFJPTUlTRV9GQUtFX0NBUEFCSUxJVFkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2NhbGwodGhlbiwgdGhlbmFibGUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgcHJvbWlzZVJlc29sdmVUaGVuYWJsZUpvYiA9IGZ1bmN0aW9uIChwcm9taXNlLCB0aGVuYWJsZSwgdGhlbikge1xuICAgICAgdmFyIHJlc29sdmluZ0Z1bmN0aW9ucyA9IGNyZWF0ZVJlc29sdmluZ0Z1bmN0aW9ucyhwcm9taXNlKTtcbiAgICAgIHZhciByZXNvbHZlID0gcmVzb2x2aW5nRnVuY3Rpb25zLnJlc29sdmU7XG4gICAgICB2YXIgcmVqZWN0ID0gcmVzb2x2aW5nRnVuY3Rpb25zLnJlamVjdDtcbiAgICAgIHRyeSB7XG4gICAgICAgIG9wdGltaXplZFRoZW4odGhlbiwgdGhlbmFibGUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIFByb21pc2UkcHJvdG90eXBlLCBQcm9taXNlJHByb3RvdHlwZSR0aGVuO1xuICAgIHZhciBQcm9taXNlID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBQcm9taXNlU2hpbSA9IGZ1bmN0aW9uIFByb21pc2UocmVzb2x2ZXIpIHtcbiAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFByb21pc2VTaGltKSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0NvbnN0cnVjdG9yIFByb21pc2UgcmVxdWlyZXMgXCJuZXdcIicpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzICYmIHRoaXMuX3Byb21pc2UpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCYWQgY29uc3RydWN0aW9uJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2VlIGh0dHBzOi8vYnVncy5lY21hc2NyaXB0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MjQ4MlxuICAgICAgICBpZiAoIUVTLklzQ2FsbGFibGUocmVzb2x2ZXIpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbm90IGEgdmFsaWQgcmVzb2x2ZXInKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJvbWlzZSA9IGVtdWxhdGVFUzZjb25zdHJ1Y3QodGhpcywgUHJvbWlzZVNoaW0sIFByb21pc2UkcHJvdG90eXBlLCB7XG4gICAgICAgICAgX3Byb21pc2U6IHtcbiAgICAgICAgICAgIHJlc3VsdDogdm9pZCAwLFxuICAgICAgICAgICAgc3RhdGU6IFBST01JU0VfUEVORElORyxcbiAgICAgICAgICAgIC8vIFRoZSBmaXJzdCBtZW1iZXIgb2YgdGhlIFwicmVhY3Rpb25zXCIgYXJyYXkgaXMgaW5saW5lZCBoZXJlLFxuICAgICAgICAgICAgLy8gc2luY2UgbW9zdCBwcm9taXNlcyBvbmx5IGhhdmUgb25lIHJlYWN0aW9uLlxuICAgICAgICAgICAgLy8gV2UndmUgYWxzbyBleHBsb2RlZCB0aGUgJ3JlYWN0aW9uJyBvYmplY3QgdG8gaW5saW5lIHRoZVxuICAgICAgICAgICAgLy8gXCJoYW5kbGVyXCIgYW5kIFwiY2FwYWJpbGl0eVwiIGZpZWxkcywgc2luY2UgYm90aCBmdWxmaWxsIGFuZFxuICAgICAgICAgICAgLy8gcmVqZWN0IHJlYWN0aW9ucyBzaGFyZSB0aGUgc2FtZSBjYXBhYmlsaXR5LlxuICAgICAgICAgICAgcmVhY3Rpb25MZW5ndGg6IDAsXG4gICAgICAgICAgICBmdWxmaWxsUmVhY3Rpb25IYW5kbGVyMDogdm9pZCAwLFxuICAgICAgICAgICAgcmVqZWN0UmVhY3Rpb25IYW5kbGVyMDogdm9pZCAwLFxuICAgICAgICAgICAgcmVhY3Rpb25DYXBhYmlsaXR5MDogdm9pZCAwXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIHJlc29sdmluZ0Z1bmN0aW9ucyA9IGNyZWF0ZVJlc29sdmluZ0Z1bmN0aW9ucyhwcm9taXNlKTtcbiAgICAgICAgdmFyIHJlamVjdCA9IHJlc29sdmluZ0Z1bmN0aW9ucy5yZWplY3Q7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmVzb2x2ZXIocmVzb2x2aW5nRnVuY3Rpb25zLnJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIFByb21pc2VTaGltO1xuICAgIH0oKSk7XG4gICAgUHJvbWlzZSRwcm90b3R5cGUgPSBQcm9taXNlLnByb3RvdHlwZTtcblxuICAgIHZhciBfcHJvbWlzZUFsbFJlc29sdmVyID0gZnVuY3Rpb24gKGluZGV4LCB2YWx1ZXMsIGNhcGFiaWxpdHksIHJlbWFpbmluZykge1xuICAgICAgdmFyIGFscmVhZHlDYWxsZWQgPSBmYWxzZTtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoeCkge1xuICAgICAgICBpZiAoYWxyZWFkeUNhbGxlZCkgeyByZXR1cm47IH1cbiAgICAgICAgYWxyZWFkeUNhbGxlZCA9IHRydWU7XG4gICAgICAgIHZhbHVlc1tpbmRleF0gPSB4O1xuICAgICAgICBpZiAoKC0tcmVtYWluaW5nLmNvdW50KSA9PT0gMCkge1xuICAgICAgICAgIHZhciByZXNvbHZlID0gY2FwYWJpbGl0eS5yZXNvbHZlO1xuICAgICAgICAgIHJlc29sdmUodmFsdWVzKTsgLy8gY2FsbCB3LyB0aGlzPT09dW5kZWZpbmVkXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfTtcblxuICAgIHZhciBwZXJmb3JtUHJvbWlzZUFsbCA9IGZ1bmN0aW9uIChpdGVyYXRvclJlY29yZCwgQywgcmVzdWx0Q2FwYWJpbGl0eSkge1xuICAgICAgdmFyIGl0ID0gaXRlcmF0b3JSZWNvcmQuaXRlcmF0b3I7XG4gICAgICB2YXIgdmFsdWVzID0gW107XG4gICAgICB2YXIgcmVtYWluaW5nID0geyBjb3VudDogMSB9O1xuICAgICAgdmFyIG5leHQsIG5leHRWYWx1ZTtcbiAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIG5leHQgPSBFUy5JdGVyYXRvclN0ZXAoaXQpO1xuICAgICAgICAgIGlmIChuZXh0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgaXRlcmF0b3JSZWNvcmQuZG9uZSA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgbmV4dFZhbHVlID0gbmV4dC52YWx1ZTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGl0ZXJhdG9yUmVjb3JkLmRvbmUgPSB0cnVlO1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWVzW2luZGV4XSA9IHZvaWQgMDtcbiAgICAgICAgdmFyIG5leHRQcm9taXNlID0gQy5yZXNvbHZlKG5leHRWYWx1ZSk7XG4gICAgICAgIHZhciByZXNvbHZlRWxlbWVudCA9IF9wcm9taXNlQWxsUmVzb2x2ZXIoXG4gICAgICAgICAgaW5kZXgsIHZhbHVlcywgcmVzdWx0Q2FwYWJpbGl0eSwgcmVtYWluaW5nXG4gICAgICAgICk7XG4gICAgICAgIHJlbWFpbmluZy5jb3VudCArPSAxO1xuICAgICAgICBvcHRpbWl6ZWRUaGVuKG5leHRQcm9taXNlLnRoZW4sIG5leHRQcm9taXNlLCByZXNvbHZlRWxlbWVudCwgcmVzdWx0Q2FwYWJpbGl0eS5yZWplY3QpO1xuICAgICAgICBpbmRleCArPSAxO1xuICAgICAgfVxuICAgICAgaWYgKCgtLXJlbWFpbmluZy5jb3VudCkgPT09IDApIHtcbiAgICAgICAgdmFyIHJlc29sdmUgPSByZXN1bHRDYXBhYmlsaXR5LnJlc29sdmU7XG4gICAgICAgIHJlc29sdmUodmFsdWVzKTsgLy8gY2FsbCB3LyB0aGlzPT09dW5kZWZpbmVkXG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0Q2FwYWJpbGl0eS5wcm9taXNlO1xuICAgIH07XG5cbiAgICB2YXIgcGVyZm9ybVByb21pc2VSYWNlID0gZnVuY3Rpb24gKGl0ZXJhdG9yUmVjb3JkLCBDLCByZXN1bHRDYXBhYmlsaXR5KSB7XG4gICAgICB2YXIgaXQgPSBpdGVyYXRvclJlY29yZC5pdGVyYXRvcjtcbiAgICAgIHZhciBuZXh0LCBuZXh0VmFsdWUsIG5leHRQcm9taXNlO1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBuZXh0ID0gRVMuSXRlcmF0b3JTdGVwKGl0KTtcbiAgICAgICAgICBpZiAobmV4dCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIC8vIE5PVEU6IElmIGl0ZXJhYmxlIGhhcyBubyBpdGVtcywgcmVzdWx0aW5nIHByb21pc2Ugd2lsbCBuZXZlclxuICAgICAgICAgICAgLy8gcmVzb2x2ZTsgc2VlOlxuICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2RvbWVuaWMvcHJvbWlzZXMtdW53cmFwcGluZy9pc3N1ZXMvNzVcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vYnVncy5lY21hc2NyaXB0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MjUxNVxuICAgICAgICAgICAgaXRlcmF0b3JSZWNvcmQuZG9uZSA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgbmV4dFZhbHVlID0gbmV4dC52YWx1ZTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGl0ZXJhdG9yUmVjb3JkLmRvbmUgPSB0cnVlO1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgICAgbmV4dFByb21pc2UgPSBDLnJlc29sdmUobmV4dFZhbHVlKTtcbiAgICAgICAgb3B0aW1pemVkVGhlbihuZXh0UHJvbWlzZS50aGVuLCBuZXh0UHJvbWlzZSwgcmVzdWx0Q2FwYWJpbGl0eS5yZXNvbHZlLCByZXN1bHRDYXBhYmlsaXR5LnJlamVjdCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0Q2FwYWJpbGl0eS5wcm9taXNlO1xuICAgIH07XG5cbiAgICBkZWZpbmVQcm9wZXJ0aWVzKFByb21pc2UsIHtcbiAgICAgIGFsbDogZnVuY3Rpb24gYWxsKGl0ZXJhYmxlKSB7XG4gICAgICAgIHZhciBDID0gdGhpcztcbiAgICAgICAgaWYgKCFFUy5UeXBlSXNPYmplY3QoQykpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9taXNlIGlzIG5vdCBvYmplY3QnKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY2FwYWJpbGl0eSA9IG5ldyBQcm9taXNlQ2FwYWJpbGl0eShDKTtcbiAgICAgICAgdmFyIGl0ZXJhdG9yLCBpdGVyYXRvclJlY29yZDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpdGVyYXRvciA9IEVTLkdldEl0ZXJhdG9yKGl0ZXJhYmxlKTtcbiAgICAgICAgICBpdGVyYXRvclJlY29yZCA9IHsgaXRlcmF0b3I6IGl0ZXJhdG9yLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgIHJldHVybiBwZXJmb3JtUHJvbWlzZUFsbChpdGVyYXRvclJlY29yZCwgQywgY2FwYWJpbGl0eSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICB2YXIgZXhjZXB0aW9uID0gZTtcbiAgICAgICAgICBpZiAoaXRlcmF0b3JSZWNvcmQgJiYgIWl0ZXJhdG9yUmVjb3JkLmRvbmUpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIEVTLkl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIHRydWUpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZWUpIHtcbiAgICAgICAgICAgICAgZXhjZXB0aW9uID0gZWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciByZWplY3QgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICAgICAgICByZWplY3QoZXhjZXB0aW9uKTtcbiAgICAgICAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICByYWNlOiBmdW5jdGlvbiByYWNlKGl0ZXJhYmxlKSB7XG4gICAgICAgIHZhciBDID0gdGhpcztcbiAgICAgICAgaWYgKCFFUy5UeXBlSXNPYmplY3QoQykpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9taXNlIGlzIG5vdCBvYmplY3QnKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY2FwYWJpbGl0eSA9IG5ldyBQcm9taXNlQ2FwYWJpbGl0eShDKTtcbiAgICAgICAgdmFyIGl0ZXJhdG9yLCBpdGVyYXRvclJlY29yZDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpdGVyYXRvciA9IEVTLkdldEl0ZXJhdG9yKGl0ZXJhYmxlKTtcbiAgICAgICAgICBpdGVyYXRvclJlY29yZCA9IHsgaXRlcmF0b3I6IGl0ZXJhdG9yLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgIHJldHVybiBwZXJmb3JtUHJvbWlzZVJhY2UoaXRlcmF0b3JSZWNvcmQsIEMsIGNhcGFiaWxpdHkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgdmFyIGV4Y2VwdGlvbiA9IGU7XG4gICAgICAgICAgaWYgKGl0ZXJhdG9yUmVjb3JkICYmICFpdGVyYXRvclJlY29yZC5kb25lKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBFUy5JdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCB0cnVlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVlKSB7XG4gICAgICAgICAgICAgIGV4Y2VwdGlvbiA9IGVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgcmVqZWN0ID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgICAgICAgcmVqZWN0KGV4Y2VwdGlvbik7XG4gICAgICAgICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgcmVqZWN0OiBmdW5jdGlvbiByZWplY3QocmVhc29uKSB7XG4gICAgICAgIHZhciBDID0gdGhpcztcbiAgICAgICAgaWYgKCFFUy5UeXBlSXNPYmplY3QoQykpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCYWQgcHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3IFByb21pc2VDYXBhYmlsaXR5KEMpO1xuICAgICAgICB2YXIgcmVqZWN0RnVuYyA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgICAgICByZWplY3RGdW5jKHJlYXNvbik7IC8vIGNhbGwgd2l0aCB0aGlzPT09dW5kZWZpbmVkXG4gICAgICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gICAgICB9LFxuXG4gICAgICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKHYpIHtcbiAgICAgICAgLy8gU2VlIGh0dHBzOi8vZXNkaXNjdXNzLm9yZy90b3BpYy9maXhpbmctcHJvbWlzZS1yZXNvbHZlIGZvciBzcGVjXG4gICAgICAgIHZhciBDID0gdGhpcztcbiAgICAgICAgaWYgKCFFUy5UeXBlSXNPYmplY3QoQykpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCYWQgcHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChFUy5Jc1Byb21pc2UodikpIHtcbiAgICAgICAgICB2YXIgY29uc3RydWN0b3IgPSB2LmNvbnN0cnVjdG9yO1xuICAgICAgICAgIGlmIChjb25zdHJ1Y3RvciA9PT0gQykge1xuICAgICAgICAgICAgcmV0dXJuIHY7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3IFByb21pc2VDYXBhYmlsaXR5KEMpO1xuICAgICAgICB2YXIgcmVzb2x2ZUZ1bmMgPSBjYXBhYmlsaXR5LnJlc29sdmU7XG4gICAgICAgIHJlc29sdmVGdW5jKHYpOyAvLyBjYWxsIHdpdGggdGhpcz09PXVuZGVmaW5lZFxuICAgICAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZGVmaW5lUHJvcGVydGllcyhQcm9taXNlJHByb3RvdHlwZSwge1xuICAgICAgJ2NhdGNoJzogZnVuY3Rpb24gKG9uUmVqZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGVkKTtcbiAgICAgIH0sXG5cbiAgICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgICAgICAgdmFyIHByb21pc2UgPSB0aGlzO1xuICAgICAgICBpZiAoIUVTLklzUHJvbWlzZShwcm9taXNlKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdub3QgYSBwcm9taXNlJyk7IH1cbiAgICAgICAgdmFyIEMgPSBFUy5TcGVjaWVzQ29uc3RydWN0b3IocHJvbWlzZSwgUHJvbWlzZSk7XG4gICAgICAgIHZhciByZXN1bHRDYXBhYmlsaXR5O1xuICAgICAgICB2YXIgcmV0dXJuVmFsdWVJc0lnbm9yZWQgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gPT09IFBST01JU0VfRkFLRV9DQVBBQklMSVRZO1xuICAgICAgICBpZiAocmV0dXJuVmFsdWVJc0lnbm9yZWQgJiYgQyA9PT0gUHJvbWlzZSkge1xuICAgICAgICAgIHJlc3VsdENhcGFiaWxpdHkgPSBQUk9NSVNFX0ZBS0VfQ0FQQUJJTElUWTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRDYXBhYmlsaXR5ID0gbmV3IFByb21pc2VDYXBhYmlsaXR5KEMpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFBlcmZvcm1Qcm9taXNlVGhlbihwcm9taXNlLCBvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcmVzdWx0Q2FwYWJpbGl0eSlcbiAgICAgICAgLy8gTm90ZSB0aGF0IHdlJ3ZlIHNwbGl0IHRoZSAncmVhY3Rpb24nIG9iamVjdCBpbnRvIGl0cyB0d29cbiAgICAgICAgLy8gY29tcG9uZW50cywgXCJjYXBhYmlsaXRpZXNcIiBhbmQgXCJoYW5kbGVyXCJcbiAgICAgICAgLy8gXCJjYXBhYmlsaXRpZXNcIiBpcyBhbHdheXMgZXF1YWwgdG8gYHJlc3VsdENhcGFiaWxpdHlgXG4gICAgICAgIHZhciBmdWxmaWxsUmVhY3Rpb25IYW5kbGVyID0gRVMuSXNDYWxsYWJsZShvbkZ1bGZpbGxlZCkgPyBvbkZ1bGZpbGxlZCA6IFBST01JU0VfSURFTlRJVFk7XG4gICAgICAgIHZhciByZWplY3RSZWFjdGlvbkhhbmRsZXIgPSBFUy5Jc0NhbGxhYmxlKG9uUmVqZWN0ZWQpID8gb25SZWplY3RlZCA6IFBST01JU0VfVEhST1dFUjtcbiAgICAgICAgdmFyIF9wcm9taXNlID0gcHJvbWlzZS5fcHJvbWlzZTtcbiAgICAgICAgdmFyIHZhbHVlO1xuICAgICAgICBpZiAoX3Byb21pc2Uuc3RhdGUgPT09IFBST01JU0VfUEVORElORykge1xuICAgICAgICAgIGlmIChfcHJvbWlzZS5yZWFjdGlvbkxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgX3Byb21pc2UuZnVsZmlsbFJlYWN0aW9uSGFuZGxlcjAgPSBmdWxmaWxsUmVhY3Rpb25IYW5kbGVyO1xuICAgICAgICAgICAgX3Byb21pc2UucmVqZWN0UmVhY3Rpb25IYW5kbGVyMCA9IHJlamVjdFJlYWN0aW9uSGFuZGxlcjtcbiAgICAgICAgICAgIF9wcm9taXNlLnJlYWN0aW9uQ2FwYWJpbGl0eTAgPSByZXN1bHRDYXBhYmlsaXR5O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgaWR4ID0gMyAqIChfcHJvbWlzZS5yZWFjdGlvbkxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgX3Byb21pc2VbaWR4ICsgUFJPTUlTRV9GVUxGSUxMX09GRlNFVF0gPSBmdWxmaWxsUmVhY3Rpb25IYW5kbGVyO1xuICAgICAgICAgICAgX3Byb21pc2VbaWR4ICsgUFJPTUlTRV9SRUpFQ1RfT0ZGU0VUXSA9IHJlamVjdFJlYWN0aW9uSGFuZGxlcjtcbiAgICAgICAgICAgIF9wcm9taXNlW2lkeCArIFBST01JU0VfQ0FQQUJJTElUWV9PRkZTRVRdID0gcmVzdWx0Q2FwYWJpbGl0eTtcbiAgICAgICAgICB9XG4gICAgICAgICAgX3Byb21pc2UucmVhY3Rpb25MZW5ndGggKz0gMTtcbiAgICAgICAgfSBlbHNlIGlmIChfcHJvbWlzZS5zdGF0ZSA9PT0gUFJPTUlTRV9GVUxGSUxMRUQpIHtcbiAgICAgICAgICB2YWx1ZSA9IF9wcm9taXNlLnJlc3VsdDtcbiAgICAgICAgICBlbnF1ZXVlUHJvbWlzZVJlYWN0aW9uSm9iKFxuICAgICAgICAgICAgZnVsZmlsbFJlYWN0aW9uSGFuZGxlciwgcmVzdWx0Q2FwYWJpbGl0eSwgdmFsdWVcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKF9wcm9taXNlLnN0YXRlID09PSBQUk9NSVNFX1JFSkVDVEVEKSB7XG4gICAgICAgICAgdmFsdWUgPSBfcHJvbWlzZS5yZXN1bHQ7XG4gICAgICAgICAgZW5xdWV1ZVByb21pc2VSZWFjdGlvbkpvYihcbiAgICAgICAgICAgIHJlamVjdFJlYWN0aW9uSGFuZGxlciwgcmVzdWx0Q2FwYWJpbGl0eSwgdmFsdWVcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3VuZXhwZWN0ZWQgUHJvbWlzZSBzdGF0ZScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRDYXBhYmlsaXR5LnByb21pc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgLy8gVGhpcyBoZWxwcyB0aGUgb3B0aW1pemVyIGJ5IGVuc3VyaW5nIHRoYXQgbWV0aG9kcyB3aGljaCB0YWtlXG4gICAgLy8gY2FwYWJpbGl0aWVzIGFyZW4ndCBwb2x5bW9ycGhpYy5cbiAgICBQUk9NSVNFX0ZBS0VfQ0FQQUJJTElUWSA9IG5ldyBQcm9taXNlQ2FwYWJpbGl0eShQcm9taXNlKTtcbiAgICBQcm9taXNlJHByb3RvdHlwZSR0aGVuID0gUHJvbWlzZSRwcm90b3R5cGUudGhlbjtcblxuICAgIHJldHVybiBQcm9taXNlO1xuICB9KCkpO1xuXG4gIC8vIENocm9tZSdzIG5hdGl2ZSBQcm9taXNlIGhhcyBleHRyYSBtZXRob2RzIHRoYXQgaXQgc2hvdWxkbid0IGhhdmUuIExldCdzIHJlbW92ZSB0aGVtLlxuICBpZiAoZ2xvYmFscy5Qcm9taXNlKSB7XG4gICAgZGVsZXRlIGdsb2JhbHMuUHJvbWlzZS5hY2NlcHQ7XG4gICAgZGVsZXRlIGdsb2JhbHMuUHJvbWlzZS5kZWZlcjtcbiAgICBkZWxldGUgZ2xvYmFscy5Qcm9taXNlLnByb3RvdHlwZS5jaGFpbjtcbiAgfVxuXG4gIGlmICh0eXBlb2YgUHJvbWlzZVNoaW0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBleHBvcnQgdGhlIFByb21pc2UgY29uc3RydWN0b3IuXG4gICAgZGVmaW5lUHJvcGVydGllcyhnbG9iYWxzLCB7IFByb21pc2U6IFByb21pc2VTaGltIH0pO1xuICAgIC8vIEluIENocm9tZSAzMyAoYW5kIHRoZXJlYWJvdXRzKSBQcm9taXNlIGlzIGRlZmluZWQsIGJ1dCB0aGVcbiAgICAvLyBpbXBsZW1lbnRhdGlvbiBpcyBidWdneSBpbiBhIG51bWJlciBvZiB3YXlzLiAgTGV0J3MgY2hlY2sgc3ViY2xhc3NpbmdcbiAgICAvLyBzdXBwb3J0IHRvIHNlZSBpZiB3ZSBoYXZlIGEgYnVnZ3kgaW1wbGVtZW50YXRpb24uXG4gICAgdmFyIHByb21pc2VTdXBwb3J0c1N1YmNsYXNzaW5nID0gc3VwcG9ydHNTdWJjbGFzc2luZyhnbG9iYWxzLlByb21pc2UsIGZ1bmN0aW9uIChTKSB7XG4gICAgICByZXR1cm4gUy5yZXNvbHZlKDQyKS50aGVuKGZ1bmN0aW9uICgpIHt9KSBpbnN0YW5jZW9mIFM7XG4gICAgfSk7XG4gICAgdmFyIHByb21pc2VJZ25vcmVzTm9uRnVuY3Rpb25UaGVuQ2FsbGJhY2tzID0gIXRocm93c0Vycm9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIGdsb2JhbHMuUHJvbWlzZS5yZWplY3QoNDIpLnRoZW4obnVsbCwgNSkudGhlbihudWxsLCBub29wKTtcbiAgICB9KTtcbiAgICB2YXIgcHJvbWlzZVJlcXVpcmVzT2JqZWN0Q29udGV4dCA9IHRocm93c0Vycm9yKGZ1bmN0aW9uICgpIHsgZ2xvYmFscy5Qcm9taXNlLmNhbGwoMywgbm9vcCk7IH0pO1xuICAgIC8vIFByb21pc2UucmVzb2x2ZSgpIHdhcyBlcnJhdGEnZWQgbGF0ZSBpbiB0aGUgRVM2IHByb2Nlc3MuXG4gICAgLy8gU2VlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD0xMTcwNzQyXG4gICAgLy8gICAgICBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDE2MVxuICAgIC8vIEl0IHNlcnZlcyBhcyBhIHByb3h5IGZvciBhIG51bWJlciBvZiBvdGhlciBidWdzIGluIGVhcmx5IFByb21pc2VcbiAgICAvLyBpbXBsZW1lbnRhdGlvbnMuXG4gICAgdmFyIHByb21pc2VSZXNvbHZlQnJva2VuID0gKGZ1bmN0aW9uIChQcm9taXNlKSB7XG4gICAgICB2YXIgcCA9IFByb21pc2UucmVzb2x2ZSg1KTtcbiAgICAgIHAuY29uc3RydWN0b3IgPSB7fTtcbiAgICAgIHZhciBwMiA9IFByb21pc2UucmVzb2x2ZShwKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHAyLnRoZW4obnVsbCwgbm9vcCkudGhlbihudWxsLCBub29wKTsgLy8gYXZvaWQgXCJ1bmNhdWdodCByZWplY3Rpb25cIiB3YXJuaW5ncyBpbiBjb25zb2xlXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiB0cnVlOyAvLyB2OCBuYXRpdmUgUHJvbWlzZXMgYnJlYWsgaGVyZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NTc1MzE0XG4gICAgICB9XG4gICAgICByZXR1cm4gcCA9PT0gcDI7IC8vIFRoaXMgKnNob3VsZCogYmUgZmFsc2UhXG4gICAgfShnbG9iYWxzLlByb21pc2UpKTtcblxuICAgIC8vIENocm9tZSA0NiAocHJvYmFibHkgb2xkZXIgdG9vKSBkb2VzIG5vdCByZXRyaWV2ZSBhIHRoZW5hYmxlJ3MgLnRoZW4gc3luY2hyb25vdXNseVxuICAgIHZhciBnZXRzVGhlblN5bmNocm9ub3VzbHkgPSBzdXBwb3J0c0Rlc2NyaXB0b3JzICYmIChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgdmFyIHRoZW5hYmxlID0gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAndGhlbicsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IGNvdW50ICs9IDE7IH0gfSk7XG4gICAgICBQcm9taXNlLnJlc29sdmUodGhlbmFibGUpO1xuICAgICAgcmV0dXJuIGNvdW50ID09PSAxO1xuICAgIH0oKSk7XG5cbiAgICB2YXIgQmFkUmVzb2x2ZXJQcm9taXNlID0gZnVuY3Rpb24gQmFkUmVzb2x2ZXJQcm9taXNlKGV4ZWN1dG9yKSB7XG4gICAgICB2YXIgcCA9IG5ldyBQcm9taXNlKGV4ZWN1dG9yKTtcbiAgICAgIGV4ZWN1dG9yKDMsIGZ1bmN0aW9uICgpIHt9KTtcbiAgICAgIHRoaXMudGhlbiA9IHAudGhlbjtcbiAgICAgIHRoaXMuY29uc3RydWN0b3IgPSBCYWRSZXNvbHZlclByb21pc2U7XG4gICAgfTtcbiAgICBCYWRSZXNvbHZlclByb21pc2UucHJvdG90eXBlID0gUHJvbWlzZS5wcm90b3R5cGU7XG4gICAgQmFkUmVzb2x2ZXJQcm9taXNlLmFsbCA9IFByb21pc2UuYWxsO1xuICAgIC8vIENocm9tZSBDYW5hcnkgNDkgKHByb2JhYmx5IG9sZGVyIHRvbykgaGFzIHNvbWUgaW1wbGVtZW50YXRpb24gYnVnc1xuICAgIHZhciBoYXNCYWRSZXNvbHZlclByb21pc2UgPSB2YWx1ZU9yRmFsc2VJZlRocm93cyhmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gISFCYWRSZXNvbHZlclByb21pc2UuYWxsKFsxLCAyXSk7XG4gICAgfSk7XG5cbiAgICBpZiAoIXByb21pc2VTdXBwb3J0c1N1YmNsYXNzaW5nIHx8ICFwcm9taXNlSWdub3Jlc05vbkZ1bmN0aW9uVGhlbkNhbGxiYWNrcyB8fFxuICAgICAgICAhcHJvbWlzZVJlcXVpcmVzT2JqZWN0Q29udGV4dCB8fCBwcm9taXNlUmVzb2x2ZUJyb2tlbiB8fFxuICAgICAgICAhZ2V0c1RoZW5TeW5jaHJvbm91c2x5IHx8IGhhc0JhZFJlc29sdmVyUHJvbWlzZSkge1xuICAgICAgLyogZ2xvYmFscyBQcm9taXNlOiB0cnVlICovXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiwgbm8tZ2xvYmFsLWFzc2lnbiAqL1xuICAgICAgLyoganNoaW50IC1XMDIwICovXG4gICAgICBQcm9taXNlID0gUHJvbWlzZVNoaW07XG4gICAgICAvKiBqc2hpbnQgK1cwMjAgKi9cbiAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW5kZWYsIG5vLWdsb2JhbC1hc3NpZ24gKi9cbiAgICAgIC8qIGdsb2JhbHMgUHJvbWlzZTogZmFsc2UgKi9cbiAgICAgIG92ZXJyaWRlTmF0aXZlKGdsb2JhbHMsICdQcm9taXNlJywgUHJvbWlzZVNoaW0pO1xuICAgIH1cbiAgICBpZiAoUHJvbWlzZS5hbGwubGVuZ3RoICE9PSAxKSB7XG4gICAgICB2YXIgb3JpZ0FsbCA9IFByb21pc2UuYWxsO1xuICAgICAgb3ZlcnJpZGVOYXRpdmUoUHJvbWlzZSwgJ2FsbCcsIGZ1bmN0aW9uIGFsbChpdGVyYWJsZSkge1xuICAgICAgICByZXR1cm4gRVMuQ2FsbChvcmlnQWxsLCB0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChQcm9taXNlLnJhY2UubGVuZ3RoICE9PSAxKSB7XG4gICAgICB2YXIgb3JpZ1JhY2UgPSBQcm9taXNlLnJhY2U7XG4gICAgICBvdmVycmlkZU5hdGl2ZShQcm9taXNlLCAncmFjZScsIGZ1bmN0aW9uIHJhY2UoaXRlcmFibGUpIHtcbiAgICAgICAgcmV0dXJuIEVTLkNhbGwob3JpZ1JhY2UsIHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKFByb21pc2UucmVzb2x2ZS5sZW5ndGggIT09IDEpIHtcbiAgICAgIHZhciBvcmlnUmVzb2x2ZSA9IFByb21pc2UucmVzb2x2ZTtcbiAgICAgIG92ZXJyaWRlTmF0aXZlKFByb21pc2UsICdyZXNvbHZlJywgZnVuY3Rpb24gcmVzb2x2ZSh4KSB7XG4gICAgICAgIHJldHVybiBFUy5DYWxsKG9yaWdSZXNvbHZlLCB0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChQcm9taXNlLnJlamVjdC5sZW5ndGggIT09IDEpIHtcbiAgICAgIHZhciBvcmlnUmVqZWN0ID0gUHJvbWlzZS5yZWplY3Q7XG4gICAgICBvdmVycmlkZU5hdGl2ZShQcm9taXNlLCAncmVqZWN0JywgZnVuY3Rpb24gcmVqZWN0KHIpIHtcbiAgICAgICAgcmV0dXJuIEVTLkNhbGwob3JpZ1JlamVjdCwgdGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBlbnN1cmVFbnVtZXJhYmxlKFByb21pc2UsICdhbGwnKTtcbiAgICBlbnN1cmVFbnVtZXJhYmxlKFByb21pc2UsICdyYWNlJyk7XG4gICAgZW5zdXJlRW51bWVyYWJsZShQcm9taXNlLCAncmVzb2x2ZScpO1xuICAgIGVuc3VyZUVudW1lcmFibGUoUHJvbWlzZSwgJ3JlamVjdCcpO1xuICAgIGFkZERlZmF1bHRTcGVjaWVzKFByb21pc2UpO1xuICB9XG5cbiAgLy8gTWFwIGFuZCBTZXQgcmVxdWlyZSBhIHRydWUgRVM1IGVudmlyb25tZW50XG4gIC8vIFRoZWlyIGZhc3QgcGF0aCBhbHNvIHJlcXVpcmVzIHRoYXQgdGhlIGVudmlyb25tZW50IHByZXNlcnZlXG4gIC8vIHByb3BlcnR5IGluc2VydGlvbiBvcmRlciwgd2hpY2ggaXMgbm90IGd1YXJhbnRlZWQgYnkgdGhlIHNwZWMuXG4gIHZhciB0ZXN0T3JkZXIgPSBmdW5jdGlvbiAoYSkge1xuICAgIHZhciBiID0ga2V5cyhfcmVkdWNlKGEsIGZ1bmN0aW9uIChvLCBrKSB7XG4gICAgICBvW2tdID0gdHJ1ZTtcbiAgICAgIHJldHVybiBvO1xuICAgIH0sIHt9KSk7XG4gICAgcmV0dXJuIGEuam9pbignOicpID09PSBiLmpvaW4oJzonKTtcbiAgfTtcbiAgdmFyIHByZXNlcnZlc0luc2VydGlvbk9yZGVyID0gdGVzdE9yZGVyKFsneicsICdhJywgJ2JiJ10pO1xuICAvLyBzb21lIGVuZ2luZXMgKGVnLCBDaHJvbWUpIG9ubHkgcHJlc2VydmUgaW5zZXJ0aW9uIG9yZGVyIGZvciBzdHJpbmcga2V5c1xuICB2YXIgcHJlc2VydmVzTnVtZXJpY0luc2VydGlvbk9yZGVyID0gdGVzdE9yZGVyKFsneicsIDEsICdhJywgJzMnLCAyXSk7XG5cbiAgaWYgKHN1cHBvcnRzRGVzY3JpcHRvcnMpIHtcblxuICAgIHZhciBmYXN0a2V5ID0gZnVuY3Rpb24gZmFzdGtleShrZXksIHNraXBJbnNlcnRpb25PcmRlckNoZWNrKSB7XG4gICAgICBpZiAoIXNraXBJbnNlcnRpb25PcmRlckNoZWNrICYmICFwcmVzZXJ2ZXNJbnNlcnRpb25PcmRlcikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChpc051bGxPclVuZGVmaW5lZChrZXkpKSB7XG4gICAgICAgIHJldHVybiAnXicgKyBFUy5Ub1N0cmluZyhrZXkpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2Yga2V5ID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gJyQnICsga2V5O1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2Yga2V5ID09PSAnbnVtYmVyJykge1xuICAgICAgICAvLyBub3RlIHRoYXQgLTAgd2lsbCBnZXQgY29lcmNlZCB0byBcIjBcIiB3aGVuIHVzZWQgYXMgYSBwcm9wZXJ0eSBrZXlcbiAgICAgICAgaWYgKCFwcmVzZXJ2ZXNOdW1lcmljSW5zZXJ0aW9uT3JkZXIpIHtcbiAgICAgICAgICByZXR1cm4gJ24nICsga2V5O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBrZXkgPT09ICdib29sZWFuJykge1xuICAgICAgICByZXR1cm4gJ2InICsga2V5O1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIHZhciBlbXB0eU9iamVjdCA9IGZ1bmN0aW9uIGVtcHR5T2JqZWN0KCkge1xuICAgICAgLy8gYWNjb21vZGF0ZSBzb21lIG9sZGVyIG5vdC1xdWl0ZS1FUzUgYnJvd3NlcnNcbiAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlID8gT2JqZWN0LmNyZWF0ZShudWxsKSA6IHt9O1xuICAgIH07XG5cbiAgICB2YXIgYWRkSXRlcmFibGVUb01hcCA9IGZ1bmN0aW9uIGFkZEl0ZXJhYmxlVG9NYXAoTWFwQ29uc3RydWN0b3IsIG1hcCwgaXRlcmFibGUpIHtcbiAgICAgIGlmIChpc0FycmF5KGl0ZXJhYmxlKSB8fCBUeXBlLnN0cmluZyhpdGVyYWJsZSkpIHtcbiAgICAgICAgX2ZvckVhY2goaXRlcmFibGUsIGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICAgIGlmICghRVMuVHlwZUlzT2JqZWN0KGVudHJ5KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSXRlcmF0b3IgdmFsdWUgJyArIGVudHJ5ICsgJyBpcyBub3QgYW4gZW50cnkgb2JqZWN0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1hcC5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGl0ZXJhYmxlIGluc3RhbmNlb2YgTWFwQ29uc3RydWN0b3IpIHtcbiAgICAgICAgX2NhbGwoTWFwQ29uc3RydWN0b3IucHJvdG90eXBlLmZvckVhY2gsIGl0ZXJhYmxlLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgIG1hcC5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGl0ZXIsIGFkZGVyO1xuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKGl0ZXJhYmxlKSkge1xuICAgICAgICAgIGFkZGVyID0gbWFwLnNldDtcbiAgICAgICAgICBpZiAoIUVTLklzQ2FsbGFibGUoYWRkZXIpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ2JhZCBtYXAnKTsgfVxuICAgICAgICAgIGl0ZXIgPSBFUy5HZXRJdGVyYXRvcihpdGVyYWJsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBpdGVyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICB2YXIgbmV4dCA9IEVTLkl0ZXJhdG9yU3RlcChpdGVyKTtcbiAgICAgICAgICAgIGlmIChuZXh0ID09PSBmYWxzZSkgeyBicmVhazsgfVxuICAgICAgICAgICAgdmFyIG5leHRJdGVtID0gbmV4dC52YWx1ZTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGlmICghRVMuVHlwZUlzT2JqZWN0KG5leHRJdGVtKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0l0ZXJhdG9yIHZhbHVlICcgKyBuZXh0SXRlbSArICcgaXMgbm90IGFuIGVudHJ5IG9iamVjdCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF9jYWxsKGFkZGVyLCBtYXAsIG5leHRJdGVtWzBdLCBuZXh0SXRlbVsxXSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIEVTLkl0ZXJhdG9yQ2xvc2UoaXRlciwgdHJ1ZSk7XG4gICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgYWRkSXRlcmFibGVUb1NldCA9IGZ1bmN0aW9uIGFkZEl0ZXJhYmxlVG9TZXQoU2V0Q29uc3RydWN0b3IsIHNldCwgaXRlcmFibGUpIHtcbiAgICAgIGlmIChpc0FycmF5KGl0ZXJhYmxlKSB8fCBUeXBlLnN0cmluZyhpdGVyYWJsZSkpIHtcbiAgICAgICAgX2ZvckVhY2goaXRlcmFibGUsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgIHNldC5hZGQodmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoaXRlcmFibGUgaW5zdGFuY2VvZiBTZXRDb25zdHJ1Y3Rvcikge1xuICAgICAgICBfY2FsbChTZXRDb25zdHJ1Y3Rvci5wcm90b3R5cGUuZm9yRWFjaCwgaXRlcmFibGUsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgIHNldC5hZGQodmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBpdGVyLCBhZGRlcjtcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChpdGVyYWJsZSkpIHtcbiAgICAgICAgICBhZGRlciA9IHNldC5hZGQ7XG4gICAgICAgICAgaWYgKCFFUy5Jc0NhbGxhYmxlKGFkZGVyKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdiYWQgc2V0Jyk7IH1cbiAgICAgICAgICBpdGVyID0gRVMuR2V0SXRlcmF0b3IoaXRlcmFibGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgaXRlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgdmFyIG5leHQgPSBFUy5JdGVyYXRvclN0ZXAoaXRlcik7XG4gICAgICAgICAgICBpZiAobmV4dCA9PT0gZmFsc2UpIHsgYnJlYWs7IH1cbiAgICAgICAgICAgIHZhciBuZXh0VmFsdWUgPSBuZXh0LnZhbHVlO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgX2NhbGwoYWRkZXIsIHNldCwgbmV4dFZhbHVlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgRVMuSXRlcmF0b3JDbG9zZShpdGVyLCB0cnVlKTtcbiAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGNvbGxlY3Rpb25TaGltcyA9IHtcbiAgICAgIE1hcDogKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgZW1wdHkgPSB7fTtcblxuICAgICAgICB2YXIgTWFwRW50cnkgPSBmdW5jdGlvbiBNYXBFbnRyeShrZXksIHZhbHVlKSB7XG4gICAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgIHRoaXMubmV4dCA9IG51bGw7XG4gICAgICAgICAgdGhpcy5wcmV2ID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICBNYXBFbnRyeS5wcm90b3R5cGUuaXNSZW1vdmVkID0gZnVuY3Rpb24gaXNSZW1vdmVkKCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmtleSA9PT0gZW1wdHk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGlzTWFwID0gZnVuY3Rpb24gaXNNYXAobWFwKSB7XG4gICAgICAgICAgcmV0dXJuICEhbWFwLl9lczZtYXA7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHJlcXVpcmVNYXBTbG90ID0gZnVuY3Rpb24gcmVxdWlyZU1hcFNsb3QobWFwLCBtZXRob2QpIHtcbiAgICAgICAgICBpZiAoIUVTLlR5cGVJc09iamVjdChtYXApIHx8ICFpc01hcChtYXApKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdNZXRob2QgTWFwLnByb3RvdHlwZS4nICsgbWV0aG9kICsgJyBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHJlY2VpdmVyICcgKyBFUy5Ub1N0cmluZyhtYXApKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIE1hcEl0ZXJhdG9yID0gZnVuY3Rpb24gTWFwSXRlcmF0b3IobWFwLCBraW5kKSB7XG4gICAgICAgICAgcmVxdWlyZU1hcFNsb3QobWFwLCAnW1tNYXBJdGVyYXRvcl1dJyk7XG4gICAgICAgICAgdGhpcy5oZWFkID0gbWFwLl9oZWFkO1xuICAgICAgICAgIHRoaXMuaSA9IHRoaXMuaGVhZDtcbiAgICAgICAgICB0aGlzLmtpbmQgPSBraW5kO1xuICAgICAgICB9O1xuXG4gICAgICAgIE1hcEl0ZXJhdG9yLnByb3RvdHlwZSA9IHtcbiAgICAgICAgICBuZXh0OiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgICAgdmFyIGkgPSB0aGlzLmk7XG4gICAgICAgICAgICB2YXIga2luZCA9IHRoaXMua2luZDtcbiAgICAgICAgICAgIHZhciBoZWFkID0gdGhpcy5oZWFkO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgIHJldHVybiBpdGVyYXRvclJlc3VsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2hpbGUgKGkuaXNSZW1vdmVkKCkgJiYgaSAhPT0gaGVhZCkge1xuICAgICAgICAgICAgICAvLyBiYWNrIHVwIG9mZiBvZiByZW1vdmVkIGVudHJpZXNcbiAgICAgICAgICAgICAgaSA9IGkucHJldjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGFkdmFuY2UgdG8gbmV4dCB1bnJldHVybmVkIGVsZW1lbnQuXG4gICAgICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICAgICAgd2hpbGUgKGkubmV4dCAhPT0gaGVhZCkge1xuICAgICAgICAgICAgICBpID0gaS5uZXh0O1xuICAgICAgICAgICAgICBpZiAoIWkuaXNSZW1vdmVkKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoa2luZCA9PT0gJ2tleScpIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGkua2V5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2luZCA9PT0gJ3ZhbHVlJykge1xuICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gaS52YWx1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gW2kua2V5LCBpLnZhbHVlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5pID0gaTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlcmF0b3JSZXN1bHQocmVzdWx0KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gb25jZSB0aGUgaXRlcmF0b3IgaXMgZG9uZSwgaXQgaXMgZG9uZSBmb3JldmVyLlxuICAgICAgICAgICAgdGhpcy5pID0gdm9pZCAwO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yUmVzdWx0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBhZGRJdGVyYXRvcihNYXBJdGVyYXRvci5wcm90b3R5cGUpO1xuXG4gICAgICAgIHZhciBNYXAkcHJvdG90eXBlO1xuICAgICAgICB2YXIgTWFwU2hpbSA9IGZ1bmN0aW9uIE1hcCgpIHtcbiAgICAgICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTWFwKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ29uc3RydWN0b3IgTWFwIHJlcXVpcmVzIFwibmV3XCInKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMgJiYgdGhpcy5fZXM2bWFwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCYWQgY29uc3RydWN0aW9uJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBtYXAgPSBlbXVsYXRlRVM2Y29uc3RydWN0KHRoaXMsIE1hcCwgTWFwJHByb3RvdHlwZSwge1xuICAgICAgICAgICAgX2VzNm1hcDogdHJ1ZSxcbiAgICAgICAgICAgIF9oZWFkOiBudWxsLFxuICAgICAgICAgICAgX21hcDogT3JpZ01hcCA/IG5ldyBPcmlnTWFwKCkgOiBudWxsLFxuICAgICAgICAgICAgX3NpemU6IDAsXG4gICAgICAgICAgICBfc3RvcmFnZTogZW1wdHlPYmplY3QoKVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdmFyIGhlYWQgPSBuZXcgTWFwRW50cnkobnVsbCwgbnVsbCk7XG4gICAgICAgICAgLy8gY2lyY3VsYXIgZG91Ymx5LWxpbmtlZCBsaXN0LlxuICAgICAgICAgIC8qIGVzbGludCBuby1tdWx0aS1hc3NpZ246IDEgKi9cbiAgICAgICAgICBoZWFkLm5leHQgPSBoZWFkLnByZXYgPSBoZWFkO1xuICAgICAgICAgIG1hcC5faGVhZCA9IGhlYWQ7XG5cbiAgICAgICAgICAvLyBPcHRpb25hbGx5IGluaXRpYWxpemUgbWFwIGZyb20gaXRlcmFibGVcbiAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFkZEl0ZXJhYmxlVG9NYXAoTWFwLCBtYXAsIGFyZ3VtZW50c1swXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBtYXA7XG4gICAgICAgIH07XG4gICAgICAgIE1hcCRwcm90b3R5cGUgPSBNYXBTaGltLnByb3RvdHlwZTtcblxuICAgICAgICBWYWx1ZS5nZXR0ZXIoTWFwJHByb3RvdHlwZSwgJ3NpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9zaXplID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc2l6ZSBtZXRob2QgY2FsbGVkIG9uIGluY29tcGF0aWJsZSBNYXAnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX3NpemU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlZmluZVByb3BlcnRpZXMoTWFwJHByb3RvdHlwZSwge1xuICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KGtleSkge1xuICAgICAgICAgICAgcmVxdWlyZU1hcFNsb3QodGhpcywgJ2dldCcpO1xuICAgICAgICAgICAgdmFyIGVudHJ5O1xuICAgICAgICAgICAgdmFyIGZrZXkgPSBmYXN0a2V5KGtleSwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAoZmtleSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAvLyBmYXN0IE8oMSkgcGF0aFxuICAgICAgICAgICAgICBlbnRyeSA9IHRoaXMuX3N0b3JhZ2VbZmtleV07XG4gICAgICAgICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbnRyeS52YWx1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXApIHtcbiAgICAgICAgICAgICAgLy8gZmFzdCBvYmplY3Qga2V5IHBhdGhcbiAgICAgICAgICAgICAgZW50cnkgPSBvcmlnTWFwR2V0LmNhbGwodGhpcy5fbWFwLCBrZXkpO1xuICAgICAgICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZW50cnkudmFsdWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaGVhZCA9IHRoaXMuX2hlYWQ7XG4gICAgICAgICAgICB2YXIgaSA9IGhlYWQ7XG4gICAgICAgICAgICB3aGlsZSAoKGkgPSBpLm5leHQpICE9PSBoZWFkKSB7XG4gICAgICAgICAgICAgIGlmIChFUy5TYW1lVmFsdWVaZXJvKGkua2V5LCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGkudmFsdWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgaGFzOiBmdW5jdGlvbiBoYXMoa2V5KSB7XG4gICAgICAgICAgICByZXF1aXJlTWFwU2xvdCh0aGlzLCAnaGFzJyk7XG4gICAgICAgICAgICB2YXIgZmtleSA9IGZhc3RrZXkoa2V5LCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChma2V5ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIC8vIGZhc3QgTygxKSBwYXRoXG4gICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgdGhpcy5fc3RvcmFnZVtma2V5XSAhPT0gJ3VuZGVmaW5lZCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fbWFwKSB7XG4gICAgICAgICAgICAgIC8vIGZhc3Qgb2JqZWN0IGtleSBwYXRoXG4gICAgICAgICAgICAgIHJldHVybiBvcmlnTWFwSGFzLmNhbGwodGhpcy5fbWFwLCBrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGhlYWQgPSB0aGlzLl9oZWFkO1xuICAgICAgICAgICAgdmFyIGkgPSBoZWFkO1xuICAgICAgICAgICAgd2hpbGUgKChpID0gaS5uZXh0KSAhPT0gaGVhZCkge1xuICAgICAgICAgICAgICBpZiAoRVMuU2FtZVZhbHVlWmVybyhpLmtleSwga2V5KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHJlcXVpcmVNYXBTbG90KHRoaXMsICdzZXQnKTtcbiAgICAgICAgICAgIHZhciBoZWFkID0gdGhpcy5faGVhZDtcbiAgICAgICAgICAgIHZhciBpID0gaGVhZDtcbiAgICAgICAgICAgIHZhciBlbnRyeTtcbiAgICAgICAgICAgIHZhciBma2V5ID0gZmFzdGtleShrZXksIHRydWUpO1xuICAgICAgICAgICAgaWYgKGZrZXkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgLy8gZmFzdCBPKDEpIHBhdGhcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9zdG9yYWdlW2ZrZXldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2VbZmtleV0udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbnRyeSA9IHRoaXMuX3N0b3JhZ2VbZmtleV0gPSBuZXcgTWFwRW50cnkoa2V5LCB2YWx1ZSk7IC8qIGVzbGludCBuby1tdWx0aS1hc3NpZ246IDEgKi9cbiAgICAgICAgICAgICAgICBpID0gaGVhZC5wcmV2O1xuICAgICAgICAgICAgICAgIC8vIGZhbGwgdGhyb3VnaFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX21hcCkge1xuICAgICAgICAgICAgICAvLyBmYXN0IG9iamVjdCBrZXkgcGF0aFxuICAgICAgICAgICAgICBpZiAob3JpZ01hcEhhcy5jYWxsKHRoaXMuX21hcCwga2V5KSkge1xuICAgICAgICAgICAgICAgIG9yaWdNYXBHZXQuY2FsbCh0aGlzLl9tYXAsIGtleSkudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbnRyeSA9IG5ldyBNYXBFbnRyeShrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICBvcmlnTWFwU2V0LmNhbGwodGhpcy5fbWFwLCBrZXksIGVudHJ5KTtcbiAgICAgICAgICAgICAgICBpID0gaGVhZC5wcmV2O1xuICAgICAgICAgICAgICAgIC8vIGZhbGwgdGhyb3VnaFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aGlsZSAoKGkgPSBpLm5leHQpICE9PSBoZWFkKSB7XG4gICAgICAgICAgICAgIGlmIChFUy5TYW1lVmFsdWVaZXJvKGkua2V5LCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgaS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRyeSA9IGVudHJ5IHx8IG5ldyBNYXBFbnRyeShrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIGlmIChFUy5TYW1lVmFsdWUoLTAsIGtleSkpIHtcbiAgICAgICAgICAgICAgZW50cnkua2V5ID0gKzA7IC8vIGNvZXJjZSAtMCB0byArMCBpbiBlbnRyeVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50cnkubmV4dCA9IHRoaXMuX2hlYWQ7XG4gICAgICAgICAgICBlbnRyeS5wcmV2ID0gdGhpcy5faGVhZC5wcmV2O1xuICAgICAgICAgICAgZW50cnkucHJldi5uZXh0ID0gZW50cnk7XG4gICAgICAgICAgICBlbnRyeS5uZXh0LnByZXYgPSBlbnRyeTtcbiAgICAgICAgICAgIHRoaXMuX3NpemUgKz0gMTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICAnZGVsZXRlJzogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgcmVxdWlyZU1hcFNsb3QodGhpcywgJ2RlbGV0ZScpO1xuICAgICAgICAgICAgdmFyIGhlYWQgPSB0aGlzLl9oZWFkO1xuICAgICAgICAgICAgdmFyIGkgPSBoZWFkO1xuICAgICAgICAgICAgdmFyIGZrZXkgPSBmYXN0a2V5KGtleSwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAoZmtleSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAvLyBmYXN0IE8oMSkgcGF0aFxuICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuX3N0b3JhZ2VbZmtleV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGkgPSB0aGlzLl9zdG9yYWdlW2ZrZXldLnByZXY7XG4gICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9zdG9yYWdlW2ZrZXldO1xuICAgICAgICAgICAgICAvLyBmYWxsIHRocm91Z2hcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fbWFwKSB7XG4gICAgICAgICAgICAgIC8vIGZhc3Qgb2JqZWN0IGtleSBwYXRoXG4gICAgICAgICAgICAgIGlmICghb3JpZ01hcEhhcy5jYWxsKHRoaXMuX21hcCwga2V5KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpID0gb3JpZ01hcEdldC5jYWxsKHRoaXMuX21hcCwga2V5KS5wcmV2O1xuICAgICAgICAgICAgICBvcmlnTWFwRGVsZXRlLmNhbGwodGhpcy5fbWFwLCBrZXkpO1xuICAgICAgICAgICAgICAvLyBmYWxsIHRocm91Z2hcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdoaWxlICgoaSA9IGkubmV4dCkgIT09IGhlYWQpIHtcbiAgICAgICAgICAgICAgaWYgKEVTLlNhbWVWYWx1ZVplcm8oaS5rZXksIGtleSkpIHtcbiAgICAgICAgICAgICAgICBpLmtleSA9IGVtcHR5O1xuICAgICAgICAgICAgICAgIGkudmFsdWUgPSBlbXB0eTtcbiAgICAgICAgICAgICAgICBpLnByZXYubmV4dCA9IGkubmV4dDtcbiAgICAgICAgICAgICAgICBpLm5leHQucHJldiA9IGkucHJldjtcbiAgICAgICAgICAgICAgICB0aGlzLl9zaXplIC09IDE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgICAgICAgIC8qIGVzbGludCBuby1tdWx0aS1hc3NpZ246IDEgKi9cbiAgICAgICAgICAgIHJlcXVpcmVNYXBTbG90KHRoaXMsICdjbGVhcicpO1xuICAgICAgICAgICAgdGhpcy5fbWFwID0gT3JpZ01hcCA/IG5ldyBPcmlnTWFwKCkgOiBudWxsO1xuICAgICAgICAgICAgdGhpcy5fc2l6ZSA9IDA7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlID0gZW1wdHlPYmplY3QoKTtcbiAgICAgICAgICAgIHZhciBoZWFkID0gdGhpcy5faGVhZDtcbiAgICAgICAgICAgIHZhciBpID0gaGVhZDtcbiAgICAgICAgICAgIHZhciBwID0gaS5uZXh0O1xuICAgICAgICAgICAgd2hpbGUgKChpID0gcCkgIT09IGhlYWQpIHtcbiAgICAgICAgICAgICAgaS5rZXkgPSBlbXB0eTtcbiAgICAgICAgICAgICAgaS52YWx1ZSA9IGVtcHR5O1xuICAgICAgICAgICAgICBwID0gaS5uZXh0O1xuICAgICAgICAgICAgICBpLm5leHQgPSBpLnByZXYgPSBoZWFkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGVhZC5uZXh0ID0gaGVhZC5wcmV2ID0gaGVhZDtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAga2V5czogZnVuY3Rpb24ga2V5cygpIHtcbiAgICAgICAgICAgIHJlcXVpcmVNYXBTbG90KHRoaXMsICdrZXlzJyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1hcEl0ZXJhdG9yKHRoaXMsICdrZXknKTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgdmFsdWVzOiBmdW5jdGlvbiB2YWx1ZXMoKSB7XG4gICAgICAgICAgICByZXF1aXJlTWFwU2xvdCh0aGlzLCAndmFsdWVzJyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1hcEl0ZXJhdG9yKHRoaXMsICd2YWx1ZScpO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBlbnRyaWVzOiBmdW5jdGlvbiBlbnRyaWVzKCkge1xuICAgICAgICAgICAgcmVxdWlyZU1hcFNsb3QodGhpcywgJ2VudHJpZXMnKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWFwSXRlcmF0b3IodGhpcywgJ2tleSt2YWx1ZScpO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICByZXF1aXJlTWFwU2xvdCh0aGlzLCAnZm9yRWFjaCcpO1xuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IG51bGw7XG4gICAgICAgICAgICB2YXIgaXQgPSB0aGlzLmVudHJpZXMoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGVudHJ5ID0gaXQubmV4dCgpOyAhZW50cnkuZG9uZTsgZW50cnkgPSBpdC5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgaWYgKGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBfY2FsbChjYWxsYmFjaywgY29udGV4dCwgZW50cnkudmFsdWVbMV0sIGVudHJ5LnZhbHVlWzBdLCB0aGlzKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlbnRyeS52YWx1ZVsxXSwgZW50cnkudmFsdWVbMF0sIHRoaXMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYWRkSXRlcmF0b3IoTWFwJHByb3RvdHlwZSwgTWFwJHByb3RvdHlwZS5lbnRyaWVzKTtcblxuICAgICAgICByZXR1cm4gTWFwU2hpbTtcbiAgICAgIH0oKSksXG5cbiAgICAgIFNldDogKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlzU2V0ID0gZnVuY3Rpb24gaXNTZXQoc2V0KSB7XG4gICAgICAgICAgcmV0dXJuIHNldC5fZXM2c2V0ICYmIHR5cGVvZiBzZXQuX3N0b3JhZ2UgIT09ICd1bmRlZmluZWQnO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgcmVxdWlyZVNldFNsb3QgPSBmdW5jdGlvbiByZXF1aXJlU2V0U2xvdChzZXQsIG1ldGhvZCkge1xuICAgICAgICAgIGlmICghRVMuVHlwZUlzT2JqZWN0KHNldCkgfHwgIWlzU2V0KHNldCkpIHtcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wYXVsbWlsbHIvZXM2LXNoaW0vaXNzdWVzLzE3NlxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignU2V0LnByb3RvdHlwZS4nICsgbWV0aG9kICsgJyBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHJlY2VpdmVyICcgKyBFUy5Ub1N0cmluZyhzZXQpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQ3JlYXRpbmcgYSBNYXAgaXMgZXhwZW5zaXZlLiAgVG8gc3BlZWQgdXAgdGhlIGNvbW1vbiBjYXNlIG9mXG4gICAgICAgIC8vIFNldHMgY29udGFpbmluZyBvbmx5IHN0cmluZyBvciBudW1lcmljIGtleXMsIHdlIHVzZSBhbiBvYmplY3RcbiAgICAgICAgLy8gYXMgYmFja2luZyBzdG9yYWdlIGFuZCBsYXppbHkgY3JlYXRlIGEgZnVsbCBNYXAgb25seSB3aGVuXG4gICAgICAgIC8vIHJlcXVpcmVkLlxuICAgICAgICB2YXIgU2V0JHByb3RvdHlwZTtcbiAgICAgICAgdmFyIFNldFNoaW0gPSBmdW5jdGlvbiBTZXQoKSB7XG4gICAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFNldCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0NvbnN0cnVjdG9yIFNldCByZXF1aXJlcyBcIm5ld1wiJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzICYmIHRoaXMuX2VzNnNldCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQmFkIGNvbnN0cnVjdGlvbicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgc2V0ID0gZW11bGF0ZUVTNmNvbnN0cnVjdCh0aGlzLCBTZXQsIFNldCRwcm90b3R5cGUsIHtcbiAgICAgICAgICAgIF9lczZzZXQ6IHRydWUsXG4gICAgICAgICAgICAnW1tTZXREYXRhXV0nOiBudWxsLFxuICAgICAgICAgICAgX3N0b3JhZ2U6IGVtcHR5T2JqZWN0KClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoIXNldC5fZXM2c2V0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdiYWQgc2V0Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gT3B0aW9uYWxseSBpbml0aWFsaXplIFNldCBmcm9tIGl0ZXJhYmxlXG4gICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhZGRJdGVyYWJsZVRvU2V0KFNldCwgc2V0LCBhcmd1bWVudHNbMF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gc2V0O1xuICAgICAgICB9O1xuICAgICAgICBTZXQkcHJvdG90eXBlID0gU2V0U2hpbS5wcm90b3R5cGU7XG5cbiAgICAgICAgdmFyIGRlY29kZUtleSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICB2YXIgayA9IGtleTtcbiAgICAgICAgICBpZiAoayA9PT0gJ15udWxsJykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfSBlbHNlIGlmIChrID09PSAnXnVuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBmaXJzdCA9IGsuY2hhckF0KDApO1xuICAgICAgICAgICAgaWYgKGZpcnN0ID09PSAnJCcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF9zdHJTbGljZShrLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlyc3QgPT09ICduJykge1xuICAgICAgICAgICAgICByZXR1cm4gK19zdHJTbGljZShrLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlyc3QgPT09ICdiJykge1xuICAgICAgICAgICAgICByZXR1cm4gayA9PT0gJ2J0cnVlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICtrO1xuICAgICAgICB9O1xuICAgICAgICAvLyBTd2l0Y2ggZnJvbSB0aGUgb2JqZWN0IGJhY2tpbmcgc3RvcmFnZSB0byBhIGZ1bGwgTWFwLlxuICAgICAgICB2YXIgZW5zdXJlTWFwID0gZnVuY3Rpb24gZW5zdXJlTWFwKHNldCkge1xuICAgICAgICAgIGlmICghc2V0WydbW1NldERhdGFdXSddKSB7XG4gICAgICAgICAgICB2YXIgbSA9IG5ldyBjb2xsZWN0aW9uU2hpbXMuTWFwKCk7XG4gICAgICAgICAgICBzZXRbJ1tbU2V0RGF0YV1dJ10gPSBtO1xuICAgICAgICAgICAgX2ZvckVhY2goa2V5cyhzZXQuX3N0b3JhZ2UpLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgIHZhciBrID0gZGVjb2RlS2V5KGtleSk7XG4gICAgICAgICAgICAgIG0uc2V0KGssIGspO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzZXRbJ1tbU2V0RGF0YV1dJ10gPSBtO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZXQuX3N0b3JhZ2UgPSBudWxsOyAvLyBmcmVlIG9sZCBiYWNraW5nIHN0b3JhZ2VcbiAgICAgICAgfTtcblxuICAgICAgICBWYWx1ZS5nZXR0ZXIoU2V0U2hpbS5wcm90b3R5cGUsICdzaXplJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJlcXVpcmVTZXRTbG90KHRoaXMsICdzaXplJyk7XG4gICAgICAgICAgaWYgKHRoaXMuX3N0b3JhZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiBrZXlzKHRoaXMuX3N0b3JhZ2UpLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZW5zdXJlTWFwKHRoaXMpO1xuICAgICAgICAgIHJldHVybiB0aGlzWydbW1NldERhdGFdXSddLnNpemU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlZmluZVByb3BlcnRpZXMoU2V0U2hpbS5wcm90b3R5cGUsIHtcbiAgICAgICAgICBoYXM6IGZ1bmN0aW9uIGhhcyhrZXkpIHtcbiAgICAgICAgICAgIHJlcXVpcmVTZXRTbG90KHRoaXMsICdoYXMnKTtcbiAgICAgICAgICAgIHZhciBma2V5O1xuICAgICAgICAgICAgaWYgKHRoaXMuX3N0b3JhZ2UgJiYgKGZrZXkgPSBmYXN0a2V5KGtleSkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIHJldHVybiAhIXRoaXMuX3N0b3JhZ2VbZmtleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnN1cmVNYXAodGhpcyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1snW1tTZXREYXRhXV0nXS5oYXMoa2V5KTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgYWRkOiBmdW5jdGlvbiBhZGQoa2V5KSB7XG4gICAgICAgICAgICByZXF1aXJlU2V0U2xvdCh0aGlzLCAnYWRkJyk7XG4gICAgICAgICAgICB2YXIgZmtleTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdG9yYWdlICYmIChma2V5ID0gZmFzdGtleShrZXkpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICB0aGlzLl9zdG9yYWdlW2ZrZXldID0gdHJ1ZTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnN1cmVNYXAodGhpcyk7XG4gICAgICAgICAgICB0aGlzWydbW1NldERhdGFdXSddLnNldChrZXksIGtleSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHJlcXVpcmVTZXRTbG90KHRoaXMsICdkZWxldGUnKTtcbiAgICAgICAgICAgIHZhciBma2V5O1xuICAgICAgICAgICAgaWYgKHRoaXMuX3N0b3JhZ2UgJiYgKGZrZXkgPSBmYXN0a2V5KGtleSkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIHZhciBoYXNGS2V5ID0gX2hhc093blByb3BlcnR5KHRoaXMuX3N0b3JhZ2UsIGZrZXkpO1xuICAgICAgICAgICAgICByZXR1cm4gKGRlbGV0ZSB0aGlzLl9zdG9yYWdlW2ZrZXldKSAmJiBoYXNGS2V5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW5zdXJlTWFwKHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbJ1tbU2V0RGF0YV1dJ11bJ2RlbGV0ZSddKGtleSk7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgICAgICAgIHJlcXVpcmVTZXRTbG90KHRoaXMsICdjbGVhcicpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX3N0b3JhZ2UpIHtcbiAgICAgICAgICAgICAgdGhpcy5fc3RvcmFnZSA9IGVtcHR5T2JqZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpc1snW1tTZXREYXRhXV0nXSkge1xuICAgICAgICAgICAgICB0aGlzWydbW1NldERhdGFdXSddLmNsZWFyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHZhbHVlczogZnVuY3Rpb24gdmFsdWVzKCkge1xuICAgICAgICAgICAgcmVxdWlyZVNldFNsb3QodGhpcywgJ3ZhbHVlcycpO1xuICAgICAgICAgICAgZW5zdXJlTWFwKHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbJ1tbU2V0RGF0YV1dJ10udmFsdWVzKCk7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIGVudHJpZXM6IGZ1bmN0aW9uIGVudHJpZXMoKSB7XG4gICAgICAgICAgICByZXF1aXJlU2V0U2xvdCh0aGlzLCAnZW50cmllcycpO1xuICAgICAgICAgICAgZW5zdXJlTWFwKHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbJ1tbU2V0RGF0YV1dJ10uZW50cmllcygpO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICByZXF1aXJlU2V0U2xvdCh0aGlzLCAnZm9yRWFjaCcpO1xuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IG51bGw7XG4gICAgICAgICAgICB2YXIgZW50aXJlU2V0ID0gdGhpcztcbiAgICAgICAgICAgIGVuc3VyZU1hcChlbnRpcmVTZXQpO1xuICAgICAgICAgICAgdGhpc1snW1tTZXREYXRhXV0nXS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgIGlmIChjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgX2NhbGwoY2FsbGJhY2ssIGNvbnRleHQsIGtleSwga2V5LCBlbnRpcmVTZXQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGtleSwga2V5LCBlbnRpcmVTZXQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkZWZpbmVQcm9wZXJ0eShTZXRTaGltLnByb3RvdHlwZSwgJ2tleXMnLCBTZXRTaGltLnByb3RvdHlwZS52YWx1ZXMsIHRydWUpO1xuICAgICAgICBhZGRJdGVyYXRvcihTZXRTaGltLnByb3RvdHlwZSwgU2V0U2hpbS5wcm90b3R5cGUudmFsdWVzKTtcblxuICAgICAgICByZXR1cm4gU2V0U2hpbTtcbiAgICAgIH0oKSlcbiAgICB9O1xuXG4gICAgaWYgKGdsb2JhbHMuTWFwIHx8IGdsb2JhbHMuU2V0KSB7XG4gICAgICAvLyBTYWZhcmkgOCwgZm9yIGV4YW1wbGUsIGRvZXNuJ3QgYWNjZXB0IGFuIGl0ZXJhYmxlLlxuICAgICAgdmFyIG1hcEFjY2VwdHNBcmd1bWVudHMgPSB2YWx1ZU9yRmFsc2VJZlRocm93cyhmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgTWFwKFtbMSwgMl1dKS5nZXQoMSkgPT09IDI7IH0pO1xuICAgICAgaWYgKCFtYXBBY2NlcHRzQXJndW1lbnRzKSB7XG4gICAgICAgIGdsb2JhbHMuTWFwID0gZnVuY3Rpb24gTWFwKCkge1xuICAgICAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBNYXApKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDb25zdHJ1Y3RvciBNYXAgcmVxdWlyZXMgXCJuZXdcIicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgbSA9IG5ldyBPcmlnTWFwKCk7XG4gICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhZGRJdGVyYWJsZVRvTWFwKE1hcCwgbSwgYXJndW1lbnRzWzBdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGVsZXRlIG0uY29uc3RydWN0b3I7XG4gICAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKG0sIGdsb2JhbHMuTWFwLnByb3RvdHlwZSk7XG4gICAgICAgICAgcmV0dXJuIG07XG4gICAgICAgIH07XG4gICAgICAgIGdsb2JhbHMuTWFwLnByb3RvdHlwZSA9IGNyZWF0ZShPcmlnTWFwLnByb3RvdHlwZSk7XG4gICAgICAgIGRlZmluZVByb3BlcnR5KGdsb2JhbHMuTWFwLnByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywgZ2xvYmFscy5NYXAsIHRydWUpO1xuICAgICAgICBWYWx1ZS5wcmVzZXJ2ZVRvU3RyaW5nKGdsb2JhbHMuTWFwLCBPcmlnTWFwKTtcbiAgICAgIH1cbiAgICAgIHZhciB0ZXN0TWFwID0gbmV3IE1hcCgpO1xuICAgICAgdmFyIG1hcFVzZXNTYW1lVmFsdWVaZXJvID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gQ2hyb21lIDM4LTQyLCBub2RlIDAuMTEvMC4xMiwgaW9qcyAxLzIgYWxzbyBoYXZlIGEgYnVnIHdoZW4gdGhlIE1hcCBoYXMgYSBzaXplID4gNFxuICAgICAgICB2YXIgbSA9IG5ldyBNYXAoW1sxLCAwXSwgWzIsIDBdLCBbMywgMF0sIFs0LCAwXV0pO1xuICAgICAgICBtLnNldCgtMCwgbSk7XG4gICAgICAgIHJldHVybiBtLmdldCgwKSA9PT0gbSAmJiBtLmdldCgtMCkgPT09IG0gJiYgbS5oYXMoMCkgJiYgbS5oYXMoLTApO1xuICAgICAgfSgpKTtcbiAgICAgIHZhciBtYXBTdXBwb3J0c0NoYWluaW5nID0gdGVzdE1hcC5zZXQoMSwgMikgPT09IHRlc3RNYXA7XG4gICAgICBpZiAoIW1hcFVzZXNTYW1lVmFsdWVaZXJvIHx8ICFtYXBTdXBwb3J0c0NoYWluaW5nKSB7XG4gICAgICAgIG92ZXJyaWRlTmF0aXZlKE1hcC5wcm90b3R5cGUsICdzZXQnLCBmdW5jdGlvbiBzZXQoaywgdikge1xuICAgICAgICAgIF9jYWxsKG9yaWdNYXBTZXQsIHRoaXMsIGsgPT09IDAgPyAwIDogaywgdik7XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKCFtYXBVc2VzU2FtZVZhbHVlWmVybykge1xuICAgICAgICBkZWZpbmVQcm9wZXJ0aWVzKE1hcC5wcm90b3R5cGUsIHtcbiAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldChrKSB7XG4gICAgICAgICAgICByZXR1cm4gX2NhbGwob3JpZ01hcEdldCwgdGhpcywgayA9PT0gMCA/IDAgOiBrKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGhhczogZnVuY3Rpb24gaGFzKGspIHtcbiAgICAgICAgICAgIHJldHVybiBfY2FsbChvcmlnTWFwSGFzLCB0aGlzLCBrID09PSAwID8gMCA6IGspO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgIFZhbHVlLnByZXNlcnZlVG9TdHJpbmcoTWFwLnByb3RvdHlwZS5nZXQsIG9yaWdNYXBHZXQpO1xuICAgICAgICBWYWx1ZS5wcmVzZXJ2ZVRvU3RyaW5nKE1hcC5wcm90b3R5cGUuaGFzLCBvcmlnTWFwSGFzKTtcbiAgICAgIH1cbiAgICAgIHZhciB0ZXN0U2V0ID0gbmV3IFNldCgpO1xuICAgICAgdmFyIHNldFVzZXNTYW1lVmFsdWVaZXJvID0gKGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHNbJ2RlbGV0ZSddKDApO1xuICAgICAgICBzLmFkZCgtMCk7XG4gICAgICAgIHJldHVybiAhcy5oYXMoMCk7XG4gICAgICB9KHRlc3RTZXQpKTtcbiAgICAgIHZhciBzZXRTdXBwb3J0c0NoYWluaW5nID0gdGVzdFNldC5hZGQoMSkgPT09IHRlc3RTZXQ7XG4gICAgICBpZiAoIXNldFVzZXNTYW1lVmFsdWVaZXJvIHx8ICFzZXRTdXBwb3J0c0NoYWluaW5nKSB7XG4gICAgICAgIHZhciBvcmlnU2V0QWRkID0gU2V0LnByb3RvdHlwZS5hZGQ7XG4gICAgICAgIFNldC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gYWRkKHYpIHtcbiAgICAgICAgICBfY2FsbChvcmlnU2V0QWRkLCB0aGlzLCB2ID09PSAwID8gMCA6IHYpO1xuICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgICAgICBWYWx1ZS5wcmVzZXJ2ZVRvU3RyaW5nKFNldC5wcm90b3R5cGUuYWRkLCBvcmlnU2V0QWRkKTtcbiAgICAgIH1cbiAgICAgIGlmICghc2V0VXNlc1NhbWVWYWx1ZVplcm8pIHtcbiAgICAgICAgdmFyIG9yaWdTZXRIYXMgPSBTZXQucHJvdG90eXBlLmhhcztcbiAgICAgICAgU2V0LnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiBoYXModikge1xuICAgICAgICAgIHJldHVybiBfY2FsbChvcmlnU2V0SGFzLCB0aGlzLCB2ID09PSAwID8gMCA6IHYpO1xuICAgICAgICB9O1xuICAgICAgICBWYWx1ZS5wcmVzZXJ2ZVRvU3RyaW5nKFNldC5wcm90b3R5cGUuaGFzLCBvcmlnU2V0SGFzKTtcbiAgICAgICAgdmFyIG9yaWdTZXREZWwgPSBTZXQucHJvdG90eXBlWydkZWxldGUnXTtcbiAgICAgICAgU2V0LnByb3RvdHlwZVsnZGVsZXRlJ10gPSBmdW5jdGlvbiBTZXREZWxldGUodikge1xuICAgICAgICAgIHJldHVybiBfY2FsbChvcmlnU2V0RGVsLCB0aGlzLCB2ID09PSAwID8gMCA6IHYpO1xuICAgICAgICB9O1xuICAgICAgICBWYWx1ZS5wcmVzZXJ2ZVRvU3RyaW5nKFNldC5wcm90b3R5cGVbJ2RlbGV0ZSddLCBvcmlnU2V0RGVsKTtcbiAgICAgIH1cbiAgICAgIHZhciBtYXBTdXBwb3J0c1N1YmNsYXNzaW5nID0gc3VwcG9ydHNTdWJjbGFzc2luZyhnbG9iYWxzLk1hcCwgZnVuY3Rpb24gKE0pIHtcbiAgICAgICAgdmFyIG0gPSBuZXcgTShbXSk7XG4gICAgICAgIC8vIEZpcmVmb3ggMzIgaXMgb2sgd2l0aCB0aGUgaW5zdGFudGlhdGluZyB0aGUgc3ViY2xhc3MgYnV0IHdpbGxcbiAgICAgICAgLy8gdGhyb3cgd2hlbiB0aGUgbWFwIGlzIHVzZWQuXG4gICAgICAgIG0uc2V0KDQyLCA0Mik7XG4gICAgICAgIHJldHVybiBtIGluc3RhbmNlb2YgTTtcbiAgICAgIH0pO1xuICAgICAgLy8gd2l0aG91dCBPYmplY3Quc2V0UHJvdG90eXBlT2YsIHN1YmNsYXNzaW5nIGlzIG5vdCBwb3NzaWJsZVxuICAgICAgdmFyIG1hcEZhaWxzVG9TdXBwb3J0U3ViY2xhc3NpbmcgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgJiYgIW1hcFN1cHBvcnRzU3ViY2xhc3Npbmc7XG4gICAgICB2YXIgbWFwUmVxdWlyZXNOZXcgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiAhKGdsb2JhbHMuTWFwKCkgaW5zdGFuY2VvZiBnbG9iYWxzLk1hcCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICByZXR1cm4gZSBpbnN0YW5jZW9mIFR5cGVFcnJvcjtcbiAgICAgICAgfVxuICAgICAgfSgpKTtcbiAgICAgIGlmIChnbG9iYWxzLk1hcC5sZW5ndGggIT09IDAgfHwgbWFwRmFpbHNUb1N1cHBvcnRTdWJjbGFzc2luZyB8fCAhbWFwUmVxdWlyZXNOZXcpIHtcbiAgICAgICAgZ2xvYmFscy5NYXAgPSBmdW5jdGlvbiBNYXAoKSB7XG4gICAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE1hcCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0NvbnN0cnVjdG9yIE1hcCByZXF1aXJlcyBcIm5ld1wiJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBtID0gbmV3IE9yaWdNYXAoKTtcbiAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFkZEl0ZXJhYmxlVG9NYXAoTWFwLCBtLCBhcmd1bWVudHNbMF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWxldGUgbS5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YobSwgTWFwLnByb3RvdHlwZSk7XG4gICAgICAgICAgcmV0dXJuIG07XG4gICAgICAgIH07XG4gICAgICAgIGdsb2JhbHMuTWFwLnByb3RvdHlwZSA9IE9yaWdNYXAucHJvdG90eXBlO1xuICAgICAgICBkZWZpbmVQcm9wZXJ0eShnbG9iYWxzLk1hcC5wcm90b3R5cGUsICdjb25zdHJ1Y3RvcicsIGdsb2JhbHMuTWFwLCB0cnVlKTtcbiAgICAgICAgVmFsdWUucHJlc2VydmVUb1N0cmluZyhnbG9iYWxzLk1hcCwgT3JpZ01hcCk7XG4gICAgICB9XG4gICAgICB2YXIgc2V0U3VwcG9ydHNTdWJjbGFzc2luZyA9IHN1cHBvcnRzU3ViY2xhc3NpbmcoZ2xvYmFscy5TZXQsIGZ1bmN0aW9uIChTKSB7XG4gICAgICAgIHZhciBzID0gbmV3IFMoW10pO1xuICAgICAgICBzLmFkZCg0MiwgNDIpO1xuICAgICAgICByZXR1cm4gcyBpbnN0YW5jZW9mIFM7XG4gICAgICB9KTtcbiAgICAgIC8vIHdpdGhvdXQgT2JqZWN0LnNldFByb3RvdHlwZU9mLCBzdWJjbGFzc2luZyBpcyBub3QgcG9zc2libGVcbiAgICAgIHZhciBzZXRGYWlsc1RvU3VwcG9ydFN1YmNsYXNzaW5nID0gT2JqZWN0LnNldFByb3RvdHlwZU9mICYmICFzZXRTdXBwb3J0c1N1YmNsYXNzaW5nO1xuICAgICAgdmFyIHNldFJlcXVpcmVzTmV3ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gIShnbG9iYWxzLlNldCgpIGluc3RhbmNlb2YgZ2xvYmFscy5TZXQpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgcmV0dXJuIGUgaW5zdGFuY2VvZiBUeXBlRXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH0oKSk7XG4gICAgICBpZiAoZ2xvYmFscy5TZXQubGVuZ3RoICE9PSAwIHx8IHNldEZhaWxzVG9TdXBwb3J0U3ViY2xhc3NpbmcgfHwgIXNldFJlcXVpcmVzTmV3KSB7XG4gICAgICAgIHZhciBPcmlnU2V0ID0gZ2xvYmFscy5TZXQ7XG4gICAgICAgIGdsb2JhbHMuU2V0ID0gZnVuY3Rpb24gU2V0KCkge1xuICAgICAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTZXQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDb25zdHJ1Y3RvciBTZXQgcmVxdWlyZXMgXCJuZXdcIicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgcyA9IG5ldyBPcmlnU2V0KCk7XG4gICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhZGRJdGVyYWJsZVRvU2V0KFNldCwgcywgYXJndW1lbnRzWzBdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGVsZXRlIHMuY29uc3RydWN0b3I7XG4gICAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHMsIFNldC5wcm90b3R5cGUpO1xuICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9O1xuICAgICAgICBnbG9iYWxzLlNldC5wcm90b3R5cGUgPSBPcmlnU2V0LnByb3RvdHlwZTtcbiAgICAgICAgZGVmaW5lUHJvcGVydHkoZ2xvYmFscy5TZXQucHJvdG90eXBlLCAnY29uc3RydWN0b3InLCBnbG9iYWxzLlNldCwgdHJ1ZSk7XG4gICAgICAgIFZhbHVlLnByZXNlcnZlVG9TdHJpbmcoZ2xvYmFscy5TZXQsIE9yaWdTZXQpO1xuICAgICAgfVxuICAgICAgdmFyIG5ld01hcCA9IG5ldyBnbG9iYWxzLk1hcCgpO1xuICAgICAgdmFyIG1hcEl0ZXJhdGlvblRocm93c1N0b3BJdGVyYXRvciA9ICF2YWx1ZU9yRmFsc2VJZlRocm93cyhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXdNYXAua2V5cygpLm5leHQoKS5kb25lO1xuICAgICAgfSk7XG4gICAgICAvKlxuICAgICAgICAtIEluIEZpcmVmb3ggPCAyMywgTWFwI3NpemUgaXMgYSBmdW5jdGlvbi5cbiAgICAgICAgLSBJbiBhbGwgY3VycmVudCBGaXJlZm94LCBTZXQjZW50cmllcy9rZXlzL3ZhbHVlcyAmIE1hcCNjbGVhciBkbyBub3QgZXhpc3RcbiAgICAgICAgLSBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD04Njk5OTZcbiAgICAgICAgLSBJbiBGaXJlZm94IDI0LCBNYXAgYW5kIFNldCBkbyBub3QgaW1wbGVtZW50IGZvckVhY2hcbiAgICAgICAgLSBJbiBGaXJlZm94IDI1IGF0IGxlYXN0LCBNYXAgYW5kIFNldCBhcmUgY2FsbGFibGUgd2l0aG91dCBcIm5ld1wiXG4gICAgICAqL1xuICAgICAgaWYgKFxuICAgICAgICB0eXBlb2YgZ2xvYmFscy5NYXAucHJvdG90eXBlLmNsZWFyICE9PSAnZnVuY3Rpb24nIHx8XG4gICAgICAgIG5ldyBnbG9iYWxzLlNldCgpLnNpemUgIT09IDAgfHxcbiAgICAgICAgbmV3TWFwLnNpemUgIT09IDAgfHxcbiAgICAgICAgdHlwZW9mIGdsb2JhbHMuTWFwLnByb3RvdHlwZS5rZXlzICE9PSAnZnVuY3Rpb24nIHx8XG4gICAgICAgIHR5cGVvZiBnbG9iYWxzLlNldC5wcm90b3R5cGUua2V5cyAhPT0gJ2Z1bmN0aW9uJyB8fFxuICAgICAgICB0eXBlb2YgZ2xvYmFscy5NYXAucHJvdG90eXBlLmZvckVhY2ggIT09ICdmdW5jdGlvbicgfHxcbiAgICAgICAgdHlwZW9mIGdsb2JhbHMuU2V0LnByb3RvdHlwZS5mb3JFYWNoICE9PSAnZnVuY3Rpb24nIHx8XG4gICAgICAgIGlzQ2FsbGFibGVXaXRob3V0TmV3KGdsb2JhbHMuTWFwKSB8fFxuICAgICAgICBpc0NhbGxhYmxlV2l0aG91dE5ldyhnbG9iYWxzLlNldCkgfHxcbiAgICAgICAgdHlwZW9mIG5ld01hcC5rZXlzKCkubmV4dCAhPT0gJ2Z1bmN0aW9uJyB8fCAvLyBTYWZhcmkgOFxuICAgICAgICBtYXBJdGVyYXRpb25UaHJvd3NTdG9wSXRlcmF0b3IgfHwgLy8gRmlyZWZveCAyNVxuICAgICAgICAhbWFwU3VwcG9ydHNTdWJjbGFzc2luZ1xuICAgICAgKSB7XG4gICAgICAgIGRlZmluZVByb3BlcnRpZXMoZ2xvYmFscywge1xuICAgICAgICAgIE1hcDogY29sbGVjdGlvblNoaW1zLk1hcCxcbiAgICAgICAgICBTZXQ6IGNvbGxlY3Rpb25TaGltcy5TZXRcbiAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChnbG9iYWxzLlNldC5wcm90b3R5cGUua2V5cyAhPT0gZ2xvYmFscy5TZXQucHJvdG90eXBlLnZhbHVlcykge1xuICAgICAgICAvLyBGaXhlZCBpbiBXZWJLaXQgd2l0aCBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTQ0MTkwXG4gICAgICAgIGRlZmluZVByb3BlcnR5KGdsb2JhbHMuU2V0LnByb3RvdHlwZSwgJ2tleXMnLCBnbG9iYWxzLlNldC5wcm90b3R5cGUudmFsdWVzLCB0cnVlKTtcbiAgICAgIH1cblxuICAgICAgLy8gU2hpbSBpbmNvbXBsZXRlIGl0ZXJhdG9yIGltcGxlbWVudGF0aW9ucy5cbiAgICAgIGFkZEl0ZXJhdG9yKE9iamVjdC5nZXRQcm90b3R5cGVPZigobmV3IGdsb2JhbHMuTWFwKCkpLmtleXMoKSkpO1xuICAgICAgYWRkSXRlcmF0b3IoT2JqZWN0LmdldFByb3RvdHlwZU9mKChuZXcgZ2xvYmFscy5TZXQoKSkua2V5cygpKSk7XG5cbiAgICAgIGlmIChmdW5jdGlvbnNIYXZlTmFtZXMgJiYgZ2xvYmFscy5TZXQucHJvdG90eXBlLmhhcy5uYW1lICE9PSAnaGFzJykge1xuICAgICAgICAvLyBNaWNyb3NvZnQgRWRnZSB2MC4xMS4xMDA3NC4wIGlzIG1pc3NpbmcgYSBuYW1lIG9uIFNldCNoYXNcbiAgICAgICAgdmFyIGFub255bW91c1NldEhhcyA9IGdsb2JhbHMuU2V0LnByb3RvdHlwZS5oYXM7XG4gICAgICAgIG92ZXJyaWRlTmF0aXZlKGdsb2JhbHMuU2V0LnByb3RvdHlwZSwgJ2hhcycsIGZ1bmN0aW9uIGhhcyhrZXkpIHtcbiAgICAgICAgICByZXR1cm4gX2NhbGwoYW5vbnltb3VzU2V0SGFzLCB0aGlzLCBrZXkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZGVmaW5lUHJvcGVydGllcyhnbG9iYWxzLCBjb2xsZWN0aW9uU2hpbXMpO1xuICAgIGFkZERlZmF1bHRTcGVjaWVzKGdsb2JhbHMuTWFwKTtcbiAgICBhZGREZWZhdWx0U3BlY2llcyhnbG9iYWxzLlNldCk7XG4gIH1cblxuICB2YXIgdGhyb3dVbmxlc3NUYXJnZXRJc09iamVjdCA9IGZ1bmN0aW9uIHRocm93VW5sZXNzVGFyZ2V0SXNPYmplY3QodGFyZ2V0KSB7XG4gICAgaWYgKCFFUy5UeXBlSXNPYmplY3QodGFyZ2V0KSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGFyZ2V0IG11c3QgYmUgYW4gb2JqZWN0Jyk7XG4gICAgfVxuICB9O1xuXG4gIC8vIFNvbWUgUmVmbGVjdCBtZXRob2RzIGFyZSBiYXNpY2FsbHkgdGhlIHNhbWUgYXNcbiAgLy8gdGhvc2Ugb24gdGhlIE9iamVjdCBnbG9iYWwsIGV4Y2VwdCB0aGF0IGEgVHlwZUVycm9yIGlzIHRocm93biBpZlxuICAvLyB0YXJnZXQgaXNuJ3QgYW4gb2JqZWN0LiBBcyB3ZWxsIGFzIHJldHVybmluZyBhIGJvb2xlYW4gaW5kaWNhdGluZ1xuICAvLyB0aGUgc3VjY2VzcyBvZiB0aGUgb3BlcmF0aW9uLlxuICB2YXIgUmVmbGVjdFNoaW1zID0ge1xuICAgIC8vIEFwcGx5IG1ldGhvZCBpbiBhIGZ1bmN0aW9uYWwgZm9ybS5cbiAgICBhcHBseTogZnVuY3Rpb24gYXBwbHkoKSB7XG4gICAgICByZXR1cm4gRVMuQ2FsbChFUy5DYWxsLCBudWxsLCBhcmd1bWVudHMpO1xuICAgIH0sXG5cbiAgICAvLyBOZXcgb3BlcmF0b3IgaW4gYSBmdW5jdGlvbmFsIGZvcm0uXG4gICAgY29uc3RydWN0OiBmdW5jdGlvbiBjb25zdHJ1Y3QoY29uc3RydWN0b3IsIGFyZ3MpIHtcbiAgICAgIGlmICghRVMuSXNDb25zdHJ1Y3Rvcihjb25zdHJ1Y3RvcikpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIGNvbnN0cnVjdG9yLicpO1xuICAgICAgfVxuICAgICAgdmFyIG5ld1RhcmdldCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyID8gYXJndW1lbnRzWzJdIDogY29uc3RydWN0b3I7XG4gICAgICBpZiAoIUVTLklzQ29uc3RydWN0b3IobmV3VGFyZ2V0KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCduZXcudGFyZ2V0IG11c3QgYmUgYSBjb25zdHJ1Y3Rvci4nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBFUy5Db25zdHJ1Y3QoY29uc3RydWN0b3IsIGFyZ3MsIG5ld1RhcmdldCwgJ2ludGVybmFsJyk7XG4gICAgfSxcblxuICAgIC8vIFdoZW4gZGVsZXRpbmcgYSBub24tZXhpc3RlbnQgb3IgY29uZmlndXJhYmxlIHByb3BlcnR5LFxuICAgIC8vIHRydWUgaXMgcmV0dXJuZWQuXG4gICAgLy8gV2hlbiBhdHRlbXB0aW5nIHRvIGRlbGV0ZSBhIG5vbi1jb25maWd1cmFibGUgcHJvcGVydHksXG4gICAgLy8gaXQgd2lsbCByZXR1cm4gZmFsc2UuXG4gICAgZGVsZXRlUHJvcGVydHk6IGZ1bmN0aW9uIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwga2V5KSB7XG4gICAgICB0aHJvd1VubGVzc1RhcmdldElzT2JqZWN0KHRhcmdldCk7XG4gICAgICBpZiAoc3VwcG9ydHNEZXNjcmlwdG9ycykge1xuICAgICAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuXG4gICAgICAgIGlmIChkZXNjICYmICFkZXNjLmNvbmZpZ3VyYWJsZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBXaWxsIHJldHVybiB0cnVlLlxuICAgICAgcmV0dXJuIGRlbGV0ZSB0YXJnZXRba2V5XTtcbiAgICB9LFxuXG4gICAgaGFzOiBmdW5jdGlvbiBoYXModGFyZ2V0LCBrZXkpIHtcbiAgICAgIHRocm93VW5sZXNzVGFyZ2V0SXNPYmplY3QodGFyZ2V0KTtcbiAgICAgIHJldHVybiBrZXkgaW4gdGFyZ2V0O1xuICAgIH1cbiAgfTtcblxuICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMpIHtcbiAgICBPYmplY3QuYXNzaWduKFJlZmxlY3RTaGltcywge1xuICAgICAgLy8gQmFzaWNhbGx5IHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgaW50ZXJuYWwgW1tPd25Qcm9wZXJ0eUtleXNdXS5cbiAgICAgIC8vIENvbmNhdGVuYXRpbmcgcHJvcGVydHlOYW1lcyBhbmQgcHJvcGVydHlTeW1ib2xzIHNob3VsZCBkbyB0aGUgdHJpY2suXG4gICAgICAvLyBUaGlzIHNob3VsZCBjb250aW51ZSB0byB3b3JrIHRvZ2V0aGVyIHdpdGggYSBTeW1ib2wgc2hpbVxuICAgICAgLy8gd2hpY2ggb3ZlcnJpZGVzIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIGFuZCBpbXBsZW1lbnRzXG4gICAgICAvLyBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzLlxuICAgICAgb3duS2V5czogZnVuY3Rpb24gb3duS2V5cyh0YXJnZXQpIHtcbiAgICAgICAgdGhyb3dVbmxlc3NUYXJnZXRJc09iamVjdCh0YXJnZXQpO1xuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldCk7XG5cbiAgICAgICAgaWYgKEVTLklzQ2FsbGFibGUoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykpIHtcbiAgICAgICAgICBfcHVzaEFwcGx5KGtleXMsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHModGFyZ2V0KSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5cztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHZhciBjYWxsQW5kQ2F0Y2hFeGNlcHRpb24gPSBmdW5jdGlvbiBDb252ZXJ0RXhjZXB0aW9uVG9Cb29sZWFuKGZ1bmMpIHtcbiAgICByZXR1cm4gIXRocm93c0Vycm9yKGZ1bmMpO1xuICB9O1xuXG4gIGlmIChPYmplY3QucHJldmVudEV4dGVuc2lvbnMpIHtcbiAgICBPYmplY3QuYXNzaWduKFJlZmxlY3RTaGltcywge1xuICAgICAgaXNFeHRlbnNpYmxlOiBmdW5jdGlvbiBpc0V4dGVuc2libGUodGFyZ2V0KSB7XG4gICAgICAgIHRocm93VW5sZXNzVGFyZ2V0SXNPYmplY3QodGFyZ2V0KTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5pc0V4dGVuc2libGUodGFyZ2V0KTtcbiAgICAgIH0sXG4gICAgICBwcmV2ZW50RXh0ZW5zaW9uczogZnVuY3Rpb24gcHJldmVudEV4dGVuc2lvbnModGFyZ2V0KSB7XG4gICAgICAgIHRocm93VW5sZXNzVGFyZ2V0SXNPYmplY3QodGFyZ2V0KTtcbiAgICAgICAgcmV0dXJuIGNhbGxBbmRDYXRjaEV4Y2VwdGlvbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKHRhcmdldCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKHN1cHBvcnRzRGVzY3JpcHRvcnMpIHtcbiAgICB2YXIgaW50ZXJuYWxHZXQgPSBmdW5jdGlvbiBnZXQodGFyZ2V0LCBrZXksIHJlY2VpdmVyKSB7XG4gICAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuXG4gICAgICBpZiAoIWRlc2MpIHtcbiAgICAgICAgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpO1xuXG4gICAgICAgIGlmIChwYXJlbnQgPT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGludGVybmFsR2V0KHBhcmVudCwga2V5LCByZWNlaXZlcik7XG4gICAgICB9XG5cbiAgICAgIGlmICgndmFsdWUnIGluIGRlc2MpIHtcbiAgICAgICAgcmV0dXJuIGRlc2MudmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChkZXNjLmdldCkge1xuICAgICAgICByZXR1cm4gRVMuQ2FsbChkZXNjLmdldCwgcmVjZWl2ZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH07XG5cbiAgICB2YXIgaW50ZXJuYWxTZXQgPSBmdW5jdGlvbiBzZXQodGFyZ2V0LCBrZXksIHZhbHVlLCByZWNlaXZlcikge1xuICAgICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcblxuICAgICAgaWYgKCFkZXNjKSB7XG4gICAgICAgIHZhciBwYXJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KTtcblxuICAgICAgICBpZiAocGFyZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGludGVybmFsU2V0KHBhcmVudCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVzYyA9IHtcbiAgICAgICAgICB2YWx1ZTogdm9pZCAwLFxuICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmICgndmFsdWUnIGluIGRlc2MpIHtcbiAgICAgICAgaWYgKCFkZXNjLndyaXRhYmxlKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFFUy5UeXBlSXNPYmplY3QocmVjZWl2ZXIpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGV4aXN0aW5nRGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocmVjZWl2ZXIsIGtleSk7XG5cbiAgICAgICAgaWYgKGV4aXN0aW5nRGVzYykge1xuICAgICAgICAgIHJldHVybiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHJlY2VpdmVyLCBrZXksIHtcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHJlY2VpdmVyLCBrZXksIHtcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgICBfY2FsbChkZXNjLnNldCwgcmVjZWl2ZXIsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgT2JqZWN0LmFzc2lnbihSZWZsZWN0U2hpbXMsIHtcbiAgICAgIGRlZmluZVByb3BlcnR5OiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5LCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHRocm93VW5sZXNzVGFyZ2V0SXNPYmplY3QodGFyZ2V0KTtcbiAgICAgICAgcmV0dXJuIGNhbGxBbmRDYXRjaEV4Y2VwdGlvbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgdGhyb3dVbmxlc3NUYXJnZXRJc09iamVjdCh0YXJnZXQpO1xuICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3BlcnR5S2V5KTtcbiAgICAgIH0sXG5cbiAgICAgIC8vIFN5bnRheCBpbiBhIGZ1bmN0aW9uYWwgZm9ybS5cbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KHRhcmdldCwga2V5KSB7XG4gICAgICAgIHRocm93VW5sZXNzVGFyZ2V0SXNPYmplY3QodGFyZ2V0KTtcbiAgICAgICAgdmFyIHJlY2VpdmVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBhcmd1bWVudHNbMl0gOiB0YXJnZXQ7XG5cbiAgICAgICAgcmV0dXJuIGludGVybmFsR2V0KHRhcmdldCwga2V5LCByZWNlaXZlcik7XG4gICAgICB9LFxuXG4gICAgICBzZXQ6IGZ1bmN0aW9uIHNldCh0YXJnZXQsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgdGhyb3dVbmxlc3NUYXJnZXRJc09iamVjdCh0YXJnZXQpO1xuICAgICAgICB2YXIgcmVjZWl2ZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMyA/IGFyZ3VtZW50c1szXSA6IHRhcmdldDtcblxuICAgICAgICByZXR1cm4gaW50ZXJuYWxTZXQodGFyZ2V0LCBrZXksIHZhbHVlLCByZWNlaXZlcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBpZiAoT2JqZWN0LmdldFByb3RvdHlwZU9mKSB7XG4gICAgdmFyIG9iamVjdERvdEdldFByb3RvdHlwZU9mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICAgIFJlZmxlY3RTaGltcy5nZXRQcm90b3R5cGVPZiA9IGZ1bmN0aW9uIGdldFByb3RvdHlwZU9mKHRhcmdldCkge1xuICAgICAgdGhyb3dVbmxlc3NUYXJnZXRJc09iamVjdCh0YXJnZXQpO1xuICAgICAgcmV0dXJuIG9iamVjdERvdEdldFByb3RvdHlwZU9mKHRhcmdldCk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YgJiYgUmVmbGVjdFNoaW1zLmdldFByb3RvdHlwZU9mKSB7XG4gICAgdmFyIHdpbGxDcmVhdGVDaXJjdWxhclByb3RvdHlwZSA9IGZ1bmN0aW9uIChvYmplY3QsIGxhc3RQcm90bykge1xuICAgICAgdmFyIHByb3RvID0gbGFzdFByb3RvO1xuICAgICAgd2hpbGUgKHByb3RvKSB7XG4gICAgICAgIGlmIChvYmplY3QgPT09IHByb3RvKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdG8gPSBSZWZsZWN0U2hpbXMuZ2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICBPYmplY3QuYXNzaWduKFJlZmxlY3RTaGltcywge1xuICAgICAgLy8gU2V0cyB0aGUgcHJvdG90eXBlIG9mIHRoZSBnaXZlbiBvYmplY3QuXG4gICAgICAvLyBSZXR1cm5zIHRydWUgb24gc3VjY2Vzcywgb3RoZXJ3aXNlIGZhbHNlLlxuICAgICAgc2V0UHJvdG90eXBlT2Y6IGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKG9iamVjdCwgcHJvdG8pIHtcbiAgICAgICAgdGhyb3dVbmxlc3NUYXJnZXRJc09iamVjdChvYmplY3QpO1xuICAgICAgICBpZiAocHJvdG8gIT09IG51bGwgJiYgIUVTLlR5cGVJc09iamVjdChwcm90bykpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdwcm90byBtdXN0IGJlIGFuIG9iamVjdCBvciBudWxsJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGV5IGFscmVhZHkgYXJlIHRoZSBzYW1lLCB3ZSdyZSBkb25lLlxuICAgICAgICBpZiAocHJvdG8gPT09IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2Fubm90IGFsdGVyIHByb3RvdHlwZSBpZiBvYmplY3Qgbm90IGV4dGVuc2libGUuXG4gICAgICAgIGlmIChSZWZsZWN0LmlzRXh0ZW5zaWJsZSAmJiAhUmVmbGVjdC5pc0V4dGVuc2libGUob2JqZWN0KSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEVuc3VyZSB0aGF0IHdlIGRvIG5vdCBjcmVhdGUgYSBjaXJjdWxhciBwcm90b3R5cGUgY2hhaW4uXG4gICAgICAgIGlmICh3aWxsQ3JlYXRlQ2lyY3VsYXJQcm90b3R5cGUob2JqZWN0LCBwcm90bykpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2Yob2JqZWN0LCBwcm90byk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgdmFyIGRlZmluZU9yT3ZlcnJpZGVSZWZsZWN0UHJvcGVydHkgPSBmdW5jdGlvbiAoa2V5LCBzaGltKSB7XG4gICAgaWYgKCFFUy5Jc0NhbGxhYmxlKGdsb2JhbHMuUmVmbGVjdFtrZXldKSkge1xuICAgICAgZGVmaW5lUHJvcGVydHkoZ2xvYmFscy5SZWZsZWN0LCBrZXksIHNoaW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYWNjZXB0c1ByaW1pdGl2ZXMgPSB2YWx1ZU9yRmFsc2VJZlRocm93cyhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdsb2JhbHMuUmVmbGVjdFtrZXldKDEpO1xuICAgICAgICBnbG9iYWxzLlJlZmxlY3Rba2V5XShOYU4pO1xuICAgICAgICBnbG9iYWxzLlJlZmxlY3Rba2V5XSh0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9KTtcbiAgICAgIGlmIChhY2NlcHRzUHJpbWl0aXZlcykge1xuICAgICAgICBvdmVycmlkZU5hdGl2ZShnbG9iYWxzLlJlZmxlY3QsIGtleSwgc2hpbSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBPYmplY3Qua2V5cyhSZWZsZWN0U2hpbXMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIGRlZmluZU9yT3ZlcnJpZGVSZWZsZWN0UHJvcGVydHkoa2V5LCBSZWZsZWN0U2hpbXNba2V5XSk7XG4gIH0pO1xuICB2YXIgb3JpZ2luYWxSZWZsZWN0R2V0UHJvdG8gPSBnbG9iYWxzLlJlZmxlY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIGlmIChmdW5jdGlvbnNIYXZlTmFtZXMgJiYgb3JpZ2luYWxSZWZsZWN0R2V0UHJvdG8gJiYgb3JpZ2luYWxSZWZsZWN0R2V0UHJvdG8ubmFtZSAhPT0gJ2dldFByb3RvdHlwZU9mJykge1xuICAgIG92ZXJyaWRlTmF0aXZlKGdsb2JhbHMuUmVmbGVjdCwgJ2dldFByb3RvdHlwZU9mJywgZnVuY3Rpb24gZ2V0UHJvdG90eXBlT2YodGFyZ2V0KSB7XG4gICAgICByZXR1cm4gX2NhbGwob3JpZ2luYWxSZWZsZWN0R2V0UHJvdG8sIGdsb2JhbHMuUmVmbGVjdCwgdGFyZ2V0KTtcbiAgICB9KTtcbiAgfVxuICBpZiAoZ2xvYmFscy5SZWZsZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgaWYgKHZhbHVlT3JGYWxzZUlmVGhyb3dzKGZ1bmN0aW9uICgpIHtcbiAgICAgIGdsb2JhbHMuUmVmbGVjdC5zZXRQcm90b3R5cGVPZigxLCB7fSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KSkge1xuICAgICAgb3ZlcnJpZGVOYXRpdmUoZ2xvYmFscy5SZWZsZWN0LCAnc2V0UHJvdG90eXBlT2YnLCBSZWZsZWN0U2hpbXMuc2V0UHJvdG90eXBlT2YpO1xuICAgIH1cbiAgfVxuICBpZiAoZ2xvYmFscy5SZWZsZWN0LmRlZmluZVByb3BlcnR5KSB7XG4gICAgaWYgKCF2YWx1ZU9yRmFsc2VJZlRocm93cyhmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYmFzaWMgPSAhZ2xvYmFscy5SZWZsZWN0LmRlZmluZVByb3BlcnR5KDEsICd0ZXN0JywgeyB2YWx1ZTogMSB9KTtcbiAgICAgIC8vIFwiZXh0ZW5zaWJsZVwiIGZhaWxzIG9uIEVkZ2UgMC4xMlxuICAgICAgdmFyIGV4dGVuc2libGUgPSB0eXBlb2YgT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zICE9PSAnZnVuY3Rpb24nIHx8ICFnbG9iYWxzLlJlZmxlY3QuZGVmaW5lUHJvcGVydHkoT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKHt9KSwgJ3Rlc3QnLCB7fSk7XG4gICAgICByZXR1cm4gYmFzaWMgJiYgZXh0ZW5zaWJsZTtcbiAgICB9KSkge1xuICAgICAgb3ZlcnJpZGVOYXRpdmUoZ2xvYmFscy5SZWZsZWN0LCAnZGVmaW5lUHJvcGVydHknLCBSZWZsZWN0U2hpbXMuZGVmaW5lUHJvcGVydHkpO1xuICAgIH1cbiAgfVxuICBpZiAoZ2xvYmFscy5SZWZsZWN0LmNvbnN0cnVjdCkge1xuICAgIGlmICghdmFsdWVPckZhbHNlSWZUaHJvd3MoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIEYgPSBmdW5jdGlvbiBGKCkge307XG4gICAgICByZXR1cm4gZ2xvYmFscy5SZWZsZWN0LmNvbnN0cnVjdChmdW5jdGlvbiAoKSB7fSwgW10sIEYpIGluc3RhbmNlb2YgRjtcbiAgICB9KSkge1xuICAgICAgb3ZlcnJpZGVOYXRpdmUoZ2xvYmFscy5SZWZsZWN0LCAnY29uc3RydWN0JywgUmVmbGVjdFNoaW1zLmNvbnN0cnVjdCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKFN0cmluZyhuZXcgRGF0ZShOYU4pKSAhPT0gJ0ludmFsaWQgRGF0ZScpIHtcbiAgICB2YXIgZGF0ZVRvU3RyaW5nID0gRGF0ZS5wcm90b3R5cGUudG9TdHJpbmc7XG4gICAgdmFyIHNoaW1tZWREYXRlVG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAgIHZhciB2YWx1ZU9mID0gK3RoaXM7XG4gICAgICBpZiAodmFsdWVPZiAhPT0gdmFsdWVPZikge1xuICAgICAgICByZXR1cm4gJ0ludmFsaWQgRGF0ZSc7XG4gICAgICB9XG4gICAgICByZXR1cm4gRVMuQ2FsbChkYXRlVG9TdHJpbmcsIHRoaXMpO1xuICAgIH07XG4gICAgb3ZlcnJpZGVOYXRpdmUoRGF0ZS5wcm90b3R5cGUsICd0b1N0cmluZycsIHNoaW1tZWREYXRlVG9TdHJpbmcpO1xuICB9XG5cbiAgLy8gQW5uZXggQiBIVE1MIG1ldGhvZHNcbiAgLy8gaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLWFkZGl0aW9uYWwtcHJvcGVydGllcy1vZi10aGUtc3RyaW5nLnByb3RvdHlwZS1vYmplY3RcbiAgdmFyIHN0cmluZ0hUTUxzaGltcyA9IHtcbiAgICBhbmNob3I6IGZ1bmN0aW9uIGFuY2hvcihuYW1lKSB7IHJldHVybiBFUy5DcmVhdGVIVE1MKHRoaXMsICdhJywgJ25hbWUnLCBuYW1lKTsgfSxcbiAgICBiaWc6IGZ1bmN0aW9uIGJpZygpIHsgcmV0dXJuIEVTLkNyZWF0ZUhUTUwodGhpcywgJ2JpZycsICcnLCAnJyk7IH0sXG4gICAgYmxpbms6IGZ1bmN0aW9uIGJsaW5rKCkgeyByZXR1cm4gRVMuQ3JlYXRlSFRNTCh0aGlzLCAnYmxpbmsnLCAnJywgJycpOyB9LFxuICAgIGJvbGQ6IGZ1bmN0aW9uIGJvbGQoKSB7IHJldHVybiBFUy5DcmVhdGVIVE1MKHRoaXMsICdiJywgJycsICcnKTsgfSxcbiAgICBmaXhlZDogZnVuY3Rpb24gZml4ZWQoKSB7IHJldHVybiBFUy5DcmVhdGVIVE1MKHRoaXMsICd0dCcsICcnLCAnJyk7IH0sXG4gICAgZm9udGNvbG9yOiBmdW5jdGlvbiBmb250Y29sb3IoY29sb3IpIHsgcmV0dXJuIEVTLkNyZWF0ZUhUTUwodGhpcywgJ2ZvbnQnLCAnY29sb3InLCBjb2xvcik7IH0sXG4gICAgZm9udHNpemU6IGZ1bmN0aW9uIGZvbnRzaXplKHNpemUpIHsgcmV0dXJuIEVTLkNyZWF0ZUhUTUwodGhpcywgJ2ZvbnQnLCAnc2l6ZScsIHNpemUpOyB9LFxuICAgIGl0YWxpY3M6IGZ1bmN0aW9uIGl0YWxpY3MoKSB7IHJldHVybiBFUy5DcmVhdGVIVE1MKHRoaXMsICdpJywgJycsICcnKTsgfSxcbiAgICBsaW5rOiBmdW5jdGlvbiBsaW5rKHVybCkgeyByZXR1cm4gRVMuQ3JlYXRlSFRNTCh0aGlzLCAnYScsICdocmVmJywgdXJsKTsgfSxcbiAgICBzbWFsbDogZnVuY3Rpb24gc21hbGwoKSB7IHJldHVybiBFUy5DcmVhdGVIVE1MKHRoaXMsICdzbWFsbCcsICcnLCAnJyk7IH0sXG4gICAgc3RyaWtlOiBmdW5jdGlvbiBzdHJpa2UoKSB7IHJldHVybiBFUy5DcmVhdGVIVE1MKHRoaXMsICdzdHJpa2UnLCAnJywgJycpOyB9LFxuICAgIHN1YjogZnVuY3Rpb24gc3ViKCkgeyByZXR1cm4gRVMuQ3JlYXRlSFRNTCh0aGlzLCAnc3ViJywgJycsICcnKTsgfSxcbiAgICBzdXA6IGZ1bmN0aW9uIHN1YigpIHsgcmV0dXJuIEVTLkNyZWF0ZUhUTUwodGhpcywgJ3N1cCcsICcnLCAnJyk7IH1cbiAgfTtcbiAgX2ZvckVhY2goT2JqZWN0LmtleXMoc3RyaW5nSFRNTHNoaW1zKSwgZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBtZXRob2QgPSBTdHJpbmcucHJvdG90eXBlW2tleV07XG4gICAgdmFyIHNob3VsZE92ZXJ3cml0ZSA9IGZhbHNlO1xuICAgIGlmIChFUy5Jc0NhbGxhYmxlKG1ldGhvZCkpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBfY2FsbChtZXRob2QsICcnLCAnIFwiICcpO1xuICAgICAgdmFyIHF1b3Rlc0NvdW50ID0gX2NvbmNhdChbXSwgb3V0cHV0Lm1hdGNoKC9cIi9nKSkubGVuZ3RoO1xuICAgICAgc2hvdWxkT3ZlcndyaXRlID0gb3V0cHV0ICE9PSBvdXRwdXQudG9Mb3dlckNhc2UoKSB8fCBxdW90ZXNDb3VudCA+IDI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNob3VsZE92ZXJ3cml0ZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChzaG91bGRPdmVyd3JpdGUpIHtcbiAgICAgIG92ZXJyaWRlTmF0aXZlKFN0cmluZy5wcm90b3R5cGUsIGtleSwgc3RyaW5nSFRNTHNoaW1zW2tleV0pO1xuICAgIH1cbiAgfSk7XG5cbiAgdmFyIEpTT05zdHJpbmdpZmllc1N5bWJvbHMgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8vIE1pY3Jvc29mdCBFZGdlIHYwLjEyIHN0cmluZ2lmaWVzIFN5bWJvbHMgaW5jb3JyZWN0bHlcbiAgICBpZiAoIWhhc1N5bWJvbHMpIHsgcmV0dXJuIGZhbHNlOyB9IC8vIFN5bWJvbHMgYXJlIG5vdCBzdXBwb3J0ZWRcbiAgICB2YXIgc3RyaW5naWZ5ID0gdHlwZW9mIEpTT04gPT09ICdvYmplY3QnICYmIHR5cGVvZiBKU09OLnN0cmluZ2lmeSA9PT0gJ2Z1bmN0aW9uJyA/IEpTT04uc3RyaW5naWZ5IDogbnVsbDtcbiAgICBpZiAoIXN0cmluZ2lmeSkgeyByZXR1cm4gZmFsc2U7IH0gLy8gSlNPTi5zdHJpbmdpZnkgaXMgbm90IHN1cHBvcnRlZFxuICAgIGlmICh0eXBlb2Ygc3RyaW5naWZ5KFN5bWJvbCgpKSAhPT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuIHRydWU7IH0gLy8gU3ltYm9scyBzaG91bGQgYmVjb21lIGB1bmRlZmluZWRgXG4gICAgaWYgKHN0cmluZ2lmeShbU3ltYm9sKCldKSAhPT0gJ1tudWxsXScpIHsgcmV0dXJuIHRydWU7IH0gLy8gU3ltYm9scyBpbiBhcnJheXMgc2hvdWxkIGJlY29tZSBgbnVsbGBcbiAgICB2YXIgb2JqID0geyBhOiBTeW1ib2woKSB9O1xuICAgIG9ialtTeW1ib2woKV0gPSB0cnVlO1xuICAgIGlmIChzdHJpbmdpZnkob2JqKSAhPT0gJ3t9JykgeyByZXR1cm4gdHJ1ZTsgfSAvLyBTeW1ib2wtdmFsdWVkIGtleXMgKmFuZCogU3ltYm9sLXZhbHVlZCBwcm9wZXJ0aWVzIHNob3VsZCBiZSBvbWl0dGVkXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KCkpO1xuICB2YXIgSlNPTnN0cmluZ2lmeUFjY2VwdHNPYmplY3RTeW1ib2wgPSB2YWx1ZU9yRmFsc2VJZlRocm93cyhmdW5jdGlvbiAoKSB7XG4gICAgLy8gQ2hyb21lIDQ1IHRocm93cyBvbiBzdHJpbmdpZnlpbmcgb2JqZWN0IHN5bWJvbHNcbiAgICBpZiAoIWhhc1N5bWJvbHMpIHsgcmV0dXJuIHRydWU7IH0gLy8gU3ltYm9scyBhcmUgbm90IHN1cHBvcnRlZFxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShPYmplY3QoU3ltYm9sKCkpKSA9PT0gJ3t9JyAmJiBKU09OLnN0cmluZ2lmeShbT2JqZWN0KFN5bWJvbCgpKV0pID09PSAnW3t9XSc7XG4gIH0pO1xuICBpZiAoSlNPTnN0cmluZ2lmaWVzU3ltYm9scyB8fCAhSlNPTnN0cmluZ2lmeUFjY2VwdHNPYmplY3RTeW1ib2wpIHtcbiAgICB2YXIgb3JpZ1N0cmluZ2lmeSA9IEpTT04uc3RyaW5naWZ5O1xuICAgIG92ZXJyaWRlTmF0aXZlKEpTT04sICdzdHJpbmdpZnknLCBmdW5jdGlvbiBzdHJpbmdpZnkodmFsdWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnKSB7IHJldHVybjsgfVxuICAgICAgdmFyIHJlcGxhY2VyO1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHJlcGxhY2VyID0gYXJndW1lbnRzWzFdO1xuICAgICAgfVxuICAgICAgdmFyIGFyZ3MgPSBbdmFsdWVdO1xuICAgICAgaWYgKCFpc0FycmF5KHJlcGxhY2VyKSkge1xuICAgICAgICB2YXIgcmVwbGFjZUZuID0gRVMuSXNDYWxsYWJsZShyZXBsYWNlcikgPyByZXBsYWNlciA6IG51bGw7XG4gICAgICAgIHZhciB3cmFwcGVkUmVwbGFjZXIgPSBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgICAgICAgICB2YXIgcGFyc2VkVmFsdWUgPSByZXBsYWNlRm4gPyBfY2FsbChyZXBsYWNlRm4sIHRoaXMsIGtleSwgdmFsKSA6IHZhbDtcbiAgICAgICAgICBpZiAodHlwZW9mIHBhcnNlZFZhbHVlICE9PSAnc3ltYm9sJykge1xuICAgICAgICAgICAgaWYgKFR5cGUuc3ltYm9sKHBhcnNlZFZhbHVlKSkge1xuICAgICAgICAgICAgICByZXR1cm4gYXNzaWduVG8oe30pKHBhcnNlZFZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBwYXJzZWRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGFyZ3MucHVzaCh3cmFwcGVkUmVwbGFjZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gY3JlYXRlIHdyYXBwZWQgcmVwbGFjZXIgdGhhdCBoYW5kbGVzIGFuIGFycmF5IHJlcGxhY2VyP1xuICAgICAgICBhcmdzLnB1c2gocmVwbGFjZXIpO1xuICAgICAgfVxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG4gICAgICAgIGFyZ3MucHVzaChhcmd1bWVudHNbMl0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9yaWdTdHJpbmdpZnkuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZ2xvYmFscztcbn0pKTtcbiIsIi8qIVxuICogaHR0cHM6Ly9naXRodWIuY29tL3BhdWxtaWxsci9lczYtc2hpbVxuICogQGxpY2Vuc2UgZXM2LXNoaW0gQ29weXJpZ2h0IDIwMTMtMjAxNiBieSBQYXVsIE1pbGxlciAoaHR0cDovL3BhdWxtaWxsci5jb20pXG4gKiAgIGFuZCBjb250cmlidXRvcnMsICBNSVQgTGljZW5zZVxuICogZXM2LXNoYW06IHYwLjM1LjFcbiAqIHNlZSBodHRwczovL2dpdGh1Yi5jb20vcGF1bG1pbGxyL2VzNi1zaGltL2Jsb2IvMC4zNS4xL0xJQ0VOU0VcbiAqIERldGFpbHMgYW5kIGRvY3VtZW50YXRpb246XG4gKiBodHRwczovL2dpdGh1Yi5jb20vcGF1bG1pbGxyL2VzNi1zaGltL1xuICovXG5cbi8vIFVNRCAoVW5pdmVyc2FsIE1vZHVsZSBEZWZpbml0aW9uKVxuLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91bWRqcy91bWQvYmxvYi9tYXN0ZXIvcmV0dXJuRXhwb3J0cy5qc1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gIC8qZ2xvYmFsIGRlZmluZSwgZXhwb3J0cywgbW9kdWxlICovXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMsIGJ1dFxuICAgIC8vIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxuICAgIC8vIGxpa2UgTm9kZS5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBCcm93c2VyIGdsb2JhbHMgKHJvb3QgaXMgd2luZG93KVxuICAgIHJvb3QucmV0dXJuRXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKmpzaGludCBldmlsOiB0cnVlICovXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLW5ldy1mdW5jICovXG4gIHZhciBnZXRHbG9iYWwgPSBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzOycpO1xuICAvKiBlc2xpbnQtZW5hYmxlIG5vLW5ldy1mdW5jICovXG4gIC8qanNoaW50IGV2aWw6IGZhbHNlICovXG5cbiAgdmFyIGdsb2JhbHMgPSBnZXRHbG9iYWwoKTtcbiAgdmFyIE9iamVjdCA9IGdsb2JhbHMuT2JqZWN0O1xuICB2YXIgX2NhbGwgPSBGdW5jdGlvbi5jYWxsLmJpbmQoRnVuY3Rpb24uY2FsbCk7XG4gIHZhciBmdW5jdGlvblRvU3RyaW5nID0gRnVuY3Rpb24udG9TdHJpbmc7XG4gIHZhciBfc3RyTWF0Y2ggPSBTdHJpbmcucHJvdG90eXBlLm1hdGNoO1xuXG4gIHZhciB0aHJvd3NFcnJvciA9IGZ1bmN0aW9uIChmdW5jKSB7XG4gICAgdHJ5IHtcbiAgICAgIGZ1bmMoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH07XG4gIHZhciBhcmVQcm9wZXJ0eURlc2NyaXB0b3JzU3VwcG9ydGVkID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIGlmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBleGlzdHMgYnV0IHRocm93cywgaXQncyBJRSA4XG4gICAgcmV0dXJuICF0aHJvd3NFcnJvcihmdW5jdGlvbiAoKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICd4JywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgfSB9KTtcbiAgICB9KTtcbiAgfTtcbiAgdmFyIHN1cHBvcnRzRGVzY3JpcHRvcnMgPSAhIU9iamVjdC5kZWZpbmVQcm9wZXJ0eSAmJiBhcmVQcm9wZXJ0eURlc2NyaXB0b3JzU3VwcG9ydGVkKCk7XG5cbiAgLy8gTk9URTogIFRoaXMgdmVyc2lvbnMgbmVlZHMgb2JqZWN0IG93bmVyc2hpcFxuICAvLyAgICAgICAgYmVjYXVzZSBldmVyeSBwcm9tb3RlZCBvYmplY3QgbmVlZHMgdG8gYmUgcmVhc3NpZ25lZFxuICAvLyAgICAgICAgb3RoZXJ3aXNlIHVuY29tcGF0aWJsZSBicm93c2VycyBjYW5ub3Qgd29yayBhcyBleHBlY3RlZFxuICAvL1xuICAvLyBOT1RFOiAgVGhpcyBtaWdodCBuZWVkIGVzNS1zaGltIG9yIHBvbHlmaWxscyB1cGZyb250XG4gIC8vICAgICAgICBiZWNhdXNlIGl0J3MgYmFzZWQgb24gRVM1IEFQSS5cbiAgLy8gICAgICAgIChwcm9iYWJseSBqdXN0IGFuIElFIDw9IDggcHJvYmxlbSlcbiAgLy9cbiAgLy8gTk9URTogIG5vZGVqcyBpcyBmaW5lIGluIHZlcnNpb24gMC44LCAwLjEwLCBhbmQgZnV0dXJlIHZlcnNpb25zLlxuICAoZnVuY3Rpb24gKCkge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHsgcmV0dXJuOyB9XG5cbiAgICAvKmpzaGludCBwcm90bzogdHJ1ZSAqL1xuICAgIC8vIEBhdXRob3IgICAgQW5kcmVhIEdpYW1tYXJjaGkgLSBAV2ViUmVmbGVjdGlvblxuXG4gICAgdmFyIGdldE93blByb3BlcnR5TmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgICB2YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgICB2YXIgY3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcbiAgICB2YXIgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG4gICAgdmFyIGdldFByb3RvdHlwZU9mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICAgIHZhciBvYmpQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbiAgICB2YXIgY29weURlc2NyaXB0b3JzID0gZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG4gICAgICAvLyBkZWZpbmUgaW50byB0YXJnZXQgZGVzY3JpcHRvcnMgZnJvbSBzb3VyY2VcbiAgICAgIGdldE93blByb3BlcnR5TmFtZXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgZGVmaW5lUHJvcGVydHkoXG4gICAgICAgICAgdGFyZ2V0LFxuICAgICAgICAgIGtleSxcbiAgICAgICAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBrZXkpXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfTtcbiAgICAvLyB1c2VkIGFzIGZhbGxiYWNrIHdoZW4gbm8gcHJvbW90aW9uIGlzIHBvc3NpYmxlXG4gICAgdmFyIGNyZWF0ZUFuZENvcHkgPSBmdW5jdGlvbiAob3JpZ2luLCBwcm90bykge1xuICAgICAgcmV0dXJuIGNvcHlEZXNjcmlwdG9ycyhjcmVhdGUocHJvdG8pLCBvcmlnaW4pO1xuICAgIH07XG4gICAgdmFyIHNldCwgc2V0UHJvdG90eXBlT2Y7XG4gICAgdHJ5IHtcbiAgICAgIC8vIHRoaXMgbWlnaHQgZmFpbCBmb3IgdmFyaW91cyByZWFzb25zXG4gICAgICAvLyBpZ25vcmUgaWYgQ2hyb21lIGNvdWdodCBpdCBhdCBydW50aW1lXG4gICAgICBzZXQgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqUHJvdG8sICdfX3Byb3RvX18nKS5zZXQ7XG4gICAgICBzZXQuY2FsbCh7fSwgbnVsbCk7XG4gICAgICAvLyBzZXR0ZXIgbm90IHBvaXNvbmVkLCBpdCBjYW4gcHJvbW90ZVxuICAgICAgLy8gRmlyZWZveCwgQ2hyb21lXG4gICAgICBzZXRQcm90b3R5cGVPZiA9IGZ1bmN0aW9uIChvcmlnaW4sIHByb3RvKSB7XG4gICAgICAgIHNldC5jYWxsKG9yaWdpbiwgcHJvdG8pO1xuICAgICAgICByZXR1cm4gb3JpZ2luO1xuICAgICAgfTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBkbyBvbmUgb3IgbW9yZSBmZWF0dXJlIGRldGVjdGlvbnNcbiAgICAgIHNldCA9IHsgX19wcm90b19fOiBudWxsIH07XG4gICAgICAvLyBpZiBwcm90byBkb2VzIG5vdCB3b3JrLCBuZWVkcyB0byBmYWxsYmFja1xuICAgICAgLy8gc29tZSBPcGVyYSwgUmhpbm8sIGR1Y2t0YXBlXG4gICAgICBpZiAoc2V0IGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgIHNldFByb3RvdHlwZU9mID0gY3JlYXRlQW5kQ29weTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHZlcmlmeSBpZiBudWxsIG9iamVjdHMgYXJlIGJ1Z2d5XG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG4gICAgICAgIHNldC5fX3Byb3RvX18gPSBvYmpQcm90bztcbiAgICAgICAgLyogZXNsaW50LWVuYWJsZSBuby1wcm90byAqL1xuICAgICAgICAvLyBpZiBudWxsIG9iamVjdHMgYXJlIGJ1Z2d5XG4gICAgICAgIC8vIG5vZGVqcyAwLjggdG8gMC4xMFxuICAgICAgICBpZiAoc2V0IGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgICAgc2V0UHJvdG90eXBlT2YgPSBmdW5jdGlvbiAob3JpZ2luLCBwcm90bykge1xuICAgICAgICAgICAgLy8gdXNlIHN1Y2ggYnVnIHRvIHByb21vdGVcbiAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG4gICAgICAgICAgICBvcmlnaW4uX19wcm90b19fID0gcHJvdG87XG4gICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXByb3RvICovXG4gICAgICAgICAgICByZXR1cm4gb3JpZ2luO1xuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gdHJ5IHRvIHVzZSBwcm90byBvciBmYWxsYmFja1xuICAgICAgICAgIC8vIFNhZmFyaSwgb2xkIEZpcmVmb3gsIG1hbnkgb3RoZXJzXG4gICAgICAgICAgc2V0UHJvdG90eXBlT2YgPSBmdW5jdGlvbiAob3JpZ2luLCBwcm90bykge1xuICAgICAgICAgICAgLy8gaWYgcHJvdG8gaXMgbm90IG51bGxcbiAgICAgICAgICAgIGlmIChnZXRQcm90b3R5cGVPZihvcmlnaW4pKSB7XG4gICAgICAgICAgICAgIC8vIHVzZSBfX3Byb3RvX18gdG8gcHJvbW90ZVxuICAgICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xuICAgICAgICAgICAgICBvcmlnaW4uX19wcm90b19fID0gcHJvdG87XG4gICAgICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tcHJvdG8gKi9cbiAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIG90aGVyd2lzZSB1bmFibGUgdG8gcHJvbW90ZTogZmFsbGJhY2tcbiAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUFuZENvcHkob3JpZ2luLCBwcm90byk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YgPSBzZXRQcm90b3R5cGVPZjtcbiAgfSgpKTtcblxuICBpZiAoc3VwcG9ydHNEZXNjcmlwdG9ycyAmJiBmdW5jdGlvbiBmb28oKSB7IH0ubmFtZSAhPT0gJ2ZvbycpIHtcbiAgICB0cnkge1xuICAgICAgLyogZXNsaW50IG5vLWV4dGVuZC1uYXRpdmU6IDEgKi9cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGdW5jdGlvbi5wcm90b3R5cGUsICduYW1lJywge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgc3RyID0gX2NhbGwoZnVuY3Rpb25Ub1N0cmluZywgdGhpcyk7XG4gICAgICAgICAgdmFyIG1hdGNoID0gX2NhbGwoX3N0ck1hdGNoLCBzdHIsIC9cXHMqZnVuY3Rpb25cXHMrKFteKFxcc10qKVxccyovKTtcbiAgICAgICAgICB2YXIgbmFtZSA9IG1hdGNoICYmIG1hdGNoWzFdO1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbmFtZScsIHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdmFsdWU6IG5hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gbmFtZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIGNvbnNvbGUubG9nKCdlcnJvciAgT2JqZWN0LmRlZmluZVByb3BlcnR5Jyk7XG4gICAgfVxuICB9XG59KSk7XG4vL3JlcXVlc3RBbmltYXRpb25GcmFtZSBcbihmdW5jdGlvbiAoKSB7XG4gIHZhciByZXF1ZXN0QW5pbWF0b24gPSB0eXBlb2Ygd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSAhPSAndW5kZWZpbmVkJyA/IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBjYWxsYmFjayhEYXRlLm5vdygpKTtcbiAgICB9LCAyNSk7XG4gIH07XG5cbiAgdmFyIGNhbmNlbEFuaW1hdGlvbiA9IHR5cGVvZiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lICE9ICd1bmRlZmluZWQnID8gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIDogZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgcmV0dXJuIGNsZWFyVGltZW91dCh0b2tlbik7XG4gIH07XG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0b247XG4gIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGNhbmNlbEFuaW1hdGlvbjtcblxufSkoKTsiLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSh7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBwcm90byA9IHJlcXVpcmUoJy4vQXJyYXkucHJvdG90eXBlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRwcm90b3R5cGU6IHByb3RvLFxuXHRzaGltOiBmdW5jdGlvbiBzaGltQXJyYXkoKSB7XG5cdFx0cHJvdG8uc2hpbSgpO1xuXHR9XG59O1xuXG59LHtcIi4vQXJyYXkucHJvdG90eXBlXCI6M31dLDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJ2FycmF5LWluY2x1ZGVzJyk7XG5cbn0se1wiYXJyYXktaW5jbHVkZXNcIjoxNH1dLDM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW5jbHVkZXMgPSByZXF1aXJlKCcuL0FycmF5LnByb3RvdHlwZS5pbmNsdWRlcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5jbHVkZXM6IGluY2x1ZGVzLFxuXHRzaGltOiBmdW5jdGlvbiBzaGltQXJyYXlQcm90b3R5cGUoKSB7XG5cdFx0aW5jbHVkZXMuc2hpbSgpO1xuXHR9XG59O1xuXG59LHtcIi4vQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzXCI6Mn1dLDQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2V0RGVzY3JpcHRvcnMgPSByZXF1aXJlKCdvYmplY3QuZ2V0b3ducHJvcGVydHlkZXNjcmlwdG9ycycpO1xudmFyIGVudHJpZXMgPSByZXF1aXJlKCdvYmplY3QuZW50cmllcycpO1xudmFyIHZhbHVlcyA9IHJlcXVpcmUoJ29iamVjdC52YWx1ZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGVudHJpZXM6IGVudHJpZXMsXG5cdGdldE93blByb3BlcnR5RGVzY3JpcHRvcnM6IGdldERlc2NyaXB0b3JzLFxuXHRzaGltOiBmdW5jdGlvbiBzaGltT2JqZWN0KCkge1xuXHRcdGdldERlc2NyaXB0b3JzLnNoaW0oKTtcblx0XHRlbnRyaWVzLnNoaW0oKTtcblx0XHR2YWx1ZXMuc2hpbSgpO1xuXHR9LFxuXHR2YWx1ZXM6IHZhbHVlc1xufTtcblxufSx7XCJvYmplY3QuZW50cmllc1wiOjM4LFwib2JqZWN0LmdldG93bnByb3BlcnR5ZGVzY3JpcHRvcnNcIjo2NCxcIm9iamVjdC52YWx1ZXNcIjo4OX1dLDU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyaW5nUHJvdG90eXBlID0gcmVxdWlyZSgnLi9TdHJpbmcucHJvdG90eXBlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRwcm90b3R5cGU6IHN0cmluZ1Byb3RvdHlwZSxcblx0c2hpbTogZnVuY3Rpb24gc2hpbVN0cmluZygpIHtcblx0XHRzdHJpbmdQcm90b3R5cGUuc2hpbSgpO1xuXHR9XG59O1xuXG59LHtcIi4vU3RyaW5nLnByb3RvdHlwZVwiOjd9XSw2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdzdHJpbmctYXQnKTtcblxufSx7XCJzdHJpbmctYXRcIjoxMTR9XSw3OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGF0ID0gcmVxdWlyZSgnLi9TdHJpbmcucHJvdG90eXBlLmF0Jyk7XG52YXIgcGFkU3RhcnQgPSByZXF1aXJlKCcuL1N0cmluZy5wcm90b3R5cGUucGFkU3RhcnQnKTtcbnZhciBwYWRFbmQgPSByZXF1aXJlKCcuL1N0cmluZy5wcm90b3R5cGUucGFkRW5kJyk7XG52YXIgdHJpbUxlZnQgPSByZXF1aXJlKCcuL1N0cmluZy5wcm90b3R5cGUudHJpbUxlZnQnKTtcbnZhciB0cmltUmlnaHQgPSByZXF1aXJlKCcuL1N0cmluZy5wcm90b3R5cGUudHJpbVJpZ2h0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRhdDogYXQsXG5cdHBhZFN0YXJ0OiBwYWRTdGFydCxcblx0cGFkRW5kOiBwYWRFbmQsXG5cdHRyaW1MZWZ0OiB0cmltTGVmdCxcblx0dHJpbVJpZ2h0OiB0cmltUmlnaHQsXG5cdHNoaW06IGZ1bmN0aW9uIHNoaW1TdHJpbmdQcm90b3R5cGUoKSB7XG5cdFx0YXQuc2hpbSgpO1xuXHRcdHBhZFN0YXJ0LnNoaW0oKTtcblx0XHRwYWRFbmQuc2hpbSgpO1xuXHRcdHRyaW1MZWZ0LnNoaW0oKTtcblx0XHR0cmltUmlnaHQuc2hpbSgpO1xuXHR9XG59O1xuXG59LHtcIi4vU3RyaW5nLnByb3RvdHlwZS5hdFwiOjYsXCIuL1N0cmluZy5wcm90b3R5cGUucGFkRW5kXCI6OCxcIi4vU3RyaW5nLnByb3RvdHlwZS5wYWRTdGFydFwiOjksXCIuL1N0cmluZy5wcm90b3R5cGUudHJpbUxlZnRcIjoxMCxcIi4vU3RyaW5nLnByb3RvdHlwZS50cmltUmlnaHRcIjoxMX1dLDg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJ3N0cmluZy5wcm90b3R5cGUucGFkZW5kJyk7XG5cbn0se1wic3RyaW5nLnByb3RvdHlwZS5wYWRlbmRcIjoxMzd9XSw5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdzdHJpbmcucHJvdG90eXBlLnBhZHN0YXJ0Jyk7XG5cbn0se1wic3RyaW5nLnByb3RvdHlwZS5wYWRzdGFydFwiOjE2Mn1dLDEwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdzdHJpbmcucHJvdG90eXBlLnRyaW1sZWZ0Jyk7XG5cbn0se1wic3RyaW5nLnByb3RvdHlwZS50cmltbGVmdFwiOjE4N31dLDExOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdzdHJpbmcucHJvdG90eXBlLnRyaW1yaWdodCcpO1xuXG59LHtcInN0cmluZy5wcm90b3R5cGUudHJpbXJpZ2h0XCI6MTk3fV0sMTI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuLyohXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM3LXNoaW1cbiAqIEBsaWNlbnNlIGVzNy1zaGltIENvcHlyaWdodCAyMDE0IGJ5IGNvbnRyaWJ1dG9ycywgTUlUIExpY2Vuc2VcbiAqIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM3LXNoaW0vYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyICRBcnJheSA9IHJlcXVpcmUoJy4vQXJyYXknKTtcbnZhciAkT2JqZWN0ID0gcmVxdWlyZSgnLi9PYmplY3QnKTtcbnZhciAkU3RyaW5nID0gcmVxdWlyZSgnLi9TdHJpbmcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdEFycmF5OiAkQXJyYXksXG5cdE9iamVjdDogJE9iamVjdCxcblx0U3RyaW5nOiAkU3RyaW5nLFxuXHRzaGltOiBmdW5jdGlvbiBzaGltRVM3KCkge1xuXHRcdCRBcnJheS5zaGltKCk7XG5cdFx0JE9iamVjdC5zaGltKCk7XG5cdFx0JFN0cmluZy5zaGltKCk7XG5cdH1cbn07XG5cbn0se1wiLi9BcnJheVwiOjEsXCIuL09iamVjdFwiOjQsXCIuL1N0cmluZ1wiOjV9XSwxMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4oZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBFUyA9IHJlcXVpcmUoJ2VzLWFic3RyYWN0L2VzNicpO1xudmFyICRpc05hTiA9IE51bWJlci5pc05hTiB8fCBmdW5jdGlvbiAoYSkgeyByZXR1cm4gYSAhPT0gYTsgfTtcbnZhciAkaXNGaW5pdGUgPSBOdW1iZXIuaXNGaW5pdGUgfHwgZnVuY3Rpb24gKG4pIHsgcmV0dXJuIHR5cGVvZiBuID09PSAnbnVtYmVyJyAmJiBnbG9iYWwuaXNGaW5pdGUobik7IH07XG52YXIgaW5kZXhPZiA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluY2x1ZGVzKHNlYXJjaEVsZW1lbnQpIHtcblx0dmFyIGZyb21JbmRleCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gRVMuVG9JbnRlZ2VyKGFyZ3VtZW50c1sxXSkgOiAwO1xuXHRpZiAoaW5kZXhPZiAmJiAhJGlzTmFOKHNlYXJjaEVsZW1lbnQpICYmICRpc0Zpbml0ZShmcm9tSW5kZXgpICYmIHR5cGVvZiBzZWFyY2hFbGVtZW50ICE9PSAndW5kZWZpbmVkJykge1xuXHRcdHJldHVybiBpbmRleE9mLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgPiAtMTtcblx0fVxuXG5cdHZhciBPID0gRVMuVG9PYmplY3QodGhpcyk7XG5cdHZhciBsZW5ndGggPSBFUy5Ub0xlbmd0aChPLmxlbmd0aCk7XG5cdGlmIChsZW5ndGggPT09IDApIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0dmFyIGsgPSBmcm9tSW5kZXggPj0gMCA/IGZyb21JbmRleCA6IE1hdGgubWF4KDAsIGxlbmd0aCArIGZyb21JbmRleCk7XG5cdHdoaWxlIChrIDwgbGVuZ3RoKSB7XG5cdFx0aWYgKEVTLlNhbWVWYWx1ZVplcm8oc2VhcmNoRWxlbWVudCwgT1trXSkpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRrICs9IDE7XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG59LHtcImVzLWFic3RyYWN0L2VzNlwiOjE3fV0sMTQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGVmaW5lID0gcmVxdWlyZSgnZGVmaW5lLXByb3BlcnRpZXMnKTtcbnZhciBFUyA9IHJlcXVpcmUoJ2VzLWFic3RyYWN0L2VzNicpO1xuXG52YXIgaW1wbGVtZW50YXRpb24gPSByZXF1aXJlKCcuL2ltcGxlbWVudGF0aW9uJyk7XG52YXIgZ2V0UG9seWZpbGwgPSByZXF1aXJlKCcuL3BvbHlmaWxsJyk7XG52YXIgcG9seWZpbGwgPSBnZXRQb2x5ZmlsbCgpO1xudmFyIHNoaW0gPSByZXF1aXJlKCcuL3NoaW0nKTtcblxudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGJvdW5kSW5jbHVkZXNTaGltID0gZnVuY3Rpb24gaW5jbHVkZXMoYXJyYXksIHNlYXJjaEVsZW1lbnQpIHtcbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cblx0RVMuUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcnJheSk7XG5cdHJldHVybiBwb2x5ZmlsbC5hcHBseShhcnJheSwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbn07XG5kZWZpbmUoYm91bmRJbmNsdWRlc1NoaW0sIHtcblx0aW1wbGVtZW50YXRpb246IGltcGxlbWVudGF0aW9uLFxuXHRnZXRQb2x5ZmlsbDogZ2V0UG9seWZpbGwsXG5cdHNoaW06IHNoaW1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJvdW5kSW5jbHVkZXNTaGltO1xuXG59LHtcIi4vaW1wbGVtZW50YXRpb25cIjoxMyxcIi4vcG9seWZpbGxcIjozNSxcIi4vc2hpbVwiOjM2LFwiZGVmaW5lLXByb3BlcnRpZXNcIjoxNSxcImVzLWFic3RyYWN0L2VzNlwiOjE3fV0sMTU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIga2V5cyA9IHJlcXVpcmUoJ29iamVjdC1rZXlzJyk7XG52YXIgZm9yZWFjaCA9IHJlcXVpcmUoJ2ZvcmVhY2gnKTtcbnZhciBoYXNTeW1ib2xzID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgU3ltYm9sKCkgPT09ICdzeW1ib2wnO1xuXG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG52YXIgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uIChmbikge1xuXHRyZXR1cm4gdHlwZW9mIGZuID09PSAnZnVuY3Rpb24nICYmIHRvU3RyLmNhbGwoZm4pID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufTtcblxudmFyIGFyZVByb3BlcnR5RGVzY3JpcHRvcnNTdXBwb3J0ZWQgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBvYmogPSB7fTtcblx0dHJ5IHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCAneCcsIHsgZW51bWVyYWJsZTogZmFsc2UsIHZhbHVlOiBvYmogfSk7XG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzLCBuby1yZXN0cmljdGVkLXN5bnRheCAqL1xuICAgICAgICBmb3IgKHZhciBfIGluIG9iaikgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgICAgLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycywgbm8tcmVzdHJpY3RlZC1zeW50YXggKi9cblx0XHRyZXR1cm4gb2JqLnggPT09IG9iajtcblx0fSBjYXRjaCAoZSkgeyAvKiB0aGlzIGlzIElFIDguICovXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59O1xudmFyIHN1cHBvcnRzRGVzY3JpcHRvcnMgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgJiYgYXJlUHJvcGVydHlEZXNjcmlwdG9yc1N1cHBvcnRlZCgpO1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lLCB2YWx1ZSwgcHJlZGljYXRlKSB7XG5cdGlmIChuYW1lIGluIG9iamVjdCAmJiAoIWlzRnVuY3Rpb24ocHJlZGljYXRlKSB8fCAhcHJlZGljYXRlKCkpKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGlmIChzdXBwb3J0c0Rlc2NyaXB0b3JzKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwge1xuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdFx0ZW51bWVyYWJsZTogZmFsc2UsXG5cdFx0XHR2YWx1ZTogdmFsdWUsXG5cdFx0XHR3cml0YWJsZTogdHJ1ZVxuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdG9iamVjdFtuYW1lXSA9IHZhbHVlO1xuXHR9XG59O1xuXG52YXIgZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIChvYmplY3QsIG1hcCkge1xuXHR2YXIgcHJlZGljYXRlcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyID8gYXJndW1lbnRzWzJdIDoge307XG5cdHZhciBwcm9wcyA9IGtleXMobWFwKTtcblx0aWYgKGhhc1N5bWJvbHMpIHtcblx0XHRwcm9wcyA9IHByb3BzLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG1hcCkpO1xuXHR9XG5cdGZvcmVhY2gocHJvcHMsIGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0ZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCBtYXBbbmFtZV0sIHByZWRpY2F0ZXNbbmFtZV0pO1xuXHR9KTtcbn07XG5cbmRlZmluZVByb3BlcnRpZXMuc3VwcG9ydHNEZXNjcmlwdG9ycyA9ICEhc3VwcG9ydHNEZXNjcmlwdG9ycztcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVQcm9wZXJ0aWVzO1xuXG59LHtcImZvcmVhY2hcIjoyNixcIm9iamVjdC1rZXlzXCI6MzN9XSwxNjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciAkaXNOYU4gPSBOdW1iZXIuaXNOYU4gfHwgZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGEgIT09IGE7IH07XG52YXIgJGlzRmluaXRlID0gcmVxdWlyZSgnLi9oZWxwZXJzL2lzRmluaXRlJyk7XG5cbnZhciBzaWduID0gcmVxdWlyZSgnLi9oZWxwZXJzL3NpZ24nKTtcbnZhciBtb2QgPSByZXF1aXJlKCcuL2hlbHBlcnMvbW9kJyk7XG5cbnZhciBJc0NhbGxhYmxlID0gcmVxdWlyZSgnaXMtY2FsbGFibGUnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJ2VzLXRvLXByaW1pdGl2ZS9lczUnKTtcblxuLy8gaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OVxudmFyIEVTNSA9IHtcblx0VG9QcmltaXRpdmU6IHRvUHJpbWl0aXZlLFxuXG5cdFRvQm9vbGVhbjogZnVuY3Rpb24gVG9Cb29sZWFuKHZhbHVlKSB7XG5cdFx0cmV0dXJuIEJvb2xlYW4odmFsdWUpO1xuXHR9LFxuXHRUb051bWJlcjogZnVuY3Rpb24gVG9OdW1iZXIodmFsdWUpIHtcblx0XHRyZXR1cm4gTnVtYmVyKHZhbHVlKTtcblx0fSxcblx0VG9JbnRlZ2VyOiBmdW5jdGlvbiBUb0ludGVnZXIodmFsdWUpIHtcblx0XHR2YXIgbnVtYmVyID0gdGhpcy5Ub051bWJlcih2YWx1ZSk7XG5cdFx0aWYgKCRpc05hTihudW1iZXIpKSB7IHJldHVybiAwOyB9XG5cdFx0aWYgKG51bWJlciA9PT0gMCB8fCAhJGlzRmluaXRlKG51bWJlcikpIHsgcmV0dXJuIG51bWJlcjsgfVxuXHRcdHJldHVybiBzaWduKG51bWJlcikgKiBNYXRoLmZsb29yKE1hdGguYWJzKG51bWJlcikpO1xuXHR9LFxuXHRUb0ludDMyOiBmdW5jdGlvbiBUb0ludDMyKHgpIHtcblx0XHRyZXR1cm4gdGhpcy5Ub051bWJlcih4KSA+PiAwO1xuXHR9LFxuXHRUb1VpbnQzMjogZnVuY3Rpb24gVG9VaW50MzIoeCkge1xuXHRcdHJldHVybiB0aGlzLlRvTnVtYmVyKHgpID4+PiAwO1xuXHR9LFxuXHRUb1VpbnQxNjogZnVuY3Rpb24gVG9VaW50MTYodmFsdWUpIHtcblx0XHR2YXIgbnVtYmVyID0gdGhpcy5Ub051bWJlcih2YWx1ZSk7XG5cdFx0aWYgKCRpc05hTihudW1iZXIpIHx8IG51bWJlciA9PT0gMCB8fCAhJGlzRmluaXRlKG51bWJlcikpIHsgcmV0dXJuIDA7IH1cblx0XHR2YXIgcG9zSW50ID0gc2lnbihudW1iZXIpICogTWF0aC5mbG9vcihNYXRoLmFicyhudW1iZXIpKTtcblx0XHRyZXR1cm4gbW9kKHBvc0ludCwgMHgxMDAwMCk7XG5cdH0sXG5cdFRvU3RyaW5nOiBmdW5jdGlvbiBUb1N0cmluZyh2YWx1ZSkge1xuXHRcdHJldHVybiBTdHJpbmcodmFsdWUpO1xuXHR9LFxuXHRUb09iamVjdDogZnVuY3Rpb24gVG9PYmplY3QodmFsdWUpIHtcblx0XHR0aGlzLkNoZWNrT2JqZWN0Q29lcmNpYmxlKHZhbHVlKTtcblx0XHRyZXR1cm4gT2JqZWN0KHZhbHVlKTtcblx0fSxcblx0Q2hlY2tPYmplY3RDb2VyY2libGU6IGZ1bmN0aW9uIENoZWNrT2JqZWN0Q29lcmNpYmxlKHZhbHVlLCBvcHRNZXNzYWdlKSB7XG5cdFx0LyoganNoaW50IGVxbnVsbDp0cnVlICovXG5cdFx0aWYgKHZhbHVlID09IG51bGwpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3Iob3B0TWVzc2FnZSB8fCAnQ2Fubm90IGNhbGwgbWV0aG9kIG9uICcgKyB2YWx1ZSk7XG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZTtcblx0fSxcblx0SXNDYWxsYWJsZTogSXNDYWxsYWJsZSxcblx0U2FtZVZhbHVlOiBmdW5jdGlvbiBTYW1lVmFsdWUoeCwgeSkge1xuXHRcdGlmICh4ID09PSB5KSB7IC8vIDAgPT09IC0wLCBidXQgdGhleSBhcmUgbm90IGlkZW50aWNhbC5cblx0XHRcdGlmICh4ID09PSAwKSB7IHJldHVybiAxIC8geCA9PT0gMSAvIHk7IH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cbiAgICAgICAgcmV0dXJuICRpc05hTih4KSAmJiAkaXNOYU4oeSk7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRVM1O1xuXG59LHtcIi4vaGVscGVycy9pc0Zpbml0ZVwiOjE5LFwiLi9oZWxwZXJzL21vZFwiOjIxLFwiLi9oZWxwZXJzL3NpZ25cIjoyMixcImVzLXRvLXByaW1pdGl2ZS9lczVcIjoyMyxcImlzLWNhbGxhYmxlXCI6Mjl9XSwxNzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgaGFzU3ltYm9scyA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gJ3N5bWJvbCc7XG52YXIgc3ltYm9sVG9TdHIgPSBoYXNTeW1ib2xzID8gU3ltYm9sLnByb3RvdHlwZS50b1N0cmluZyA6IHRvU3RyO1xuXG52YXIgJGlzTmFOID0gTnVtYmVyLmlzTmFOIHx8IGZ1bmN0aW9uIChhKSB7IHJldHVybiBhICE9PSBhOyB9O1xudmFyICRpc0Zpbml0ZSA9IHJlcXVpcmUoJy4vaGVscGVycy9pc0Zpbml0ZScpO1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUiB8fCBNYXRoLnBvdygyLCA1MykgLSAxO1xuXG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi9oZWxwZXJzL2Fzc2lnbicpO1xudmFyIHNpZ24gPSByZXF1aXJlKCcuL2hlbHBlcnMvc2lnbicpO1xudmFyIG1vZCA9IHJlcXVpcmUoJy4vaGVscGVycy9tb2QnKTtcbnZhciBpc1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vaGVscGVycy9pc1ByaW1pdGl2ZScpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnZXMtdG8tcHJpbWl0aXZlL2VzNicpO1xudmFyIHBhcnNlSW50ZWdlciA9IHBhcnNlSW50O1xudmFyIGJpbmQgPSByZXF1aXJlKCdmdW5jdGlvbi1iaW5kJyk7XG52YXIgc3RyU2xpY2UgPSBiaW5kLmNhbGwoRnVuY3Rpb24uY2FsbCwgU3RyaW5nLnByb3RvdHlwZS5zbGljZSk7XG52YXIgaXNCaW5hcnkgPSBiaW5kLmNhbGwoRnVuY3Rpb24uY2FsbCwgUmVnRXhwLnByb3RvdHlwZS50ZXN0LCAvXjBiWzAxXSskL2kpO1xudmFyIGlzT2N0YWwgPSBiaW5kLmNhbGwoRnVuY3Rpb24uY2FsbCwgUmVnRXhwLnByb3RvdHlwZS50ZXN0LCAvXjBvWzAtN10rJC9pKTtcbnZhciBub25XUyA9IFsnXFx1MDA4NScsICdcXHUyMDBiJywgJ1xcdWZmZmUnXS5qb2luKCcnKTtcbnZhciBub25XU3JlZ2V4ID0gbmV3IFJlZ0V4cCgnWycgKyBub25XUyArICddJywgJ2cnKTtcbnZhciBoYXNOb25XUyA9IGJpbmQuY2FsbChGdW5jdGlvbi5jYWxsLCBSZWdFeHAucHJvdG90eXBlLnRlc3QsIG5vbldTcmVnZXgpO1xudmFyIGludmFsaWRIZXhMaXRlcmFsID0gL15bXFwtXFwrXTB4WzAtOWEtZl0rJC9pO1xudmFyIGlzSW52YWxpZEhleExpdGVyYWwgPSBiaW5kLmNhbGwoRnVuY3Rpb24uY2FsbCwgUmVnRXhwLnByb3RvdHlwZS50ZXN0LCBpbnZhbGlkSGV4TGl0ZXJhbCk7XG5cbi8vIHdoaXRlc3BhY2UgZnJvbTogaHR0cDovL2VzNS5naXRodWIuaW8vI3gxNS41LjQuMjBcbi8vIGltcGxlbWVudGF0aW9uIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltL2Jsb2IvdjMuNC4wL2VzNS1zaGltLmpzI0wxMzA0LUwxMzI0XG52YXIgd3MgPSBbXG5cdCdcXHgwOVxceDBBXFx4MEJcXHgwQ1xceDBEXFx4MjBcXHhBMFxcdTE2ODBcXHUxODBFXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwMycsXG5cdCdcXHUyMDA0XFx1MjAwNVxcdTIwMDZcXHUyMDA3XFx1MjAwOFxcdTIwMDlcXHUyMDBBXFx1MjAyRlxcdTIwNUZcXHUzMDAwXFx1MjAyOCcsXG5cdCdcXHUyMDI5XFx1RkVGRidcbl0uam9pbignJyk7XG52YXIgdHJpbVJlZ2V4ID0gbmV3IFJlZ0V4cCgnKF5bJyArIHdzICsgJ10rKXwoWycgKyB3cyArICddKyQpJywgJ2cnKTtcbnZhciByZXBsYWNlID0gYmluZC5jYWxsKEZ1bmN0aW9uLmNhbGwsIFN0cmluZy5wcm90b3R5cGUucmVwbGFjZSk7XG52YXIgdHJpbSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRyZXR1cm4gcmVwbGFjZSh2YWx1ZSwgdHJpbVJlZ2V4LCAnJyk7XG59O1xuXG52YXIgRVM1ID0gcmVxdWlyZSgnLi9lczUnKTtcblxudmFyIGhhc1JlZ0V4cE1hdGNoZXIgPSByZXF1aXJlKCdpcy1yZWdleCcpO1xuXG4vLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtYWJzdHJhY3Qtb3BlcmF0aW9uc1xudmFyIEVTNiA9IGFzc2lnbihhc3NpZ24oe30sIEVTNSksIHtcblxuXHQvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtY2FsbC1mLXYtYXJnc1xuXHRDYWxsOiBmdW5jdGlvbiBDYWxsKEYsIFYpIHtcblx0XHR2YXIgYXJncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyID8gYXJndW1lbnRzWzJdIDogW107XG5cdFx0aWYgKCF0aGlzLklzQ2FsbGFibGUoRikpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoRiArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcblx0XHR9XG5cdFx0cmV0dXJuIEYuYXBwbHkoViwgYXJncyk7XG5cdH0sXG5cblx0Ly8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvcHJpbWl0aXZlXG5cdFRvUHJpbWl0aXZlOiB0b1ByaW1pdGl2ZSxcblxuXHQvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9ib29sZWFuXG5cdC8vIFRvQm9vbGVhbjogRVM1LlRvQm9vbGVhbixcblxuXHQvLyBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtdG9udW1iZXJcblx0VG9OdW1iZXI6IGZ1bmN0aW9uIFRvTnVtYmVyKGFyZ3VtZW50KSB7XG5cdFx0dmFyIHZhbHVlID0gaXNQcmltaXRpdmUoYXJndW1lbnQpID8gYXJndW1lbnQgOiB0b1ByaW1pdGl2ZShhcmd1bWVudCwgJ251bWJlcicpO1xuXHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCBhIFN5bWJvbCB2YWx1ZSB0byBhIG51bWJlcicpO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuXHRcdFx0aWYgKGlzQmluYXJ5KHZhbHVlKSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5Ub051bWJlcihwYXJzZUludGVnZXIoc3RyU2xpY2UodmFsdWUsIDIpLCAyKSk7XG5cdFx0XHR9IGVsc2UgaWYgKGlzT2N0YWwodmFsdWUpKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLlRvTnVtYmVyKHBhcnNlSW50ZWdlcihzdHJTbGljZSh2YWx1ZSwgMiksIDgpKTtcblx0XHRcdH0gZWxzZSBpZiAoaGFzTm9uV1ModmFsdWUpIHx8IGlzSW52YWxpZEhleExpdGVyYWwodmFsdWUpKSB7XG5cdFx0XHRcdHJldHVybiBOYU47XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgdHJpbW1lZCA9IHRyaW0odmFsdWUpO1xuXHRcdFx0XHRpZiAodHJpbW1lZCAhPT0gdmFsdWUpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5Ub051bWJlcih0cmltbWVkKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gTnVtYmVyKHZhbHVlKTtcblx0fSxcblxuXHQvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9pbnRlZ2VyXG5cdC8vIFRvSW50ZWdlcjogRVM1LlRvTnVtYmVyLFxuXG5cdC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2ludDMyXG5cdC8vIFRvSW50MzI6IEVTNS5Ub0ludDMyLFxuXG5cdC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b3VpbnQzMlxuXHQvLyBUb1VpbnQzMjogRVM1LlRvVWludDMyLFxuXG5cdC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2ludDE2XG5cdFRvSW50MTY6IGZ1bmN0aW9uIFRvSW50MTYoYXJndW1lbnQpIHtcblx0XHR2YXIgaW50MTZiaXQgPSB0aGlzLlRvVWludDE2KGFyZ3VtZW50KTtcblx0XHRyZXR1cm4gaW50MTZiaXQgPj0gMHg4MDAwID8gaW50MTZiaXQgLSAweDEwMDAwIDogaW50MTZiaXQ7XG5cdH0sXG5cblx0Ly8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvdWludDE2XG5cdC8vIFRvVWludDE2OiBFUzUuVG9VaW50MTYsXG5cblx0Ly8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvaW50OFxuXHRUb0ludDg6IGZ1bmN0aW9uIFRvSW50OChhcmd1bWVudCkge1xuXHRcdHZhciBpbnQ4Yml0ID0gdGhpcy5Ub1VpbnQ4KGFyZ3VtZW50KTtcblx0XHRyZXR1cm4gaW50OGJpdCA+PSAweDgwID8gaW50OGJpdCAtIDB4MTAwIDogaW50OGJpdDtcblx0fSxcblxuXHQvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG91aW50OFxuXHRUb1VpbnQ4OiBmdW5jdGlvbiBUb1VpbnQ4KGFyZ3VtZW50KSB7XG5cdFx0dmFyIG51bWJlciA9IHRoaXMuVG9OdW1iZXIoYXJndW1lbnQpO1xuXHRcdGlmICgkaXNOYU4obnVtYmVyKSB8fCBudW1iZXIgPT09IDAgfHwgISRpc0Zpbml0ZShudW1iZXIpKSB7IHJldHVybiAwOyB9XG5cdFx0dmFyIHBvc0ludCA9IHNpZ24obnVtYmVyKSAqIE1hdGguZmxvb3IoTWF0aC5hYnMobnVtYmVyKSk7XG5cdFx0cmV0dXJuIG1vZChwb3NJbnQsIDB4MTAwKTtcblx0fSxcblxuXHQvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG91aW50OGNsYW1wXG5cdFRvVWludDhDbGFtcDogZnVuY3Rpb24gVG9VaW50OENsYW1wKGFyZ3VtZW50KSB7XG5cdFx0dmFyIG51bWJlciA9IHRoaXMuVG9OdW1iZXIoYXJndW1lbnQpO1xuXHRcdGlmICgkaXNOYU4obnVtYmVyKSB8fCBudW1iZXIgPD0gMCkgeyByZXR1cm4gMDsgfVxuXHRcdGlmIChudW1iZXIgPj0gMHhGRikgeyByZXR1cm4gMHhGRjsgfVxuXHRcdHZhciBmID0gTWF0aC5mbG9vcihhcmd1bWVudCk7XG5cdFx0aWYgKGYgKyAwLjUgPCBudW1iZXIpIHsgcmV0dXJuIGYgKyAxOyB9XG5cdFx0aWYgKG51bWJlciA8IGYgKyAwLjUpIHsgcmV0dXJuIGY7IH1cblx0XHRpZiAoZiAlIDIgIT09IDApIHsgcmV0dXJuIGYgKyAxOyB9XG5cdFx0cmV0dXJuIGY7XG5cdH0sXG5cblx0Ly8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvc3RyaW5nXG5cdFRvU3RyaW5nOiBmdW5jdGlvbiBUb1N0cmluZyhhcmd1bWVudCkge1xuXHRcdGlmICh0eXBlb2YgYXJndW1lbnQgPT09ICdzeW1ib2wnKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCBhIFN5bWJvbCB2YWx1ZSB0byBhIHN0cmluZycpO1xuXHRcdH1cblx0XHRyZXR1cm4gU3RyaW5nKGFyZ3VtZW50KTtcblx0fSxcblxuXHQvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9vYmplY3Rcblx0VG9PYmplY3Q6IGZ1bmN0aW9uIFRvT2JqZWN0KHZhbHVlKSB7XG5cdFx0dGhpcy5SZXF1aXJlT2JqZWN0Q29lcmNpYmxlKHZhbHVlKTtcblx0XHRyZXR1cm4gT2JqZWN0KHZhbHVlKTtcblx0fSxcblxuXHQvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9wcm9wZXJ0eWtleVxuXHRUb1Byb3BlcnR5S2V5OiBmdW5jdGlvbiBUb1Byb3BlcnR5S2V5KGFyZ3VtZW50KSB7XG5cdFx0dmFyIGtleSA9IHRoaXMuVG9QcmltaXRpdmUoYXJndW1lbnQsIFN0cmluZyk7XG5cdFx0cmV0dXJuIHR5cGVvZiBrZXkgPT09ICdzeW1ib2wnID8gc3ltYm9sVG9TdHIuY2FsbChrZXkpIDogdGhpcy5Ub1N0cmluZyhrZXkpO1xuXHR9LFxuXG5cdC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2xlbmd0aFxuXHRUb0xlbmd0aDogZnVuY3Rpb24gVG9MZW5ndGgoYXJndW1lbnQpIHtcblx0XHR2YXIgbGVuID0gdGhpcy5Ub0ludGVnZXIoYXJndW1lbnQpO1xuXHRcdGlmIChsZW4gPD0gMCkgeyByZXR1cm4gMDsgfSAvLyBpbmNsdWRlcyBjb252ZXJ0aW5nIC0wIHRvICswXG5cdFx0aWYgKGxlbiA+IE1BWF9TQUZFX0lOVEVHRVIpIHsgcmV0dXJuIE1BWF9TQUZFX0lOVEVHRVI7IH1cblx0XHRyZXR1cm4gbGVuO1xuXHR9LFxuXG5cdC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1jYW5vbmljYWxudW1lcmljaW5kZXhzdHJpbmdcblx0Q2Fub25pY2FsTnVtZXJpY0luZGV4U3RyaW5nOiBmdW5jdGlvbiBDYW5vbmljYWxOdW1lcmljSW5kZXhTdHJpbmcoYXJndW1lbnQpIHtcblx0XHRpZiAodG9TdHIuY2FsbChhcmd1bWVudCkgIT09ICdbb2JqZWN0IFN0cmluZ10nKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdtdXN0IGJlIGEgc3RyaW5nJyk7XG5cdFx0fVxuXHRcdGlmIChhcmd1bWVudCA9PT0gJy0wJykgeyByZXR1cm4gLTA7IH1cblx0XHR2YXIgbiA9IHRoaXMuVG9OdW1iZXIoYXJndW1lbnQpO1xuXHRcdGlmICh0aGlzLlNhbWVWYWx1ZSh0aGlzLlRvU3RyaW5nKG4pLCBhcmd1bWVudCkpIHsgcmV0dXJuIG47IH1cblx0fSxcblxuXHQvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtcmVxdWlyZW9iamVjdGNvZXJjaWJsZVxuXHRSZXF1aXJlT2JqZWN0Q29lcmNpYmxlOiBFUzUuQ2hlY2tPYmplY3RDb2VyY2libGUsXG5cblx0Ly8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWlzYXJyYXlcblx0SXNBcnJheTogQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBJc0FycmF5KGFyZ3VtZW50KSB7XG5cdFx0cmV0dXJuIHRvU3RyLmNhbGwoYXJndW1lbnQpID09PSAnW29iamVjdCBBcnJheV0nO1xuXHR9LFxuXG5cdC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1pc2NhbGxhYmxlXG5cdC8vIElzQ2FsbGFibGU6IEVTNS5Jc0NhbGxhYmxlLFxuXG5cdC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1pc2NvbnN0cnVjdG9yXG5cdElzQ29uc3RydWN0b3I6IGZ1bmN0aW9uIElzQ29uc3RydWN0b3IoYXJndW1lbnQpIHtcblx0XHRyZXR1cm4gdGhpcy5Jc0NhbGxhYmxlKGFyZ3VtZW50KTsgLy8gdW5mb3J0dW5hdGVseSB0aGVyZSdzIG5vIHdheSB0byB0cnVseSBjaGVjayB0aGlzIHdpdGhvdXQgdHJ5L2NhdGNoIGBuZXcgYXJndW1lbnRgXG5cdH0sXG5cblx0Ly8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWlzZXh0ZW5zaWJsZS1vXG5cdElzRXh0ZW5zaWJsZTogZnVuY3Rpb24gSXNFeHRlbnNpYmxlKG9iaikge1xuXHRcdGlmICghT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKSB7IHJldHVybiB0cnVlOyB9XG5cdFx0aWYgKGlzUHJpbWl0aXZlKG9iaikpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIE9iamVjdC5pc0V4dGVuc2libGUob2JqKTtcblx0fSxcblxuXHQvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtaXNpbnRlZ2VyXG5cdElzSW50ZWdlcjogZnVuY3Rpb24gSXNJbnRlZ2VyKGFyZ3VtZW50KSB7XG5cdFx0aWYgKHR5cGVvZiBhcmd1bWVudCAhPT0gJ251bWJlcicgfHwgJGlzTmFOKGFyZ3VtZW50KSB8fCAhJGlzRmluaXRlKGFyZ3VtZW50KSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHR2YXIgYWJzID0gTWF0aC5hYnMoYXJndW1lbnQpO1xuXHRcdHJldHVybiBNYXRoLmZsb29yKGFicykgPT09IGFicztcblx0fSxcblxuXHQvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtaXNwcm9wZXJ0eWtleVxuXHRJc1Byb3BlcnR5S2V5OiBmdW5jdGlvbiBJc1Byb3BlcnR5S2V5KGFyZ3VtZW50KSB7XG5cdFx0cmV0dXJuIHR5cGVvZiBhcmd1bWVudCA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGFyZ3VtZW50ID09PSAnc3ltYm9sJztcblx0fSxcblxuXHQvLyBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtaXNyZWdleHBcblx0SXNSZWdFeHA6IGZ1bmN0aW9uIElzUmVnRXhwKGFyZ3VtZW50KSB7XG5cdFx0aWYgKCFhcmd1bWVudCB8fCB0eXBlb2YgYXJndW1lbnQgIT09ICdvYmplY3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGlmIChoYXNTeW1ib2xzKSB7XG5cdFx0XHR2YXIgaXNSZWdFeHAgPSBSZWdFeHBbU3ltYm9sLm1hdGNoXTtcblx0XHRcdGlmICh0eXBlb2YgaXNSZWdFeHAgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHJldHVybiBFUzUuVG9Cb29sZWFuKGlzUmVnRXhwKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGhhc1JlZ0V4cE1hdGNoZXIoYXJndW1lbnQpO1xuXHR9LFxuXG5cdC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1zYW1ldmFsdWVcblx0Ly8gU2FtZVZhbHVlOiBFUzUuU2FtZVZhbHVlLFxuXG5cdC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1zYW1ldmFsdWV6ZXJvXG5cdFNhbWVWYWx1ZVplcm86IGZ1bmN0aW9uIFNhbWVWYWx1ZVplcm8oeCwgeSkge1xuXHRcdHJldHVybiAoeCA9PT0geSkgfHwgKCRpc05hTih4KSAmJiAkaXNOYU4oeSkpO1xuXHR9XG59KTtcblxuZGVsZXRlIEVTNi5DaGVja09iamVjdENvZXJjaWJsZTsgLy8gcmVuYW1lZCBpbiBFUzYgdG8gUmVxdWlyZU9iamVjdENvZXJjaWJsZVxuXG5tb2R1bGUuZXhwb3J0cyA9IEVTNjtcblxufSx7XCIuL2VzNVwiOjE2LFwiLi9oZWxwZXJzL2Fzc2lnblwiOjE4LFwiLi9oZWxwZXJzL2lzRmluaXRlXCI6MTksXCIuL2hlbHBlcnMvaXNQcmltaXRpdmVcIjoyMCxcIi4vaGVscGVycy9tb2RcIjoyMSxcIi4vaGVscGVycy9zaWduXCI6MjIsXCJlcy10by1wcmltaXRpdmUvZXM2XCI6MjQsXCJmdW5jdGlvbi1iaW5kXCI6MjgsXCJpcy1yZWdleFwiOjMxfV0sMTg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKSB7XG5cdGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcblx0XHRpZiAoaGFzLmNhbGwoc291cmNlLCBrZXkpKSB7XG5cdFx0XHR0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gdGFyZ2V0O1xufTtcblxufSx7fV0sMTk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xudmFyICRpc05hTiA9IE51bWJlci5pc05hTiB8fCBmdW5jdGlvbiAoYSkgeyByZXR1cm4gYSAhPT0gYTsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBOdW1iZXIuaXNGaW5pdGUgfHwgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHR5cGVvZiB4ID09PSAnbnVtYmVyJyAmJiAhJGlzTmFOKHgpICYmIHggIT09IEluZmluaXR5ICYmIHggIT09IC1JbmZpbml0eTsgfTtcblxufSx7fV0sMjA6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1ByaW1pdGl2ZSh2YWx1ZSkge1xuXHRyZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKTtcbn07XG5cbn0se31dLDIxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbW9kKG51bWJlciwgbW9kdWxvKSB7XG5cdHZhciByZW1haW4gPSBudW1iZXIgJSBtb2R1bG87XG5cdHJldHVybiBNYXRoLmZsb29yKHJlbWFpbiA+PSAwID8gcmVtYWluIDogcmVtYWluICsgbW9kdWxvKTtcbn07XG5cbn0se31dLDIyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2lnbihudW1iZXIpIHtcblx0cmV0dXJuIG51bWJlciA+PSAwID8gMSA6IC0xO1xufTtcblxufSx7fV0sMjM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG52YXIgaXNQcmltaXRpdmUgPSByZXF1aXJlKCcuL2hlbHBlcnMvaXNQcmltaXRpdmUnKTtcblxudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCdpcy1jYWxsYWJsZScpO1xuXG4vLyBodHRwczovL2VzNS5naXRodWIuaW8vI3g4LjEyXG52YXIgRVM1aW50ZXJuYWxTbG90cyA9IHtcblx0J1tbRGVmYXVsdFZhbHVlXV0nOiBmdW5jdGlvbiAoTywgaGludCkge1xuXHRcdHZhciBhY3R1YWxIaW50ID0gaGludCB8fCAodG9TdHIuY2FsbChPKSA9PT0gJ1tvYmplY3QgRGF0ZV0nID8gU3RyaW5nIDogTnVtYmVyKTtcblxuXHRcdGlmIChhY3R1YWxIaW50ID09PSBTdHJpbmcgfHwgYWN0dWFsSGludCA9PT0gTnVtYmVyKSB7XG5cdFx0XHR2YXIgbWV0aG9kcyA9IGFjdHVhbEhpbnQgPT09IFN0cmluZyA/IFsndG9TdHJpbmcnLCAndmFsdWVPZiddIDogWyd2YWx1ZU9mJywgJ3RvU3RyaW5nJ107XG5cdFx0XHR2YXIgdmFsdWUsIGk7XG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgbWV0aG9kcy5sZW5ndGg7ICsraSkge1xuXHRcdFx0XHRpZiAoaXNDYWxsYWJsZShPW21ldGhvZHNbaV1dKSkge1xuXHRcdFx0XHRcdHZhbHVlID0gT1ttZXRob2RzW2ldXSgpO1xuXHRcdFx0XHRcdGlmIChpc1ByaW1pdGl2ZSh2YWx1ZSkpIHtcblx0XHRcdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ05vIGRlZmF1bHQgdmFsdWUnKTtcblx0XHR9XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCBbW0RlZmF1bHRWYWx1ZV1dIGhpbnQgc3VwcGxpZWQnKTtcblx0fVxufTtcblxuLy8gaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBUb1ByaW1pdGl2ZShpbnB1dCwgUHJlZmVycmVkVHlwZSkge1xuXHRpZiAoaXNQcmltaXRpdmUoaW5wdXQpKSB7XG5cdFx0cmV0dXJuIGlucHV0O1xuXHR9XG5cdHJldHVybiBFUzVpbnRlcm5hbFNsb3RzWydbW0RlZmF1bHRWYWx1ZV1dJ10oaW5wdXQsIFByZWZlcnJlZFR5cGUpO1xufTtcblxufSx7XCIuL2hlbHBlcnMvaXNQcmltaXRpdmVcIjoyNSxcImlzLWNhbGxhYmxlXCI6Mjl9XSwyNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBoYXNTeW1ib2xzID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSAnc3ltYm9sJztcblxudmFyIGlzUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9oZWxwZXJzL2lzUHJpbWl0aXZlJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJ2lzLWNhbGxhYmxlJyk7XG52YXIgaXNEYXRlID0gcmVxdWlyZSgnaXMtZGF0ZS1vYmplY3QnKTtcbnZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJ2lzLXN5bWJvbCcpO1xuXG52YXIgb3JkaW5hcnlUb1ByaW1pdGl2ZSA9IGZ1bmN0aW9uIE9yZGluYXJ5VG9QcmltaXRpdmUoTywgaGludCkge1xuXHRpZiAodHlwZW9mIE8gPT09ICd1bmRlZmluZWQnIHx8IE8gPT09IG51bGwpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBtZXRob2Qgb24gJyArIE8pO1xuXHR9XG5cdGlmICh0eXBlb2YgaGludCAhPT0gJ3N0cmluZycgfHwgKGhpbnQgIT09ICdudW1iZXInICYmIGhpbnQgIT09ICdzdHJpbmcnKSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ2hpbnQgbXVzdCBiZSBcInN0cmluZ1wiIG9yIFwibnVtYmVyXCInKTtcblx0fVxuXHR2YXIgbWV0aG9kTmFtZXMgPSBoaW50ID09PSAnc3RyaW5nJyA/IFsndG9TdHJpbmcnLCAndmFsdWVPZiddIDogWyd2YWx1ZU9mJywgJ3RvU3RyaW5nJ107XG5cdHZhciBtZXRob2QsIHJlc3VsdCwgaTtcblx0Zm9yIChpID0gMDsgaSA8IG1ldGhvZE5hbWVzLmxlbmd0aDsgKytpKSB7XG5cdFx0bWV0aG9kID0gT1ttZXRob2ROYW1lc1tpXV07XG5cdFx0aWYgKGlzQ2FsbGFibGUobWV0aG9kKSkge1xuXHRcdFx0cmVzdWx0ID0gbWV0aG9kLmNhbGwoTyk7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUocmVzdWx0KSkge1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHR0aHJvdyBuZXcgVHlwZUVycm9yKCdObyBkZWZhdWx0IHZhbHVlJyk7XG59O1xuXG52YXIgR2V0TWV0aG9kID0gZnVuY3Rpb24gR2V0TWV0aG9kKE8sIFApIHtcblx0dmFyIGZ1bmMgPSBPW1BdO1xuXHRpZiAoZnVuYyAhPT0gbnVsbCAmJiB0eXBlb2YgZnVuYyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRpZiAoIWlzQ2FsbGFibGUoZnVuYykpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoZnVuYyArICcgcmV0dXJuZWQgZm9yIHByb3BlcnR5ICcgKyBQICsgJyBvZiBvYmplY3QgJyArIE8gKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG5cdFx0fVxuXHRcdHJldHVybiBmdW5jO1xuXHR9XG59O1xuXG4vLyBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtdG9wcmltaXRpdmVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gVG9QcmltaXRpdmUoaW5wdXQsIFByZWZlcnJlZFR5cGUpIHtcblx0aWYgKGlzUHJpbWl0aXZlKGlucHV0KSkge1xuXHRcdHJldHVybiBpbnB1dDtcblx0fVxuXHR2YXIgaGludCA9ICdkZWZhdWx0Jztcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdFx0aWYgKFByZWZlcnJlZFR5cGUgPT09IFN0cmluZykge1xuXHRcdFx0aGludCA9ICdzdHJpbmcnO1xuXHRcdH0gZWxzZSBpZiAoUHJlZmVycmVkVHlwZSA9PT0gTnVtYmVyKSB7XG5cdFx0XHRoaW50ID0gJ251bWJlcic7XG5cdFx0fVxuXHR9XG5cblx0dmFyIGV4b3RpY1RvUHJpbTtcblx0aWYgKGhhc1N5bWJvbHMpIHtcblx0XHRpZiAoU3ltYm9sLnRvUHJpbWl0aXZlKSB7XG5cdFx0XHRleG90aWNUb1ByaW0gPSBHZXRNZXRob2QoaW5wdXQsIFN5bWJvbC50b1ByaW1pdGl2ZSk7XG5cdFx0fSBlbHNlIGlmIChpc1N5bWJvbChpbnB1dCkpIHtcblx0XHRcdGV4b3RpY1RvUHJpbSA9IFN5bWJvbC5wcm90b3R5cGUudmFsdWVPZjtcblx0XHR9XG5cdH1cblx0aWYgKHR5cGVvZiBleG90aWNUb1ByaW0gIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0dmFyIHJlc3VsdCA9IGV4b3RpY1RvUHJpbS5jYWxsKGlucHV0LCBoaW50KTtcblx0XHRpZiAoaXNQcmltaXRpdmUocmVzdWx0KSkge1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcigndW5hYmxlIHRvIGNvbnZlcnQgZXhvdGljIG9iamVjdCB0byBwcmltaXRpdmUnKTtcblx0fVxuXHRpZiAoaGludCA9PT0gJ2RlZmF1bHQnICYmIChpc0RhdGUoaW5wdXQpIHx8IGlzU3ltYm9sKGlucHV0KSkpIHtcblx0XHRoaW50ID0gJ3N0cmluZyc7XG5cdH1cblx0cmV0dXJuIG9yZGluYXJ5VG9QcmltaXRpdmUoaW5wdXQsIGhpbnQgPT09ICdkZWZhdWx0JyA/ICdudW1iZXInIDogaGludCk7XG59O1xuXG59LHtcIi4vaGVscGVycy9pc1ByaW1pdGl2ZVwiOjI1LFwiaXMtY2FsbGFibGVcIjoyOSxcImlzLWRhdGUtb2JqZWN0XCI6MzAsXCJpcy1zeW1ib2xcIjozMn1dLDI1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyMF1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjIwfV0sMjY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXG52YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZm9yRWFjaCAob2JqLCBmbiwgY3R4KSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwoZm4pICE9PSAnW29iamVjdCBGdW5jdGlvbl0nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2l0ZXJhdG9yIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgIH1cbiAgICB2YXIgbCA9IG9iai5sZW5ndGg7XG4gICAgaWYgKGwgPT09ICtsKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBmbi5jYWxsKGN0eCwgb2JqW2ldLCBpLCBvYmopO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChvYmosIGspKSB7XG4gICAgICAgICAgICAgICAgZm4uY2FsbChjdHgsIG9ialtrXSwgaywgb2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxufSx7fV0sMjc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xudmFyIEVSUk9SX01FU1NBR0UgPSAnRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgY2FsbGVkIG9uIGluY29tcGF0aWJsZSAnO1xudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBmdW5jVHlwZSA9ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZCh0aGF0KSB7XG4gICAgdmFyIHRhcmdldCA9IHRoaXM7XG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgIT09ICdmdW5jdGlvbicgfHwgdG9TdHIuY2FsbCh0YXJnZXQpICE9PSBmdW5jVHlwZSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEVSUk9SX01FU1NBR0UgKyB0YXJnZXQpO1xuICAgIH1cbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIHZhciBib3VuZDtcbiAgICB2YXIgYmluZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGFyZ2V0LmFwcGx5KFxuICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChPYmplY3QocmVzdWx0KSA9PT0gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5hcHBseShcbiAgICAgICAgICAgICAgICB0aGF0LFxuICAgICAgICAgICAgICAgIGFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGJvdW5kTGVuZ3RoID0gTWF0aC5tYXgoMCwgdGFyZ2V0Lmxlbmd0aCAtIGFyZ3MubGVuZ3RoKTtcbiAgICB2YXIgYm91bmRBcmdzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBib3VuZExlbmd0aDsgaSsrKSB7XG4gICAgICAgIGJvdW5kQXJncy5wdXNoKCckJyArIGkpO1xuICAgIH1cblxuICAgIGJvdW5kID0gRnVuY3Rpb24oJ2JpbmRlcicsICdyZXR1cm4gZnVuY3Rpb24gKCcgKyBib3VuZEFyZ3Muam9pbignLCcpICsgJyl7IHJldHVybiBiaW5kZXIuYXBwbHkodGhpcyxhcmd1bWVudHMpOyB9JykoYmluZGVyKTtcblxuICAgIGlmICh0YXJnZXQucHJvdG90eXBlKSB7XG4gICAgICAgIHZhciBFbXB0eSA9IGZ1bmN0aW9uIEVtcHR5KCkge307XG4gICAgICAgIEVtcHR5LnByb3RvdHlwZSA9IHRhcmdldC5wcm90b3R5cGU7XG4gICAgICAgIGJvdW5kLnByb3RvdHlwZSA9IG5ldyBFbXB0eSgpO1xuICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBib3VuZDtcbn07XG5cbn0se31dLDI4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbnZhciBpbXBsZW1lbnRhdGlvbiA9IHJlcXVpcmUoJy4vaW1wbGVtZW50YXRpb24nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCB8fCBpbXBsZW1lbnRhdGlvbjtcblxufSx7XCIuL2ltcGxlbWVudGF0aW9uXCI6Mjd9XSwyOTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBmblRvU3RyID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xuXG52YXIgY29uc3RydWN0b3JSZWdleCA9IC9eXFxzKmNsYXNzIC87XG52YXIgaXNFUzZDbGFzc0ZuID0gZnVuY3Rpb24gaXNFUzZDbGFzc0ZuKHZhbHVlKSB7XG5cdHRyeSB7XG5cdFx0dmFyIGZuU3RyID0gZm5Ub1N0ci5jYWxsKHZhbHVlKTtcblx0XHR2YXIgc2luZ2xlU3RyaXBwZWQgPSBmblN0ci5yZXBsYWNlKC9cXC9cXC8uKlxcbi9nLCAnJyk7XG5cdFx0dmFyIG11bHRpU3RyaXBwZWQgPSBzaW5nbGVTdHJpcHBlZC5yZXBsYWNlKC9cXC9cXCpbLlxcc1xcU10qXFwqXFwvL2csICcnKTtcblx0XHR2YXIgc3BhY2VTdHJpcHBlZCA9IG11bHRpU3RyaXBwZWQucmVwbGFjZSgvXFxuL21nLCAnICcpLnJlcGxhY2UoLyB7Mn0vZywgJyAnKTtcblx0XHRyZXR1cm4gY29uc3RydWN0b3JSZWdleC50ZXN0KHNwYWNlU3RyaXBwZWQpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0cmV0dXJuIGZhbHNlOyAvLyBub3QgYSBmdW5jdGlvblxuXHR9XG59O1xuXG52YXIgdHJ5RnVuY3Rpb25PYmplY3QgPSBmdW5jdGlvbiB0cnlGdW5jdGlvbk9iamVjdCh2YWx1ZSkge1xuXHR0cnkge1xuXHRcdGlmIChpc0VTNkNsYXNzRm4odmFsdWUpKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdGZuVG9TdHIuY2FsbCh2YWx1ZSk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn07XG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIGZuQ2xhc3MgPSAnW29iamVjdCBGdW5jdGlvbl0nO1xudmFyIGdlbkNsYXNzID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJztcbnZhciBoYXNUb1N0cmluZ1RhZyA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyA9PT0gJ3N5bWJvbCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNDYWxsYWJsZSh2YWx1ZSkge1xuXHRpZiAoIXZhbHVlKSB7IHJldHVybiBmYWxzZTsgfVxuXHRpZiAodHlwZW9mIHZhbHVlICE9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdGlmIChoYXNUb1N0cmluZ1RhZykgeyByZXR1cm4gdHJ5RnVuY3Rpb25PYmplY3QodmFsdWUpOyB9XG5cdGlmIChpc0VTNkNsYXNzRm4odmFsdWUpKSB7IHJldHVybiBmYWxzZTsgfVxuXHR2YXIgc3RyQ2xhc3MgPSB0b1N0ci5jYWxsKHZhbHVlKTtcblx0cmV0dXJuIHN0ckNsYXNzID09PSBmbkNsYXNzIHx8IHN0ckNsYXNzID09PSBnZW5DbGFzcztcbn07XG5cbn0se31dLDMwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGdldERheSA9IERhdGUucHJvdG90eXBlLmdldERheTtcbnZhciB0cnlEYXRlT2JqZWN0ID0gZnVuY3Rpb24gdHJ5RGF0ZU9iamVjdCh2YWx1ZSkge1xuXHR0cnkge1xuXHRcdGdldERheS5jYWxsKHZhbHVlKTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufTtcblxudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBkYXRlQ2xhc3MgPSAnW29iamVjdCBEYXRlXSc7XG52YXIgaGFzVG9TdHJpbmdUYWcgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzRGF0ZU9iamVjdCh2YWx1ZSkge1xuXHRpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyB8fCB2YWx1ZSA9PT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cblx0cmV0dXJuIGhhc1RvU3RyaW5nVGFnID8gdHJ5RGF0ZU9iamVjdCh2YWx1ZSkgOiB0b1N0ci5jYWxsKHZhbHVlKSA9PT0gZGF0ZUNsYXNzO1xufTtcblxufSx7fV0sMzE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmVnZXhFeGVjID0gUmVnRXhwLnByb3RvdHlwZS5leGVjO1xudmFyIHRyeVJlZ2V4RXhlYyA9IGZ1bmN0aW9uIHRyeVJlZ2V4RXhlYyh2YWx1ZSkge1xuXHR0cnkge1xuXHRcdHJlZ2V4RXhlYy5jYWxsKHZhbHVlKTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufTtcbnZhciB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgcmVnZXhDbGFzcyA9ICdbb2JqZWN0IFJlZ0V4cF0nO1xudmFyIGhhc1RvU3RyaW5nVGFnID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1JlZ2V4KHZhbHVlKSB7XG5cdGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7IHJldHVybiBmYWxzZTsgfVxuXHRyZXR1cm4gaGFzVG9TdHJpbmdUYWcgPyB0cnlSZWdleEV4ZWModmFsdWUpIDogdG9TdHIuY2FsbCh2YWx1ZSkgPT09IHJlZ2V4Q2xhc3M7XG59O1xuXG59LHt9XSwzMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgaGFzU3ltYm9scyA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIFN5bWJvbCgpID09PSAnc3ltYm9sJztcblxuaWYgKGhhc1N5bWJvbHMpIHtcblx0dmFyIHN5bVRvU3RyID0gU3ltYm9sLnByb3RvdHlwZS50b1N0cmluZztcblx0dmFyIHN5bVN0cmluZ1JlZ2V4ID0gL15TeW1ib2xcXCguKlxcKSQvO1xuXHR2YXIgaXNTeW1ib2xPYmplY3QgPSBmdW5jdGlvbiBpc1N5bWJvbE9iamVjdCh2YWx1ZSkge1xuXHRcdGlmICh0eXBlb2YgdmFsdWUudmFsdWVPZigpICE9PSAnc3ltYm9sJykgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRyZXR1cm4gc3ltU3RyaW5nUmVnZXgudGVzdChzeW1Ub1N0ci5jYWxsKHZhbHVlKSk7XG5cdH07XG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJykgeyByZXR1cm4gdHJ1ZTsgfVxuXHRcdGlmICh0b1N0ci5jYWxsKHZhbHVlKSAhPT0gJ1tvYmplY3QgU3ltYm9sXScpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiBpc1N5bWJvbE9iamVjdCh2YWx1ZSk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fTtcbn0gZWxzZSB7XG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcblx0XHQvLyB0aGlzIGVudmlyb25tZW50IGRvZXMgbm90IHN1cHBvcnQgU3ltYm9scy5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG59XG5cbn0se31dLDMzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuLy8gbW9kaWZpZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW1cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbnZhciBpc0FyZ3MgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyk7XG52YXIgaGFzRG9udEVudW1CdWcgPSAhKHsgdG9TdHJpbmc6IG51bGwgfSkucHJvcGVydHlJc0VudW1lcmFibGUoJ3RvU3RyaW5nJyk7XG52YXIgaGFzUHJvdG9FbnVtQnVnID0gZnVuY3Rpb24gKCkge30ucHJvcGVydHlJc0VudW1lcmFibGUoJ3Byb3RvdHlwZScpO1xudmFyIGRvbnRFbnVtcyA9IFtcblx0J3RvU3RyaW5nJyxcblx0J3RvTG9jYWxlU3RyaW5nJyxcblx0J3ZhbHVlT2YnLFxuXHQnaGFzT3duUHJvcGVydHknLFxuXHQnaXNQcm90b3R5cGVPZicsXG5cdCdwcm9wZXJ0eUlzRW51bWVyYWJsZScsXG5cdCdjb25zdHJ1Y3Rvcidcbl07XG52YXIgZXF1YWxzQ29uc3RydWN0b3JQcm90b3R5cGUgPSBmdW5jdGlvbiAobykge1xuXHR2YXIgY3RvciA9IG8uY29uc3RydWN0b3I7XG5cdHJldHVybiBjdG9yICYmIGN0b3IucHJvdG90eXBlID09PSBvO1xufTtcbnZhciBibGFja2xpc3RlZEtleXMgPSB7XG5cdCRjb25zb2xlOiB0cnVlLFxuXHQkZnJhbWU6IHRydWUsXG5cdCRmcmFtZUVsZW1lbnQ6IHRydWUsXG5cdCRmcmFtZXM6IHRydWUsXG5cdCRwYXJlbnQ6IHRydWUsXG5cdCRzZWxmOiB0cnVlLFxuXHQkd2Via2l0SW5kZXhlZERCOiB0cnVlLFxuXHQkd2Via2l0U3RvcmFnZUluZm86IHRydWUsXG5cdCR3aW5kb3c6IHRydWVcbn07XG52YXIgaGFzQXV0b21hdGlvbkVxdWFsaXR5QnVnID0gKGZ1bmN0aW9uICgpIHtcblx0LyogZ2xvYmFsIHdpbmRvdyAqL1xuXHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdGZvciAodmFyIGsgaW4gd2luZG93KSB7XG5cdFx0dHJ5IHtcblx0XHRcdGlmICghYmxhY2tsaXN0ZWRLZXlzWyckJyArIGtdICYmIGhhcy5jYWxsKHdpbmRvdywgaykgJiYgd2luZG93W2tdICE9PSBudWxsICYmIHR5cGVvZiB3aW5kb3dba10gPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZXF1YWxzQ29uc3RydWN0b3JQcm90b3R5cGUod2luZG93W2tdKTtcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBmYWxzZTtcbn0oKSk7XG52YXIgZXF1YWxzQ29uc3RydWN0b3JQcm90b3R5cGVJZk5vdEJ1Z2d5ID0gZnVuY3Rpb24gKG8pIHtcblx0LyogZ2xvYmFsIHdpbmRvdyAqL1xuXHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgfHwgIWhhc0F1dG9tYXRpb25FcXVhbGl0eUJ1Zykge1xuXHRcdHJldHVybiBlcXVhbHNDb25zdHJ1Y3RvclByb3RvdHlwZShvKTtcblx0fVxuXHR0cnkge1xuXHRcdHJldHVybiBlcXVhbHNDb25zdHJ1Y3RvclByb3RvdHlwZShvKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufTtcblxudmFyIGtleXNTaGltID0gZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcblx0dmFyIGlzT2JqZWN0ID0gb2JqZWN0ICE9PSBudWxsICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnO1xuXHR2YXIgaXNGdW5jdGlvbiA9IHRvU3RyLmNhbGwob2JqZWN0KSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblx0dmFyIGlzQXJndW1lbnRzID0gaXNBcmdzKG9iamVjdCk7XG5cdHZhciBpc1N0cmluZyA9IGlzT2JqZWN0ICYmIHRvU3RyLmNhbGwob2JqZWN0KSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XG5cdHZhciB0aGVLZXlzID0gW107XG5cblx0aWYgKCFpc09iamVjdCAmJiAhaXNGdW5jdGlvbiAmJiAhaXNBcmd1bWVudHMpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3Qua2V5cyBjYWxsZWQgb24gYSBub24tb2JqZWN0Jyk7XG5cdH1cblxuXHR2YXIgc2tpcFByb3RvID0gaGFzUHJvdG9FbnVtQnVnICYmIGlzRnVuY3Rpb247XG5cdGlmIChpc1N0cmluZyAmJiBvYmplY3QubGVuZ3RoID4gMCAmJiAhaGFzLmNhbGwob2JqZWN0LCAwKSkge1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgb2JqZWN0Lmxlbmd0aDsgKytpKSB7XG5cdFx0XHR0aGVLZXlzLnB1c2goU3RyaW5nKGkpKTtcblx0XHR9XG5cdH1cblxuXHRpZiAoaXNBcmd1bWVudHMgJiYgb2JqZWN0Lmxlbmd0aCA+IDApIHtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IG9iamVjdC5sZW5ndGg7ICsraikge1xuXHRcdFx0dGhlS2V5cy5wdXNoKFN0cmluZyhqKSk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGZvciAodmFyIG5hbWUgaW4gb2JqZWN0KSB7XG5cdFx0XHRpZiAoIShza2lwUHJvdG8gJiYgbmFtZSA9PT0gJ3Byb3RvdHlwZScpICYmIGhhcy5jYWxsKG9iamVjdCwgbmFtZSkpIHtcblx0XHRcdFx0dGhlS2V5cy5wdXNoKFN0cmluZyhuYW1lKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYgKGhhc0RvbnRFbnVtQnVnKSB7XG5cdFx0dmFyIHNraXBDb25zdHJ1Y3RvciA9IGVxdWFsc0NvbnN0cnVjdG9yUHJvdG90eXBlSWZOb3RCdWdneShvYmplY3QpO1xuXG5cdFx0Zm9yICh2YXIgayA9IDA7IGsgPCBkb250RW51bXMubGVuZ3RoOyArK2spIHtcblx0XHRcdGlmICghKHNraXBDb25zdHJ1Y3RvciAmJiBkb250RW51bXNba10gPT09ICdjb25zdHJ1Y3RvcicpICYmIGhhcy5jYWxsKG9iamVjdCwgZG9udEVudW1zW2tdKSkge1xuXHRcdFx0XHR0aGVLZXlzLnB1c2goZG9udEVudW1zW2tdKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIHRoZUtleXM7XG59O1xuXG5rZXlzU2hpbS5zaGltID0gZnVuY3Rpb24gc2hpbU9iamVjdEtleXMoKSB7XG5cdGlmIChPYmplY3Qua2V5cykge1xuXHRcdHZhciBrZXlzV29ya3NXaXRoQXJndW1lbnRzID0gKGZ1bmN0aW9uICgpIHtcblx0XHRcdC8vIFNhZmFyaSA1LjAgYnVnXG5cdFx0XHRyZXR1cm4gKE9iamVjdC5rZXlzKGFyZ3VtZW50cykgfHwgJycpLmxlbmd0aCA9PT0gMjtcblx0XHR9KDEsIDIpKTtcblx0XHRpZiAoIWtleXNXb3Jrc1dpdGhBcmd1bWVudHMpIHtcblx0XHRcdHZhciBvcmlnaW5hbEtleXMgPSBPYmplY3Qua2V5cztcblx0XHRcdE9iamVjdC5rZXlzID0gZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcblx0XHRcdFx0aWYgKGlzQXJncyhvYmplY3QpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9yaWdpbmFsS2V5cyhzbGljZS5jYWxsKG9iamVjdCkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBvcmlnaW5hbEtleXMob2JqZWN0KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0T2JqZWN0LmtleXMgPSBrZXlzU2hpbTtcblx0fVxuXHRyZXR1cm4gT2JqZWN0LmtleXMgfHwga2V5c1NoaW07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXNTaGltO1xuXG59LHtcIi4vaXNBcmd1bWVudHNcIjozNH1dLDM0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuXHR2YXIgc3RyID0gdG9TdHIuY2FsbCh2YWx1ZSk7XG5cdHZhciBpc0FyZ3MgPSBzdHIgPT09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXHRpZiAoIWlzQXJncykge1xuXHRcdGlzQXJncyA9IHN0ciAhPT0gJ1tvYmplY3QgQXJyYXldJyAmJlxuXHRcdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHRcdHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICdudW1iZXInICYmXG5cdFx0XHR2YWx1ZS5sZW5ndGggPj0gMCAmJlxuXHRcdFx0dG9TdHIuY2FsbCh2YWx1ZS5jYWxsZWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuXHR9XG5cdHJldHVybiBpc0FyZ3M7XG59O1xuXG59LHt9XSwzNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBpbXBsZW1lbnRhdGlvbiA9IHJlcXVpcmUoJy4vaW1wbGVtZW50YXRpb24nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRQb2x5ZmlsbCgpIHtcblx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5pbmNsdWRlcyB8fCBpbXBsZW1lbnRhdGlvbjtcbn07XG5cbn0se1wiLi9pbXBsZW1lbnRhdGlvblwiOjEzfV0sMzY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGVmaW5lID0gcmVxdWlyZSgnZGVmaW5lLXByb3BlcnRpZXMnKTtcbnZhciBnZXRQb2x5ZmlsbCA9IHJlcXVpcmUoJy4vcG9seWZpbGwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzaGltQXJyYXlQcm90b3R5cGVJbmNsdWRlcygpIHtcblx0dmFyIHBvbHlmaWxsID0gZ2V0UG9seWZpbGwoKTtcblx0aWYgKEFycmF5LnByb3RvdHlwZS5pbmNsdWRlcyAhPT0gcG9seWZpbGwpIHtcblx0XHRkZWZpbmUoQXJyYXkucHJvdG90eXBlLCB7IGluY2x1ZGVzOiBwb2x5ZmlsbCB9KTtcblx0fVxuXHRyZXR1cm4gcG9seWZpbGw7XG59O1xuXG59LHtcIi4vcG9seWZpbGxcIjozNSxcImRlZmluZS1wcm9wZXJ0aWVzXCI6MTV9XSwzNzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBFUyA9IHJlcXVpcmUoJ2VzLWFic3RyYWN0L2VzNycpO1xudmFyIGhhcyA9IHJlcXVpcmUoJ2hhcycpO1xudmFyIGJpbmQgPSByZXF1aXJlKCdmdW5jdGlvbi1iaW5kJyk7XG52YXIgaXNFbnVtZXJhYmxlID0gYmluZC5jYWxsKEZ1bmN0aW9uLmNhbGwsIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVudHJpZXMoTykge1xuXHR2YXIgb2JqID0gRVMuUmVxdWlyZU9iamVjdENvZXJjaWJsZShPKTtcblx0dmFyIGVudHJ5cyA9IFtdO1xuXHRmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG5cdFx0aWYgKGhhcyhvYmosIGtleSkgJiYgaXNFbnVtZXJhYmxlKG9iaiwga2V5KSkge1xuXHRcdFx0ZW50cnlzLnB1c2goW2tleSwgb2JqW2tleV1dKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGVudHJ5cztcbn07XG5cbn0se1wiZXMtYWJzdHJhY3QvZXM3XCI6NDIsXCJmdW5jdGlvbi1iaW5kXCI6NTMsXCJoYXNcIjo1NH1dLDM4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGRlZmluZSA9IHJlcXVpcmUoJ2RlZmluZS1wcm9wZXJ0aWVzJyk7XG5cbnZhciBpbXBsZW1lbnRhdGlvbiA9IHJlcXVpcmUoJy4vaW1wbGVtZW50YXRpb24nKTtcbnZhciBnZXRQb2x5ZmlsbCA9IHJlcXVpcmUoJy4vcG9seWZpbGwnKTtcbnZhciBzaGltID0gcmVxdWlyZSgnLi9zaGltJyk7XG5cbmRlZmluZShpbXBsZW1lbnRhdGlvbiwge1xuXHRnZXRQb2x5ZmlsbDogZ2V0UG9seWZpbGwsXG5cdGltcGxlbWVudGF0aW9uOiBpbXBsZW1lbnRhdGlvbixcblx0c2hpbTogc2hpbVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gaW1wbGVtZW50YXRpb247XG5cbn0se1wiLi9pbXBsZW1lbnRhdGlvblwiOjM3LFwiLi9wb2x5ZmlsbFwiOjYxLFwiLi9zaGltXCI6NjIsXCJkZWZpbmUtcHJvcGVydGllc1wiOjM5fV0sMzk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzE1XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MTUsXCJmb3JlYWNoXCI6NTEsXCJvYmplY3Qta2V5c1wiOjU5fV0sNDA6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzE2XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiLi9oZWxwZXJzL2lzRmluaXRlXCI6NDQsXCIuL2hlbHBlcnMvbW9kXCI6NDYsXCIuL2hlbHBlcnMvc2lnblwiOjQ3LFwiZHVwXCI6MTYsXCJlcy10by1wcmltaXRpdmUvZXM1XCI6NDgsXCJpcy1jYWxsYWJsZVwiOjU1fV0sNDE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzE3XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiLi9lczVcIjo0MCxcIi4vaGVscGVycy9hc3NpZ25cIjo0MyxcIi4vaGVscGVycy9pc0Zpbml0ZVwiOjQ0LFwiLi9oZWxwZXJzL2lzUHJpbWl0aXZlXCI6NDUsXCIuL2hlbHBlcnMvbW9kXCI6NDYsXCIuL2hlbHBlcnMvc2lnblwiOjQ3LFwiZHVwXCI6MTcsXCJlcy10by1wcmltaXRpdmUvZXM2XCI6NDksXCJmdW5jdGlvbi1iaW5kXCI6NTMsXCJpcy1yZWdleFwiOjU3fV0sNDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRVM2ID0gcmVxdWlyZSgnLi9lczYnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuL2hlbHBlcnMvYXNzaWduJyk7XG5cbnZhciBFUzcgPSBhc3NpZ24oRVM2LCB7XG5cdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L2VjbWEyNjIvcHVsbC82MFxuXHRTYW1lVmFsdWVOb25OdW1iZXI6IGZ1bmN0aW9uIFNhbWVWYWx1ZU5vbk51bWJlcih4LCB5KSB7XG5cdFx0aWYgKHR5cGVvZiB4ID09PSAnbnVtYmVyJyB8fCB0eXBlb2YgeCAhPT0gdHlwZW9mIHkpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1NhbWVWYWx1ZU5vbk51bWJlciByZXF1aXJlcyB0d28gbm9uLW51bWJlciB2YWx1ZXMgb2YgdGhlIHNhbWUgdHlwZS4nKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuU2FtZVZhbHVlKHgsIHkpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBFUzc7XG5cbn0se1wiLi9lczZcIjo0MSxcIi4vaGVscGVycy9hc3NpZ25cIjo0M31dLDQzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsxOF1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjE4fV0sNDQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzE5XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MTl9XSw0NTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMjBdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjoyMH1dLDQ2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyMV1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjIxfV0sNDc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzIyXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MjJ9XSw0ODpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMjNdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCIuL2hlbHBlcnMvaXNQcmltaXRpdmVcIjo1MCxcImR1cFwiOjIzLFwiaXMtY2FsbGFibGVcIjo1NX1dLDQ5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyNF1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcIi4vaGVscGVycy9pc1ByaW1pdGl2ZVwiOjUwLFwiZHVwXCI6MjQsXCJpcy1jYWxsYWJsZVwiOjU1LFwiaXMtZGF0ZS1vYmplY3RcIjo1NixcImlzLXN5bWJvbFwiOjU4fV0sNTA6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzIwXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MjB9XSw1MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMjZdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjoyNn1dLDUyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyN11bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjI3fV0sNTM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzI4XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiLi9pbXBsZW1lbnRhdGlvblwiOjUyLFwiZHVwXCI6Mjh9XSw1NDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG52YXIgYmluZCA9IHJlcXVpcmUoJ2Z1bmN0aW9uLWJpbmQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiaW5kLmNhbGwoRnVuY3Rpb24uY2FsbCwgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSk7XG5cbn0se1wiZnVuY3Rpb24tYmluZFwiOjUzfV0sNTU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzI5XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6Mjl9XSw1NjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMzBdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjozMH1dLDU3OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVszMV1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjMxfV0sNTg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzMyXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MzJ9XSw1OTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMzNdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCIuL2lzQXJndW1lbnRzXCI6NjAsXCJkdXBcIjozM31dLDYwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVszNF1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjM0fV0sNjE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW1wbGVtZW50YXRpb24gPSByZXF1aXJlKCcuL2ltcGxlbWVudGF0aW9uJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0UG9seWZpbGwoKSB7XG5cdHJldHVybiB0eXBlb2YgT2JqZWN0LmVudHJpZXMgPT09ICdmdW5jdGlvbicgPyBPYmplY3QuZW50cmllcyA6IGltcGxlbWVudGF0aW9uO1xufTtcblxufSx7XCIuL2ltcGxlbWVudGF0aW9uXCI6Mzd9XSw2MjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBnZXRQb2x5ZmlsbCA9IHJlcXVpcmUoJy4vcG9seWZpbGwnKTtcbnZhciBkZWZpbmUgPSByZXF1aXJlKCdkZWZpbmUtcHJvcGVydGllcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNoaW1FbnRyaWVzKCkge1xuXHR2YXIgcG9seWZpbGwgPSBnZXRQb2x5ZmlsbCgpO1xuXHRkZWZpbmUoT2JqZWN0LCB7IGVudHJpZXM6IHBvbHlmaWxsIH0sIHsgZW50cmllczogZnVuY3Rpb24gKCkgeyByZXR1cm4gT2JqZWN0LmVudHJpZXMgIT09IHBvbHlmaWxsOyB9IH0pO1xuXHRyZXR1cm4gcG9seWZpbGw7XG59O1xuXG59LHtcIi4vcG9seWZpbGxcIjo2MSxcImRlZmluZS1wcm9wZXJ0aWVzXCI6Mzl9XSw2MzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBFUyA9IHJlcXVpcmUoJ2VzLWFic3RyYWN0L2VzNycpO1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG52YXIgZ2V0RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG52YXIgZ2V0T3duTmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcztcbnZhciBnZXRTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBjb25jYXQgPSBGdW5jdGlvbi5jYWxsLmJpbmQoQXJyYXkucHJvdG90eXBlLmNvbmNhdCk7XG52YXIgcmVkdWNlID0gRnVuY3Rpb24uY2FsbC5iaW5kKEFycmF5LnByb3RvdHlwZS5yZWR1Y2UpO1xudmFyIGdldEFsbCA9IGdldFN5bWJvbHMgPyBmdW5jdGlvbiAob2JqKSB7XG5cdHJldHVybiBjb25jYXQoZ2V0T3duTmFtZXMob2JqKSwgZ2V0U3ltYm9scyhvYmopKTtcbn0gOiBnZXRPd25OYW1lcztcblxudmFyIGlzRVM1ID0gRVMuSXNDYWxsYWJsZShnZXREZXNjcmlwdG9yKSAmJiBFUy5Jc0NhbGxhYmxlKGdldE93bk5hbWVzKTtcblxudmFyIHNhZmVQdXQgPSBmdW5jdGlvbiBwdXQob2JqLCBwcm9wLCB2YWwpIHtcblx0aWYgKGRlZmluZVByb3BlcnR5ICYmIHByb3AgaW4gb2JqKSB7XG5cdFx0ZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCB7XG5cdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0dmFsdWU6IHZhbCxcblx0XHRcdHdyaXRhYmxlOiB0cnVlXG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0b2JqW3Byb3BdID0gdmFsO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcnModmFsdWUpIHtcblx0RVMuUmVxdWlyZU9iamVjdENvZXJjaWJsZSh2YWx1ZSk7XG5cdGlmICghaXNFUzUpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyByZXF1aXJlcyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJyk7IH1cblxuXHR2YXIgTyA9IEVTLlRvT2JqZWN0KHZhbHVlKTtcblx0cmV0dXJuIHJlZHVjZShnZXRBbGwoTyksIGZ1bmN0aW9uIChhY2MsIGtleSkge1xuXHRcdHNhZmVQdXQoYWNjLCBrZXksIGdldERlc2NyaXB0b3IoTywga2V5KSk7XG5cdFx0cmV0dXJuIGFjYztcblx0fSwge30pO1xufTtcblxufSx7XCJlcy1hYnN0cmFjdC9lczdcIjo2OH1dLDY0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVszOF1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcIi4vaW1wbGVtZW50YXRpb25cIjo2MyxcIi4vcG9seWZpbGxcIjo4NixcIi4vc2hpbVwiOjg3LFwiZGVmaW5lLXByb3BlcnRpZXNcIjo2NSxcImR1cFwiOjM4fV0sNjU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzE1XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MTUsXCJmb3JlYWNoXCI6NzcsXCJvYmplY3Qta2V5c1wiOjg0fV0sNjY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzE2XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiLi9oZWxwZXJzL2lzRmluaXRlXCI6NzAsXCIuL2hlbHBlcnMvbW9kXCI6NzIsXCIuL2hlbHBlcnMvc2lnblwiOjczLFwiZHVwXCI6MTYsXCJlcy10by1wcmltaXRpdmUvZXM1XCI6NzQsXCJpcy1jYWxsYWJsZVwiOjgwfV0sNjc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzE3XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiLi9lczVcIjo2NixcIi4vaGVscGVycy9hc3NpZ25cIjo2OSxcIi4vaGVscGVycy9pc0Zpbml0ZVwiOjcwLFwiLi9oZWxwZXJzL2lzUHJpbWl0aXZlXCI6NzEsXCIuL2hlbHBlcnMvbW9kXCI6NzIsXCIuL2hlbHBlcnMvc2lnblwiOjczLFwiZHVwXCI6MTcsXCJlcy10by1wcmltaXRpdmUvZXM2XCI6NzUsXCJmdW5jdGlvbi1iaW5kXCI6NzksXCJpcy1yZWdleFwiOjgyfV0sNjg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzQyXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiLi9lczZcIjo2NyxcIi4vaGVscGVycy9hc3NpZ25cIjo2OSxcImR1cFwiOjQyfV0sNjk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzE4XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MTh9XSw3MDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMTldWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjoxOX1dLDcxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyMF1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjIwfV0sNzI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzIxXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MjF9XSw3MzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMjJdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjoyMn1dLDc0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyM11bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcIi4vaGVscGVycy9pc1ByaW1pdGl2ZVwiOjc2LFwiZHVwXCI6MjMsXCJpcy1jYWxsYWJsZVwiOjgwfV0sNzU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzI0XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiLi9oZWxwZXJzL2lzUHJpbWl0aXZlXCI6NzYsXCJkdXBcIjoyNCxcImlzLWNhbGxhYmxlXCI6ODAsXCJpcy1kYXRlLW9iamVjdFwiOjgxLFwiaXMtc3ltYm9sXCI6ODN9XSw3NjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMjBdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjoyMH1dLDc3OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyNl1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjI2fV0sNzg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzI3XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6Mjd9XSw3OTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMjhdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCIuL2ltcGxlbWVudGF0aW9uXCI6NzgsXCJkdXBcIjoyOH1dLDgwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyOV1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjI5fV0sODE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzMwXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MzB9XSw4MjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMzFdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjozMX1dLDgzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVszMl1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjMyfV0sODQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzMzXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiLi9pc0FyZ3VtZW50c1wiOjg1LFwiZHVwXCI6MzN9XSw4NTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMzRdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjozNH1dLDg2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGltcGxlbWVudGF0aW9uID0gcmVxdWlyZSgnLi9pbXBsZW1lbnRhdGlvbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFBvbHlmaWxsKCkge1xuXHRyZXR1cm4gdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzID09PSAnZnVuY3Rpb24nID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMgOiBpbXBsZW1lbnRhdGlvbjtcbn07XG5cbn0se1wiLi9pbXBsZW1lbnRhdGlvblwiOjYzfV0sODc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2V0UG9seWZpbGwgPSByZXF1aXJlKCcuL3BvbHlmaWxsJyk7XG52YXIgZGVmaW5lID0gcmVxdWlyZSgnZGVmaW5lLXByb3BlcnRpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzaGltR2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycygpIHtcblx0dmFyIHBvbHlmaWxsID0gZ2V0UG9seWZpbGwoKTtcblx0ZGVmaW5lKE9iamVjdCwgeyBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzOiBwb2x5ZmlsbCB9LCB7XG5cdFx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yczogZnVuY3Rpb24gKCkgeyByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMgIT09IHBvbHlmaWxsOyB9XG5cdH0pO1xuXHRyZXR1cm4gcG9seWZpbGw7XG59O1xuXG59LHtcIi4vcG9seWZpbGxcIjo4NixcImRlZmluZS1wcm9wZXJ0aWVzXCI6NjV9XSw4ODpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBFUyA9IHJlcXVpcmUoJ2VzLWFic3RyYWN0L2VzNycpO1xudmFyIGhhcyA9IHJlcXVpcmUoJ2hhcycpO1xudmFyIGJpbmQgPSByZXF1aXJlKCdmdW5jdGlvbi1iaW5kJyk7XG52YXIgaXNFbnVtZXJhYmxlID0gYmluZC5jYWxsKEZ1bmN0aW9uLmNhbGwsIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHZhbHVlcyhPKSB7XG5cdHZhciBvYmogPSBFUy5SZXF1aXJlT2JqZWN0Q29lcmNpYmxlKE8pO1xuXHR2YXIgdmFscyA9IFtdO1xuXHRmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG5cdFx0aWYgKGhhcyhvYmosIGtleSkgJiYgaXNFbnVtZXJhYmxlKG9iaiwga2V5KSkge1xuXHRcdFx0dmFscy5wdXNoKG9ialtrZXldKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHZhbHM7XG59O1xuXG59LHtcImVzLWFic3RyYWN0L2VzN1wiOjkzLFwiZnVuY3Rpb24tYmluZFwiOjEwNCxcImhhc1wiOjEwNX1dLDg5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVszOF1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcIi4vaW1wbGVtZW50YXRpb25cIjo4OCxcIi4vcG9seWZpbGxcIjoxMTIsXCIuL3NoaW1cIjoxMTMsXCJkZWZpbmUtcHJvcGVydGllc1wiOjkwLFwiZHVwXCI6Mzh9XSw5MDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMTVdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjoxNSxcImZvcmVhY2hcIjoxMDIsXCJvYmplY3Qta2V5c1wiOjExMH1dLDkxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsxNl1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcIi4vaGVscGVycy9pc0Zpbml0ZVwiOjk1LFwiLi9oZWxwZXJzL21vZFwiOjk3LFwiLi9oZWxwZXJzL3NpZ25cIjo5OCxcImR1cFwiOjE2LFwiZXMtdG8tcHJpbWl0aXZlL2VzNVwiOjk5LFwiaXMtY2FsbGFibGVcIjoxMDZ9XSw5MjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMTddWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCIuL2VzNVwiOjkxLFwiLi9oZWxwZXJzL2Fzc2lnblwiOjk0LFwiLi9oZWxwZXJzL2lzRmluaXRlXCI6OTUsXCIuL2hlbHBlcnMvaXNQcmltaXRpdmVcIjo5NixcIi4vaGVscGVycy9tb2RcIjo5NyxcIi4vaGVscGVycy9zaWduXCI6OTgsXCJkdXBcIjoxNyxcImVzLXRvLXByaW1pdGl2ZS9lczZcIjoxMDAsXCJmdW5jdGlvbi1iaW5kXCI6MTA0LFwiaXMtcmVnZXhcIjoxMDh9XSw5MzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bNDJdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCIuL2VzNlwiOjkyLFwiLi9oZWxwZXJzL2Fzc2lnblwiOjk0LFwiZHVwXCI6NDJ9XSw5NDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMThdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjoxOH1dLDk1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsxOV1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjE5fV0sOTY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzIwXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MjB9XSw5NzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMjFdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjoyMX1dLDk4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyMl1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjIyfV0sOTk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzIzXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiLi9oZWxwZXJzL2lzUHJpbWl0aXZlXCI6MTAxLFwiZHVwXCI6MjMsXCJpcy1jYWxsYWJsZVwiOjEwNn1dLDEwMDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMjRdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCIuL2hlbHBlcnMvaXNQcmltaXRpdmVcIjoxMDEsXCJkdXBcIjoyNCxcImlzLWNhbGxhYmxlXCI6MTA2LFwiaXMtZGF0ZS1vYmplY3RcIjoxMDcsXCJpcy1zeW1ib2xcIjoxMDl9XSwxMDE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzIwXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MjB9XSwxMDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzI2XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MjZ9XSwxMDM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzI3XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6Mjd9XSwxMDQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzI4XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiLi9pbXBsZW1lbnRhdGlvblwiOjEwMyxcImR1cFwiOjI4fV0sMTA1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVs1NF1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjU0LFwiZnVuY3Rpb24tYmluZFwiOjEwNH1dLDEwNjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMjldWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjoyOX1dLDEwNzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMzBdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjozMH1dLDEwODpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMzFdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjozMX1dLDEwOTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMzJdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjozMn1dLDExMDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMzNdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCIuL2lzQXJndW1lbnRzXCI6MTExLFwiZHVwXCI6MzN9XSwxMTE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzM0XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MzR9XSwxMTI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW1wbGVtZW50YXRpb24gPSByZXF1aXJlKCcuL2ltcGxlbWVudGF0aW9uJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0UG9seWZpbGwoKSB7XG5cdHJldHVybiB0eXBlb2YgT2JqZWN0LnZhbHVlcyA9PT0gJ2Z1bmN0aW9uJyA/IE9iamVjdC52YWx1ZXMgOiBpbXBsZW1lbnRhdGlvbjtcbn07XG5cbn0se1wiLi9pbXBsZW1lbnRhdGlvblwiOjg4fV0sMTEzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGdldFBvbHlmaWxsID0gcmVxdWlyZSgnLi9wb2x5ZmlsbCcpO1xudmFyIGRlZmluZSA9IHJlcXVpcmUoJ2RlZmluZS1wcm9wZXJ0aWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2hpbVZhbHVlcygpIHtcblx0dmFyIHBvbHlmaWxsID0gZ2V0UG9seWZpbGwoKTtcblx0ZGVmaW5lKE9iamVjdCwgeyB2YWx1ZXM6IHBvbHlmaWxsIH0sIHsgdmFsdWVzOiBmdW5jdGlvbiAoKSB7IHJldHVybiBPYmplY3QudmFsdWVzICE9PSBwb2x5ZmlsbDsgfSB9KTtcblx0cmV0dXJuIHBvbHlmaWxsO1xufTtcblxufSx7XCIuL3BvbHlmaWxsXCI6MTEyLFwiZGVmaW5lLXByb3BlcnRpZXNcIjo5MH1dLDExNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBkZWZpbmUgPSByZXF1aXJlKCdkZWZpbmUtcHJvcGVydGllcycpO1xudmFyIEVTID0gcmVxdWlyZSgnZXMtYWJzdHJhY3QvZXM3Jyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJ2Z1bmN0aW9uLWJpbmQnKTtcblxudmFyIGF0U2hpbSA9IGZ1bmN0aW9uIGF0KHBvcykge1xuXHRFUy5SZXF1aXJlT2JqZWN0Q29lcmNpYmxlKHRoaXMpO1xuXHR2YXIgTyA9IEVTLlRvT2JqZWN0KHRoaXMpO1xuXHR2YXIgUyA9IEVTLlRvU3RyaW5nKE8pO1xuXHR2YXIgcG9zaXRpb24gPSBFUy5Ub0ludGVnZXIocG9zKTtcblx0dmFyIHNpemUgPSBTLmxlbmd0aDtcblx0aWYgKHBvc2l0aW9uIDwgMCB8fCBwb3NpdGlvbiA+PSBzaXplKSB7XG5cdFx0cmV0dXJuICcnO1xuXHR9XG5cdC8vIEdldCB0aGUgZmlyc3QgY29kZSB1bml0IGFuZCBjb2RlIHVuaXQgdmFsdWVcblx0dmFyIGN1Rmlyc3QgPSBTLmNoYXJDb2RlQXQocG9zaXRpb24pO1xuXHR2YXIgY3VTZWNvbmQ7XG5cdHZhciBuZXh0SW5kZXggPSBwb3NpdGlvbiArIDE7XG5cdHZhciBsZW4gPSAxO1xuXHQvLyBDaGVjayBpZiBpdOKAmXMgdGhlIHN0YXJ0IG9mIGEgc3Vycm9nYXRlIHBhaXIuXG5cdHZhciBpc0hpZ2hTdXJyb2dhdGUgPSBjdUZpcnN0ID49IDB4RDgwMCAmJiBjdUZpcnN0IDw9IDB4REJGRjtcblx0aWYgKGlzSGlnaFN1cnJvZ2F0ZSAmJiBzaXplID4gbmV4dEluZGV4IC8qIHRoZXJlIGlzIGEgbmV4dCBjb2RlIHVuaXQgKi8pIHtcblx0XHRjdVNlY29uZCA9IFMuY2hhckNvZGVBdChuZXh0SW5kZXgpO1xuXHRcdGlmIChjdVNlY29uZCA+PSAweERDMDAgJiYgY3VTZWNvbmQgPD0gMHhERkZGKSB7IC8vIGxvdyBzdXJyb2dhdGVcblx0XHRcdGxlbiA9IDI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBTLnNsaWNlKHBvc2l0aW9uLCBwb3NpdGlvbiArIGxlbik7XG59O1xuXG52YXIgYXQgPSBiaW5kLmNhbGwoRnVuY3Rpb24uY2FsbCwgYXRTaGltKTtcbmRlZmluZShhdCwge1xuXHRtZXRob2Q6IGF0U2hpbSxcblx0c2hpbTogZnVuY3Rpb24gc2hpbVN0cmluZ1Byb3RvdHlwZUF0KCkge1xuXHRcdGRlZmluZShTdHJpbmcucHJvdG90eXBlLCB7XG5cdFx0XHRhdDogYXRTaGltXG5cdFx0fSk7XG5cdFx0cmV0dXJuIFN0cmluZy5wcm90b3R5cGUuYXQ7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGF0O1xuXG59LHtcImRlZmluZS1wcm9wZXJ0aWVzXCI6MTE1LFwiZXMtYWJzdHJhY3QvZXM3XCI6MTE4LFwiZnVuY3Rpb24tYmluZFwiOjEyOX1dLDExNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMTVdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjoxNSxcImZvcmVhY2hcIjoxMjcsXCJvYmplY3Qta2V5c1wiOjEzNH1dLDExNjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMTZdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCIuL2hlbHBlcnMvaXNGaW5pdGVcIjoxMjAsXCIuL2hlbHBlcnMvbW9kXCI6MTIyLFwiLi9oZWxwZXJzL3NpZ25cIjoxMjMsXCJkdXBcIjoxNixcImVzLXRvLXByaW1pdGl2ZS9lczVcIjoxMjQsXCJpcy1jYWxsYWJsZVwiOjEzMH1dLDExNzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMTddWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCIuL2VzNVwiOjExNixcIi4vaGVscGVycy9hc3NpZ25cIjoxMTksXCIuL2hlbHBlcnMvaXNGaW5pdGVcIjoxMjAsXCIuL2hlbHBlcnMvaXNQcmltaXRpdmVcIjoxMjEsXCIuL2hlbHBlcnMvbW9kXCI6MTIyLFwiLi9oZWxwZXJzL3NpZ25cIjoxMjMsXCJkdXBcIjoxNyxcImVzLXRvLXByaW1pdGl2ZS9lczZcIjoxMjUsXCJmdW5jdGlvbi1iaW5kXCI6MTI5LFwiaXMtcmVnZXhcIjoxMzJ9XSwxMTg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzQyXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiLi9lczZcIjoxMTcsXCIuL2hlbHBlcnMvYXNzaWduXCI6MTE5LFwiZHVwXCI6NDJ9XSwxMTk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzE4XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MTh9XSwxMjA6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzE5XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MTl9XSwxMjE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzIwXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MjB9XSwxMjI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzIxXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MjF9XSwxMjM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzIyXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MjJ9XSwxMjQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzIzXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiLi9oZWxwZXJzL2lzUHJpbWl0aXZlXCI6MTI2LFwiZHVwXCI6MjMsXCJpcy1jYWxsYWJsZVwiOjEzMH1dLDEyNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMjRdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCIuL2hlbHBlcnMvaXNQcmltaXRpdmVcIjoxMjYsXCJkdXBcIjoyNCxcImlzLWNhbGxhYmxlXCI6MTMwLFwiaXMtZGF0ZS1vYmplY3RcIjoxMzEsXCJpcy1zeW1ib2xcIjoxMzN9XSwxMjY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzIwXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MjB9XSwxMjc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzI2XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MjZ9XSwxMjg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzI3XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6Mjd9XSwxMjk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzI4XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiLi9pbXBsZW1lbnRhdGlvblwiOjEyOCxcImR1cFwiOjI4fV0sMTMwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyOV1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjI5fV0sMTMxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVszMF1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjMwfV0sMTMyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVszMV1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjMxfV0sMTMzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVszMl1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjMyfV0sMTM0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVszM11bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcIi4vaXNBcmd1bWVudHNcIjoxMzUsXCJkdXBcIjozM31dLDEzNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMzRdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjozNH1dLDEzNjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnZnVuY3Rpb24tYmluZCcpO1xudmFyIEVTID0gcmVxdWlyZSgnZXMtYWJzdHJhY3QvZXM3Jyk7XG52YXIgc2xpY2UgPSBiaW5kLmNhbGwoRnVuY3Rpb24uY2FsbCwgU3RyaW5nLnByb3RvdHlwZS5zbGljZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFkRW5kKG1heExlbmd0aCkge1xuXHR2YXIgTyA9IEVTLlJlcXVpcmVPYmplY3RDb2VyY2libGUodGhpcyk7XG5cdHZhciBTID0gRVMuVG9TdHJpbmcoTyk7XG5cdHZhciBzdHJpbmdMZW5ndGggPSBFUy5Ub0xlbmd0aChTLmxlbmd0aCk7XG5cdHZhciBmaWxsU3RyaW5nO1xuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcblx0XHRmaWxsU3RyaW5nID0gYXJndW1lbnRzWzFdO1xuXHR9XG5cdHZhciBmaWxsZXIgPSB0eXBlb2YgZmlsbFN0cmluZyA9PT0gJ3VuZGVmaW5lZCcgPyAnJyA6IEVTLlRvU3RyaW5nKGZpbGxTdHJpbmcpO1xuXHRpZiAoZmlsbGVyID09PSAnJykge1xuXHRcdGZpbGxlciA9ICcgJztcblx0fVxuXHR2YXIgaW50TWF4TGVuZ3RoID0gRVMuVG9MZW5ndGgobWF4TGVuZ3RoKTtcblx0aWYgKGludE1heExlbmd0aCA8PSBzdHJpbmdMZW5ndGgpIHtcblx0XHRyZXR1cm4gUztcblx0fVxuXHR2YXIgZmlsbExlbiA9IGludE1heExlbmd0aCAtIHN0cmluZ0xlbmd0aDtcblx0d2hpbGUgKGZpbGxlci5sZW5ndGggPCBmaWxsTGVuKSB7XG5cdFx0dmFyIGZMZW4gPSBmaWxsZXIubGVuZ3RoO1xuXHRcdHZhciByZW1haW5pbmdDb2RlVW5pdHMgPSBmaWxsTGVuIC0gZkxlbjtcblx0XHRmaWxsZXIgKz0gZkxlbiA+IHJlbWFpbmluZ0NvZGVVbml0cyA/IHNsaWNlKGZpbGxlciwgMCwgcmVtYWluaW5nQ29kZVVuaXRzKSA6IGZpbGxlcjtcblx0fVxuXG5cdHZhciB0cnVuY2F0ZWRTdHJpbmdGaWxsZXIgPSBmaWxsZXIubGVuZ3RoID4gZmlsbExlbiA/IHNsaWNlKGZpbGxlciwgMCwgZmlsbExlbikgOiBmaWxsZXI7XG5cdHJldHVybiBTICsgdHJ1bmNhdGVkU3RyaW5nRmlsbGVyO1xufTtcblxufSx7XCJlcy1hYnN0cmFjdC9lczdcIjoxNDEsXCJmdW5jdGlvbi1iaW5kXCI6MTUyfV0sMTM3OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGJpbmQgPSByZXF1aXJlKCdmdW5jdGlvbi1iaW5kJyk7XG52YXIgZGVmaW5lID0gcmVxdWlyZSgnZGVmaW5lLXByb3BlcnRpZXMnKTtcbnZhciBFUyA9IHJlcXVpcmUoJ2VzLWFic3RyYWN0L2VzNycpO1xuXG52YXIgaW1wbGVtZW50YXRpb24gPSByZXF1aXJlKCcuL2ltcGxlbWVudGF0aW9uJyk7XG52YXIgZ2V0UG9seWZpbGwgPSByZXF1aXJlKCcuL3BvbHlmaWxsJyk7XG52YXIgc2hpbSA9IHJlcXVpcmUoJy4vc2hpbScpO1xuXG52YXIgYm91bmQgPSBiaW5kLmNhbGwoRnVuY3Rpb24uYXBwbHksIGltcGxlbWVudGF0aW9uKTtcblxudmFyIGJvdW5kUGFkRW5kID0gZnVuY3Rpb24gcGFkRW5kKHN0ciwgbWF4TGVuZ3RoKSB7XG5cdEVTLlJlcXVpcmVPYmplY3RDb2VyY2libGUoc3RyKTtcblx0dmFyIGFyZ3MgPSBbbWF4TGVuZ3RoXTtcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG5cdFx0YXJncy5wdXNoKGFyZ3VtZW50c1syXSk7XG5cdH1cblx0cmV0dXJuIGJvdW5kKHN0ciwgYXJncyk7XG59O1xuXG5kZWZpbmUoYm91bmRQYWRFbmQsIHtcblx0Z2V0UG9seWZpbGw6IGdldFBvbHlmaWxsLFxuXHRpbXBsZW1lbnRhdGlvbjogaW1wbGVtZW50YXRpb24sXG5cdHNoaW06IHNoaW1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJvdW5kUGFkRW5kO1xuXG59LHtcIi4vaW1wbGVtZW50YXRpb25cIjoxMzYsXCIuL3BvbHlmaWxsXCI6MTU5LFwiLi9zaGltXCI6MTYwLFwiZGVmaW5lLXByb3BlcnRpZXNcIjoxMzgsXCJlcy1hYnN0cmFjdC9lczdcIjoxNDEsXCJmdW5jdGlvbi1iaW5kXCI6MTUyfV0sMTM4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsxNV1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjE1LFwiZm9yZWFjaFwiOjE1MCxcIm9iamVjdC1rZXlzXCI6MTU3fV0sMTM5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsxNl1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcIi4vaGVscGVycy9pc0Zpbml0ZVwiOjE0MyxcIi4vaGVscGVycy9tb2RcIjoxNDUsXCIuL2hlbHBlcnMvc2lnblwiOjE0NixcImR1cFwiOjE2LFwiZXMtdG8tcHJpbWl0aXZlL2VzNVwiOjE0NyxcImlzLWNhbGxhYmxlXCI6MTUzfV0sMTQwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsxN11bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcIi4vZXM1XCI6MTM5LFwiLi9oZWxwZXJzL2Fzc2lnblwiOjE0MixcIi4vaGVscGVycy9pc0Zpbml0ZVwiOjE0MyxcIi4vaGVscGVycy9pc1ByaW1pdGl2ZVwiOjE0NCxcIi4vaGVscGVycy9tb2RcIjoxNDUsXCIuL2hlbHBlcnMvc2lnblwiOjE0NixcImR1cFwiOjE3LFwiZXMtdG8tcHJpbWl0aXZlL2VzNlwiOjE0OCxcImZ1bmN0aW9uLWJpbmRcIjoxNTIsXCJpcy1yZWdleFwiOjE1NX1dLDE0MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bNDJdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCIuL2VzNlwiOjE0MCxcIi4vaGVscGVycy9hc3NpZ25cIjoxNDIsXCJkdXBcIjo0Mn1dLDE0MjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMThdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjoxOH1dLDE0MzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMTldWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjoxOX1dLDE0NDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMjBdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjoyMH1dLDE0NTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMjFdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjoyMX1dLDE0NjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMjJdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjoyMn1dLDE0NzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMjNdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCIuL2hlbHBlcnMvaXNQcmltaXRpdmVcIjoxNDksXCJkdXBcIjoyMyxcImlzLWNhbGxhYmxlXCI6MTUzfV0sMTQ4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyNF1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcIi4vaGVscGVycy9pc1ByaW1pdGl2ZVwiOjE0OSxcImR1cFwiOjI0LFwiaXMtY2FsbGFibGVcIjoxNTMsXCJpcy1kYXRlLW9iamVjdFwiOjE1NCxcImlzLXN5bWJvbFwiOjE1Nn1dLDE0OTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMjBdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjoyMH1dLDE1MDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMjZdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjoyNn1dLDE1MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMjddWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjoyN31dLDE1MjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMjhdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCIuL2ltcGxlbWVudGF0aW9uXCI6MTUxLFwiZHVwXCI6Mjh9XSwxNTM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzI5XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6Mjl9XSwxNTQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzMwXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MzB9XSwxNTU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzMxXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MzF9XSwxNTY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzMyXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MzJ9XSwxNTc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzMzXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiLi9pc0FyZ3VtZW50c1wiOjE1OCxcImR1cFwiOjMzfV0sMTU4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVszNF1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjM0fV0sMTU5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGltcGxlbWVudGF0aW9uID0gcmVxdWlyZSgnLi9pbXBsZW1lbnRhdGlvbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFBvbHlmaWxsKCkge1xuXHRyZXR1cm4gdHlwZW9mIFN0cmluZy5wcm90b3R5cGUucGFkRW5kID09PSAnZnVuY3Rpb24nID8gU3RyaW5nLnByb3RvdHlwZS5wYWRFbmQgOiBpbXBsZW1lbnRhdGlvbjtcbn07XG5cbn0se1wiLi9pbXBsZW1lbnRhdGlvblwiOjEzNn1dLDE2MDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBnZXRQb2x5ZmlsbCA9IHJlcXVpcmUoJy4vcG9seWZpbGwnKTtcbnZhciBkZWZpbmUgPSByZXF1aXJlKCdkZWZpbmUtcHJvcGVydGllcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNoaW1QYWRFbmQoKSB7XG5cdHZhciBwb2x5ZmlsbCA9IGdldFBvbHlmaWxsKCk7XG5cdGRlZmluZShTdHJpbmcucHJvdG90eXBlLCB7IHBhZEVuZDogcG9seWZpbGwgfSwgeyBwYWRFbmQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFN0cmluZy5wcm90b3R5cGUucGFkRW5kICE9PSBwb2x5ZmlsbDsgfSB9KTtcblx0cmV0dXJuIHBvbHlmaWxsO1xufTtcblxufSx7XCIuL3BvbHlmaWxsXCI6MTU5LFwiZGVmaW5lLXByb3BlcnRpZXNcIjoxMzh9XSwxNjE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmluZCA9IHJlcXVpcmUoJ2Z1bmN0aW9uLWJpbmQnKTtcbnZhciBFUyA9IHJlcXVpcmUoJ2VzLWFic3RyYWN0L2VzNycpO1xudmFyIHNsaWNlID0gYmluZC5jYWxsKEZ1bmN0aW9uLmNhbGwsIFN0cmluZy5wcm90b3R5cGUuc2xpY2UpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhZFN0YXJ0KG1heExlbmd0aCkge1xuXHR2YXIgTyA9IEVTLlJlcXVpcmVPYmplY3RDb2VyY2libGUodGhpcyk7XG5cdHZhciBTID0gRVMuVG9TdHJpbmcoTyk7XG5cdHZhciBzdHJpbmdMZW5ndGggPSBFUy5Ub0xlbmd0aChTLmxlbmd0aCk7XG5cdHZhciBmaWxsU3RyaW5nO1xuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcblx0XHRmaWxsU3RyaW5nID0gYXJndW1lbnRzWzFdO1xuXHR9XG5cdHZhciBmaWxsZXIgPSB0eXBlb2YgZmlsbFN0cmluZyA9PT0gJ3VuZGVmaW5lZCcgPyAnJyA6IEVTLlRvU3RyaW5nKGZpbGxTdHJpbmcpO1xuXHRpZiAoZmlsbGVyID09PSAnJykge1xuXHRcdGZpbGxlciA9ICcgJztcblx0fVxuXHR2YXIgaW50TWF4TGVuZ3RoID0gRVMuVG9MZW5ndGgobWF4TGVuZ3RoKTtcblx0aWYgKGludE1heExlbmd0aCA8PSBzdHJpbmdMZW5ndGgpIHtcblx0XHRyZXR1cm4gUztcblx0fVxuXHR2YXIgZmlsbExlbiA9IGludE1heExlbmd0aCAtIHN0cmluZ0xlbmd0aDtcblx0d2hpbGUgKGZpbGxlci5sZW5ndGggPCBmaWxsTGVuKSB7XG5cdFx0dmFyIGZMZW4gPSBmaWxsZXIubGVuZ3RoO1xuXHRcdHZhciByZW1haW5pbmdDb2RlVW5pdHMgPSBmaWxsTGVuIC0gZkxlbjtcblx0XHRmaWxsZXIgKz0gZkxlbiA+IHJlbWFpbmluZ0NvZGVVbml0cyA/IHNsaWNlKGZpbGxlciwgMCwgcmVtYWluaW5nQ29kZVVuaXRzKSA6IGZpbGxlcjtcblx0fVxuXG5cdHZhciB0cnVuY2F0ZWRTdHJpbmdGaWxsZXIgPSBmaWxsZXIubGVuZ3RoID4gZmlsbExlbiA/IHNsaWNlKGZpbGxlciwgMCwgZmlsbExlbikgOiBmaWxsZXI7XG5cdHJldHVybiB0cnVuY2F0ZWRTdHJpbmdGaWxsZXIgKyBTO1xufTtcblxufSx7XCJlcy1hYnN0cmFjdC9lczdcIjoxNjYsXCJmdW5jdGlvbi1iaW5kXCI6MTc3fV0sMTYyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGJpbmQgPSByZXF1aXJlKCdmdW5jdGlvbi1iaW5kJyk7XG52YXIgZGVmaW5lID0gcmVxdWlyZSgnZGVmaW5lLXByb3BlcnRpZXMnKTtcbnZhciBFUyA9IHJlcXVpcmUoJ2VzLWFic3RyYWN0L2VzNycpO1xuXG52YXIgaW1wbGVtZW50YXRpb24gPSByZXF1aXJlKCcuL2ltcGxlbWVudGF0aW9uJyk7XG52YXIgZ2V0UG9seWZpbGwgPSByZXF1aXJlKCcuL3BvbHlmaWxsJyk7XG52YXIgc2hpbSA9IHJlcXVpcmUoJy4vc2hpbScpO1xuXG52YXIgYm91bmQgPSBiaW5kLmNhbGwoRnVuY3Rpb24uYXBwbHksIGltcGxlbWVudGF0aW9uKTtcblxudmFyIGJvdW5kUGFkU3RhcnQgPSBmdW5jdGlvbiBwYWRTdGFydChzdHIsIG1heExlbmd0aCkge1xuXHRFUy5SZXF1aXJlT2JqZWN0Q29lcmNpYmxlKHN0cik7XG5cdHZhciBhcmdzID0gW21heExlbmd0aF07XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMikge1xuXHRcdGFyZ3MucHVzaChhcmd1bWVudHNbMl0pO1xuXHR9XG5cdHJldHVybiBib3VuZChzdHIsIGFyZ3MpO1xufTtcblxuZGVmaW5lKGJvdW5kUGFkU3RhcnQsIHtcblx0Z2V0UG9seWZpbGw6IGdldFBvbHlmaWxsLFxuXHRpbXBsZW1lbnRhdGlvbjogaW1wbGVtZW50YXRpb24sXG5cdHNoaW06IHNoaW1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJvdW5kUGFkU3RhcnQ7XG5cbn0se1wiLi9pbXBsZW1lbnRhdGlvblwiOjE2MSxcIi4vcG9seWZpbGxcIjoxODQsXCIuL3NoaW1cIjoxODUsXCJkZWZpbmUtcHJvcGVydGllc1wiOjE2MyxcImVzLWFic3RyYWN0L2VzN1wiOjE2NixcImZ1bmN0aW9uLWJpbmRcIjoxNzd9XSwxNjM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzE1XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MTUsXCJmb3JlYWNoXCI6MTc1LFwib2JqZWN0LWtleXNcIjoxODJ9XSwxNjQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzE2XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiLi9oZWxwZXJzL2lzRmluaXRlXCI6MTY4LFwiLi9oZWxwZXJzL21vZFwiOjE3MCxcIi4vaGVscGVycy9zaWduXCI6MTcxLFwiZHVwXCI6MTYsXCJlcy10by1wcmltaXRpdmUvZXM1XCI6MTcyLFwiaXMtY2FsbGFibGVcIjoxNzh9XSwxNjU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzE3XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiLi9lczVcIjoxNjQsXCIuL2hlbHBlcnMvYXNzaWduXCI6MTY3LFwiLi9oZWxwZXJzL2lzRmluaXRlXCI6MTY4LFwiLi9oZWxwZXJzL2lzUHJpbWl0aXZlXCI6MTY5LFwiLi9oZWxwZXJzL21vZFwiOjE3MCxcIi4vaGVscGVycy9zaWduXCI6MTcxLFwiZHVwXCI6MTcsXCJlcy10by1wcmltaXRpdmUvZXM2XCI6MTczLFwiZnVuY3Rpb24tYmluZFwiOjE3NyxcImlzLXJlZ2V4XCI6MTgwfV0sMTY2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVs0Ml1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcIi4vZXM2XCI6MTY1LFwiLi9oZWxwZXJzL2Fzc2lnblwiOjE2NyxcImR1cFwiOjQyfV0sMTY3OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsxOF1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjE4fV0sMTY4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsxOV1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjE5fV0sMTY5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyMF1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjIwfV0sMTcwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyMV1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjIxfV0sMTcxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyMl1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjIyfV0sMTcyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyM11bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcIi4vaGVscGVycy9pc1ByaW1pdGl2ZVwiOjE3NCxcImR1cFwiOjIzLFwiaXMtY2FsbGFibGVcIjoxNzh9XSwxNzM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzI0XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiLi9oZWxwZXJzL2lzUHJpbWl0aXZlXCI6MTc0LFwiZHVwXCI6MjQsXCJpcy1jYWxsYWJsZVwiOjE3OCxcImlzLWRhdGUtb2JqZWN0XCI6MTc5LFwiaXMtc3ltYm9sXCI6MTgxfV0sMTc0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyMF1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjIwfV0sMTc1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyNl1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjI2fV0sMTc2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyN11bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjI3fV0sMTc3OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyOF1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcIi4vaW1wbGVtZW50YXRpb25cIjoxNzYsXCJkdXBcIjoyOH1dLDE3ODpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMjldWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjoyOX1dLDE3OTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMzBdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjozMH1dLDE4MDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMzFdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjozMX1dLDE4MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMzJdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCJkdXBcIjozMn1dLDE4MjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMzNdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCIuL2lzQXJndW1lbnRzXCI6MTgzLFwiZHVwXCI6MzN9XSwxODM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzM0XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MzR9XSwxODQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW1wbGVtZW50YXRpb24gPSByZXF1aXJlKCcuL2ltcGxlbWVudGF0aW9uJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0UG9seWZpbGwoKSB7XG5cdHJldHVybiB0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5wYWRTdGFydCA9PT0gJ2Z1bmN0aW9uJyA/IFN0cmluZy5wcm90b3R5cGUucGFkU3RhcnQgOiBpbXBsZW1lbnRhdGlvbjtcbn07XG5cbn0se1wiLi9pbXBsZW1lbnRhdGlvblwiOjE2MX1dLDE4NTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBnZXRQb2x5ZmlsbCA9IHJlcXVpcmUoJy4vcG9seWZpbGwnKTtcbnZhciBkZWZpbmUgPSByZXF1aXJlKCdkZWZpbmUtcHJvcGVydGllcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNoaW1QYWRTdGFydCgpIHtcblx0dmFyIHBvbHlmaWxsID0gZ2V0UG9seWZpbGwoKTtcblx0ZGVmaW5lKFN0cmluZy5wcm90b3R5cGUsIHsgcGFkU3RhcnQ6IHBvbHlmaWxsIH0sIHsgcGFkU3RhcnQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFN0cmluZy5wcm90b3R5cGUucGFkU3RhcnQgIT09IHBvbHlmaWxsOyB9IH0pO1xuXHRyZXR1cm4gcG9seWZpbGw7XG59O1xuXG59LHtcIi4vcG9seWZpbGxcIjoxODQsXCJkZWZpbmUtcHJvcGVydGllc1wiOjE2M31dLDE4NjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnZnVuY3Rpb24tYmluZCcpO1xudmFyIHJlcGxhY2UgPSBiaW5kLmNhbGwoRnVuY3Rpb24uY2FsbCwgU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlKTtcblxudmFyIGxlZnRXaGl0ZXNwYWNlID0gL15bXFx4MDlcXHgwQVxceDBCXFx4MENcXHgwRFxceDIwXFx4QTBcXHUxNjgwXFx1MTgwRVxcdTIwMDBcXHUyMDAxXFx1MjAwMlxcdTIwMDNcXHUyMDA0XFx1MjAwNVxcdTIwMDZcXHUyMDA3XFx1MjAwOFxcdTIwMDlcXHUyMDBBXFx1MjAyRlxcdTIwNUZcXHUzMDAwXFx1MjAyOFxcdTIwMjlcXHVGRUZGXSovO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyaW1MZWZ0KCkge1xuXHRyZXR1cm4gcmVwbGFjZSh0aGlzLCBsZWZ0V2hpdGVzcGFjZSwgJycpO1xufTtcblxufSx7XCJmdW5jdGlvbi1iaW5kXCI6MTkxfV0sMTg3OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGJpbmQgPSByZXF1aXJlKCdmdW5jdGlvbi1iaW5kJyk7XG52YXIgZGVmaW5lID0gcmVxdWlyZSgnZGVmaW5lLXByb3BlcnRpZXMnKTtcblxudmFyIGltcGxlbWVudGF0aW9uID0gcmVxdWlyZSgnLi9pbXBsZW1lbnRhdGlvbicpO1xudmFyIGdldFBvbHlmaWxsID0gcmVxdWlyZSgnLi9wb2x5ZmlsbCcpO1xudmFyIHNoaW0gPSByZXF1aXJlKCcuL3NoaW0nKTtcblxudmFyIGJvdW5kID0gYmluZC5jYWxsKEZ1bmN0aW9uLmNhbGwsIGdldFBvbHlmaWxsKCkpO1xuXG5kZWZpbmUoYm91bmQsIHtcblx0Z2V0UG9seWZpbGw6IGdldFBvbHlmaWxsLFxuXHRpbXBsZW1lbnRhdGlvbjogaW1wbGVtZW50YXRpb24sXG5cdHNoaW06IHNoaW1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJvdW5kO1xuXG59LHtcIi4vaW1wbGVtZW50YXRpb25cIjoxODYsXCIuL3BvbHlmaWxsXCI6MTk0LFwiLi9zaGltXCI6MTk1LFwiZGVmaW5lLXByb3BlcnRpZXNcIjoxODgsXCJmdW5jdGlvbi1iaW5kXCI6MTkxfV0sMTg4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsxNV1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjE1LFwiZm9yZWFjaFwiOjE4OSxcIm9iamVjdC1rZXlzXCI6MTkyfV0sMTg5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyNl1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjI2fV0sMTkwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyN11bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjI3fV0sMTkxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyOF1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcIi4vaW1wbGVtZW50YXRpb25cIjoxOTAsXCJkdXBcIjoyOH1dLDE5MjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMzNdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCIuL2lzQXJndW1lbnRzXCI6MTkzLFwiZHVwXCI6MzN9XSwxOTM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzM0XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MzR9XSwxOTQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW1wbGVtZW50YXRpb24gPSByZXF1aXJlKCcuL2ltcGxlbWVudGF0aW9uJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0UG9seWZpbGwoKSB7XG5cdGlmICghU3RyaW5nLnByb3RvdHlwZS50cmltTGVmdCkge1xuXHRcdHJldHVybiBpbXBsZW1lbnRhdGlvbjtcblx0fVxuXHR2YXIgemVyb1dpZHRoU3BhY2UgPSAnXFx1MjAwYic7XG5cdGlmICh6ZXJvV2lkdGhTcGFjZS50cmltTGVmdCgpICE9PSB6ZXJvV2lkdGhTcGFjZSkge1xuXHRcdHJldHVybiBpbXBsZW1lbnRhdGlvbjtcblx0fVxuXHRyZXR1cm4gU3RyaW5nLnByb3RvdHlwZS50cmltTGVmdDtcbn07XG5cbn0se1wiLi9pbXBsZW1lbnRhdGlvblwiOjE4Nn1dLDE5NTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBkZWZpbmUgPSByZXF1aXJlKCdkZWZpbmUtcHJvcGVydGllcycpO1xudmFyIGdldFBvbHlmaWxsID0gcmVxdWlyZSgnLi9wb2x5ZmlsbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNoaW1UcmltTGVmdCgpIHtcblx0dmFyIHBvbHlmaWxsID0gZ2V0UG9seWZpbGwoKTtcblx0ZGVmaW5lKFxuXHRcdFN0cmluZy5wcm90b3R5cGUsXG5cdFx0eyB0cmltTGVmdDogcG9seWZpbGwgfSxcblx0XHR7IHRyaW1MZWZ0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBTdHJpbmcucHJvdG90eXBlLnRyaW1MZWZ0ICE9PSBwb2x5ZmlsbDsgfSB9XG5cdCk7XG5cdHJldHVybiBwb2x5ZmlsbDtcbn07XG5cbn0se1wiLi9wb2x5ZmlsbFwiOjE5NCxcImRlZmluZS1wcm9wZXJ0aWVzXCI6MTg4fV0sMTk2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGJpbmQgPSByZXF1aXJlKCdmdW5jdGlvbi1iaW5kJyk7XG52YXIgcmVwbGFjZSA9IGJpbmQuY2FsbChGdW5jdGlvbi5jYWxsLCBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2UpO1xuXG52YXIgcmlnaHRXaGl0ZXNwYWNlID0gL1tcXHgwOVxceDBBXFx4MEJcXHgwQ1xceDBEXFx4MjBcXHhBMFxcdTE2ODBcXHUxODBFXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwM1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMEFcXHUyMDJGXFx1MjA1RlxcdTMwMDBcXHUyMDI4XFx1MjAyOVxcdUZFRkZdKiQvO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyaW1SaWdodCgpIHtcblx0cmV0dXJuIHJlcGxhY2UodGhpcywgcmlnaHRXaGl0ZXNwYWNlLCAnJyk7XG59O1xuXG59LHtcImZ1bmN0aW9uLWJpbmRcIjoyMDF9XSwxOTc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzE4N11bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcIi4vaW1wbGVtZW50YXRpb25cIjoxOTYsXCIuL3BvbHlmaWxsXCI6MjA0LFwiLi9zaGltXCI6MjA1LFwiZGVmaW5lLXByb3BlcnRpZXNcIjoxOTgsXCJkdXBcIjoxODcsXCJmdW5jdGlvbi1iaW5kXCI6MjAxfV0sMTk4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsxNV1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjE1LFwiZm9yZWFjaFwiOjE5OSxcIm9iamVjdC1rZXlzXCI6MjAyfV0sMTk5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyNl1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjI2fV0sMjAwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyN11bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcImR1cFwiOjI3fV0sMjAxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmFyZ3VtZW50c1s0XVsyOF1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpXG59LHtcIi4vaW1wbGVtZW50YXRpb25cIjoyMDAsXCJkdXBcIjoyOH1dLDIwMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5hcmd1bWVudHNbNF1bMzNdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKVxufSx7XCIuL2lzQXJndW1lbnRzXCI6MjAzLFwiZHVwXCI6MzN9XSwyMDM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuYXJndW1lbnRzWzRdWzM0XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cylcbn0se1wiZHVwXCI6MzR9XSwyMDQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW1wbGVtZW50YXRpb24gPSByZXF1aXJlKCcuL2ltcGxlbWVudGF0aW9uJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0UG9seWZpbGwoKSB7XG5cdGlmICghU3RyaW5nLnByb3RvdHlwZS50cmltUmlnaHQpIHtcblx0XHRyZXR1cm4gaW1wbGVtZW50YXRpb247XG5cdH1cblx0dmFyIHplcm9XaWR0aFNwYWNlID0gJ1xcdTIwMGInO1xuXHRpZiAoemVyb1dpZHRoU3BhY2UudHJpbVJpZ2h0KCkgIT09IHplcm9XaWR0aFNwYWNlKSB7XG5cdFx0cmV0dXJuIGltcGxlbWVudGF0aW9uO1xuXHR9XG5cdHJldHVybiBTdHJpbmcucHJvdG90eXBlLnRyaW1SaWdodDtcbn07XG5cbn0se1wiLi9pbXBsZW1lbnRhdGlvblwiOjE5Nn1dLDIwNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBkZWZpbmUgPSByZXF1aXJlKCdkZWZpbmUtcHJvcGVydGllcycpO1xudmFyIGdldFBvbHlmaWxsID0gcmVxdWlyZSgnLi9wb2x5ZmlsbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNoaW1UcmltUmlnaHQoKSB7XG5cdHZhciBwb2x5ZmlsbCA9IGdldFBvbHlmaWxsKCk7XG5cdGRlZmluZShcblx0XHRTdHJpbmcucHJvdG90eXBlLFxuXHRcdHsgdHJpbVJpZ2h0OiBwb2x5ZmlsbCB9LFxuXHRcdHsgdHJpbVJpZ2h0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBTdHJpbmcucHJvdG90eXBlLnRyaW1SaWdodCAhPT0gcG9seWZpbGw7IH0gfVxuXHQpO1xuXHRyZXR1cm4gcG9seWZpbGw7XG59O1xuXG59LHtcIi4vcG9seWZpbGxcIjoyMDQsXCJkZWZpbmUtcHJvcGVydGllc1wiOjE5OH1dLDIwNjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9lczctc2hpbScpLnNoaW0oKTtcblxufSx7XCIuL2VzNy1zaGltXCI6MTJ9XX0se30sWzIwNl0pO1xuIl19

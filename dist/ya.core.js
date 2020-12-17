var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///////////////////////////////////////////////////////////////
    // 一 JS机制的扩展部分
    ///////////////////////////////////////////////////////////////
    // 类型判断
    function is_string(obj) {
        return typeof obj === "string";
    }
    exports.is_string = is_string;
    function is_bool(obj) {
        return typeof obj === "boolean";
    }
    exports.is_bool = is_bool;
    function is_number(obj) {
        return typeof obj === "number";
    }
    exports.is_number = is_number;
    function is_assoc(obj) {
        if (!obj)
            return false;
        return Object.prototype.toString.call(obj) === "[object Object]";
    }
    exports.is_assoc = is_assoc;
    function is_object(obj) {
        if (!obj)
            return false;
        var t = Object.prototype.toString.call(obj);
        if (t.indexOf("[object ") == 0)
            return true;
    }
    exports.is_object = is_object;
    function is_array(obj) {
        if (!obj)
            return false;
        return Object.prototype.toString.call(obj) === "[object Array]";
    }
    exports.is_array = is_array;
    function is_empty(obj) {
        if (!obj)
            return true;
        var t = typeof obj;
        if (t === "function" || t === "number" || t === "boolean")
            return false;
        for (var n in obj)
            return false;
        return true;
    }
    exports.is_empty = is_empty;
    ////////////////////////////////////////////////////////
    // 字符串处理
    var trimRegx = /(^\s+)|(\s+$)/g;
    /**
     *  去掉两边空格
     *
     * @export
     * @param {*} text
     * @returns {string}
     */
    function trim(text) {
        if (text === null || text === undefined)
            return "";
        return text.toString().replace(trimRegx, "");
    }
    exports.trim = trim;
    var intRegx = /^\s*[+\-]?\d+\s*$/g;
    var eastWordRegx = /[-_](\w)/g;
    var firstUpperCaseRegx = /^([A-Z])/g;
    var firstLowerCaseRegx = /^([a-z])/g;
    /**
     * 骆驼命名法
     * 将连字号变为骆驼命名法
     *
     * @export
     * @param {*} text
     * @param {boolean} [mix] true是大写开头，大小写混写的格式
     * @returns {string}
     */
    function camel(text, mix) {
        if (text === null || text === undefined)
            return "";
        var result = text.toString().replace(trimRegx, "").replace(eastWordRegx, function (c) { return c.toUpperCase(); });
        if (!mix)
            result = result.replace(firstUpperCaseRegx, function (c) { return c.toLowerCase(); });
        else
            result = result.replace(firstLowerCaseRegx, function (c) { return c.toUpperCase(); });
        return result;
    }
    exports.camel = camel;
    /**
     * 判定字符串是否以某个串开始
     *
     * @export
     * @param {*} text 要判定的字符串
     * @param {*} token 开始标记字符串
     * @returns {boolean}
     */
    function startsWith(text, token) {
        if (!text)
            return false;
        if (token === undefined || token === null)
            return false;
        return text.toString().indexOf(token.toString()) === 0;
    }
    exports.startsWith = startsWith;
    /**
     * 判定字符串是否以某个串结束
     *
     * @export
     * @param {*} text 要检测的字符串
     * @param {*} token 结束标记字符串
     * @returns {boolean}
     */
    function endsWith(text, token) {
        if (!text)
            return false;
        if (token === undefined || token === null)
            return false;
        text = text.toString();
        token = token.toString();
        return text.indexOf(token) === text.length - token.length;
    }
    exports.endsWith = endsWith;
    var percentRegx = /([+-]?[\d,]+(?:.\d+))%/g;
    /**
     * 是否是百分数
     *
     * @export
     * @param {*} text
     * @returns {number}
     */
    function is_percent(text) {
        if (text === null || text === undefined)
            return undefined;
        var match = text.toString().match(percentRegx);
        if (match)
            return match[1];
    }
    exports.is_percent = is_percent;
    /////////////////////
    // 数组处理
    function array_index(obj, item, start) {
        if (start === void 0) { start = 0; }
        if (!obj)
            return -1;
        for (var i = start, j = obj.length; i < j; i++) {
            if (obj[i] === item)
                return i;
        }
        return -1;
    }
    exports.array_index = array_index;
    function array_contains(obj, item) {
        return array_index(obj, item) >= 0;
    }
    exports.array_contains = array_contains;
    function array_add_unique(arr, item) {
        if (!arr || !arr.push)
            return false;
        for (var i = 0, j = arr.length; i < j; i++) {
            if (arr[i] === item)
                return false;
        }
        arr.push(item);
        return true;
    }
    exports.array_add_unique = array_add_unique;
    function array_remove(arr, item) {
        if (!arr || !arr.push || !arr.shift || !arr.length)
            return false;
        var hasItem = false;
        for (var i = 0, j = arr.length; i < j; i++) {
            var existed = arr.shift();
            if (existed !== item)
                arr.push(existed);
            else
                hasItem = true;
        }
        return hasItem;
    }
    exports.array_remove = array_remove;
    ///////////////////////////////////////
    // 对象处理
    function clone(obj, _clones) {
        var t = typeof obj;
        if (t === 'object') {
            if (!_clones)
                _clones = [];
            else
                for (var _i = 0, _clones_1 = _clones; _i < _clones_1.length; _i++) {
                    var cloneInfo = _clones_1[_i];
                    if (cloneInfo.origin === obj)
                        return cloneInfo.cloned;
                }
            var result = is_array(obj) ? [] : {};
            _clones.push({ origin: obj, cloned: result });
            for (var n in obj) {
                result[n] = clone(obj[n], _clones);
            }
            return result;
        }
        else
            return obj;
    }
    exports.clone = clone;
    exports.extend = function () {
        var target = arguments[0] || {};
        for (var i = 1, j = arguments.length; i < j; i++) {
            var o = arguments[i];
            if (o)
                for (var n in o)
                    target[n] = o[n];
        }
        return target;
    };
    var dpathTrimRegx = /(^[ .\/]+)|(\s+$)/g;
    var uintRegx = /^\s*d+\s*$/g;
    var DPath = /** @class */ (function () {
        function DPath(dpath) {
            this.raw = dpath;
            dpath = dpath.replace(dpathTrimRegx, '');
            if (!this.raw)
                throw new Exception('不正确的dpath表达式:' + dpath);
            var pathnames;
            if (dpath.indexOf('/') >= 0)
                pathnames = dpath.split('/');
            else
                pathnames = dpath.split('.');
            this.deep = pathnames.length;
            this.dotpath = pathnames.join('.');
            this.slashpath = pathnames.join('/');
            var isProp = !uintRegx.test(pathnames[0]);
            var curr = this.first = { name: isProp ? pathnames[0] : undefined, index: isProp ? undefined : parseInt(pathnames[0]) };
            for (var i = 1, j = pathnames.length; i < j; i++) {
                var name_1 = pathnames[i];
                var isProp_1 = !uintRegx.test(name_1);
                var index = undefined;
                if (!isProp_1) {
                    index = parseInt(name_1);
                    name_1 = undefined;
                }
                var item = { name: name_1, index: index, prev: curr };
                curr.next = item;
                curr = item;
            }
            this.last = curr;
        }
        DPath.prototype.get = function (target, context) {
            var data;
            var firstName = this.first.name;
            if (context) {
                if (context.call && context.apply)
                    data = context(firstName, target);
                else {
                    data = context[firstName];
                    if (data === undefined && target)
                        data = target[firstName];
                }
            }
            else if (target)
                data = target[firstName];
            if (!data)
                return data;
            var curr = this.first.next;
            while (curr) {
                data = data[curr.name];
                if (!data)
                    return data;
                curr = curr.next;
            }
            return data;
        };
        DPath.prototype.set = function (target, value, context) {
            if (!target)
                return this;
            if (this.deep === 1) {
                if (context) {
                    if (context.call && context.apply)
                        context(this.first, target, true, value);
                    else
                        target[this.first.name] = value;
                }
                else
                    target[this.first.name] = value;
            }
            var data;
            if (context) {
                if (context.call && context.apply)
                    data = context(this.first, target);
                else
                    data = target[this.first.name];
            }
            else
                data = target[this.first.name];
            var prevobj = target;
            var curr = this.first.next;
            while (curr !== this.last) {
                if (!data) {
                    var prev = curr.prev;
                    if (curr.index !== undefined) {
                        data = prevobj[prev.name || prev.index] = [];
                    }
                    else
                        data = prevobj[prev.name || prev.index] = {};
                    curr = curr.next;
                }
                prevobj = data;
                data = data[curr.name || curr.index];
                curr = curr.next;
            }
            if (!data) {
                var prev = curr.prev;
                if (curr.index !== undefined) {
                    data = prevobj[prev.name || prev.index] = [];
                }
                else
                    data = prevobj[prev.name || prev.index] = {};
            }
            data[curr.name || curr.index] = value;
            return this;
        };
        DPath.prototype.toString = function () { return this.slashpath; };
        DPath.fetch = function (path) {
            var accessor = DPath.accessors[path];
            if (!accessor) {
                accessor = DPath.accessors[path] = new DPath(path);
                DPath.accessors[accessor.dotpath] = accessor;
            }
            return accessor;
        };
        DPath.getValue = function (target, dpath, context) {
            return DPath.fetch(dpath).get(target, context);
        };
        DPath.setValue = function (target, dpath, value, context) {
            return DPath.fetch(dpath).set(target, value, context);
        };
        DPath.accessors = {};
        return DPath;
    }());
    exports.DPath = DPath;
    //////////////////////////////////////////////////////////
    // 类/对象标注
    exports.inherit = (function () {
        return function (ctor, base) {
            //extendStatics(ctor, base);
            function __() { Object.defineProperty(this, 'constructor', { value: ctor, enumerable: false, configurable: true, writable: true }); }
            ctor.prototype = base === null ? Object.create(base) : (__.prototype = base.prototype, new __());
            return ctor;
        };
    })();
    function accessable(desc, target, name, value) {
        // 标记用法 @notation() 
        if (target === undefined)
            return function (target, name) {
                if (name === undefined) {
                    // 标记应用在class或object上 
                    // @notation() class T {}
                    target = target.prototype || target;
                    for (var n_1 in target) {
                        desc.value = target[n_1];
                        Object.defineProperty(target, n_1, desc);
                    }
                }
                else {
                    // 标记应用在成员上
                    // class T { @notation() id:string;} 
                    desc.value = target[name];
                    Object.defineProperty(target, name, desc);
                }
            };
        if (name === undefined) {
            // 指定对象所有成员的可访问性
            // implicit({name:''})
            for (var n_2 in target) {
                desc.value = target[n_2];
                Object.defineProperty(target, n_2, desc);
            }
            return target;
        }
        if (typeof name === 'object') {
            if (is_array(name)) {
                for (var _i = 0, name_2 = name; _i < name_2.length; _i++) {
                    var membername = name_2[_i];
                    desc.value = target[membername];
                    Object.defineProperty(target, membername, desc);
                }
            }
            else {
                for (var n in name) {
                    desc.value = name[n];
                    Object.defineProperty(target, n, desc);
                }
            }
            return target;
        }
        desc.value = value;
        Object.defineProperty(target, name, desc);
        return target;
    }
    exports.accessable = accessable;
    /**
     * 将成员变成隐式成员
     * 不会被for循环到
     * 但外部还是可以修改
     *
     * @export
     * @param {*} [target]
     * @param {*} [name]
     * @param {*} [value]
     * @returns
     */
    function implicit(target, name, value) {
        return accessable({ enumerable: false, writable: true, configurable: true }, target, name, value);
    }
    exports.implicit = implicit;
    function constant(enumerable, target, name, value, week) {
        return accessable({ enumerable: enumerable !== false, writable: false, configurable: week ? true : false }, target, name, value);
    }
    exports.constant = constant;
    function nop() { }
    exports.nop = nop;
    var Exception = /** @class */ (function (_super) {
        __extends(Exception, _super);
        function Exception(msg, detail) {
            var _this = this;
            console.error(msg, detail);
            _this = _super.call(this, msg) || this;
            if (detail)
                for (var n in detail)
                    _this[n] = detail[n];
            return _this;
        }
        return Exception;
    }(Error));
    exports.Exception = Exception;
    ///////////////////////////////////////////////
    // 二 基础机制类
    var seed = 0;
    var seeds = {};
    function rid(prefix) {
        var rnd = Math.random();
        if (prefix) {
            var sd = seeds[prefix];
            if (++sd > 2100000000)
                sd = 0;
            seeds[prefix] = sd;
            return prefix + sd + rnd.toString();
        }
        var rs = seed.toString();
        if (++seed > 2100000000)
            seed = 0;
        return rs + rnd.toString();
    }
    exports.rid = rid;
    exports.None = new Proxy(function () { return this; }, {
        get: function () { return undefined; },
        set: function () { return this; }
    });
    var dispose = function (handler) {
        if (handler === undefined) {
            var disposeHandlers_1 = this['--disposes--'];
            if (disposeHandlers_1) {
                for (var i in disposeHandlers_1) {
                    disposeHandlers_1[i].call(this, this);
                }
            }
            if (disposeHandlers_1 !== null) {
                Object.defineProperty(this, '--disposes--', { enumerable: false, configurable: false, writable: false, value: null });
                Object.defineProperty(this, '$disposed', { enumerable: false, configurable: false, writable: false, value: true });
            }
            return this;
        }
        var disposeHandlers = this['--disposes--'];
        if (disposeHandlers === null) {
            handler.call(this, this);
            return this;
        }
        if (disposeHandlers === undefined)
            Object.defineProperty(this, '--disposes--', { enumerable: false, configurable: true, writable: false, value: disposeHandlers = [] });
        disposeHandlers.push(handler);
        return this;
    };
    function disposable(target) {
        Object.defineProperty(target, '$dispose', { enumerable: false, configurable: false, writable: true, value: dispose });
        return target;
    }
    exports.disposable = disposable;
    var Disposiable = /** @class */ (function () {
        function Disposiable() {
        }
        Disposiable.prototype.$dispose = function (callback) { throw 'abstract method'; };
        Disposiable.isInstance = function (obj) {
            return obj && obj.$dispose && typeof obj.$dispose === 'function';
        };
        return Disposiable;
    }());
    exports.Disposiable = Disposiable;
    disposable(Disposiable.prototype);
    var InjectScope = /** @class */ (function (_super) {
        __extends(InjectScope, _super);
        function InjectScope(name, superScope) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.superScope = superScope;
            _this.factories = {};
            _this.constant(InjectScope.svcname, _this);
            return _this;
        }
        InjectScope.prototype.createScope = function (name) {
            var sub = new InjectScope(name, this);
            this.$dispose(function () { return sub.$dispose(); });
            return sub;
        };
        InjectScope.prototype.resolve = function (name, context) {
            var scope = this;
            var factory;
            while (scope) {
                factory = scope.factories[name];
                if (!factory)
                    scope = scope.superScope;
                else
                    break;
            }
            if (factory)
                return factory(name, this, context);
            return undefined;
        };
        InjectScope.prototype.register = function (name, ctor, singleon) {
            var _this = this;
            if (this.factories[name])
                throw new Exception('已经注册过该依赖项:' + name);
            var activator = Activator.fetch(ctor);
            var notinitial = {};
            var instance = notinitial;
            var factory = function (name, scope, context) {
                if (singleon && instance !== notinitial)
                    return instance;
                var inst = activator.createInstance(scope, undefined, undefined, context);
                if (inst && typeof inst.$dispose === 'function')
                    _this.$dispose(function () { return inst.$dispose(); });
                if (singleon)
                    instance = inst;
                return inst;
            };
            this.factories[name] = factory;
            return activator;
        };
        InjectScope.prototype.constant = function (name, value) {
            if (this.factories[name])
                throw new Exception('已经注册过该依赖项:' + name);
            this.factories[name] = function (name, scope, context) { return value; };
            return this;
        };
        InjectScope.prototype.factory = function (name, factory) {
            if (this.factories[name])
                throw new Exception('已经注册过该依赖项:' + name);
            this.factories[name] = factory;
            return this;
        };
        InjectScope.global = new InjectScope('<GLOBAL>');
        InjectScope.svcname = 'services';
        return InjectScope;
    }(Disposiable));
    exports.InjectScope = InjectScope;
    var Activator = /** @class */ (function () {
        function Activator(ctor) {
            this.ctor = ctor;
        }
        Activator.prototype.prop = function (propname, depname) {
            if (!this.depProps)
                this.depProps = {};
            if (depname === undefined) {
                if (typeof propname === 'object') {
                    if (is_array(propname))
                        for (var i in propname)
                            this.prop(depname[i], depname[i]);
                    else
                        for (var pname in propname)
                            this.prop(pname, depname[pname]);
                }
                else
                    depname = propname;
            }
            propname = propname.replace(trimRegx, '');
            depname = depname ? depname.replace(trimRegx, '') : propname;
            if (!propname)
                throw new Exception('依赖必须指定属性名/依赖名');
            this.depProps[propname] = depname;
            return this;
        };
        Activator.prototype.createInstance = function (args, constructing, constructed, context) {
            var thisInstance = Object.create(this.ctor.prototype);
            var retInstance = thisInstance;
            var ctorArgs = [];
            if (args instanceof InjectScope) {
                ctorArgs = buildCtorArgsFromInjection(args, thisInstance, this, context);
            }
            else {
                ctorArgs = buildCtorArgs(args, thisInstance, this);
            }
            if (constructing)
                retInstance = constructing(thisInstance, ctorArgs, this, args);
            if (retInstance !== undefined)
                thisInstance = retInstance;
            retInstance = this.ctor.apply(thisInstance, ctorArgs);
            if (retInstance !== undefined)
                thisInstance = retInstance;
            if (constructed) {
                retInstance = constructed(thisInstance, this);
                if (retInstance !== undefined)
                    thisInstance = retInstance;
            }
            if (!(thisInstance instanceof this.ctor))
                Object.setPrototypeOf(thisInstance, this.ctor.prototype);
            return thisInstance;
        };
        Activator.activate = function (ctorPrProto, args, constructing, constructed, context) {
            return Activator.fetch(ctorPrProto).createInstance(args, constructing, constructed, context);
        };
        Activator.fetch = function (ctorOrProto) {
            if (!ctorOrProto)
                return undefined;
            var activator = ctorOrProto['--activator--'];
            if (!activator) {
                var t = typeof ctorOrProto;
                if (t === 'function') {
                    activator = new Activator(ctorOrProto);
                }
                else if (t === 'object') {
                    var ctor = function () { };
                    activator = new Activator(ctor);
                    activator.ctorArgs = [];
                }
                Object.defineProperty(ctorOrProto, '--activator--', { enumerable: false, configurable: false, writable: false, value: activator });
            }
            if (!activator.ctorArgs)
                parseDepdenceArgs(activator);
            return activator;
        };
        return Activator;
    }());
    exports.Activator = Activator;
    function parseDepdenceArgs(activator) {
        var code = activator.ctor.toString();
        var start = code.indexOf('(');
        var end = code.indexOf(')', start);
        var argsText = code.substring(start + 1, end);
        var argslist = argsText.split(',');
        var args = [];
        for (var i in argslist)
            args.push(argslist[i].replace(trimRegx, ''));
        activator.ctorArgs = args;
    }
    function buildCtorArgs(args, thisInstance, activator) {
        if (!activator.ctorArgs)
            parseDepdenceArgs(activator);
        var depArgs = activator.ctorArgs;
        var depProps = activator.depProps;
        if (!args)
            return [];
        if (is_array(args))
            return args;
        if (typeof args === 'object') {
            var actualArgs = [];
            for (var propname in depProps) {
                var mapname = depProps[propname];
                var value = args[mapname || propname];
                if (value !== undefined)
                    thisInstance[propname] = value;
            }
            for (var i in depArgs) {
                actualArgs.push(args[depArgs[i]]);
            }
            return actualArgs;
        }
        else
            return [args];
    }
    function buildCtorArgsFromInjection(scope, selfInstance, activator, context) {
        if (!activator.ctorArgs)
            parseDepdenceArgs(activator);
        if (activator.depProps) {
            for (var propname in activator.depProps) {
                var depname = activator.depProps[propname];
                var propValue = scope.resolve(depname, context);
                selfInstance[propname] = propValue;
            }
        }
        if (activator.ctorArgs && activator.ctorArgs.length) {
            var args = [];
            for (var i in activator.ctorArgs) {
                var name_3 = activator.ctorArgs[i];
                var argValue = scope.resolve(name_3, context);
                args.push(argValue);
            }
            return args;
        }
        return [];
    }
    function injectable(map) {
        return function (target, name) {
            if (name !== undefined) {
                var activator = Activator.fetch(target.constructor || target);
                if (map === true)
                    map = name;
                else if (map === false)
                    return target;
                activator.prop(name, map);
            }
            else {
                var activator = Activator.fetch(target);
                if (map === false)
                    activator.ctorArgs = [];
            }
        };
    }
    exports.injectable = injectable;
    var ModelTypes;
    (function (ModelTypes) {
        ModelTypes[ModelTypes["constant"] = 0] = "constant";
        ModelTypes[ModelTypes["value"] = 1] = "value";
        ModelTypes[ModelTypes["object"] = 2] = "object";
        ModelTypes[ModelTypes["array"] = 3] = "array";
        ModelTypes[ModelTypes["computed"] = 4] = "computed";
    })(ModelTypes = exports.ModelTypes || (exports.ModelTypes = {}));
    var Schema = /** @class */ (function () {
        function Schema(defaultValue, name, superSchema, visitor) {
            var type, _name, _default;
            var fn, args;
            if (defaultValue && (defaultValue.$modelType !== undefined || defaultValue.$fn)) {
                type = defaultValue.$modelType;
                _default = defaultValue.$value;
                fn = defaultValue.$fn;
                args = defaultValue.$args;
                if (type === undefined && fn)
                    type = ModelTypes.computed;
                _name = name;
            }
            else
                _default = defaultValue;
            var t = typeof _default;
            if (t === 'function') {
                if (is_array(name)) {
                    fn = defaultValue;
                    args = name;
                    type = ModelTypes.computed;
                }
                else if (!fn) {
                    _default = defaultValue;
                    type = ModelTypes.value;
                    _name = name;
                }
            }
            else if (t === 'object' && type === undefined) {
                if (is_array(_default))
                    type = ModelTypes.array;
                else
                    type = ModelTypes.object;
            }
            else
                type = ModelTypes.value;
            constant(false, this, {
                '$name': name,
                '$fn': fn,
                '$args': args,
                '$super': superSchema,
                '$default': _default
            });
            constant(false, this, {
                '$type': type, 'length': undefined, '$item': undefined, '--dpath--': undefined
            }, undefined, true);
            Object.defineProperty(this, '$dpath', { enumerable: false, configurable: false, get: function () {
                    var dpath = this['--dpath--'];
                    if (dpath)
                        return dpath;
                    if (this.$name && this.$super) {
                        var path = this.$super.$dpath.slashpath + "/" + this.$name;
                        dpath = DPath.fetch(path);
                    }
                    else {
                        dpath = {
                            slashpath: this.$name === undefined ? '' : this.$name,
                            get: function (obj, name, context) { return obj; },
                            set: function (obj, name, value, context) { },
                            toString: function () { return this.slashpath; }
                        };
                    }
                    Object.defineProperty(this, '--dpath--', { configurable: false, writable: false, enumerable: false, value: dpath });
                    return dpath;
                } });
            if (type === ModelTypes.array) {
                this.$asArray(clone(_default ? _default[0] : undefined));
            }
            else if (type === ModelTypes.object) {
                for (var n in defaultValue) {
                    this.$defineProp(n, clone(defaultValue[n]));
                }
            }
        }
        Schema_1 = Schema;
        Schema.prototype.$defineProp = function (name, propDefaultValue, visitor) {
            if (this.$type !== ModelTypes.object) {
                if (this.$type !== ModelTypes.value)
                    throw new Exception('只有type==value的Schema才能调用该函数', { 'schema': this });
                Object.defineProperty(this, '$type', { enumerable: false, configurable: false, writable: false, value: ModelTypes.object });
            }
            var propSchema = new Schema_1(propDefaultValue, name, this, visitor);
            Object.defineProperty(this, name, { configurable: false, writable: false, enumerable: true, value: propSchema });
            return propSchema;
        };
        Schema.prototype.$asArray = function (defaultItemValue, visitor) {
            if (this.$item)
                throw new Exception('$asArray只能调用一次', { 'schema': this });
            Object.defineProperty(this, '$type', { enumerable: false, configurable: false, writable: false, value: ModelTypes.array });
            var lengthSchema = new Schema_1(0, 'length', this, visitor);
            Object.defineProperty(this, 'length', { enumerable: false, configurable: false, writable: false, value: lengthSchema });
            var itemSchema = new Schema_1(defaultItemValue, '[]', this);
            Object.defineProperty(this, '$item', { configurable: false, writable: false, enumerable: false, value: itemSchema });
            return itemSchema;
        };
        var Schema_1;
        Schema = Schema_1 = __decorate([
            implicit()
        ], Schema);
        return Schema;
    }());
    exports.Schema = Schema;
    var ModelSchema = /** @class */ (function () {
        function ModelSchema(defaultValue, name, superSchema, visitor) {
            var type;
            var deps;
            if (superSchema === 'constant') {
                type = ModelTypes.constant;
            }
            else if (superSchema === 'computed') {
                type = ModelTypes.computed;
                deps = name;
                superSchema = undefined;
            }
            else if (typeof defaultValue === 'object') {
                if (is_array(defaultValue))
                    type = ModelTypes.array;
                else
                    type = ModelTypes.object;
            }
            else
                type = ModelTypes.value;
            implicit(this, {
                '$type': type,
                '$name': name,
                '$dependenceSchemas': deps,
                '$superSchema': superSchema,
                '$defaultValue': defaultValue,
                '$itemSchema': undefined,
                'length': undefined
            });
            if (!defaultValue || type === ModelTypes.constant || typeof defaultValue !== 'object') {
                if (visitor)
                    visitor.handler(this, visitor.parent);
                return;
            }
            if (type === ModelTypes.array) {
                this.$asArray(clone(defaultValue[0]));
            }
            else if (type === ModelTypes.object) {
                for (var n in defaultValue)
                    this.$prop(n, clone(defaultValue[n]));
            }
        }
        ModelSchema_1 = ModelSchema;
        ModelSchema.prototype.$prop = function (name, defaultValue) {
            if (this.$type === ModelTypes.array)
                throw new Exception('已经定义为array了', { 'schema': this });
            this.$type = ModelTypes.object;
            return this[name] || (this[name] = new ModelSchema_1(defaultValue, name, this));
        };
        ModelSchema.prototype.$asArray = function (defaultItemValue, context) {
            if (this.$type !== ModelTypes.value)
                throw new Exception('已经定义为array/object了', { 'schema': this });
            this.$type = ModelTypes.array;
            var lengthSchema = new ModelSchema_1(0, 'length', this);
            Object.defineProperty(this, 'length', { enumerable: false, configurable: false, writable: false, value: lengthSchema });
            var itemSchema = new ModelSchema_1(defaultItemValue, null, this);
            this.$itemSchema = itemSchema;
            return itemSchema;
        };
        ModelSchema.prototype.$dataPath = function () {
            var dpath = this['--data-path'];
            if (!dpath)
                dpath = buildSchemaInfo.call(this).dataPath;
            return dpath;
        };
        ModelSchema.prototype.$paths = function () {
            var paths = this['--paths'];
            if (!paths)
                paths = buildSchemaInfo.call(this).paths;
            return paths;
        };
        ModelSchema.prototype.$root = function () {
            var root = this['--root'];
            if (!root)
                root = buildSchemaInfo.call(this).root;
            return root;
        };
        ModelSchema.createBuilder = function (target) {
            if (!target || target instanceof ModelSchema_1)
                return new Proxy(new ModelSchema_1(), memberStatesTraps);
            return new Proxy(target, rootStatesTraps);
        };
        var ModelSchema_1;
        ModelSchema.constant = new ModelSchema_1(exports.None, '<CONSTANT>', 'constant');
        ModelSchema = ModelSchema_1 = __decorate([
            implicit()
        ], ModelSchema);
        return ModelSchema;
    }());
    exports.ModelSchema = ModelSchema;
    function buildSchemaInfo() {
        var schema = this;
        var paths = [];
        var root;
        while (schema) {
            root = schema;
            paths.unshift(schema.$name);
            schema = schema.$superSchema;
        }
        var pathtext = paths.join('/');
        var dpath = DPath.fetch(pathtext);
        constant(false, this, '--paths', paths);
        constant(false, this, '--root', root);
        constant(false, this, '--data-path', dpath);
        return { paths: paths, root: root, dataPath: dpath };
    }
    var rootStatesTraps = {
        get: function (target, propname) {
            if (!target.inst)
                return target.inst[propname];
            if (propname[0] === '$') {
                if (propname === '$schema')
                    return target.schema;
                return target[propname];
            }
            return new Proxy(target.schema.$prop(propname), memberStatesTraps);
        },
        set: function (target, propname, value) {
            if (!target.inst) {
                target.inst[propname] = value;
                return;
            }
            throw new Exception('schemaBuilder不可以在schemaBuilder上做赋值操作');
        }
    };
    var memberStatesTraps = {
        get: function (schema, propname) {
            if (propname[0] === '$') {
                if (propname === '$schema')
                    return schema;
                return schema[propname];
            }
            return new Proxy(schema.$prop(propname), memberStatesTraps);
        },
        set: function (target, propname, value) {
            throw new Exception('schemaBuilder不可以在schemaBuilder上做赋值操作');
        }
    };
    //////////////////////////////////////////////////////////////
    // Subscribe/Publish
    function eventable(target, name) {
        var privateName = '--event-' + name + '-handlers';
        var fn = function (handler, unsubscribe) {
            if (typeof handler === 'function') {
                var handlers = this[privateName];
                if (!handlers) {
                    if (unsubscribe)
                        return this;
                    Object.defineProperty(target, privateName, { configurable: false, writable: false, enumerable: false, value: handlers = [] });
                }
                else if (unsubscribe) {
                    array_remove(handlers, handler);
                    return this;
                }
                handlers.push(handler);
                return this;
            }
        };
        Object.defineProperty(fn, '--event', { enumerable: false, writable: false, configurable: false, value: true });
        Object.defineProperty(target, name, { enumerable: false, configurable: true, writable: true, value: fn });
    }
    exports.eventable = eventable;
    function subscribable(target) {
        Object.defineProperty(target, '$subscribe', { enumerable: false, configurable: true, writable: true, value: function (handler, disposer) {
                var handlers = this['--ob-handlers'];
                if (!handlers)
                    Object.defineProperty(this, '--ob-handlers', { enumerable: false, writable: false, configurable: false, value: handlers = [] });
                handlers.push(handler);
                if (disposer)
                    disposer.dispose(function () {
                        array_remove(handlers, handler);
                    });
                return this;
            } });
        Object.defineProperty(target, '$unsubscribe', { enumerable: false, configurable: true, writable: true, value: function (handler) {
                var handlers = this['--ob-handlers'];
                if (!handlers)
                    return this;
                array_remove(handlers, handler);
                return this;
            } });
        Object.defineProperty(target, '$publish', { enumerable: false, configurable: true, writable: true, value: function (arg, useApply) {
                var handlers = this['--ob-handlers'];
                if (!handlers)
                    return this;
                if (useApply)
                    for (var i in handlers)
                        handlers[i].apply(this, arg);
                else
                    for (var i in handlers)
                        handlers[i].call(this, arg);
                return this;
            } });
    }
    exports.subscribable = subscribable;
    var Subscription = /** @class */ (function () {
        function Subscription() {
        }
        Subscription.prototype.$subscribe = function (handler, disposable) { throw 'abstract method'; };
        Subscription.prototype.$unsubscribe = function (handler) { throw 'abstract method'; };
        Subscription.prototype.$publish = function (evt, useApply) { throw 'abstract method'; };
        Subscription.isInstance = function (obj) {
            return (obj && obj.$subscribe && obj.$unsubscribe && obj.$publish);
        };
        return Subscription;
    }());
    exports.Subscription = Subscription;
    subscribable(Subscription.prototype);
    var Observable = /** @class */ (function () {
        function Observable(initial, schema, name, superOb) {
            var _this = this;
            var _a, _b;
            var facade;
            facade = function (value, isSubscriber, capture) {
                if (value === undefined) {
                    return _this.value === Observable_1 ? _this.old : _this.value;
                }
                else if (value === Observable_1)
                    return _this;
                else if (value === ModelSchema)
                    return _this.schema;
                if (isSubscriber !== undefined) {
                    if (_this.type !== ModelTypes.constant) {
                        if (isSubscriber) {
                            if (capture)
                                _this.capture(value, isSubscriber);
                            else
                                _this.subscribe(value, isSubscriber);
                        }
                        else if (isSubscriber === false) {
                            if (capture)
                                _this.uncapture(value);
                            else
                                _this.unsubscribe(value);
                        }
                        else
                            throw new Exception('不正确的参数,isSubscriber不能为空字符串等空值');
                    }
                    return facade;
                }
                if (value) {
                    if (value instanceof ModelSchema)
                        throw new Exception('不能够将Schema赋值给observable');
                    if (_this.schema.$type === ModelTypes.constant || _this.schema.$type === ModelTypes.computed)
                        return facade;
                    if (value['$Observable'])
                        value = value();
                    else if (value.$observable)
                        value = value.get();
                }
                _this.set(value);
                return facade;
            };
            this.$observable = facade;
            Object.defineProperty(facade, '$Observable', { enumerable: false, configurable: false, writable: false, value: this });
            this.name = name || schema.$name;
            if (superOb === 'constant' || ((_a = schema) === null || _a === void 0 ? void 0 : _a.$type) === ModelTypes.constant) {
                this.type = ModelTypes.constant;
                return;
            }
            if (superOb === 'computed' || ((_b = schema) === null || _b === void 0 ? void 0 : _b.$type) === ModelTypes.computed) {
                this.type = ModelTypes.computed;
                return;
            }
            schema = this.schema = schema || new ModelSchema(initial, name);
            this.type = schema.$type;
            if (this.type === ModelTypes.object) {
                initObservableObject.call(this, facade, initial, schema);
            }
            else if (this.type === ModelTypes.array) {
                initObservableArray.call(this, facade, initial, schema);
            }
            else if (this.type === ModelTypes.constant) {
                this.get = function () { return schema.$defaultValue; };
                this.update = this.set = this.subscribe = this.unsubscribe = this.capture = this.uncapture = function () { return _this; };
            }
            else if (this.type === ModelTypes.computed) {
                initObservableComputed.call(this, facade, initial, schema);
            }
            else {
                this.old = initial === undefined ? schema.$defaultValue : initial;
            }
            this.value = Observable_1;
        }
        Observable_1 = Observable;
        Observable.prototype.get = function () {
            return this.value === Observable_1 ? this.old : this.value;
        };
        Observable.prototype.set = function (value) {
            this.value = value;
            return this;
        };
        Observable.prototype.defineProp = function (name, initial) {
            if (this.type === ModelTypes.value) {
                initObservableObject.call(this, this.$observable, {});
            }
            else if (this.type === ModelTypes.array)
                throw new Exception('数组不能定义成员');
            else if (this.$observable[name])
                throw new Exception('已经有该成员');
            var result = new Observable_1(initial, undefined, name, this);
            Object.defineProperty(this.$observable, name, { enumerable: true, configurable: false, writable: false, value: result });
            return result;
        };
        Observable.prototype.subscribe = function (handler, disposer) {
            var handlers = this.listeners || (this.listeners = []);
            handlers.push(handler);
            if (disposer)
                disposer.dispose(function () {
                    array_remove(handlers, handler);
                });
            return this;
        };
        Observable.prototype.unsubscribe = function (handler) {
            var handlers = this.listeners;
            array_remove(handlers, handler);
            return this;
        };
        Observable.prototype.capture = function (handler, disposer) {
            var handlers = this.captures || (this.captures = []);
            handlers.push(handler);
            if (disposer)
                disposer.dispose(function () {
                    array_remove(handlers, handler);
                });
            return this;
        };
        Observable.prototype.uncapture = function (handler) {
            var handlers = this.captures;
            array_remove(handlers, handler);
            return this;
        };
        Observable.prototype.update = function (src, removed) {
            var evt = { removed: removed, src: src };
            var changed = update.call(this, evt);
            if (changed && !evt.cancel)
                bubble.call(this, evt);
            return this;
        };
        var Observable_1;
        Observable = Observable_1 = __decorate([
            implicit()
        ], Observable);
        return Observable;
    }());
    exports.Observable = Observable;
    function update(evt) {
        var value = this.value === Observable ? this.old : this.value;
        if (this.value === Observable || this.value === this.old)
            return false;
        if (!evt)
            evt = {};
        evt.value = value;
        evt.old = this.old;
        evt.sender = this;
        this.old = value;
        this.value = Observable;
        var handlers = this.listeners;
        if (handlers)
            for (var i = 0, j = handlers.length; i < j; i++) {
                handlers[i].call(this, evt);
            }
        return true;
    }
    function bubble(evt) {
        var owner = this.super;
        while (owner && !evt.cancel) {
            var handlers = owner.captures;
            if (handlers) {
                for (var i = 0, j = handlers.length; i < j; i++) {
                    handlers[i].call(this, evt);
                }
            }
            owner = owner.super;
        }
    }
    function initObservableObject(facade, initial, schema) {
        var _this = this;
        this.set = function (value) {
            if (!value)
                value = {};
            var facade = _this.facade;
            for (var name_4 in facade) {
                facade[name_4](value[name_4]);
            }
            _this.value = value;
            return _this;
        };
        this.update = function (src, removed) {
            var evt = { removed: removed, src: src };
            var changed = removed || update.call(_this, evt);
            if (changed && !evt.cancel)
                bubble.call(_this, evt);
            if (evt.stop)
                return _this;
            var facade = _this.facade;
            for (var n in facade) {
                facade[n](Observable).update(evt);
            }
            return _this;
        };
        this.old = initial || {};
        for (var name_5 in schema) {
            var member = new Observable(this.old[name_5], schema[name_5], this, name_5);
            Object.defineProperty(facade, name_5, { enumerable: true, configurable: false, writable: false, value: member.$observable });
        }
    }
    function initObservableArray(facade, initial, schema) {
        var _this = this;
        this.set = function (value) {
            if (!value)
                value = [];
            var facade = _this.$observable;
            for (var i = 0, j = value.length; i < j; i++) {
                var name_6 = i.toString();
                var item = facade[name_6];
                if (item) {
                    item(value[i]);
                    continue;
                }
                item = new Observable(value[i], _this.$schema.$item, _this, name_6);
                Object.defineProperty(facade, name_6, { configurable: true, writable: false, enumerable: true, value: item.facade });
            }
            _this.value = value;
            _this.length.set(value.length);
            return _this;
        };
        this.update = function (src, removed) {
            var evt = { removed: removed, src: src };
            var changed = update.call(_this, evt);
            var oldLength = _this.length.old;
            var lenChanged = update.call(_this.length, evt);
            if ((changed || lenChanged) && !evt.cancel)
                bubble.call(_this, evt);
            if (evt.stop)
                return _this;
            var facade = _this.$observable;
            for (var i = 0, j = evt.value.length; i < j; i++) {
                var item = facade[i](Observable);
                item.update(evt);
            }
            for (var i = evt.value.length, j = oldLength; i < j; i++) {
                var n = i.toString();
                var removedItem = facade[n](Observable);
                removedItem.update(evt, true);
                delete facade[n];
            }
            return _this;
        };
        var lengthSchema = schema.length;
        var lengthObservable = new Observable(this.old.length, lengthSchema, this, 'length');
        Object.defineProperty(facade, 'length', { enumerable: false, configurable: false, writable: false, value: lengthObservable.$observable });
        this.old = initial || [];
        if (initial)
            for (var i = 0, j = initial.length; i < j; i++) {
                var name_7 = i.toString();
                var itemObservable = new Observable(initial[i], this.schema.$itemSchema, this, name_7);
                Object.defineProperty(facade, name_7, { enumerable: false, configurable: true, writable: false, value: itemObservable.$observable });
            }
    }
    function initObservableComputed(facade, initial, schema) {
        var _this = this;
        this.get = function () {
            if (_this.value !== Observable)
                return _this.value;
            var args = [];
            for (var i in _this.deps) {
                var value = _this.deps[i].get();
                args.push(value);
            }
            return schema.$defaultValue.apply(_this, args);
        };
        this.set = this.capture = this.uncapture = this.update = function () { return _this; };
        this.subscribe = function (handler, disposer) {
            if (!_this.dep_handler) {
                var callback = _this.dep_handler = function (src) {
                    var handlers = _this.handlers;
                    if (!handlers || handlers.length === 0) {
                        for (var i in _this.deps) {
                            _this.deps[i].unsubscribe(_this.dep_handler);
                        }
                        _this.dep_handler = undefined;
                        return;
                    }
                    var old = _this.value === Observable ? undefined : _this.value;
                    _this.value = Observable;
                    var value = _this.get();
                    if (old === value)
                        return;
                    var evt = {
                        value: value, old: old, sender: _this, src: src
                    };
                    for (var i in handlers)
                        handlers[i].call(_this, evt);
                };
                for (var i in _this.deps) {
                    _this.deps[i].subscribe(callback, disposer);
                }
            }
            Observable.prototype.subscribe.call(handler, disposer);
            return _this;
        };
        this.deps = initial;
    }
    var Meta = /** @class */ (function () {
        function Meta(fn) {
            var scopeSchema = this.scopeSchema = new ModelSchema();
            var modelSchema = this.modelSchema = new ModelSchema(undefined, Meta.modelname);
            var modelSchemaProxy = ModelSchema.createBuilder(modelSchema);
            var scopeSchemaProxy = ModelSchema.createBuilder(scopeSchema);
            var self = fn.prototype;
            var renderer = fn.render || fn.prototype.render;
            var vnode;
            if (renderer) {
                if (typeof renderer !== 'function')
                    vnode = Meta.parseTemplateText(renderer, self, modelSchemaProxy, scopeSchemaProxy);
                else
                    vnode = renderer.call(self, modelSchemaProxy, scopeSchemaProxy);
            }
            if (!fn.prototype.render) {
                var ctor = function () {
                    fn.call(this['--'].model);
                };
                ctor.prototype = fn.prototype;
                this.activator = Activator.fetch(ctor);
                this.activator.ctorArgs = [];
            }
            else
                this.activator = Activator.fetch(fn);
            this.vnode = vnode;
            return this;
        }
        Meta.prototype.tag = function (name) {
            if (this.tagName)
                throw new Exception('重复指定控件的标签', { name: name });
            if (Meta.components[name])
                throw new Exception('已经注册了该标签的控件', { existed: Meta.components[name] });
            this.tagName = name;
            Meta.components[name] = this;
            return this;
        };
        Meta.prototype.props = function (names) {
            if (!this.properties) {
                this.properties = {};
            }
            for (var n in names) {
                var name_8 = trim(n);
                var path = trim(names[n]);
                if (name_8 && path) {
                    var dpath = this.properties[name_8] = new DPath(path);
                    dpath.handlername = '@' + name_8;
                }
            }
            return this;
        };
        Meta.components = {};
        Meta.modelname = '--model--';
        return Meta;
    }());
    exports.Meta = Meta;
    function component(tag, fn) {
        if (tag) {
            if (typeof tag === 'function') {
                fn = tag;
                tag = undefined;
            }
        }
        if (fn) {
            var meta = new Meta(fn);
            if (tag)
                meta.tag(tag);
        }
        return function (target) {
            var meta = new Meta(target);
            if (tag)
                meta.tag(tag);
        };
    }
    exports.component = component;
    var BindScope = /** @class */ (function (_super) {
        __extends(BindScope, _super);
        function BindScope(schema, name, superScope, model) {
            var _this = _super.call(this, {}, schema, undefined, name) || this;
            Object.defineProperty(_this.$observable, '$superScope', { enumerable: false, configurable: false, writable: false, value: superScope.$observable });
            Object.defineProperty(_this.$observable, Meta.modelname, { enumerable: false, configurable: false, writable: false, value: model });
            Object.defineProperty(_this.$observable, '$createScope', { enumerable: false, configurable: false, writable: false, value: function (name) {
                    return new BindScope(null, name, this, this[Meta.modelname]).$observable;
                } });
            Object.defineProperty(_this.$observable, '$resolve', { enumerable: false, configurable: false, writable: false, value: bindScopeResolve });
            return _this;
        }
        //name?:string|{[name:string]:T},inital?:{[name:string]:T}
        BindScope.prototype.$createScope = function (name, schema) {
            return new BindScope(schema, name, this, this[Meta.modelname]);
        };
        return BindScope;
    }(Observable));
    exports.BindScope = BindScope;
    function bindScopeResolve(bindValue, expandOb) {
        if (expandOb === undefined) {
            var scope = this;
            while (scope) {
                var ob = scope[bindValue];
                if (ob)
                    return ob;
                scope = scope.$superScope;
            }
            return undefined;
        }
        if (bindValue instanceof ModelSchema) {
            if (bindValue.$type === ModelTypes.constant) {
                return new Observable(undefined, bindValue, undefined, '<CONSTANT>').$observable;
            }
            else if (bindValue.$type === ModelTypes.computed) {
                return new Observable(undefined, bindValue, undefined, '<COMPUTED>').$observable;
            }
            var paths = bindValue.$paths();
            var varname = paths[0];
            var observable = this.$fetch(varname);
            var result = observable;
            for (var i = 1, j = paths.length; i < j; i++)
                result = result[paths[i]];
            bindValue = result;
        }
        if (expandOb === false) {
            return bindValue && bindValue.$observable ? bindValue.$observable : new Observable(bindValue, undefined, undefined, '<constant>');
        }
        if (expandOb === true)
            return extractObserable(bindValue);
        return bindValue;
    }
    function extractObserable(bindValue) {
        if (!bindValue)
            return bindValue;
        if (bindValue.$Observable)
            return bindValue.$Observable.get();
        if (bindValue.$observable)
            return bindValue.get();
        if (typeof bindValue === 'object') {
            var ret = is_array(bindValue) ? [] : {};
            for (var n in bindValue) {
                ret[n] = extractObserable(bindValue[n]);
            }
            return ret;
        }
        return bindValue;
    }
    var ComponentRuntime = /** @class */ (function () {
        function ComponentRuntime(opts, meta, parent) {
            this.opts = opts;
            this.meta = meta;
            this.parent = parent;
            var tag = this.meta.tagName || (this.meta.tagName = rid('Component#'));
            this.sid = rid("<" + tag + ">#");
            if (parent) {
                this.services = parent.services.createScope();
            }
            else
                this.services = InjectScope.global;
            this.slots = {};
            if (opts.children) {
                for (var i in opts.children) {
                    var child = opts.children[i];
                    var slotname = void 0;
                    if (child.attrs) {
                        slotname = child.attrs['slot'];
                        if (slotname === undefined)
                            slotname = '';
                        var slotNodes = this.slots[slotname];
                        if (!slotNodes)
                            slotNodes = this.slots[slotname] = [];
                        slotNodes.push(child);
                    }
                }
            }
            this.instance = this.meta.activator.createInstance(this.services);
        }
        ComponentRuntime.prototype.initialize = function (bindContext) {
            this.scope = bindContext.scope.$createScope(this.sid, this.meta.scopeSchema);
            this.model = new Observable(undefined, this.meta.modelSchema, Meta.modelname, undefined);
            this.model.value = this.model.old;
            Object.defineProperty(this.scope, Meta.modelname, { enumerable: false, writable: false, configurable: false, value: this.model });
            if (typeof this.instance.created === 'function')
                this.instance.created(this.model.value, this.services);
        };
        ComponentRuntime.prototype.render = function (bindContext) {
            var rs = [];
            return rs;
        };
        return ComponentRuntime;
    }());
    exports.ComponentRuntime = ComponentRuntime;
    var PropertyBinding = /** @class */ (function () {
        function PropertyBinding(bindValue) {
        }
        return PropertyBinding;
    }());
    exports.PropertyBinding = PropertyBinding;
    function bindComponentAttr(component, scope, bindContext) {
        var opts = bindContext.options.$attrs || bindContext.options;
        for (var bindName in opts)
            (function (bindName, bindValue, scope, component) {
                var ob = scope.$resolve(bindValue, false);
                component.instance[bindName] = ob();
                var propInfo = component.meta.properties[bindName];
                ob(function (evt) {
                    component.instance[bindName] = evt.value;
                    if (propInfo) {
                        var modelOb = propInfo.get(component.model);
                        modelOb(evt.value);
                    }
                }, component, true);
                // <input border="1" value={state.data} />
            })(bindName, opts[bindName], bindContext.scope, bindContext.component);
    }
    // class ComponentRuntimeInfo{
    //     meta:TMeta
    //     instance:TComponent
    //     node:TNode
    //     model:TObservable
    //     scope: Scope
    //     parent:ComponentRuntimeInfo
    //     children:ComponentRuntimeInfo[]
    //     mounted:boolean
    //     disposed:boolean
    //     constructor(meta:TMeta,opts:any,parent?:ComponentRuntimeInfo){
    //         this.meta = meta
    //         const component:TComponent = this.instance = activate(meta.ctor,true)
    //         constant(false,component,'--',this)
    //         if(meta.props && opts)for(let i in meta.props) {let n = meta.props[i];component[n]=opts[n];}
    //         const model = this.model = new Observable(component,meta.modelSchema,undefined,'this').--facade
    //         this.scope = new Scope(model,meta.tag)
    //         if(typeof component.created==='function') component.created()
    //         if(parent) parent.appendChild(this)
    //     }
    //     render(){
    //         return render({scope:this.scope,component:this.instance,descriptor:this.meta.vnode})
    //     }
    //     appendChild(child:ComponentRuntimeInfo){
    //         if(child.parent) throw new Exception('该component已经有父级,不可以再指定父级',child)
    //         child.parent = this
    //         const node = child.render()
    //         platform.appendChild(this.node,node)
    //         const parentRTInfo = parent['--'] as ComponentRuntimeInfo
    //         const children = parentRTInfo.children || (parentRTInfo.children=[])
    //         children.push(this)
    //         if(this.mounted){
    //             if(typeof child.instance.mounted){
    //                 child.instance.mounted()
    //             }
    //         }
    //         return this
    //     }
    //     mount(container:TNode):TComponent{
    //         if(this.mounted) throw new Exception('不可以重复挂载',this)
    //         if(this.parent) throw new Exception('不可以只能挂载根组件，该组件已经有父组件',this)
    //         const node = this.render()
    //         platform.mount(container,node)
    //         function mount(info:ComponentRuntimeInfo){
    //             info.mounted=true
    //             if(typeof info.instance.mounted==='function'){
    //                 info.instance.mounted()
    //             }
    //             if(info.children) for(let i in info.children) mount(info.children[i])
    //         }
    //         mount(this)
    //         return this.instance
    //     }
    //     dispose(){
    //         if(typeof this.instance.dispose==='function'){
    //             try{
    //                 this.instance.dispose()
    //             }catch(ex){
    //                 console.error("dispose错误",ex)
    //             }
    //         }
    //         if(this.dispose)for(let i in this.children) this.children[i].dispose()
    //         this.disposed=true
    //     }
    // }
    // class Runtime{
    //     roots:ComponentRuntimeInfo[]
    //     timer:number
    //     tick :number = 50
    //     constructor(){
    //         this.roots=[]
    //     }
    //     mount(container:TNode,renderer,opts?:any){
    //         if(!renderer) return
    //         let meta:TMeta = renderer['--meta']
    //         if(!meta) meta = resolveMeta(renderer)
    //         const rtInfo = new ComponentRuntimeInfo(meta,opts)
    //         this._addRoot(rtInfo)
    //         return rtInfo
    //     }
    //     private _addRoot(root:ComponentRuntimeInfo){
    //         if(root.parent) throw new Exception('不是顶级控件，不可以挂载',root)
    //         this.roots.push(root)
    //         if(!this.timer){
    //             this.timer = setTimeout(()=>{},this.tick)
    //         }
    //     }
    //     private _tick(){
    //         for(let i =0,j=this.roots.length;i<j;i++){
    //             let rtInfo = this.roots.shift()
    //             if(!rtInfo.disposed){
    //                 if(!platform.alive(rtInfo.node)){
    //                     rtInfo.dispose()
    //                     continue
    //                 }
    //                 rtInfo.model(Observable).update(false,this as any);
    //                 this.roots.push(rtInfo)
    //             }
    //         }
    //         if(this.roots.length) this.timer = setTimeout(()=>this._tick(),this.tick)
    //         else this.timer = 0
    //     }
    // }
    // export let runtime:Runtime = new Runtime()
    // export function mount(container:TNode,opts:any,extra?:any){
    //     let t = typeof opts
    //     if(t==='function'){
    //         const meta = resolveMeta(opts)
    //         const rt = new ComponentRuntimeInfo(meta,opts)
    //         debugger
    //         return rt.mount(container)
    //     }
    //     throw "not implement"
    // }
    // let tempCreateElementFn
    // function _createElement(tag:string,attrs:{[name:string]:any}):TNodeDescriptor{
    //     if(tempCreateElementFn) return tempCreateElementFn.apply(this,arguments)
    //     const vnode:TNodeDescriptor = {
    //         tag:tag,attrs:attrs
    //     }
    //     if(arguments.length>2){
    //         let children = [];
    //         for(let i =2,j=arguments.length;i<j;i++){
    //             let child = arguments[i]
    //             if(child) children.push(child)
    //         }
    //         if(children.length) vnode.children = children
    //     }
    //     return vnode;
    // }
    // export const createElement :(tag:string,attrs:{[index:string]:any},...args:any[])=>TNodeDescriptor = _createElement;
    // //////////////////
    // // render
    // type TRenderContext = {
    //     descriptor:TNodeDescriptor,scope:any,component:TComponent
    // }
    // export function render(context:TRenderContext) {
    //     const descriptor = context.descriptor
    //     if(descriptor.attrs) {
    //         for(let n in specialAttributeRenders) {
    //             let opts = descriptor.attrs[n]
    //             if(opts!==undefined) return specialAttributeRenders[n](n,opts,context)
    //         }
    //     }
    //     if(descriptor.content!==undefined){
    //         return renderText(descriptor.content,context)
    //     } 
    //     let componentType = descriptor.component || metas[descriptor.tag]
    //     if(componentType){
    //     }else{
    //         if(descriptor.tag) return renderNode(descriptor.tag,context)
    //         return renderText(descriptor.content,context)
    //     }
    // }
    // function renderText(content:any,context:TRenderContext):TNode{
    //     const {value,observable} = resolveBindValue(content,context)
    //     debugger
    //     const node = platform.createText(value)
    //     if(observable) observable((evt)=>{
    //         node.nodeValue = evt.value
    //     },context.component)
    //     return node
    // }
    // function renderNode(tag:string,context:TRenderContext):TNode{
    //     debugger
    //     const {descriptor} = context
    //     const node = platform.createElement(tag)
    //     const attrs = descriptor.attrs
    //     if(attrs) for(let attrName in attrs){
    //         let {value,observable}= resolveBindValue(attrs[attrName],context)
    //         let attrBinder = nodeAttributeBinders[attrName]
    //         if(attrBinder){
    //             attrBinder(node,attrName,value,observable,context)
    //         } 
    //         else {
    //             platform.setAttribute(node,attrName,value);
    //             if(observable)((attrName,node,platform,component)=>{
    //                 observable?.subscribe((evt)=>{
    //                     platform.setAttribute(node,attrName,evt.value)
    //                 },component)
    //             })(attrName,node,platform,context.component)
    //         }
    //     }
    //     if(descriptor.children){
    //         for(let i = 0,j=descriptor.children.length;i<j;i++){
    //             let childNode = render({scope:context.scope,component:context.component,descriptor:descriptor.children[i]})
    //             if(childNode===undefined) debugger
    //             platform.appendChild(node, childNode)
    //         }
    //     }
    //     return node
    // }
    // const nodeAttributeBinders :{[attrname:string]:(node:TNode,attrName:string,attrValue:any,attrObservable:TObservable,context:TRenderContext)=>void} = {}
    // function nodeEventBinder(node:TNode,attrName:string,attrValue:any,attrObservable:TObservable,context:TRenderContext){
    //     let evtName = attrName.substr(2)
    //     let component = context.component
    //     platform.attach(node,evtName,getListener(attrValue,component))
    //     if(attrObservable)attrObservable((evt)=>{
    //         if (evt.old) {
    //             let listener = evt.old['--listener'] || evt.old
    //             platform.detech(node,evtName,listener)
    //         } 
    //         platform.attach(node,evtName,getListener(evt.value,component))
    //     },context.component)
    // }
    // constant(false,nodeEventBinder,'--event-binder',true)
    // const evtnames = ['onclick','ondblclick','onsubmit','onfocus','onblur','onmouseenter','onmouseout','onmouseover','onmousemove','onmousedown','onmouseup','onkeypress','onkeydown','onkeyup','onchange','onload','onresize']
    // for(let i in evtnames)nodeAttributeBinders[evtnames[i]] =  nodeEventBinder
    // function getListener(fn:Function,component:TComponent){
    //     let listener = fn['--listener']
    //     if(listener) return listener
    //     if(!component) return fn
    //     listener = function(evt){return fn.call(component,evt,component)}
    //     constant(false,fn ,'--listener',listener)
    //     return listener
    // }
    // const specialAttributeRenders:{[attrname:string]:(attrName:string,attrValue:any,context:TRenderContext)=>TNode}={}
    // specialAttributeRenders['y-for'] =(attrName:string,attrValue:any,context:TRenderContext):TNode =>{
    //     const asSchema = attrValue.as
    //     let {value,observable} = resolveBindValue.call(attrValue.each,context.scope,context);
    //     let exists = []
    //     makeFor(attrName,asSchema,value,observable,exists,context)
    //     constant(false,observable,'--each-elements',exists)
    //     if(observable)observable.subscribe((evt)=>{
    //         makeFor(attrName,asSchema,evt.value,evt.sender,exists,context)
    //         evt.cancel=true
    //     },context.component)
    // }
    // function makeFor(attrName:string,asSchema:ModelSchema,eachValue:any,eachObservable:Observable,exists:TNode[],context:TRenderContext){
    //     const {descriptor,scope} = context
    //     let tmp = descriptor.attrs['y-for']
    //     descriptor.attrs[attrName] = null
    //     for(let i=0,j=eachValue.length;i<j;i++) {
    //         let existed = exists.shift()
    //         if(existed){
    //             existed['--loop-variable'].setValue(eachValue[i])
    //             exists.push(existed)
    //         }else {
    //             let loopScope = scope.$createScope(i.toString())
    //             let loopVariable = loopScope.$observable(eachValue[i],asSchema,false);
    //             let node = render({
    //                 descriptor,scope:loopScope,component:context.component
    //             })
    //             constant(false,node,'--loop-variable',loopVariable)
    //             exists.push(node)
    //         }
    //     }
    //     for(let i = eachValue.length,j=exists.length;i<j;i++){
    //         let removed = exists.shift()
    //         drop(removed)
    //     }
    //     exists.length = eachValue.length
    //     descriptor.attrs[attrName]=tmp
    // }
    // export function resolveBindValue(bindValue:any,context:TRenderContext,bind?:(value:any,observable:TObservable)=>any):{value:any,observable:TObservable}{
    //     let observable:TObservable
    //     let value = bindValue
    //     if(value){
    //         if(value instanceof ModelSchema){
    //             const ob:TObservable = context.scope.$observable((value as any).$schema||value)
    //             value = ob()
    //         }else if(value instanceof Observable){
    //             observable = value.--facade
    //             value = observable.getValue()
    //         }else if(value.$Observable){
    //             observable = value
    //             value = observable()
    //         }else if(value.$Observable && value.apply && value.call){
    //             observable = value.$Observable
    //             value = observable.getValue()
    //         }
    //     }
    //     if(bind)bind(value,observable)
    //     return {observable,value}
    // }
    function drop(node, remove) {
        if (!node)
            return;
        if (remove !== false)
            exports.platform.remove(node);
        var component = node['--component'];
        if (component && component.dispose)
            component.dispose();
        else {
            exports.platform.eachChildren(node, function (child, i) {
                drop(child, false);
            });
        }
    }
    var Component = /** @class */ (function () {
        function Component() {
        }
        return Component;
    }());
    exports.Component = Component;
    exports.platform = {
        createElement: function (tag) {
            return document.createElement(tag);
        },
        createText: function (txt) {
            return document.createTextNode(txt);
        },
        createComment: function (comment) {
            return document.createComment(comment);
        },
        attach: function (node, evtName, handler) {
            node.addEventListener(evtName, handler, false);
        },
        detech: function (node, evtName, handler) {
            node.removeEventListener(evtName, handler, false);
        },
        mount: function (container, node) {
            container.innerHTML = "";
            container.appendChild(node);
        },
        alive: function (node, value) {
            if (value === undefined) {
                if (node['--alive'])
                    return true;
                while (node) {
                    if (node === document.body)
                        return true;
                    node = node.parentNode;
                }
                return false;
            }
            Object.defineProperty(node, '--alive', { enumerable: false, configurable: true, writable: false, value: value });
        },
        appendChild: function (parent, child) {
            parent.appendChild(child);
        },
        insertBefore: function (inserted, relative) {
            relative.parentNode.insertBefore(inserted, relative);
        },
        remove: function (node) {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
                return true;
            }
            return false;
        },
        clear: function (node) {
            node.innerHTML = "";
        },
        eachChildren: function (node, callback) {
            if (node.hasChildren) {
                for (var i = 0, j = node.childNodes.length; i < j; i++)
                    callback(node.childNodes[i], i);
            }
        },
        setText: function (node, txt) {
            if (node.innerText !== undefined)
                node.innerText = txt;
            else
                node.nodeValue = txt;
        },
        setAttribute: function (node, name, value) {
            node.setAttribute(name, value);
        }
    };
});
//# sourceMappingURL=YA.core.js.map
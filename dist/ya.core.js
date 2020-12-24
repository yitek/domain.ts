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
        function Exception(msg, detail, silence) {
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
    exports.NONE = new Proxy(function () { return this; }, {
        get: function () { return undefined; },
        set: function () { return this; }
    });
    exports.REMOVE = new Proxy(function () { return this; }, {
        get: function () { return undefined; },
        set: function () { return this; }
    });
    exports.USEAPPLY = new Proxy(function () { return this; }, {
        get: function () { return undefined; },
        set: function () { return this; }
    });
    var nextTickHandlers = [];
    var nextTickTimer;
    function nextTick(handler, append) {
        if (append === false) {
            var c = 0;
            for (var i = 0, j = nextTickHandlers.length; i < j; i++) {
                var existed = nextTickHandlers.shift();
                if (existed !== handler)
                    nextTickHandlers.push(existed);
                else
                    c++;
            }
            return c;
        }
        nextTickHandlers.push(handler);
        if (!nextTickTimer)
            nextTickTimer = setTimeout(function () {
                var handlers = nextTickHandlers;
                nextTickHandlers = [];
                for (var i = 0, j = handlers.length; i < j; i++) {
                    var handler_1 = handlers.shift();
                    handler_1();
                }
                if (nextTickHandlers.length === 0)
                    nextTickTimer = 0;
            }, 0);
    }
    exports.nextTick = nextTick;
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
    //////////////////////////////////////////////////////////////
    // Subscribe/Publish
    function subscribable(target) {
        Object.defineProperty(target, '$subscribe', { enumerable: false, configurable: false, writable: true, value: function (handler, extras, disposer) {
                var _this = this;
                var handlers = this['--subscribable--'];
                if (!handlers)
                    Object.defineProperty(this, '--subscribable--', { enumerable: false, writable: false, configurable: true, value: handlers = [] });
                if (handlers['--fulfill--']) {
                    var filter = handlers['--fulfill-filter'];
                    if (filter && !filter(extras))
                        return this;
                    if (extras === undefined)
                        extras = this;
                    if (handlers['--fulfill-use-apply--'])
                        handler.apply(extras, handlers['--fulfill-value--']);
                    else if (handlers['--fulfill-value1--'] === undefined)
                        handler.call(extras, handlers['--fulfill-value--']);
                    else
                        handler.call(extras, handlers['--fulfill-value--'], handlers['--fulfill-value1--']);
                    return this;
                }
                var callbacker = {
                    handler: handler,
                    extras: extras
                };
                handlers.push(callbacker);
                if (disposer) {
                    if (disposer.$dispose) {
                        disposer.$dispose(function () { return _this.$unsubscribe(handler); });
                    }
                    else if (disposer.dispose) {
                        disposer.$dispose(function () { return _this.$unsubscribe(handler); });
                    }
                    else
                        console.warn('subscribable.subscribe传入的第二个参数没有找到$dispose/dispose成员函数，无法追加释放事件');
                }
                return this;
            } });
        Object.defineProperty(target, '$unsubscribe', { enumerable: false, configurable: false, writable: true, value: function (handler, filter) {
                var handlers = this['--subscribable--'];
                if (!handlers || handlers['--fulfill--'])
                    return this;
                for (var i = 0, j = handlers.length; i < j; i++) {
                    var callbacker = handlers.shift();
                    if (!callbacker)
                        return this;
                    if (filter && filter(callbacker.extras))
                        continue;
                    if (callbacker.handler !== handler)
                        handlers.push(callbacker);
                }
                return this;
            } });
        Object.defineProperty(target, '$publish', { enumerable: false, configurable: true, writable: true, value: function (arg, useApply, filter) {
                var handlers = this['--subscribable--'];
                if (!handlers)
                    return this;
                if (handlers['--fulfill--'])
                    throw new Exception('已经具有终值，不能再调用$publish');
                var arg1 = useApply;
                if (exports.USEAPPLY === useApply) {
                    useApply = true;
                }
                else {
                    if (useApply && useApply.call && useApply.apply && filter === undefined) {
                        filter = useApply;
                        arg1 = undefined;
                    }
                    useApply = false;
                }
                for (var i = 0, j = handlers.length; i < j; i++) {
                    var callbacker = handlers.shift();
                    if (!callbacker)
                        continue;
                    var extras = callbacker.extras;
                    if (filter && !filter(extras)) {
                        handlers.push(callbacker);
                    }
                    else {
                        var self_1 = extras === undefined ? this : extras;
                        var result = void 0;
                        if (useApply)
                            result = callbacker.handler.apply(self_1, arg);
                        else if (arg1 === undefined)
                            result = callbacker.handler.call(self_1, arg);
                        else
                            result = callbacker.handler.call(self_1, arg, arg1);
                        if (result !== exports.REMOVE)
                            handlers.push(callbacker);
                        else if (result === false)
                            return false;
                    }
                }
                return this;
            } });
        Object.defineProperty(target, '$fulfill', { enumerable: false, configurable: true, writable: true, value: function (arg, useApply, filter) {
                var handlers = this['--subscribable--'];
                if (handlers && handlers['--fulfill--']) {
                    throw new Exception('已经具有了终值，不可以再调用$fulfill函数');
                }
                var arg1 = useApply;
                if (exports.USEAPPLY === useApply) {
                    useApply = true;
                }
                else {
                    if (useApply && useApply.call && useApply.apply && filter === undefined) {
                        filter = useApply;
                        arg1 = undefined;
                    }
                    useApply = false;
                }
                var fulfill = { '--fulfill--': true, '--fulfill-value--': arg, '--fulfill-value1--': arg1, '--fulfill-use-apply--': useApply, '--fulfill-filter--': filter };
                Object.defineProperty(this, '--subscribable--', { configurable: false, writable: false, enumerable: false, value: fulfill });
                if (!handlers || handlers.length === 0)
                    return this;
                for (var i = 0, j = handlers.length; i < j; i++) {
                    var callbacker = handlers.shift();
                    if (!callbacker)
                        continue;
                    var extras = callbacker.extras;
                    if (filter && !filter(extras)) {
                        handlers.push(callbacker);
                    }
                    else {
                        var self_2 = extras === undefined ? this : extras;
                        var result = void 0;
                        if (useApply)
                            result = callbacker.handler.apply(self_2, arg);
                        else if (arg1 === undefined)
                            result = callbacker.handler.call(self_2, arg);
                        else
                            result = callbacker.handler.call(self_2, arg, arg1);
                        if (result === false)
                            return false;
                    }
                }
                return this;
            } });
    }
    exports.subscribable = subscribable;
    subscribable.REMOVE = exports.REMOVE;
    Object.defineProperty(subscribable, 'REMOVE', { configurable: false, writable: false, enumerable: false, value: exports.REMOVE });
    subscribable.USEAPPLY = exports.USEAPPLY;
    Object.defineProperty(subscribable, 'USEAPPLY', { configurable: false, writable: false, enumerable: false, value: exports.USEAPPLY });
    var Subscription = /** @class */ (function () {
        function Subscription() {
        }
        Subscription.prototype.$subscribe = function (handler, extra, disposable) { throw 'abstract method'; };
        Subscription.prototype.$unsubscribe = function (handler) { throw 'abstract method'; };
        Subscription.prototype.$publish = function (evt, useApply, filter) { throw 'abstract method'; };
        Subscription.prototype.$fulfill = function (evt, useApply, filter) { throw 'abstract method'; };
        Subscription.isInstance = function (obj) {
            return (obj && obj.$subscribe && obj.$unsubscribe && obj.$publish && obj.$fulfill);
        };
        return Subscription;
    }());
    exports.Subscription = Subscription;
    subscribable(Subscription.prototype);
    Object.defineProperty(Subscription, 'REMOVE', { configurable: false, writable: false, enumerable: false, value: exports.REMOVE });
    Object.defineProperty(Subscription, 'USEAPPLY', { configurable: false, writable: false, enumerable: false, value: exports.USEAPPLY });
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
            Object.defineProperty(this, name, { configurable: true, writable: false, enumerable: true, value: propSchema });
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
        Schema.proxy = function (target) {
            if (!target || !(target instanceof Schema_1))
                return new Proxy(new Schema_1(target), schemaProxyTraps);
            return new Proxy(target, schemaProxyTraps);
        };
        var Schema_1;
        Schema = Schema_1 = __decorate([
            implicit()
        ], Schema);
        return Schema;
    }());
    exports.Schema = Schema;
    var schemaProxyTraps = {
        get: function (schema, propname) {
            if (propname === '$schema')
                return schema;
            var existed = schema[propname];
            if (existed)
                return existed;
            existed = schema.$defineProp(propname);
            return new Proxy(existed, schemaProxyTraps);
        },
        set: function (target, propname, value) {
            throw new Exception('schemaBuilder不可以在schemaBuilder上做赋值操作');
        }
    };
    var ObservableChangeTypes;
    (function (ObservableChangeTypes) {
        ObservableChangeTypes[ObservableChangeTypes["nochanges"] = 0] = "nochanges";
        ObservableChangeTypes[ObservableChangeTypes["setted"] = 1] = "setted";
        ObservableChangeTypes[ObservableChangeTypes["changed"] = 2] = "changed";
        ObservableChangeTypes[ObservableChangeTypes["appended"] = 3] = "appended";
        ObservableChangeTypes[ObservableChangeTypes["removed"] = 4] = "removed";
    })(ObservableChangeTypes = exports.ObservableChangeTypes || (exports.ObservableChangeTypes = {}));
    var Observable = /** @class */ (function (_super) {
        __extends(Observable, _super);
        function Observable(initial, schema, name, superOb) {
            return _super.call(this) || this;
        }
        Observable.prototype.set = function (value, src) {
            throw 'abstract method.';
        };
        Observable.prototype.get = function () {
            return this.value;
        };
        Observable.prototype.update = function (src) { throw 'abstract method.'; };
        return Observable;
    }(Subscription));
    exports.Observable = Observable;
    function initObservable(inital, schema, name, superOb) {
        var _a;
        if (!this.$publish)
            Subscription.call(this);
        if (!name && schema)
            name = schema.$name;
        this.name = name;
        this.schema = schema || new Schema(undefined, name, (_a = superOb) === null || _a === void 0 ? void 0 : _a.schema);
        this.super = superOb;
        this.$observable = create_observable(this);
        this.value = this.old = inital;
    }
    function ObservableValue(inital, schema, name, superOb) {
        this.type = ModelTypes.value;
        initObservable.call(this, inital, schema, name, superOb);
        this.set = function (value, src) {
            if (this.value === value)
                return this;
            sure_change.call(this, value, ObservableChangeTypes.setted);
            if (src !== undefined)
                this.update(src);
            return this.change;
        };
        this.update = function (src) {
            if (!this.change)
                return false;
            var evt = this.change;
            this.change = null;
            this.old = this.value;
            evt.src = src;
            if (this.$publish(evt, this, function (extras) { return extras === false; }))
                return false;
            return true;
        };
    }
    exports.ObservableValue = ObservableValue;
    function ObservableObject(inital, schema, name, superOb) {
        var _a;
        this.get = function () {
            var result = {};
            var $observable = this.$observable;
            for (var propname in this.schema) {
                result[propname] = $observable[propname]();
            }
            return result;
        };
        this.set = function (value, src) {
            var settingValue = value || {};
            this.value = value;
            var ob = this.$observable;
            var schema = this.schema;
            var mod = observable.mode;
            observable.mode = ObservableModes.delay;
            var hasChanges = false;
            for (var propname in schema) {
                var prop = ob[propname];
                var propOb = prop(Observable);
                var propValue = settingValue[propname];
                var propChange = propOb.set(propValue);
                if (propChange) {
                    var change = sure_change.call(this, value, ObservableChangeTypes.changed, propChange, propname);
                    hasChanges = true;
                }
            }
            observable.mode = mod;
            if (hasChanges) {
                var change = this.change;
                if (src !== undefined)
                    this.update(src);
                return change;
            }
        };
        this.update = function (src) {
            if (!this.change)
                return false;
            var evt = this.change;
            evt.src = src;
            this.change = null;
            this.old = this.value;
            if (this.$publish(evt, this, function (extras) { return extras === false; }))
                return false;
            var schema = this.schema;
            var $observable = this.$observable;
            for (var propname in schema) {
                var propOb = $observable[propname](Observable);
                propOb.update(src);
            }
            return true;
        };
        initObservable.call(this, inital, schema, name, superOb);
        var Ob = this.$observable;
        if (!is_object(inital)) {
            inital = {};
        }
        if (schema) {
            this.schema = schema;
            for (var propname in schema) {
                var propValue = inital[propname];
                var Ob_1 = new Observable(propValue, schema[propname], propname, this);
                Object.defineProperty(observable, propValue, { enumerable: true, configurable: true, writable: false, value: Ob_1.$observable });
            }
        }
        else {
            schema = this.schema = new Schema(undefined, name, (_a = superOb) === null || _a === void 0 ? void 0 : _a.schema);
            for (var propname in inital) {
                var propValue = inital[propname];
                var propOb = new Observable(propValue, null, propname, this);
                Object.defineProperty(Ob, propValue, { enumerable: true, configurable: true, writable: false, value: propOb.$observable });
            }
        }
    }
    exports.ObservableObject = ObservableObject;
    function ObservableArray(inital, schema, name, superOb) {
        var _a;
        this.get = function () {
            var result = [];
            for (var i = 0, j = this.length.value; i < j; i++) {
                var item = ob[i]();
                result.push(item);
            }
            return result;
        };
        this.set = function (value, src) {
            var settingValue = value && value.push ? value : [];
            this.value = value;
            var ob = this.$observable;
            var itemSchema = this.schema.item;
            var hasChanges = false;
            var mod = observable.mode;
            observable.mode = ObservableModes.delay;
            this.length.set(settingValue.length);
            for (var i = 0, j = settingValue.length; i < j; i++) {
                var itemValue = settingValue[i];
                var item = ob[i];
                var itemOb = void 0;
                var itemChange = void 0;
                if (!item) {
                    itemOb = new Observable(itemValue, itemSchema, i, this);
                    item = itemOb.$observable;
                    Object.defineProperty(ob, i, { enumerable: true, writable: false, configurable: true, value: itemOb });
                    itemChange = {
                        type: ObservableChangeTypes.appended,
                        sender: item,
                        old: undefined,
                        value: item
                    };
                    itemOb.change = itemChange;
                }
                else {
                    itemOb = item(Observable);
                    itemChange = itemOb.set(itemValue);
                }
                if (itemChange) {
                    sure_change.call(this, value, ObservableChangeTypes.changed, itemChange, i);
                    hasChanges = true;
                }
            }
            observable.mode = mod;
            if (hasChanges) {
                var change = this.change;
                if (src !== undefined)
                    this.update(src);
                return change;
            }
        };
        // this.set = observable_setObject
        this.update = function (src) {
            if (!this.change)
                return false;
            var evt = this.change;
            this.change = null;
            evt.src = src;
            if (this.$publish(evt, this) === false)
                return false;
            var oldLength = this.length.old;
            var newLength = this.length.value;
            if (!this.length.update(src))
                return false;
            var ob = this.$observable;
            var hasChanges = false;
            for (var i = 0, j = newLength; i < j; i++) {
                var item = ob[i];
                var itemOb = item(Observable);
                if (itemOb.update(src))
                    hasChanges = true;
            }
            for (var i = newLength, j = oldLength; i < j; i++) {
                var item = ob[i];
                delete ob[i];
                var itemOb = item(Observable);
                if (itemOb.change) {
                    itemOb.change.type = ObservableChangeTypes.removed;
                    if (itemOb.update(src))
                        hasChanges = true;
                }
            }
            return hasChanges;
        };
        var initialValue = inital || [];
        this.type = ModelTypes.array;
        initObservable.call(this, inital, schema, name, superOb);
        var ob = this.$observable;
        make_arrayObservable(ob, this);
        make_arrayLength(initialValue.length, ob, this);
        if (!schema) {
            schema = this.schema = new Schema(undefined, name, (_a = superOb) === null || _a === void 0 ? void 0 : _a.schema);
        }
        var itemSchema = schema.$asArray();
        for (var i = 0, j = initialValue.length; i < j; i++) {
            var itemValue = initialValue[i];
            var itemOb = new Observable(itemValue, itemSchema, i, this);
            Object.defineProperty(ob, i, { enumerable: true, configurable: true, writable: false, value: itemOb.$observable });
        }
    }
    exports.ObservableArray = ObservableArray;
    function create_observable(info) {
        var ob = function (value, isCapture, disposer) {
            if (value === undefined)
                return info.value;
            if (value === Schema)
                return info.schema;
            if (value === Observable)
                return info;
            if (value === observable)
                return ob;
            if (value === exports.NONE)
                value = undefined;
            else if (value.$Observable)
                value = value.$Observable.value;
            if (isCapture === undefined) {
                info.set(value, disposer);
            }
            else if (isCapture === true) {
                info.$subscribe(value, true, disposer);
            }
            else if (isCapture === false) {
                info.$subscribe(value, false, disposer);
            }
            else if (isCapture === null) {
                info.$unsubscribe(value);
            }
            else
                throw new Exception('observable的第2个参数类型不正确，只能为undefined/null/true,false');
            return ob;
        };
        ob.toString = function () { return info.value === undefined || info.value === null ? '' : info.value.toString(); };
        Object.defineProperty(ob, '$observable', { configurable: false, writable: false, enumerable: false, value: ob });
        Object.defineProperty(ob, '$Observable', { configurable: false, writable: false, enumerable: false, value: info });
        return ob;
    }
    function sure_change(value, defaultType, subChange, index) {
        var change = this.change;
        if (this.change) {
            change = this.change;
        }
        else {
            change = this.change = {
                type: defaultType,
                old: this.old,
                value: value,
                sender: this
            };
        }
        change.value = value;
        if (subChange) {
            var changes = change.changes || (change.changes = {});
            changes[index] = subChange;
        }
        return change;
    }
    function make_arrayLength(len, arr, aOb) {
        var length = aOb.length = new Observable(len, null, 'length', aOb);
        Object.defineProperty(arr, 'length', { enumerable: false, configurable: false, writable: false, value: length.$observable });
        var set = length.set;
        length.set = function (len, src) {
            var old = Math.max(length.value, length.old);
            if (len > old) {
                for (var i = old; i < len; i++) {
                    var item = arr[i];
                    if (!item) {
                        var itemOb = new Observable(undefined, aOb.schema.$item, i, aOb);
                        Object.defineProperty(arr, i, { enumerable: true, configurable: true, writable: false, value: itemOb.$observable });
                    }
                }
            }
            var change = set.call(this, len, src);
            return change;
        };
    }
    function make_arrayObservable(Ob, ob) {
        ob.push = function () {
            var len = Ob.length.value;
            for (var i in arguments) {
                var itemValue = arguments[i];
                var itemOb = new Observable(itemValue, Ob.schema.$item, len, Ob);
                Object.defineProperty(ob, len, { enumerable: true, configurable: true, writable: false, value: itemOb.$observable });
                len++;
            }
            Ob.length.set(len);
            return ob;
        };
        ob.pop = function (token) {
            var len = Ob.length.value;
            if (len === 0) {
                if (token === Observable || token === observable)
                    return exports.NONE;
                return undefined;
            }
            var lastItem = ob[len];
            Ob.length.set(len - 1);
            if (token === Observable)
                return lastItem(Observable);
            if (token === observable)
                return lastItem;
            return lastItem();
        };
        ob.unshift = function () {
            var appendCount = arguments.length;
            var oldLen = Ob.length.value;
            var newLen = oldLen + appendCount;
            for (var appendIndex = newLen - 1; appendIndex >= oldLen; appendIndex--) {
                var existItem = ob[appendIndex - oldLen];
                //构造出后面的item
                var itemOb = new Observable(existItem(), Ob.schema.$item, appendIndex, Ob);
                Object.defineProperty(ob, appendIndex, { enumerable: true, configurable: true, writable: false, value: itemOb.$observable });
            }
            for (var i = oldLen; i >= appendCount; i--) {
                var oldPosItem = ob[i - appendCount];
                var newPosItem = ob[i];
                newPosItem(oldPosItem());
            }
            for (var i = 0; i < appendCount; i++) {
                ob[i](arguments[i]);
            }
            Ob.length.set(newLen);
            return ob;
        };
        ob.shift = function () {
            var len = Ob.length.value;
            if (len === 0) {
                return undefined;
            }
            var first = ob[0];
            for (var i = 1; i < len; i++) {
                ob[i - 1](ob[i]());
            }
            Ob.length.set(len - 1);
            return ob;
        };
    }
    var ObservableModes;
    (function (ObservableModes) {
        ObservableModes[ObservableModes["delay"] = 0] = "delay";
        ObservableModes[ObservableModes["immediately"] = 1] = "immediately";
    })(ObservableModes = exports.ObservableModes || (exports.ObservableModes = {}));
    function observable(initial) {
    }
    observable.mode = ObservableModes.delay;
});
//# sourceMappingURL=YA.core.js.map
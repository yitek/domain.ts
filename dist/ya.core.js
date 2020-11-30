///////////////////////////////////////////////////////////////
// 类型判断
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
    var eastWordRegx = /[-_](\w)/g;
    var firstUpperCaseRegx = /^([A-Z])/g;
    var firstLowerCaseRegx = /^([a-z])/g;
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
    function startWith(text, token) {
        if (!text)
            return false;
        if (token === undefined || token === null)
            return false;
        return text.toString().indexOf(token.toString()) === 0;
    }
    exports.startWith = startWith;
    /**
     * 判定字符串是否以某个串结束
     *
     * @export
     * @param {*} text 要检测的字符串
     * @param {*} token 结束标记字符串
     * @returns {boolean}
     */
    function endWith(text, token) {
        if (!text)
            return false;
        if (token === undefined || token === null)
            return false;
        text = text.toString();
        token = token.toString();
        return text.indexOf(token) === text.length - token.length;
    }
    exports.endWith = endWith;
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
    function deepClone(obj, _clones) {
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
            var clone = is_array(obj) ? [] : {};
            _clones.push({ origin: obj, cloned: clone });
            for (var n in obj) {
                clone[n] = deepClone(obj[n], _clones);
            }
        }
        else
            return obj;
    }
    exports.deepClone = deepClone;
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
    exports.inherit = (function () {
        return function (ctor, base) {
            //extendStatics(ctor, base);
            function __() { Object.defineProperty(this, 'constructor', { value: ctor, enumerable: false, configurable: true, writable: true }); }
            ctor.prototype = base === null ? Object.create(base) : (__.prototype = base.prototype, new __());
            return ctor;
        };
    })();
    function create(ctor, args) {
        var res = Object.create(ctor.prototype);
        if (args === true) {
            args = [];
            //TODO: 依赖注入
        }
        ctor.apply(res, args || []);
        return res;
    }
    exports.create = create;
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
                for (var _i = 0, name_1 = name; _i < name_1.length; _i++) {
                    var membername = name_1[_i];
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
    function constant(enumerable, target, name, value) {
        return accessable({ enumerable: enumerable !== false, writable: false, configurable: true }, target, name, value);
    }
    exports.constant = constant;
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
    var ObservableTypes;
    (function (ObservableTypes) {
        ObservableTypes[ObservableTypes["value"] = 0] = "value";
        ObservableTypes[ObservableTypes["object"] = 1] = "object";
        ObservableTypes[ObservableTypes["array"] = 2] = "array";
    })(ObservableTypes || (ObservableTypes = {}));
    var Schema = /** @class */ (function () {
        function Schema(defaultValue, name, owner) {
            implicit(this, {
                '$defaultValue': defaultValue,
                '$owner': owner,
                '$name': name,
                '$type': ObservableTypes.value,
                '$itemSchema': undefined
            });
            if (!defaultValue || typeof defaultValue !== 'object')
                return;
            if (defaultValue.length !== undefined && defaultValue.push && defaultValue.pop) {
                this.$asArray(deepClone(defaultValue[0]));
            }
            else {
                for (var n in defaultValue)
                    this.$prop(n, deepClone(defaultValue[n]));
            }
        }
        Schema_1 = Schema;
        Schema.prototype.$prop = function (name, defaultValue) {
            if (this.$type === ObservableTypes.array)
                throw new Exception('已经定义为array了', { 'schema': this });
            this.$type = ObservableTypes.object;
            return this[name] || (this[name] = new Schema_1(defaultValue, name, this));
        };
        Schema.prototype.$asArray = function (defaultItemValue) {
            if (this.$type !== ObservableTypes.value)
                throw new Exception('已经定义为array/object了', { 'schema': this });
            this.$type = ObservableTypes.array;
            var lengthSchema = new Schema_1(0, 'length', this);
            Object.defineProperty(this, 'length', { enumerable: false, configurable: false, writable: false, value: lengthSchema });
            var itemSchema = new Schema_1(defaultItemValue, null, this);
            return this.$item = itemSchema;
        };
        Schema.prototype.$paths = function () {
            var paths = this['--paths'];
            if (!paths)
                paths = buildSchemaInfo.call(this).paths;
            return paths;
        };
        Schema.prototype.$root = function () {
            var root = this['--root'];
            if (!root)
                root = buildSchemaInfo.call(this).root;
            return root;
        };
        var Schema_1;
        Schema = Schema_1 = __decorate([
            implicit()
        ], Schema);
        return Schema;
    }());
    exports.Schema = Schema;
    function buildSchemaInfo() {
        var schema = this;
        var paths = [];
        var root;
        while (schema) {
            root = schema;
            paths.unshift(schema.$name);
            schema = schema.$owner;
        }
        constant(false, this, '--paths', paths);
        constant(false, this, '--root', root);
        return { paths: paths, root: root };
    }
    var schemaBuilderTrigger = {
        get: function (target, propname) {
            if (propname[0] === '$') {
                if (propname === '$schema')
                    return target;
                return target[propname];
            }
            return new Proxy(target.$prop(propname), schemaBuilderTrigger);
        },
        set: function (target, propname) {
            throw new Exception('schemaBuilder不可以在schemaBuilder上做赋值操作');
        }
    };
    function schemaBuilder(target) {
        target || (target = new Schema());
        return new Proxy(target, schemaBuilderTrigger);
    }
    exports.schemaBuilder = schemaBuilder;
    ////////////////////////////////////
    // createElement
    var NodeDescriptor = /** @class */ (function () {
        function NodeDescriptor(tag, attrs) {
            if (attrs === NodeDescriptor) {
                this.content = tag;
            }
            else {
                this.tag = tag;
                this.attrs = attrs;
            }
        }
        NodeDescriptor.prototype.appendChild = function (child) {
            var children = this.children || (this.children = []);
            if (child instanceof NodeDescriptor) {
                children.push(child);
            }
            else
                children.push(new NodeDescriptor(child, NodeDescriptor));
            return this;
        };
        NodeDescriptor.invoke = function (fn) {
        };
        return NodeDescriptor;
    }());
    exports.NodeDescriptor = NodeDescriptor;
    function _createElement(tag, attrs) {
        var vnode = new NodeDescriptor(tag, attrs);
        if (arguments.length > 2) {
            vnode.children = [];
            for (var i = 2, j = arguments.length; i < j; i++) {
                var child = arguments[i];
                if (child)
                    vnode.appendChild(child);
            }
        }
        return vnode;
    }
    exports.createElement = _createElement;
    var currentContext;
    function vars(count) {
        var result;
        var prefix = '--local-';
        var tmpNameIndex = '--';
        var context = currentContext || {};
        var varnum = context[tmpNameIndex] || (context[tmpNameIndex] = 0);
        var t = typeof count;
        if (t === 'number') {
            result = [];
            for (var i = 0, j = count; i < j; i++) {
                var schema = new Schema(undefined, prefix + (++varnum));
                context[schema.$name] = schema;
                var schemaProxy = schemaBuilder(schema);
                result.push(schemaProxy);
            }
        }
        else if (t === 'object') {
            result = {};
            for (var n in count) {
                var schema = new Schema(count[n], prefix + n);
                context[schema.$name] = schema;
                var schemaProxy = schemaBuilder(schema);
                result[n] = schemaProxy;
            }
        }
        else if (arguments.length === 0) {
            var schema = new Schema(undefined, prefix + (++varnum));
            context[schema.$name] = schema;
            result = schemaBuilder(schema);
        }
        else {
            result = {};
            for (var i = 0, j = arguments.length; i < j; i++) {
                var name_2 = prefix + arguments[i];
                var schema = new Schema(undefined, name_2);
                context[schema.$name] = schema;
                var schemaProxy = schemaBuilder(schema);
                result[name_2] = schemaProxy;
            }
        }
        context[tmpNameIndex] = varnum;
        return result;
    }
    exports.vars = vars;
    function observable(initial, name, owner) {
        if (owner) {
            var facade = owner[name];
            if (facade)
                return facade(initial);
            var ownerOb = owner(Observable);
            var ob = new Observable(initial, undefined, ownerOb, name);
            Object.defineProperty(owner, name, { enumerable: true, configurable: false, writable: false, value: ob.$observable });
            return ob.$observable;
        }
        else {
            if (initial instanceof Schema)
                return new Observable(undefined, initial).$observable;
            return new Observable(initial).$observable;
        }
    }
    exports.observable = observable;
    var Observable = /** @class */ (function () {
        function Observable(inital, schema, owner, name) {
            var _this = this;
            var _a;
            var facade;
            facade = function (value, isSubscriber) {
                if (value === undefined) {
                    return _this.value === Observable_1 ? _this.old : _this.value;
                }
                else if (value === Observable_1)
                    return _this;
                else if (value === Schema)
                    return _this.schema;
                if (isSubscriber !== undefined) {
                    if (isSubscriber)
                        _this.subscribe(value, isSubscriber);
                    if (isSubscriber === false)
                        _this.unsubscribe(value);
                    return facade;
                }
                if (value) {
                    if (value instanceof Schema)
                        throw new Exception('不能够将Schema赋值给observable');
                    if (value.$Observable)
                        value = value();
                    else if (value.$observable)
                        value = value.value;
                }
                _this.setValue(value);
                return _this.$observable;
            };
            this.$observable = facade;
            Object.defineProperty(facade, '$Observable', { enumerable: false, configurable: false, writable: false, value: this });
            this.value = Observable_1;
            schema = this.schema = schema || new Schema(inital, name, (_a = owner) === null || _a === void 0 ? void 0 : _a.schema);
            this.name = name || schema.$name;
            this.type = schema.$type;
            if (this.type === ObservableTypes.object) {
                this.setValue = objectSet;
                this.update = objectUpdate;
                this.old = inital || {};
                for (var name_3 in schema) {
                    var member = new Observable_1(this.old[name_3], schema[name_3], this, name_3);
                    Object.defineProperty(facade, name_3, { enumerable: true, configurable: false, writable: false, value: member.$observable });
                }
            }
            else if (this.type === ObservableTypes.array) {
                this.setValue = arraySet;
                this.update = arrayUpdate;
                var lengthSchema = schema.length;
                var lengthObservable = new Observable_1(this.old.length, lengthSchema, this, 'length');
                Object.defineProperty(facade, 'length', { enumerable: false, configurable: false, writable: false, value: lengthObservable.$observable });
                this.old = inital = inital || [];
                if (inital)
                    for (var i = 0, j = inital.length; i < j; i++) {
                        var name_4 = i.toString();
                        var itemObservable = new Observable_1(inital[i], this.schema.$item, this, name_4);
                        Object.defineProperty(facade, name_4, { enumerable: false, configurable: true, writable: false, value: itemObservable.$observable });
                    }
            }
            else {
                this.old = inital || schema.$defaultValue;
            }
        }
        Observable_1 = Observable;
        Observable.prototype.getValue = function () {
            return this.value === Observable_1 ? this.old : this.value;
        };
        Observable.prototype.setValue = function (value) {
            this.value = value;
            return this;
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
        Observable.prototype.update = function (bubble, src) {
            var evt = update.call(this, src, arguments[2]);
            if (bubble && evt && evt.bubble !== false)
                dispachBubble.call(this, evt);
            return this;
        };
        var Observable_1;
        Observable = Observable_1 = __decorate([
            implicit()
        ], Observable);
        return Observable;
    }());
    exports.Observable = Observable;
    function objectSet(value) {
        if (!value)
            value = {};
        var facade = this.facade;
        for (var name_5 in facade) {
            var prop = facade[name_5];
            prop(value[name_5]);
        }
        this.value = value;
        return this;
    }
    function arraySet(value) {
        if (!value)
            value = [];
        var facade = this.$observable;
        for (var i = 0, j = value.length; i < j; i++) {
            var name_6 = i.toString();
            var item = facade[name_6];
            if (item) {
                item(value[i]);
                continue;
            }
            item = new Observable(value[i], this.$schema.$item, this, name_6);
            Object.defineProperty(facade, name_6, { configurable: true, writable: false, enumerable: true, value: item.$observable });
        }
        this.value = value;
        this.length.setValue(value.length);
        return this;
    }
    function update(src, isRemoved) {
        var value = this.value === Observable ? this.old : this.value;
        if (this.value === Observable || this.value === this.old)
            return undefined;
        var evt = {
            value: value,
            old: this.old,
            src: src,
            sender: this,
            removed: isRemoved === true
        };
        this.old = value;
        this.value = Observable;
        var handlers = this.listeners;
        if (handlers)
            for (var i = 0, j = handlers.length; i < j; i++) {
                handlers[i].call(this, evt);
            }
        return evt;
    }
    function dispachBubble(evt) {
        var owner = this.owner;
        while (owner && evt.bubble === false) {
            var handlers = owner.captures;
            if (handlers) {
                for (var i = 0, j = handlers.length; i < j; i++) {
                    handlers[i].call(this, evt);
                }
            }
            owner = owner.owner;
        }
    }
    function objectUpdate(bubble, src, isRemoved) {
        var evt = update.call(this, src, isRemoved);
        if (bubble !== false && evt) {
            dispachBubble.call(this, evt);
        }
        if (evt.cancel)
            return this;
        var facade = this.$observable;
        for (var n in this) {
            var prop = facade[n](Observable);
            prop.update(bubble, evt);
        }
        return this;
    }
    function arrayUpdate(bubble, src, isRemoved) {
        var _a, _b;
        var evt = update.call(this, src, isRemoved);
        var lengthEvt = update.call(this.length, src);
        if (bubble !== false && evt) {
            dispachBubble.call(this, evt);
        }
        if (bubble !== false && lengthEvt) {
            dispachBubble.call(this.length, lengthEvt);
        }
        if (((_a = evt) === null || _a === void 0 ? void 0 : _a.cancel) || ((_b = lengthEvt) === null || _b === void 0 ? void 0 : _b.cancel))
            return this;
        var facade = this.$observable;
        if (evt.old.length > evt.value.length) {
            for (var i = 0, j = evt.value.length; i < j; i++) {
                var item = facade[i](Observable);
                item.update(bubble, evt);
            }
            for (var i = evt.value.length, j = evt.old.length; i < j; i++) {
                var item = facade[i](Observable);
                item.update.call(item, false, evt, true);
                delete facade[i];
            }
        }
        return this;
    }
    var Scope = /** @class */ (function () {
        function Scope(parentOrThis, name) {
            if (parentOrThis instanceof Scope_1) {
                constant(false, this, '--parent', parentOrThis);
                constant(false, this, '--this', parentOrThis['--ya-this']);
            }
            else {
                constant(false, this, '--this', parentOrThis);
            }
            constant(false, this, '--name', name);
        }
        Scope_1 = Scope;
        Scope.prototype.$observable = function (schema, inital, deepSearch) {
            var paths = schema.$paths();
            var name = paths[0];
            var scope = this;
            var root;
            if (deepSearch === false) {
                root = scope[name];
                if (!root) {
                    var rootSchema = schema.$root();
                    root = this[name] = new Observable(inital, rootSchema, undefined, rootSchema.$name).$observable;
                }
            }
            else {
                while (scope) {
                    root = scope[name];
                    if (root)
                        break;
                    scope = scope["--parent"];
                }
            }
            var result = root;
            for (var i = 1, j = paths.length; i < j; i++) {
                result = result[paths[i]];
                if (!result)
                    debugger;
            }
            return result;
        };
        Scope.prototype.$createScope = function (name) {
            return new Scope_1(this, name);
        };
        var Scope_1;
        Scope = Scope_1 = __decorate([
            constant(false)
        ], Scope);
        return Scope;
    }());
    exports.Scope = Scope;
    var metas = {};
    function resolveMeta(template, meta) {
        var schema = new Schema(undefined, '--this');
        var builder = schemaBuilder(schema);
        var descriptor, renderer, ctor;
        if (typeof template.prototype.render === 'function') {
            ctor = template;
            descriptor = template.prototype.render.call(builder, builder);
            renderer = function (component, scope) { return render({
                descriptor: descriptor, scope: scope, component: component
            }); };
        }
        else {
            // 看直接调用是否会返回 NodeDescriptor
            try {
                descriptor = template.call(builder, builder);
            }
            catch (_a) {
                descriptor = undefined;
                schema = undefined;
            }
            if (descriptor !== undefined) {
                ctor = exports.inherit(function () { Component.call(this); }, Component);
                renderer = function (component, scope) { return render({
                    descriptor: descriptor, scope: scope, component: component
                }); };
            }
            else {
                var inst = new template();
                if (typeof inst.render === 'function') {
                    try {
                        descriptor = inst.render.call(builder, builder);
                    }
                    catch (_b) {
                        descriptor = undefined;
                        schema = undefined;
                    }
                    if (descriptor) {
                        ctor = inst;
                        renderer = function (component, scope) { return render({
                            descriptor: descriptor, scope: scope, component: component
                        }); };
                    }
                }
            }
        }
        //if(!descriptor) throw new Exception('不正确的render函数',{render:template})
        if (!meta)
            meta = {};
        return meta.resolved = true, meta.descriptor = descriptor, meta.ctor = ctor, meta.renderer = renderer, meta.schema = schema, meta['--meta'] = meta;
    }
    /////////////////////////////////////////////////
    // runtime
    var RuntimeInfo = /** @class */ (function () {
        function RuntimeInfo(meta, opts, parent) {
            this.meta = meta;
            var component = this.component = create(meta.ctor, true);
            constant(false, component, '--', this);
            if (meta.props && opts)
                for (var i in meta.props) {
                    var n = meta.props[i];
                    component[n] = opts[n];
                }
            var model = this.model = new Observable(component, meta.schema, undefined, 'this').$observable;
            this.scope = new Scope(model, meta.tag);
            if (typeof component.created === 'function')
                component.created();
            if (parent)
                parent.appendChild(this);
        }
        RuntimeInfo.prototype.render = function () {
            return render({ scope: this.scope, component: this.component, descriptor: this.meta.descriptor });
        };
        RuntimeInfo.prototype.appendChild = function (child) {
            if (child.parent)
                throw new Exception('该component已经有父级,不可以再指定父级', child);
            child.parent = this;
            var node = child.render();
            exports.platform.appendChild(this.node, node);
            var parentRTInfo = parent['--'];
            var children = parentRTInfo.children || (parentRTInfo.children = []);
            children.push(this);
            if (this.mounted) {
                if (typeof child.component.mounted) {
                    child.component.mounted();
                }
            }
            return this;
        };
        RuntimeInfo.prototype.mount = function (container) {
            if (this.mounted)
                throw new Exception('不可以重复挂载', this);
            if (this.parent)
                throw new Exception('不可以只能挂载根组件，该组件已经有父组件', this);
            var node = this.render();
            exports.platform.mount(container, node);
            function mount(info) {
                info.mounted = true;
                if (typeof info.component.mounted === 'function') {
                    info.component.mounted();
                }
                if (info.children)
                    for (var i in info.children)
                        mount(info.children[i]);
            }
            mount(this);
            return this.component;
        };
        RuntimeInfo.prototype.dispose = function () {
            if (typeof this.component.dispose === 'function') {
                try {
                    this.component.dispose();
                }
                catch (ex) {
                    console.error("dispose错误", ex);
                }
            }
            if (this.dispose)
                for (var i in this.children)
                    this.children[i].dispose();
            this.disposed = true;
        };
        return RuntimeInfo;
    }());
    var Runtime = /** @class */ (function () {
        function Runtime() {
            this.tick = 50;
            this.roots = [];
        }
        Runtime.prototype.mount = function (container, renderer, opts) {
            if (!renderer)
                return;
            var meta = renderer['--meta'];
            if (!meta)
                meta = resolveMeta(renderer);
            var rtInfo = new RuntimeInfo(meta, opts);
            this._addRoot(rtInfo);
            return rtInfo;
        };
        Runtime.prototype._addRoot = function (root) {
            if (root.parent)
                throw new Exception('不是顶级控件，不可以挂载', root);
            this.roots.push(root);
            if (!this.timer) {
                this.timer = setTimeout(function () { }, this.tick);
            }
        };
        Runtime.prototype._tick = function () {
            var _this = this;
            for (var i = 0, j = this.roots.length; i < j; i++) {
                var rtInfo = this.roots.shift();
                if (!rtInfo.disposed) {
                    if (!exports.platform.alive(rtInfo.node)) {
                        rtInfo.dispose();
                        continue;
                    }
                    rtInfo.model(Observable).update(false, this);
                    this.roots.push(rtInfo);
                }
            }
            if (this.roots.length)
                this.timer = setTimeout(function () { return _this._tick(); }, this.tick);
            else
                this.timer = 0;
        };
        return Runtime;
    }());
    exports.runtime = new Runtime();
    function mount(container, opts, extra) {
        var t = typeof opts;
        if (t === 'function') {
            var meta = resolveMeta(opts);
            var rt = new RuntimeInfo(meta, opts);
            debugger;
            return rt.mount(container);
        }
        throw "not implement";
    }
    exports.mount = mount;
    function render(context) {
        var descriptor = context.descriptor;
        if (descriptor.attrs) {
            for (var n in specialAttributeRenders) {
                var opts = descriptor.attrs[n];
                if (opts !== undefined)
                    return specialAttributeRenders[n](n, opts, context);
            }
        }
        if (descriptor.content !== undefined) {
            return renderText(descriptor.content, context);
        }
        var componentType = descriptor.component || metas[descriptor.tag];
        if (componentType) {
        }
        else {
            if (descriptor.tag)
                return renderNode(descriptor.tag, context);
            return renderText(descriptor.content, context);
        }
    }
    exports.render = render;
    function renderText(content, context) {
        var _a = resolveBindValue(content, context), value = _a.value, observable = _a.observable;
        debugger;
        var node = exports.platform.createText(value);
        if (observable)
            observable(function (evt) {
                node.nodeValue = evt.value;
            }, context.component);
        return node;
    }
    function renderNode(tag, context) {
        debugger;
        var descriptor = context.descriptor;
        var node = exports.platform.createElement(tag);
        var attrs = descriptor.attrs;
        if (attrs) {
            var _loop_1 = function (attrName) {
                var _a = resolveBindValue(attrs[attrName], context), value = _a.value, observable_1 = _a.observable;
                var attrBinder = nodeAttributeBinders[attrName];
                if (attrBinder) {
                    attrBinder(node, attrName, value, observable_1, context);
                }
                else {
                    exports.platform.setAttribute(node, attrName, value);
                    if (observable_1)
                        (function (attrName, node, platform, component) {
                            var _a;
                            (_a = observable_1) === null || _a === void 0 ? void 0 : _a.subscribe(function (evt) {
                                platform.setAttribute(node, attrName, evt.value);
                            }, component);
                        })(attrName, node, exports.platform, context.component);
                }
            };
            for (var attrName in attrs) {
                _loop_1(attrName);
            }
        }
        if (descriptor.children) {
            for (var i = 0, j = descriptor.children.length; i < j; i++) {
                var childNode = render({ scope: context.scope, component: context.component, descriptor: descriptor.children[i] });
                if (childNode === undefined)
                    debugger;
                exports.platform.appendChild(node, childNode);
            }
        }
        return node;
    }
    var nodeAttributeBinders = {};
    function nodeEventBinder(node, attrName, attrValue, attrObservable, context) {
        var evtName = attrName.substr(2);
        var component = context.component;
        exports.platform.attach(node, evtName, getListener(attrValue, component));
        if (attrObservable)
            attrObservable(function (evt) {
                if (evt.old) {
                    var listener = evt.old['--listener'] || evt.old;
                    exports.platform.detech(node, evtName, listener);
                }
                exports.platform.attach(node, evtName, getListener(evt.value, component));
            }, context.component);
    }
    constant(false, nodeEventBinder, '--event-binder', true);
    var evtnames = ['onclick', 'ondblclick', 'onsubmit', 'onfocus', 'onblur', 'onmouseenter', 'onmouseout', 'onmouseover', 'onmousemove', 'onmousedown', 'onmouseup', 'onkeypress', 'onkeydown', 'onkeyup', 'onchange', 'onload', 'onresize'];
    for (var i in evtnames)
        nodeAttributeBinders[evtnames[i]] = nodeEventBinder;
    function getListener(fn, component) {
        var listener = fn['--listener'];
        if (listener)
            return listener;
        if (!component)
            return fn;
        listener = function (evt) { return fn.call(component, evt, component); };
        constant(false, fn, '--listener', listener);
        return listener;
    }
    var specialAttributeRenders = {};
    specialAttributeRenders['y-for'] = function (attrName, attrValue, context) {
        var asSchema = attrValue.as;
        var _a = resolveBindValue.call(attrValue.each, context.scope, context), value = _a.value, observable = _a.observable;
        var exists = [];
        makeFor(attrName, asSchema, value, observable, exists, context);
        constant(false, observable, '--each-elements', exists);
        if (observable)
            observable.subscribe(function (evt) {
                makeFor(attrName, asSchema, evt.value, evt.sender, exists, context);
                evt.cancel = true;
            }, context.component);
    };
    function makeFor(attrName, asSchema, eachValue, eachObservable, exists, context) {
        var descriptor = context.descriptor, scope = context.scope;
        var tmp = descriptor.attrs['y-for'];
        descriptor.attrs[attrName] = null;
        for (var i = 0, j = eachValue.length; i < j; i++) {
            var existed = exists.shift();
            if (existed) {
                existed['--loop-variable'].setValue(eachValue[i]);
                exists.push(existed);
            }
            else {
                var loopScope = scope.$createScope(i.toString());
                var loopVariable = loopScope.$observable(eachValue[i], asSchema, false);
                var node = render({
                    descriptor: descriptor, scope: loopScope, component: context.component
                });
                constant(false, node, '--loop-variable', loopVariable);
                exists.push(node);
            }
        }
        for (var i = eachValue.length, j = exists.length; i < j; i++) {
            var removed = exists.shift();
            drop(removed);
        }
        exists.length = eachValue.length;
        descriptor.attrs[attrName] = tmp;
    }
    function resolveBindValue(bindValue, context, bind) {
        var observable;
        var value = bindValue;
        if (value) {
            if (value instanceof Schema) {
                var ob = context.scope.$observable(value.$schema || value);
                value = ob();
            }
            else if (value instanceof Observable) {
                observable = value.$observable;
                value = observable.getValue();
            }
            else if (value.$Observable) {
                observable = value;
                value = observable();
            }
            else if (value.$Observable && value.apply && value.call) {
                observable = value.$Observable;
                value = observable.getValue();
            }
        }
        if (bind)
            bind(value, observable);
        return { observable: observable, value: value };
    }
    exports.resolveBindValue = resolveBindValue;
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
    function component(tag, ctor) {
        var decorator = function (target) {
            var meta = resolveMeta(ctor);
            if (tag) {
                meta.tag = tag;
                metas[tag] = meta;
            }
            return target;
        };
        if (ctor)
            decorator(ctor);
        if (tag === undefined)
            return decorator;
        if (typeof tag === 'function') {
            tag = undefined;
            ctor = tag;
            return decorator(ctor);
        }
        return decorator;
    }
    exports.component = component;
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
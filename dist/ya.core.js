/*
class Component{
    render(){
        let {item,i,row} = eachvar(2);
        return <grid y-slot={row}>
            <column y-for={{each:this.columns ,as item}} y-if={COMPUTED(row,this.checkPermission} class={row.css} />
            
            </grid>
        </table><input y-if={this.state.writable} y-for={{each:this.items, as:item ,key:i} y-value={this.username} /><button onclick={this.reset}>Reset</button>;
    },
    reset(){
        this.username = "yiy";
    }
}
YA.mount({
    element:el,
    component:comp,//template
    opts:{
        tag:{}
    }
});
let component = YA.mount(Component,document.getElementById('abc');
component.username = "hello";
*/
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
    var trimreg = /(^\s+)|(\s+$)/g;
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
        return text.toString().replace(trimreg, "");
    }
    exports.trim = trim;
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
            if (paths)
                return paths;
            var schema = this;
            paths = [];
            while (schema) {
                paths.unshift(schema.$name);
                schema = schema.$owner;
            }
            Object.defineProperty(this, '--paths', { enumerable: false, writable: false, configurable: false, value: paths });
            return paths;
        };
        Schema.prototype.$resolveFromRoot = function (root) {
            var paths = this.$paths();
            var result = root;
            for (var i = 0, j = paths.length; i < j; i++) {
                var name_2 = paths[i];
                result = result[name_2];
                if (!result)
                    break;
            }
            return result;
        };
        var Schema_1;
        Schema = Schema_1 = __decorate([
            implicit()
        ], Schema);
        return Schema;
    }());
    exports.Schema = Schema;
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
        var context = currentContext || { '--varnum-y': 0 };
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
                var name_3 = prefix + arguments[i];
                var schema = new Schema(undefined, name_3);
                context[schema.$name] = schema;
                var schemaProxy = schemaBuilder(schema);
                result[name_3] = schemaProxy;
            }
        }
        context[tmpNameIndex] = varnum;
        return result;
    }
    exports.vars = vars;
    function observable(initial, name, owner) {
        if (owner) {
            var n = reversedNames[name] || name;
            var facade = owner[n];
            if (facade)
                return facade(initial);
            var ownerOb = owner(Observable);
            var ob = new Observable(initial, undefined, ownerOb, name);
            Object.defineProperty(owner, n, { enumerable: true, configurable: false, writable: false, value: ob.$observable });
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
            var facade = function (value, isSubscriber) {
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
                for (var n in schema) {
                    var name_4 = reversedNames[n] || n;
                    var member = new Observable_1(this.old[n], schema[n], this, n);
                    Object.defineProperty(facade, name_4, { enumerable: true, configurable: false, writable: false, value: member.$observable });
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
                        var name_5 = i.toString();
                        var itemObservable = new Observable_1(inital[i], this.schema.$item, this, name_5);
                        Object.defineProperty(facade, name_5, { enumerable: false, configurable: true, writable: false, value: itemObservable.$observable });
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
            var evt = update.call(this, src);
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
    var reversedNames = {};
    function objectSet(value) {
        if (!value)
            value = {};
        var facade = this.facade;
        for (var n in facade) {
            var name_6 = reversedNames[n] || n;
            var prop = facade[name_6];
            prop(value[n]);
        }
        this.value = value;
        return this;
    }
    function arraySet(value) {
        if (!value)
            value = [];
        var facade = this.facade;
        for (var i = 0, j = value.length; i < j; i++) {
            var item = facade[i];
            if (item) {
                item(value[i]);
                continue;
            }
            // item = createFromReactive(this.$itemSchema)
            this[i] = item;
        }
        this.value = value;
        this.length.setValue(value.length);
        return this;
    }
    function update(src) {
        var value = this.value === Observable ? this.old : this.value;
        if (this.value === Observable || this.value === this.old)
            return undefined;
        var evt = {
            value: value,
            old: this.old,
            src: src,
            sender: this
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
    function objectUpdate(bubble, src) {
        var evt = update.call(this, src);
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
    function arrayUpdate(bubble, src) {
        var evt = update.call(this, src);
        var lengthEvt = update.call(this.length, src);
        if (bubble !== false && evt) {
            dispachBubble.call(this, evt);
        }
        if (bubble !== false && lengthEvt) {
            dispachBubble.call(this.length, lengthEvt);
        }
        if (evt.cancel || lengthEvt.cancel)
            return this;
        var facade = this.$observable;
        if (evt.old.length > evt.value.length) {
            for (var i = 0, j = evt.value.length; i < j; i++) {
                var item = facade[i](Observable);
                item.update(bubble, evt);
            }
            for (var i = evt.value.length, j = evt.old.length; i < j; i++) {
                var item = facade[i](Observable);
                delete facade[i];
            }
        }
        return this;
    }
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
        return NodeDescriptor;
    }());
    exports.NodeDescriptor = NodeDescriptor;
    function render(descriptor, context, ownComponent) {
    }
    exports.render = render;
});
//# sourceMappingURL=YA.core.js.map
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
    var ReactiveTypes;
    (function (ReactiveTypes) {
        ReactiveTypes[ReactiveTypes["value"] = 0] = "value";
        ReactiveTypes[ReactiveTypes["object"] = 1] = "object";
        ReactiveTypes[ReactiveTypes["array"] = 2] = "array";
    })(ReactiveTypes || (ReactiveTypes = {}));
    var Schema = /** @class */ (function () {
        function Schema(owner, name, defaultValue) {
            if (!(owner instanceof Schema_1)) {
                defaultValue = owner;
                name = undefined;
                owner = undefined;
            }
            implicit(this, {
                '$defaultValue': defaultValue,
                '$owner': owner,
                '$name': name,
                '$type': ReactiveTypes.value,
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
            if (this.$type === ReactiveTypes.array)
                throw new Exception('已经定义为array了', { 'schema': this });
            this.$type = ReactiveTypes.object;
            return this[name] || (this[name] = new Schema_1(this, name, defaultValue));
        };
        Schema.prototype.$asArray = function (defaultItemValue) {
            if (this.$type !== ReactiveTypes.value)
                throw new Exception('已经定义为array/object了', { 'schema': this });
            this.$type = ReactiveTypes.array;
            var lengthSchema = new Schema_1(this, 'length');
            Object.defineProperty(this, 'length', { enumerable: false, configurable: false, writable: false, value: lengthSchema });
            var itemSchema = new Schema_1(this, null, defaultItemValue);
            return this.$item = itemSchema;
        };
        var Schema_1;
        Schema = Schema_1 = __decorate([
            implicit()
        ], Schema);
        return Schema;
    }());
    var schemaBuilderTrigger = {
        get: function (target, propname) {
            if (propname[0] === '$')
                return target[propname];
            return new Proxy(target.$prop(propname), schemaBuilderTrigger);
        },
        set: function (target, propname) {
            throw new Exception('schemaBuilder不可以在schemaBuilder上做赋值操作');
        }
    };
    function createSchemaBuilder(target) {
        return new Proxy(target, schemaBuilderTrigger);
    }
    exports.createSchemaBuilder = createSchemaBuilder;
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
    var Reactive = /** @class */ (function () {
        function Reactive() {
        }
        Reactive_1 = Reactive;
        Reactive.prototype.$get = function () {
            return this.$modifiedValue === Reactive_1 ? this.$value : this.$modifiedValue;
        };
        Reactive.prototype.$set = function (value) {
            return this;
        };
        Reactive.prototype.$subscribe = function (handler, disposer) {
            var handlers = this.$_changeHandlers || (this.$_changeHandlers = []);
            handlers.push(handler);
            if (disposer)
                disposer.dispose(function () {
                    array_remove(handlers, handler);
                });
            return this;
        };
        Reactive.prototype.$unsubscribe = function (handler) {
            var handlers = this.$_changeHandlers;
            array_remove(handlers, handler);
            return this;
        };
        Reactive.prototype.$change = function (evt) {
            if (this.$modifiedValue === Reactive_1)
                return this;
            if (!evt)
                evt = {};
            evt.value = this.$modifiedValue;
            evt.old = this.$value;
            this.$value = this.$modifiedValue;
            this.$modifiedValue = Reactive_1;
            var handlers = this.$_changeHandlers;
            if (handlers)
                for (var i = 0, j = handlers.length; i < j; i++) {
                    handlers[i].call(this, evt);
                }
            return this;
        };
        var Reactive_1;
        Reactive = Reactive_1 = __decorate([
            implicit()
        ], Reactive);
        return Reactive;
    }());
    exports.Reactive = Reactive;
    function valueSet(value) {
        var existValue = this.$modifiedValue === Reactive ? this.$value : this.$modifiedValue;
        if (existValue === value)
            return this;
        this.$modifiedValue = value;
        return this;
    }
    function objectSet(value) {
        if (!value)
            value = {};
        valueSet.call(this, value);
        for (var n in this) {
            var prop = this[n];
            prop.$set(value[n]);
        }
        this.$modifiedValue = value;
        return this;
    }
    function arraySet(value) {
        if (!value)
            value = [];
        for (var i = 0, j = value.length; i < j; i++) {
            var item = this[i];
            if (item) {
                item.$set(value[i]);
                continue;
            }
            // item = createFromReactive(this.$itemSchema)
            this[i] = item;
        }
        valueSet.call(this, value);
        this.length.$set(value.length);
        return this;
    }
    function valueUpdate(src) {
        if (this.$modifiedValue === Reactive)
            return;
        var evt = {
            value: this.$modifiedValue,
            old: this.$value,
            src: src,
            sender: this
        };
        this.$value = this.$modifiedValue;
        this.$modifiedValue = Reactive;
        var handlers = this.$_changeHandlers;
        if (handlers)
            for (var i = 0, j = handlers.length; i < j; i++) {
                handlers[i].call(this, evt);
            }
        return evt;
    }
    function objectUpdate(src) {
        var valueEvt = valueUpdate.call(this, src);
        if (valueEvt && valueEvt.cancel)
            return null;
        for (var n in this) {
            var prop = this[n];
            prop.$update(valueEvt);
        }
        return valueEvt;
    }
    var emptyArray = [];
    function arrayUpdate(src) {
        var old = this.$value || emptyArray;
        var valueEvt = valueUpdate.call(this, src);
        var value = this.$value;
        if (valueEvt && valueEvt.cancel)
            return null;
        if (old.length < value.length) {
        }
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
});
//# sourceMappingURL=YA.js.map
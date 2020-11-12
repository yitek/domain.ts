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
    //////////
    // 配置
    //////////
    // 加载
    var headElement;
    function defaultEntityOptionsLoader(url, callback) {
        if (!headElement) {
            var heads = document.getElementsByTagName("head");
            if (heads) { }
        }
    }
    exports.defaultEntityOptionsLoader = defaultEntityOptionsLoader;
    function internal(target, name, value, isFullfilled) {
        Object.defineProperty(target, name, { enumerable: false, configurable: isFullfilled, writable: false, value: value });
    }
    var Readiable = /** @class */ (function () {
        function Readiable() {
        }
        Readiable.prototype.ready = function (callback) {
            var callbacks = this['$-domain-readiable-callbacks'];
            if (callbacks === null) {
                var fullFillValue = this['$-domain-readiable-fulfillValue'];
                callback.call(this, fullFillValue);
                return this;
            }
            else {
                if (callbacks === undefined) {
                    callbacks = [];
                    internal(this, '$-domain-readiable-callbacks', callbacks, false);
                }
                callbacks.push(callback);
            }
            return this;
        };
        return Readiable;
    }());
    function ready(target, value) {
        var callbacks = target['$-domain-readiable-callbacks'];
        internal(target, '$-domain-readiable-callbacks', null, true);
        internal(target, '$-domain-readiable-fulfillValue', value, true);
        if (callbacks)
            for (var _i = 0, callbacks_1 = callbacks; _i < callbacks_1.length; _i++) {
                var callback = callbacks_1[_i];
                callback.call(this, value);
            }
    }
    var loadingDomains = [];
    var PropertyDescriptor = /** @class */ (function (_super) {
        __extends(PropertyDescriptor, _super);
        function PropertyDescriptor(name, opts) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.opts = opts;
            _this.type = opts.type || "string";
            _this.uiType = opts.uiType || _this.type;
            _this.dataType = opts.dataType || _this.type;
            var type = entityDescriptors[_this.type];
            if (type) {
                _this.type = type;
                type.ready(function () { return ready(_this, _this); });
            }
            else
                ready(_this, _this);
            return _this;
        }
        return PropertyDescriptor;
    }(Readiable));
    exports.PropertyDescriptor = PropertyDescriptor;
    var EntityDescriptor = /** @class */ (function (_super) {
        __extends(EntityDescriptor, _super);
        function EntityDescriptor(name, opts) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.opts = opts;
            _this.properties = {};
            if (opts) {
                if (opts.properties)
                    initEntityProperties(_this, opts);
            }
            else {
                // loadEntityOptions(name,(opts)=>{
                //     initEntityProperties(this,opts);
                // })
            }
            return _this;
            // a - b - a
        }
        return EntityDescriptor;
    }(Readiable));
    exports.EntityDescriptor = EntityDescriptor;
    function initEntityProperties(entityDescriptor, opts) {
        for (var propname in opts.properties) {
            var prop = new PropertyDescriptor(propname, opts.properties[propname]);
            entityDescriptor.properties[propname] = prop;
        }
        ready(entityDescriptor, entityDescriptor);
    }
    var entityDescriptors = {};
});
//# sourceMappingURL=domain.js.map
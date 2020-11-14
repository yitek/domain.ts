(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../YA.core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var YA = require("../YA.core");
    function basic() {
        return YA.createElement("grid", { class: "grid" });
    }
    var self = {};
    var vnodes = basic.call(self);
    console.log('basic=> <grid class="grid"></grid>', vnodes);
    //-------------------
    function This() {
        return YA.createElement("grid", { class: this.css });
    }
    var model = new YA.Schema();
    var builder = YA.schemaBuilder(model);
    vnodes = This.call(builder);
    console.log('This=> <grid class={this.css}></grid>', vnodes, model);
    //-------------------
    function Vars() {
        var _a = YA.vars(2), item = _a[0], i = _a[1];
        return YA.createElement("grid", { class: this.css },
            YA.createElement("column", { for: { each: this.items, as: item, index: i } }));
    }
    model = new YA.Schema();
    builder = YA.schemaBuilder(model);
    vnodes = Vars.call(builder);
    console.log('Vars=> <grid class={this.css}></grid>', vnodes, model);
});
//# sourceMappingURL=core.createElement.js.map
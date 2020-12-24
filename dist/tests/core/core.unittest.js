(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./disposable.unittest", "./activator.unittest", "./injectScope.unittest", "./dpath.unittest", "./schema.unittest", "./subscribable.unittest"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var disposable = require("./disposable.unittest");
    var activator = require("./activator.unittest");
    var injectable = require("./injectScope.unittest");
    var dpath = require("./dpath.unittest");
    var schema = require("./schema.unittest");
    var subscribable = require("./subscribable.unittest");
    debugger;
    disposable.default();
    activator.default();
    injectable.default();
    dpath.default();
    schema.default();
    subscribable.default();
});
//# sourceMappingURL=core.unittest.js.map
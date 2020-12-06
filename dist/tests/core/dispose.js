(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../YA.unittest", "../../YA.core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var YA_unittest_1 = require("../../YA.unittest");
    var YA_core_1 = require("../../YA.core");
    YA_unittest_1.test('core.dispose', {
        disposable: function (ASSERT) {
            var disposer = YA_core_1.disposable({});
            ASSERT({
                "调用disposable的对象会自动生成$dispose函数": function () { return typeof disposer.$dispose === 'function'; }
            });
        }
    });
});
//# sourceMappingURL=dispose.js.map
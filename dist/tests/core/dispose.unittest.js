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
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    var YA_unittest_1 = require("../../YA.unittest");
    var YA_core_1 = require("../../YA.core");
    YA_unittest_1.testable('core.dispose', {
        disposable: function (ASSERT) {
            var disposer = YA_core_1.disposable({});
            ASSERT({
                "调用disposable的对象会自动生成$dispose函数": function () { return typeof disposer.$dispose === 'function'; }
            });
            var disposeInvoked1;
            var disposeInvoked2;
            disposer.$dispose(function () { disposeInvoked1 = this; });
            disposer.$dispose(function () { return disposeInvoked2 = _this; });
            disposer.$dispose();
            ASSERT({
                "可以通过$dispose(callback)附加释放后回调函数，该函数会在$dispose()调用时被依次调用": function () { return disposeInvoked1 && disposeInvoked2; },
                '回调函数的this指向disposable本身': function () { return disposeInvoked1 === disposer; }
            });
            disposer.$dispose(function () { return disposeInvoked1 = true; });
            ASSERT({
                '已经释放的对象可以再追加释放回调，该回调函数会立即执行': function () { return disposeInvoked1 === true; }
            });
        }
    });
});
//# sourceMappingURL=dispose.unittest.js.map
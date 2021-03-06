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
    exports.default = YA_unittest_1.testable('core.observable', {
        '基础用法': function (ASSERT) {
            // 创建一个可监听对象
            var ob = YA_core_1.observable(12);
            ASSERT({
                '可以通过observable.isInstance来判断是否是可监听对象': function () { return YA_core_1.observable.isInstance(ob); },
                '可以获取值': function () { return ob() === 12; }
            });
            // 监听变化
            var change;
            ob(YA_core_1.ATTACH, function (evt) { return change = evt; });
            // 赋值并立即触发监听
            ob(32, true);
            ASSERT({
                '获取的值为新值': function () { return ob() === 32; },
                '监听函数被触发': function () { return change !== undefined; },
                '监听函数接收一个TObservableChange对象，记录了变化前的值与变化后的值': function () { return change.old === 12 && change.value === 32 && change.sender === ob; }
            });
        },
        '类型为对象的可观察对象': function (ASSERT) {
            var now = new Date();
            var schema = new YA_core_1.Schema({
                filters: {
                    keyword: 'yiy',
                    createTime: { min: null, max: now }
                },
                pageIndex: 1,
                pageSize: 10
            });
            var ob = YA_core_1.observable(schema);
            ASSERT({
                '有跟schema一样的结构': function () { return ob.filters.keyword() === 'yiy' && ob.filters.createTime.max() === now && ob.pageIndex() === 1 && ob.pageSize() === 10; }
            });
        },
        '对象上的事件冒泡': function (ASSERT) {
            var now = new Date();
            var ob = YA_core_1.observable({
                filters: {
                    keyword: 'yiy',
                    createTime: { min: null, max: now }
                },
                pageIndex: 1,
                pageSize: 10
            });
            var rootChange;
            ob.$subscribe(function (change) { return rootChange = change; }, true);
            var filterChange;
            ob.filters.$subscribe(function (change) {
                filterChange = change;
                change.cancel = true;
            }, true);
            var keywordChange;
            ob.filters.keyword.$subscribe(function (change) { return keywordChange = change; }, true);
            ob.filters.keyword('yi', true);
            ASSERT({
                '如果修改了属性值，所有上级对象都会接收到捕捉的事件': function () { return keywordChange !== undefined && filterChange !== undefined; },
                '由于filters的捕捉函数设置了cancel，所以事件不再向上冒泡': function () { return rootChange === undefined; }
            });
        },
        '对象上的事件传播': function (ASSERT) {
            var now = new Date();
            var ob = YA_core_1.observable({
                filters: {
                    createTime: { min: null, max: now },
                    keyword: 'yiy',
                }
            });
            var rootChange;
            ob.$subscribe(function (change) { return rootChange = change; });
            var filterChange;
            ob.filters.$subscribe(function (change) { return filterChange = change; });
            var createChange;
            ob.filters.createTime.$subscribe(function (change) {
                createChange = change;
                change.stop = true;
            });
            var maxChange;
            ob.createTime.max.$subscribe(function (change) { return maxChange = change; });
            ob({
                filters: {
                    keyword: 'yi',
                    createTime: { min: '2020-12-25', max: now }
                }
            }, true);
            ASSERT({
                '修改后本身与下级属性上的监听函数都将被通知': function () { return filterChange !== undefined && createChange !== undefined; },
                '由于create设置了stop,其后下级属性不再得到通知': function () { return maxChange === undefined; },
                '没有通知，但值已经赋予了': function () { return ob.filters.createTime.min() === '2020-12-25'; }
            });
        },
        '对象上的事件冒泡与传播': function (ASSERT) {
            var now = new Date();
            debugger;
            var ob = YA_core_1.observable({
                filters: {
                    keyword: 'yiy',
                    createTime: { min: null, max: now }
                },
                pageIndex: 1,
                pageSize: 10
            });
            var rootChange;
            ob.$subscribe(function (change) { return rootChange = change; }, true);
            var filterChangeCapture;
            ob.filters.$subscribe(function (change) {
                filterChangeCapture = change;
            }, true);
            var filtersChange;
            ob.filters.$subscribe(function (change) {
                filtersChange = change;
            });
            var createTimeChange;
            ob.filters.createTime.$subscribe(function (change) {
                createTimeChange = change;
                change.stop = true;
            });
            var minChange;
            ob.filters.createTime.min.$subscribe(function (change) { return minChange = change; });
            debugger;
            ob.filters({ keyword: 'yi', createTime: { min: '2020-12-24', max: now } });
            debugger;
            ob.filters.$update(null);
            ASSERT({
                '修改了中间对象，捕获的监听器跟一般的监听器都会收到通知': function () { return filtersChange !== undefined && filterChangeCapture !== undefined; },
                '事件先向上传播，然后向下传播': function () { return rootChange !== undefined && createTimeChange !== undefined; }
            });
        },
        '嘻嘻嘻': function (ASSERT) {
            var now = new Date();
            var schema = new YA_core_1.Schema({
                filters: {
                    keyword: 'yiy',
                    createTime: { min: null, max: now }
                },
                pageIndex: 1,
                pageSize: 10
            });
            var ob = YA_core_1.observable(schema);
            // 事件的向上传导(冒泡)
            var rootChange;
            ob.$subscribe(function (change) { return rootChange = change; });
            var filterChange;
            ob.filters.$subscribe(function (change) { return filterChange; });
            var keywordChange;
            ob.filters.keyword.$subscribe(function (change) { return keywordChange = change; });
            // 更新值，并立即刷新
            ob.filters.keyword('yi', true);
        }
    });
});
//# sourceMappingURL=observable.unittest.js.map
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
    YA_unittest_1.testable('core.dpath', {
        '基本用法': function (ASSERT) {
            var data = {
                user: {
                    name: 'yiy'
                }
            };
            var username = YA_core_1.DPath.getValue(data, 'user/name');
            ASSERT({
                '通过数据路径获取数据值': function () { return username === 'yiy'; }
            });
            YA_core_1.DPath.setValue(data, 'user/name', 'yi');
            ASSERT({
                '通过数据路径设置数据值': function () { return data.user.name === 'yi'; }
            });
        },
        '数据不完整也可以使用': function (ASSERT) {
            var data = {
                user: {
                    name: 'yiy'
                }
            };
            var displayName = YA_core_1.DPath.getValue(data, 'profile/displayName');
            ASSERT({ '可获取不存在的对象上的属性，返回undefined': function () { return displayName === undefined; } });
            YA_core_1.DPath.setValue(data, 'profile/displayName', 'yanyi');
            ASSERT({ '也可以设置不存在的对象上的属性，会自动根据路径补全上级对象': function () { return data.profile.displayName === 'yanyi'; } });
        },
        '高级用法': function (ASSERT) {
            var data = {
                user: {
                    name: 'yiy'
                }
            };
            var ctx = { 'user': { displayName: 'yanyi' } };
            var name = YA_core_1.DPath.getValue(data, '~/user/displayName', { '~': ctx });
            ASSERT({ '一级对象可以设置若干，并根据dpath的值选择': function () { return name === 'yanyi'; } });
            var getterName, getterTarget;
            var getter = function (name, target) {
                getterName = name;
                getterTarget = target;
                return ctx;
            };
            var name1 = YA_core_1.DPath.getValue(data, '~/user/displayName', getter);
            ASSERT({ 'get/set的最后一个参数可以为函数，该函数提供第一级树': function () { return name1 === 'yanyi' && getterName === '~' && getterTarget === data; } });
        }
    });
});
//# sourceMappingURL=dpath.unittest.js.map
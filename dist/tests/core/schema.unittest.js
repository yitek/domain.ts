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
    YA_unittest_1.testable('core.Schema', {
        '基础用法': function (ASSERT) {
            var schemaValue = new YA_core_1.Schema(12);
            ASSERT({
                '值类型模型架构': function () { return schemaValue.$type === YA_core_1.ModelTypes.value && schemaValue.$default === 12; }
            });
            var obj = { 'name': 'yiy', 'gender': 'male' };
            var schemaObj = new YA_core_1.Schema(obj);
            var propCount = 0;
            for (var propname in schemaObj)
                propCount++;
            ASSERT({
                '对象类型模型架构': function () { return schemaObj.$type === YA_core_1.ModelTypes.object && schemaValue.$default !== obj; },
                '带着2个属性的模型架构': function () { return propCount == 2; },
                '每个属性的模型架构都赋予了默认值': function () { return schemaObj.name.$type === YA_core_1.ModelTypes.value && schemaObj.name.$default === obj.name; }
            });
            var arr = [{ id: 1 }, { id: 2 }];
            var schemaArr = new YA_core_1.Schema(arr);
            ASSERT({
                '对象类型模型架构': function () { return schemaArr.$type === YA_core_1.ModelTypes.array && schemaArr.$default.length === 2; },
                '带着length': function () { return schemaArr.length instanceof YA_core_1.Schema; },
                '$item表示每个元素的架构': function () { return schemaArr.$item.$type === YA_core_1.ModelTypes.object && schemaArr.$item.id instanceof YA_core_1.Schema; }
            });
        },
        '组合对象与路径': function (ASSERT) {
            var data = { filters: { name: 'yi' }, rows: [{ id: 1, intrests: ['football'] }], pageIndex: 1 };
            var schema = new YA_core_1.Schema(data, '<states>');
            ASSERT({
                '可以获得路径': function () { return schema.filters.name.$dpath.toString() === '<states>/filters/name'; }
            });
            var name = schema.filters.name.$dpath.get(data, function (name, data) {
                return data;
            });
            ASSERT({ '可根据路径获取数据': function () { return name === 'yi'; }
            });
        },
        '通过代理来构建schema': function (ASSERT) {
            var proxy = YA_core_1.Schema.proxy();
            var displayName = proxy.filters.profile.displayName;
            var schema = proxy.$schema;
            ASSERT({
                '通过代理可以构建数据架构': function () { return schema.filters.profile.displayName instanceof YA_core_1.Schema; },
                '获取到的数据架构对象有正确的dpath': function () { return displayName.$dpath.toString() === 'filters/profile/displayName'; }
            });
        }
    });
});
//# sourceMappingURL=schema.unittest.js.map
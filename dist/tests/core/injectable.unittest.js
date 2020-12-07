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
        define(["require", "exports", "../../YA.unittest", "../../YA.core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var YA_unittest_1 = require("../../YA.unittest");
    var YA_core_1 = require("../../YA.core");
    YA_unittest_1.testable('core.injectable', {
        '注册与获取': function (ASSERT) {
            function ClassA(age) { this.age = age; }
            // 创建一个注入容器
            var scope = new YA_core_1.InjectScope('<ROOT>');
            // 注册一个类，且定义属性gender为注入属性
            scope.register('ClassA', ClassA).prop('gender');
            // 注册一个常量类
            scope.constant('gender', 'female');
            // 注册一个依赖工厂
            var factoryName, factoryScope, factoryContext;
            scope.factory('age', function (name, scope, context) {
                factoryName = name;
                factoryScope = scope;
                factoryContext = context;
                return 34;
            });
            var context = { 'A': '123' };
            var inst = scope.resolve('ClassA', context);
            var inst1 = scope.resolve('ClassA', context);
            ASSERT({
                '从容器中获得实例': function () { return inst instanceof ClassA && inst1 instanceof ClassA; },
                '两次获取的ClassA不是同一个实例': function () { return inst !== inst1; },
                '构造函数总是会被注入': function () { return inst.age === 34 && inst1.age === 34; },
                '指定的属性会被注入': function () { return inst.gender === 'female' && inst.gender === 'female'; }
            });
            ASSERT({
                '实例工厂方法中的name即为获取的实例名': function () { return factoryName === 'age'; },
                '实例工厂方法中的scope就是当前的scope': function () { return scope === factoryScope; },
                '实例工厂方法中的context为resolve的第二个参数': function () { return context === factoryContext; }
            });
        },
        '标注用法': function (ASSERT) {
            // 指定属性为依赖注入
            var ClassA = /** @class */ (function () {
                function ClassA(gender) {
                    this.gender = gender;
                }
                __decorate([
                    YA_core_1.injectable()
                ], ClassA.prototype, "age", void 0);
                ClassA = __decorate([
                    YA_core_1.injectable(false)
                ], ClassA);
                return ClassA;
            }());
            var scope = new YA_core_1.InjectScope();
            scope.constant('age', 12);
            scope.constant('gender', 'male');
            scope.register('s', ClassA);
            var instA = scope.resolve('s');
            ASSERT({
                '被指定的属性的值来自容器': function () { return instA.age === 12; },
                '构造函数不可注入，gender未赋值': function () { return instA.gender === undefined; }
            });
        },
        '层叠': function (ASSERT) {
            var connDisposed = false;
            function Connection(connstr) {
                this.connstr = connstr;
                this.$dispose = function () {
                    connDisposed = true;
                };
            }
            var scope1 = new YA_core_1.InjectScope();
            scope1.constant('connstr', 'mysql');
            scope1.register('ctrlA', function (conn) { this.conn = conn; });
            var scope2 = scope1.createScope();
            scope2.constant('connstr', 'sqlserver');
            scope2.register('conn', Connection);
            var scope3 = scope2.createScope();
            scope3.constant('connstr', 'sqlite');
            var ctrl = scope3.resolve('ctrlA');
            scope1.$dispose();
            ASSERT({
                '所有依赖项的查找为层叠后查找，即下级的scope的值会覆盖上级的值，所有依赖项都是从调用resolve的scope开始查找': function () { return ctrl.conn.connstr === 'sqlite'; },
                '父级scope释放，会引起子级scope释放操作,容器创建的对象也会被一并释放': function () { return connDisposed === true; }
            });
        }
    });
});
//# sourceMappingURL=injectable.unittest.js.map
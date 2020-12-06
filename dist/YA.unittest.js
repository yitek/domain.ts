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
    var Logger = /** @class */ (function () {
        function Logger() {
        }
        Logger.prototype.section = function (name, statement) {
            console.group(name);
            try {
                statement();
            }
            finally {
                console.groupEnd();
            }
            return this;
        };
        Logger.prototype.code = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log.apply(console, arguments);
            return this;
        };
        Logger.prototype.success = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.warn.apply(console, args);
            return this;
        };
        Logger.prototype.error = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.error.apply(console, arguments);
            return this;
        };
        return Logger;
    }());
    exports.Logger = Logger;
    Logger.default = new Logger();
    var codeTrimRegx = /(^[;\s]+)|([;\s]+$)/g;
    var Statement = /** @class */ (function () {
        function Statement(content) {
            this.content = content;
        }
        Statement.prototype.execute = function (logger, self) { return undefined; };
        return Statement;
    }());
    var CodeStatement = /** @class */ (function (_super) {
        __extends(CodeStatement, _super);
        function CodeStatement(content) {
            return _super.call(this, content.replace(codeTrimRegx, '')) || this;
        }
        return CodeStatement;
    }(Statement));
    var AssertStatement = /** @class */ (function (_super) {
        __extends(AssertStatement, _super);
        function AssertStatement(content, testMethod) {
            var _this = _super.call(this, content) || this;
            _this.testMethod = testMethod;
            var code = testMethod.toString();
            var at = code.indexOf('{');
            var end = code.lastIndexOf('}');
            _this.assertCode = code.substring(at + 1, end).replace(/^\s*return /g, '');
            return _this;
        }
        AssertStatement.prototype.execute = function (logger, self) {
            var rs = this.testMethod.call(self);
            if (rs)
                logger.success(this.content, this.assertCode);
            else
                logger.error(this.content, this.assertCode);
            return rs;
        };
        return AssertStatement;
    }(Statement));
    var AssertStatements = /** @class */ (function () {
        function AssertStatements(asserts) {
            this.asserts = [];
            for (var msg in asserts)
                this.asserts.push(new AssertStatement(msg, asserts[msg]));
        }
        AssertStatements.prototype.execute = function (logger, self) {
            var rs = [];
            for (var i in this.asserts) {
                var assertStatement = this.asserts[i];
                var assertRs = assertStatement.execute(logger, self);
                rs.push({ result: assertRs, statement: assertStatement });
            }
            return rs;
        };
        AssertStatements.fetch = function (asserts) {
            if (!asserts)
                return null;
            if (asserts['--assert-statements--'])
                return asserts['--assert-statements--'];
            var stat = new AssertStatements(asserts);
            Object.defineProperty(asserts, '--assert-statements--', { enumerable: false, configurable: false, writable: false, value: stat });
            return stat;
        };
        return AssertStatements;
    }());
    var TestMethod = /** @class */ (function () {
        function TestMethod(method, name) {
            this.method = method;
            this.name = name;
            this.statements = parseStatements(method);
        }
        TestMethod.prototype.execute = function (logger, self) {
            var _this = this;
            var statements = this.statements;
            var hasError = false;
            var at = 0;
            var rs = [];
            var ASSERT = function (asserts) {
                var statement;
                while (true) {
                    statement = statements[at++];
                    if (statement instanceof CodeStatement) {
                        rs.push(statement);
                        logger.code(statement.content);
                        continue;
                    }
                    break;
                }
                var assertStatements = AssertStatements.fetch(asserts);
                rs.push(assertStatements.execute(logger, self));
            };
            logger.section(this.name, function () {
                _this.method.call(self, ASSERT);
            });
            return { statement: this, result: rs };
        };
        TestMethod.fetch = function (method, name) {
            if (method && method['--test-method--'])
                return method['--test-method--'];
            if (typeof method !== 'function')
                return null;
            var mtd = new TestMethod(method, name);
            Object.defineProperty(method, '--test-method--', { enumerable: false, configurable: false, writable: false, value: mtd });
            return mtd;
        };
        return TestMethod;
    }());
    exports.TestMethod = TestMethod;
    var TestClass = /** @class */ (function () {
        function TestClass(proto, ctor) {
            if (typeof proto === 'function') {
                this.ctor = ctor = proto;
                this.proto = ctor.prototype;
            }
            else
                this.proto = proto;
        }
        TestClass.prototype.execute = function (logger, self) {
            if (!self)
                self = this.ctor ? new this.ctor() : this.proto;
            var name = this.name || '匿名测试类';
            var rs = [];
            logger.section(name, function () {
                for (var n in self) {
                    var testMethod = TestMethod.fetch(self[n], n);
                    if (!testMethod)
                        continue;
                    rs.push(testMethod.execute(logger, self));
                }
            });
            return { statement: this, result: rs };
        };
        TestClass.fetch = function (target, name) {
            if (target && target['--test-class--'])
                return target['--test-class--'];
            var t = typeof target;
            var tc;
            if (t === 'function') {
                tc = new TestClass(target.prototype, target);
                target = target.prototype;
            }
            else if (t === 'object') {
                tc = new TestClass(target);
            }
            Object.defineProperty(target, '--test-class--', { configurable: false, writable: false, enumerable: false, value: tc });
            return tc;
        };
        return TestClass;
    }());
    function parseStatements(fn) {
        if (fn['--statements--'])
            return fn['--statements--'];
        var _a = parseAssertName(fn.toString()), name = _a.name, code = _a.code;
        var statements = [];
        if (!name)
            return statements;
        var start = 0;
        var at0 = start;
        while (true) {
            at0 = code.indexOf(name, at0);
            if (at0 < 0) {
                statements.push(new CodeStatement(code.substring(start)));
                break;
            }
            var at = code.indexOf('(', at0);
            if (at <= 0) {
                statements.push(new CodeStatement(code.substring(start)));
                break;
            }
            var md = code.substring(at0 + name.length, at).replace(codeTrimRegx, '');
            if (md) {
                at0 = at0 + name.length;
                continue;
            }
            statements.push(new CodeStatement(code.substring(start, at0)));
            at = at + 1;
            var nextAt = parseStatement(code, at);
            if (nextAt !== undefined) {
                statements.push(null);
                start = at0 = nextAt;
            }
            else {
                statements.push(new CodeStatement(code.substring(start)));
                break;
            }
        }
        Object.defineProperty(fn, '--statements--', { configurable: false, enumerable: false, writable: false, value: statements });
        return statements;
    }
    function parseAssertName(code) {
        var start = code.indexOf('(');
        var end = code.indexOf(')', start);
        var assertsFnName = code.substring(start + 1, end);
        if (assertsFnName.indexOf(',') >= 0)
            throw '不正确的测试函数，只能有一个参数:ASSERTS';
        start = code.indexOf('{', end);
        end = code.lastIndexOf('}');
        code = code.substring(start + 1, end);
        return { name: assertsFnName, code: code };
    }
    function parseStatement(code, start) {
        var subCode = code.substring(start);
        var at = start;
        var branceCount = 1;
        var beginCode = '('.charCodeAt(0);
        var endCode = ')'.charCodeAt(0);
        var quote = '"'.charCodeAt(0);
        var singleQuote = '\''.charCodeAt(0);
        var inStr = 0;
        while (true) {
            if (at === code.length)
                return undefined;
            var c = code.charCodeAt(at++);
            if (inStr !== 0 && inStr === c) {
                inStr = 0;
                continue;
            }
            if (c === quote || c === singleQuote) {
                inStr = c;
                continue;
            }
            if (c === beginCode) {
                branceCount++;
                continue;
            }
            if (c === endCode) {
                if (--branceCount === 0)
                    return at;
            }
        }
    }
    function meta(testTarget, arg) {
        var t = typeof arg;
        if (t === 'boolean')
            return arg === false ? false : true;
        if (t === 'string')
            testTarget.name = arg;
        if (t === 'object') {
            if (arg.ignore)
                return false;
            testTarget.name = arg.name;
        }
    }
    var todos = [];
    function testable(desp, test) {
        if (test !== undefined) {
            var t = typeof test;
            if (t === 'function') {
                if (desp && (desp === '<class>' || desp.isClass)) {
                    var tc = TestClass.fetch(test, desp.name);
                    if (meta(tc, desp) !== false)
                        return todos.push(tc);
                }
                var tm = TestMethod.fetch(test);
                if (meta(tm, desp) !== false)
                    return todos.push(tm);
            }
            else if (t === 'object') {
                var tc = TestClass.fetch(test);
                if (meta(tc, desp) !== false)
                    return todos.push(tc);
            }
            throw '错误的参数';
        }
        return function (target, name) {
            if (desp === false)
                return;
            if (desp && desp.ignore)
                return;
            if (name === undefined) {
                var tc = TestClass.fetch(target);
                if (meta(tc, desp) !== false)
                    return todos.push(tc);
            }
            var fn = target[name];
            var tm = TestMethod.fetch(fn);
            meta(tm, desp);
        };
    }
    exports.testable = testable;
    setTimeout(function () {
        if (todos.length) {
            var executable = void 0;
            while (executable = todos.shift())
                executable.execute(Logger.default);
        }
    }, 0);
    var tests = {
        testA: function (ASSERTS) {
            var a = 1;
            var b = 2;
            ASSERTS({
                'a与b要相等': function () { return a === b; }
            });
            var c = 3;
            ASSERTS({
                'c与a要相等': function () { return c == a; }
            });
        }
    };
});
//testable(true,tests)
//# sourceMappingURL=YA.unittest.js.map
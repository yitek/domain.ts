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
var codeTrimRegx = /(^[;\s]+)|([;\s]+$)/g;
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
            statements.push(code.substring(start));
            break;
        }
        var at = code.indexOf('(', at0);
        if (at <= 0) {
            statements.push(code.substring(start));
            break;
        }
        var md = code.substring(at0 + name.length, at).replace(codeTrimRegx, '');
        if (md) {
            at0 = at0 + name.length;
            continue;
        }
        statements.push(code.substring(start, at0));
        at = at + 1;
        var nextAt = parseStatement(code, at);
        if (nextAt !== undefined) {
            statements.push(null);
            start = at0 = nextAt;
        }
        else {
            statements.push(code.substring(start));
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
function testTest(assert) {
    var s = 1;
    var y = 1;
    assert(s, 1, 's应该等于1');
    assert(y, 2, 'y应该等于2');
}
var statements = parseStatements(testTest);
console.log(statements);
var Section = /** @class */ (function () {
    function Section() {
    }
    Section.prototype.caption = function (value) {
        this.title = value;
        return this;
    };
    Section.prototype.content = function (value) {
        (this.contents || (this.contents = [])).push(value);
        return this;
    };
    Section.prototype.notice = function (value) {
        (this.notices || (this.notices = [])).push(value);
        return this;
    };
    return Section;
}());
var Namespace = /** @class */ (function (_super) {
    __extends(Namespace, _super);
    function Namespace() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Namespace;
}(Section));
var Usage = /** @class */ (function (_super) {
    __extends(Usage, _super);
    function Usage(fn) {
        return _super.call(this) || this;
    }
    return Usage;
}(Section));
//# sourceMappingURL=YA.doct.js.map
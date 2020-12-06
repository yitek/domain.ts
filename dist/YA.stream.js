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
    var Stream = /** @class */ (function () {
        function Stream(data) {
            if (data !== Stream)
                Object.defineProperty(this, '--', { enumerable: false, configurable: false, writable: false, value: data });
        }
        Stream.extensions = [];
        return Stream;
    }());
    exports.Stream = Stream;
    function stream(data, ops) {
        if (ops === undefined) {
            for (var i in Stream.extensions) {
                var ext = Stream.extensions[i];
                if (data instanceof ext.ctor) {
                    ops = ext.ops;
                    break;
                }
            }
            //if(!ops) ops = 
        }
        var streamCtor = ops['--pipe-ctor'] || (function (ops) {
            var ctor = function (data) { Object.defineProperty(this, '--', { enumerable: false, configurable: false, writable: false, value: data }); };
            for (var n in ops)
                (function (name, op, ctor) {
                    ctor.prototype[name] = function (arg0, arg1, arg2) {
                        var stream = this;
                        var isFinal, streamValue;
                        var next = function (output, continuos) {
                            isFinal = continuos === false;
                            streamValue = output;
                        };
                        op.call(this, this['--'], next, arg0, arg1, arg2);
                        if (isFinal)
                            return streamValue;
                        return new streamCtor(streamValue);
                    };
                })(n, ops[n], ctor);
            Object.defineProperty(ops, '--pipe-ctor', { enumerable: false, configurable: false, writable: false, value: ctor });
            return ctor;
        })(ops);
        return new streamCtor(data);
    }
    exports.stream = stream;
});
//# sourceMappingURL=YA.stream.js.map
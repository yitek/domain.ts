(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../YA.core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var YA = require("../YA.core");
    function view(states) {
        function inputChanged(evt, states) {
            states.inputText = evt.target.value;
        }
        return YA.createElement("div", null,
            YA.createElement("input", { type: 'text', value: states.inputText, onkeydown: inputChanged }),
            YA.createElement("span", null, states.inputText));
    }
});
//YA.mount(document.body,view)
//# sourceMappingURL=core.mount.js.map
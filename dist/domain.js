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
var ReferenceTypes;
(function (ReferenceTypes) {
    ReferenceTypes[ReferenceTypes["one2One"] = 0] = "one2One";
    ReferenceTypes[ReferenceTypes["one2Many"] = 1] = "one2Many";
    ReferenceTypes[ReferenceTypes["many2One"] = 2] = "many2One";
    ReferenceTypes[ReferenceTypes["manyToMany"] = 3] = "manyToMany";
})(ReferenceTypes || (ReferenceTypes = {}));
var ViewPermissions;
(function (ViewPermissions) {
    ViewPermissions[ViewPermissions["disabled"] = 0] = "disabled";
    ViewPermissions[ViewPermissions["masked"] = 1] = "masked";
    ViewPermissions[ViewPermissions["readonly"] = 2] = "readonly";
    ViewPermissions[ViewPermissions["writable"] = 3] = "writable";
})(ViewPermissions || (ViewPermissions = {}));
var DisplayLevels;
(function (DisplayLevels) {
    DisplayLevels[DisplayLevels["xs"] = 0] = "xs";
    DisplayLevels[DisplayLevels["sm"] = 1] = "sm";
    DisplayLevels[DisplayLevels["md"] = 2] = "md";
    DisplayLevels[DisplayLevels["lg"] = 3] = "lg";
    DisplayLevels[DisplayLevels["hg"] = 4] = "hg"; //非常大的
})(DisplayLevels || (DisplayLevels = {}));
var QueryTypes;
(function (QueryTypes) {
    QueryTypes[QueryTypes["none"] = 0] = "none";
    QueryTypes[QueryTypes["eq"] = 1] = "eq";
    QueryTypes[QueryTypes["gt"] = 2] = "gt";
    QueryTypes[QueryTypes["gte"] = 3] = "gte";
    QueryTypes[QueryTypes["lt"] = 4] = "lt";
    QueryTypes[QueryTypes["lte"] = 5] = "lte";
    QueryTypes[QueryTypes["btwn"] = 6] = "btwn";
})(QueryTypes || (QueryTypes = {}));
var createXHR = function () {
    var XHR = [
        function () { return new XMLHttpRequest(); },
        function () { return new ActiveXObject("Msxml2.XMLHTTP"); },
        function () { return new ActiveXObject("Msxml3.XMLHTTP"); },
        function () { return new ActiveXObject("Microsoft.XMLHTTP"); }
    ];
    var xhr = null;
    //尝试调用函数，如果成功则返回XMLHttpRequest对象，否则继续尝试
    for (var i = 0; i < XHR.length; i++) {
        try {
            xhr = XHR[i]();
            createXHR = XHR[i];
        }
        catch (e) {
            continue; //如果发生异常，则继续下一个函数调用
        }
        break; //如果成功，则中止循环
    }
    return xhr; //返回对象实例
};
var DomainStates;
(function (DomainStates) {
    DomainStates[DomainStates["loading"] = 0] = "loading";
    DomainStates[DomainStates["loaded"] = 1] = "loaded";
    DomainStates[DomainStates["completed"] = 2] = "completed";
    DomainStates[DomainStates["error"] = 3] = "error";
})(DomainStates || (DomainStates = {}));
var Field = /** @class */ (function () {
    function Field(opt, name, dumplicateKey, dumplicateFrom) {
        this.option = opt;
        this.name = name;
        if (opt.viewType)
            this.viewType = opt.viewType;
        if (opt.dataType)
            this.dataType = opt.dataType;
        if (opt.displayName === undefined)
            this.displayName = name;
        if (opt.permission !== undefined) {
            if (typeof opt.permission === "string")
                this.permission = ViewPermissions[opt.permission];
            else
                this.permission = opt.permission;
        }
        if (opt.displayLevel !== undefined) {
            if (typeof opt.displayLevel === "string")
                this.displayLevel = DisplayLevels[opt.displayLevel];
            else
                this.displayLevel = opt.displayLevel;
        }
        if (opt.queryType !== undefined) {
            if (typeof opt.queryType === "string")
                this.queryType = QueryTypes[opt.queryType];
            else
                this.queryType = opt.queryType;
        }
        this.dumplicateKey = dumplicateKey;
        this.dumplicateFrom = dumplicateFrom;
        if (dumplicateKey)
            return;
        if (opt.reference) {
            this.referenceDomain = domains[opt.reference.rightDomainName];
            if (this.viewType === undefined) {
                if (opt.reference.refType == ReferenceTypes.many2One || opt.reference.refType == ReferenceTypes.one2One) {
                    this.viewType = "selector";
                }
            }
        }
    }
    return Field;
}());
var Domain = /** @class */ (function () {
    function Domain(name) {
        var _this = this;
        this.status = DomainStates.loading;
        Domain.load(name, function (data, error) {
            if (error) {
                _this.status = DomainStates.error;
                _this.option = error;
            }
            else {
                _this.status = DomainStates.loaded;
                _this.option = data;
                for (var i = 0, j = loadedDomainCallbacks.length; i < j; i++) {
                    var callback = loadedDomainCallbacks.shift();
                    callback(_this);
                }
                retriveDomainReferences(_this, makeDomainFields);
            }
        });
    }
    Domain.retrive = function (name) {
        var dm = domains[name];
        if (!dm)
            dm = domains[name] = new Domain(name);
        return dm;
    };
    Domain.load = function (name, callback) {
        ajax({
            url: name,
            done: callback
        });
    };
    return Domain;
}());
var loadedDomainCallbacks = [];
var domains = {};
function ajax(opts) {
    var xhr = createXHR();
    var method = opts.method || "GET";
    var async = opts.async !== false;
    var data = null;
    var url = opts.url;
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                ajaxDone(xhr, undefined, opts);
            }
            else {
                var text = "";
                try {
                    text = xhr.responseText;
                }
                catch (_a) { }
                ajaxDone(xhr, { message: "Server response error", status: xhr.status, text: text }, opts);
            }
        }
    };
    xhr.onerror = function (e) { ajaxDone(xhr, e, opts); };
    xhr.open(method, url, async);
    xhr.send(data);
}
var blockCommetInJsonRegx = /\/\/[^\n]*\n/g;
function ajaxDone(xhr, error, opts) {
    var result;
    if (error === undefined) {
        try {
            result = xhr.responseText;
            result = result.replace(blockCommetInJsonRegx, "\n");
            if (opts.type === 'json')
                result = JSON.parse(result);
        }
        catch (e) {
            error = e;
        }
    }
    if (error && opts.error)
        opts.error.call(xhr, error);
    if (result !== undefined && opts.success)
        opts.success.call(xhr, result);
    if (opts.done)
        opts.done.call(xhr, result, error);
}
function retriveDomainReferences(domain, callback) {
    var bases = [];
    if (domain.option.extends) {
        for (var _i = 0, _a = domain.option.extends; _i < _a.length; _i++) {
            var basename = _a[_i];
            var base = domains[basename];
            if (base.status !== DomainStates.loaded) {
                loadedDomainCallbacks.push(function () { return retriveDomainReferences(domain, callback); });
                return;
            }
            bases.push(base);
        }
    }
    var references = {};
    if (domain.option.fields) {
        for (var fname in domain.option.fields) {
            var field = domain.option.fields[fname];
            if (field.reference) {
                var refDomain = Domain.retrive(field.reference.rightDomainName);
                if (refDomain.status !== DomainStates.loaded) {
                    loadedDomainCallbacks.push(function () { return retriveDomainReferences(domain, callback); });
                    return;
                }
                references[fname] = {
                    field: field,
                    referenceDomain: refDomain,
                    referenceOption: field.reference
                };
            }
        }
    }
    domain.bases = bases;
    domain.references = references;
    callback(domain);
}
function makeDomainFields(domain) {
    if (domain.fields)
        return domain.fields;
    var fields = {};
    if (domain.bases && domain.bases.length) {
        for (var _i = 0, _a = domain.bases; _i < _a.length; _i++) {
            var baseDomain = _a[_i];
            var baseProps = makeDomainFields(baseDomain);
            for (var n in baseProps) {
                fields[n] = baseProps[n];
            }
        }
    }
    if (domain.option.fields) {
        for (var n in domain.option.fields) {
            var fieldOpt = domain.option.fields[n];
            var field = new Field(fieldOpt, n);
            fields[field.name] = field;
            if (field.referenceDomain && fieldOpt.reference.dumplicates) {
                for (var meName in fieldOpt.reference.dumplicates) {
                    var dumpField = new Field(fieldOpt, meName, fieldOpt.reference.dumplicates[meName], field);
                }
            }
        }
    }
    return domain.fields = fields;
}
var FieldView = /** @class */ (function () {
    function FieldView(view, field) {
        this.domainView = view;
        this.field = field;
        this.name = field.name;
        this.controlFactory = controlFactories[field.viewType];
        if (!this.controlFactory)
            this.controlFactory = controlFactories["text"];
    }
    FieldView.prototype.init = function (viewOpt) {
        if (viewOpt.pm !== undefined) {
            this.permission = typeof viewOpt.pm === 'string' ? ViewPermissions[viewOpt.pm] : viewOpt.pm;
        }
        if (viewOpt.lv !== undefined) {
            this.displayLevel = typeof viewOpt.lv === 'string' ? DisplayLevels[viewOpt.lv] : viewOpt.lv;
        }
        if (viewOpt.qry !== undefined) {
            this.queryType = typeof viewOpt.qry === 'string' ? QueryTypes[viewOpt.qry] : viewOpt.qry;
        }
        return this;
    };
    FieldView.prototype.render = function (data, permission) {
        if (permission === undefined)
            permission = this.permission;
        if (permission === undefined)
            permission = ViewPermissions.readonly;
    };
    return FieldView;
}());
var DomainView = /** @class */ (function () {
    function DomainView(name, option, domain) {
        this.option = option;
        this.domain = domain;
        this.name = name;
        if (option.permission !== undefined) {
            this.permission = typeof option.permission === 'string' ? ViewPermissions[option.permission] : option.permission;
        }
        var fieldViews = [];
        if (!option.includes) {
            for (var n in domain.fields) {
                fieldViews.push(new FieldView(this, domain.fields[n]));
            }
        }
        else {
            includeFields(this, fieldViews, option.includes, null);
        }
        if (option.excludes) {
            for (var i = 0, j = fieldViews.length; i < j; i++) {
                var fldview = fieldViews.shift();
                var hasIt = false;
                for (var _i = 0, _a = option.excludes; _i < _a.length; _i++) {
                    var n = _a[_i];
                    if (n === fldview.name) {
                        hasIt = true;
                        break;
                    }
                }
                if (!hasIt)
                    fieldViews.push(fldview);
            }
        }
    }
    return DomainView;
}());
function includeFields(view, fieldViews, includes, names) {
    var isArr = includes.push;
    for (var i in includes) {
        var cfg = includes[i];
        var fldViewOpt = {};
        if (typeof cfg === 'string') {
            if (isArr) {
                fldViewOpt.nm = cfg;
            }
            else {
                fldViewOpt.nm = i;
                var v = ViewPermissions[cfg];
                if (v !== undefined) {
                    fldViewOpt.pm = v;
                }
                else {
                    v = DisplayLevels[cfg];
                    if (v !== undefined)
                        fldViewOpt.lv = v;
                    else {
                        v = QueryTypes[cfg];
                        if (v !== undefined)
                            fldViewOpt.qry = v;
                    }
                }
            }
        }
        else if (cfg) {
            fldViewOpt = cfg;
        }
        var fieldView = void 0;
        for (var _i = 0, fieldViews_1 = fieldViews; _i < fieldViews_1.length; _i++) {
            var v = fieldViews_1[_i];
            if (v.name === fldViewOpt.nm) {
                fieldView = v;
                break;
            }
        }
        if (!fieldView) {
            var field = view.domain.fields[fldViewOpt.nm];
            if (field) {
                fieldView = new FieldView(view, field);
                fieldViews.push(fieldView);
                if (names) {
                    var hasIt = false;
                    for (var _a = 0, names_1 = names; _a < names_1.length; _a++) {
                        var n = names_1[_a];
                        if (n === fieldView.name) {
                            hasIt = true;
                            break;
                        }
                    }
                    if (!hasIt)
                        names.push(fieldView.name);
                }
            }
        }
        fieldView.init(fldViewOpt);
    }
}
var DetailView = /** @class */ (function (_super) {
    __extends(DetailView, _super);
    function DetailView(name, option, domain) {
        var _this = _super.call(this, name, option, domain) || this;
        _this.groups = option.groups;
        _this.tabs = option.tabs;
        return _this;
    }
    return DetailView;
}(DomainView));
var controlFactories = {};
controlFactories.text = {
    readonly: function (fieldView, data) {
        var elem = document.createElement("span");
        elem.className = "readonly " + fieldView.name;
        elem.value = data[fieldView.name];
        elem.innerHTML = elem.value;
        return {
            raw: elem,
            getValue: function () { return elem.value; },
            setValue: function (val) { data[fieldView.name] = elem.value = val; elem.innerHTML = val; }
        };
    },
    writable: function (fieldView, data) {
        var elem = document.createElement("input");
        elem.type = "text";
        elem.className = "readonly " + fieldView.name;
        elem.value = data[fieldView.name];
        var api = {
            getValue: function () { return elem.value; },
            setValue: function (val) { return elem.value = data[fieldView.name] = val; },
            onchange: null
        };
        var tick = 0;
        attach(elem, "blur", function () {
            if (tick)
                clearTimeout(tick);
            tick = 0;
            data[fieldView.name] = elem.value;
            if (api.onchange)
                api.onchange.call(elem, elem.value, fieldView);
        });
        attach(elem, "keyup", function () {
            if (tick)
                clearTimeout(tick);
            tick = setTimeout(function () {
                if (tick)
                    clearTimeout(tick);
                tick = 0;
                data[fieldView.name] = elem.value;
                if (api.onchange)
                    api.onchange.call(elem, elem.value, fieldView);
            }, 200);
        });
        return api;
    }
};
var attach = function (elem, evt, callback) {
    if (elem.addEventListener) {
        attach = function (elem, evt, callback) {
            elem.addEventListener(evt, callback, false);
        };
    }
    else if (elem.attachEvent) {
        attach = function (elem, evt, callback) {
            elem.attachEvent('on' + evt, callback);
        };
    }
};
//# sourceMappingURL=domain.js.map
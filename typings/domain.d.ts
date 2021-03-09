declare enum ReferenceTypes {
    one2One = 0,
    one2Many = 1,
    many2One = 2,
    manyToMany = 3
}
interface ReferenceOption {
    refType?: ReferenceTypes;
    uniqueName?: string;
    leftKey?: string;
    leftDomainName?: string;
    rightKey?: string;
    rightDomainName?: string;
    linkTbName?: string;
    linkLeftKey?: string;
    linkRightKey?: string;
    dumplicates?: {
        [name: string]: string;
    };
}
declare enum ViewPermissions {
    disabled = 0,
    masked = 1,
    readonly = 2,
    writable = 3
}
declare enum DisplayLevels {
    xs = 0,
    sm = 1,
    md = 2,
    lg = 3,
    hg = 4
}
declare enum QueryTypes {
    none = 0,
    eq = 1,
    gt = 2,
    gte = 3,
    lt = 4,
    lte = 5,
    btwn = 6
}
interface FieldOption {
    name?: string;
    /**
     * 显示名
     *
     * @type {string}
     * @memberof Field
     */
    displayName?: string;
    /**
     * 前端类型
     *
     * @type {string}
     * @memberof DomainFieldOptions
     */
    viewType?: string;
    /**
     * 数据类型
     *
     * @type {string}
     * @memberof DomainFieldOptions
     */
    dataType?: string;
    /**
     * 类型，可以只填写这个，推断出数据类型跟显示类型
     *
     * @type {string}
     * @memberof DomainFieldOptions
     */
    type?: string;
    /**
     * 验证器
     *
     * @type {[]}
     * @memberof DomainFieldOptions
     */
    validations?: {};
    reference: ReferenceOption;
    displayLevel: DisplayLevels | string;
    permission: ViewPermissions | string;
    queryType: QueryTypes | string;
}
interface DomainOption {
    name: string;
    tbName: string;
    extends: string[];
    fields: {
        [name: string]: FieldOption;
    };
}
declare let createXHR: () => any;
declare enum DomainStates {
    loading = 0,
    loaded = 1,
    completed = 2,
    error = 3
}
declare class Field {
    option: FieldOption;
    name: string;
    viewType: string;
    dataType: string;
    displayName: string;
    dumplicateKey: string;
    dumplicateFrom: Field;
    referenceDomain: Domain;
    permission: ViewPermissions;
    displayLevel: DisplayLevels;
    queryType: QueryTypes;
    constructor(opt: FieldOption, name: string, dumplicateKey?: string, dumplicateFrom?: Field);
}
declare class Domain {
    name: string;
    status: DomainStates;
    option: DomainOption;
    bases: Domain[];
    references: {
        [name: string]: {
            field: any;
            referenceDomain: Domain;
            referenceOption: ReferenceOption;
        };
    };
    fields: {
        [propname: string]: Field;
    };
    constructor(name: string);
    static retrive(name: string): Domain;
    static load(name: string, callback: (data: any, error: any) => any): void;
}
declare let loadedDomainCallbacks: any[];
declare let domains: {
    [name: string]: Domain;
};
declare function ajax(opts: any): void;
declare let blockCommetInJsonRegx: RegExp;
declare function ajaxDone(xhr: any, error: any, opts: any): void;
declare function retriveDomainReferences(domain: Domain, callback: any): void;
declare function makeDomainFields(domain: Domain): {
    [propname: string]: Field;
};
interface FieldViewOption {
    nm?: string;
    pm?: ViewPermissions | string;
    lv?: DisplayLevels | string;
    qry?: QueryTypes | string;
    gp?: string;
}
interface DomainViewOption {
    url?: string;
    permission: string | ViewPermissions;
    includes?: any;
    excludes?: [];
}
interface DetailViewOption extends DomainViewOption {
    groups: [];
    tabs: [];
}
interface Control {
    raw: any;
    wrap?: any;
    getValue: () => any;
    setValue: (val: any) => any;
    onchange?: (value: any, fieldView: FieldView) => any;
}
interface ControlFactory {
    readonly(fieldView: FieldView, data: any): Control;
    writable(fieldView: FieldView, data: any): Control;
}
declare class FieldView {
    field: Field;
    permission?: ViewPermissions;
    displayLevel?: DisplayLevels;
    queryType?: QueryTypes;
    group?: any;
    domainView: any;
    name: string;
    controlFactory: ControlFactory;
    constructor(view: any, field: Field);
    init(viewOpt: any): FieldView;
    render(data: any, permission?: ViewPermissions): Control;
}
declare class DomainView {
    fieldViews: FieldView[];
    permission: ViewPermissions;
    option: DomainViewOption;
    domain: Domain;
    name: string;
    constructor(name: string, option: DomainViewOption, domain: Domain);
}
declare function includeFields(view: DomainView, fieldViews: FieldView[], includes: any, names: string[]): void;
declare class DetailView extends DomainView {
    groups: string[];
    tabs: string[];
    constructor(name: string, option: DetailViewOption, domain: Domain);
}
declare let controlFactories: {
    [name: string]: ControlFactory;
};
declare let attach: (elem: any, evt: any, callback: any) => void;

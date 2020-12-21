export declare function is_string(obj: any): boolean;
export declare function is_bool(obj: any): boolean;
export declare function is_number(obj: any): boolean;
export declare function is_assoc(obj: any): boolean;
export declare function is_object(obj: any): boolean;
export declare function is_array(obj: any): boolean;
export declare function is_empty(obj: any): boolean;
/**
 *  去掉两边空格
 *
 * @export
 * @param {*} text
 * @returns {string}
 */
export declare function trim(text: any): string;
/**
 * 骆驼命名法
 * 将连字号变为骆驼命名法
 *
 * @export
 * @param {*} text
 * @param {boolean} [mix] true是大写开头，大小写混写的格式
 * @returns {string}
 */
export declare function camel(text: any, mix?: boolean): string;
/**
 * 判定字符串是否以某个串开始
 *
 * @export
 * @param {*} text 要判定的字符串
 * @param {*} token 开始标记字符串
 * @returns {boolean}
 */
export declare function startsWith(text: any, token: any): boolean;
/**
 * 判定字符串是否以某个串结束
 *
 * @export
 * @param {*} text 要检测的字符串
 * @param {*} token 结束标记字符串
 * @returns {boolean}
 */
export declare function endsWith(text: any, token: any): boolean;
/**
 * 是否是百分数
 *
 * @export
 * @param {*} text
 * @returns {number}
 */
export declare function is_percent(text: any): number;
export declare function array_index(obj: any, item: any, start?: number): number;
export declare function array_contains(obj: any, item: any): boolean;
export declare function array_add_unique(arr: any[], item: any): boolean;
export declare function array_remove(arr: any[], item: any): boolean;
export declare function clone(obj: any, _clones?: any[]): any;
export declare let extend: (...args: any[]) => any;
declare type TDPathItem = {
    name: string;
    index: number;
    prev?: TDPathItem;
    next?: TDPathItem;
};
export declare class DPath {
    raw: string;
    dotpath: string;
    slashpath: string;
    first: TDPathItem;
    last: TDPathItem;
    deep: number;
    constructor(dpath: string);
    get(target: any, context?: any): any;
    set(target: any, value: any, context?: any): DPath;
    toString(): string;
    static fetch(path: string): DPath;
    static getValue(target: any, dpath: string, context?: any): any;
    static setValue(target: any, dpath: string, value: any, context?: any): DPath;
    static accessors: {
        [path: string]: DPath;
    };
}
export declare let inherit: (ctor: any, base: any) => any;
export declare function accessable(desc: any, target?: any, name?: any, value?: any): any;
/**
 * 将成员变成隐式成员
 * 不会被for循环到
 * 但外部还是可以修改
 *
 * @export
 * @param {*} [target]
 * @param {*} [name]
 * @param {*} [value]
 * @returns
 */
export declare function implicit(target?: any, name?: any, value?: any): any;
export declare function constant(enumerable?: boolean, target?: any, name?: any, value?: any, week?: boolean): any;
export declare function nop(): void;
export declare class Exception extends Error {
    constructor(msg: any, detail?: any, silence?: any);
}
export declare function rid(prefix?: string): string;
export declare const NONE: any;
export declare const REMOVE: any;
export declare const USEAPPLY: any;
export declare function disposable(target: any): any;
export declare class Disposiable {
    $disposed?: boolean;
    $dispose(callback?: any): void;
    static isInstance(obj: any): boolean;
}
export declare function subscribable(target: any): void;
export declare namespace subscribable {
    var REMOVE: any;
    var USEAPPLY: any;
}
export declare class Subscription {
    $subscribe(handler: any, extra?: any, disposable?: Disposiable): any;
    $unsubscribe(handler: any): any;
    $publish(evt?: any, useApply?: any, filter?: (extras: any) => boolean): void;
    $fulfill(evt?: any, useApply?: any, filter?: (extras: any) => boolean): void;
    static isInstance(obj: any): boolean;
    static REMOVE: any;
    static USEAPPLY: any;
}
export declare function eventable(target: any, name: any): void;
export declare type TInjectFactory = (name: string, scope: InjectScope, target?: any) => any;
export declare class InjectScope extends Disposiable {
    name?: string;
    superScope?: InjectScope;
    factories: {
        [name: string]: TInjectFactory;
    };
    constructor(name?: string, superScope?: InjectScope);
    createScope(name?: string): InjectScope;
    resolve(name: string, context?: any): any;
    register(name: string, ctor: {
        new (...args: any[]): any;
    } | Function, singleon?: boolean): Activator;
    constant(name: string, value: any): InjectScope;
    factory(name: string, factory: TInjectFactory): InjectScope;
    static global: InjectScope;
    static svcname: string;
}
export declare class Activator {
    ctor: {
        new (...args: any[]): any;
    };
    ctorArgs: string[];
    depProps: {
        [propname: string]: string;
    };
    constructor(ctor: {
        new (...args: any[]): any;
    });
    prop(propname: string | {
        [pname: string]: string;
    } | string[], depname?: string): Activator;
    createInstance(args?: any, constructing?: (selfInstance: any, args: any[], activator: Activator, rawArgs: any) => any, constructed?: (selfInstance: any, activator: Activator) => any, context?: any): any;
    static activate(ctorPrProto: any, args?: any, constructing?: (selfInstance: any, args: any[], activator: Activator, rawArgs: any) => any, constructed?: (selfInstance: any, activator: Activator) => any, context?: any): any;
    static fetch(ctorOrProto: any): Activator;
}
export declare function injectable(map?: string | boolean): (target: any, name?: any) => any;
export declare enum ModelTypes {
    constant = 0,
    value = 1,
    object = 2,
    array = 3,
    computed = 4
}
export declare class Schema {
    $type: ModelTypes;
    $name?: string;
    $super?: Schema;
    $default?: any;
    $fn?: Function;
    $args?: Schema[];
    $item?: Schema;
    length?: Schema;
    $dpath: DPath;
    private '--dpath--'?;
    constructor(defaultValue: any, name?: string | Schema[], superSchema?: any, visitor?: any);
    $defineProp(name: string, propDefaultValue?: any, visitor?: any): Schema;
    $asArray(defaultItemValue?: any, visitor?: any): Schema;
    static proxy(target?: any): any;
}
export declare type TObservable = {
    [index in number | string]: TObservable;
} & {
    (value?: any, capture?: boolean, disposor?: any): any;
    '$Observable': Observable;
    $observable: TObservable;
};
export declare type TObservableEvent = {
    value?: any;
    old?: any;
    src?: any;
    sender?: TObservable;
    removes?: TObservable[];
    appends?: TObservable[];
    removed?: boolean;
    cancel?: boolean;
    stop?: boolean;
};
export declare class Observable extends Subscription {
    type: ModelTypes;
    name: string;
    old: any;
    value: any;
    schema: Schema;
    super?: Observable;
    deps?: Observable[];
    dep_handler?: (evt: TObservableEvent) => any;
    $observable: TObservable;
    listeners?: {
        (evt: TObservableEvent): any;
    }[];
    captures?: {
        (evt: TObservableEvent): any;
    }[];
    hasChanges?: number;
    length?: Observable;
    constructor(initial: any, schema: Schema, name: string, superOb: Observable);
    set(value: any, src?: any): Observable;
    get(): any;
    update(src: any): any;
}
export declare function ObservableValue(inital: any, schema: Schema, name: string, superOb: Observable): void;
export declare function ObservableObject(inital: any, schema: Schema, name: string, superOb: Observable): void;
export declare function ObservableArray(inital: any, schema: Schema, name: string, superOb: Observable): void;
export declare enum ObservableModes {
    delay = 0,
    immediately = 1
}
export {};

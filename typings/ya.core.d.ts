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
export declare function camel(text: any, mix?: boolean): string;
/**
 * 判定字符串是否以某个串开始
 *
 * @export
 * @param {*} text 要判定的字符串
 * @param {*} token 开始标记字符串
 * @returns {boolean}
 */
export declare function startWith(text: any, token: any): boolean;
/**
 * 判定字符串是否以某个串结束
 *
 * @export
 * @param {*} text 要检测的字符串
 * @param {*} token 结束标记字符串
 * @returns {boolean}
 */
export declare function endWith(text: any, token: any): boolean;
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
export declare function deepClone(obj: any, _clones?: any[]): any;
export declare let extend: (...args: any[]) => any;
export declare let inherit: (ctor: any, base: any) => any;
export declare function create(ctor: {
    new (...args: any[]): any;
}, args?: any[] | boolean): any;
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
export declare function constant(enumerable?: boolean, target?: any, name?: any, value?: any): any;
export declare class Exception extends Error {
    constructor(msg: any, detail?: any);
}
declare enum ObservableTypes {
    value = 0,
    object = 1,
    array = 2
}
export declare class Schema {
    $type: ObservableTypes;
    $owner?: Schema;
    $name?: string;
    $defaultValue?: any;
    $item?: Schema;
    private '--root'?;
    private '--paths'?;
    constructor(defaultValue?: any, name?: string, owner?: Schema);
    length?: Schema;
    $prop(name: string, defaultValue?: any): Schema;
    $asArray(defaultItemValue?: any): Schema;
    $paths(): string[];
    $root(): Schema;
}
export declare function schemaBuilder(target?: Schema): any;
export declare class NodeDescriptor {
    tag?: string;
    content?: string | Schema | TObservable;
    component?: any;
    attrs?: {
        [name: string]: any;
    };
    children?: NodeDescriptor[];
    constructor(tag: string, attrs?: {
        [name: string]: any;
    });
    appendChild(child: any): NodeDescriptor;
    static invoke(fn: Function): void;
}
export declare const createElement: (tag: string, attrs: {
    [index: string]: any;
}, ...args: any[]) => NodeDescriptor;
export declare function vars(count?: number | {
    [index: string]: any;
}): any;
export declare type TObservableEvent = {
    value: any;
    old: any;
    src?: any;
    sender?: Observable;
    removed?: boolean;
    cancel?: boolean;
    bubble?: boolean;
};
export declare function observable(initial: any, name?: string, owner?: TObservable): any;
export declare type TObservable = {
    [index in number | string]: TObservable;
} & {
    (value?: any, disposor?: any): any;
    $Observable: Observable;
};
export declare class Observable {
    type: ObservableTypes;
    name: string;
    old: any;
    value: any;
    schema: Schema;
    owner?: Observable;
    $observable: TObservable;
    listeners?: {
        (evt: TObservableEvent): any;
    }[];
    captures?: {
        (evt: TObservableEvent): any;
    }[];
    length?: Observable;
    constructor(inital: any, schema?: Schema, owner?: Observable, name?: string);
    getValue(): any;
    setValue(value: any): Observable;
    subscribe(handler: (evt: TObservableEvent) => any, disposer?: any): Observable;
    unsubscribe(handler: (evt: TObservableEvent) => any): Observable;
    capture(handler: (evt: TObservableEvent) => any, disposer?: any): Observable;
    uncapture(handler: (evt: TObservableEvent) => any): Observable;
    update(bubble?: boolean, src?: TObservableEvent): Observable;
}
export declare class Scope {
    private '--parent'?;
    private '--this'?;
    private '--name'?;
    constructor(parentOrThis: Scope | TObservable, name?: string);
    $observable(schema: Schema, inital?: any, deepSearch?: boolean): TObservable;
    $createScope(name?: string): Scope;
}
export declare type TComponent = any;
export declare type TMeta = {
    resolved: boolean;
    tag?: string;
    renderer: (state: any, sender?: any) => any;
    ctor: {
        new (...args: any[]): TComponent;
    };
    schema: Schema;
    descriptor: NodeDescriptor;
    props?: string[];
};
declare class RuntimeInfo {
    meta: TMeta;
    component: TComponent;
    node: TNode;
    model: TObservable;
    scope: Scope;
    parent: RuntimeInfo;
    children: RuntimeInfo[];
    mounted: boolean;
    disposed: boolean;
    constructor(meta: TMeta, opts: any, parent?: RuntimeInfo);
    render(): any;
    appendChild(child: RuntimeInfo): this;
    mount(container: TNode): TComponent;
    dispose(): void;
}
declare class Runtime {
    roots: RuntimeInfo[];
    timer: number;
    tick: number;
    constructor();
    mount(container: TNode, renderer: any, opts?: any): RuntimeInfo;
    private _addRoot;
    private _tick;
}
export declare let runtime: Runtime;
export declare function mount(container: TNode, opts: any, extra?: any): any;
declare type TRenderContext = {
    descriptor: NodeDescriptor;
    scope: any;
    component: TComponent;
};
export declare function render(context: TRenderContext): any;
export declare function resolveBindValue(bindValue: any, context: TRenderContext, bind?: (value: any, observable: TObservable) => any): {
    value: any;
    observable: TObservable;
};
export declare class Component {
}
export declare type TNode = any;
export declare function component(tag: string | Function, ctor?: Function): any;
export declare const platform: {
    createElement(tag: string): any;
    createText(txt: string): any;
    createComment(comment: any): any;
    attach(node: any, evtName: string, handler: Function): void;
    detech(node: any, evtName: string, handler: Function): void;
    mount(container: any, node: any): void;
    alive(node: any, value?: boolean): boolean;
    appendChild(parent: any, child: any): void;
    insertBefore(inserted: any, relative: any): void;
    remove(node: any): boolean;
    clear(node: any): void;
    eachChildren(node: any, callback: (child: any, i: number) => any): void;
    setText(node: any, txt: string): void;
    setAttribute(node: any, name: string, value: any): void;
};
export {};

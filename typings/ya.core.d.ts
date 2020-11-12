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
    constructor(defaultValue?: any, name?: string, owner?: Schema);
    length?: Schema;
    $prop(name: string, defaultValue?: any): Schema;
    $asArray(defaultItemValue?: any): Schema;
    $paths(): string[];
    $resolveFromRoot(root: any): any;
}
export declare function schemaBuilder(target?: Schema): any;
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
    (value?: any): any;
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
export declare class NodeDescriptor {
    tag?: string;
    content?: string;
    component?: any;
    attrs?: {
        [name: string]: any;
    };
    children?: NodeDescriptor[];
    constructor(tag: string, attrs?: {
        [name: string]: any;
    });
    appendChild(child: any): NodeDescriptor;
}
export declare type TComponent = any;
export declare function render(descriptor: NodeDescriptor, context: any, ownComponent: TComponent): void;
export {};

/**
 * 实体属性配置选项
 *
 * @export
 * @interface IPropertyOptions
 */
export interface IPropertyOptions {
    /**
     * 属性名
     *
     * @type {string}
     * @memberof IPropertyOptions
     */
    name?: string;
    /**
     * 属性类型
     * type/uiType/dataType 如果没有指定，会相互推断
     * @type {string}
     * @memberof IPropertyOptions
     */
    type?: string;
    /**
     * 显示在ui上的类型，用于构建input-control
     *
     * @type {string}
     * @memberof IPropertyOptions
     */
    uiType?: string;
    /**
     * 数据类型，一般是后台使用，用于自动生成数据库表
     *
     * @type {string}
     * @memberof IPropertyOptions
     */
    dataType?: string;
    /**
     * 验证规则
     *
     * @type {{[type:string]:any}}
     * @memberof IPropertyOptions
     */
    validations?: {
        [type: string]: any;
    };
}
/**
 * 实体配置选项
 *
 * @export
 * @interface IEntityOptions
 */
export interface IEntityOptions {
    /**
     * 属性集合
     *
     * @type {{[name:string]:IPropertyOptions}}
     * @memberof IEntityOptions
     */
    properties: {
        [name: string]: IPropertyOptions;
    };
}
export declare function defaultEntityOptionsLoader(url: string, callback: any): void;
declare class Readiable {
    private '$-domain-readiable-callbacks';
    ready(callback?: (value: any) => any): Readiable;
}
export declare class PropertyDescriptor extends Readiable {
    name: string;
    opts: IPropertyOptions;
    type: string | EntityDescriptor;
    uiType: string;
    dataType: string;
    constructor(name: string, opts: IPropertyOptions);
}
export declare class EntityDescriptor extends Readiable {
    name: string;
    opts?: IEntityOptions;
    properties: {
        [name: string]: PropertyDescriptor;
    };
    constructor(name: string, opts?: IEntityOptions);
}
export {};

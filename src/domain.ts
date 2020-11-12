
/**
 * 实体属性配置选项
 *
 * @export
 * @interface IPropertyOptions
 */
export interface IPropertyOptions{

    /**
     * 属性名
     *
     * @type {string}
     * @memberof IPropertyOptions
     */
    name?:string;

    /**
     * 属性类型
     * type/uiType/dataType 如果没有指定，会相互推断
     * @type {string}
     * @memberof IPropertyOptions
     */
    type?:string;

    /**
     * 显示在ui上的类型，用于构建input-control
     *
     * @type {string}
     * @memberof IPropertyOptions
     */
    uiType?:string;

    /**
     * 数据类型，一般是后台使用，用于自动生成数据库表
     *
     * @type {string}
     * @memberof IPropertyOptions
     */
    dataType?:string;

    /**
     * 验证规则
     *
     * @type {{[type:string]:any}}
     * @memberof IPropertyOptions
     */
    validations?:{[type:string]:any};
}

/**
 * 实体配置选项
 *
 * @export
 * @interface IEntityOptions
 */
export interface IEntityOptions{

    /**
     * 属性集合
     *
     * @type {{[name:string]:IPropertyOptions}}
     * @memberof IEntityOptions
     */
    properties:{[name:string]:IPropertyOptions};
}

//////////
// 配置

//////////
// 加载
let headElement:HTMLHeadElement;
export function defaultEntityOptionsLoader(url:string,callback){
    if(!headElement){
        let heads = document.getElementsByTagName("head");
        if(heads){}
    }
}


function internal(target,name:string, value:any, isFullfilled?:boolean){
    Object.defineProperty(target,name,{enumerable:false,configurable:isFullfilled,writable:false,value:value});
}



class Readiable{
    private '$-domain-readiable-callbacks':{(value:any):any}[];
    ready(callback?:(value:any)=>any):Readiable{
        let callbacks = this['$-domain-readiable-callbacks'];
        if(callbacks===null){
            let fullFillValue = this['$-domain-readiable-fulfillValue'];
            callback.call(this,fullFillValue);
            return this;
        }else{
            if(callbacks===undefined) {
                callbacks = [];
                internal(this,'$-domain-readiable-callbacks',callbacks,false);
            }
            callbacks.push(callback);
        }
        return this;
    }

}

function ready(target,value){
    let callbacks = target['$-domain-readiable-callbacks'];
    internal(target,'$-domain-readiable-callbacks', null,true);
    internal(target,'$-domain-readiable-fulfillValue',value,true);
    if(callbacks) for(let callback of callbacks) callback.call(this,value);
}

const loadingDomains:string[] = [];

export class PropertyDescriptor extends Readiable{
    type:string | EntityDescriptor;
    uiType:string;
    dataType:string;
    constructor(public name:string,public opts:IPropertyOptions){
        super();
        this.type = opts.type || "string";
        this.uiType = opts.uiType || this.type;
        this.dataType = opts.dataType || this.type;
        let type = entityDescriptors[this.type];
        if(type){
            this.type =type;
            type.ready(()=>ready(this,this));
        }else ready(this,this);
    }
}

export class EntityDescriptor extends Readiable{
    properties : {[name:string]:PropertyDescriptor};
    constructor(public name:string,public opts?:IEntityOptions){
        super();
        this.properties = {};
        if(opts){
            if(opts.properties) initEntityProperties(this,opts);
        }else{
            // loadEntityOptions(name,(opts)=>{
            //     initEntityProperties(this,opts);
            // })
        }
        // a - b - a
    }
}
function initEntityProperties(entityDescriptor:EntityDescriptor,opts:IEntityOptions){
    for(let propname in opts.properties){
        let prop = new PropertyDescriptor(propname,opts.properties[propname]);
        entityDescriptor.properties[propname] = prop;
    }
    ready(entityDescriptor,entityDescriptor);
}
let entityDescriptors = {};

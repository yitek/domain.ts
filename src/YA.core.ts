declare let YA
///////////////////////////////////////////////////////////////
// 一 JS机制的扩展部分

///////////////////////////////////////////////////////////////
// 类型判断
export function is_string(obj:any):boolean{
    return typeof obj ==="string";
}
export function is_bool(obj:any):boolean{
    return typeof obj ==="boolean";
}

export function is_number(obj:any):boolean{
    return typeof obj ==="number";
}
export function is_assoc(obj:any):boolean{
    if (!obj) return false;
    return Object.prototype.toString.call(obj)==="[object Object]";
}


export function is_object(obj:any):boolean{
    if (!obj) return false;
    let t= Object.prototype.toString.call(obj) as string;
    if (t.indexOf("[object ")==0) return true;
}

export function is_array(obj:any):boolean {
    if(!obj) return false;
    return Object.prototype.toString.call(obj)==="[object Array]";
}

export function is_empty(obj:any):boolean {
    if (!obj) return true;
    let t = typeof obj;
    if (t==="function" || t==="number" || t==="boolean")return false;
    for (let n in obj) return false;
    return true;
}

////////////////////////////////////////////////////////
// 字符串处理

let trimRegx:RegExp = /(^\s+)|(\s+$)/g;

/**
 *  去掉两边空格
 *
 * @export
 * @param {*} text
 * @returns {string}
 */
export function trim(text:any):string {
    if (text===null || text===undefined) return "";
    return text.toString().replace(trimRegx, "");
}
const intRegx = /^\s*[+\-]?\d+\s*$/g

const eastWordRegx:RegExp = /[-_](\w)/g;
const firstUpperCaseRegx:RegExp = /^([A-Z])/g;
const firstLowerCaseRegx:RegExp = /^([a-z])/g;

/**
 * 骆驼命名法
 * 将连字号变为骆驼命名法
 *
 * @export
 * @param {*} text
 * @param {boolean} [mix] true是大写开头，大小写混写的格式
 * @returns {string}
 */
export function camel(text:any,mix?:boolean):string{
    if (text===null || text===undefined) return "";
    let result:string = text.toString().replace(trimRegx,"").replace(eastWordRegx,(c:string)=>c.toUpperCase());
    if(!mix) result  = result.replace(firstUpperCaseRegx,(c:string)=>c.toLowerCase())
    else result = result.replace(firstLowerCaseRegx,(c:string)=>c.toUpperCase())
    return result
    
}


/**
 * 判定字符串是否以某个串开始
 *
 * @export
 * @param {*} text 要判定的字符串
 * @param {*} token 开始标记字符串
 * @returns {boolean}
 */
export function startsWith(text:any,token:any) :boolean {
    if(!text) return false;
    if(token===undefined || token===null) return false;
    return text.toString().indexOf(token.toString())===0;
}


/**
 * 判定字符串是否以某个串结束
 *
 * @export
 * @param {*} text 要检测的字符串
 * @param {*} token 结束标记字符串
 * @returns {boolean}
 */
export function endsWith(text:any, token :any) :boolean{
    if(!text) return false;
    if(token===undefined || token===null) return false;
    text = text.toString();
    token = token.toString();
    return text.indexOf(token)===text.length - token.length;
}

let percentRegx = /([+-]?[\d,]+(?:.\d+))%/g;

/**
 * 是否是百分数
 *
 * @export
 * @param {*} text
 * @returns {number}
 */
export function is_percent(text:any):number {
    if (text===null || text===undefined) return undefined;
    let match = text.toString().match(percentRegx);
    if (match) return match[1];
}

/////////////////////
// 数组处理


export function array_index(obj:any, item:any, start:number=0):number {
    if(!obj) return -1;
    for(let i= start, j= obj.length; i<j; i++) {
        if(obj[i]===item) return i;
    }
    return -1;
}
export function array_contains(obj:any,item:any):boolean {
    return array_index(obj, item)>=0;
}
export function array_add_unique(arr:any[],item:any):boolean{
    if(!arr || !arr.push) return false;
    for (let i = 0, j=arr.length; i<j; i++) {
        if (arr[i]===item) return false;
    }
    arr.push(item);
    return true;
}
export function array_remove(arr:any[],item:any):boolean{
    if(!arr || !arr.push || !arr.shift || !arr.length) return false;
    let hasItem = false;
    for (let i = 0, j=arr.length; i<j; i++) {
        let existed = arr.shift();
        if (existed!==item) arr.push(existed);
        else hasItem = true;
    }
    return hasItem;
}


///////////////////////////////////////
// 对象处理

export function clone(obj:any,_clones?:any[]){
    const t = typeof obj;
    if(t==='object'){
        if(!_clones) _clones=[];
        else for(const cloneInfo of _clones){
            if(cloneInfo.origin===obj) return cloneInfo.cloned;
        }
        let cloned = is_array(obj)?[]:{};
        _clones.push({origin:obj,cloned:cloned});
        for(let n in obj) {
            clone[n] = clone(obj[n],_clones);
        }
    }else return obj;
}

export let extend :(...args)=>any= function (){
    let target = arguments[0] ||{};
    for (let i=1, j=arguments.length; i<j; i++) {
        let o = arguments[i];
        if (o) for (let n in o) target[n] = o[n];
    }
    return target;
}


export class DPath{
    public dpath:string
    public getters:{(value,sure,context?):any}[]
    public last:string
    constructor(dpath:string,splitor='/'){
        dpath = this.dpath = dpath.replace(trimRegx,'')
        const getters = []
        
        const paths = dpath.split(splitor)
        const first = paths.shift()
        getters.push((current,sure,context)=>context[first])
        
        for(let i=0,j=paths.length-1;i<=j;i++)((name,index,paths,getters,isLast)=>{
            let isArray = false
            if(!isLast){
                const nextKey = paths[index+1]
                isArray = (intRegx.test(nextKey))
                getters.push((current,sure)=>{
                    let value = current[name]
                    if(sure && !value){
                        value = current[name] = isArray?[]:{}
                    }
                    return value
                })
            }else{
                this.last = name
                getters.push((current,sure)=>current?current[name]:undefined)
            }
            
        })(paths[i],i,paths,getters,i===j)
        this.getters = getters
    }
    get(target,sure?,context?){
        if(sure===true || sure===false){
            context = context || {}
            context[''] = target
        } else if(context===undefined){
            context = sure || {}
            context[''] = target
            sure = false
        }
        let value =target
        for(const i in this.getters){
            value = this.getters[i](value,sure, context)
        }
        return value
    }
    set(target:any,value:any,context?){
        context ||(context={})
        context[''] = target
        for(let i = 0,j=this.getters.length-1;i<j;i++){
            target = this.getters[i](target,true, context)
        }
        target[this.last] = value
        return this
    }
    static fetch(path:string){
        let accessor = DPath.accessors[path]
        if(!accessor){
            accessor = DPath.accessors[path] = new DPath(path)
            DPath.accessors[accessor.dpath] = accessor
        }
        return accessor
    }
    static getValue(target:any,dpath:string,sure?,context?){
        return DPath.fetch(dpath).get(target,sure, context)
    }
    static setValue(target:any, dpath:string,value:any,context?){
        return DPath.fetch(dpath).set(target,value,context)
    }
    static accessors : {[path:string]:DPath} = {}
}





//////////////////////////////////////////////////////////
// 类/对象标注


export let inherit = (function () {
    
    return function (ctor, base) {
        //extendStatics(ctor, base);
        function __() {Object.defineProperty(this,'constructor' ,{value:ctor,enumerable:false,configurable:true,writable:true}); }
        ctor.prototype = base === null ? Object.create(base) : (__.prototype = base.prototype, new __());
        return ctor
    };
})();

export function accessable(desc:any,target?,name?,value?){
    // 标记用法 @notation() 
    if(target===undefined) return function(target,name?) {
        if(name===undefined) {
            // 标记应用在class或object上 
            // @notation() class T {}
            target = target.prototype || target;
            for(let n in target) {
                desc.value = target[n];
                Object.defineProperty(target, n,desc);
            }
        }else {
            // 标记应用在成员上
            // class T { @notation() id:string;} 
            desc.value = target[name];
            Object.defineProperty(target, name, desc);
        }
    };
    if(name===undefined){
        // 指定对象所有成员的可访问性
        // implicit({name:''})
        for(let n in target) {
            desc.value = target[n];
            Object.defineProperty(target, n,desc);
        }
        return target;
    }

    if(typeof name==='object'){
        if(is_array(name)) {
            for(const membername of name) {
                desc.value = target[membername];
                Object.defineProperty(target, membername , desc);
            }
        }else {
            for(var n in name) {
                desc.value = name[n];
                Object.defineProperty(target , n , desc);
            }
        }
        return target;
    }
    desc.value = value;
    Object.defineProperty(target,name,desc);
    return target;
}


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
export function implicit(target?,name?,value?){
    return accessable({enumerable:false,writable:true,configurable:true},target,name,value);    
}
export function constant(enumerable?:boolean,target?,name?,value?){
    return accessable({enumerable:enumerable!==false,writable:false,configurable:true},target,name,value)
}


export function nop(){}



export class Exception extends Error{
    constructor(msg,detail?:any){
        console.error(msg,detail);
        super(msg);
        if(detail)for(let n in detail) this[n] = detail[n];
    }
}
///////////////////////////////////////////////
// 二 基础机制类

let seed = 0
let seeds:{[name:string]:number} = {}

export function rid(prefix?:string){
    const rnd = Math.random()
    if(prefix) {
        let sd = seeds[prefix]
        if(++sd>2100000000) sd= 0
        seeds[prefix] = sd
        return prefix + sd + rnd.toString()
    }
    const rs = seed.toString()
    if(++seed>2100000000) seed = 0
    return rs + rnd.toString()
}

export const None = new Proxy(function(){return this},{
    get(){return undefined},
    set(){return this}
})




const dispose = function(handler?){
    if(handler===undefined){
        const disposeHandlers = this['--disposes']
        if(disposeHandlers){
            for(const i in disposeHandlers){
                disposeHandlers[i].call(this,this)
            }
        }
        Object.defineProperty(this,'--disposes',{enumerable:false,configurable:false,writable:false,value:null})
        Object.defineProperty(this,'$disposed',{enumerable:false,configurable:false,writable:false,value:true})
        return this
    }
    let disposeHandlers = this['--disposes']
    if(disposeHandlers===null){
        handler.call(this,this)
        return this
    }
    if(disposeHandlers===undefined) Object.defineProperty(this,'--disposes',{enumerable:false,configurable:true,writable:false,value: disposeHandlers=[]})
    disposeHandlers.push(handler)
    return this

}
export function disposable(target){
    Object.defineProperty(target,'$dispose',{enumerable:false,configurable:false,writable:true,value:dispose})
}
export class Disposiable{
    $disposed?:boolean
    $dispose(callback?){ throw 'abstract method'}
    static isInstance(obj){
        return obj && obj.$dispose && typeof obj.$dispose==='function'
    }
}
disposable(Disposiable.prototype)

//////////////////////////////////////////////////////////////////
// 对象创建与注入
//

export type TInjectFactory = (name:string,scope:InjectScope,target?:any)=>any

export class InjectScope extends Disposiable{
    factories:{[name:string]:TInjectFactory}
    constructor(public name?:string,public superScope?:InjectScope){
        super()
        this.factories = {}
        this.$constant(InjectScope.svcname,this)
    }

    createScope(name?:string):InjectScope{
        return new InjectScope(name,this)
    }
    resolve(name:string,context?:any):any{
        let scope:InjectScope = this
        let factory:TInjectFactory
        while(scope){
            factory = scope.factories[name]
            if(!factory) scope = scope.superScope
            else break
        }
        if(factory) return factory(name,this , context)
        return undefined
    }
    register(name:string, ctor:{new(...args):any},singleon?:boolean):Activator{
        if(this.factories[name]) throw new Exception('已经注册过该依赖项:' + name)
        const activator = Activator.fetch(ctor)
        let instance 
        const factory = (name,scope,context)=>{
            if(singleon && instance!==undefined) return instance
            let inst = activator.createInstance(scope)
            if(inst && typeof inst.$dispose==='function') this.$dispose(()=>inst.$dispose())
            if(singleon) instance = inst
            return inst
        }
        this.factories[name] = factory
        return activator
    }
    $constant(name:string, value:any):InjectScope{
        if(this.factories[name]) throw new Exception('已经注册过该依赖项:' + name)
        this.factories[name] = (name,scope,context)=>value
        return this
    }
    $factory(name:string, factory : TInjectFactory):InjectScope{
        if(this.factories[name]) throw new Exception('已经注册过该依赖项:' + name)
        this.factories[name] = factory
        return this
    }
    static global:InjectScope = new InjectScope()
    static svcname:string = 'services'
}

export class Activator{
    dependenceArgs:string[]
    dependenceProps:{[propname:string]:string}
    constructor(public ctor:{new(...args):any}){

    }
    prop(propname:string|{[pname:string]:string}|string[],depname?:string):Activator{
        if(!this.dependenceProps) this.dependenceProps={}
        if(depname===undefined){
            if(typeof propname==='object') {
                if(is_array(propname)) for(const i in propname as string[]) this.prop(depname[i],depname[i])
                else for(const pname in propname as {[pname:string]:string}) this.prop(pname,depname[pname])
            } else depname = propname
        }
        propname = (propname as string).replace(trimRegx,'')
        depname = depname.replace(trimRegx,'')
        if(!propname || depname) throw new Exception('依赖必须指定属性名/依赖名')
        this.dependenceProps[propname] = depname
        return this
    }
    createInstance(args:InjectScope|any[],constructing?:any,constructed?:any){
        let thisInstance:any = Object.create(this.ctor.prototype)
        if(constructing)  constructing(thisInstance)
        let retInstance
        if(args instanceof InjectScope){
            retInstance = createFromInjection(args as InjectScope,thisInstance,this)
        }else {
            retInstance = this.ctor.apply(retInstance, args || [])
        }
        if(retInstance===undefined) retInstance = thisInstance
        if(constructed)  {
            const justified = constructed(thisInstance,this.ctor)
            if(justified!==undefined) retInstance = justified
        } 
        return retInstance
    }
    static fetch(ctorOrProto:any, parseArgs?:boolean):Activator{
        if(!ctorOrProto) return undefined
        let activator:Activator = ctorOrProto['--activator']
        if(!activator){
            const t = typeof ctorOrProto
            if(t==='function'){
                activator = new Activator(ctorOrProto as {new(...arg):any})
            }else if(t==='object'){
                const ctor = function(){}
                activator = new Activator(ctor as any as {new(...arg):any})
                activator.dependenceArgs = []
            }
            Object.defineProperty(ctorOrProto,'--activator',{enumerable:false,configurable:false,writable:false,value:activator})
        }
        if(parseArgs && !activator.dependenceArgs) parseDepdenceArgs(activator)
        return activator
    }
}
function parseDepdenceArgs(activator:Activator){
    const code = activator.ctor.toString()
    const start = code.indexOf('(')
    const end = code.indexOf(')',start)
    const argsText = code.substring(start+1,end-1)
    const argslist = argsText.split(',')
    const args = []
    for(const  i in argslist) args.push(argslist[i].replace(trimRegx,''))
    activator.dependenceArgs = args
}
function createFromInjection(scope:InjectScope,selfInstance:any,activator:Activator){
    if(!activator.dependenceArgs) parseDepdenceArgs(activator)

    if(this.props && this.props.length){
        for(const propname in this.props){
            const depname = this.props[propname]
            const propValue = scope.resolve(depname)
            selfInstance[propname] = propValue
        }
    }
    if(this.args && this.args.length){
        const args = []
        for(const i in this.args){
            const name = this.args[i]
            const argValue = scope.resolve(name)
            args.push(argValue)
        }
        return this.ctor.apply(selfInstance,args)
    }else {
        return this.ctor.call(selfInstance)
    }
}

export function injectable(ctorOrProto?:any){
    const t = typeof ctorOrProto
    if(t==='function' || t==='object') {
        return Activator.fetch(ctorOrProto,true)
    }
    return function(target,name?){
        const activator = Activator.fetch(ctorOrProto)
        if(name!==undefined) {
            activator.prop(name,ctorOrProto)
        }
        return target
    }
}
////////////////////////////////////////////////////////////////
// ModelSchema 模型架构
//
declare let Proxy;


enum ModelSchemaTypes{
    constant,
    value,
    object,
    array,
    computed
}

@implicit()
export class ModelSchema {
    $type: ModelSchemaTypes
    $name?: string
    $superSchema?: ModelSchema
    $defaultValue?: any
    $dependenceSchemas:ModelSchema[]
    $itemSchema?: ModelSchema
    length?: ModelSchema
    private '--root'?:ModelSchema
    private '--paths'?:string[]
    constructor(defaultValue?:any,name?: string |ModelSchema[],superSchema?: any){
        let type :ModelSchemaTypes
        let deps :ModelSchema[]
        if(superSchema==='constant'){
            type = ModelSchemaTypes.constant
        }else if(superSchema==='computed'){
            type = ModelSchemaTypes.computed
            deps = name as ModelSchema[]
            superSchema = undefined
        }
        implicit(this,{
            '$type': type,
            '$name': name,
            '$dependenceSchemas':deps,
            '$superSchema': superSchema,
            '$defaultValue':defaultValue,
            '$itemSchema':undefined,
            'length':undefined
        });
        if(!defaultValue  || type===ModelSchemaTypes.constant || typeof defaultValue!=='object') return
        
        if(defaultValue.length!==undefined && defaultValue.push && defaultValue.pop){
            this.$asArray(clone(defaultValue[0]))
        } else {
            for(let n in defaultValue) this.$prop(n,clone(defaultValue[n]))
        }
    }
    
    $prop(name:string, defaultValue?:any): ModelSchema{
        if(this.$type === ModelSchemaTypes.array) throw new Exception('已经定义为array了',{'schema':this});
        this.$type = ModelSchemaTypes.object;
        return this[name] || (this[name] = new ModelSchema(defaultValue,name,this));
    }
    $asArray(defaultItemValue?: any):ModelSchema{
        if(this.$type !== ModelSchemaTypes.value) throw new Exception('已经定义为array/object了',{'schema':this});
        this.$type = ModelSchemaTypes.array;
        let lengthSchema = new ModelSchema(0,'length',this);
        Object.defineProperty(this,'length',{enumerable:false,configurable:false,writable:false,value:lengthSchema});
        let itemSchema = new ModelSchema(defaultItemValue,null,this);
        return this.$itemSchema = itemSchema;
    }
    $dataPath(){
        let dpath :DPath = this['--data-path']
        if(!dpath) dpath = buildSchemaInfo.call(this).dataPath
        return dpath
    }
    $paths(){
        let paths:string[] = this['--paths']
        if(!paths) paths = buildSchemaInfo.call(this).paths
        return paths
    }
    $root(){
        let root:ModelSchema = this['--root']
        if(!root) root = buildSchemaInfo.call(this).root
        return root
    }

    static createBuilder(target:ModelSchema){
        if(!target || target instanceof ModelSchema) return new Proxy(new ModelSchema(),memberStatesTraps)
        return new Proxy(target,rootStatesTraps);
    }

    static constant:ModelSchema = new ModelSchema(None,'<CONSTANT>','constant')

}
function buildSchemaInfo(){
    let schema:ModelSchema = this
    let paths:string[] =[]
    let root :ModelSchema
    while(schema){
        root = schema
        paths.unshift(schema.$name)
        schema = schema.$superSchema
    }
    const pathtext = paths.join('/')
    const dpath = DPath.fetch(pathtext)
    constant(false, this,'--paths',paths)
    constant(false, this, '--root',root)
    constant(false,this,'--data-path',dpath)
    return {paths,root, dataPath:dpath}
}

const rootStatesTraps = {
    get(target: {inst:any,schema:ModelSchema},propname:string){
        if(!target.inst) return target.inst[propname]
        if(propname[0]==='$') {
            if(propname==='$schema') return target.schema;
            return target[propname];
        }
        return new Proxy(target.schema.$prop(propname),memberStatesTraps);
    },
    set(target:{inst:any,schema:ModelSchema},propname:string,value:any){
        if(!target.inst) {
            target.inst[propname] = value
            return
        } 
        throw new Exception('schemaBuilder不可以在schemaBuilder上做赋值操作');
    }
};
const memberStatesTraps = {
    get(schema: ModelSchema,propname:string){
        if(propname[0]==='$') {
            if(propname==='$schema') return schema;
            return schema[propname];
        }
        return new Proxy(schema.$prop(propname),memberStatesTraps);
    },
    set(target:ModelSchema,propname:string,value:any){
        throw new Exception('schemaBuilder不可以在schemaBuilder上做赋值操作');
    }
};


//////////////////////////////////////////////////////////////
// Subscribe/Publish


export function eventable(target,name){
    const privateName = '--event-' + name + '-handlers'
    const fn = function(handler?,unsubscribe?:boolean):any{
        if(typeof handler==='function'){
            let handlers = this[privateName]
            if(!handlers) {
                if(unsubscribe) return this
                Object.defineProperty(target,privateName,{configurable:false,writable:false,enumerable:false,value:handlers=[]})
                
            }else if(unsubscribe) {
                array_remove(handlers,handler)
                return this
            }
            handlers.push(handler)
            return this
        }

    }
    Object.defineProperty(fn,'--event',{enumerable:false,writable:false,configurable:false,value:true})
    Object.defineProperty(target,name,{enumerable:false,configurable:true,writable:true,value:fn})
}

export function subscribable(target){
    Object.defineProperty(target,'$subscribe',{enumerable:false,configurable:true,writable:true,value:function(handler,disposer?){
        let handlers = this['--ob-handlers']
        if(!handlers) Object.defineProperty(this,'--ob-handlers',{enumerable:false,writable:false,configurable:false,value:handlers=[]})
        handlers.push(handler)
        if(disposer) disposer.dispose(()=>{
            array_remove(handlers,handler)
        })
        return this;
    }})
    Object.defineProperty(target,'$unsubscribe',{enumerable:false,configurable:true,writable:true,value:function(handler){
        let handlers = this['--ob-handlers']
        if(!handlers) return this
        array_remove(handlers,handler)
        return this;
    }})
    Object.defineProperty(target,'$publish',{enumerable:false,configurable:true,writable:true,value:function(arg?:any,useApply?:boolean){
        let handlers = this['--ob-handlers']
        if(!handlers) return this
        if(useApply) for(let i in handlers) handlers[i].apply(this,arg)
        else for(let i in handlers) handlers[i].call(this,arg)
        return this
    }})
}

export class Subscription{
    $subscribe(handler:any,disposable:Disposiable):any{throw 'abstract method'}
    $unsubscribe(handler:any):any{throw 'abstract method'}
    $publish(evt?:any,useApply?:boolean){throw 'abstract method'}
    static isInstance(obj:any):boolean{
        return (obj && obj.$subscribe && obj.$unsubscribe && obj.$publish)
    }
}
subscribable(Subscription.prototype)




////////////////////////////////////
// createElement

export type TNodeDescriptor = {
    tag?: string;
    content?: string| ModelSchema | TObservable;
    component?: any;
    attrs?: {[name:string]:any};
    children?: TNodeDescriptor[];
}

///////////////////////////////////////
// observable


export type TObservableEvent = {
    value?:any
    old?:any
    src?:any
    sender?:Observable
    removed?:boolean
    cancel?:boolean
    stop?:boolean
}
/*
export function observable(initial:any,name?:string,owner?:TObservable){
    if(owner){
        let facade = owner[name]
        if(facade) return facade(initial)
        let ownerOb = owner(Observable)
        let ob = new Observable(initial,undefined,ownerOb,name)
        Object.defineProperty(owner,name,{enumerable:true,configurable:false,writable:false,value:ob.$observable})
        return ob.$observable
    }else {
        if(initial instanceof Schema) return new Observable(undefined,initial).$observable
        return new Observable(initial).$observable
    }
}*/

export type TObservable = {
    [index in number | string]: TObservable
} & {
    (value?: any,disposor?:any,capture?:boolean): any
    '$Observable':Observable
}


@implicit()
export class Observable{
    type:ModelSchemaTypes
    name:string
    old:any
    value:any
    schema: ModelSchema
    super?:Observable
    deps?:Observable[]
    dep_handler?:(evt:TObservableEvent)=>any
    $observable:TObservable
    listeners?:{(evt:TObservableEvent):any}[]
    captures?:{(evt:TObservableEvent):any}[]
    hasChanges?:boolean
    length?:Observable
    constructor(initial:any,schema?:ModelSchema,name?:string,superOb?:Observable|string){
        let facade;
        facade = (value?:any,isSubscriber?:any,capture?:boolean):any=>{
            if(value===undefined) {
                return this.value===Observable?this.old:this.value
            }else if(value===Observable) return this
            else if(value===ModelSchema) return this.schema
            if(isSubscriber!==undefined){
                if(this.type!==ModelSchemaTypes.constant){
                    if(isSubscriber){
                        if(capture) this.capture(value,isSubscriber)
                        else this.subscribe(value,isSubscriber)
                    } else if(isSubscriber===false){
                        if(capture) this.uncapture(value)
                        else this.unsubscribe(value)
                    } else throw new Exception('不正确的参数,isSubscriber不能为空字符串等空值')
                }
                return facade
            }
            if(value){
                if(value instanceof ModelSchema) throw new Exception('不能够将Schema赋值给observable')
                if(this.schema.$type=== ModelSchemaTypes.constant || this.schema.$type===ModelSchemaTypes.computed) return facade
                if(value['$Observable']) value = value()
                else if(value.$observable) value = value.get()
            }
            this.set(value)
            return facade
        }
        this.$observable = facade as any
        Object.defineProperty(facade,'$Observable',{enumerable:false,configurable:false,writable:false,value:this})
        
        
        this.name = name || schema.$name
        if(superOb === 'constant' || schema?.$type===ModelSchemaTypes.constant){
            this.type = ModelSchemaTypes.constant
            return
        }
        if(superOb === 'computed' || schema?.$type===ModelSchemaTypes.computed){
            this.type = ModelSchemaTypes.computed
            return
        }
        schema = this.schema = (schema as ModelSchema) || new ModelSchema(initial,name)
        this.type = schema.$type
        if(this.type===ModelSchemaTypes.object){
            initObservableObject.call(this, facade, initial, schema)            
        }else if(this.type === ModelSchemaTypes.array){
            initObservableArray.call(this, facade, initial, schema)
        }else if(this.type=== ModelSchemaTypes.constant){
            this.get = ()=>schema.$defaultValue
            this.update = this.set = this.subscribe = this.unsubscribe = this.capture = this.uncapture = ()=>this
        } else if(this.type===ModelSchemaTypes.computed){
            initObservableComputed.call(this, facade, initial, schema)
        }else{
            this.old = initial===undefined?schema.$defaultValue:initial
        }
        this.value = Observable
    }

    get(){
        return this.value===Observable?this.old:this.value
    }
    set(value:any):Observable{
        this.value = value
        return this
    }
    defineProp(name:string,initial?:any):Observable{
        if(this.type===ModelSchemaTypes.value){
            initObservableObject.call(this,this.$observable,{})
        }else if(this.type ===ModelSchemaTypes.array) throw new Exception('数组不能定义成员')
        else if(this.$observable[name]) throw new Exception('已经有该成员')
        const result = new Observable(initial,undefined,name,this)
        Object.defineProperty(this.$observable,name,{enumerable:true,configurable:false,writable:false,value: result})
        return result
    }
    subscribe(handler: (evt:TObservableEvent)=>any, disposer?:any):Observable{
        const handlers = this.listeners || (this.listeners=[])
        handlers.push(handler)
        if(disposer) disposer.dispose(()=>{
            array_remove(handlers,handler)
        })
        return this;
    }

    unsubscribe(handler: (evt:TObservableEvent)=>any):Observable{
        const handlers = this.listeners
        array_remove(handlers,handler)
        return this
    }

    capture(handler: (evt:TObservableEvent)=>any, disposer?:any):Observable{
        const handlers = this.captures || (this.captures=[])
        handlers.push(handler)
        if(disposer) disposer.dispose(()=>{
            array_remove(handlers,handler)
        })
        return this;
    }

    uncapture(handler: (evt:TObservableEvent)=>any):Observable{
        const handlers = this.captures
        array_remove(handlers,handler)
        return this
    }

    update(src?:any,removed?:boolean):Observable{
        const evt:TObservableEvent = {removed:removed,src:src}
        const changed = update.call(this,evt)
        if(changed && !evt.cancel) bubble.call(this,evt)
        return this
    }
}

function update(evt?:TObservableEvent):boolean{
    let value = this.value === Observable? this.old: this.value    
    if(this.value===Observable || this.value===this.old) return false;
    if(!evt) evt = {}
    evt.value = value;evt.old = this.old;evt.sender = this
    this.old = value
    this.value = Observable
    let handlers = this.listeners
    if(handlers)for(let i = 0,j=handlers.length;i<j;i++){
        handlers[i].call(this,evt)
    }
    return true
}

function bubble(evt:TObservableEvent){
    let owner = this.super
    while(owner && !(evt as any).cancel){
        let handlers = owner.captures;
        if(handlers){
            for(let i = 0,j=handlers.length;i<j;i++){
                handlers[i].call(this,evt)
            }
        }
        owner = owner.super
    }
}

function initObservableObject(facade:TObservable,initial:any,schema:ModelSchema){
    this.set = (value:any): Observable=>{
        if(!value) value={}
        let facade = this.facade;
        for(let name in facade){
            facade[name](value[name])
        }
        this.value = value
        return this
    }
    this.update = (src?:any,removed?:boolean)=>{
        const evt:TObservableEvent = {removed:removed,src:src}
        const changed = removed || update.call(this,evt)
        if(changed && !evt.cancel) bubble.call(this,evt)
        if(evt.stop) return this
        let facade = this.facade
        for(let n in facade){ 
            facade[n](Observable).update(evt)
        }
        return this
    }
    this.old = initial || {}
    for(let name in schema) {
        let member = new Observable(this.old[name],schema[name],this,name)
        Object.defineProperty(facade,name, {enumerable:true,configurable:false,writable:false,value:member.$observable})
    }

}
function initObservableArray(facade:TObservable,initial:any,schema:ModelSchema){
    this.set = (value)=>{
        if(!value) value=[]
        let facade = this.$observable
        for(let i =0,j=value.length;i<j;i++){
            let name = i.toString()
            let item = facade[name]
            if(item) {item(value[i]);continue;}
            item = new Observable(value[i],this.$schema.$item,this,name)
            Object.defineProperty(facade,name,{configurable:true,writable:false,enumerable:true,value:item.facade })
        }
        this.value = value
        this.length.set(value.length)
        return this
    }
    this.update = (src:any,removed?:boolean)=>{
        const evt:TObservableEvent = {removed:removed,src:src}
        let changed = update.call(this,evt)
        let oldLength = this.length.old
        let lenChanged = update.call(this.length,evt)

        if((changed || lenChanged) && !evt.cancel) bubble.call(this,evt)
        if(evt.stop) return this

        let facade = this.$observable
        for (let i= 0, j= evt.value.length; i<j; i++){
            let item = facade[i](Observable)
            item.update(evt)
        }
        for(let i = evt.value.length,j=oldLength;i<j;i++){
            const n = i.toString()
            let removedItem:Observable = facade[n](Observable)
            removedItem.update(evt,true)
            delete facade[n]
        }
        return this
    }
    let lengthSchema = schema.length
    let lengthObservable = new Observable(this.old.length,lengthSchema,this,'length')
    Object.defineProperty(facade,'length', {enumerable:false,configurable:false,writable:false,value:lengthObservable.$observable})

    this.old = initial || []
    
    if(initial)for(let i = 0,j=initial.length;i<j;i++){
        let name = i.toString()
        let itemObservable = new Observable(initial[i],this.schema.$itemSchema,this,name)
        Object.defineProperty(facade,name, {enumerable:false,configurable:true,writable:false,value:itemObservable.$observable})
    }
}
function initObservableComputed(facade:TObservable,initial:any,schema:ModelSchema){
    this.get = ()=>{
        if(this.value!==Observable) return this.value
        const args = []
        for(const i in this.deps){
            const value = this.deps[i].get()
            args.push(value)
        }
        return schema.$defaultValue.apply(this,args)
    }
    this.set= this.capture = this.uncapture = this.update = ()=>this
    this.subscribe = (handler: (evt:TObservableEvent)=>any, disposer?:any):Observable=>{
        if(!this.dep_handler){
            const callback = this.dep_handler = (src:TObservable)=>{
                const handlers = this.handlers
                if(!handlers || handlers.length===0){
                    for(const i in this.deps){
                        this.deps[i].unsubscribe(this.dep_handler)
                    }
                    this.dep_handler = undefined
                    return
                }
                const old = this.value ===Observable?undefined:this.value
                this.value = Observable
                const value = this.get()
                if(old===value) return
                const evt:TObservableEvent = {
                    value:value,old :old,sender : this,src:src
                }
                for(const i in handlers) handlers[i].call(this,evt)                
            }
            for(const i in this.deps){
                this.deps[i].subscribe(callback,disposer)
            }
        }
        Observable.prototype.subscribe.call(handler,disposer)  
        return this;
    }
    this.deps = initial
}
//////////////////////////////
// meta
// 控件元数据
// 所有控件都有
export type TComponent = any

export class ComponentMeta{
    tagName?:string
    resolved?:boolean
    activator:Activator
    scopeSchema?:ModelSchema
    modelSchema?:ModelSchema
    properties?:{[name:string]:DPath & {handlername?:string}}
    vnode?:TNodeDescriptor
    
    constructor(fn:Function){
        const scopeSchema = this.scopeSchema = new ModelSchema()
        const modelSchema = this.modelSchema = new ModelSchema(undefined,ComponentMeta.modelname)
        const modelSchemaProxy = ModelSchema.createBuilder(modelSchema)
        const scopeSchemaProxy = ModelSchema.createBuilder(scopeSchema)
        const self = fn.prototype
        let renderer :(model:any,injectScope:InjectScope)=>TNodeDescriptor = (fn as any).render || fn.prototype.render
        let vnode :TNodeDescriptor
        if(renderer){
            if(typeof renderer!=='function')
                vnode = ComponentMeta.parseTemplateText(renderer as any,self,modelSchemaProxy,scopeSchemaProxy) 
            else 
                vnode = renderer.call(self,modelSchemaProxy,scopeSchemaProxy)
        }
        if(!fn.prototype.render){
            let ctor = function(){
                fn.call(this['--'].model)
            } as any
            ctor.prototype = fn.prototype
            this.activator = Activator.fetch(ctor)
            this.activator.dependenceArgs=[]
        }else this.activator =Activator.fetch(fn,true)
        
        this.vnode = vnode
        return this
    }
    tag(name:string):ComponentMeta{
        if(this.tagName) throw new Exception('重复指定控件的标签',{name:name});
        if(ComponentMeta.components[name]) throw new Exception('已经注册了该标签的控件',{existed:ComponentMeta.components[name]})
        this.tagName = name
        ComponentMeta.components[name] = this as any;
        return this
    }
    props(names:{[n:string]:string}):ComponentMeta{
        
        if(!this.properties){
            this.properties = {}
        }
        for(const n in names) {
            const name = trim(n)
            const path = trim(names[n])
            if(name && path){
                let dpath:any = this.properties[name] = new DPath(path)
                dpath.handlername = '@' + name
            }
        }
        return this
    }
    
    static parseTemplateText : (text:string,self:any,model:any,scope:any)=>TNodeDescriptor
    static components :{[name:string]:ComponentMeta} = {}
    static modelname:string = '--model--'
}

export function component(tag?:any,fn?:any):any{
    if(tag){
        if(typeof tag==='function') {
            fn=tag;tag = undefined
        }
    }
    if(fn){
        const meta = new ComponentMeta(fn)
        if(tag) meta.tag(tag)
    }
    
    return function(target){
        const meta = new ComponentMeta(target)
        if(tag) meta.tag(tag)
    }
}

/////////////////////////////////////////////////
// runtime

export type TBindScope = {
    $superScope:TBindScope
    $fetch(name:string):TObservable
    $resolve(bindValue:any,expandOb?:boolean):any
    $createScope(name?:string,schema?:ModelSchema) 
} & TObservable
export class BindScope extends Observable{
    constructor(schema:ModelSchema,name:string,superScope:BindScope,model:TObservable){
        super({},schema,undefined,name)
        Object.defineProperty(this.$observable,'$superScope',{enumerable:false,configurable:false,writable:false,value:superScope.$observable})
        Object.defineProperty(this.$observable,ComponentMeta.modelname,{enumerable:false,configurable:false,writable:false,value:model})
        Object.defineProperty(this.$observable,'$createScope',{enumerable:false,configurable:false,writable:false,value:function(name:string){
            return new BindScope(null,name,this,this[ComponentMeta.modelname]).$observable
        }})
        Object.defineProperty(this.$observable,'$resolve',{enumerable:false,configurable:false,writable:false,value:bindScopeResolve})
    }
    //name?:string|{[name:string]:T},inital?:{[name:string]:T}
    $createScope(name?:string,schema?:any):BindScope{
        return new BindScope(schema,name,this,this[ComponentMeta.modelname]) as any
    }
    
}
function bindScopeResolve(bindValue:any,expandOb?:boolean):TObservable{
    if(expandOb===undefined){
        let scope :TBindScope = this
        while(scope){
            const ob = scope[bindValue]
            if(ob) return ob
            scope = scope.$superScope
        }
        return undefined
    }
    if(bindValue instanceof ModelSchema ){
        if(bindValue.$type===ModelSchemaTypes.constant){
            return new Observable(undefined,bindValue,undefined,'<CONSTANT>').$observable
        }else if (bindValue.$type === ModelSchemaTypes.computed) {
            return new Observable(undefined,bindValue,undefined,'<COMPUTED>').$observable
        }
        const paths = bindValue.$paths()
        const varname = paths[0]
        const observable = this.$fetch(varname)
        let result:TObservable = observable
        for(let i =1,j=paths.length;i<j;i++) result = result[paths[i]]
        bindValue = result
    }
    if(expandOb===false) {
        return bindValue && bindValue.$observable ? bindValue.$observable: new Observable(bindValue,undefined,undefined,'<constant>')
    }
    if(expandOb===true) return extractObserable(bindValue)
    return bindValue
}
function extractObserable(bindValue){
    if(!bindValue) return bindValue
    if(bindValue.$Observable) return bindValue.$Observable.get()
    if(bindValue.$observable) return bindValue.get()
    if(typeof bindValue==='object'){
        const ret = is_array(bindValue)?[]:{}
        for(const n in bindValue){
            ret[n] = extractObserable(bindValue[n])
        }
        return ret
    }
    return bindValue
}

export class ComponentRuntime{
    instance:TComponent
    elements:any[]
    model:Observable
    children:ComponentRuntime[]
    services:InjectScope
    scope:BindScope
    slots:{[name:string]:TNodeDescriptor[]}
    sid:string
    constructor(public opts:TNodeDescriptor,public meta:ComponentMeta,public parent?:ComponentRuntime){
        const tag = this.meta.tagName || (this.meta.tagName=rid('Component#'))
        this.sid = rid(`<${tag}>#`)
        if(parent){
            this.services = parent.services.createScope() as InjectScope
        }else this.services = InjectScope.global
        
        
        this.slots={}
        if(opts.children){
            for(const i in opts.children) {
                const child = opts.children[i]
                let slotname:string
                if(child.attrs){
                    slotname = child.attrs['slot']
                    if(slotname===undefined) slotname=''
                    let slotNodes = this.slots[slotname]
                    if(!slotNodes) slotNodes = this.slots[slotname] = []
                    slotNodes.push(child)
                }
            }
        }
        

        this.instance = this.meta.activator.createInstance(this.services)
    }
    initialize(bindContext:TBindContext){
        this.scope = bindContext.scope.$createScope(this.sid,this.meta.scopeSchema)
        this.model = new Observable(undefined,this.meta.modelSchema,ComponentMeta.modelname,undefined)
        this.model.value = this.model.old
        Object.defineProperty(this.scope,ComponentMeta.modelname,{enumerable:false,writable:false,configurable:false,value:this.model})
        if(typeof this.instance.created==='function') this.instance.created(this.model.value,this.services)
    }
    render(bindContext:TBindContext):any[]{
        let rs = []
        

        return rs
    }

}
export class PropertyBinding{
    observable:TObservable
    handler:Function
    constructor(bindValue){

    }
}
export type TBindContext = {
    component:ComponentRuntime
    scope:TBindScope
    options:any
}
function bindComponentAttr(component:ComponentRuntime,scope:TBindScope,bindContext:TBindContext){
    const opts = bindContext.options.$attrs || bindContext.options
    for(const bindName in opts)((bindName:string,bindValue,scope:TBindScope,component:ComponentRuntime)=>{
        const ob:TObservable = scope.$resolve(bindValue,false)
        component.instance[bindName] = ob() 
        const propInfo = component.meta.properties[bindName]
        ob((evt:TObservableEvent)=>{
            component.instance[bindName] = evt.value
            if(propInfo){
                const modelOb = propInfo.get(component.model)
                modelOb(evt.value)
            }
        },component,true)
        // <input border="1" value={state.data} />
    })(bindName,opts[bindName],bindContext.scope,bindContext.component)  
}

// class ComponentRuntimeInfo{
//     meta:TMeta
//     instance:TComponent
//     node:TNode
//     model:TObservable
//     scope: Scope
//     parent:ComponentRuntimeInfo
//     children:ComponentRuntimeInfo[]
//     mounted:boolean
//     disposed:boolean
//     constructor(meta:TMeta,opts:any,parent?:ComponentRuntimeInfo){
//         this.meta = meta
//         const component:TComponent = this.instance = activate(meta.ctor,true)
//         constant(false,component,'--',this)
        
//         if(meta.props && opts)for(let i in meta.props) {let n = meta.props[i];component[n]=opts[n];}
//         const model = this.model = new Observable(component,meta.modelSchema,undefined,'this').--facade
//         this.scope = new Scope(model,meta.tag)
//         if(typeof component.created==='function') component.created()
//         if(parent) parent.appendChild(this)
        
//     }
//     render(){
//         return render({scope:this.scope,component:this.instance,descriptor:this.meta.vnode})
//     }
//     appendChild(child:ComponentRuntimeInfo){
//         if(child.parent) throw new Exception('该component已经有父级,不可以再指定父级',child)
//         child.parent = this
//         const node = child.render()
//         platform.appendChild(this.node,node)
//         const parentRTInfo = parent['--'] as ComponentRuntimeInfo
//         const children = parentRTInfo.children || (parentRTInfo.children=[])
//         children.push(this)
//         if(this.mounted){
//             if(typeof child.instance.mounted){
//                 child.instance.mounted()
//             }
//         }
//         return this
//     }
//     mount(container:TNode):TComponent{
//         if(this.mounted) throw new Exception('不可以重复挂载',this)
//         if(this.parent) throw new Exception('不可以只能挂载根组件，该组件已经有父组件',this)
//         const node = this.render()
//         platform.mount(container,node)
//         function mount(info:ComponentRuntimeInfo){
//             info.mounted=true
//             if(typeof info.instance.mounted==='function'){
//                 info.instance.mounted()
//             }
//             if(info.children) for(let i in info.children) mount(info.children[i])
//         }
//         mount(this)
//         return this.instance
//     }
//     dispose(){
//         if(typeof this.instance.dispose==='function'){
//             try{
//                 this.instance.dispose()
//             }catch(ex){
//                 console.error("dispose错误",ex)
//             }
//         }
//         if(this.dispose)for(let i in this.children) this.children[i].dispose()
//         this.disposed=true
//     }
// }

// class Runtime{
//     roots:ComponentRuntimeInfo[]
//     timer:number
//     tick :number = 50
//     constructor(){
//         this.roots=[]
//     }
//     mount(container:TNode,renderer,opts?:any){
//         if(!renderer) return
//         let meta:TMeta = renderer['--meta']
//         if(!meta) meta = resolveMeta(renderer)
//         const rtInfo = new ComponentRuntimeInfo(meta,opts)
//         this._addRoot(rtInfo)
//         return rtInfo
//     }
//     private _addRoot(root:ComponentRuntimeInfo){
//         if(root.parent) throw new Exception('不是顶级控件，不可以挂载',root)
//         this.roots.push(root)
//         if(!this.timer){
//             this.timer = setTimeout(()=>{},this.tick)
//         }
//     }
//     private _tick(){
//         for(let i =0,j=this.roots.length;i<j;i++){
//             let rtInfo = this.roots.shift()
//             if(!rtInfo.disposed){
//                 if(!platform.alive(rtInfo.node)){
//                     rtInfo.dispose()
//                     continue
//                 }
//                 rtInfo.model(Observable).update(false,this as any);
//                 this.roots.push(rtInfo)
//             }
//         }
//         if(this.roots.length) this.timer = setTimeout(()=>this._tick(),this.tick)
//         else this.timer = 0
//     }
    
// }

// export let runtime:Runtime = new Runtime()

// export function mount(container:TNode,opts:any,extra?:any){
//     let t = typeof opts
//     if(t==='function'){
//         const meta = resolveMeta(opts)
//         const rt = new ComponentRuntimeInfo(meta,opts)
//         debugger
//         return rt.mount(container)
//     }
//     throw "not implement"
// }



// let tempCreateElementFn
// function _createElement(tag:string,attrs:{[name:string]:any}):TNodeDescriptor{
//     if(tempCreateElementFn) return tempCreateElementFn.apply(this,arguments)
//     const vnode:TNodeDescriptor = {
//         tag:tag,attrs:attrs
//     }
//     if(arguments.length>2){
//         let children = [];
//         for(let i =2,j=arguments.length;i<j;i++){
//             let child = arguments[i]
//             if(child) children.push(child)
//         }
//         if(children.length) vnode.children = children
//     }

//     return vnode;
// }

// export const createElement :(tag:string,attrs:{[index:string]:any},...args:any[])=>TNodeDescriptor = _createElement;

// //////////////////
// // render


// type TRenderContext = {
//     descriptor:TNodeDescriptor,scope:any,component:TComponent
// }

// export function render(context:TRenderContext) {
//     const descriptor = context.descriptor
//     if(descriptor.attrs) {
//         for(let n in specialAttributeRenders) {
//             let opts = descriptor.attrs[n]
//             if(opts!==undefined) return specialAttributeRenders[n](n,opts,context)
//         }
//     }
//     if(descriptor.content!==undefined){
//         return renderText(descriptor.content,context)
//     } 
//     let componentType = descriptor.component || metas[descriptor.tag]
//     if(componentType){

//     }else{
//         if(descriptor.tag) return renderNode(descriptor.tag,context)
//         return renderText(descriptor.content,context)
//     }
// }

// function renderText(content:any,context:TRenderContext):TNode{
//     const {value,observable} = resolveBindValue(content,context)
//     debugger
//     const node = platform.createText(value)
//     if(observable) observable((evt)=>{
//         node.nodeValue = evt.value
//     },context.component)
//     return node
// }

// function renderNode(tag:string,context:TRenderContext):TNode{
//     debugger
//     const {descriptor} = context
//     const node = platform.createElement(tag)
//     const attrs = descriptor.attrs
//     if(attrs) for(let attrName in attrs){
//         let {value,observable}= resolveBindValue(attrs[attrName],context)
//         let attrBinder = nodeAttributeBinders[attrName]
//         if(attrBinder){
//             attrBinder(node,attrName,value,observable,context)
//         } 
//         else {
//             platform.setAttribute(node,attrName,value);
//             if(observable)((attrName,node,platform,component)=>{
//                 observable?.subscribe((evt)=>{
//                     platform.setAttribute(node,attrName,evt.value)
//                 },component)
//             })(attrName,node,platform,context.component)
            
//         }
//     }
//     if(descriptor.children){
//         for(let i = 0,j=descriptor.children.length;i<j;i++){
//             let childNode = render({scope:context.scope,component:context.component,descriptor:descriptor.children[i]})
//             if(childNode===undefined) debugger
//             platform.appendChild(node, childNode)
//         }
//     }
//     return node
// }


// const nodeAttributeBinders :{[attrname:string]:(node:TNode,attrName:string,attrValue:any,attrObservable:TObservable,context:TRenderContext)=>void} = {}

// function nodeEventBinder(node:TNode,attrName:string,attrValue:any,attrObservable:TObservable,context:TRenderContext){
//     let evtName = attrName.substr(2)
//     let component = context.component
//     platform.attach(node,evtName,getListener(attrValue,component))
//     if(attrObservable)attrObservable((evt)=>{
//         if (evt.old) {
//             let listener = evt.old['--listener'] || evt.old
//             platform.detech(node,evtName,listener)
//         } 
//         platform.attach(node,evtName,getListener(evt.value,component))
        
//     },context.component)
// }
// constant(false,nodeEventBinder,'--event-binder',true)
// const evtnames = ['onclick','ondblclick','onsubmit','onfocus','onblur','onmouseenter','onmouseout','onmouseover','onmousemove','onmousedown','onmouseup','onkeypress','onkeydown','onkeyup','onchange','onload','onresize']
// for(let i in evtnames)nodeAttributeBinders[evtnames[i]] =  nodeEventBinder

// function getListener(fn:Function,component:TComponent){
//     let listener = fn['--listener']
//     if(listener) return listener
//     if(!component) return fn
//     listener = function(evt){return fn.call(component,evt,component)}
//     constant(false,fn ,'--listener',listener)
//     return listener
// }

// const specialAttributeRenders:{[attrname:string]:(attrName:string,attrValue:any,context:TRenderContext)=>TNode}={}


// specialAttributeRenders['y-for'] =(attrName:string,attrValue:any,context:TRenderContext):TNode =>{
//     const asSchema = attrValue.as
//     let {value,observable} = resolveBindValue.call(attrValue.each,context.scope,context);
//     let exists = []
//     makeFor(attrName,asSchema,value,observable,exists,context)
//     constant(false,observable,'--each-elements',exists)
//     if(observable)observable.subscribe((evt)=>{
//         makeFor(attrName,asSchema,evt.value,evt.sender,exists,context)
//         evt.cancel=true
//     },context.component)
// }

// function makeFor(attrName:string,asSchema:ModelSchema,eachValue:any,eachObservable:Observable,exists:TNode[],context:TRenderContext){
//     const {descriptor,scope} = context
//     let tmp = descriptor.attrs['y-for']
//     descriptor.attrs[attrName] = null
//     for(let i=0,j=eachValue.length;i<j;i++) {
//         let existed = exists.shift()
//         if(existed){
//             existed['--loop-variable'].setValue(eachValue[i])
//             exists.push(existed)
//         }else {
//             let loopScope = scope.$createScope(i.toString())
//             let loopVariable = loopScope.$observable(eachValue[i],asSchema,false);
//             let node = render({
//                 descriptor,scope:loopScope,component:context.component
//             })
//             constant(false,node,'--loop-variable',loopVariable)
//             exists.push(node)
//         }
//     }
//     for(let i = eachValue.length,j=exists.length;i<j;i++){
//         let removed = exists.shift()
//         drop(removed)
//     }
//     exists.length = eachValue.length
//     descriptor.attrs[attrName]=tmp
// }


// export function resolveBindValue(bindValue:any,context:TRenderContext,bind?:(value:any,observable:TObservable)=>any):{value:any,observable:TObservable}{
//     let observable:TObservable
//     let value = bindValue
//     if(value){
//         if(value instanceof ModelSchema){
//             const ob:TObservable = context.scope.$observable((value as any).$schema||value)
//             value = ob()
//         }else if(value instanceof Observable){
//             observable = value.--facade
//             value = observable.getValue()
//         }else if(value.$Observable){
//             observable = value
//             value = observable()
//         }else if(value.$Observable && value.apply && value.call){
//             observable = value.$Observable
//             value = observable.getValue()
//         }
//     }
//     if(bind)bind(value,observable)
//     return {observable,value}

// }





function drop(node:TNode,remove?:boolean){
    if(!node) return;
    if(remove!==false)platform.remove(node)
    let component = node['--component']
    if(component && component.dispose) component.dispose()
    else{
        platform.eachChildren(node,(child,i)=>{
            drop(child,false)
        })
    }
}


export class Component{

}


export type TNode = any;



export const platform = {
    createElement(tag:string):TNode{
        return document.createElement(tag)
    },
    createText(txt:string):TNode{
        return document.createTextNode(txt)
    },
    
    createComment(comment):TNode{
        return document.createComment(comment)
    },
    attach(node:TNode,evtName:string,handler:Function){
        node.addEventListener(evtName,handler,false)
    },
    detech(node:TNode,evtName:string,handler:Function){
        node.removeEventListener(evtName,handler,false)
    },
    mount(container:TNode,node:TNode){
        container.innerHTML = ""
        container.appendChild(node)
    },
    alive(node:TNode,value?:boolean):boolean{
        if(value===undefined){
            if(node['--alive']) return true
            while(node){
                if(node===document.body)return true
                node = node.parentNode
            }
            return false
        }
        Object.defineProperty(node,'--alive',{enumerable:false,configurable:true,writable:false,value:value})
        
    },
    appendChild(parent:TNode,child:TNode){
        parent.appendChild(child)
    },
    insertBefore(inserted:TNode,relative:TNode){
        relative.parentNode.insertBefore(inserted,relative)
    },
    remove(node:TNode):boolean{
        if(node.parentNode) {node.parentNode.removeChild(node);return true }
        return false
    },
    clear(node:TNode){
        node.innerHTML = ""
    },
    eachChildren(node:TNode,callback:(child:TNode,i:number)=>any){
        if(node.hasChildren){
            for(let i = 0,j=node.childNodes.length;i<j;i++) callback(node.childNodes[i],i)
        }
    },
    setText(node:TNode,txt:string){
        if(node.innerText!==undefined) node.innerText = txt
        else node.nodeValue = txt
    },
    setAttribute(node:TNode,name:string,value:any){
        node.setAttribute(name,value)
    }
}


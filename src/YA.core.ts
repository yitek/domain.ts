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



export function deepClone(obj:any,_clones?:any[]){
    const t = typeof obj;
    if(t==='object'){
        if(!_clones) _clones=[];
        else for(const cloneInfo of _clones){
            if(cloneInfo.origin===obj) return cloneInfo.cloned;
        }
        let clone = is_array(obj)?[]:{};
        _clones.push({origin:obj,cloned:clone});
        for(let n in obj) {
            clone[n] = deepClone(obj[n],_clones);
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

export let inherit = (function () {
    
    return function (ctor, base) {
        //extendStatics(ctor, base);
        function __() {Object.defineProperty(this,'constructor' ,{value:ctor,enumerable:false,configurable:true,writable:true}); }
        ctor.prototype = base === null ? Object.create(base) : (__.prototype = base.prototype, new __());
        return ctor
    };
})();


//////////////////////////////////////////////////////////
// 类/对象标注

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
    $dispose(callback?){
        throw 'abstract method'
    }
}
disposable(Disposiable.prototype)
//////////////////////////////////////////////////////////////////
// 对象创建与注入
//
@constant(false)
export class Scope<T> extends Disposiable{
    '$super'?:Scope<T>;
    '$name'?:string;
    
    constructor(inital:{[name:string]:T},name?:string,superScope?:Scope<T>){
        super()
        if(inital) for(const n in inital) this[n] = inital[n]
        constant(false,this,'$name',name)
        constant(false,this,'$supper',superScope)
    }
    $fetch(key:string,factory?:(key:string)=>T):T{
        let item = this[key]
        if(item===undefined && this['$super']) item = this.$super.$fetch(key)
        if(item===undefined && factory) {
            this[key]= item = factory(key)
        }
        return item
    }
    $get(key:string ,factory?:(key:string)=>T){
        let item = this[key]
        if(item===undefined && factory) {
            this[key]= item = factory(key)
        }
        return item
    }
    $set(key:string, item:T):Scope<T>{
        if(key[0]==='$') throw new Exception('$开头的作为保留属性，不可以使用')
        this[key] = item
        return this
    }
    $createScope(name?:string|{[name:string]:T},inital?:{[name:string]:T}):Scope<T>{
        if(inital) return new Scope<T>(inital,name as string,this)
        if(typeof name==='object') return new Scope<T>(name,undefined,this)
        return new Scope<T>(undefined,undefined,this)
    }
    
    static createRoot<T>(name?:string|{[name:string]:T},inital?:{[name:string]:T}){
        if(inital) return new Scope<T>(inital,name as string)
        if(typeof name==='object') return new Scope<T>(name,'<ROOT-SCOPE>')
        return new Scope<T>(undefined,'<ROOT-SCOPE>')
    }
}
export type TInjectFactory = (name:string,scope:InjectScope,target?:any)=>any
@constant(false)
export class InjectScope extends Scope<TInjectFactory>{
    constructor(inital:{[name:string]:TInjectFactory},name?:string,superScope?:InjectScope){
        super(inital,name, superScope)
    }
    $resolve(name:string,context?:any):any{
        const factory :TInjectFactory = this.$fetch(name)
        if(factory) return factory(name,this,context)
    }
    $register(name:string, ctor:{new(...args):any},singleon?:boolean):Activator{
        if(this[name]) throw new Exception('已经注册过该依赖项:' + name)
        const activator = Activator.fetch(ctor)
        let instance 
        const factory = (name,scope,context)=>{
            if(singleon && instance!==undefined) return instance
            let inst = activator.createInstance(scope)
            if(inst && typeof inst.$dispose==='function') this.$dispose(()=>inst.$dispose())
            if(singleon) instance = inst
            return inst
        }
        this.$set(name, factory)
        return activator
    }
    $const(name:string, value:any):InjectScope{
        if(this[name]) throw new Exception('已经注册过该依赖项:' + name)
        this.$set(name,(name,scope,context)=>value)
        return this
    }
    $factory(name:string, factory : any):InjectScope{
        if(this[name]) throw new Exception('已经注册过该依赖项:' + name)
        if(typeof factory !=='function'){
            this[name] = (name,scope,target)=>factory
        }else this[name] = factory
        return this
    }
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
            const propValue = scope.$resolve(depname)
            selfInstance[propname] = propValue
        }
    }
    if(this.args && this.args.length){
        const args = []
        for(const i in this.args){
            const name = this.args[i]
            const argValue = scope.$resolve(name)
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



enum ObservableTypes{
    value,
    object,
    array
}

@implicit()
export class Schema {
    $type: ObservableTypes;
    $owner?: Schema;
    $name?: string;
    $defaultValue?: any;
    $item?: Schema;
    private '--root'?:Schema;
    private '--paths'?:string[];
    constructor(defaultValue?:any,name?: string,owner?: Schema){
        implicit(this,{
            '$defaultValue':defaultValue,
            '$owner': owner,
            '$name': name,
            '$type': ObservableTypes.value,
            '$itemSchema':undefined
        });
        if(!defaultValue || typeof defaultValue!=='object') return
        
        if(defaultValue.length!==undefined && defaultValue.push && defaultValue.pop){
            this.$asArray(deepClone(defaultValue[0]))
        } else {
            for(let n in defaultValue) this.$prop(n,deepClone(defaultValue[n]))
        }
    }
    length?: Schema;
    $prop(name:string, defaultValue?:any): Schema{
        if(this.$type === ObservableTypes.array) throw new Exception('已经定义为array了',{'schema':this});
        this.$type = ObservableTypes.object;
        return this[name] || (this[name] = new Schema(defaultValue,name,this));
    }
    $asArray(defaultItemValue?: any):Schema{
        if(this.$type !== ObservableTypes.value) throw new Exception('已经定义为array/object了',{'schema':this});
        this.$type = ObservableTypes.array;
        let lengthSchema = new Schema(0,'length',this);
        Object.defineProperty(this,'length',{enumerable:false,configurable:false,writable:false,value:lengthSchema});
        let itemSchema = new Schema(defaultItemValue,null,this);
        return this.$item = itemSchema;
    }
    $paths(){
        let paths:string[] = this['--paths']
        if(!paths) paths = buildSchemaInfo.call(this).paths
        return paths
    }
    $root(){
        let root:Schema = this['--root']
        if(!root) root = buildSchemaInfo.call(this).root
        return root
    }

}
function buildSchemaInfo(){
    let schema:Schema = this
    let paths:string[] =[]
    let root :Schema
    while(schema){
        root = schema
        paths.unshift(schema.$name)
        schema = schema.$owner
    }
    constant(false, this,'--paths',paths)
    constant(false, this, '--root',root)
    return {paths,root}
}

const rootStatesTraps = {
    get(target: {inst:any,schema:Schema},propname:string){
        if(!target.inst) return target.inst[propname]
        if(propname[0]==='$') {
            if(propname==='$schema') return target.schema;
            return target[propname];
        }
        return new Proxy(target.schema.$prop(propname),memberStatesTraps);
    },
    set(target:{inst:any,schema:Schema},propname:string,value:any){
        if(!target.inst) {
            target.inst[propname] = value
            return
        } 
        throw new Exception('schemaBuilder不可以在schemaBuilder上做赋值操作');
    }
};
const memberStatesTraps = {
    get(schema: Schema,propname:string){
        if(propname[0]==='$') {
            if(propname==='$schema') return schema;
            return schema[propname];
        }
        return new Proxy(schema.$prop(propname),memberStatesTraps);
    },
    set(target:Schema,propname:string,value:any){
        throw new Exception('schemaBuilder不可以在schemaBuilder上做赋值操作');
    }
};
declare let Proxy;
export function schemaProxy(target:{inst:any,schema:Schema}|Schema){
    if(!target || target instanceof Schema) return new Proxy(new Schema(),memberStatesTraps)
    return new Proxy(target,rootStatesTraps);
}


////////////////////////////////////
// createElement

export type TNodeDescriptor = {
    tag?: string;
    content?: string| Schema | TObservable;
    component?: any;
    attrs?: {[name:string]:any};
    children?: TNodeDescriptor[];
}

let tempCreateElementFn
function _createElement(tag:string,attrs:{[name:string]:any}):TNodeDescriptor{
    if(tempCreateElementFn) return tempCreateElementFn.apply(this,arguments)
    const vnode:TNodeDescriptor = {
        tag:tag,attrs:attrs
    }
    if(arguments.length>2){
        let children = [];
        for(let i =2,j=arguments.length;i<j;i++){
            let child = arguments[i]
            if(child) children.push(child)
        }
        if(children.length) vnode.children = children
    }

    return vnode;
}

export const createElement :(tag:string,attrs:{[index:string]:any},...args:any[])=>TNodeDescriptor = _createElement;


let currentContext;
export function vars(count?:number|{[index:string]:any}):any{
    let result;
    let prefix = '--local-'
    let tmpNameIndex= '--'
    let context = currentContext || {}
    let varnum = context[tmpNameIndex] || (context[tmpNameIndex]=0)
    let t = typeof count;
    if(t==='number'){
        result = [];
        for(let i =0,j=count;i<j;i++){
            let schema = new Schema(undefined,prefix +(++varnum))
            context[schema.$name] = schema
            let proxy = schemaProxy(schema)
            result.push(proxy);
        }
    }else if(t==='object'){
        result = {};
        for(let n in count as any){
            let schema = new Schema(count[n],prefix + n)
            context[schema.$name] = schema
            let proxy = schemaProxy(schema)
            result[n] = proxy;
        }
    }else if(arguments.length===0){
        let schema = new Schema(undefined,prefix +(++varnum))
        context[schema.$name] = schema
        result = schemaProxy(schema)
    }else{
        result={};
        for(let i =0,j=arguments.length;i<j;i++){
            let name = prefix + arguments[i];
            let schema = new Schema(undefined,name);
            context[schema.$name] = schema
            let proxy = schemaProxy(schema);
            result[name]=proxy;
        }
    }
    context[tmpNameIndex] = varnum
    return result;
}

///////////////////////////////////////
// observable


export type TObservableEvent = {
    value:any
    old:any
    src?:any
    sender?:Observable
    removed?:boolean
    cancel?:boolean
    bubble?:boolean
}

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
}

export type TObservable = {
    [index in number | string]: TObservable;
} & {
    (value?: any,disposor?:any): any;
    $Observable:Observable;
};
@implicit()
export class Observable{
    type:ObservableTypes;
    name:string;
    old:any;
    value:any;
    schema: Schema;
    owner?:Observable;
    $observable:TObservable;
    listeners?:{(evt:TObservableEvent):any}[];
    captures?:{(evt:TObservableEvent):any}[];
    length?:Observable;
    constructor(inital:any,schema?:Schema,owner?:Observable,name?:string){
        let facade;
        facade = (value?:any,isSubscriber?:boolean):any=>{
            if(value===undefined) {
                return this.value===Observable?this.old:this.value
            }else if(value===Observable) return this
            else if(value===Schema) return this.schema
            if(isSubscriber!==undefined){
                if(isSubscriber) this.subscribe(value,isSubscriber)
                if(isSubscriber===false) this.unsubscribe(value)
                return facade
            }
            if(value){
                if(value instanceof Schema) throw new Exception('不能够将Schema赋值给observable')
                if(value.$Observable) value = value()
                else if(value.$observable) value = value.value
            }
            this.setValue(value)
            return this.$observable
        }
        this.$observable = facade as any
        Object.defineProperty(facade,'$Observable',{enumerable:false,configurable:false,writable:false,value:this})
        
        this.value = Observable
        schema = this.schema = schema || new Schema(inital,name,owner?.schema)
        this.name = name || schema.$name
        this.type = schema.$type
        if(this.type===ObservableTypes.object){
            this.setValue = objectSet
            this.update = objectUpdate
            this.old = inital || {}
            for(let name in schema) {
                
                let member = new Observable(this.old[name],schema[name],this,name)
                Object.defineProperty(facade,name, {enumerable:true,configurable:false,writable:false,value:member.$observable})
            }
        }else if(this.type === ObservableTypes.array){
            this.setValue = arraySet
            this.update = arrayUpdate
            let lengthSchema = schema.length
            let lengthObservable = new Observable(this.old.length,lengthSchema,this,'length')
            Object.defineProperty(facade,'length', {enumerable:false,configurable:false,writable:false,value:lengthObservable.$observable})

            this.old = inital = inital || []
            
            if(inital)for(let i = 0,j=inital.length;i<j;i++){
                let name = i.toString()
                let itemObservable = new Observable(inital[i],this.schema.$item,this,name)
                Object.defineProperty(facade,name, {enumerable:false,configurable:true,writable:false,value:itemObservable.$observable})
            }
        }else{
            this.old = inital || schema.$defaultValue
        }
    }

    getValue(){
        return this.value===Observable?this.old:this.value
    }
    setValue(value:any):Observable{
        this.value = value
        return this
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

    update(bubble?:boolean,src?:TObservableEvent):Observable{
        let evt:TObservableEvent = update.call(this, src, arguments[2])
        if(bubble && evt && evt.bubble!==false) dispachBubble.call(this,evt)
        return this
    }
}

function objectSet(value:any): Observable{
    if(!value) value={}
    let facade = this.facade;
    for(let name in facade){
        let prop:TObservable = facade[name]
        prop(value[name]);
    }
    this.value = value
    return this
}
function arraySet(value):Observable{
    if(!value) value=[]
    let facade = this.$observable
    for(let i =0,j=value.length;i<j;i++){
        let name = i.toString()
        let item = facade[name]
        if(item) {item(value[i]);continue;}
        item = new Observable(value[i],this.$schema.$item,this,name)
        Object.defineProperty(facade,name,{configurable:true,writable:false,enumerable:true,value:item.$observable })
    }
    this.value = value
    this.length.setValue(value.length)
    return this
}
function update(src?:TObservableEvent,isRemoved?:boolean):TObservableEvent{
    let value = this.value === Observable? this.old: this.value    
    if(this.value===Observable || this.value===this.old) return undefined;
    const evt:TObservableEvent = {
        value : value,
        old: this.old,
        src: src,
        sender: this,
        removed: isRemoved===true
    }
    this.old = value
    this.value = Observable
    let handlers = this.listeners
    if(handlers)for(let i = 0,j=handlers.length;i<j;i++){
        handlers[i].call(this,evt)
    }
    return evt
}
function dispachBubble(evt:TObservableEvent){
    let owner = this.owner
    while(owner && (evt as any).bubble===false){
        let handlers = owner.captures;
        if(handlers){
            for(let i = 0,j=handlers.length;i<j;i++){
                handlers[i].call(this,evt)
            }
        }
        owner = owner.owner
    }
}


function objectUpdate(bubble?:boolean,src?:TObservableEvent,isRemoved?:boolean):Observable{
    let evt:TObservableEvent = update.call(this,src,isRemoved)
    if(bubble!==false && evt){
        dispachBubble.call(this,evt)
    }
    if(evt.cancel) return this
    let facade = this.$observable
    for(let n in this){ 
        let prop = facade[n](Observable)
        prop.update(bubble,evt)
        
    }
    return this
}
function arrayUpdate(bubble?:boolean,src?:TObservableEvent,isRemoved?:boolean):Observable{
    const evt = update.call(this,src,isRemoved)
    const lengthEvt = update.call(this.length,src)
    if(bubble!==false && evt){
        dispachBubble.call(this,evt)
    }
    if(bubble!==false && lengthEvt){
        dispachBubble.call(this.length,lengthEvt)
    }
    
    if(evt?.cancel || lengthEvt?.cancel) return this;

    let facade = this.$observable
    if(evt.old.length > evt.value.length){
        for (let i= 0, j= evt.value.length; i<j; i++){
            let item = facade[i](Observable)
            item.update(bubble,evt)
        }
        for(let i = evt.value.length,j=evt.old.length;i<j;i++){
            let item:Observable = facade[i](Observable)
            item.update.call(item,false,evt,true)
            delete facade[i]
        }
    }
    return this
}


//////////////////////////////
// meta
// 控件元数据
// 所有控件都有
export type TComponent = any

export type TMeta = {
    resolved?:boolean
    tag?:string
    ctor?:{new(...args):TComponent}
    scopeSchema?:Schema,
    modelSchema?:Schema,
    vnode?:TNodeDescriptor
    props?:{[name:string]:Schema}
}
const metas:{[tag:string]:TMeta} = {}
const componentRTToken = '--'

function resolveMeta(template:Function,meta?:TMeta):TMeta{
    const fn = template
    meta ||(meta={})
    return meta
}
export type TCreationContext = {

}
export class Meta{
    tagName?:string
    ctor:{new(...args):TComponent}
    scopeSchema?:Schema
    modelSchema?:Schema
    propnames?:string[]
    vnode?:TNodeDescriptor
    
    constructor(fn:Function,propnames:string[],tag?:string){
        this.propnames = propnames
        this.tagName = tag
        const scopeSchema = this.scopeSchema = new Schema()
        const modelSchema = this.modelSchema = scopeSchema.$prop('--model')
        
        const modelSchemaProxy = schemaProxy(modelSchema)
        let descriptor:TNodeDescriptor
        let ctor:any,inst:any
        activate(fn,[modelSchemaProxy],{
            afterConstruct:(ret,inst,fn)=>{
                // 返回的是vnode,说明是个函数
                if(ret!==undefined && !(ret instanceof fn)){
                    descriptor = ret
                    ctor = ((ctor,nop)=>function(model){
                        tempCreateElementFn = nop
                        ctor.call(model,this)
                        tempCreateElementFn = undefined
                    })(fn,nop)
                }
            }
        })
        if(!descriptor && typeof inst.template==='function'){
            descriptor = inst.template(modelSchemaProxy,inst)
            ctor = fn
        }
        this.vnode = descriptor
        this.ctor = ctor
        //this['--meta'] = meta
        return this
    }
    tag(name:string):Meta{
        if(this.tagName) throw new Exception('重复指定控件的标签',{name:name});
        if(metas[name]) throw new Exception('已经注册了该标签的控件',{existed:metas[name]})
        this.tagName = name
        metas[name] = this as any;
        return this
    }
    props(names:string[]):Meta{
        if(!this.propnames){
            this.propnames = []
            for(const n in names) {
                const name = trim(names[n])
                if(name)this.propnames.push(names[n])
            }
        } else {
            console.warn('已经指定过props，会合并名称',this.propnames,names)
            for(const n in names) {
                const name = trim(names[n])
                if(!array_contains(this.propnames,name))this.propnames.push(names[n])
            }
        }
        return this
    }
    createComponent(){

    }
    
}

/////////////////////////////////////////////////
// runtime

class ComponentRuntimeInfo{
    meta:TMeta
    instance:TComponent
    node:TNode
    model:TObservable
    scope: Scope
    parent:ComponentRuntimeInfo
    children:ComponentRuntimeInfo[]
    mounted:boolean
    disposed:boolean
    constructor(meta:TMeta,opts:any,parent?:ComponentRuntimeInfo){
        this.meta = meta
        const component:TComponent = this.instance = activate(meta.ctor,true)
        constant(false,component,'--',this)
        
        if(meta.props && opts)for(let i in meta.props) {let n = meta.props[i];component[n]=opts[n];}
        const model = this.model = new Observable(component,meta.modelSchema,undefined,'this').$observable
        this.scope = new Scope(model,meta.tag)
        if(typeof component.created==='function') component.created()
        if(parent) parent.appendChild(this)
        
    }
    render(){
        return render({scope:this.scope,component:this.instance,descriptor:this.meta.vnode})
    }
    appendChild(child:ComponentRuntimeInfo){
        if(child.parent) throw new Exception('该component已经有父级,不可以再指定父级',child)
        child.parent = this
        const node = child.render()
        platform.appendChild(this.node,node)
        const parentRTInfo = parent['--'] as ComponentRuntimeInfo
        const children = parentRTInfo.children || (parentRTInfo.children=[])
        children.push(this)
        if(this.mounted){
            if(typeof child.instance.mounted){
                child.instance.mounted()
            }
        }
        return this
    }
    mount(container:TNode):TComponent{
        if(this.mounted) throw new Exception('不可以重复挂载',this)
        if(this.parent) throw new Exception('不可以只能挂载根组件，该组件已经有父组件',this)
        const node = this.render()
        platform.mount(container,node)
        function mount(info:ComponentRuntimeInfo){
            info.mounted=true
            if(typeof info.instance.mounted==='function'){
                info.instance.mounted()
            }
            if(info.children) for(let i in info.children) mount(info.children[i])
        }
        mount(this)
        return this.instance
    }
    dispose(){
        if(typeof this.instance.dispose==='function'){
            try{
                this.instance.dispose()
            }catch(ex){
                console.error("dispose错误",ex)
            }
        }
        if(this.dispose)for(let i in this.children) this.children[i].dispose()
        this.disposed=true
    }
}

class Runtime{
    roots:ComponentRuntimeInfo[]
    timer:number
    tick :number = 50
    constructor(){
        this.roots=[]
    }
    mount(container:TNode,renderer,opts?:any){
        if(!renderer) return
        let meta:TMeta = renderer['--meta']
        if(!meta) meta = resolveMeta(renderer)
        const rtInfo = new ComponentRuntimeInfo(meta,opts)
        this._addRoot(rtInfo)
        return rtInfo
    }
    private _addRoot(root:ComponentRuntimeInfo){
        if(root.parent) throw new Exception('不是顶级控件，不可以挂载',root)
        this.roots.push(root)
        if(!this.timer){
            this.timer = setTimeout(()=>{},this.tick)
        }
    }
    private _tick(){
        for(let i =0,j=this.roots.length;i<j;i++){
            let rtInfo = this.roots.shift()
            if(!rtInfo.disposed){
                if(!platform.alive(rtInfo.node)){
                    rtInfo.dispose()
                    continue
                }
                rtInfo.model(Observable).update(false,this as any);
                this.roots.push(rtInfo)
            }
        }
        if(this.roots.length) this.timer = setTimeout(()=>this._tick(),this.tick)
        else this.timer = 0
    }
    
}

export let runtime:Runtime = new Runtime()

export function mount(container:TNode,opts:any,extra?:any){
    let t = typeof opts
    if(t==='function'){
        const meta = resolveMeta(opts)
        const rt = new ComponentRuntimeInfo(meta,opts)
        debugger
        return rt.mount(container)
    }
    throw "not implement"
}

//////////////////
// render


type TRenderContext = {
    descriptor:TNodeDescriptor,scope:any,component:TComponent
}

export function render(context:TRenderContext) {
    const descriptor = context.descriptor
    if(descriptor.attrs) {
        for(let n in specialAttributeRenders) {
            let opts = descriptor.attrs[n]
            if(opts!==undefined) return specialAttributeRenders[n](n,opts,context)
        }
    }
    if(descriptor.content!==undefined){
        return renderText(descriptor.content,context)
    } 
    let componentType = descriptor.component || metas[descriptor.tag]
    if(componentType){

    }else{
        if(descriptor.tag) return renderNode(descriptor.tag,context)
        return renderText(descriptor.content,context)
    }
}

function renderText(content:any,context:TRenderContext):TNode{
    const {value,observable} = resolveBindValue(content,context)
    debugger
    const node = platform.createText(value)
    if(observable) observable((evt)=>{
        node.nodeValue = evt.value
    },context.component)
    return node
}

function renderNode(tag:string,context:TRenderContext):TNode{
    debugger
    const {descriptor} = context
    const node = platform.createElement(tag)
    const attrs = descriptor.attrs
    if(attrs) for(let attrName in attrs){
        let {value,observable}= resolveBindValue(attrs[attrName],context)
        let attrBinder = nodeAttributeBinders[attrName]
        if(attrBinder){
            attrBinder(node,attrName,value,observable,context)
        } 
        else {
            platform.setAttribute(node,attrName,value);
            if(observable)((attrName,node,platform,component)=>{
                observable?.subscribe((evt)=>{
                    platform.setAttribute(node,attrName,evt.value)
                },component)
            })(attrName,node,platform,context.component)
            
        }
    }
    if(descriptor.children){
        for(let i = 0,j=descriptor.children.length;i<j;i++){
            let childNode = render({scope:context.scope,component:context.component,descriptor:descriptor.children[i]})
            if(childNode===undefined) debugger
            platform.appendChild(node, childNode)
        }
    }
    return node
}


const nodeAttributeBinders :{[attrname:string]:(node:TNode,attrName:string,attrValue:any,attrObservable:TObservable,context:TRenderContext)=>void} = {}

function nodeEventBinder(node:TNode,attrName:string,attrValue:any,attrObservable:TObservable,context:TRenderContext){
    let evtName = attrName.substr(2)
    let component = context.component
    platform.attach(node,evtName,getListener(attrValue,component))
    if(attrObservable)attrObservable((evt)=>{
        if (evt.old) {
            let listener = evt.old['--listener'] || evt.old
            platform.detech(node,evtName,listener)
        } 
        platform.attach(node,evtName,getListener(evt.value,component))
        
    },context.component)
}
constant(false,nodeEventBinder,'--event-binder',true)
const evtnames = ['onclick','ondblclick','onsubmit','onfocus','onblur','onmouseenter','onmouseout','onmouseover','onmousemove','onmousedown','onmouseup','onkeypress','onkeydown','onkeyup','onchange','onload','onresize']
for(let i in evtnames)nodeAttributeBinders[evtnames[i]] =  nodeEventBinder

function getListener(fn:Function,component:TComponent){
    let listener = fn['--listener']
    if(listener) return listener
    if(!component) return fn
    listener = function(evt){return fn.call(component,evt,component)}
    constant(false,fn ,'--listener',listener)
    return listener
}

const specialAttributeRenders:{[attrname:string]:(attrName:string,attrValue:any,context:TRenderContext)=>TNode}={}


specialAttributeRenders['y-for'] =(attrName:string,attrValue:any,context:TRenderContext):TNode =>{
    const asSchema = attrValue.as
    let {value,observable} = resolveBindValue.call(attrValue.each,context.scope,context);
    let exists = []
    makeFor(attrName,asSchema,value,observable,exists,context)
    constant(false,observable,'--each-elements',exists)
    if(observable)observable.subscribe((evt)=>{
        makeFor(attrName,asSchema,evt.value,evt.sender,exists,context)
        evt.cancel=true
    },context.component)
}

function makeFor(attrName:string,asSchema:Schema,eachValue:any,eachObservable:Observable,exists:TNode[],context:TRenderContext){
    const {descriptor,scope} = context
    let tmp = descriptor.attrs['y-for']
    descriptor.attrs[attrName] = null
    for(let i=0,j=eachValue.length;i<j;i++) {
        let existed = exists.shift()
        if(existed){
            existed['--loop-variable'].setValue(eachValue[i])
            exists.push(existed)
        }else {
            let loopScope = scope.$createScope(i.toString())
            let loopVariable = loopScope.$observable(eachValue[i],asSchema,false);
            let node = render({
                descriptor,scope:loopScope,component:context.component
            })
            constant(false,node,'--loop-variable',loopVariable)
            exists.push(node)
        }
    }
    for(let i = eachValue.length,j=exists.length;i<j;i++){
        let removed = exists.shift()
        drop(removed)
    }
    exists.length = eachValue.length
    descriptor.attrs[attrName]=tmp
}


export function resolveBindValue(bindValue:any,context:TRenderContext,bind?:(value:any,observable:TObservable)=>any):{value:any,observable:TObservable}{
    let observable:TObservable
    let value = bindValue
    if(value){
        if(value instanceof Schema){
            const ob:TObservable = context.scope.$observable((value as any).$schema||value)
            value = ob()
        }else if(value instanceof Observable){
            observable = value.$observable
            value = observable.getValue()
        }else if(value.$Observable){
            observable = value
            value = observable()
        }else if(value.$Observable && value.apply && value.call){
            observable = value.$Observable
            value = observable.getValue()
        }
    }
    if(bind)bind(value,observable)
    return {observable,value}

}





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

export function component(tag:string|Function,ctor?:Function){
    const decorator = (target)=>{
        const meta = resolveMeta(ctor)
        if(tag){
            meta.tag = tag as string;metas[tag as string] = meta
        }
        return target
    }  
    if(ctor)  decorator(ctor)
    if(tag===undefined) return decorator
    if(typeof tag==='function'){
        tag = undefined;ctor =tag as Function
        return decorator(ctor)
    }
    return decorator
}

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


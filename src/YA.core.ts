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
        let result = is_array(obj)?[]:{};
        _clones.push({origin:obj,cloned:result});
        for(let n in obj) {
            result[n] = clone(obj[n],_clones);
        }
        return result
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

const dpathTrimRegx =/(^[ .\/]+)|(\s+$)/g
const uintRegx =/^\s*d+\s*$/g;
type TDPathItem = {name:string,index:number,prev?:TDPathItem,next?:TDPathItem}
export class DPath{
    public raw:string
    public dotpath:string
    public slashpath:string
    public first:TDPathItem
    public last:TDPathItem
    public deep:number;
    constructor(dpath:string){
        this.raw = dpath
        dpath = dpath.replace(dpathTrimRegx,'')
        if(!this.raw) throw new Exception('不正确的dpath表达式:' + dpath)
        let pathnames:string[]
        if(dpath.indexOf('/')>=0) pathnames = dpath.split('/')
        else pathnames = dpath.split('.')
        this.deep = pathnames.length
        this.dotpath = pathnames.join('.')
        this.slashpath = pathnames.join('/')
        let isProp = !uintRegx.test(pathnames[0])
        let curr:TDPathItem = this.first = {name:isProp?pathnames[0]:undefined,index:isProp?undefined:parseInt(pathnames[0])}
        for(let i =1,j=pathnames.length;i<j;i++) {
            let name = pathnames[i]
            const isProp = !uintRegx.test(name)
            let index:number = undefined
            if(!isProp) {index = parseInt(name);name= undefined}

            const item = {name:name,index:index,prev:curr}
            curr.next= item
            curr = item
        }
        this.last = curr
        

    }
    get(target,context?){
        let data :any
        const firstName = this.first.name
        if(context){
            if(context.call && context.apply) data = context(firstName,target)
            else{
                data = context[firstName]
                if (data===undefined && target) data = target[firstName]
            } 
        }else if(target) data = target[firstName]
        if(!data) return data
        let curr = this.first.next
        while(curr) {
            data = data[curr.name]
            if(!data) return data
            curr = curr.next
        }
        return data
    }
    set(target:any,value:any,context?):DPath{
        if(!target) return this
        if(this.deep===1) {
            if(context) {
                if(context.call && context.apply) context(this.first,target,true,value)
                else target[this.first.name] = value
            } else target[this.first.name]=value
        }
        let data :any
        if(context){
            if(context.call && context.apply) data = context(this.first,target)
            else data = target[this.first.name]
        }else data = target[this.first.name]
        let prevobj = target
        let curr = this.first.next
        while(curr!==this.last){
            if(!data) {
                const prev = curr.prev
                if(curr.index!==undefined){
                    data = prevobj[prev.name||prev.index] = [] 
                }else data = prevobj[prev.name||prev.index] = {}
                curr = curr.next
            }
            prevobj = data;data=data[curr.name||curr.index];curr = curr.next
        }
        if(!data) {
            const prev = curr.prev
            if(curr.index!==undefined){
                data = prevobj[prev.name||prev.index] = [] 
            }else data = prevobj[prev.name||prev.index] = {}
        } 
        data[curr.name||curr.index] = value
        return this
    }
    toString(){ return this.slashpath }
    static fetch(path:string){
        let accessor = DPath.accessors[path]
        if(!accessor){
            accessor = DPath.accessors[path] = new DPath(path)
            DPath.accessors[accessor.dotpath] = accessor
        }
        return accessor
    }
    static getValue(target:any,dpath:string,context?){
        return DPath.fetch(dpath).get(target, context)
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
export function constant(enumerable?:boolean,target?,name?,value?,week?:boolean){
    return accessable({enumerable:enumerable!==false,writable:false,configurable:week?true:false},target,name,value)
}


export function nop(){}



export class Exception extends Error{
    constructor(msg,detail?:any,silence?){
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
        const disposeHandlers = this['--disposes--']
        if(disposeHandlers){
            for(const i in disposeHandlers){
                disposeHandlers[i].call(this,this)
            }
        }
        if(disposeHandlers!==null){
            Object.defineProperty(this,'--disposes--',{enumerable:false,configurable:false,writable:false,value:null})
            Object.defineProperty(this,'$disposed',{enumerable:false,configurable:false,writable:false,value:true})
        }
        return this
    }
    let disposeHandlers = this['--disposes--']
    if(disposeHandlers===null){
        handler.call(this,this)
        return this
    }
    if(disposeHandlers===undefined) Object.defineProperty(this,'--disposes--',{enumerable:false,configurable:true,writable:false,value: disposeHandlers=[]})
    disposeHandlers.push(handler)
    return this

}
export function disposable(target:any):any{
    Object.defineProperty(target,'$dispose',{enumerable:false,configurable:false,writable:true,value:dispose})
    return target
}
export class Disposiable{
    $disposed?:boolean
    $dispose(callback?){ throw 'abstract method'}
    static isInstance(obj){
        return obj && obj.$dispose && typeof obj.$dispose==='function'
    }
}
disposable(Disposiable.prototype)

//////////////////////////////////////////////////////////////
// Subscribe/Publish

export function subscribable(target){
    Object.defineProperty(target,'$subscribe',{enumerable:false,configurable:false,writable:true,value:function(handler,extras?,disposer?){
        let handlers = this['--subscribable--']
        if(!handlers) Object.defineProperty(this,'--subscribable--',{enumerable:false,writable:false,configurable:true,value:handlers=[]})
        if (handlers['--fulfill--']){
            const filter = handlers['--fulfill-filter']
            if(filter && !filter(extras)) return this
            if(extras===undefined) extras = this
            handlers['--fulfill-use-apply--']?handler.apply(extras,handlers['--fulfill-value--']):handler.call(extras,handlers['--fulfill-value--'])
            return this
        }
        const callbacker = {
            handler: handler,
            extras: extras
        }
        handlers.push(callbacker)
        if(disposer) {
            if(disposer.$dispose){
                disposer.$dispose(()=>this.$unsubscribe(handler))
            }else if (disposer.dispose){
                disposer.$dispose(()=>this.$unsubscribe(handler))
            }else console.warn('subscribable.subscribe传入的第二个参数没有找到$dispose/dispose成员函数，无法追加释放事件')
        } 
        return this;
    }})
    Object.defineProperty(target,'$unsubscribe',{enumerable:false,configurable:false,writable:true,value:function(handler,filter?:(extras)=>boolean){
        let handlers = this['--subscribable--']
        if(!handlers || handlers['--fulfill--']) return this
        for(let i =0,j=handlers.length;i<j;i++) {
            const callbacker = handlers.shift()
            if(!callbacker) return this
            if(filter && filter(callbacker.extras)) continue
            if(callbacker.handler!==handler) handlers.push(callbacker)
        }
        return this;
    }})
    Object.defineProperty(target,'$publish',{enumerable:false,configurable:true,writable:true,value:function(arg?:any,useApply?:boolean,filter?:(extras)=>boolean){
        let handlers = this['--subscribable--']
        if (!handlers) return this
        if(handlers['--fulfill--']) throw new Exception('已经具有终值，不能再调用$publish')
        for(let i =0,j=handlers.length;i<j;i++) {
            const callbacker :any= (handlers as []).shift();
            const extras = callbacker.extras
            if (filter && !filter(extras)){
                handlers.push(callbacker)
            } else {
                const self = extras===undefined?this:extras
                let result
                if (useApply) result = callbacker.handler.apply(self,arg)
                else result = callbacker.handler.call(self, arg)
                if (result!==observableRemoveToken) handlers.push(result)
            }
        }
        return this
    }})
    Object.defineProperty(target,'$fulfill',{enumerable:false,configurable:true,writable:true,value:function(arg?:any,useApply?:boolean,filter?:(extras)=>boolean){
        let handlers = this['--subscribable--']
        if (handlers && handlers['--fulfill--']) {
            throw new Exception('已经具有了终值，不可以再调用$fulfill函数')
        }

        const fulfill = {'--fulfill--':true,'--fulfill-value--':arg,'--fulfill-use-apply--':useApply,'--fulfill-filter--':filter}
        Object.defineProperty(this,'--subscribable--',{configurable:false,writable:false,enumerable:false,value:fulfill})
        if(!handlers || handlers.length===0) return this
        for(let i =0,j=handlers.length;i<j;i++) {
            const callbacker :any= (handlers as []).shift();
            const extras = callbacker.extras
            if (filter && !filter(extras)){continue}
            const self = extras===undefined?this:extras
            if (useApply) callbacker.handler.apply(self,arg)
            else callbacker.handler.call(self, arg)
        }
        return this
    }})
}
const observableRemoveToken = {}
Object.defineProperty(subscribable,'REMOVE',{configurable:false,writable:false,enumerable:false,value:observableRemoveToken})

export class Subscription{
    $subscribe(handler:any,extra?,disposable?:Disposiable):any{throw 'abstract method'}
    $unsubscribe(handler:any):any{throw 'abstract method'}
    $publish(evt?:any,useApply?:boolean,filter?:(extras)=>boolean){throw 'abstract method'}
    $fulfill(evt?:any,useApply?:boolean,filter?:(extras)=>boolean){throw 'abstract method'}
    static isInstance(obj:any):boolean{
        return (obj && obj.$subscribe && obj.$unsubscribe && obj.$publish && obj.$fulfill)
    }
}
subscribable(Subscription.prototype)
Object.defineProperty(Subscription,'REMOVE',{configurable:false,writable:false,enumerable:false,value:observableRemoveToken})

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


//////////////////////////////////////////////////////////////////
// 对象创建与注入
//

export type TInjectFactory = (name:string,scope:InjectScope,target?:any)=>any

export class InjectScope extends Disposiable{
    factories:{[name:string]:TInjectFactory}
    constructor(public name?:string,public superScope?:InjectScope){
        super()
        this.factories = {}
        this.constant(InjectScope.svcname,this)
    }

    createScope(name?:string):InjectScope{
        const sub = new InjectScope(name,this)
        this.$dispose(()=>sub.$dispose())
        return sub
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
    register(name:string, ctor:{new(...args):any}|Function,singleon?:boolean):Activator{
        if(this.factories[name]) throw new Exception('已经注册过该依赖项:' + name)
        const activator = Activator.fetch(ctor)
        const notinitial = {}
        let instance = notinitial
        const factory = (name,scope,context)=>{
            if(singleon && instance!==notinitial) return instance
            let inst = activator.createInstance(scope,undefined,undefined,context)
            if(inst && typeof inst.$dispose==='function') this.$dispose(()=>inst.$dispose())
            if(singleon) instance = inst
            return inst
        }
        this.factories[name] = factory
        return activator
    }
    constant(name:string, value:any):InjectScope{
        if(this.factories[name]) throw new Exception('已经注册过该依赖项:' + name)
        this.factories[name] = (name,scope,context)=>value
        return this
    }
    factory(name:string, factory : TInjectFactory):InjectScope{
        if(this.factories[name]) throw new Exception('已经注册过该依赖项:' + name)
        this.factories[name] = factory
        return this
    }
    static global:InjectScope = new InjectScope('<GLOBAL>')
    static svcname:string = 'services'
}

export class Activator{
    ctorArgs:string[]
    depProps:{[propname:string]:string}
    constructor(public ctor:{new(...args):any}){

    }
    prop(propname:string|{[pname:string]:string}|string[],depname?:string):Activator{
        if(!this.depProps) this.depProps={}
        if(depname===undefined){
            if(typeof propname==='object') {
                if(is_array(propname)) for(const i in propname as string[]) this.prop(depname[i],depname[i])
                else for(const pname in propname as {[pname:string]:string}) this.prop(pname,depname[pname])
            } else depname = propname
        }
        propname = (propname as string).replace(trimRegx,'')
        depname = depname?depname.replace(trimRegx,''):propname
        if(!propname) throw new Exception('依赖必须指定属性名/依赖名')
        this.depProps[propname] = depname
        return this
    }
    createInstance(args?:any,constructing?:(selfInstance:any,args:any[],activator:Activator,rawArgs:any)=>any,constructed?:(selfInstance:any,activator:Activator)=>any,context?){
        let thisInstance:any = Object.create(this.ctor.prototype)
        
        let retInstance = thisInstance
        let ctorArgs =[]
        if(args instanceof InjectScope){
            ctorArgs = buildCtorArgsFromInjection(args as InjectScope,thisInstance,this,context)
        }else {
            ctorArgs = buildCtorArgs(args,thisInstance,this)
        }
        if(constructing) retInstance = constructing(thisInstance,ctorArgs,this,args)
        if(retInstance!==undefined) thisInstance = retInstance
        retInstance = this.ctor.apply(thisInstance,ctorArgs)
        if(retInstance!==undefined) thisInstance = retInstance
        if(constructed)  {
            retInstance = constructed(thisInstance,this)
            if(retInstance!==undefined) thisInstance = retInstance
        } 
        
        if(!(thisInstance instanceof this.ctor))(Object as any).setPrototypeOf(thisInstance, this.ctor.prototype);
        return thisInstance
    }
    static activate(ctorPrProto:any,args?:any,constructing?:(selfInstance:any,args:any[],activator:Activator,rawArgs:any)=>any,constructed?:(selfInstance:any,activator:Activator)=>any,context?){
        return Activator.fetch(ctorPrProto).createInstance(args,constructing,constructed,context)
    }
    static fetch(ctorOrProto:any):Activator{
        if(!ctorOrProto) return undefined
        let activator:Activator = ctorOrProto['--activator--']
        if(!activator){
            const t = typeof ctorOrProto
            if(t==='function'){
                activator = new Activator(ctorOrProto as {new(...arg):any})
            }else if(t==='object'){
                const ctor = function(){}
                activator = new Activator(ctor as any as {new(...arg):any})
                activator.ctorArgs = []
            }
            Object.defineProperty(ctorOrProto,'--activator--',{enumerable:false,configurable:false,writable:false,value:activator})
        }
        if(!activator.ctorArgs) parseDepdenceArgs(activator)
        return activator
    }
}
function parseDepdenceArgs(activator:Activator){
    const code = activator.ctor.toString()
    const start = code.indexOf('(')
    const end = code.indexOf(')',start)
    const argsText = code.substring(start+1,end)
    const argslist = argsText.split(',')
    const args = []
    for(const  i in argslist) args.push(argslist[i].replace(trimRegx,''))
    activator.ctorArgs = args
}

function buildCtorArgs(args:any,thisInstance:any,activator:Activator):any[]{
    if(!activator.ctorArgs) parseDepdenceArgs(activator)
    const depArgs = activator.ctorArgs
    const depProps = activator.depProps
    if(!args) return []
    if(is_array(args)) return args 
    if(typeof args === 'object'){
        const actualArgs = []
        for(const propname in depProps){
            const mapname = depProps[propname]
            const value = args[mapname|| propname]
            if(value!==undefined) thisInstance[propname] = value
        }
        for(const i in depArgs) {
            actualArgs.push(args[depArgs[i]])
        }
        return actualArgs
    }else return [args]
}
function buildCtorArgsFromInjection(scope:InjectScope,selfInstance:any,activator:Activator,context){
    if(!activator.ctorArgs) parseDepdenceArgs(activator)
    if(activator.depProps){
        for(const propname in activator.depProps){
            const depname = activator.depProps[propname]
            const propValue = scope.resolve(depname,context)
            selfInstance[propname] = propValue
        }
    }
    if(activator.ctorArgs && activator.ctorArgs.length){
        const args = []
        for(const i in activator.ctorArgs) {
            const name = activator.ctorArgs[i]
            const argValue = scope.resolve(name,context)
            args.push(argValue)
        }
        return args
    }
    return []
}

export function injectable(map?:string|boolean){
    return function(target,name?){
        
        
        if(name!==undefined) {
            const activator = Activator.fetch(target.constructor || target)
            if(map===true) map = name
            else if(map===false) return target
            activator.prop(name,map as string)
        }else{
            const activator = Activator.fetch(target)
            if(map===false)activator.ctorArgs=[]
        }
    }
}
////////////////////////////////////////////////////////////////
// ModelSchema 模型架构
//
declare let Proxy;


export enum ModelTypes{
    constant,
    value,
    object,
    array,
    computed
}

@implicit()
export class Schema{
    $type: ModelTypes
    $name?: string
    $super?: Schema
    $default?: any
    $fn?:Function
    $args?: Schema[]
    $item?: Schema
    length?: Schema
    $dpath:DPath
    private '--dpath--'?: DPath
    constructor(defaultValue,name?:string|Schema[],superSchema?:any,visitor?:any){
        let type: ModelTypes,_name: string,_default: any
        let fn:Function, args : Schema[]
        if(defaultValue && (defaultValue.$modelType!==undefined || defaultValue.$fn)){
            type = defaultValue.$modelType
            _default = defaultValue.$value
            fn = defaultValue.$fn
            args= defaultValue.$args
            if(type===undefined && fn) type= ModelTypes.computed
            _name = name as string
        } else _default = defaultValue

        const t = typeof _default
        if(t==='function'){
            if(is_array(name)) {
                fn = defaultValue
                args = name as Schema[]
                type = ModelTypes.computed
            } else if(!fn) {
                _default = defaultValue
                type = ModelTypes.value
                _name = name as string
            }
        }else if (t==='object' && type===undefined){
            if(is_array(_default)) type = ModelTypes.array
            else type = ModelTypes.object
        } else type = ModelTypes.value

        constant(false,this,{
            '$name': name,
            '$fn' : fn,
            '$args':args,
            '$super': superSchema,
            '$default':_default
        })
        constant(false,this,{
            '$type':type,'length':undefined,'$item':undefined,'--dpath--':undefined
        },undefined,true)
        Object.defineProperty(this,'$dpath',{enumerable:false,configurable:false,get:function(){
            let dpath = this['--dpath--']
            if(dpath) return dpath
            if(this.$name && this.$super){
                const path = this.$super.$dpath.slashpath + "/" + this.$name
                dpath= DPath.fetch(path)
            }else {
                dpath = {
                    slashpath:this.$name===undefined?'':this.$name,
                    get(obj,name,context?){return obj},
                    set(obj,name,value,context?){},
                    toString(){ return this.slashpath }
                }
            }
            Object.defineProperty(this,'--dpath--',{configurable:false,writable:false,enumerable:false,value:dpath})
            return dpath
        }})
        
        if(type=== ModelTypes.array){
            this.$asArray(clone(_default?_default[0]:undefined))
        } else if(type===ModelTypes.object) {
            for(let n in defaultValue) {
                this.$defineProp(n,clone(defaultValue[n]))
            }
        }
    }
    $defineProp(name:string, propDefaultValue?:any,visitor?:any):Schema{
        if(this.$type !== ModelTypes.object){
            if(this.$type !== ModelTypes.value) throw new Exception('只有type==value的Schema才能调用该函数',{'schema':this})
            Object.defineProperty(this,'$type',{enumerable:false,configurable:false,writable:false,value:ModelTypes.object})
        } 
        const propSchema = new Schema(propDefaultValue,name,this,visitor)
        Object.defineProperty(this,name,{configurable:true,writable:false,enumerable:true,value:propSchema})
        return propSchema
    }

    $asArray(defaultItemValue?: any,visitor?:any):Schema{
        if(this.$item) throw new Exception('$asArray只能调用一次',{'schema':this})
        Object.defineProperty(this,'$type',{enumerable:false,configurable:false,writable:false,value:ModelTypes.array})
        let lengthSchema = new Schema(0,'length',this,visitor)
        Object.defineProperty(this,'length',{enumerable:false,configurable:false,writable:false,value:lengthSchema})
        const itemSchema = new Schema(defaultItemValue,'[]',this)
        Object.defineProperty(this,'$item',{configurable:false,writable:false,enumerable:false,value:itemSchema})
        return itemSchema
    }
    static proxy(target?){
        if(!target || !(target instanceof Schema)) return new Proxy(new Schema(target),schemaProxyTraps)
        return new Proxy(target,schemaProxyTraps);
    }
}

const schemaProxyTraps = {
    get(schema: Schema,propname:string){
        if(propname==='$schema') return schema;
        let existed = schema[propname]
        if(existed) return existed
        existed = schema.$defineProp(propname)
        return new Proxy(existed,schemaProxyTraps);
    },
    set(target:Schema,propname:string,value:any){
        throw new Exception('schemaBuilder不可以在schemaBuilder上做赋值操作');
    }
};


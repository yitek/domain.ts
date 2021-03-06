import schemaUnittest from "./tests/core/schema.unittest";

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

export function is_date(obj:any):boolean{
    return obj && Object.prototype.toString.call(obj)==="[object Date]";
}

export function is_regex(obj:any):boolean{
    return obj && Object.prototype.toString.call(obj)==="[object RegExp]";
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
    if(!obj) return obj
    const t = typeof obj;
    if(t==='object'){
        if(is_date(obj)) return new Date(obj.valueOf())
        else if(is_regex(obj)) return obj
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

    if(is_array(name)){
        for(const membername of name) {
            desc.value = target[membername];
            Object.defineProperty(target, membername , desc);
        }
        return target
    }else if(is_object(name)){
        for(var n in name) {
            desc.value = name[n];
            Object.defineProperty(target , n , desc);
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
        if(Exception.printError)console.error(msg,detail);
        super(msg);
        if(detail)for(let n in detail) this[n] = detail[n];
    }
    static printError:boolean=false
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

export const NONE = new Proxy(function(){return this},{
    get(){return undefined},
    set(){return this}
})

export const ATTACH = new Proxy(function(){return this},{
    get(){return undefined},
    set(){return this}
})

export const DETECH = new Proxy(function(){return this},{
    get(){return undefined},
    set(){return this}
})
export const REMOVE = new Proxy(function(){return this},{
    get(){return undefined},
    set(){return this}
})
export const UPDATE = new Proxy(function(){return this},{
    get(){return undefined},
    set(){return this}
})
export const USEAPPLY = new Proxy(function(){return this},{
    get(){return undefined},
    set(){return this}
})

let nextTickHandlers = []
let nextTickTimer :number
export function nextTick(handler,append?) {
    if(append===false){
        let c = 0
        for(let i = 0,j=nextTickHandlers.length;i<j;i++) {
            const existed = nextTickHandlers.shift()
            if(existed!==handler) nextTickHandlers.push(existed)
            else c++
        }
        return c
    }
    nextTickHandlers.push(handler)
    if(!nextTickTimer) nextTickTimer = setTimeout(() => {
        const handlers = nextTickHandlers
        nextTickHandlers = []
        for(let i = 0,j=handlers.length;i<j;i++) {
            const handler = handlers.shift()
            handler()
        }
        if(nextTickHandlers.length===0) nextTickTimer = 0
    }, 0);
}


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
disposable.isInstance = Disposiable.isInstance
Object.defineProperty(disposable,'isInstance',{configurable:false,writable:false,enumerable:false,value:Disposiable.isInstance})

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
            if(handlers['--fulfill-use-apply--'])
                handler.apply(extras,handlers['--fulfill-value--'])
            else if (handlers['--fulfill-value1--']===undefined)
                handler.call(extras,handlers['--fulfill-value--'])
            else 
                handler.call(extras,handlers['--fulfill-value--'],handlers['--fulfill-value1--'])
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
    Object.defineProperty(target,'$publish',{enumerable:false,configurable:true,writable:true,value:function(arg?:any,useApply?:any,filter?:(extras)=>boolean){
        let handlers = this['--subscribable--']
        if (!handlers) return this
        if(handlers['--fulfill--']) throw new Exception('已经具有终值，不能再调用$publish')
        let arg1 = useApply
        if(USEAPPLY===useApply){
            useApply = true
        }else {
            if(filter===undefined && useApply instanceof Function){
                filter = useApply
                arg1 = undefined
            }
            
            useApply=false
        }
        for(let i =0,j=handlers.length;i<j;i++) {
            const callbacker :any= (handlers as []).shift();
            if(!callbacker) continue
            const extras = callbacker.extras
            if (filter && !filter(extras)){
                handlers.push(callbacker)
            } else {
                const self = extras===undefined?this:extras
                let result
                if (useApply) result = callbacker.handler.apply(self,arg)
                else if(arg1===undefined) result = callbacker.handler.call(self, arg)
                else result = callbacker.handler.call(self,arg,arg1)
                if (result!==REMOVE) handlers.push(callbacker)
                else if (result===false) return false
            }
        }
        return this
    }})
    Object.defineProperty(target,'$fulfill',{enumerable:false,configurable:true,writable:true,value:function(arg?:any,useApply?:any,filter?:(extras)=>boolean){
        let handlers = this['--subscribable--']
        if (handlers && handlers['--fulfill--']) {
            throw new Exception('已经具有了终值，不可以再调用$fulfill函数')
        }
        let arg1 = useApply
        if(USEAPPLY===useApply){
            useApply = true
        }else {
            if(filter===undefined && useApply instanceof Function){
                filter = useApply
                arg1 = undefined
            }
            useApply=false
        }
        const fulfill = {'--fulfill--':true,'--fulfill-value--':arg,'--fulfill-value1--':arg1,'--fulfill-use-apply--':useApply,'--fulfill-filter--':filter}
        Object.defineProperty(this,'--subscribable--',{configurable:false,writable:false,enumerable:false,value:fulfill})
        if(!handlers || handlers.length===0) return this

        for(let i =0,j=handlers.length;i<j;i++) {
            const callbacker :any= (handlers as []).shift();
            if(!callbacker) continue
            const extras = callbacker.extras
            if (filter && !filter(extras)){
                handlers.push(callbacker)
            } else {
                const self = extras===undefined?this:extras
                let result
                if (useApply) result = callbacker.handler.apply(self,arg)
                else if(arg1===undefined) result = callbacker.handler.call(self, arg)
                else result = callbacker.handler.call(self,arg,arg1)
                if (result===false) return false
            }
        }
        return this
    }})
}

subscribable.REMOVE = REMOVE
Object.defineProperty(subscribable,'REMOVE',{configurable:false,writable:false,enumerable:false,value:REMOVE})
subscribable.USEAPPLY = USEAPPLY
Object.defineProperty(subscribable,'USEAPPLY',{configurable:false,writable:false,enumerable:false,value:USEAPPLY})

export class Subscription{
    $subscribe(handler:any,extra?,disposable?:Disposiable):any{throw 'abstract method'}
    $unsubscribe(handler:any):any{throw 'abstract method'}
    $publish(evt?:any,useApply?:any,filter?:(extras)=>boolean):any{throw 'abstract method'}
    $fulfill(evt?:any,useApply?:any,filter?:(extras)=>boolean):any{throw 'abstract method'}
    static isInstance(obj:any):boolean{
        return (obj && obj.$subscribe && obj.$unsubscribe && obj.$publish && obj.$fulfill)
    }
    static REMOVE
    static USEAPPLY
}
subscribable(Subscription.prototype)
Object.defineProperty(Subscription,'REMOVE',{configurable:false,writable:false,enumerable:false,value:REMOVE})
Object.defineProperty(Subscription,'USEAPPLY',{configurable:false,writable:false,enumerable:false,value:USEAPPLY})

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
    constructor(public ctor:{new(...args):any}){}

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
    constructor(defaultValue,name?:string|Schema[],superSchema?:any){
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
        if(_default){
            if(_default instanceof Date){
                type = ModelTypes.value
            }
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
                else if(is_date(_default) || is_regex(_default)) type = ModelTypes.value
                else type = ModelTypes.object
            }else type = ModelTypes.value
        }else type = ModelTypes.value
         

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
    $defineProp(name:string, propDefaultValue?:any):Schema{
        if(this.$type !== ModelTypes.object){
            if(this.$type !== ModelTypes.value) throw new Exception('只有type==value的Schema才能调用该函数',{'schema':this})
            Object.defineProperty(this,'$type',{enumerable:false,configurable:false,writable:false,value:ModelTypes.object})
        } 
        const propSchema = new Schema(propDefaultValue,name,this)
        Object.defineProperty(this,name,{configurable:true,writable:false,enumerable:true,value:propSchema})
        return propSchema
    }

    $asArray(defaultItemValue?: any):Schema{
        if(this.$item) return this.$item
        Object.defineProperty(this,'$type',{enumerable:false,configurable:false,writable:false,value:ModelTypes.array})
        let lengthSchema = new Schema(0,'length',this)
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

////////////////////////////////////////////////
// Observable
//



export type TObservable = {
    [index in number | string]: TObservable
} & {
    (value?: any,handler?,disposor?): any
    '$Observable':Observable
    $observable:TObservable
} & {
    length?:TObservable
    push?:(...args)=>TObservable
    pop?:(token?)=>any
    unshift?:(...args)=>TObservable
    shift?:(token?)=>any
    remove?:(at:number)=>any
    insert?:(at:number)=>TObservable
}

export enum ObservableChangeTypes{
    nochanges,
    setted,
    changed,
    appended,
    removed
}

export type TObservableChange = {
    type:ObservableChangeTypes
    value?:any
    old?:any
    src?:any
    sender?:TObservable
    changes? :{[index:string]:TObservableChange}
    cancel?:boolean
    stop?:boolean
}

export class Observable extends Subscription{
    type:ModelTypes
    name:string
    old:any
    value:any
    change:TObservableChange
    schema: Schema
    super?:Observable
    $observable:TObservable

    length?:Observable
    constructor(initial,schema:Schema,name:string|number,superOb:Observable){
        super()
        let type :ModelTypes
        if(schema) {
            type = schema.$type
        }else{
            if(initial){
                const t = typeof initial
                if(t==='object'){
                    if(is_date(initial) || is_regex(initial)) type = ModelTypes.value
                    else if(is_array(initial)) type = ModelTypes.array
                    else type = ModelTypes.object
                }else type = ModelTypes.value
            } else type = ModelTypes.value
            
        }
        switch(type){
            case ModelTypes.value:ObservableValue.call(this,initial,schema,name,superOb);break;
            case ModelTypes.object:ObservableObject.call(this,initial,schema,name,superOb);break;
            case ModelTypes.array:ObservableArray.call(this,initial,schema,name,superOb);break;
        }
        
    }
    set(value,src?):TObservableChange{
        throw 'abstract method.'
    }
    get():any{
        return this.value
    }
    update(src:any,bubble?:boolean):TObservableChange{throw 'abstract method.'}
    static isInstance(o:any):boolean{
        return o && o.$observable && o.$Observable ===o
    }
    bubble(change:TObservableChange):boolean{
        if(this.$publish(change,undefined,(extra)=>extra===true)===false) return false
        if(change.cancel) return false
        if(this.super) return this.super.bubble(change)
    }
}

function init_observable(inital,schema:Schema,name:string,superOb:Observable){
    if(!this.$publish) Subscription.call(this)
    if(!name && schema) name = schema.$name
    this.name = name
    this.schema = schema || new Schema(inital,name,superOb?.schema)
    this.super = superOb
    this.$observable = create_observable(this)
    this.$Observable = this
    this.value = this.old = inital
}

export function ObservableValue(inital,schema:Schema,name:string,superOb:Observable){
    this.type = ModelTypes.value
    init_observable.call(this,inital,schema,name,superOb)
    
    this.set = function(value ,src?){
        if(this.value===value) return
        this.value = value
        sure_change(this,value,ObservableChangeTypes.setted)
        if(src!==undefined) this.update(src)
        return this.change
    }
    this.update =function(src?,bubble?:boolean):boolean{
        if(!this.change) return false
        const evt:TObservableChange = this.change
        this.change = null
        this.old = this.value
        evt.src = src
        if(this.$publish(evt,(extra)=>extra!==true)===false) return false
        if(bubble!==false && !evt.cancel) {
            this.bubble(evt)
        }
        return true
    }

}

export function ObservableObject(inital,schema:Schema,name:string,superOb:Observable){
    this.get = function(){
        const result = {}
        const $observable = this.$observable
        for(const propname in this.schema) {
            result[propname] = $observable[propname]()
        }
        return result
    }
    this.set = function(value,src?):TObservableChange{
        const settingValue = value || {}
        this.value = value
        const ob = this.$observable
        const schema = this.schema

        const mod = observable.mode
        observable.mode = ObservableModes.delay
        let hasChanges = false
        for(const propname in schema) {
            const prop = ob[propname]
            const propOb = prop(Observable)
            let propValue = settingValue[propname]
            const propChange = propOb.set(propValue)
            if(propChange){
                const change = sure_change(this,value,ObservableChangeTypes.changed,propChange,propname)
                hasChanges = true
            }
        }
        observable.mode = mod
        if(hasChanges){
            const change = this.change
            if (src!==undefined ) this.update(src)
            return change
        }
    }
    this.update = function(src?,bubble?:boolean):boolean{
        if(!this.change) return false
        const evt = this.change
        evt.src = src
        this.change = null
        this.old = this.value
        if(this.$publish(evt,(extra)=>extra!==true)===false) return false
        if(bubble!==false && !evt.cancel){
            if(this.bubble(evt)===false) return false
        }
        if(evt.stop) return true
        const schema = this.schema
        const $observable = this.$observable
        for(const propname in schema) {
            const propOb = $observable[propname](Observable)
            propOb.update(src,false)
        }
        return true
    }
    init_observable.call(this,inital,schema,name,superOb)
    const ob = this.$observable
    const initialValue = inital || {}
    for(const propname in this.schema) {
        const propValue = initialValue[propname]
        const propOb = new Observable(propValue,this.schema[propname],propname, this)
        Object.defineProperty(ob,propname,{enumerable:true,configurable:true,writable:false,value:propOb.$observable})
    }
    

}

export function ObservableArray(inital,schema:Schema,name:string,superOb:Observable){
    
    this.get = function(){ 
        const result = []
        for(let i = 0,j= this.length.value;i<j;i++) {
            const item = ob[i]()
            result.push(item)
        }
        return result
     }
     this.set = function(value,src?):TObservableChange{
        
        const settingValue = value && value.push? value: []
        this.value = value
        const ob = this.$observable
        const itemSchema = this.schema.item 
        let hasChanges = false
        const mod = observable.mode
        observable.mode = ObservableModes.delay
        this.length.set(settingValue.length)
        for(let i = 0,j= settingValue.length;i<j;i++) {
            const itemValue = settingValue[i]
            let item:TObservable = ob[i]
            let itemOb:Observable
            let itemChange:TObservableChange
            if(!item) {
                itemOb = new Observable(itemValue,itemSchema,i as any as string,this)
                item = itemOb.$observable
                Object.defineProperty(ob,i as any as string,{enumerable:true,writable:false,configurable:true,value:itemOb})                
                itemChange = {
                    type: ObservableChangeTypes.appended,
                    sender:item,
                    old:undefined,
                    value:item
                }
                itemOb.change = itemChange
            } else {
                itemOb = item(Observable)
                itemChange = itemOb.set(itemValue)
            }
            if(itemChange){
                sure_change(this,value,ObservableChangeTypes.changed,itemChange,i)
                
                hasChanges = true
            }
        }
        
        observable.mode = mod
        if(hasChanges){
            const change = this.change
            if (src!==undefined ) this.update(src)
            return change
        }
     }
    
    // this.set = observable_setObject
    this.update = function(src?){
        if(!this.change) return false
        const evt = this.change 
        this.change = null
        evt.src = src
        if(this.$publish(evt)===false) return false

        const oldLength = this.length.old
        const newLength = this.length.value
        if(!this.length.update(src)) return false
        const ob = this.$observable
        let hasChanges = false
        for(let i =0,j=newLength;i<j;i++) {
            const item = ob[i]
            const itemOb = item(Observable)
            if(itemOb.update(src))hasChanges=true
        }
        for(let i =newLength,j=oldLength;i<j;i++) {
            const item = ob[i]
            delete ob[i]
            const itemOb = item(Observable)
            if(itemOb.change) {
                itemOb.change.type = ObservableChangeTypes.removed
                if(itemOb.update(src))hasChanges=true
            }
        }

        return hasChanges
    }
    let initialValue = inital || []
    this.type = ModelTypes.array
    init_observable.call(this,inital,schema,name,superOb)
    const ob = this.$observable

    make_arrayObservable(ob,this)
    make_arrayLength(initialValue.length,ob,this)
    
    if(!schema){
        schema = this.schema = new Schema(undefined,name,superOb?.schema)
    }
    let itemSchema :Schema = schema.$asArray()
    for(let i =0,j=initialValue.length;i<j;i++) {
        const itemValue = initialValue[i]
        const itemOb = new Observable(itemValue,itemSchema,i, this)
        Object.defineProperty(ob,i,{enumerable:true,configurable:true,writable:false,value:itemOb.$observable})
    }

}


function create_observable(info:Observable):TObservable{
    const ob = function(value:any,handler?,disposer?){
        if(value === undefined) return info.value
        if(value === Schema) return info.schema
        if(value === Observable) return info
        if(value === observable) return ob

        if(value===ATTACH) {
            info.$subscribe(handler,info,disposer)
        }else if(value===DETECH){
            info.$unsubscribe(handler)
        }else info.set(value,handler)
        return ob

    }
    Object.defineProperty(ob,'toString',{configurable:false,writable:true,enumerable:false,value:()=>info.value?info.value.toString():''})
    Object.defineProperty(ob,'$observable',{configurable:false,writable:false,enumerable:false,value:ob})
    Object.defineProperty(ob,'$Observable',{configurable:false,writable:false,enumerable:false,value:info})
    Object.defineProperty(ob,'$subscribe',{configurable:false,writable:true,enumerable:false,value:(handler,extra,disposer)=>{info.$subscribe(handler,extra,disposer);return ob}})
    Object.defineProperty(ob,'$unsubscribe',{configurable:false,writable:true,enumerable:false,value:(handler)=>{info.$subscribe(handler);return ob}})
    Object.defineProperty(ob,'$update',{configurable:false,writable:true,enumerable:false,value:(src?)=>{info.update(src,true);return ob}})
    return ob as any
}

function sure_change(Ob:Observable,value,defaultType:ObservableChangeTypes,subChange?:TObservableChange,index?:any){
    let change = Ob.change
    if(Ob.change) {
        change = Ob.change
    }else {
         change =  Ob.change = {
            type:defaultType,
            old: Ob.old,
            value:value,
            sender: Ob.$observable
         }
    }
    change.value = value
    if(subChange) {
        const changes = change.changes || (change.changes={})
        changes[index] = subChange
    }
    
    return change
}

function make_arrayLength(len:number,arr:TObservable,aOb:Observable){
    const length = aOb.length = new Observable(len,null,'length',aOb)
    Object.defineProperty(arr,'length',{enumerable:false,configurable:false,writable:false,value:length.$observable})
    const set = length.set
    length.set = function(len:number,src?):TObservableChange{
        const old = Math.max(length.value,length.old)
        if(len>old){
            for(let i = old;i<len;i++) {
                let item = arr[i]
                if(!item) {
                    const itemOb = new Observable(undefined,aOb.schema.$item,i,aOb)
                    Object.defineProperty(arr,i,{enumerable:true,configurable:true,writable:false,value:itemOb.$observable})
                }
            }
        }
        const change = set.call(this,len,src)
        return change
    }
}

function make_arrayObservable(Ob:Observable,ob:TObservable){
    ob.push = function(){
        let len = Ob.length.value
        for(const i in arguments) {
            const itemValue = arguments[i]
            const itemOb = new Observable(itemValue,Ob.schema.$item,len,Ob)
            Object.defineProperty(ob,len,{enumerable:true,configurable:true,writable:false,value:itemOb.$observable})
            len++
        }
        Ob.length.set(len)
        return ob
    } as any
    ob.pop = function(token?){
        let len = Ob.length.value
        if(len===0){
            if(token===Observable || token === observable) return NONE
            return undefined
        }
        let lastItem = ob[len]
        Ob.length.set(len-1)
        if(token===Observable) return lastItem(Observable)
        if(token===observable) return lastItem
        return lastItem()
    } as any
    ob.unshift = function(){
        let appendCount = arguments.length
        let oldLen = Ob.length.value
        let newLen = oldLen + appendCount
        
        
        for(let appendIndex =newLen-1;appendIndex>=oldLen;appendIndex--) {
            const existItem = ob[appendIndex-oldLen]
            //构造出后面的item
            const itemOb = new Observable(existItem(),Ob.schema.$item,appendIndex,Ob)
            Object.defineProperty(ob,appendIndex,{enumerable:true,configurable:true,writable:false,value:itemOb.$observable})
        }
        for(let i = oldLen;i>=appendCount;i--){
            const oldPosItem = ob[i-appendCount]
            const newPosItem = ob[i]
            newPosItem(oldPosItem())
        }
        for(let i =0;i<appendCount;i++){
            ob[i](arguments[i])
        }
        Ob.length.set(newLen)
        return ob
    } as any
    ob.shift = function(){
        let len = Ob.length.value
        if(len===0){
            return undefined
        }
        const first = ob[0]
        for(let i =1;i<len;i++){
            ob[i-1](ob[i]())
        }
        Ob.length.set(len-1)
        return ob
    }
}


export enum ObservableModes{
    delay,
    immediately
}
export function observable(initial?,name?:string){
    let schema :Schema
    if (initial instanceof Schema){
        schema = initial
        initial = schema.$default
    }else if (initial instanceof Observable) {
        schema = initial.schema
        initial = initial.get()
    } else if (observable.isInstance(initial)){
        schema = initial.$Observable.schema
        initial = initial.$Observable.get()
    }
    return new Observable(initial,schema,name,null).$observable
}
observable.isInstance = function(o:any):boolean{return false}
Object.defineProperty(observable,'isInstance',{enumerable:false,configurable:false,writable:false,value:(o:any):boolean=>o && o.$Observable && o.$observable===o })
observable.mode = ObservableModes.delay
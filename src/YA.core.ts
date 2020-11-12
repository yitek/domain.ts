/*
class Component{
    render(){
        let {item,i,row} = eachvar(2);
        return <grid y-slot={row}>
            <column y-for={{each:this.columns ,as item}} y-if={COMPUTED(row,this.checkPermission} class={row.css} />
            
            </grid>
        </table><input y-if={this.state.writable} y-for={{each:this.items, as:item ,key:i} y-value={this.username} /><button onclick={this.reset}>Reset</button>;
    },
    reset(){
        this.username = "yiy";
    }
}
YA.mount({
    element:el,
    component:comp,//template
    opts:{
        tag:{}
    }
});
let component = YA.mount(Component,document.getElementById('abc');
component.username = "hello";
*/


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

let trimreg = /(^\s+)|(\s+$)/g;

/**
 *  去掉两边空格
 *
 * @export
 * @param {*} text
 * @returns {string}
 */
export function trim(text:any):string {
    if (text===null || text===undefined) return "";
    return text.toString().replace(trimreg, "");
}


/**
 * 判定字符串是否以某个串开始
 *
 * @export
 * @param {*} text 要判定的字符串
 * @param {*} token 开始标记字符串
 * @returns {boolean}
 */
export function startWith(text:any,token:any) :boolean {
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
export function endWith(text:any, token :any) :boolean{
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

export class Exception extends Error{
    constructor(msg,detail?:any){
        console.error(msg,detail);
        super(msg);
        if(detail)for(let n in detail) this[n] = detail[n];
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
    $prop(name:string,defaultValue?:any): Schema{
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
        if(paths) return paths;
        let schema:Schema = this
        paths =[]
        while(schema){
            paths.unshift(schema.$name)
            schema = schema.$owner
        }
        Object.defineProperty(this,'--paths',{enumerable:false,writable:false,configurable:false,value:paths})
        return paths
    }

    $resolveFromRoot(root:any):any{
        let paths = this.$paths()
        let result =root
        for(let i =0,j=paths.length;i<j;i++){
            let name = paths[i]
            result = result[name]
            if(!result) break
        }
        return result
    }
}

const schemaBuilderTrigger = {
    get(target: Schema,propname:string){
        if(propname[0]==='$') {
            if(propname==='$schema') return target;
            return target[propname];
        }
        return new Proxy(target.$prop(propname),schemaBuilderTrigger);
    },
    set(target:Schema,propname:string){
        throw new Exception('schemaBuilder不可以在schemaBuilder上做赋值操作');
    }
};
declare let Proxy;
export function schemaBuilder(target?: Schema){
    target || (target = new Schema());
    return new Proxy(target,schemaBuilderTrigger);
}


function _createElement(tag:string,attrs:{[name:string]:any}):NodeDescriptor{
    const vnode:NodeDescriptor = new NodeDescriptor(tag,attrs)
    if(arguments.length>2){
        vnode.children = [];
        for(let i =2,j=arguments.length;i<j;i++){
            let child = arguments[i]
            if(child) vnode.appendChild(child)
        }
    }

    return vnode;
}

export const createElement :(tag:string,attrs:{[index:string]:any},...args:any[])=>NodeDescriptor = _createElement;

let currentContext;
export function vars(count?:number|{[index:string]:any}):any{
    let result;
    let prefix = '--local-'
    let tmpNameIndex= '--'
    let context = currentContext || {'--varnum-y':0}
    let varnum = context[tmpNameIndex] || (context[tmpNameIndex]=0)
    let t = typeof count;
    if(t==='number'){
        result = [];
        for(let i =0,j=count;i<j;i++){
            let schema = new Schema(undefined,prefix +(++varnum))
            context[schema.$name] = schema
            let schemaProxy = schemaBuilder(schema)
            result.push(schemaProxy);
        }
    }else if(t==='object'){
        result = {};
        for(let n in count as any){
            let schema = new Schema(count[n],prefix + n)
            context[schema.$name] = schema
            let schemaProxy = schemaBuilder(schema)
            result[n] =schemaProxy;
        }
    }else if(arguments.length===0){
        let schema = new Schema(undefined,prefix +(++varnum))
        context[schema.$name] = schema
        result = schemaBuilder(schema)
    }else{
        result={};
        for(let i =0,j=arguments.length;i<j;i++){
            let name = prefix + arguments[i];
            let schema = new Schema(undefined,name);
            context[schema.$name] = schema
            let schemaProxy = schemaBuilder(schema);
            result[name]=schemaProxy;
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
        let n = reversedNames[name] || name
        let facade = owner[n]
        if(facade) return facade(initial)
        let ownerOb = owner(Observable)
        let ob = new Observable(initial,undefined,ownerOb,name)
        Object.defineProperty(owner,n,{enumerable:true,configurable:false,writable:false,value:ob.$observable})
        return ob.$observable
    }else {
        if(initial instanceof Schema) return new Observable(undefined,initial).$observable
        return new Observable(initial).$observable
    }
}

export type TObservable = {
    [index in number | string]: TObservable;
} & {
    (value?: any): any;
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
        let facade = (value?:any,isSubscriber?:boolean):any=>{
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
            for(let n in schema) {
                let name = reversedNames[n] || n
                let member = new Observable(this.old[n],schema[n],this,n)
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
        let evt:TObservableEvent = update.call(this, src)
        if(bubble && evt && evt.bubble!==false) dispachBubble.call(this,evt)
        return this
    }
}

const reversedNames = {}

function objectSet(value:any): Observable{
    if(!value) value={}
    let facade = this.facade;
    for(let n in facade){
        let name = reversedNames[n] || n
        let prop:TObservable = facade[name]
        prop(value[n]);
    }
    this.value = value
    return this
}
function arraySet(value):Observable{
    if(!value) value=[]
    let facade = this.facade
    for(let i =0,j=value.length;i<j;i++){
        let item = facade[i]
        if(item) {item(value[i]);continue;}
        // item = createFromReactive(this.$itemSchema)
        this[i] = item
    }
    this.value = value
    this.length.setValue(value.length)
    return this
}
function update(src?:TObservableEvent):TObservableEvent{
    let value = this.value === Observable? this.old: this.value    
    if(this.value===Observable || this.value===this.old) return undefined;
    const evt:TObservableEvent = {
        value : value,
        old: this.old,
        src: src,
        sender: this
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


function objectUpdate(bubble?:boolean,src?:TObservableEvent):Observable{
    let evt:TObservableEvent = update.call(this,src)
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
function arrayUpdate(bubble?:boolean,src?:TObservableEvent):Observable{
    const evt = update.call(this,src)
    const lengthEvt = update.call(this.length,src)
    if(bubble!==false && evt){
        dispachBubble.call(this,evt)
    }
    if(bubble!==false && lengthEvt){
        dispachBubble.call(this.length,lengthEvt)
    }
    
    if(evt.cancel || lengthEvt.cancel) return this;
    let facade = this.$observable
    if(evt.old.length > evt.value.length){
        for (let i= 0, j= evt.value.length; i<j; i++){
            let item = facade[i](Observable)
            item.update(bubble,evt)
        }
        for(let i = evt.value.length,j=evt.old.length;i<j;i++){
            let item = facade[i](Observable)
            delete facade[i]
        }
    }
    return this
}

export class NodeDescriptor{
    tag?: string;
    content?: string;
    component?: any;
    attrs?: {[name:string]:any};
    children?: NodeDescriptor[];
    constructor(tag:string,attrs?: {[name:string]:any}){
        if(attrs===NodeDescriptor){
            this.content = tag;
        }else{
            this.tag = tag;
            this.attrs = attrs;
        }
    }
    appendChild(child:any):NodeDescriptor{
        const children = this.children || (this.children=[])
        if(child instanceof NodeDescriptor){
            children.push(child)
        }else children.push(new NodeDescriptor(child,NodeDescriptor))
        return this;
    }
}

export type TComponent = any

export function render(descriptor:NodeDescriptor,context:any,ownComponent:TComponent){

}


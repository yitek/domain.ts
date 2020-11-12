import * as YA from '../YA.core'
function basic(){
    return <grid class="grid"></grid>;
}
let self = {}
let vnodes = basic.call(self)
console.log('<grid class="grid"></grid>',vnodes)

//-------------------
function This(){
    return <grid class={this.css}></grid>;
}
let model = new YA.Schema();
let builder = YA.schemaBuilder(model);
vnodes = This.call(builder)
console.log('<grid class={this.css}></grid>',vnodes,model)

//-------------------
function Vars(){
    let [item,i] = YA.vars(2);
    return <grid class={this.css}><column for={{each:this.items ,as:item,index:i}}/></grid>;
}
model = new YA.Schema();
builder = YA.schemaBuilder(model)
vnodes = Vars.call(builder)
console.log('<grid class={this.css}></grid>',vnodes,model)
var fn :any= function(){}
Object.defineProperty(fn,'length',{enumerable:true,configurable:true,writable:false,value:'abc'})
debugger
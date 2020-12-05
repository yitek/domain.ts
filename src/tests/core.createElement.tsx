import * as YA from '../YA.core'
function basic(){
    return <grid class="grid"></grid>;
}
let self = {}
let vnodes = basic.call(self)
console.log('basic=> <grid class="grid"></grid>',vnodes)

//-------------------
function This(){
    return <grid class={this.css}></grid>;
}
let model = new YA.ModelSchema();
let builder = YA.schemaBuilder(model);
vnodes = This.call(builder)
console.log('This=> <grid class={this.css}></grid>',vnodes,model)

//-------------------
function Vars(){
    let [item,i] = YA.vars(2);
    return <grid class={this.css}><column for={{each:this.items ,as:item,index:i}}/></grid>;
}
model = new YA.ModelSchema();
builder = YA.schemaBuilder(model)
vnodes = Vars.call(builder)
console.log('Vars=> <grid class={this.css}></grid>',vnodes,model)


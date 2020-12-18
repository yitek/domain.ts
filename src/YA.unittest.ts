export class Logger{
    section(name,statement){
        console.group(name)
        try{
            statement()
        }finally{
            console.groupEnd()
        }
        return this
    }
    code(...args){console.log.apply(console,arguments);return this}
    success(...args){console.warn.apply(console,args);return this}
    error(...args){console.error.apply(console,arguments);return this}
    static default:Logger
}
Logger.default = new Logger()


const codeTrimRegx = /(^[;\s]+)|([;\s]+$)/g

export type TExecutable = {
    execute(logger:Logger,self?:any):any
}

class Statement implements TExecutable{
    constructor(public content:string){
    }
    execute(logger:Logger,self?:any):boolean{ return undefined }
}
class CodeStatement extends Statement{
    constructor(content:string){
        super(content.replace(codeTrimRegx,''))
    }
}

class AssertStatement extends Statement{
    assertCode:string
    constructor(content:string,public testMethod:()=>boolean){
        super(content)
        let code = testMethod.toString()
        const at = code.indexOf('{')
        const end = code.lastIndexOf('}')
        this.assertCode = code.substring(at+1,end).replace(/^\s*return /g,'')
    }
    execute(logger:Logger,self?:any):boolean{
        const rs = this.testMethod.call(self)
        if(rs) logger.success(this.content,this.assertCode)
        else logger.error(this.content,this.assertCode)
        return rs
    }
}

class AssertStatements implements TExecutable{
    asserts:AssertStatement[]
    constructor(asserts:{[message:string]:()=>boolean}){
        this.asserts=[]
        for(const msg in asserts) this.asserts.push(new AssertStatement(msg,asserts[msg]))
    }
    execute(logger:Logger,self?:any):any{
        const rs = []
        for(const i in this.asserts){
            const assertStatement = this.asserts[i]
            const assertRs = assertStatement.execute(logger,self)
            rs.push({result:assertRs,statement:assertStatement})
        }
        
        return rs
    }
    static fetch(asserts:any):AssertStatements{
        if(!asserts) return null
        if(asserts['--assert-statements--']) return asserts['--assert-statements--']
        const stat = new AssertStatements(asserts)
        Object.defineProperty(asserts,'--assert-statements--',{enumerable:false,configurable:false,writable:false,value:stat})
        return stat
    }
}

export class TestMethod implements TExecutable{
    statements:TExecutable[]
    constructor(public method:(ASSERT:(asserts:{[msg:string]:()=>boolean})=>any)=>any,public name?:string){
        this.statements = parseStatements(method)
    }
    execute(logger:Logger,self?:any):any{
        const statements = this.statements
        let hasError = false
        let at = 0
        let rs = []
        const ASSERT=(asserts:{[msg:string]:()=>boolean}):any=>{
            let statement:TExecutable
            while(true) {
                statement= statements[at++]
                if(statement instanceof CodeStatement){
                    rs.push(statement)
                    logger.code(statement.content)
                    continue
                }
                break
            }
            let assertStatements = AssertStatements.fetch(asserts)
            
            rs.push(assertStatements.execute(logger,self))
        }
        logger.section(this.name,()=>{
            this.method.call(self,ASSERT)
        })
        
        return {statement:this,result:rs}
    }
    static fetch(method:(ASSERT:(asserts:{[msg:string]:()=>boolean})=>any)=>any,name?:string):TestMethod{
        
        if(method && method['--test-method--']) return method['--test-method--']
        if(typeof method!=='function') return null
        const mtd = new TestMethod(method,name)
        Object.defineProperty(method,'--test-method--',{enumerable:false,configurable:false,writable:false,value:mtd})
        return mtd
    }
}

class TestClass implements TExecutable{
    proto:any;
    ctor:{new(...args)}
    name:string
    constructor(proto:any,ctor?:any){
        if(typeof proto==='function') {
            this.ctor = ctor = proto
            this.proto = ctor.prototype
        }else this.proto = proto
    }
    execute(logger:Logger,self?:any):any{
        if(!self) self = this.ctor?new this.ctor():this.proto
        const name = this.name || '匿名测试类'
        const rs = []
        logger.section(name,()=>{
            for(let n in self) {
                const testMethod = TestMethod.fetch(self[n],n)
                if(!testMethod)continue
                rs.push(testMethod.execute(logger,self))
            }
        })
        return {statement:this,result:rs}
    }
    static fetch(target:any,name?:string):TestClass{
        if(target && target['--test-class--']) return target['--test-class--']
        const t = typeof target
        let tc :TestClass
        if(t==='function') {
            tc = new TestClass(target.prototype,target)
            target = target.prototype
        }else if(t==='object'){
            tc = new TestClass(target)
        }
        Object.defineProperty(target,'--test-class--',{configurable:false,writable:false,enumerable:false,value:tc})
        return tc
    }
}

function parseStatements(fn:Function):any[]{
    if(fn['--statements--']) return fn['--statements--']
    let {name,code}=parseAssertName(fn.toString())
    const statements:TExecutable[] = []
    if(!name) return statements
    
    let start = 0
    let at0= start
    while(true){
        at0 = code.indexOf(name,at0)
        if(at0<0) {
            statements.push( new CodeStatement(code.substring(start)))
            break
        }
        let at = code.indexOf('(',at0)
        if(at<=0) {
            statements.push(new CodeStatement(code.substring(start)))
            break
        }
        const md = code.substring(at0+name.length,at).replace(codeTrimRegx,'')
        if(md) {
            at0 = at0+name.length
            continue
        }
        statements.push(new CodeStatement(code.substring(start,at0)))
        at = at+1
        const nextAt = parseStatement(code,at)
        if(nextAt!==undefined){
            statements.push(null)
            start = at0 = nextAt
        }else {
            statements.push(new CodeStatement(code.substring(start)))
            break
        }
    }
    Object.defineProperty(fn,'--statements--',{configurable:false,enumerable:false,writable:false,value:statements})
    return statements

}
function parseAssertName(code:string){
    let start = code.indexOf('(')
    let end = code.indexOf(')',start)
    const assertsFnName = code.substring(start+1,end)
    if(assertsFnName.indexOf(',')>=0) throw '不正确的测试函数，只能有一个参数:ASSERTS'
    start = code.indexOf('{',end)
    end = code.lastIndexOf('}')
    code = code.substring(start+1,end)
    return {name:assertsFnName,code}
}

function parseStatement(code:string,start:number):number{
    const subCode = code.substring(start)
    let at = start
    let branceCount = 1
    const beginCode = '('.charCodeAt(0)
    const endCode = ')'.charCodeAt(0)
    const quote = '"'.charCodeAt(0)
    const singleQuote = '\''.charCodeAt(0)
    let inStr:number = 0
    while(true){
        if(at===code.length) return undefined
        const c = code.charCodeAt(at++)
        if(inStr!==0 && inStr===c) {
            inStr =0
            continue
        }
        if(c===quote || c===singleQuote){
            inStr = c
            continue
        }
        if(c===beginCode){
            branceCount++
            continue
        }
        if(c===endCode){
            if(--branceCount===0) return at
        }

    }
}
function meta(testTarget,arg:any){
    const t = typeof arg
    if(t==='boolean') return arg===false?false:true
    if(t==='string') testTarget.name = arg
    if(t==='object'){
        if(arg.ignore) return false
        testTarget.name = arg.name
    }
}

const todos = []
export function testable(desp:any,test?){
    if(test!==undefined){
        const t = typeof test
        if(t==='function'){
            if(desp && (desp==='<class>' || desp.isClass)){
                const tc = TestClass.fetch(test,desp.name)
                if (meta(tc,desp)!==false) return addTodos(tc)
            }
            const tm = TestMethod.fetch(test)
            if(meta(tm,desp)!==false)  return addTodos(tm)
        }else if (t==='object'){
            const tc = TestClass.fetch(test)
            if(meta(tc,desp)!==false) return addTodos(tc)
        }throw '错误的参数'
    }
    
    return function(target,name?){
        if(desp===false) return
        if(desp && desp.ignore) return

        if(name===undefined){
            const tc = TestClass.fetch(target)
            if(meta(tc,desp)!==false) return todos.push(tc)
        }
        
        let fn = target[name]
        let tm = TestMethod.fetch(fn)
        meta(tm,desp)
    }
}
let tickTodo
function addTodos(executable:TExecutable){
    if (todos.length===0 && !tickTodo) {
        tickTodo = setTimeout(() => {
            if(todos.length){
                try {
                    let executable:TExecutable
                    while(executable = todos.shift()) executable.execute(Logger.default)
                } finally{
                    clearTimeout(tickTodo)
                    tickTodo=0
                }
                
            }
        }, 0);
    }
    todos.push(executable)
}


let tests=
{
    testA(ASSERTS){
        let a =1
        let b =2
        ASSERTS({
            'a与b要相等':()=>a===b
        })
        let c = 3
        ASSERTS({
            'c与a要相等':()=>c==a
        })
    }
}
//testable(true,tests)
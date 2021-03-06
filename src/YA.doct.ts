const codeTrimRegx = /(^[;\s]+)|([;\s]+$)/g
function parseStatements(fn:Function):string[]{
    if(fn['--statements--']) return fn['--statements--']
    let {name,code}=parseAssertName(fn.toString())
    const statements:string[] = []
    if(!name) return statements
    
    let start = 0
    let at0= start
    while(true){
        at0 = code.indexOf(name,at0)
        if(at0<0) {
            statements.push( code.substring(start))
            break
        }
        let at = code.indexOf('(',at0)
        if(at<=0) {
            statements.push(code.substring(start))
            break
        }
        const md = code.substring(at0+name.length,at).replace(codeTrimRegx,'')
        if(md) {
            at0 = at0+name.length
            continue
        }
        statements.push(code.substring(start,at0))
        at = at+1
        const nextAt = parseStatement(code,at)
        if(nextAt!==undefined){
            statements.push(null)
            start = at0 = nextAt
        }else {
            statements.push(code.substring(start))
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
function testTest(assert){
    let s = 1
    let y = 1
    assert(s,1,'s应该等于1')
    assert(y,2,'y应该等于2')
}
const statements = parseStatements(testTest)
console.log(statements)


class Section{
    title?: string
    contents: string[]
    notices: string[]

    caption(value:string){
        this.title = value;
        return this;
    }
    content(value:string){
        (this.contents || (this.contents=[])).push(value)
        return this;
    }
    notice(value:string){
        (this.notices || (this.notices=[])).push(value)
        return this;
    }
}
class Namespace extends Section{

}
class Usage extends Section{
    fn:(...args)=>any
    constructor(fn:(...args)=>any){
        super();
    }
}


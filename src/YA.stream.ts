
// stream([]).filter((item)=>item.isReadonly).asc().first()
export type TPipeOperation = (input,next,args0,arg1,arg2)=>void
export class Stream{
    constructor(data){
        if(data!==Stream) Object.defineProperty(this,'--',{enumerable:false,configurable:false,writable:false,value:data})
    }
    static extensions:{ctor:any,ops:any}[] =[]
}
export function stream(data:any,ops?){
    if(ops===undefined){
        for(const i in Stream.extensions){
            const ext = Stream.extensions[i]
            if(data instanceof ext.ctor) {
                ops = ext.ops
                break
            }
        }
        //if(!ops) ops = 
    }
    
    let streamCtor:{new(data:any):any} = ops['--pipe-ctor'] || ((ops)=>{
        const ctor = function(data){Object.defineProperty(this,'--',{enumerable:false,configurable:false,writable:false,value:data})} as any
        for (let n in ops) ((name,op,ctor)=>{
            ctor.prototype[name] = function(arg0,arg1,arg2){
                const stream:any = this;
                let isFinal,streamValue;
                const next = function(output,continuos?:boolean){
                    isFinal = continuos===false
                    streamValue = output
                }
                op.call(this,this['--'],next,arg0,arg1,arg2)
                if(isFinal) return streamValue
                return new streamCtor(streamValue)
            }
        })(n,ops[n],ctor)
        Object.defineProperty(ops,'--pipe-ctor',{enumerable:false,configurable:false,writable:false,value:ctor})
        return ctor
    })(ops)
    return new streamCtor(data)
    
}
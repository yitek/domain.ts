import {testable} from '../../YA.unittest'
import {disposable} from '../../YA.core'

export default testable('core.dispose',{
    disposable:(ASSERT)=>{
        const disposer = disposable({})
        ASSERT({
            "调用disposable的对象会自动生成$dispose函数":()=>typeof disposer.$dispose==='function'
        })
        let disposeInvoked1
        let disposeInvoked2
        disposer.$dispose(function(){disposeInvoked1=this})
        disposer.$dispose(()=>disposeInvoked2=this)
        disposer.$dispose()
        ASSERT({
            "可以通过$dispose(callback)附加释放后回调函数，该函数会在$dispose()调用时被依次调用":()=>disposeInvoked1 && disposeInvoked2,
            '回调函数的this指向disposable本身':()=>disposeInvoked1===disposer
        })

        disposer.$dispose(()=>disposeInvoked1=true)
        ASSERT({
            '已经释放的对象可以再追加释放回调，该回调函数会立即执行':()=>disposeInvoked1===true
        })
    }
})
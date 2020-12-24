import {testable} from '../../YA.unittest'
import {ATTACH, Observable, observable, Schema, TObservableChange} from '../../YA.core'

export default testable('core.observable',{
    '基础用法':(ASSERT)=>{
        // 创建一个可监听对象
        const ob = observable(12)
        ASSERT({
            '可以通过observable.isInstance来判断是否是可监听对象':()=>observable.isInstance(ob),
            '可以获取值':()=>ob()===12
        })
        // 监听变化
        let change:TObservableChange
        ob(ATTACH,(evt:TObservableChange)=>change = evt)
        // 赋值并立即触发监听
        ob(32,true)
        ASSERT({
            '获取的值为新值':()=>ob()===32,
            '监听函数被触发':()=>change!==undefined,
            '监听函数接收一个TObservableChange对象，记录了变化前的值与变化后的值':()=>change.old===12 && change.value === 32 && change.sender === ob
        })
        
    },
    '类型为对象的可观察对象':(ASSERT)=>{
        const now = new Date()
        const schema = new Schema({
            filters:{
                keyword:'yiy',
                createTime:{min:null,max:now}
            },
            pageIndex:1,
            pageSize:10
        })

        const ob = observable(schema)
        
        ASSERT({
            '有跟schema一样的结构':()=>ob.filters.keyword()==='yiy' && ob.filters.createTime.max()===now && ob.pageIndex() === 1 && ob.pageSize()===10
        })
        
    },
    '对象上的事件冒泡':(ASSERT)=>{
        const now = new Date()
        const ob = observable({
            filters:{
                keyword:'yiy',
                createTime:{min:null,max:now}
            },
            pageIndex:1,
            pageSize:10
        })
        let rootChange: TObservableChange
        ob.$subscribe((change:TObservableChange)=>rootChange = change,true)
        let filterChange :TObservableChange
        ob.filters.$subscribe((change:TObservableChange)=>{
            filterChange = change
            change.cancel = true
        },true)
        let keywordChange:TObservableChange
        ob.filters.keyword.$subscribe((change:TObservableChange)=>keywordChange = change,true)
        ob.filters.keyword('yi',true)
        ASSERT({
            '如果修改了属性值，所有上级对象都会接收到捕捉的事件':()=>keywordChange!==undefined && filterChange !==undefined ,
            '由于filters的捕捉函数设置了cancel，所以事件不再向上冒泡':()=>rootChange ===undefined
        })
        
        
    },
    '对象上的事件传播':(ASSERT)=>{
        const now = new Date()
        debugger
        const ob = observable({
            filters:{
                keyword:'yiy',
                createTime:{min:null,max:now}
            },
            pageIndex:1,
            pageSize:10
        })
        let rootChange: TObservableChange
        ob.$subscribe((change:TObservableChange)=>rootChange = change,true)
        let filterChangeCapture :TObservableChange
        ob.filters.$subscribe((change:TObservableChange)=>{
            filterChangeCapture = change
        },true)
        let filtersChange
        ob.filters.$subscribe((change:TObservableChange)=>{
            filtersChange = change
        })
        let createTimeChange:TObservableChange
        ob.filters.createTime.$subscribe((change:TObservableChange)=>{
            createTimeChange = change
            change.stop = true
        })
        let minChange:TObservableChange
        ob.filters.createTime.min.$subscribe((change:TObservableChange)=>minChange = change)
        debugger
        ob.filters({keyword:'yi',createTime:{min:'2020-12-24',max:now}})
        debugger
        ob.filters.$update(null)

        ASSERT({
            '修改了中间对象，捕获的监听器跟一般的监听器都会收到通知':()=>filtersChange!==undefined && filterChangeCapture !==undefined,
            '事件先向上传播，然后向下传播':()=>rootChange!==undefined && createTimeChange!==undefined
        })
        
        
    },
    '对象上的事件冒泡1':(ASSERT)=>{
        const now = new Date()
        const schema = new Schema({
            filters:{
                keyword:'yiy',
                createTime:{min:null,max:now}
            },
            pageIndex:1,
            pageSize:10
        })

        const ob = observable(schema)
        // 事件的向上传导(冒泡)
        let rootChange:TObservableChange
        ob.$subscribe((change:TObservableChange)=>rootChange = change)
        let filterChange:TObservableChange
        ob.filters.$subscribe((change:TObservableChange)=>filterChange)
        let keywordChange:TObservableChange
        ob.filters.keyword.$subscribe((change:TObservableChange)=>keywordChange = change)
        // 更新值，并立即刷新
       
        ob.filters.keyword('yi',true)
        
        
    }
})
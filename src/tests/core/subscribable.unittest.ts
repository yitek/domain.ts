import {testable} from '../../YA.unittest'
import {Disposiable, subscribable, Subscription} from '../../YA.core'

export default testable('core.subscribable',{
    '基本用法':(ASSERT)=>{
        const target:any = {}
        subscribable(target)
       
        let listenerEventArg1,listenerEventArg2
        function listener1(evt){
            listenerEventArg1 = evt
        }
        function listener2(evt){
            listenerEventArg2 = evt
        }
        target.$subscribe(listener1).$subscribe(listener2)
        const arg={}
        target.$publish(arg)

        ASSERT({
            '调用$publish后，监听函数会被调用':()=>listenerEventArg1!==undefined && listenerEventArg2!==undefined,
            '监听函数接收到参数为$publish传递的参数':()=>listenerEventArg1===arg && listenerEventArg1===arg
        })
        
    },
    '传递多个参数给监听函数':(ASSERT)=>{
        const target = new Subscription()
       
        let listenerEventArg1,listenerEventArg2,listenerEventArg3
        function listener(evt1,evt2,evt3){
            listenerEventArg1 = evt1
            listenerEventArg2 = evt2
            listenerEventArg3 = evt3
        }
        target.$subscribe(listener)
        target.$publish(5,3)
        ASSERT({
            '$publish可以通过第二个参数来传递第二个参数':()=>listenerEventArg1===5 && listenerEventArg2===3
        })
        
        target.$publish([11,22,33],subscribable.USEAPPLY)
        ASSERT({
            '$publish可以通过USEAPPLY指令来传递多个参数给监听函数':()=>listenerEventArg1===11 && listenerEventArg2===22 && listenerEventArg3 === 33
        })
    },
    '自动释放监听函数':(ASSERT)=>{
        const disposer:any = new Disposiable()
        disposer.count = 0
        disposer.callback = function(d) { this.count+=d }
        const target = new Subscription()
        target.$subscribe(function(d){disposer.callback(d)},undefined,disposer)
        target.$publish(14)
        disposer.$dispose()
        target.$publish(3)
        ASSERT({
            '将一个匿名函数作为监听器，订阅了target的事件':()=>disposer.count!==0,
            '当disposer被调用后，会自动取消该匿名函数的监听,callback成员函数不会再被调用':()=>disposer.count === 14
        })
    },
    '监听函数里的this':(ASSERT)=>{
        const target = new Subscription()
       
        let self1,self2
        function listener1(){ self1 = this }
        function listener2(){ self2 = this }
        const assignedSelf = {}
        target.$subscribe(listener1,assignedSelf)
        target.$subscribe(listener2)
        target.$publish()
        ASSERT({
            '$subscribe的第二个参数指定了监听函数的this指针':()=>self1 === assignedSelf,
            '如果不填写该参数，监听函数的this指针指向subscribable对象本身':()=>self2=== target
        })
    },
    '按条件执行监听函数':(ASSERT)=>{
        const target = new Subscription()
       
        let invoked1,invoked2
        function listener1(){ invoked1 = true }
        function listener2(){ invoked2 = true }
        target.$subscribe(listener1,1)
        target.$subscribe(listener2,2)
        target.$publish(undefined,(extra)=>extra===2)
        ASSERT({
            '$publish第三个参数可以指定一个过滤函数，$subscribe函数的第二个参数将作为extra变量传入该过滤函数，如果该过滤函数返回广义的false,那么对应的监听函数不会被执行':()=>!invoked1 && invoked2
        })
    },
    '终值':(ASSERT)=>{
        const target = new Subscription()
        let invoked1,invoked2
        function listener1(v){ invoked1 = v }
        target.$subscribe(listener1)
        target.$fulfill(20)
        function listener2(v){ invoked2 = v }
        target.$subscribe(listener2)
        ASSERT({
            '可以用$fulfill函数赋予该对象一个终值,赋予终值时，所有订阅的监听函数会被调用':()=>invoked1===20,
            '赋予终值后，$subscribe会被立即调用(不用调用$publish)，并将终值传递给监听函数':()=>invoked2===20
        })

        let ex1,ex2
        try{
            target.$fulfill(20)
        }catch(ex){ex1 = ex}
        try{
            target.$publish(30)
        }catch(ex){ex2 = ex}
        ASSERT({
            '拥有终值后，调用$fulfill/$publish会报错':()=>ex1!==undefined && ex2 !==undefined
        })

    }
})
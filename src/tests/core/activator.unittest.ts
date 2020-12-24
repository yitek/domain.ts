import {testable} from '../../YA.unittest'
import {Activator} from '../../YA.core'

export default testable('core.Activator',{
    '构造函数参数传递':(ASSERT)=>{
        function ClassA(age,gender){this.age = age;this.gender = gender}
        ClassA.prototype = {
            age:13,
            grow:function(){this.age++}
        }
        let objA = Activator.activate(ClassA)
        ASSERT({
            '创建出一个对象':()=>objA instanceof ClassA,
            '参数未指定':()=>objA.age ===undefined
        })

        objA = Activator.activate(ClassA,[12,'male'])
        ASSERT({
            '可以给activate的第二个参数传递数组,指定构造函数的参数':()=>objA.age===12 && objA.gender ==='male'
        })
        objA = Activator.activate(ClassA,{gender:'female'})
        ASSERT({
            'activate的第二个参数为对象时,会按对象的名字赋给构造函数的参数列表':()=>objA.gender==='female'
        })
        objA = Activator.activate(ClassA,13)
        ASSERT({
            'activate的第二个参数为非对象时,该参数会作为构造函数的第一个参数传递给构造函数':()=>objA.age===13
        })
    }
    ,'创建过程控制':(ASSERT)=>{
        const constructingRet = {ret:33}
        const ctorRet = {age:1}
        const constructedRet = {ret:33}
        const steps = []
        let ctorThis
        function ClassA(age,gender){
            ctorThis = this
            steps.push('ctor')
            return ctorRet
        }
        ClassA.prototype={age:44}
        let beforeInst,beforeArgs,beforeActivator,beforeRawArgs
        let afterInst,afterActivator
        let activator = Activator.fetch(ClassA)
        let rawArgs = {gender:'female',age:21}
        let objA = activator.createInstance(rawArgs,(inst,args,activator,raw)=>{
            beforeInst = inst,beforeArgs= args,beforeActivator = activator,beforeRawArgs = raw
            steps.push('constructing')
            return constructingRet
        },(inst,activator)=>{
            afterInst = inst
            afterActivator = afterActivator
            steps.push('constructed')
            return constructedRet
        })
        steps.push('ret')
        ASSERT({
            'constructing回调会在ctor调用之前被调用':()=>steps[0]==='constructing'
            ,'constructing收到的对象(第1参数)为ClassA的原型对象为原型创建的实例':()=>beforeInst.age === ClassA.prototype.age
            ,'constructing收到的参数列表(第2参数)为根据原始参数构建好的参数列表':()=>beforeArgs[0]===rawArgs.age && beforeArgs[1]===rawArgs.gender
            ,'constructing收到的构造器(第3参数)为当前类的构造器':()=>beforeActivator === Activator.fetch(ClassA)
            ,'constructing最后一个参数(第4参数)接收原始参数数据':()=>beforeRawArgs === rawArgs
        })
        ASSERT({
            '构造器将在constructing之后，constructed之前被调用':()=>steps[1]==='ctor',
            '构造器的this为constructing返回的对象':()=>ctorThis === constructingRet
        })
        ASSERT({
            'constructed将会在ctor之后，返回实例之前':()=>steps[2]==='constructed',
            'constructed接收的实例(第1参数)为ctor返回的对象':()=>afterInst === ctorRet,
            'constructed接收的activator(第二参数)为构造器本身':()=>afterActivator = activator
        })
        ASSERT({
            '经过以上所有过程后，才会返回最终实例':()=>steps[3]==='ret',
            'activate/createInstance返回的会是constructed返回的实例':()=>objA === constructedRet,
            '最终返回的实例依然是ClassA的实例': ()=>objA instanceof ClassA
        })
    }
})
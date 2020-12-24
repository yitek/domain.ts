import {testable} from '../../YA.unittest'
import {injectable,InjectScope} from '../../YA.core'

export default testable('core.injectable',{
    '注册与获取':(ASSERT)=>{
        function ClassA(age){this.age = age}
        // 创建一个注入容器
        const scope = new InjectScope('<ROOT>')
        // 注册一个类，且定义属性gender为注入属性
        scope.register('ClassA',ClassA).prop('gender')
        // 注册一个常量类
        scope.constant('gender','female')
        // 注册一个依赖工厂
        let factoryName,factoryScope,factoryContext
        scope.factory('age',(name,scope,context)=>{
            factoryName = name
            factoryScope = scope
            factoryContext = context
            return 34
        })
        const context = {'A':'123'}
        const inst = scope.resolve('ClassA',context)
        const inst1 = scope.resolve('ClassA',context)
        ASSERT({
            '从容器中获得实例':()=>inst instanceof ClassA && inst1 instanceof ClassA,
            '两次获取的ClassA不是同一个实例':()=>inst!==inst1,
            '构造函数总是会被注入':()=>inst.age === 34 && inst1.age ===34,
            '指定的属性会被注入':()=>inst.gender ==='female' && inst.gender ==='female'
        })
        ASSERT({
            '实例工厂方法中的name即为获取的实例名':()=>factoryName ==='age',
            '实例工厂方法中的scope就是当前的scope':()=>scope === factoryScope,
            '实例工厂方法中的context为resolve的第二个参数':()=>context === factoryContext
        })
    },
    '标注用法':(ASSERT)=>{
        // 指定属性为依赖注入
        @injectable(false)
        class ClassA{
            @injectable()
            age:number
            gender:string
            
            constructor(gender:string){
                this.gender = gender
            }
        }
        const scope = new InjectScope()
        scope.constant('age',12)
        scope.constant('gender','male')
        scope.register('s',ClassA)
        const instA = scope.resolve('s')
        ASSERT({
            '被指定的属性的值来自容器':()=>instA.age === 12,
            '构造函数不可注入，gender未赋值':()=>instA.gender ===undefined
        })
    },
    '层叠':(ASSERT)=>{
        let connDisposed = false
        function Connection(connstr){
            this.connstr= connstr
            this.$dispose = function(){
                connDisposed = true
            }
        }
        const scope1 = new InjectScope()
        scope1.constant('connstr','mysql')
        scope1.register('ctrlA',function(conn){this.conn = conn})
        const scope2 = scope1.createScope()
        scope2.constant('connstr','sqlserver')
        scope2.register('conn',Connection)
        const scope3 = scope2.createScope()
        scope3.constant('connstr','sqlite')
        const ctrl = scope3.resolve('ctrlA')
        scope1.$dispose()
        ASSERT({
            '所有依赖项的查找为层叠后查找，即下级的scope的值会覆盖上级的值，所有依赖项都是从调用resolve的scope开始查找':()=>ctrl.conn.connstr === 'sqlite',
            '父级scope释放，会引起子级scope释放操作,容器创建的对象也会被一并释放':()=> connDisposed===true
        })
    }
})
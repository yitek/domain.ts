import {testable} from '../../YA.unittest'
import {Schema,ModelTypes} from '../../YA.core'
testable('core.Schema',{
    '基础用法':(ASSERT)=>{
        const schemaValue = new Schema(12)
        ASSERT({
            '值类型模型架构':()=>schemaValue.$type === ModelTypes.value && schemaValue.$default===12
        })
        const obj = {'name':'yiy','gender':'male'}
        const schemaObj:any = new Schema(obj)
        let propCount = 0
        for(const propname in schemaObj) propCount++
        ASSERT({
            '对象类型模型架构':()=>schemaObj.$type === ModelTypes.object && schemaValue.$default!==obj,
            '带着2个属性的模型架构':()=>propCount==2,
            '每个属性的模型架构都赋予了默认值':()=>schemaObj.name.$type===ModelTypes.value && schemaObj.name.$default === obj.name
        })

        const arr = [{id:1},{id:2}]
        const schemaArr:any = new Schema(arr)
        ASSERT({
            '对象类型模型架构':()=>schemaArr.$type === ModelTypes.array && schemaArr.$default.length===2,
            '带着length':()=>schemaArr.length instanceof Schema,
            '$item表示每个元素的架构':()=>schemaArr.$item.$type=== ModelTypes.object && schemaArr.$item.id instanceof Schema
        })
    },
    '组合对象与路径':(ASSERT)=>{
        const data = {filters:{name:'yi'},rows:[{id:1,intrests:['football']}],pageIndex:1}
        const schema :any= new Schema(data,'<states>')
        
        ASSERT({
            '可以获得路径':()=>schema.filters.name.$dpath.toString()==='<states>/filters/name'
        })
        const name = schema.filters.name.$dpath.get(data,(name,data)=>{
            return data
        })
        ASSERT({'可根据路径获取数据':()=>name==='yi'
        })
    },
    '通过代理来构建schema':(ASSERT)=>{
        const proxy = Schema.proxy();
        const displayName = proxy.filters.profile.displayName
        const schema = proxy.$schema
        ASSERT({
            '通过代理可以构建数据架构':()=>schema.filters.profile.displayName instanceof Schema,
            '获取到的数据架构对象有正确的dpath':()=>displayName.$dpath.toString()==='filters/profile/displayName'
        })
    }
})
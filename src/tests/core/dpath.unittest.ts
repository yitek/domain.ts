import {testable} from '../../YA.unittest'
import {DPath} from '../../YA.core'

testable('core.dpath',{
    '基本用法':(ASSERT)=>{
        const data = {
            user:{
                name:'yiy'
            }
        }
        
        const username = DPath.getValue(data,'user/name')
        ASSERT({
            '通过数据路径获取数据值':()=>username ==='yiy'
        })
        DPath.setValue(data,'user/name','yi')
        ASSERT({
            '通过数据路径设置数据值':()=>data.user.name==='yi'
        })
    },
    '数据不完整也可以使用':(ASSERT)=>{
        const data:any = {
            user:{
                name:'yiy'
            }
        }
        const displayName = DPath.getValue(data, 'profile/displayName')
        ASSERT({'可获取不存在的对象上的属性，返回undefined':()=>displayName===undefined})
        DPath.setValue(data,'profile/displayName','yanyi')
        ASSERT({'也可以设置不存在的对象上的属性，会自动根据路径补全上级对象':()=>data.profile.displayName==='yanyi'})
    },
    '高级用法':(ASSERT)=>{
        const data:any = {
            user:{
                name:'yiy'
            }
        }
        const ctx = {'user':{displayName:'yanyi'}}
        const name = DPath.getValue(data,'~/user/displayName',{'~':ctx})
        ASSERT({'一级对象可以设置若干，并根据dpath的值选择':()=>name==='yanyi'})
        let getterName,getterTarget
        const getter = (name,target)=>{
            getterName = name
            getterTarget = target
            return ctx
        }
        const name1 = DPath.getValue(data,'~/user/displayName',getter)
        ASSERT({'get/set的最后一个参数可以为函数，该函数提供第一级树':()=>name1==='yanyi' && getterName==='~' && getterTarget===data})
    }
})
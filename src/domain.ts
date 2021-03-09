function array_exists(arr:any[],item:any):boolean{
    if(!arr) return false
    for(let i =0,j=arr.length;i<j;i++) if(arr[i]===item) return true
    return false
}
function array_once(arr:any[],item:any):boolean{
    if(!arr) return false
    for(let i =0,j=arr.length;i<j;i++) if(arr[i]===item) return false
    arr.push(item)
    return true
}
const trimRegx = /(^\s+)|(\s+$)/g
const trim = (s) =>s===null||s===undefined?"":s.toString().replace(trimRegx,"")
enum ReferenceTypes {
    one2One,
    one2Many,
    many2One,
    manyToMany
}
interface ReferenceOption {
    refType?:ReferenceTypes;
    uniqueName?:string;
    leftKey?:string;
    leftDomainName?:string;
    rightKey?:string;
    rightDomainName?:string;
    linkTbName?:string;
    linkLeftKey?:string;
    linkRightKey?:string;
    dumplicates?:{[name:string]:string}
}

enum ViewPermissions{
    disabled,
    masked,
    readonly,
    writable
}
enum DisplayLevels{
    xs,// 非常小的屏幕
    sm, // 768
    md, // 1024*768
    lg, //1366
    hg //非常大的
}
enum QueryTypes{
    none,
    eq,
    gt,
    gte,
    lt,
    lte,
    btwn
}
interface FieldOption{
    name?:string;

    /**
     * 显示名
     *
     * @type {string}
     * @memberof Field
     */
    displayName?:string;
    /**
     * 前端类型
     *
     * @type {string}
     * @memberof DomainFieldOptions
     */
    viewType?:string;

    /**
     * 数据类型
     *
     * @type {string}
     * @memberof DomainFieldOptions
     */
    dataType?:string;

    /**
     * 类型，可以只填写这个，推断出数据类型跟显示类型
     *
     * @type {string}
     * @memberof DomainFieldOptions
     */
    type?:string;

    /**
     * 验证器
     *
     * @type {[]}
     * @memberof DomainFieldOptions
     */
    validations?:{[validType:string]:any}

    reference: ReferenceOption;

    displayLevel:DisplayLevels|string

    permission:ViewPermissions|string

    queryType:QueryTypes|string

    css:string
}

interface DomainOption{
    name:string;
    tbName:string;
    extends:string[];
    fields:{[name:string]:FieldOption};
}

interface ValidResult {
    type:string
    message:string
}

let createXHR = function() {
    var XHR = [  //兼容不同浏览器和版本得创建函数数组
        function () { return new XMLHttpRequest () },
        function () { return new ActiveXObject ("Msxml2.XMLHTTP") },
        function () { return new ActiveXObject ("Msxml3.XMLHTTP") },
        function () { return new ActiveXObject ("Microsoft.XMLHTTP") }
    ]
    var xhr = null
    //尝试调用函数，如果成功则返回XMLHttpRequest对象，否则继续尝试
    for (var i = 0; i < XHR.length; i ++) {
        try {
            xhr = XHR[i]()
            createXHR = XHR[i]
        } catch(e) {
            continue  //如果发生异常，则继续下一个函数调用
        }
        break  //如果成功，则中止循环
    }
    return xhr  //返回对象实例
}
enum DomainStates{
    loading,
    loaded,
    completed,
    error
}
class Field{
    option:FieldOption
    name:string
    viewType:string
    dataType:string
    required:boolean
    displayName:string
    dumplicateKey:string
    dumplicateFrom:Field
    referenceDomain:Domain
    permission:ViewPermissions
    displayLevel:DisplayLevels
    queryType:QueryTypes
    css:string[]
    validate:(value)=>ValidResult
    constructor(opt:FieldOption,name:string,dumplicateKey?:string,dumplicateFrom?:Field){
        this.option = opt
        this.name = name
        this.css = []
        if(opt.css){
            let cs = opt.css.split(' ')
            for(let cls of cs){
                if(cls) array_once(this.css,cls)
            }
        }
        if(opt.validations && opt.validations.required){
            array_once(this.css,'required')
        }
        if(opt.viewType) this.viewType = opt.viewType
        if(opt.dataType) this.dataType = opt.dataType
        if(opt.displayName===undefined) this.displayName = name
        if(opt.permission!==undefined){
            if(typeof opt.permission==="string") this.permission = ViewPermissions[opt.permission]
            else this.permission = opt.permission
        }
        if(opt.displayLevel!==undefined){
            if(typeof opt.displayLevel==="string") this.displayLevel = DisplayLevels[opt.displayLevel]
            else this.displayLevel = opt.displayLevel
        }
        if(opt.queryType!==undefined){
            if(typeof opt.queryType==="string") this.queryType = QueryTypes[opt.queryType]
            else this.queryType = opt.queryType
        }
        this.dumplicateKey = dumplicateKey
        this.dumplicateFrom = dumplicateFrom
        if(dumplicateKey) return;
        if(opt.reference){
            this.referenceDomain = domains[opt.reference.rightDomainName]
            if(this.viewType===undefined){
                if(opt.reference.refType == ReferenceTypes.many2One || opt.reference.refType== ReferenceTypes.one2One){
                    this.viewType = "selector"
                }
            }
        }
        if(opt.validations){
            this.validate = (value):ValidResult=>{
                for(let n in this.option.validations){
                    let validation = validations[n]
                    let validOpt = this.option.validations[n]
                    let rs = validation(value,validOpt)
                    if(rs!==null) return {message:rs,type:n}
                }
            }
        }
        
    }
    
}
class Domain{
    name:string
    status:DomainStates
    option:DomainOption
    bases:Domain[]
    references:{[name:string]:{field:any,referenceDomain:Domain,referenceOption:ReferenceOption}}
    fields:{[propname:string]:Field}
    constructor(name:string){
        this.status = DomainStates.loading;
        Domain.load(name,(data,error)=>{
            if(error){
                this.status = DomainStates.error
                this.option = error as any as  DomainOption
            }else {
                this.status = DomainStates.loaded
                this.option = data
                for(let i =0,j=loadedDomainCallbacks.length;i<j;i++){
                    let callback = loadedDomainCallbacks.shift()
                    callback(this)
                }
                retriveDomainReferences(this,makeDomainFields)
            }
        })
    }

    static retrive(name:string){
        let dm:Domain = domains[name]
        if(!dm) dm = domains[name] = new Domain(name)
        return dm
    }

    static load(name:string,callback:(data,error)=>any){
        ajax({
            url:name,
            done:callback
        })
    }
}

let loadedDomainCallbacks=[]
let domains :{[name:string]:Domain} = {}


function ajax(opts){
    let xhr = createXHR();
    let method = opts.method || "GET"
    let async = opts.async !==false
    let data = null
    let url = opts.url
    
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4){
            if(xhr.status==200){
                ajaxDone(xhr,undefined,opts)
            }else {
                let text ="";
                try{text = xhr.responseText}catch{}
                ajaxDone(xhr,{message:"Server response error",status:xhr.status,text:text},opts)
            }
        }
    }
    xhr.onerror = function(e){ ajaxDone(xhr,e,opts) }
    xhr.open(method,url,async);
    xhr.send(data);
}
let blockCommetInJsonRegx = /\/\/[^\n]*\n/g
function ajaxDone(xhr,error,opts){
    let result;
    if(error===undefined) {
        try{
            result = xhr.responseText;
            result = result.replace(blockCommetInJsonRegx,"\n")
            if(opts.type==='json') result = JSON.parse(result);
        }catch(e){
            error = e;
        }
    }

    if(error && opts.error) opts.error.call(xhr,error)
    if(result!==undefined && opts.success) opts.success.call(xhr,result)
    if(opts.done) opts.done.call(xhr,result,error)
    
}

function retriveDomainReferences(domain:Domain,callback){
    let bases =[]
    if(domain.option.extends){
        for(let basename of domain.option.extends){
            let base = domains[basename]
            if(base.status !== DomainStates.loaded) {
                loadedDomainCallbacks.push(()=>retriveDomainReferences(domain,callback))
                return
            }
            bases.push(base)
        }
    }
    let references = {}
    if(domain.option.fields){
        for(let fname in domain.option.fields){
            let field = domain.option.fields[fname]
            if(field.reference){
                let refDomain = Domain.retrive(field.reference.rightDomainName)
                if(refDomain.status !== DomainStates.loaded) {
                    loadedDomainCallbacks.push(()=>retriveDomainReferences(domain,callback))
                    return
                }
                references[fname] = {
                    field:field,
                    referenceDomain: refDomain,
                    referenceOption: field.reference 
                }
            }
        }
    }
    domain.bases = bases
    domain.references = references
    callback(domain)
}

function makeDomainFields(domain:Domain):{[propname:string]:Field}{
    if(domain.fields) return domain.fields
    let fields = {}
    if(domain.bases && domain.bases.length){
        for(let baseDomain of domain.bases){
            let baseProps = makeDomainFields(baseDomain);
            for(let n in baseProps){
                fields[n] = baseProps[n]
            }
        }
    }
    if(domain.option.fields){
        for(let n in domain.option.fields){
            let fieldOpt = domain.option.fields[n]
            let field = new Field(fieldOpt, n)
            fields[field.name] = field
            if(field.referenceDomain && fieldOpt.reference.dumplicates){
                for(let meName in fieldOpt.reference.dumplicates){
                    let dumpField = new Field(fieldOpt,meName,fieldOpt.reference.dumplicates[meName],field)

                }
            }
        }
    }
    return domain.fields = fields;
}

interface FieldViewOption{
    nm?:string
    css?:string
    pm?:ViewPermissions | string
    lv?:DisplayLevels | string
    qry?:QueryTypes | string
    gp?:string;
}

interface DomainViewOption{
    url?:string
    permission:string | ViewPermissions
    includes?:any
    excludes?:[]
}

interface DetailViewOption extends DomainViewOption{
    groups:[]
    tabs:[]
}

interface Control{
    element:any
    wrap?:any
    getValue:()=>any
    setValue:(val:any)=>any
    onchange?:(value,fieldView:FieldView)=>any
}
interface ControlFactory{
    readonly(fieldView:FieldView,data):Control
    writable(fieldView:FieldView,data):Control
}
enum RenderKinds{
    all = 0,
    noInputTips = 1,
    noIntroduce = 1<<1,
    noValidates = 1<<2,
    controlOnly = 1<<3 | noInputTips | noIntroduce
}

class FieldView{
    field:Field
    permission?:ViewPermissions
    displayLevel?:DisplayLevels
    queryType?:QueryTypes
    group?:any
    domainView:any
    name:string
    displayName:string
    controlFactory:ControlFactory
    css:string
    constructor(view:DomainView,field:Field){
        this.domainView = view
        this.field = field        
        this.name = field.name
        this.displayName = field.displayName || field.name
        this.controlFactory = controlFactories [field.viewType]
        if(!this.controlFactory) this.controlFactory = controlFactories["text"]
        
        if(!array_exists(this.field.css,this.name)) this.css =this.name
    }
    init(viewOpt:FieldViewOption):FieldView{
        if(viewOpt.pm!==undefined) {
            this.permission = typeof viewOpt.pm==='string'?ViewPermissions[viewOpt.pm]:viewOpt.pm
        }

        if(viewOpt.lv!==undefined) {
            this.displayLevel = typeof viewOpt.lv==='string'?DisplayLevels[viewOpt.lv]:viewOpt.lv
        }
        if(viewOpt.qry!==undefined) {
            this.queryType = typeof viewOpt.qry==='string'?QueryTypes[viewOpt.qry]:viewOpt.qry
        }
        if(viewOpt.css){
            let css = this.css.split(' ')
            let added = viewOpt.css.split(' ')
            for(let c of added) if(c) array_once(css,c)
            this.css = css.join(' ')
        }

        return this
    }

    render(data:any,permission?:ViewPermissions,kind?:RenderKinds):Control{
        if(permission===undefined) permission = this.permission
        if(permission===undefined) permission = ViewPermissions.readonly
        let permName = ViewPermissions[permission];
        let ctrlGenerator = this.controlFactory[permName]
        if(!ctrlGenerator) ctrlGenerator = defaultControlFn
        let ctrl:Control = ctrlGenerator(this,data)
        let wrap =ctrl.wrap = document.createElement("div")
        wrap.className = ViewPermissions[permission] + " " + this.css
        if(kind===RenderKinds.controlOnly){
            wrap.appendChild(ctrl.element)
            return ctrl
        }
        let label:any = document.createElement('label')
        wrap.appendChild(label)
        label.for = this.name
        label.innerText = this.displayName
        wrap.appendChild(ctrl.element)
        if(kind !==undefined && !(kind & RenderKinds.noValidates) && this.field.validate){
            ctrl.onchange = (value,field)=>{
                let valid = field.field.validate(value)
                if(valid) {
                    let validCss = " valid-error-" + valid.type
                    wrap.className.replace(validSuccessRegx,"").replace(validErrorRegx,"")
                    wrap.className += validCss
                }
            }
        }
        return ctrl
    }
    
}
const validErrorRegx = /\s*valid\-error\-[a-zA-Z0-9_]+\s*/g
const validSuccessRegx = /\s*valid\-success\s*/g
class DomainView{
    fieldViews:FieldView[]
    permission:ViewPermissions
    option:DomainViewOption
    domain:Domain
    name:string
    constructor(name:string,option:DomainViewOption,domain:Domain){
        this.option = option
        this.domain = domain
        this.name = name
        if(option.permission!==undefined){
            this.permission = typeof option.permission==='string'?ViewPermissions[option.permission]:option.permission
        }
        let fieldViews:FieldView[] = []
        if(!option.includes){
            for(let n in domain.fields){
                fieldViews.push(new FieldView(this,domain.fields[n]))
            }
        }else{
            includeFields(this,fieldViews,option.includes,null)
        }
        if(option.excludes){
            for(let i =0,j=fieldViews.length;i<j;i++){
                let fldview = fieldViews.shift()
                let hasIt=false
                for(let n of option.excludes) if(n===fldview.name) {hasIt=true;break}
                if(!hasIt)fieldViews.push(fldview)
            }
        }
    }
}

function includeFields(view:DomainView,fieldViews:FieldView[],includes:any,names:string[]){
    let isArr = (includes as any).push
    for(let i in includes){
        let cfg = includes[i]
        let fldViewOpt:FieldViewOption= {}
        if(typeof cfg==='string'){
            if(isArr){
                fldViewOpt.nm = cfg
            }else{
                fldViewOpt.nm = i
                let v = ViewPermissions[cfg]
                if(v!==undefined) {
                    fldViewOpt.pm = v
                }else {
                    v = DisplayLevels[cfg]
                    if(v!==undefined) fldViewOpt.lv = v
                    else {
                        v = QueryTypes[cfg]
                        if(v!==undefined) fldViewOpt.qry = v
                    }
                }
            }
        }else if(cfg){
            fldViewOpt = cfg
        }
        let fieldView :FieldView
        for(let v of fieldViews){
            if(v.name===fldViewOpt.nm){fieldView = v;break;}
        }
        if(!fieldView) {
            let field = view.domain.fields[fldViewOpt.nm]
            if(field){
                fieldView = new FieldView(view,field)
                fieldViews.push(fieldView);
                if(names){
                    let hasIt = false
                    for(let n of names) if(n ===fieldView.name) {hasIt=true;break}
                    if(!hasIt) names.push(fieldView.name)
                }
            }
        }
        fieldView.init(fldViewOpt)
    }
}

class DetailView extends DomainView{
    groups:string[]
    tabs:string[]
    constructor(name:string,option:DetailViewOption,domain:Domain){
        super(name,option,domain)
        this.groups = option.groups
        this.tabs = option.tabs
    }
}

let controlFactories:{[name:string]:ControlFactory} = {}

controlFactories.text = {
    readonly:function(fieldView:FieldView,data:any):Control{
        let elem:any = document.createElement("span")
        //elem.className = "readonly " + fieldView.name
        elem.value = data[fieldView.name]
        elem.innerHTML = elem.value
        return {
            element:elem,
            getValue:()=>elem.value,
            setValue:(val)=>{data[fieldView.name] = elem.value=val;elem.innerHTML = val}
        }
    },
    writable: function(fieldView:FieldView,data:any):Control{
        let elem:any = document.createElement("input")
        elem.type = "text"
        //elem.className = "readonly " + fieldView.name
        elem.value = data[fieldView.name]
        let api:Control =  {
            element: elem,
            getValue:()=>elem.value,
            setValue:(val)=>elem.value = data[fieldView.name] = val,
            onchange: null
        }
        let tick=0
        attach(elem,"blur",()=>{
            if(tick) clearTimeout(tick);tick = 0
            data[fieldView.name] = elem.value
            if(api.onchange) api.onchange.call(elem,elem.value,fieldView)
        })
        
        attach(elem,"keyup",()=>{
            if(tick) clearTimeout(tick)
            tick = setTimeout(() => {
                if(tick) clearTimeout(tick);tick = 0
                data[fieldView.name] = elem.value
                if(api.onchange) api.onchange.call(elem,elem.value,fieldView)
            }, 200);
        })
        return api
    }

}
const defaultControlFn = controlFactories.text.readonly

let attach = function(elem,evt,callback){
    if(elem.addEventListener){
        attach = function(elem,evt,callback){
            elem.addEventListener(evt,callback,false)
        }
    }else if(elem.attachEvent){
        attach = function(elem,evt,callback){
            elem.attachEvent('on' +evt,callback)
        }
    }
}

const validations :{[type:string]:(value,opt)=>string} ={}
validations.required = (value,opt):string=>{
    if(!opt) return value?null:'必填'
    let cmd:string
    let message :string
    if(typeof opt==='string'){
        cmd = opt
        message = "必填"
    } 
    else {
        if(opt.trim) cmd = "trim"
        if(opt.notEmpty) cmd = 'notEmpty'
        message = opt.message || '必填'
    }
    if(cmd==='trim'){
        return trim(value)?null:message
    }
    if(cmd==='notEmpty'){
        let rs = true
        if(value){
            if(typeof value==='string') return trim(value)?null:message
            for(let n in value) return null 
            return message
        }else return message
    }
    return value?null:'必填'
}
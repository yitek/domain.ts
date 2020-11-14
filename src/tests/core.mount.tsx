import * as YA from '../YA.core'

function view(states){
    function inputChanged(evt){
        states.inputText = evt.target.value
    }
    return <div><input type='text' value={states.inputText} onkeypress={inputChanged}/><span>{states.inputText}</span></div>
}

YA.mount(document.body,view)

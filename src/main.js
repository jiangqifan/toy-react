import { createElement, render, Component } from './toy-react'

class MC extends Component {
    constructor () {
        super()
        this.state = {
            a: 1,
            b: 2,
        }
    }
    render () {
        return <div>
            <span>{this.state.a}</span>
            <button onClick={()=>{
                console.log('clicked')
                this.state.a ++;
                this.reRender()
            }}>添加</button>
            {this.children}
        </div>
    }
}

const t = <MC><div class='a'>a</div></MC>
render(t, document.body)
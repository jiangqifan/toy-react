import { createElement, render, Component } from './toy-react'

class MC extends Component {
    render () {
        return <div>
            abcdeft
            {this.children}
        </div>
    }
}

const t = <MC><div class='a'>a</div></MC>
render(t, document.body)
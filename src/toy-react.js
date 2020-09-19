
const RENDER_TO_DOM = Symbol('render to dom')

export class Component {
    constructor () {
        this.state = {}
        this.props = Object.create(null)
        this.children = []
    }
    
    get vdom () {
        return this.render().vdom
    }
    setAttribute (key, value) {
        this.props[key] = value
    }
    appendChild (child) {
        this.children.push(child)
    }
    setState (state) {
        const merge = (oldState, newState) => {
            for (const key in newState) {
                if (null == oldState[key] || typeof oldState[key] !== 'object' || null == newState[key] || typeof newState[key] !== 'object') {
                    oldState[key] = newState[key]
                    continue
                }
                merge(oldState[key], newState)
            }
        }
        merge(this.state, state)
        this[RENDER_TO_DOM](this._range)
    }
    [RENDER_TO_DOM] (range) {
        this._range = range
        this.vdom[RENDER_TO_DOM](range)
    }
    appendChild (c) {
        this.children.push(c)
    }
    render () {
        throw new Error('render not implemented')
    }
}

class ElementWrapper extends Component{
    constructor (tagName) {
        super()
        this.type = tagName
    }
    get vdom () {
        return this
    }
    [RENDER_TO_DOM] (range) {
        const dom = document.createElement(this.type)
        for (const key in this.props) {
            const value = this.props[key]
            if (key.match(/^on([\s\S]+)$/)) {
                const eventName = RegExp.$1.replace(/^[\s\S]/g, e=>e.toLowerCase())
                dom.addEventListener(eventName, value)
            }
            if (key == 'className') {
                dom.setAttribute('class', value)
            } else {
                dom.setAttribute(key, this.props[key])
            }
        }

        for (const child of this.children) {
            const childRange = document.createRange()
            childRange.setStart(dom, dom.childNodes.length)
            childRange.setEnd(dom, dom.childNodes.length)
            child.vdom[RENDER_TO_DOM](childRange)
        }
        range.deleteContents()
        range.insertNode(dom)
    }
}

class TextWrapper {
    constructor (content) {
        this.type = '#text'
        this.content = content
    }
    get vdom () {
        return this
    }
    [RENDER_TO_DOM](range) {
        const dom = document.createTextNode(this.content)
        this._range = range
        range.deleteContents()
        range.insertNode(dom)
    }

}


export function createElement (type, attributes, ...children) {
    let e
    if (typeof type === 'string') {
        e = new ElementWrapper(type)
    } else {
        e = new type
    }

    for (let key in attributes) {
        e.setAttribute(key, attributes[key])
    }

    function insertChildren (children) {
        for (let child of children) {
            if (typeof child === 'string' || typeof child === 'number') {
                child = new TextWrapper(child)
            }
            if ( typeof child === 'object' && child instanceof Array) {
                insertChildren(child)
            } else {
                e.appendChild(child)
            }
        }
    }
    insertChildren(children)
    return e
}

export function render (component, parentElement) {
    const range = document.createRange()
    range.setStart(parentElement, 0)
    range.setEnd(parentElement, parentElement.childNodes.length)
    range.deleteContents()
    component[RENDER_TO_DOM](range)
}
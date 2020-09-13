class ElementWrapper {
    constructor (tagName) {
        this.root = document.createElement(tagName)
    }
    setAttribute(key, value) {
        this.root.setAttribute(key, value)
    }
    appendChild(child) {
        this.root.appendChild(child.root)
    }
}

class TextWrapper {
    constructor (content) {
        this.root = document.createTextNode(content)
    }

}

export class Component {
    constructor () {
        this.state = {}
        this.props = {}
        this._root = null
        this.children = []
    }
    setAttribute (key, value) {
        this.props[key] = value
    }
    appendChild (c) {
        this.children.push(c)
    }
    get root () {
        if (!this._root) {
            const r = this.render()
            if (r) {
                this._root = r.root
            }
        }
        return this._root
    }
    render () {
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
            if (typeof child === 'string') {
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
    parentElement.appendChild(component.root)
}
var S = require('pull-stream')
var scan = require('pull-scan')
var ViewStream = require('../')
var html = require('yo-yo')

var root = document.createElement('div')
document.body.appendChild(root)

var viewStream = ViewStream(root, myView)

S(
    viewStream,
    scan(function (state, ev) {
        if (ev === 'plus') return { count: state.count + 1 }
        return state
    }),
    viewStream
)

viewStream.source.push({ count: 0 })

function myView (state, push) {
    return html`<div>
        <div>${state.count}</div>
        <button onclick=${push.bind(null, 'plus')}>plus 1</button>
    </div>`
}


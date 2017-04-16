# yo pull stream

Turn your view into a duplex stream

## install

    $ npm install yo-pull-stream

## example

```js
var S = require('pull-stream')
var scan = require('pull-scan')
var ViewStream = require('../')
var html = require('yo-yo')

var root = document.createElement('div')
document.body.appendChild(root)

// viewStream is a duplex stream
var viewStream = ViewStream(root, myView, function onEnd (err) {
    if (err) return console.log('error', err)
    console.log("it's over")
})

S(
    viewStream,
    scan(function (state, ev) {
        if (ev === 'plus') return { count: state.count + 1 }
        return state
    }),
    viewStream
)

// push an initial event so our view renders
viewStream.source.push({ count: 0 })

function myView (state, push) {
    // call push to publish an event
    return html`<div>
        <div>${state.count}</div>
        <button onclick=${push.bind(null, 'plus')}>plus 1</button>
    </div>`
}
```

You can pass in a render function. This should work with any function like `morphdom`:

```js
var ViewStream = require('yo-pull-stream/render-loop')(myRenderFunction)
var viewStream = ViewStream(root, myView, function onEnd (err) {
})
```


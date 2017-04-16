# yo pull stream

Turn your view into a duplex stream

## install

    $ npm intall yo-pull-stream

## example

```js
var S = require('pull-stream')
var scan = require('pull-scan')
var ViewStream = require('../')
var html = require('yo-yo')

var root = document.createElement('div')
document.body.appendChild(root)

// viewStream is a duplex stream
var viewStream = ViewStream(root, myView)

// you can have multiple subsribers
var anotherSourceStream = viewStream.listen()  

S(
    viewStream,
    scan(function (state, ev) {
        if (ev === 'plus') return { count: state.count + 1 }
        return state
    }),
    viewStream
)

// initial event so our view renders
viewStream.source.push({ count: 0 })

function myView (state, push) {
    // call push to publish an event
    return html`<div>
        <div>${state.count}</div>
        <button onclick=${push.bind(null, 'plus')}>plus 1</button>
    </div>`
}
```


var S = require('pull-stream')
var test = require('tape')
var scan = require('pull-scan')
var ViewStream = require('../')
var html = require('yo-yo')

var root = document.createElement('div')
document.body.appendChild(root)

test('yo render loop', function (t) {
    t.plan(4)
    var viewStream = ViewStream(root, myView)
    var i = 0

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
        if (state.count < 4) {
            process.nextTick(function () {
                push('plus')
            })
            t.equal(state.count, i++, 'should subscribe to changes')
        } else viewStream.source.end()

        return html`<div>
            <div>${state.count}</div>
            <button onclick=${push.bind(null, 'plus')}>plus 1</button>
        </div>`
    }

})

test('error', function (t) {
    t.plan(1)
    var _err = new Error('test')
    var viewStream = ViewStream(root, myView, function onEnd (err) {
        t.equal(err, _err)
    })

    S(
        viewStream,
        S.map(function (ev) {
            throw(_err)
        }),
        viewStream
    )

    viewStream.source.push({ count: 0 })

    function myView (state, push) {
        return html`<div>
            test
        </div>`
    }
})


var update = require('yo-yo').update
var Notify = require('pull-notify')
var Pushable = require('pull-pushable')
var S = require('pull-stream/pull')
S.drain = require('pull-stream/sinks/drain')

function RenderLoop (root, view) {
    if (!view) return function (view) {
        return RenderLoop(root, view)
    }

    var p = Pushable()
    var source = Notify()
    S( p, S.drain(source, source.end) )
    var tree

    return {
        source: p,
        listen: source.listen,
        sink: S.drain(function onEvent (state) {
            var newTree = view(state, p.push)
            if (!tree) {
                tree = newTree
                return root.appendChild(tree)
            }
            update(tree, newTree)
        }, function onEnd (err) {
            if (err) return p.end(err)
            p.end()
        })
    }
}

module.exports = RenderLoop


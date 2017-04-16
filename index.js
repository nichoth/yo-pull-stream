var update = require('yo-yo').update
var Pushable = require('pull-pushable')
var S = require('pull-stream/pull')
S.drain = require('pull-stream/sinks/drain')
S.through = require('pull-stream/throughs/through')

function RenderLoop (root, view) {
    if (!view) return function (view) {
        return RenderLoop(root, view)
    }

    var p = Pushable()
    var tree

    return {
        source: p,
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


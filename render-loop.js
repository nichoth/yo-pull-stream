var Pushable = require('pull-pushable')
var S = require('pull-stream/pull')
S.drain = require('pull-stream/sinks/drain')
S.through = require('pull-stream/throughs/through')

module.exports = function (update) {
    return function RenderLoop (root, view, onEnd) {
        if (!view) return function (view, onEnd) {
            return RenderLoop(root, view, onEnd)
        }

        var p = Pushable(onEnd)
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
            }, function _onEnd (err) {
                p.end(err)
            })
        }
    }
}


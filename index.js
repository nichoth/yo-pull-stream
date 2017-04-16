var update = require('yo-yo').update
var Notify = require('pull-notify')
var S = require('pull-stream/pull')
S.drain = require('pull-stream/sinks/drain')
S.through = require('pull-stream/throughs/through')

function RenderLoop (root, view) {
    if (!view) return function (view) {
        return RenderLoop(root, view)
    }

    var source = Notify()
    var _source = function () {
        return source.listen.apply(source, arguments)
    }
    _source.end = source.end
    _source.push = source
    var tree

    return {
        source: source.listen(),
        listen: source.listen,
        sink: S.drain(function onEvent (state) {
            var newTree = view(state, source)
            if (!tree) {
                tree = newTree
                return root.appendChild(tree)
            }
            update(tree, newTree)
        }, function onEnd (err) {
            if (err) return source.end(err)
            source.end()
        })
    }
}

module.exports = RenderLoop


var update = require('yo-yo').update
var Loop = require('./render-loop')

module.exports = function (root, view, onEnd) {
    return Loop(update)(root, view, onEnd)
}


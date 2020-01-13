const { model } = require ('mongoose')
const { note, section, board, user } = require('./schemas')

module.exports = {
    Note: model('Note',note),
    Section: model('Section', section),
    Board: model('Board', board),
    User: model('User', user)
}
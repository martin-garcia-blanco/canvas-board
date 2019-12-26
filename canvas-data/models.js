const { model } = require ('mongoose')
const { note, section, board } = require('./schemas')

module.exports = {
    Note = model('Note',note),
    Section = model('Section', section),
    Board = model('Board', board)
}
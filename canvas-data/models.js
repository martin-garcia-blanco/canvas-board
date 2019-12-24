const { model } = require ('mongoose')
const { note, section } = require('./schemas')

module.exports = {
    Note = model('Note',note),
    Section = model('Section', section)
}
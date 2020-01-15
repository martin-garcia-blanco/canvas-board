const { Schema }= require ('mongoose')
const Note = require('./note')

module.exports = new Schema({
    name: {
        type: String,
        required: true
    },

    notes: {
        type: [Note],
        required: true,
        default: []
    }
})
const { Schema }= require ('mongoose')
const Note = require('./note')

module.exports = new Schema({
    name: {
        type: String,
        require: true
    },

    notes: {
        type: [Note],
        require: true,
        default: []
    }
})
const { Schema, ObjectId } = require('mongoose')

module.exports = new Schema({
    name:{
        type: String,
        default: 'New Board'
    },
    sections:{
        type: [ObjectId],
        ref: 'Section',
        default: []
    }
})
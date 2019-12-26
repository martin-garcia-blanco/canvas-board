const { Schema, ObjectId } = require('mongoose')

module.exports = new Schema({
    name:{
        type: String,
        default: 'New Board',
        require: true
    },
    sections:{
        type: [ObjectId],
        ref: 'Section',
        default: []
    }
})
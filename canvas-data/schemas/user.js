const { Schema, ObjectId } = require('mongoose')
const { validator: { isEmail } } = require('canvas-utils')

module.exports = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: isEmail
    },
    board: {
        required: true,
        type: ObjectId,
        ref: 'Board'
    }
})
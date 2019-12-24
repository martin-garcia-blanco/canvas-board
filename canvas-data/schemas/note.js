const { Schema }= require ('mongoose')

module.exports = new Schema({
    text: {
        type: String,
        require: true
    },

    creationDate: {
        type: Date,
        require: true,
    }
})
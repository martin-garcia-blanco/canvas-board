const { models:{ Board } } = require('canvas-data')
const { validator, errors: {ConflictError} } = require('canvas-utils')

module.exports = function(){
    return (async() => {
        const board = await Board.find()
        if(Board) throw new ConflictError('board already exists')

        await Board.create()
    })()
}
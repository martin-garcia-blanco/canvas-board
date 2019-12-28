const { models:{ Board } } = require('canvas-data')
const { errors: {ConflictError} } = require('canvas-utils')

/**
 * The function checks if exist a Border
 * If exists throw a new Conflict error,
 * If not exists creates a new one
 */
module.exports = function(){
    return (async() => {
        const board = await Board.find()
        if(board.length>0) throw new ConflictError('board already exists')

        await Board.create({})
    })()
}
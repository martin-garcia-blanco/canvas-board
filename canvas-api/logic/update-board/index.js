const { ObjectId, models:{ Board } } = require('canvas-data')
const { validator, errors:{ NotFoundError, ContentError, ConflictError } } = require('canvas-utils')

/**
 * The function checks if exist a board
 * and update his name
 * 
 * @param {ObjectId} boardId 
 * @param {String} boardName 
 */
module.exports = function(boardId, boardName){
    if(!ObjectId.isValid(boardId)) throw new ContentError(`${boardId} is not a valid id`)
    
    validator.string(boardName)
    validator.string.notVoid(boardName, 'boardName')

    return (async () => {
        const board = await Board.findById(boardId)
        if(!board) throw new NotFoundError(`board with id ${boardId} not found`)

        await Board.updateOne({_id : boardId}, {name: boardName} )
    })()
}
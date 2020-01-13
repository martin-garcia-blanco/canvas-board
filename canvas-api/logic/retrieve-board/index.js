const { models:{ Board }, ObjectId } = require('canvas-data')
const { errors: { NotFoundError, ContentError }, validator } = require('canvas-utils')

/**
 * The function checks if exist a Board with received id
 * If exists return it, else throw an error
 * 
 * @param {ObjectId} boardId
 * 
 */
module.exports = function(boardId){
    validator.string(boardId)
    validator.string.notVoid('boardId', boardId)
    if(!ObjectId.isValid(boardId)) throw new ContentError(`${boardId} is not a valid id`)

    return (async() => {
        let board = await Board.findById(boardId)
        if(!board) throw new NotFoundError(`board with id ${boardId} not found`)

        const result = {name: board.name, sections: board.sections, id: board.id}
        return result
    })()
}
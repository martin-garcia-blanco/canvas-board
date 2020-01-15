const { models:{ Board, User }, ObjectId } = require('canvas-data')
const { errors: { NotFoundError, ContentError }, validator } = require('canvas-utils')

/**
 * The function checks if exist a Board with received id
 * If exists return it, else throw an error
 * 
 * @param {ObjectId} boardId
 * 
 */
module.exports = function(userId){
    validator.string(userId)
    validator.string.notVoid('userId', userId)
    if(!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid id`)

    return (async() => {
        const user = await User.findById( userId )
        if(!user) throw new NotFoundError(`user with id ${userId} not found`)

        const boardId = user.board[0]

        const board = await Board.findById(boardId)
        if(!board) throw new NotFoundError(`board with id ${boardId} not found`)

        const result = {name: board.name, sections: board.sections, id: board.id}
        return result
    })()
}
const { models:{ Board } } = require('canvas-data')
const { errors: {NotFoundError} } = require('canvas-utils')

/**
 * The function checks if exist a Board
 * If exists return it, else throw an error
 */
module.exports = function(){
    return (async() => {
        const board = await Board.findOne()
        if(!board) throw new NotFoundError(`board doesn't exist`)

        const result = {name: board.name, sections: board.sections, id: board.id}

        return result
    })()
}
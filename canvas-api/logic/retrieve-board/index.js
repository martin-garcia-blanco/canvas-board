const { models:{ Board } } = require('canvas-data')
const { errors: {ConflictError} } = require('canvas-utils')

/**
 * The function checks if exist a Board
 * If exists return it, else throw an error
 */
module.exports = function(){
    return (async() => {
        let board = await Board.findOne()
        if(!board) board = await Board.create({})
        if(!board) throw new ConflictError('DB error')

        const result = {name: board.name, sections: board.sections, id: board.id}

        return result
    })()
}
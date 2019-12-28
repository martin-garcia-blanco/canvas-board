const { ObjectId, models:{ Board, Section } } = require('canvas-data')
const { validator, errors:{ NotFoundError, ContentError, ConflictError } } = require('canvas-utils')

/**
 * Function receives boardId and a newSection name
 * checks if board exist and create a new Section, linked 
 * into the board.sections
 * 
 * @param {ObjectId} boardId 
 * @param {String} sectionName 
 */
module.exports = function(boardId, sectionName){
    if(!ObjectId.isValid(boardId)) throw new ContentError(`${boardId} is not a valid id`)
    validator.string(sectionName)
    validator.string.notVoid(sectionName, 'sectionName')

    return (async () => {
        const board = await Board.findById(boardId)
        if(!board) throw new NotFoundError(`board with id ${boardId} not found`)

        const section = await Section.create({ name: sectionName, notes: [] })
        board.sections.push(section.id)
        await board.save()

        if(!board.sections.length) throw new ConflictError('DB error')

        return section.id
    })()
}
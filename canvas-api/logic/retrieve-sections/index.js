const { ObjectId, models:{ Board, Section } } = require('canvas-data')
const { errors: {NotFoundError, ContentError} } = require('canvas-utils')

/**
 * The function checks if exist a Border
 * If not exists throw a new NotFOundError,
 * If exists returns an array of sections with notes
 * 
 * @param {ObjectId} boardId
 * @returns {[Section]} 
 *  
 */
module.exports = function(boardId){
    if(!ObjectId.isValid(boardId)) throw new ContentError(`${boardId} is not a valid id`)

    return (async() => {
        const board = await Board.findById(boardId).populate({path:'sections', model: 'Section'})
        //const board = await Board.findOne().populate({path:'sections', model: 'Section'})
        if(!board) throw new NotFoundError(`board with id ${boardId} not found`)

        let sections = []
        sections = board.sections.map(section=>{
            const notes = section.notes.map(note => {return {id: note.id, text:note.text, creationDate: note.creationDate}})
            return {id: section.id, name: section.name, notes}
        })

        return sections
    })()
}
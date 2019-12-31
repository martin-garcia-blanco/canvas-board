const { ObjectId, models:{ Section } } = require('canvas-data')
const { validator, errors:{ NotFoundError, ContentError } } = require('canvas-utils')

/**
 * The function checks if exist a section and a note
 * and delete the note
 * 
 * @param {ObjectId} sectionId 
 * @param {String} noteId
 */
module.exports = function(sectionId, noteId){
    if(!ObjectId.isValid(sectionId)) throw new ContentError(`${sectionId} is not a valid id`)
    if(!ObjectId.isValid(noteId)) throw new ContentError(`${noteId} is not a valid id`)

    return (async () => {
        const section = await Section.findById(sectionId)
        if(!section) throw new NotFoundError(`section with id ${sectionId} not found`)

        section.notes.forEach((note, index) =>{
            if(note.id === noteId) section.notes.splice(index,1)
        })
        await section.save()
    })()
}
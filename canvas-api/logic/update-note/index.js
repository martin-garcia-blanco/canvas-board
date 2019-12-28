const { ObjectId, models:{ Section } } = require('canvas-data')
const { validator, errors:{ NotFoundError, ContentError } } = require('canvas-utils')

/**
 * The function checks if exist a section and a note
 * and update the note name
 * 
 * @param {ObjectId} sectionId 
 * @param {ObjectId} noteId 
 * @param {String} noteName 
 */
module.exports = function(sectionId, noteId, noteName){
    if(!ObjectId.isValid(sectionId)) throw new ContentError(`${sectionId} is not a valid id`)
    if(!ObjectId.isValid(noteId)) throw new ContentError(`${noteId} is not a valid id`)
    validator.string(noteName)
    validator.string.notVoid(noteName, 'noteName')

    return (async () => {
        const section = await Section.findById(sectionId)
        if(!section) throw new NotFoundError(`section with id ${sectionId} not found`)

        section.notes.forEach(note =>{
            if(note.id === noteId) note.text = noteName
        })
        await section.save()

        return 3
    })()
}
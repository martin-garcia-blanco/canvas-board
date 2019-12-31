const { ObjectId, models:{ Note, Section } } = require('canvas-data')
const { validator, errors:{ NotFoundError, ContentError, ConflictError } } = require('canvas-utils')

/**
 * The function checks if exist a section
 * create a new embedded note, with the noteSubject
 *  as text
 * 
 * @param {ObjectId} sectionId 
 * @param {String} noteSubject 
 */
module.exports = function(sectionId, noteSubject){
    if(!ObjectId.isValid(sectionId)) throw new ContentError(`${sectionId} is not a valid id`)
    
    validator.string(noteSubject)
    validator.string.notVoid(noteSubject, 'noteSubject')

    return (async () => {
        const section = await Section.findById(sectionId)
        if(!section) throw new NotFoundError(`board with id ${sectionId} not found`)

        const note = new Note({ text: noteSubject, creationDate: new Date })
        section.notes.push(note)
        await section.save()

        if(!section.notes.length) throw new ConflictError('DB error')

        return note.id
    })()
}
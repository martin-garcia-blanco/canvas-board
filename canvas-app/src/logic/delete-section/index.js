const { ObjectId, models:{ Section } } = require('canvas-data')
const { validator, errors:{ NotFoundError, ContentError, ConflictError } } = require('canvas-utils')

/**
 * The function checks if exist a section
 * and delete him
 * 
 * @param {ObjectId} sectionId 
 */
module.exports = function(sectionId){
    if(!ObjectId.isValid(sectionId)) throw new ContentError(`${sectionId} is not a valid id`)

    return (async () => {
        const section = await Section.findById(sectionId)
        if(!section) throw new NotFoundError(`section with id ${sectionId} not found`)

        await Section.deleteOne({_id : sectionId})

        const shouldNotExistSection = await Section.findById(sectionId)
        if (shouldNotExistSection) throw new ConflictError(`DB error`)
    })()
}
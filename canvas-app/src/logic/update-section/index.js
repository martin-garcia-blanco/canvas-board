const { ObjectId, models:{ Section } } = require('canvas-data')
const { validator, errors:{ NotFoundError, ContentError, ConflictError } } = require('canvas-utils')

/**
 * Function receives sectionId and sectionName
 *  and send an update request 
 * 
 * @param {ObjectId} sectionId 
 * @param {String} sectionName 
 * @returns {Promise}
 */
module.exports = function(sectionId, sectionName){
    if(!ObjectId.isValid(sectionId)) throw new ContentError(`${sectionId} is not a valid id`)
    
    validator.string(sectionName)
    validator.string.notVoid(sectionName, 'sectionName')

    return (async () => {
        const section = await Section.findById(sectionId)
        if(!section) throw new NotFoundError(`section with id ${sectionId} not found`)

        await Section.updateOne({_id : sectionId}, {name: sectionName} )
    })()
}
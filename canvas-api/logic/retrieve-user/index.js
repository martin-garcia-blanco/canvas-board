const { validator, errors: { NotFoundError, ContentError} } = require('canvas-utils')
const { models: { User }, ObjectId } = require('canvas-data')
require('dotenv').config()

/**
 *
 * The function try to find and user
 * with received id
 *  
 * @param {ObjectId} id
 * @returns {Object}
 */
module.exports = function (userId) {
    validator.string(userId)
    validator.string.notVoid('userId', userId)
    if(!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid id`)

    return (async () => {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)
        const { name, email, board } = user
        const result = { name, email, board: board.toString() }

        return result
    })()

}
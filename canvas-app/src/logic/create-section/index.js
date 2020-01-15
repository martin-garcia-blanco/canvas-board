import call from '../../utils/call'
require('dotenv').config()
const { validator, errors: { ContentError } } = require('canvas-utils')
const { ObjectId } = require('canvas-data')
const API_URL = process.env.REACT_APP_API_URL

/**
 * Function receives boardId and a newSection name
 * and send an post request to create a new section
 * It returns nothing or an err
 * 
 * @param {ObjectId} boardId 
 * @param {String} sectionName 
 * @returns {Promise} 
 */
export default function (boardId, sectionName, token) {
    if (!ObjectId.isValid(boardId)) throw new ContentError(`${boardId} is not a valid id`)
    validator.string(sectionName)
    validator.string.notVoid(sectionName, 'sectionName')
    validator.string(token)
    validator.string.notVoid(token, 'token')

    return (async () => {
        const res = await call(`${API_URL}/section`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ name: sectionName, boardId })
        })

        if (res.status === 201) return
        throw new Error(JSON.parse(res.body))
    })()
}
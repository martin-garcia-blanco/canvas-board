import call from '../../utils/call'
require('dotenv').config()
const { errors: { ContentError } } = require('canvas-utils')
const { ObjectId } = require('canvas-data')
const API_URL = process.env.REACT_APP_API_URL

/**
 * Function receives noteId send a delete request 
 * to remove the note with this id
 * It returns nothing or an err
 * 
 * @param {ObjectId} noteId 
 * @returns {Promise} 
 */
export default function (noteId, sectionId) {
    if (!ObjectId.isValid(noteId)) throw new ContentError(`${noteId} is not a valid id`)
    if (!ObjectId.isValid(sectionId)) throw new ContentError(`${sectionId} is not a valid id`)

    return (async () => {
        const res = await call(`${API_URL}/note/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({sectionId})
        })

        if (res.status === 204) return
        throw new Error(JSON.parse(res.body))
    })()
}
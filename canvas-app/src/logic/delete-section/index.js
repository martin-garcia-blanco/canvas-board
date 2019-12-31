import call from '../../utils/call'
require('dotenv').config()
const { errors: { ContentError } } = require('canvas-utils')
const { ObjectId } = require('canvas-data')
const API_URL = process.env.REACT_APP_API_URL

/**
 * Function receives sectionId send a delete request 
 * to remove the section with this id
 * 
 * @param {ObjectId} sectionId 
 */
export default function (sectionId) {
    debugger
    if (!ObjectId.isValid(sectionId)) throw new ContentError(`${sectionId} is not a valid id`)

    return (async () => {
        const res = await call(`${API_URL}/section/${sectionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (res.status === 204) return
        throw new Error(JSON.parse(res.body))
    })()
}
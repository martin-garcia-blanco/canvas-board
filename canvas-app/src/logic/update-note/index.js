import call from '../../utils/call'
require('dotenv').config()
const { validator, errors: { ContentError } } = require('canvas-utils')
const { ObjectId } = require('canvas-data')
const API_URL = process.env.REACT_APP_API_URL

/**
 * Function receives sectionId send a delete request 
 * to remove the section with this id
 * 
 * @param {ObjectId} sectionId 
 */
export default function (sectionId, noteId, noteSubject) {
    debugger
    if(!ObjectId.isValid(sectionId)) throw new ContentError(`${sectionId} is not a valid id`)
    if(!ObjectId.isValid(noteId)) throw new ContentError(`${noteId} is not a valid id`)
    validator.string(noteSubject)
    validator.string.notVoid(noteSubject, 'noteSubject')
    debugger
    return (async () => {
        debugger
        const res = await call(`${API_URL}/note/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({noteSubject, sectionId})
        })

        if (res.status === 204) return
        throw new Error(JSON.parse(res.body))
    })()
}

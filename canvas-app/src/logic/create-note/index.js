import call from '../../utils/call'
require('dotenv').config()
const { validator, errors:{ ContentError } } = require('canvas-utils')
const { ObjectId } = require ('canvas-data')
const API_URL = process.env.REACT_APP_API_URL

/**
 * Function receives sectionId and a newSection name
 * and send an post request to create a new section
 * It returns nothing or an err
 * 
 * @param {ObjectId} sectionId 
 * @param {String} NoteSubject 
 * @returns {Promise} 
 */
export default function (sectionId, NoteSubject, token) {
    if (!ObjectId.isValid(sectionId)) throw new ContentError(`${sectionId} is not a valid id`)
    validator.string(NoteSubject)
    validator.string.notVoid(NoteSubject, 'NoteSubject')
    validator.string(token)
    validator.string.notVoid(token, 'token')

        return (async () => {
            const res = await call(`${API_URL}/note`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ text: NoteSubject, sectionId })
            })

            if (res.status === 201) return
            throw new Error(JSON.parse(res.body))
        })()
}
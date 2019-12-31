import call from '../../utils/call'
require('dotenv').config()
const { validator, errors: { ContentError } } = require('canvas-utils')
const { ObjectId } = require('canvas-data')
const API_URL = process.env.REACT_APP_API_URL

/**
 * Function receives boardId send a delete request 
 * to remove the section with this id
 * 
 * @param {ObjectId} boardId 
 * @param {String} boardName
 */
export default function (boardId, boardName) {
    debugger
    if(!ObjectId.isValid(boardId)) throw new ContentError(`${boardId} is not a valid id`)
    validator.string(boardName)
    validator.string.notVoid(boardName, 'boardName')
    debugger
    return (async () => {
        debugger
        const res = await call(`${API_URL}/board/${boardId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({boardName})
        })

        if (res.status === 204) return
        throw new Error(JSON.parse(res.body))
    })()
}

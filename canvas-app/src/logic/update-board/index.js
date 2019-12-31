import call from '../../utils/call'
require('dotenv').config()
const { validator, errors: { ContentError } } = require('canvas-utils')
const { ObjectId } = require('canvas-data')
const API_URL = process.env.REACT_APP_API_URL

/**
 * Function receives boardId and a boardName
 * and send an update request 
 * 
 * @param {ObjectId} boardId 
 * @param {String} boardName 
 * @returns {Promise}
 */
export default function (boardId, boardName) {
    if(!ObjectId.isValid(boardId)) throw new ContentError(`${boardId} is not a valid id`)
    validator.string(boardName)
    validator.string.notVoid(boardName, 'boardName')
    return (async () => {
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

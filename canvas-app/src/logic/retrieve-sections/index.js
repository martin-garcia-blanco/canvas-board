import call from '../../utils/call'
require('dotenv').config()
const API_URL = process.env.REACT_APP_API_URL
const { errors:{ ContentError }, validator } = require('canvas-utils')
const { ObjectId } = require ('canvas-data')

/**
 * Function receives a boardId and 
 * send a GET request
 * It returns an array of sections or an err
 * @param {ObjectId} boardId 
 * @returns {Promise}
 */
export default function(boardId, token) {
    if (!ObjectId.isValid(boardId)) throw new ContentError(`${boardId} is not a valid id`)
    validator.string(token)
    validator.string.notVoid(token, 'token')
    return (async() => {
        const res = await call(`${API_URL}/sections/${boardId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        
        if (res.status === 200) return JSON.parse(res.body)        
        throw new Error(JSON.parse(res.body))
    })()
}
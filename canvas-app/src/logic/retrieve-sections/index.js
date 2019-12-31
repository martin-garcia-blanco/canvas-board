import call from '../../utils/call'
require('dotenv').config()
const API_URL = process.env.REACT_APP_API_URL
const { errors:{ ContentError } } = require('canvas-utils')
const { ObjectId } = require ('canvas-data')

/**
 * Retrieve an array of sections
 * @param {ObjectId} boardId 
 *  */
export default function(boardId) {
    if (!ObjectId.isValid(boardId)) throw new ContentError(`${boardId} is not a valid id`)
    return (async() => {
        const res = await call(`${API_URL}/sections`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ boardId })
        })

        if (res.status === 200) return JSON.parse(res.body)
        
        throw new Error(JSON.parse(res.body))
    })()
}
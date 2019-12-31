import call from '../../utils/call'
require('dotenv').config()
const API_URL = process.env.REACT_APP_API_URL
const { errors: { NotFoundError } } = require('canvas-utils')

/**
 * Retrieve a board
 * @returns {Promise} - Board.  
 */
export default function() {
    return (async() => {
        const res = await call(`${API_URL}/board`, {
            method: 'GET',
        })

        if (res.status === 200) return JSON.parse(res.body)
        
        throw new Error(JSON.parse(res.body))
    })()
}
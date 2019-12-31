import call from '../../utils/call'
require('dotenv').config()
const API_URL = process.env.REACT_APP_API_URL

/**
 * Function doesnt receive anything and 
 * send a GET request 
 * to retrieve a board
 * It returns a board or an err
 * @returns {Promise}  
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
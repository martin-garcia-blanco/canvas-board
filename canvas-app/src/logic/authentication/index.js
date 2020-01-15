import call from '../../utils/call'
const { validator, errors: { CredentialsError } } = require('canvas-utils')
const API_URL = process.env.REACT_APP_API_URL

export default function (email, password) {
    validator.string(email)
    validator.string.notVoid('email', email)
    validator.string(password)
    validator.string.notVoid('password', password)

	return (async () => {
        const res = await call(`${API_URL}/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

		if (res.status === 200) return JSON.parse(res.body).token        
        if (res.status === 401) throw new Error(JSON.parse(res.body))
        throw new Error(JSON.parse(res.body))
    })()
}
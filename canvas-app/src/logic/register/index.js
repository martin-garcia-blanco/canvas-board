import call from '../../utils/call'
const { validator, errors: { ConflictError } } = require('canvas-utils')
const API_URL = process.env.REACT_APP_API_URL

export default function(name, email, password, verification) {
    validator.string(name)
    validator.string.notVoid('name', name)
    validator.string(email)
    validator.string.notVoid('e-mail', email)
    validator.isEmail(email)
    validator.string(password)
    validator.string.notVoid('password', password)

    return (async () => {
        const res = await call(`${API_URL}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        })

        if (res.status === 201) return        
        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)
        throw new Error(JSON.parse(res.body).message)
    })()
}
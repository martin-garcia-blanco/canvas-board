const { validator, errors: { CredentialsError }} = require('canvas-utils')
const { models: { User } } = require('canvas-data')
require('dotenv').config()
const bcrypt = require('bcryptjs')

/**
 *
 * User authentication
 * 
 * @param {String} email
 * @param {String} password
 */
module.exports = function(email, password){
    validator.string(email)
    validator.string.notVoid('email', email)
    validator.isEmail(email)
    validator.string(password)
    validator.string.notVoid('password', password)
    return(async()=>{
        debugger
        const user = await User.findOne({email})
        if(!user) throw new CredentialsError(`wrong credentials`)

        const valid = await bcrypt.compare(password, user.password)
        if(!valid) throw new CredentialsError(`wrong credentials`)

        return user.id
    })()

}
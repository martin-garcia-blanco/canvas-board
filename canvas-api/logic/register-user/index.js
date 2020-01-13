const { validator, errors: { ConflictError }} = require('canvas-utils')
const { models: { User, Board }} = require('canvas-data')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const { env: { SALT }} = process

/**
 *
 * User registration
 * 
 * @param {String} name
 * @param {String} email
 * @param {String} password
 */
module.exports = function(name, email, password){
    validator.string(name)
    validator.string.notVoid('name', name)
    validator.string(email)
    validator.string.notVoid('email', email)
    validator.isEmail(email)
    validator.string(password)
    validator.string.notVoid('password', password)
    return(async()=>{
        const user = await User.findOne({email})
        if(user) throw new ConflictError(`user with email ${email} already exists`)

        password = await bcrypt.hash(password, parseInt(SALT))
        const board = await Board.create({})

        await User.create({name, email, password, board: board.id})
    })()

}
const { ContentError } = require('./errors')
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


const validator = {
    string(target){
        if( typeof target !== 'string' ) throw new ContentError(`${target} is not a string`)
    },
    isEmail(target) {
        if(!EMAIL_REGEX.test(String(target).toLowerCase())) throw new ContentError(`${target} is not an email`) 
    }
}

validator.string.notVoid = function(target, name) {
    if(!target.trim().length) throw new ContentError(`${name} is empty or blank`)
}

module.exports = validator
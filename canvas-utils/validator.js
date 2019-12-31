const { ContentError } = require('./errors')

const validator = {
    string(target){
        if( typeof target !== 'string' ) throw new ContentError(`${target} is not a string`)
    }
}

validator.string.notVoid = function(target, name) {
    if(!target.trim().length) throw new ContentError(`${name} is empty or blank`)
}

module.exports = validator
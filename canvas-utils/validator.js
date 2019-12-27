const { ContentError } = require('./errors')

const validator = {
    string(target){
        if( typeof target !== 'string' ) throw new ContentError(`${target} is not a string`)
    }
}

validator.string.notVoid = function(target) {
    if(!target.trim().length) throw new ContentError(`${target} is empty or blank`)
}

module.exports = validator
const { ContentError } = require('./errors')

const validator = {
    string(target){
        if( typeof target !== 'string' ) throw new ContentError(`${target} is not a string`)
    }
}

module.exports = validator
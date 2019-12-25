const { ContentError } = require('./errors')
const validator = {

    string(target){
        if( typeof a !== 'string' ) throw new ContentError(`${target} is not a string`)
    }
}

module.exports = validator
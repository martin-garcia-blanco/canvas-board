/**
 * 
 * This midleware control network access
 * 
 * @param {*} req network request
 * @param {*} res network response
 * @param {*} next allow petition to continue
 */
module.exports  = function(req,res,next) {
    res.setHeader('Access-Control-Allow-Origin', '*'),
    res.setHeader('Access-Control-Allow-Methods', '*'),
    res.setHeader('Allow-Control-Allow-Headers', 'Content-Type')

    next()
}
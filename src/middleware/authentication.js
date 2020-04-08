let jwt = require('jsonwebtoken')
let User = require('../models/user')
let config = require('../config')

let auth = async (req, res, next) => {
    try {
        let token = req.header('Authorization').replace('Bearer ', '')        
        let decoded = jwt.verify(token, config.JWT_SECRET)
        let user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.user = user
        next()

    } catch (err) {
        res.status(403).send({ error: 'Access denied.'})
    }
}

module.exports = auth
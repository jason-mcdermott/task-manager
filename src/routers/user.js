let express = require('express')
let router = new express.Router()
let User = require('../models/user')
let auth = require('../middleware/auth')

router.post('/users', async (req, res) => {
    let user = new User(req.body)

    try {
        await user.save()
        let token = await user.generateAuthToken()
        res.status(201).send({ user, token })        
    } catch(error) {
        res.status(400).send({
            error: 'Unable to create user'
        })
    }
})

router.post('/users/login', async (req, res) => {
    try {
        let user = await User.findByCredentials(req.body.email, req.body.password)
        let token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(403).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(403).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(403).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.put('/users/me', auth, async (req, res) => {
    let updates = Object.keys(req.body)
    let allowedUpdates = ['name', 'email', 'password', 'age']
    let isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update'})
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()
        
        if(!req.user) {
            return res.status(404).send()
        }

        res.send(req.user)
    } catch(error) {
        res.status(500).send({
            error: 'there was an unexpected error handling your request'
        })
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.status(204).send()
    } catch(error) {
        res.status(500).send({
            error: 'there was an unexpected error handling your request'
        })
    }
})

module.exports = router
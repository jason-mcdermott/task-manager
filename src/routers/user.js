let express = require('express')
let router = new express.Router()
let User = require('../models/user')

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

router.get('/users', async (req, res) => {
    try {
        let users = await User.find()
        res.status(200).send(users)        
    } catch(error) {
        res.status(500).send({
            error: 'there was an unexpected error handling your request'
        })
    }
})

router.get('/users/:id', async (req, res) => {
    try {
        let user = await User.findById(req.params.id)      
        if(!user) {
            return res.status(404).send()
        }
        
        res.send(user)
    } catch(error) {
        res.status(500).send({
            error: 'there was an unexpected error handling your request'
        })
    }
})

router.put('/users/:id', async (req, res) => {
    let updates = Object.keys(req.body)
    let allowedUpdates = ['name', 'email', 'password', 'age']
    let isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update'})
    }

    try {
        let user = await User.findById(req.params.id)
        
        updates.forEach((update) => {
            user[update] = req.body[update]
        })

        await user.save()
        
        if(!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch(error) {
        res.status(500).send({
            error: 'there was an unexpected error handling your request'
        })
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        let user = await User.findByIdAndDelete(req.params.id)      
        if(!user) {
            return res.status(404).send()
        }

        res.status(204).send()
    } catch(error) {
        res.status(500).send({
            error: 'there was an unexpected error handling your request'
        })
    }
})

module.exports = router
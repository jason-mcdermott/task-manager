let express = require('express')
let router = new express.Router()
let Task = require('../models/task')

router.post('/tasks', async (req, res) => {
    let task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)        
    } catch(error) {
        res.status(400).send(error)
    }
})

router.get('/tasks', async (req, res) => {
    try {
        let tasks = await Task.find()
        res.status(200).send(tasks)        
    } catch(error) {
        res.status(500).send({
            error: 'there was an unexpected error handling your request'
        })
    }
})

router.get('/tasks/:id', async (req, res) => {
    try {
        let task = await Task.findById(req.params.id)      
        if(!task) {
            return res.status(404).send()
        }
        
        res.send(task)
    } catch(error) {
        res.status(500).send({
            error: 'there was an unexpected error handling your request'
        })
    }
})

router.put('/tasks/:id', async (req, res) => {
    let updates = Object.keys(req.body)
    let allowedUpdates = ['description','completed']
    let isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update'})
    }

    try {
        let task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })      
        if(!task) {
            return res.status(404).send()
        }

        res.status(204).send()
    } catch(error) {
        res.status(400).send({
            error: 'there was an unexpected error handling your request'
        })
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        let task = await Task.findByIdAndDelete(req.params.id)      
        if(!task) {
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
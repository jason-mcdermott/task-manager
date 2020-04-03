const { ObjectID } = require('mongodb')
const mongoose = require('mongoose')

// create schema
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    owner: mongoose.Schema.Types.ObjectId
})

const Task = mongoose.model('Task', taskSchema)

// Task.updateMany({}, {
//     $set: {
//         completed: false
//     }
// })
//     .then(result => console.log(result))
//     .catch(err => console.log(err))

// const task = new Task({
//     description: "Go shopping"
// })

// task.save()
//     .then(result => console.log(result))
//     .catch(error => console.log(error))

Task.find({})
    .then(result => console.log(result))
    .catch(error => console.log(error))

Task.find({ owner: new ObjectID("5e80e086e7179a17e21dcc45")})
    .then(result => console.log(result))
    .catch(error => console.log(error))

module.exports = Task    
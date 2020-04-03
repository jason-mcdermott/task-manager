const { ObjectID } = require('mongodb')
const mongoose = require('mongoose')
const validator = require('validator')

// create schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be a positive number.')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password') || (value.length <= 6)){
                throw new Error('Invalid password')
            }
        }
    }
})

const User = mongoose.model('User', userSchema)

// let jason = new User({
//     name: "Jason",
//     email: "JAY@kA.cOm",
//     password: 'test12345'
// })

// jason.save()
// .then(result => console.log(result))
// .catch(error => console.log(error))

// User.deleteMany({name: 'Jason'})
// .then(result => console.log(result))
// .catch(error => console.log(error))

User.find({})
    .then(result => console.log(result))
    .catch(error => console.log(error))

User.find({ age: 27 })
    .then(result => console.log(result))
    .catch(error => console.log(error))

User.countDocuments({ age: 27 })
    .then(result => console.log(result))
    .catch(error => console.log(error))


// User.updateOne({_id: new ObjectID("5e80e061e7179a17e21dcc31")}, {
//     $set: {
//         name: "Mike"
//     }
// }).then(result => console.log(result))
//     .catch(err => console.log(err))

User.findOne({ _id: new ObjectID("5e80e061e7179a17e21dcc31")})
    .then(result => console.log(result))
    .catch(error => console.log(error))

module.exports = User
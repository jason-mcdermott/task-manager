const { ObjectID } = require('mongodb')
const mongoose = require('mongoose')
const config = require('../config')

mongoose.connect(config.MONGO_DB_CONNECTION, { 
    useUnifiedTopology: true, 
    useNewUrlParser: true, 
    useCreateIndex: true 
}).catch(error => console.log(error));

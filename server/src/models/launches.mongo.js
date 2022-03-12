const mongoose = require('mongoose')

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
        default: 100
    },
    mission: String,
    rocket: String,
    launchDate: Date,
    target: String,
    customers: [ String ],
    upcoming: {
        type: Boolean,
        default: true
    },
    success: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Launch', launchesSchema)
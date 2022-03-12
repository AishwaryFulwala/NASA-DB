const express = require('express')
const launchesController = require('./launches.controller')

const launchesRouter = express.Router()

launchesRouter.get('/', launchesController.getAlllaunches)
launchesRouter.post('/', launchesController.addlaunch)
launchesRouter.delete('/:id', launchesController.abortlaunch)


module.exports = launchesRouter
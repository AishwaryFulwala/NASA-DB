const launchModel = require('../../models/launches.model')
const { getPagination } = require('../../services/query')

async function getAlllaunches (req, res) {
    const { skip, limit } = getPagination(req.query)
    return res.status(200).json(await launchModel.getAlllaunches(skip, limit));
}

async function addlaunch(req, res) {
    const launch = req.body

    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'Invalid Launch Property.'
        })
    }

    launch.launchDate = new Date(launch.launchDate)

    await launchModel.addlaunches(launch)
    return res.status(200).json(launch)
}

async function abortlaunch(req, res) {
    const id = Number(req.params.id)

    const eid = await launchModel.existslaunch(id)
    
    if(!eid) {
        return res.status(400).json({
            error: 'Launch not found.'
        })
    }

    const abort = await launchModel.abortlaunch(id)

    if(!abort)
        return res.status(400).json({
            error: 'Launch not aborted.'
        })
        return res.status(200).json({
            ok: true
        })
}

module.exports = {
    getAlllaunches,
    addlaunch,
    abortlaunch
}
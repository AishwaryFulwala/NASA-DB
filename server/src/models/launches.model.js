const axios = require('axios')

const launches =require('./launches.mongo')
const planets =require('./planets.mongo')

const SPACEX_API = 'https://api.spacexdata.com/v4/launches/query'

async function populatelaunches() {
    const response = await axios.post(SPACEX_API,{
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    })

    if(response.status !== 200)
        throw new Error('Launch data download failed')

    const launchData = response.data.docs
    for(const l of launchData) {
        const payloads = l['payloads']
        const customers = payloads.flatMap((payload) => {
            return payload['customers']
        })

        const launch = {
            flightNumber: l['flight_number'],
            mission: l['name'],
            rocket: l['rocket']['name'],
            launchDate: l['date_local'],
            upcoming: l['upcoming'],
            success: l['success'],
            customers
        }

        await savelaunches(launch)
    }
}

async function loadlaunches() {
    const firstlaunch = await findlaunches({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    })

    if(firstlaunch) {
        console.log('Already Loaded')
    }
    else {
        await populatelaunches()
    }
}

async function savelaunches(launch) {
    try {
        await launches.updateOne({
            flightNumber: launch.flightNumber
        }, launch, {
            upsert: true
        })
    } catch (error) {
        console.log(error)   
    }
}

async function findlaunches(filter) {
    return await launches.findOne(filter)
}

async function existslaunch(id) {
    return await findlaunches({
        flightNumber: id
    })
}

async function getAlllaunches (s, l) {
    return await launches.find({}).sort({ flightNumber: 1 }).skip(s).limit(l)
}

async function getLatestFlightNumber() {
    const latestlaunch = await launches.findOne().sort('-flightNumber')

    if(!latestlaunch) 
        return 100

    return latestlaunch.flightNumber
}

async function addlaunches(launch) {
    const planet = await planets.findOne({
        kepler_name: launch.target
    })

    if(!planet)
        throw new Error('No matching planet found ')

    const newlaunch = Object.assign(launch, {
        flightNumber: await getLatestFlightNumber() + 1,
        customers: ['ZTM', 'NASA'],
        upcoming: true,
        success: true
    })

    await savelaunches(newlaunch)
}

async function abortlaunch(id) {
    const aborted = await launches.updateOne({
        flightNumber: id
    }, {
        upcoming: false,
        success: false
    })

    return aborted.modifiedCount === 1
}

module.exports = {
    loadlaunches,
    getAlllaunches,
    addlaunches,
    existslaunch,
    abortlaunch
}
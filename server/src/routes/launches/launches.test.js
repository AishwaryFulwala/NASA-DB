const request = require('supertest')
const app = require('../../app')
const { mongoConnect, mongoDisconnect } = require('../../services/mongo')

describe('Launches API', () => {
    beforeAll(async () => {
        await mongoConnect()
    })

    afterAll(async () => {
        await mongoDisconnect()
    })

    describe('Test GET /launches', () => {
        test('It Success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect(200)
        })
    })
    
    describe('Test POST /launches', () => {
        const d1 = {
            mission: 'Kepler Exploration X',
            rocket: 'Explorer IS1',
            launchDate: 'December 2, 2023',
            target: 'Kepler-62 f'
        }
    
        const d2 = {
            mission: 'Kepler Exploration X',
            rocket: 'Explorer IS1',
            target: 'Kepler-62 f'
        }
    
        test('It Success', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(d1)
                .expect(200)
    
            const reqd = new Date(d1.launchDate).valueOf()
            const resd = new Date(response.body.launchDate).valueOf()
    
            expect(resd).toBe(reqd)
            expect(response.body).toMatchObject(d2)
        }) 
    
        test('It is Invalid Launch Property.', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(d2)
                .expect(400) 
            
                expect(response.body).toStrictEqual({
                    error: 'Invalid Launch Property.'
                })
        })
    } )
})
require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const {deleteSection} = require('../index')
const { database, ObjectId, models: { Section, User } } = require('canvas-data')
const { errors:{ContentError} } = require('canvas-utils')
const jwt = require('jsonwebtoken')



describe('logic deleteSection test', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let sectionId, token

    beforeEach(async () =>{
        await  Promise.all([Section.deleteMany(), User.deleteMany()])

        const userName = `name-${Math.random()}`
        const email = `mail-${Math.random()}@asdf.com`
        const password = `password-${Math.random()}`
        const arr = []
    
        const user = await User.create({name: userName, password, email, board: arr})
        token = jwt.sign({ sub: user.id }, TEST_SECRET)
        
        const name = `name-${Math.random()}`
        const section = await Section.create({name})
        sectionId = section.id
    })

    it('There is a section so should delete it', async () => {
        await deleteSection(sectionId, token)

        const section = await Section.findById(sectionId)

        expect(section).toBe(null)
    })

    it('Should throw and error, unexpected sectionId', async () => {
        const fakeId = ObjectId().toString()

        try {
            await deleteSection(fakeId, token)
            throw new Error('Should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error.message).toBeDefined()
            expect(typeof error.message).toBe('string')
            expect(error.message.length).toBeGreaterThan(0)
            expect(error.message).toBe(`section with id ${fakeId} not found`)
        }
    })

    it('Should throw a NotFoundError, wrong sectionId', async () => {
        expect(() => deleteSection('')).toThrow(ContentError, ' is not a valid id')
        expect(() => deleteSection(' \t\r')).toThrow(ContentError, ' is not a valid id')
    })


    afterAll(() =>  Promise.all([Section.deleteMany(), User.deleteMany()]))
})
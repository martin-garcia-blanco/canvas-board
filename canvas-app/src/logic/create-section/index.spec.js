require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const {createSection} = require('../index')
const { database, ObjectId, models: { Board, Section, User } } = require('canvas-data')
const { errors:{ContentError} } = require('canvas-utils')
const jwt = require('jsonwebtoken')


describe('logic createSection test', () => {

    beforeAll(() => database.connect(TEST_DB_URL))

    let boardId, token
    const name = `name-${Math.random()}`

    beforeEach(async () => {
        await Promise.all([Board.deleteMany(), Section.deleteMany(), User.deleteMany()])

        const userName = `name-${Math.random()}`
        const email = `mail-${Math.random()}@asdf.com`
        const password = `password-${Math.random()}`
        const arr = []
    
        const user = await User.create({name: userName, password, email, board: arr})
        token = jwt.sign({ sub: user.id }, TEST_SECRET)
        
        const board = await Board.create({})
        boardId = board.id
    })

    it('Should create a new section', async () => {
        await createSection(boardId, name, token)
        const newSection = await Section.findOne()
        expect(newSection).toBeDefined()
        expect(newSection.name).toBe(name)
        expect(newSection.notes.length).toBe(0)
    })

    it('Should throw and error, invalid boardId', async () => {
        const fakeId = ObjectId().toString()

        try {
            await createSection(fakeId, name, token)
            throw new Error('Should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error.message).toBeDefined()
            expect(typeof error.message).toBe('string')
            expect(error.message.length).toBeGreaterThan(0)
            expect(error.message).toBe(`board with id ${fakeId} not found`)
        }
    })

    it('Should throw a NotFoundError, wrong boardId', async () => {
        expect(() => createSection('')).toThrow(ContentError, ' is not a valid id')
        expect(() => createSection(' \t\r')).toThrow(ContentError, ' is not a valid id')
    })

    it('Should throw a ContentError, wrong name type or empty', async () => {
        expect(() => createSection(boardId, 1)).toThrow(ContentError, '1 is not a string')
        expect(() => createSection(boardId, true)).toThrow(ContentError, 'true is not a string')
        expect(() => createSection(boardId, [])).toThrow(ContentError, ' is not a string')
        expect(() => createSection(boardId, {})).toThrow(ContentError, '[object Object] is not a string')
        expect(() => createSection(boardId, undefined)).toThrow(ContentError, 'undefined is not a string')
        expect(() => createSection(boardId, null)).toThrow(ContentError, 'null is not a string')
        expect(() => createSection(boardId, '')).toThrow(ContentError, ' is empty or blank')
        expect(() => createSection(boardId, ' \t\r')).toThrow(ContentError, ' is empty or blank')
    })
    afterAll(() => Promise.all([Board.deleteMany(), Section.deleteMany(), User.deleteMany()]))
})
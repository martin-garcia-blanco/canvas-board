require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const { retrieveSections } = require('../index')
const { database, models: { Board, Note, Section, User } } = require('canvas-data')
const { errors: { ContentError } } = require('canvas-utils')
const jwt = require('jsonwebtoken')

describe('logic retrieveSections test', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let boardId, sectionName, noteText, token

    beforeEach(async () => {
        await Promise.all([Board.deleteMany(), User.deleteMany(), Section.deleteMany()])

        const userName = `name-${Math.random()}`
        const email = `mail-${Math.random()}@asdf.com`
        const password = `password-${Math.random()}`
        const arr = []

        const user = await User.create({ name: userName, password, email, board: arr })
        token = jwt.sign({ sub: user.id }, TEST_SECRET)

        sectionName = `name-${Math.random()}`
        noteText = `text-${Math.random()}`
        const note = new Note({ text: noteText, creationDate: new Date })
        const section = await Section.create({ name: sectionName, notes: [note] })
        const board = await Board.create({ sections: [section._id] })
        boardId = board.id
    })

    it('should return an array with sections and notes', async () => {
        const sections = await retrieveSections(boardId, token)
        const section = sections[0]
        const note = section.notes[0]

        expect(section).toBeDefined()
        expect(section.name).toBe(sectionName)
        expect(section.notes).toBeInstanceOf(Array)

        expect(note).toBeDefined()
        expect(note.text).toBe(noteText)
    })

    //Its necessary to solve an error among api routes and methods
    /* it('Should throw and error, unexpected boardId', async () => {
        const fakeId = ObjectId().toString()
        try {
            debugger
            await retrieveSections(fakeId)
            throw new Error('Should not reach this point')
        } catch (error) {
            debugger
            expect(error).toBeDefined()
            expect(error.message).toBeDefined()
            expect(typeof error.message).toBe('string')
            expect(error.message.length).toBeGreaterThan(0)
            expect(error.message).toBe(`board with id ${fakeId} not found`)
        }
    }) */

    it('Should throw a NotFoundError, wrong boardId', async () => {
        expect(() => retrieveSections('', token)).toThrow(ContentError, ' is not a valid id')
        expect(() => retrieveSections(' \t\r', token)).toThrow(ContentError, ' is not a valid id')
    })

    afterAll(() => Promise.all([Board.deleteMany(), User.deleteMany(), Section.deleteMany()]))

})

describe('when board doesnt have sections', () => {
    let boardId, token

    beforeAll(async () => {
        await Board.deleteMany()
        const board = await Board.create({})
        boardId = board.id

        const userName = `name-${Math.random()}`
        const email = `mail-${Math.random()}@asdf.com`
        const password = `password-${Math.random()}`
        const arr = []

        const user = await User.create({ name: userName, password, email, board: arr })
        token = jwt.sign({ sub: user.id }, TEST_SECRET)
    })

    it('should retrieve an empty array', async () => {
        const sections = await retrieveSections(boardId, token)

        expect(sections).toBeDefined()
        expect(sections).toBeInstanceOf(Array)
        expect(sections.length).toBe(0)
    })
    afterAll(() => Promise.all([Board.deleteMany(), User.deleteMany(), Section.deleteMany()]))
})

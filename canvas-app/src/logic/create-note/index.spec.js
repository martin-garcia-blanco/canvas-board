require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const {createNote} = require('../index')
const { database, ObjectId, models: { Note, Section, User } } = require('canvas-data')
const { errors:{ContentError} } = require('canvas-utils')
const jwt = require('jsonwebtoken')

describe('logic createNote test', () => {

    beforeAll(() => database.connect(TEST_DB_URL))

    let sectionId, token

    beforeEach(async () => {
        await Promise.all([Note.deleteMany(), Section.deleteMany(), User.deleteMany()])

        const userName = `name-${Math.random()}`
        const email = `mail-${Math.random()}@asdf.com`
        const password = `password-${Math.random()}`
        const board = []

        const user = await User.create({name: userName, password, email, board})
        token = jwt.sign({ sub: user.id }, TEST_SECRET)

        const name = `name-${Math.random()}`
        const section = await Section.create({name: name})
        sectionId = section.id
    })

    it('Should create a new note', async () => {
        const text = `text-${Math.random()}`
        await createNote(sectionId, text, token)
        const { notes } = await Section.findById(sectionId)
        const note = notes[0]
        expect(note).toBeDefined()
        expect(note.text).toBe(text)
    })

    it('Should throw and error, invalid sectionId', async () => {
        const fakeId = ObjectId().toString()
        const fakeText = 'fakeText'

        try {
            await createNote(fakeId, fakeText, token)
            throw new Error('Should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error.message).toBeDefined()
            expect(typeof error.message).toBe('string')
            expect(error.message.length).toBeGreaterThan(0)
            expect(error.message).toBe(`board with id ${fakeId} not found`)
        }
    })

    it('Should throw a NotFoundError, wrong sectionId', async () => {
        expect(() => createNote('')).toThrow(ContentError, ' is not a valid id')
        expect(() => createNote(' \t\r')).toThrow(ContentError, ' is not a valid id')
    })

    it('Should throw a ContentError, wrong text type or empty', async () => {
        expect(() => createNote(sectionId, 1)).toThrow(ContentError, '1 is not a string')
        expect(() => createNote(sectionId, true)).toThrow(ContentError, 'true is not a string')
        expect(() => createNote(sectionId, [])).toThrow(ContentError, ' is not a string')
        expect(() => createNote(sectionId, {})).toThrow(ContentError, '[object Object] is not a string')
        expect(() => createNote(sectionId, undefined)).toThrow(ContentError, 'undefined is not a string')
        expect(() => createNote(sectionId, null)).toThrow(ContentError, 'null is not a string')
        expect(() => createNote(sectionId, '')).toThrow(ContentError, ' is empty or blank')
        expect(() => createNote(sectionId, ' \t\r')).toThrow(ContentError, ' is empty or blank')
    })
    afterAll(() => Promise.all([Note.deleteMany(), Section.deleteMany(), User.deleteMany()]))
})

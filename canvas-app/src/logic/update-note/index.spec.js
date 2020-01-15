require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const {updateNote} = require('../index')
const { database, ObjectId, models: { Section, Note, User } } = require('canvas-data')
const { errors:{ContentError} } = require('canvas-utils')
const jwt = require('jsonwebtoken')


describe('logic updateNote test', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let sectionId, noteId, token

    beforeEach(async () =>{
        await Promise.all([Section.deleteMany(), User.deleteMany()])
        
        const name = `name-${Math.random()}`
        const text = `text-${Math.random()}`

        const section = await Section.create({name})
        const note = new Note({text, creationDate: new Date})
        section.notes.push(note)
        await section.save()

        sectionId = section.id
        noteId = note.id

        const userName = `name-${Math.random()}`
        const email = `mail-${Math.random()}@asdf.com`
        const password = `password-${Math.random()}`
        const arr = []

        const user = await User.create({ name: userName, password, email, board: arr })
        token = jwt.sign({ sub: user.id }, TEST_SECRET)
    })

    it('There is a note so should update it', async () => {
        const newNoteText = `noteText-${Math.random()}`
        await updateNote(sectionId, noteId, newNoteText, token)

        const section = await Section.findById(sectionId)
        const note = section.notes[0]

        expect(note).toBeDefined()
        expect(note.text).toBe(newNoteText)
    })

    it('Should throw and error, unexpected sectionId', async () => {
        const fakeId = ObjectId().toString()
        const fakeName = 'fakeName'

        try {
            await updateNote(fakeId, fakeId, fakeName, token)
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
        expect(() => updateNote('', token)).toThrow(ContentError, ' is not a valid id')
        expect(() => updateNote(' \t\r', token)).toThrow(ContentError, ' is not a valid id')
    })

    it('Should throw a NotFoundError, wrong noteId', async () => {
        expect(() => updateNote('', token)).toThrow(ContentError, ' is not a valid id')
        expect(() => updateNote(' \t\r', token)).toThrow(ContentError, ' is not a valid id')
    })

    it('Should throw a ContentError, wrong text type or empty', async () => {
        expect(() => updateNote(sectionId, noteId, 1, token)).toThrow(ContentError, '1 is not a string')
        expect(() => updateNote(sectionId, noteId, true, token)).toThrow(ContentError, 'true is not a string')
        expect(() => updateNote(sectionId, noteId, [], token)).toThrow(ContentError, ' is not a string')
        expect(() => updateNote(sectionId, noteId, {}, token)).toThrow(ContentError, '[object Object] is not a string')
        expect(() => updateNote(sectionId, noteId, undefined, token)).toThrow(ContentError, 'undefined is not a string')
        expect(() => updateNote(sectionId, noteId, null, token)).toThrow(ContentError, 'null is not a string')
        expect(() => updateNote(sectionId, noteId, '', token)).toThrow(ContentError, ' is empty or blank')
        expect(() => updateNote(sectionId, noteId, ' \t\r', token)).toThrow(ContentError, ' is empty or blank')
    })

    afterAll(() => Promise.all([Section.deleteMany(), User.deleteMany()]))
})
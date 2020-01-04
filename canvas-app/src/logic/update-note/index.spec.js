require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL } } = process
const {updateNote} = require('../index')
const { database, ObjectId, models: { Section, Note } } = require('canvas-data')
const { errors:{ContentError} } = require('canvas-utils')


describe('logic updateNote test', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let sectionId, noteId

    beforeEach(async () =>{
        await Section.deleteMany()
        
        const name = `name-${Math.random()}`
        const text = `text-${Math.random()}`

        const section = await Section.create({name})
        const note = new Note({text, creationDate: new Date})
        section.notes.push(note)
        await section.save()

        sectionId = section.id
        noteId = note.id
    })

    it('There is a note so should update it', async () => {
        const newNoteText = `noteText-${Math.random()}`
        await updateNote(sectionId, noteId, newNoteText)

        const section = await Section.findById(sectionId)
        const note = section.notes[0]

        expect(note).toBeDefined()
        expect(note.text).toBe(newNoteText)
    })

    it('Should throw and error, unexpected sectionId', async () => {
        const fakeId = ObjectId().toString()
        const fakeName = 'fakeName'

        try {
            await updateNote(fakeId, fakeId, fakeName)
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
        expect(() => updateNote('')).toThrow(ContentError, ' is not a valid id')
        expect(() => updateNote(' \t\r')).toThrow(ContentError, ' is not a valid id')
    })

    it('Should throw a NotFoundError, wrong noteId', async () => {
        expect(() => updateNote('')).toThrow(ContentError, ' is not a valid id')
        expect(() => updateNote(' \t\r')).toThrow(ContentError, ' is not a valid id')
    })

    it('Should throw a ContentError, wrong text type or empty', async () => {
        expect(() => updateNote(sectionId, noteId, 1)).toThrow(ContentError, '1 is not a string')
        expect(() => updateNote(sectionId, noteId, true)).toThrow(ContentError, 'true is not a string')
        expect(() => updateNote(sectionId, noteId, [])).toThrow(ContentError, ' is not a string')
        expect(() => updateNote(sectionId, noteId, {})).toThrow(ContentError, '[object Object] is not a string')
        expect(() => updateNote(sectionId, noteId, undefined)).toThrow(ContentError, 'undefined is not a string')
        expect(() => updateNote(sectionId, noteId, null)).toThrow(ContentError, 'null is not a string')
        expect(() => updateNote(sectionId, noteId, '')).toThrow(ContentError, ' is empty or blank')
        expect(() => updateNote(sectionId, noteId, ' \t\r')).toThrow(ContentError, ' is empty or blank')
    })

    afterAll(() => Section.deleteMany())
})
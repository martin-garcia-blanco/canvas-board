require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL } } = process
const {deleteNote} = require('../index')
const { database, ObjectId, models: { Section, Note } } = require('canvas-data')
const { errors:{ContentError} } = require('canvas-utils')


describe('logic deleteNote test', () => {
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

    it('There is a note so should delete it', async () => {
        await deleteNote(noteId, sectionId)

        const section = await Section.findById(sectionId)
        const note = section.notes[0]

        expect(note).not.toBeDefined()
    })

    it('Should throw and error, unexpected sectionId', async () => {
        const fakeId = ObjectId().toString()

        try {
            await deleteNote(fakeId, fakeId)
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
        expect(() => deleteNote('')).toThrow(ContentError, ' is not a valid id')
        expect(() => deleteNote(' \t\r')).toThrow(ContentError, ' is not a valid id')
    })

    it('Should throw a NotFoundError, wrong noteId', async () => {
        expect(() => deleteNote('')).toThrow(ContentError, ' is not a valid id')
        expect(() => deleteNote(' \t\r')).toThrow(ContentError, ' is not a valid id')
    })

    afterAll(() => Section.deleteMany())
})
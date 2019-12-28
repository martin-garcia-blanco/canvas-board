require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const updateNote = require('.')
const { database, ObjectId, models: { Section, Note } } = require('canvas-data')
const { errors: { ContentError } } = require('canvas-utils')


describe('logic updateNote test', () => {
    before(() => database.connect(TEST_DB_URL))

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

        expect(note).to.exist
        expect(note.text).to.equal(newNoteText)
    })

    it('Should throw and error, unexpected sectionId', async () => {
        const fakeId = ObjectId().toString()
        const fakeName = 'fakeName'

        try {
            await updateNote(fakeId, fakeId, fakeName)
            throw new Error('Should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error.message).to.exist
            expect(typeof error.message).to.equal('string')
            expect(error.message.length).to.be.greaterThan(0)
            expect(error.message).to.equal(`section with id ${fakeId} not found`)
        }
    })

    it('Should throw a NotFoundError, wrong sectionId', async () => {
        expect(() => updateNote('')).to.throw(ContentError, ' is not a valid id')
        expect(() => updateNote(' \t\r')).to.throw(ContentError, ' is not a valid id')
    })

    it('Should throw a NotFoundError, wrong noteId', async () => {
        expect(() => updateNote('')).to.throw(ContentError, ' is not a valid id')
        expect(() => updateNote(' \t\r')).to.throw(ContentError, ' is not a valid id')
    })

    it('Should throw a ContentError, wrong text type or empty', async () => {
        expect(() => updateNote(sectionId, noteId, 1)).to.throw(ContentError, '1 is not a string')
        expect(() => updateNote(sectionId, noteId, true)).to.throw(ContentError, 'true is not a string')
        expect(() => updateNote(sectionId, noteId, [])).to.throw(ContentError, ' is not a string')
        expect(() => updateNote(sectionId, noteId, {})).to.throw(ContentError, '[object Object] is not a string')
        expect(() => updateNote(sectionId, noteId, undefined)).to.throw(ContentError, 'undefined is not a string')
        expect(() => updateNote(sectionId, noteId, null)).to.throw(ContentError, 'null is not a string')
        expect(() => updateNote(sectionId, noteId, '')).to.throw(ContentError, ' is empty or blank')
        expect(() => updateNote(sectionId, noteId, ' \t\r')).to.throw(ContentError, ' is empty or blank')
    })

    after(() => Section.deleteMany())
})
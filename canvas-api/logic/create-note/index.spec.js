require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const createNote = require('./')
const { database, ObjectId, models: { Note, Section } } = require('canvas-data')
const { errors:{ ContentError }} = require('canvas-utils')

describe('logic createNote test', () => {

    before(() => database.connect(TEST_DB_URL))

    let sectionId

    beforeEach(async () => {
        await Promise.all([Note.deleteMany(), Section.deleteMany()])

        const name = `name-${Math.random()}`
        const section = await Section.create({name: name})
        sectionId = section.id
    })

    it('Should create a new note', async () => {
        const text = `text-${Math.random()}`
        const noteId = await createNote(sectionId, text)
        const { notes } = await Section.findById(sectionId)
        const note = notes[0]

        expect(note).to.exist
        expect(note.text).to.be.equal(text)
        expect(note.id).to.be.equal(noteId)
    })

    it('Should throw and error, invalid sectionId', async () => {
        const fakeId = ObjectId().toString()
        const fakeText = 'fakeText'

        try {
            await createNote(fakeId, fakeText)
            throw new Error('Should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error.message).to.exist
            expect(typeof error.message).to.equal('string')
            expect(error.message.length).to.be.greaterThan(0)
            expect(error.message).to.equal(`board with id ${fakeId} not found`)
        }
    })

    it('Should throw a NotFoundError, wrong sectionId', async () => {
        expect(() => createNote('')).to.throw(ContentError, ' is not a valid id')
        expect(() => createNote(' \t\r')).to.throw(ContentError, ' is not a valid id')
    })

    it('Should throw a ContentError, wrong text type or empty', async () => {
        expect(() => createNote(sectionId, 1)).to.throw(ContentError, '1 is not a string')
        expect(() => createNote(sectionId, true)).to.throw(ContentError, 'true is not a string')
        expect(() => createNote(sectionId, [])).to.throw(ContentError, ' is not a string')
        expect(() => createNote(sectionId, {})).to.throw(ContentError, '[object Object] is not a string')
        expect(() => createNote(sectionId, undefined)).to.throw(ContentError, 'undefined is not a string')
        expect(() => createNote(sectionId, null)).to.throw(ContentError, 'null is not a string')
        expect(() => createNote(sectionId, '')).to.throw(ContentError, ' is empty or blank')
        expect(() => createNote(sectionId, ' \t\r')).to.throw(ContentError, ' is empty or blank')
    })
    after(() => Section.deleteMany())
})

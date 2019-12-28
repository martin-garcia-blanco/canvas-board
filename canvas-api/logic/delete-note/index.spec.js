require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const deleteNote = require('.')
const { database, ObjectId, models: { Section, Note } } = require('canvas-data')
const { errors: { ContentError } } = require('canvas-utils')


describe('logic deleteNote test', () => {
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

    it('There is a note so should delete it', async () => {
        await deleteNote(sectionId, noteId)

        const section = await Section.findById(sectionId)
        const note = section.notes[0]

        expect(note).not.to.exist
    })

    it('Should throw and error, unexpected sectionId', async () => {
        const fakeId = ObjectId().toString()

        try {
            await deleteNote(fakeId, fakeId)
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
        expect(() => deleteNote('')).to.throw(ContentError, ' is not a valid id')
        expect(() => deleteNote(' \t\r')).to.throw(ContentError, ' is not a valid id')
    })

    it('Should throw a NotFoundError, wrong noteId', async () => {
        expect(() => deleteNote('')).to.throw(ContentError, ' is not a valid id')
        expect(() => deleteNote(' \t\r')).to.throw(ContentError, ' is not a valid id')
    })

    after(() => Section.deleteMany())
})
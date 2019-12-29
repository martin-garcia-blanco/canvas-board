require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const retrieveSections = require('.')
const { database, ObjectId, models: { Board, Section, Note } } = require('canvas-data')
const { errors:{ContentError} } = require('canvas-utils')

describe('logic retrieveSections test', () => {
    before(() => database.connect(TEST_DB_URL))

    let boardId, sectionName, noteText

    beforeEach(async () => {
        await Promise.all([Board.deleteMany(), Section.deleteMany()])

        sectionName = `name-${Math.random()}`
        noteText = `text-${Math.random()}`
        const note = new Note({ text: noteText, creationDate: new Date })
        const section = await Section.create({ name: sectionName, notes: [note] })
        const board = await Board.create({ sections: [section._id] })
        boardId = board.id
    })

    it('should return an array with sections and notes', async () => {
        const sections = await retrieveSections(boardId)
        const section = sections[0]
        const note = section.notes[0]

        expect(section).to.exist
        expect(section.name).to.equal(sectionName)
        expect(section.notes).to.be.instanceOf(Array)

        expect(note).to.exist
        expect(note.text).to.equal(noteText)
        expect(note.creationDate).to.be.instanceOf(Date)
    })

    it('Should throw and error, unexpected boardId', async () => {
        const fakeId = ObjectId().toString()

        try {
            await retrieveSections(fakeId)
            throw new Error('Should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error.message).to.exist
            expect(typeof error.message).to.equal('string')
            expect(error.message.length).to.be.greaterThan(0)
            expect(error.message).to.equal(`board with id ${fakeId} not found`)
        }
    })

    it('Should throw a NotFoundError, wrong boardId', async () => {
        expect(() => retrieveSections('')).to.throw(ContentError, ' is not a valid id')
        expect(() => retrieveSections(' \t\r')).to.throw(ContentError, ' is not a valid id')
    })

    after(() => Promise.all([Board.deleteMany(), Section.deleteMany()]))

})

    describe('when board doesnt have sections', () => {
        let boardId

        before(async () => {
            await Board.deleteMany()
            const board = await Board.create({})
            boardId = board.id
        })

        it('should retrieve an empty array', async () => {
            const sections = await retrieveSections(boardId)

            expect(sections).to.exist
            expect(sections).to.be.instanceOf(Array)
            expect(sections.length).to.be.equal(0)
        })
        after(() => Board.deleteMany())
    })

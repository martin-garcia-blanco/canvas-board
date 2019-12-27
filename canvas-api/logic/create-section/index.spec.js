require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const createSection = require('./')
const { database, ObjectId, models: { Board, Section } } = require('canvas-data')

describe('logic createSection test', () => {

    before(() => database.connect(TEST_DB_URL))

    let boardId
    const name = `name-${Math.random()}`

    beforeEach(async () => {
        await Promise.all([Board.deleteMany(), Section.deleteMany()])

        const board = Board.create({})
        boardId = board.id
    })

    it('Should create a new section', async () => {
        const section = await createSection(boardId, name)

        const newSection = await Section.findById(section.id)

        expect(newSection).to.exist
        expect(newSection.name).to.be.equal(name)
        expect(newSection.id.toString()).to.be.equal(section.id.toString())
        expect(newSection.notes.length).to.be.equal(0)
    })

    it('Should throw and error, invalid boardId', async () => {
        const fakeId = ObjectId().toString()

        try {
            await createSection(fakeId, name)
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
        expect(() => createSection('')).to.throw(ContentError, 'boardId is empty or blank')
        expect(() => createSection(' \t\r')).to.throw(ContentError, 'boardId is empty or blank')
    })

    it('Should throw a ContentError, wrong name type or empty', async () => {
        expect(() => createSection(boardId, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => createSection(boardId, true)).to.throw(TypeError, 'true is not a string')
        expect(() => createSection(boardId, [])).to.throw(TypeError, ' is not a string')
        expect(() => createSection(boardId, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => createSection(boardId, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => createSection(boardId, null)).to.throw(TypeError, 'null is not a string')
        expect(() => createSection(boardId, '')).to.throw(ContentError, 'userId is empty or blank')
        expect(() => createSection(boardId, ' \t\r')).to.throw(ContentError, 'userId is empty or blank')
    })





})
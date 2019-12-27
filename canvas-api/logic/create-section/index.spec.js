require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const createSection = require('./')
const { database, ObjectId, models: { Board, Section } } = require('canvas-data')
const { errors:{ ContentError }} = require('canvas-utils')


describe('logic createSection test', () => {

    before(() => database.connect(TEST_DB_URL))

    let boardId
    const name = `name-${Math.random()}`

    beforeEach(async () => {
        await Promise.all([Board.deleteMany(), Section.deleteMany()])

        const board = await Board.create({})
        boardId = board.id
    })

    it('Should create a new section', async () => {
        const sectionId = await createSection(boardId, name)

        const newSection = await Section.findById(sectionId)

        expect(newSection).to.exist
        expect(newSection.name).to.be.equal(name)
        expect(newSection.id).to.be.equal(sectionId)
        expect(newSection.notes.length).to.be.equal(0)
    })

    it('Should throw and error, invalid boardId', async () => {
        const fakeId = ObjectId().toString()
        const fakeName = 'fakeName'

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
        expect(() => createSection('')).to.throw(ContentError, ' is not a valid id')
        expect(() => createSection(' \t\r')).to.throw(ContentError, ' is not a valid id')
    })

    it('Should throw a ContentError, wrong name type or empty', async () => {
        expect(() => createSection(boardId, 1)).to.throw(ContentError, '1 is not a string')
        expect(() => createSection(boardId, true)).to.throw(ContentError, 'true is not a string')
        expect(() => createSection(boardId, [])).to.throw(ContentError, ' is not a string')
        expect(() => createSection(boardId, {})).to.throw(ContentError, '[object Object] is not a string')
        expect(() => createSection(boardId, undefined)).to.throw(ContentError, 'undefined is not a string')
        expect(() => createSection(boardId, null)).to.throw(ContentError, 'null is not a string')
        expect(() => createSection(boardId, '')).to.throw(ContentError, ' is empty or blank')
        expect(() => createSection(boardId, ' \t\r')).to.throw(ContentError, ' is empty or blank')
    })





})
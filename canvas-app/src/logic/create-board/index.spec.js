require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const createBoard = require('.')
const { database, models: { Board } } = require('canvas-data')

describe('logic createBoard test', () => {
    before(() => database.connect(TEST_DB_URL))

    beforeEach(async () => await Board.deleteMany())

    it('There isnt a board so should create one', async () => {
        await createBoard()

        const board = await Board.findOne()
        const defaultName = 'New Board'
        expect(board).to.exist
        expect(board.name).to.equal(defaultName)
        expect(board.sections).to.be.instanceOf(Array)
        expect(board.sections.length).to.equal(0)
    })

    describe('when board already exists', () => {
        beforeEach(async () =>
            await Board.create({})
        )

        it('should fail on already existing board', () =>
            createBoard()
                .then(() => {
                    throw Error('should not reach this point')
                })
                .catch(error => {
                    expect(error).to.exist
                    expect(error.message).to.exist
                    expect(typeof error.message).to.equal('string')
                    expect(error.message.length).to.be.greaterThan(0)
                    expect(error.message).to.equal(`board already exists`)
                })
        )
    })
    after(() => Board.deleteMany())
})
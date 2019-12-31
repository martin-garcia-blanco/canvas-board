require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const retrieveBoard = require('.')
const { database, models: { Board } } = require('canvas-data')

describe('logic retrieveBoard test', () => {
    before(() => database.connect(TEST_DB_URL))

    let boardId, name

    beforeEach(async () =>{
        await Board.deleteMany()
        
        name = `name-${Math.random()}`
        const board = await Board.create({name})
        boardId = board.id
    })

    it('should return a board', async () => {
        await retrieveBoard()

        const board = await Board.findOne()
        expect(board).to.exist
        expect(board.name).to.equal(name)
        expect(board.sections).to.be.instanceOf(Array)
        expect(board.sections.length).to.equal(0)
        expect(board.id).to.equal(boardId)
    })

    describe('when board doesnt exists', () => {
        beforeEach(async () =>
            await Board.deleteMany()
        )

        it('should fail on already existing board', () =>
            retrieveBoard()
                .then(() => {
                    throw Error('should not reach this point')
                })
                .catch(error => {
                    expect(error).to.exist
                    expect(error.message).to.exist
                    expect(typeof error.message).to.equal('string')
                    expect(error.message.length).to.be.greaterThan(0)
                    expect(error.message).to.equal(`board doesn't exist`)
                })
        )
    })
    after(() => Board.deleteMany())
})
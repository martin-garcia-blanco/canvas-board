require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const updateBoard = require('.')
const { database, ObjectId, models: { Board } } = require('canvas-data')
const { errors: { ContentError } } = require('canvas-utils')


describe('logic updateBoard test', () => {
    before(() => database.connect(TEST_DB_URL))

    let boardId 

    beforeEach(async () =>{
        await Board.deleteMany()
        
        await Board.create({})
        const board = await Board.findOne()
        boardId = board.id
    })

    it('There is a board so should update it', async () => {
        const newBoardName = `boardName-${Math.random()}`
        await updateBoard(boardId, newBoardName)

        const board = await Board.findById(boardId)

        expect(board).to.exist
        expect(board.name).to.equal(newBoardName)
    })

    it('Should throw and error, unexpected boardId', async () => {
        const fakeId = ObjectId().toString()
        const fakeText = 'fakeText'

        try {
            await updateBoard(fakeId, fakeText)
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
        expect(() => updateBoard('')).to.throw(ContentError, ' is not a valid id')
        expect(() => updateBoard(' \t\r')).to.throw(ContentError, ' is not a valid id')
    })

    it('Should throw a ContentError, wrong text type or empty', async () => {
        expect(() => updateBoard(boardId, 1)).to.throw(ContentError, '1 is not a string')
        expect(() => updateBoard(boardId, true)).to.throw(ContentError, 'true is not a string')
        expect(() => updateBoard(boardId, [])).to.throw(ContentError, ' is not a string')
        expect(() => updateBoard(boardId, {})).to.throw(ContentError, '[object Object] is not a string')
        expect(() => updateBoard(boardId, undefined)).to.throw(ContentError, 'undefined is not a string')
        expect(() => updateBoard(boardId, null)).to.throw(ContentError, 'null is not a string')
        expect(() => updateBoard(boardId, '')).to.throw(ContentError, ' is empty or blank')
        expect(() => updateBoard(boardId, ' \t\r')).to.throw(ContentError, ' is empty or blank')
    })

    after(() => Board.deleteMany())
})
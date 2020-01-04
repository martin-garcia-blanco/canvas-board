require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL } } = process
const {updateBoard} = require('../index')
const { database, ObjectId, models: { Board } } = require('canvas-data')
const { errors:{ContentError} } = require('canvas-utils')


describe('logic updateBoard test', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let boardId 

    beforeEach(async () =>{
        await Board.deleteMany()
        
        const board = await Board.create({})
        boardId = board.id
    })

    it('There is a board so should update it', async () => {
        const newBoardName = `boardName-${Math.random()}`
        await updateBoard(boardId, newBoardName)

        const board = await Board.findById(boardId)

        expect(board).toBeDefined()
        expect(board.name).toBe(newBoardName)
    })

    it('Should throw and error, unexpected boardId', async () => {
        const fakeId = ObjectId().toString()
        const fakeText = 'fakeText'

        try {
            await updateBoard(fakeId, fakeText)
            throw new Error('Should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error.message).toBeDefined()
            expect(typeof error.message).toBe('string')
            expect(error.message.length).toBeGreaterThan(0)
            expect(error.message).toBe(`board with id ${fakeId} not found`)
        }
    })

    it('Should throw a NotFoundError, wrong boardId', async () => {
        expect(() => updateBoard('')).toThrow(ContentError, ' is not a valid id')
        expect(() => updateBoard(' \t\r')).toThrow(ContentError, ' is not a valid id')
    })

    it('Should throw a ContentError, wrong text type or empty', async () => {
        expect(() => updateBoard(boardId, 1)).toThrow(ContentError, '1 is not a string')
        expect(() => updateBoard(boardId, true)).toThrow(ContentError, 'true is not a string')
        expect(() => updateBoard(boardId, [])).toThrow(ContentError, ' is not a string')
        expect(() => updateBoard(boardId, {})).toThrow(ContentError, '[object Object] is not a string')
        expect(() => updateBoard(boardId, undefined)).toThrow(ContentError, 'undefined is not a string')
        expect(() => updateBoard(boardId, null)).toThrow(ContentError, 'null is not a string')
        expect(() => updateBoard(boardId, '')).toThrow(ContentError, ' is empty or blank')
        expect(() => updateBoard(boardId, ' \t\r')).toThrow(ContentError, ' is empty or blank')
    })

    afterAll(() => Board.deleteMany())
})
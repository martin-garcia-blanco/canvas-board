require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const {updateBoard} = require('../index')
const { database, ObjectId, models: { Board, User } } = require('canvas-data')
const { errors:{ContentError} } = require('canvas-utils')
const jwt = require('jsonwebtoken')

describe('logic updateBoard test', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let boardId, token

    beforeEach(async () =>{
        await Promise.all([Board.deleteMany(), User.deleteMany()])
        
        const board = await Board.create({})
        boardId = board.id

        const userName = `name-${Math.random()}`
        const email = `mail-${Math.random()}@asdf.com`
        const password = `password-${Math.random()}`
        const arr = []

        const user = await User.create({ name: userName, password, email, board: arr })
        token = jwt.sign({ sub: user.id }, TEST_SECRET)
    })

    it('There is a board so should update it', async () => {
        const newBoardName = `boardName-${Math.random()}`
        await updateBoard(boardId, newBoardName, token)

        const board = await Board.findById(boardId)

        expect(board).toBeDefined()
        expect(board.name).toBe(newBoardName)
    })

    it('Should throw and error, unexpected boardId', async () => {
        const fakeId = ObjectId().toString()
        const fakeText = 'fakeText'

        try {
            await updateBoard(fakeId, fakeText, token)
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
        expect(() => updateBoard('', token)).toThrow(ContentError, ' is not a valid id')
        expect(() => updateBoard(' \t\r', token)).toThrow(ContentError, ' is not a valid id')
    })

    it('Should throw a ContentError, wrong text type or empty', async () => {
        expect(() => updateBoard(boardId, 1, token)).toThrow(ContentError, '1 is not a string')
        expect(() => updateBoard(boardId, true, token)).toThrow(ContentError, 'true is not a string')
        expect(() => updateBoard(boardId, [], token)).toThrow(ContentError, ' is not a string')
        expect(() => updateBoard(boardId, {}, token)).toThrow(ContentError, '[object Object] is not a string')
        expect(() => updateBoard(boardId, undefined, token)).toThrow(ContentError, 'undefined is not a string')
        expect(() => updateBoard(boardId, null, token)).toThrow(ContentError, 'null is not a string')
        expect(() => updateBoard(boardId, '', token)).toThrow(ContentError, ' is empty or blank')
        expect(() => updateBoard(boardId, ' \t\r', token)).toThrow(ContentError, ' is empty or blank')
    })

    afterAll(() => Promise.all([Board.deleteMany(), User.deleteMany()]))
})
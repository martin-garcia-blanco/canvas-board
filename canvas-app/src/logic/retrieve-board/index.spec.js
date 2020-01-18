require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const {retrieveBoard} = require('../index')
const { database, models: { Board, User } } = require('canvas-data')
const jwt = require('jsonwebtoken')

describe('logic retrieveBoard test', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let boardId, name, token

    beforeEach(async () =>{
        await Promise.all([Board.deleteMany(), User.deleteMany()])
         
        name = `name-${Math.random()}`
        const board = await Board.create({name})
        boardId = board.id
       
        const userName = `name-${Math.random()}`
        const email = `mail-${Math.random()}@asdf.com`
        const password = `password-${Math.random()}`
        const arr = [boardId]
    
        const user = await User.create({name: userName, password, email, board: arr})
        token = jwt.sign({ sub: user.id }, TEST_SECRET)
    })

    it('should return a board', async () => {
        await retrieveBoard(token)

        const board = await Board.findOne()
        expect(board).toBeDefined()
        expect(board.name).toBe(name)
        expect(board.sections).toBeInstanceOf(Array)
        expect(board.sections.length).toBe(0)
        expect(board.id).toBe(boardId)
    })

    describe('when board doesnt exists', () => {
        beforeEach(async () =>
            await Board.deleteMany()
        )

        it('should success, the method creates it if it doesnt exist', async() =>{
            const unexpectedBoard = await Board.findOne()
            expect(unexpectedBoard).toBe(null)

            retrieveBoard(token)
            const board = await Board.findOne()
            expect(board).toBeDefined()
        })
    })
    afterAll(() => Promise.all([Board.deleteMany(), User.deleteMany()]))
})
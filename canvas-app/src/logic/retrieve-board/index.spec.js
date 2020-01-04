require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL } } = process
const {retrieveBoard} = require('../index')
const { database, models: { Board } } = require('canvas-data')


describe('logic retrieveBoard test', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

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

            retrieveBoard()
            const board = await Board.findOne()
            expect(board).toBeDefined()
        })
    })
    afterAll(() => Board.deleteMany())
})
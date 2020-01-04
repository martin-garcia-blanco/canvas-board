require('dotenv').config()
const { env: { REACT_APP_API_URL: TEST_SECRET, REACT_APP_TEST_DB_URL: TEST_DB_URL } } = process
const {createBoard} = require('../index')
const { database, models: { Board } } = require('canvas-data')
const { validator } = require('canvas-utils')

describe('logic createBoard test', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    beforeEach(async () => await Board.deleteMany())

    it('There isnt a board so should create one', async () => {
        await createBoard()

        const board = await Board.findOne()
        const defaultName = 'New Board'
        expect(board).toBeDefined()
        expect(board.name).toBe(defaultName)
        expect(board.sections).toBeInstanceOf(Array)
        expect(board.sections.length).toBe(0)
    })

    
    afterAll(() => Board.deleteMany())
})
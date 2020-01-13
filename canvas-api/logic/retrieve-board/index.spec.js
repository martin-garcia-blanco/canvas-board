require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveBoard = require('.')
const { database, ObjectId, models: { Board } } = require('canvas-data')
const {errors: {NotFoundError, ContentError}} = require('canvas-utils') 

describe('logic retrieveBoard test', () => {
    before(() => database.connect(TEST_DB_URL))

    let boardId, name

    beforeEach(async () => {
        await Board.deleteMany()

        name = `name-${Math.random()}`
        const board = await Board.create({ name })
        boardId = board.id
    })

    it('should return a board', async () => {
        const board = await retrieveBoard(boardId)

        expect(board).to.exist
        expect(board.name).to.equal(name)
        expect(board.sections).to.be.instanceOf(Array)
        expect(board.sections.length).to.equal(0)
        expect(board.id).to.equal(boardId)
    })

    it('wrong boardId', async()=>{
        const fakeId =  ObjectId().toString()
        try{
            await retrieveBoard(fakeId)
            throw Error('Should not reach this point')
        } catch(error){
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            const { message } = error
            expect(message).to.equal(`board with id ${fakeId} not found`)
        }
    })
    

    it('should fail on incorrect name, email, password type and content', ()=>{
        const notValidId = `wrong-board-id-${random()}`

        expect(()=> retrieveBoard( 1)).to.throw(ContentError, '1 is not a string' )
        expect(()=> retrieveBoard( true)).to.throw(ContentError, 'true is not a string' )
        expect(()=> retrieveBoard( [])).to.throw(ContentError, ' is not a string' )
        expect(()=> retrieveBoard( {})).to.throw(ContentError, '[object Object] is not a string' )
        expect(()=> retrieveBoard( undefined)).to.throw(ContentError, 'undefined is not a string' )
        expect(()=> retrieveBoard( null)).to.throw(ContentError, 'null is not a string' )
        expect(()=> retrieveBoard( '')).to.throw(ContentError, ' is not a valid id' )
        expect(()=> retrieveBoard( ' \t\r')).to.throw(ContentError, ' is not a valid id' )
        expect(()=> retrieveBoard(notValidId)).to.Throw(ContentError, `${notValidId} is not a valid id`)
    })

    after(() => Board.deleteMany())
})
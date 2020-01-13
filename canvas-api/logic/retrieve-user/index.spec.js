require ('dotenv').config()
const { env: { TEST_DB_URL, SALT } } = process
const bcrypt = require('bcryptjs')
const { expect } = require('chai')
const retrieveUser = require('.')
const { random } = Math
const { errors: { ContentError, NotFoundError }} = require('canvas-utils')
const { database, ObjectId, models: { User, Board } } = require('canvas-data')

describe('logic - retrieveUser', ()=>{

    before(()=> database.connect(TEST_DB_URL))

    let email, name, userId, boardId

    beforeEach(async ()=>{
        await Promise.all([User.deleteMany(), Board.deleteMany()])
        
        name = `name-${random()}`
        const board = await Board.create({})
        boardId = board.id
        email = `email${random()}@board.com`
        password = `password-${random()}`
        hash = await bcrypt.hash(password, parseInt(SALT));

        const user = await User.create({name,email, password: hash, board: boardId})
        userId = user.id
    })

    it('should retrieve user data', async()=>{
        const user = await retrieveUser(userId)

        expect(user).to.exist
        expect(user.name).to.equal(name)
        expect(user.email).to.equal(user.email)
        expect(user.board).to.equal(boardId)
    })

    it('wrong userId', async()=>{
        const fakeId =  ObjectId().toString()
        try{
            await retrieveUser(fakeId)
            throw Error('Should not reach this point')
        } catch(error){
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            const { message } = error
            expect(message).to.equal(`user with id ${fakeId} not found`)
        }
    })
    

    it('should fail on incorrect name, email, password type and content', ()=>{
        const notValidId = `wrong-user-id-${random()}`

        expect(()=> retrieveUser( 1)).to.throw(ContentError, '1 is not a string' )
        expect(()=> retrieveUser( true)).to.throw(ContentError, 'true is not a string' )
        expect(()=> retrieveUser( [])).to.throw(ContentError, ' is not a string' )
        expect(()=> retrieveUser( {})).to.throw(ContentError, '[object Object] is not a string' )
        expect(()=> retrieveUser( undefined)).to.throw(ContentError, 'undefined is not a string' )
        expect(()=> retrieveUser( null)).to.throw(ContentError, 'null is not a string' )
        expect(()=> retrieveUser( '')).to.throw(ContentError, ' is not a valid id' )
        expect(()=> retrieveUser( ' \t\r')).to.throw(ContentError, ' is not a valid id' )
        expect(()=> retrieveUser(notValidId)).to.Throw(ContentError, `${notValidId} is not a valid id`)
    })

    after(()=> Promise.all([User.deleteMany(), Board.deleteMany()]).then(database.disconnect))
})
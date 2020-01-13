require ('dotenv').config()
const { env: { TEST_DB_URL } } = process
const bcrypt = require('bcryptjs')
const { expect } = require('chai')
const registerUser = require('.')
const { random } = Math
const { errors: { ContentError }} = require('canvas-utils')
const { database, models: { User, Board } } = require('canvas-data')

describe('logic - registerUser', ()=>{

    before(()=> database.connect(TEST_DB_URL))

    let name, email, password

    beforeEach(async ()=>{
        name = `name-${random()}`
        email = `email${random()}@board.com`
        password = `password-${random()}`
        await Promise.all([User.deleteMany(), Board.deleteMany()])
    })

    it('should succeed on correct registration', async()=>{
        const response = await registerUser(name, email, password)
        expect(response).to.be.undefined

        const user = await User.findOne({ email })
        const valid = await bcrypt.compare(password, user.password)
        expect(user).to.exist
        expect(user.name).to.equal(name)
        expect(user.email).to.equal(user.email)
        expect(user.board).to.exist
        expect(valid).to.equal(true)
    })

    describe('when user already exists', ()=> {
        beforeEach(async() => {User.deleteMany()
            const board = new Board()
            await User.create({name, email, password, board: board.id})
        })

        it('should fail on already existing user', async()=>{
            try{
                await registerUser(name, email, password)
                throw Error('Should not reach this point')
            } catch(error){
                expect(error).to.exist
                expect(error.message).to.exist
                expect(typeof error.message).to.equal('string')
                expect(error.message.length).to.be.greaterThan(0)
                expect(error.message).to.equal(`user with email ${email} already exists`)
            }
        })
    })

    it('should fail on incorrect name, email, password type and content', ()=>{
        expect(()=> registerUser(name, email, 1)).to.throw(ContentError, '1 is not a string' )
        expect(()=> registerUser(name, email, true)).to.throw(ContentError, 'true is not a string' )
        expect(()=> registerUser(name, email, [])).to.throw(ContentError, ' is not a string' )
        expect(()=> registerUser(name, email, {})).to.throw(ContentError, '[object Object] is not a string' )
        expect(()=> registerUser(name, email, undefined)).to.throw(ContentError, 'undefined is not a string' )
        expect(()=> registerUser(name, email, null)).to.throw(ContentError, 'null is not a string' )
        //expect(()=> registerUser(name, email, '')).to.throw(ContentError, 'password is empty or blank' )
        //expect(()=> registerUser(name, email, ' \t\r')).to.throw(ContentError, 'password is empty or blank' )

        expect(()=> registerUser(name, 1)).to.throw(ContentError, '1 is not a string' )
        expect(()=> registerUser(name, true)).to.throw(ContentError, 'true is not a string' )
        expect(()=> registerUser(name, [])).to.throw(ContentError, ' is not a string' )
        expect(()=> registerUser(name, {})).to.throw(ContentError, '[object Object] is not a string' )
        expect(()=> registerUser(name, undefined)).to.throw(ContentError, 'undefined is not a string' )
        expect(()=> registerUser(name, null)).to.throw(ContentError, 'null is not a string' )
        expect(()=> registerUser(name, '')).to.throw(ContentError, ' is not an email' )
        expect(()=> registerUser(name, ' \t\r')).to.throw(ContentError, ' is not an email' )

        expect(()=> registerUser(1)).to.throw(ContentError, '1 is not a string' )
        expect(()=> registerUser(true)).to.throw(ContentError, 'true is not a string' )
        expect(()=> registerUser([])).to.throw(ContentError, ' is not a string' )
        expect(()=> registerUser({})).to.throw(ContentError, '[object Object] is not a string' )
        expect(()=> registerUser(undefined)).to.throw(ContentError, 'undefined is not a string' )
        expect(()=> registerUser(null)).to.throw(ContentError, 'null is not a string' )
        expect(()=> registerUser('')).to.throw(ContentError, 'undefined is not a string' )
        expect(()=> registerUser(' \t\r')).to.throw(ContentError, 'undefined is not a string' )
    })

    after(()=> Promise.all([User.deleteMany(), Board.deleteMany()]).then(database.disconnect))
})
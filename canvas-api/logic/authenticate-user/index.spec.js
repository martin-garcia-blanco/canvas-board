require ('dotenv').config()
const { env: { TEST_DB_URL, SALT } } = process
const bcrypt = require('bcryptjs')
const { expect } = require('chai')
const authenticateUser = require('.')
const { random } = Math
const { errors: { ContentError, CredentialsError }} = require('canvas-utils')
const { database, models: { User, Board } } = require('canvas-data')

describe('logic - authenticateUser', ()=>{

    before(()=> database.connect(TEST_DB_URL))

    let email, password, name, userId

    beforeEach(async ()=>{
        await Promise.all([User.deleteMany(), Board.deleteMany()])
        
        name = `name-${random()}`
        const board = await Board.create({})
        email = `email${random()}@board.com`
        password = `password-${random()}`
        hash = await bcrypt.hash(password, parseInt(SALT));

        const user = await User.create({name,email, password: hash, board: board.id})
        userId = user.id
    })

    it('should succeed on correct authetication', async()=>{
        debugger
        const _userId = await authenticateUser(email, password)
        expect(_userId).to.equal(userId)

        user = await User.findById(_userId)
        debugger
        const valid = await bcrypt.compare(password, user.password)
        expect(user).to.exist
        expect(user.name).to.equal(name)
        expect(user.email).to.equal(user.email)
        expect(user.board).to.exist
        expect(valid).to.equal(true)
    })

    describe('when insert wrong credentials', ()=> {
        beforeEach(async() => {User.deleteMany()
            const board = new Board()
            await User.create({name, email, password, board: board.id})
            const a= 3
        })

        it('wrong email', async()=>{
            try{
                const fakeEmail = `fakeEmail-${random()}@123.com`
                await authenticateUser(fakeEmail, password)
                throw Error('Should not reach this point')
            } catch(error){
                expect(error).to.exist
                expect(error).to.be.an.instanceOf(CredentialsError)

                const { message } = error
                expect(message).to.equal(`wrong credentials`)
            }
        })
   

        it('wrong pass', async()=>{
            try{
                const fakePassword = `fakePassword-${random()}`
                await authenticateUser(email, fakePassword)
                throw Error('Should not reach this point')
            } catch(error){
                expect(error).to.exist
                expect(error).to.be.an.instanceOf(CredentialsError)

                const { message } = error
                expect(message).to.equal(`wrong credentials`)
            }
        })
    })

    it('should fail on incorrect name, email, password type and content', ()=>{
        expect(()=> authenticateUser( email, 1)).to.throw(ContentError, '1 is not a string' )
        expect(()=> authenticateUser( email, true)).to.throw(ContentError, 'true is not a string' )
        expect(()=> authenticateUser( email, [])).to.throw(ContentError, ' is not a string' )
        expect(()=> authenticateUser( email, {})).to.throw(ContentError, '[object Object] is not a string' )
        expect(()=> authenticateUser( email, undefined)).to.throw(ContentError, 'undefined is not a string' )
        expect(()=> authenticateUser( email, null)).to.throw(ContentError, 'null is not a string' )
        //expect(()=> authenticateUser( email, '')).to.throw(ContentError, 'password is empty or blank' )
        //expect(()=> authenticateUser( email, ' \t\r')).to.throw(ContentError, 'password is empty or blank' )

        expect(()=> authenticateUser( 1)).to.throw(ContentError, '1 is not a string' )
        expect(()=> authenticateUser( true)).to.throw(ContentError, 'true is not a string' )
        expect(()=> authenticateUser( [])).to.throw(ContentError, ' is not a string' )
        expect(()=> authenticateUser( {})).to.throw(ContentError, '[object Object] is not a string' )
        expect(()=> authenticateUser( undefined)).to.throw(ContentError, 'undefined is not a string' )
        expect(()=> authenticateUser( null)).to.throw(ContentError, 'null is not a string' )
        expect(()=> authenticateUser( '')).to.throw(ContentError, ' is not an email' )
        expect(()=> authenticateUser( ' \t\r')).to.throw(ContentError, ' is not an email' )
    })

    after(()=> Promise.all([User.deleteMany(), Board.deleteMany()]).then(database.disconnect))
})
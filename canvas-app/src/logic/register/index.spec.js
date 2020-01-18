require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL } } = process
const { register } = require('../index')
const { database, models: { User } } = require('canvas-data')
const { errors: { ContentError } } = require('canvas-utils')
const bcrypt = require('bcryptjs')


describe('logic register test', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    beforeEach(async () => {
        await User.deleteMany()
    })

    it('should register properly', async () => {
        const name = `name-${Math.random()}`
        const email = `mail-${Math.random()}@asdf.com`
        const password = `password${Math.random()}`

        await register(name, email, password)
        const user = await User.findOne({ email })

        expect(user).toBeDefined()
        expect(user.name).toBe(name)
        expect(user.email).toBe(email)
    })

    it('Should throw and error, invalid email', async () => {
        const fakeEmail = `email-${Math.random()}@.com`
        const name = `name-${Math.random()}`
        const password = `password${Math.random()}`
        
        try {
            await register(name, fakeEmail, password, password)
            throw new Error('Should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error.message).toBeDefined()
            expect(typeof error.message).toBe('string')
            expect(error.message.length).toBeGreaterThan(0)
            expect(error.message).toBe(`${fakeEmail} is not an email`)
        }
    }) 
    
    it('Should throw a ContentError, wrong text type or empty', async () => {
        const name = `name-${Math.random()}`
        const email = `mail-${Math.random()}@asdf.com`
        const password = `password${Math.random()}`

        expect(() => register(1)).toThrow(ContentError, '1 is not a string')
        expect(() => register(true)).toThrow(ContentError, 'true is not a string')
        expect(() => register([])).toThrow(ContentError, ' is not a string')
        expect(() => register({})).toThrow(ContentError, '[object Object] is not a string')
        expect(() => register(undefined)).toThrow(ContentError, 'undefined is not a string')
        expect(() => register(null)).toThrow(ContentError, 'null is not a string')
        //expect(() => register('')).toThrow(ContentError, ' is empty or blank')
        //expect(() => register(' \t\r')).toThrow(ContentError, ' is empty or blank')
        
        expect(() => register(name, 1)).toThrow(ContentError, '1 is not a string')
        expect(() => register(name, true)).toThrow(ContentError, 'true is not a string')
        expect(() => register(name, [])).toThrow(ContentError, ' is not a string')
        expect(() => register(name, {})).toThrow(ContentError, '[object Object] is not a string')
        expect(() => register(name, undefined)).toThrow(ContentError, 'undefined is not a string')
        expect(() => register(name, null)).toThrow(ContentError, 'null is not a string')
        //expect(() => register(name, '')).toThrow(ContentError, ' is empty or blank')
        //expect(() => register(name, ' \t\r')).toThrow(ContentError, ' is empty or blank')

        expect(() => register(name, email, 1)).toThrow(ContentError, '1 is not a string')
        expect(() => register(name, email, true)).toThrow(ContentError, 'true is not a string')
        expect(() => register(name, email, [])).toThrow(ContentError, ' is not a string')
        expect(() => register(name, email, {})).toThrow(ContentError, '[object Object] is not a string')
        expect(() => register(name, email, undefined)).toThrow(ContentError, 'undefined is not a string')
        expect(() => register(name, email, null)).toThrow(ContentError, 'null is not a string')
    })

    describe('logic register test', () => {
        let name, email, password

        beforeEach(async () => {
            await User.deleteMany()
            
            name = `name-${Math.random()}`
            email = `mail-${Math.random()}@asdf.com`
            password = `password-${Math.random()}`
            const board = []

            await User.create({name, password, email, board})
        })

        it('Should throw and error, user already exists', async () => {
            try {
                await register(name, email, password, password)
                throw new Error('Should not reach this point')
            } catch (error) {
                expect(error).toBeDefined()
                expect(error.message).toBeDefined()
                expect(typeof error.message).toBe('string')
                debugger
                expect(error.message.length).toBeGreaterThan(0)
                expect(error.message).toBe(`user with email ${email} already exists`)
            }
        }) 
    })

    afterAll(() => Promise.all([Board.deleteMany(), User.deleteMany(), Section.deleteMany()]))
    
})


//user with email ${email} already exists
    /* it('Should throw and error, wrong email', async () => {
        const fakeEmail = `email-${Math.random()}@asdf.com`
    
        try {
            await register(fakeEmail, password)
            throw new Error('Should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error.message).toBeDefined()
            expect(typeof error.message).toBe('string')
            expect(error.message.length).toBeGreaterThan(0)
            expect(error.message).toBe(`wrong credentials`)
        }
    }) */
require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_SALT: SALT } } = process
const { authentication } = require('../index')
const { database, models: { User } } = require('canvas-data')
const { errors: { ContentError } } = require('canvas-utils')
const bcrypt = require('bcryptjs')


describe('logic authentication test', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let userId, email, password

    beforeEach(async () => {
        await  User.deleteMany()

        const userName = `name-${Math.random()}`
        email = `mail-${Math.random()}@asdf.com`
        password = `password${Math.random()}`
        const hash = await bcrypt.hash(password, parseInt(SALT))
        const arr = []

        const user = await User.create({ name: userName, password: hash, email, board: arr })
        userId = user.id
    })

    it('should authenticate properly', async () => {
        const token = await authentication(email, password)
    
        expect(token).toBeDefined()
        expect(typeof token).toBe('string')
        expect(token.length).toBeGreaterThan(0)
    
        const [, payload, ] = token.split('.')
        const { sub: id } = JSON.parse(atob(payload))
    
        expect(id).toBe(userId)
    })

    it('Should throw and error, wrong email', async () => {
        const fakeEmail = `email-${Math.random()}@asdf.com`

        try {
            await authentication(fakeEmail, password)
            throw new Error('Should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error.message).toBeDefined()
            expect(typeof error.message).toBe('string')
            expect(error.message.length).toBeGreaterThan(0)
            expect(error.message).toBe(`wrong credentials`)
        }
    })

    it('Should throw and error, wrong password', async () => {
        const fakePassword = `password-${Math.random()}@.com`

        try {
            await authentication(email, fakePassword)
            throw new Error('Should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error.message).toBeDefined()
            expect(typeof error.message).toBe('string')
            expect(error.message.length).toBeGreaterThan(0)
            expect(error.message).toBe(`wrong credentials`)
        }
    })

    it('Should throw and error, invalid email', async () => {
        const fakeEmail = `email-${Math.random()}@.com`

        try {
            await authentication(fakeEmail, password)
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
        expect(() => authentication(1)).toThrow(ContentError, '1 is not a string')
        expect(() => authentication(true)).toThrow(ContentError, 'true is not a string')
        expect(() => authentication([])).toThrow(ContentError, ' is not a string')
        expect(() => authentication({})).toThrow(ContentError, '[object Object] is not a string')
        expect(() => authentication(undefined)).toThrow(ContentError, 'undefined is not a string')
        expect(() => authentication(null)).toThrow(ContentError, 'null is not a string')
        //expect(() => authentication('')).toThrow(ContentError, ' is empty or blank')
        //expect(() => authentication(' \t\r')).toThrow(ContentError, ' is empty or blank')

        expect(() => authentication(email, 1)).toThrow(ContentError, '1 is not a string')
        expect(() => authentication(email, true)).toThrow(ContentError, 'true is not a string')
        expect(() => authentication(email, [])).toThrow(ContentError, ' is not a string')
        expect(() => authentication(email, {})).toThrow(ContentError, '[object Object] is not a string')
        expect(() => authentication(email, undefined)).toThrow(ContentError, 'undefined is not a string')
        expect(() => authentication(email, null)).toThrow(ContentError, 'null is not a string')
        //expect(() => authentication(email, '')).toThrow(ContentError, ' is empty or blank')
        //expect(() => authentication(email, ' \t\r')).toThrow(ContentError, ' is empty or blank')
    })
    afterAll(() => Promise.all([Board.deleteMany(), User.deleteMany(), Section.deleteMany()]))

})

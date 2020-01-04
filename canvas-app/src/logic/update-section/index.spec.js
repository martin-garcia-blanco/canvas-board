require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL } } = process
const {updateSection} = require('../index')
const { database, ObjectId, models: { Section } } = require('canvas-data')
const { errors:{ContentError} } = require('canvas-utils')

describe('logic updateSection test', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let sectionId 

    beforeEach(async () =>{
        await Section.deleteMany()
        
        const name = `name-${Math.random()}`
        const section = await Section.create({name})
        sectionId = section.id
    })

    it('There is a section so should update it', async () => {
        const newSectionName = `sectionName-${Math.random()}`
        await updateSection(sectionId, newSectionName)

        const section = await Section.findById(sectionId)

        expect(section).toBeDefined()
        expect(section.name).toBe(newSectionName)
    })

    it('Should throw and error, unexpected sectionId', async () => {
        const fakeId = ObjectId().toString()
        const fakeName = 'fakeName'

        try {
            await updateSection(fakeId, fakeName)
            throw new Error('Should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error.message).toBeDefined()
            expect(typeof error.message).toBe('string')
            expect(error.message.length).toBeGreaterThan(0)
            expect(error.message).toBe(`section with id ${fakeId} not found`)
        }
    })

    it('Should throw a NotFoundError, wrong sectionId', async () => {
        expect(() => updateSection('')).toThrow(ContentError, ' is not a valid id')
        expect(() => updateSection(' \t\r')).toThrow(ContentError, ' is not a valid id')
    })

    it('Should throw a ContentError, wrong text type or empty', async () => {
        expect(() => updateSection(sectionId, 1)).toThrow(ContentError, '1 is not a string')
        expect(() => updateSection(sectionId, true)).toThrow(ContentError, 'true is not a string')
        expect(() => updateSection(sectionId, [])).toThrow(ContentError, ' is not a string')
        expect(() => updateSection(sectionId, {})).toThrow(ContentError, '[object Object] is not a string')
        expect(() => updateSection(sectionId, undefined)).toThrow(ContentError, 'undefined is not a string')
        expect(() => updateSection(sectionId, null)).toThrow(ContentError, 'null is not a string')
        expect(() => updateSection(sectionId, '')).toThrow(ContentError, ' is empty or blank')
        expect(() => updateSection(sectionId, ' \t\r')).toThrow(ContentError, ' is empty or blank')
    })

    afterAll(() => Section.deleteMany())
})
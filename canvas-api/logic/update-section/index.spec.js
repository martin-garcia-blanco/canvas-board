require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const updateSection = require('.')
const { database, ObjectId, models: { Section } } = require('canvas-data')
const { errors: { ContentError } } = require('canvas-utils')


describe('logic updateSection test', () => {
    before(() => database.connect(TEST_DB_URL))

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

        expect(section).to.exist
        expect(section.name).to.equal(newSectionName)
    })

    it('Should throw and error, unexpected sectionId', async () => {
        const fakeId = ObjectId().toString()
        const fakeName = 'fakeName'

        try {
            await updateSection(fakeId, fakeName)
            throw new Error('Should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error.message).to.exist
            expect(typeof error.message).to.equal('string')
            expect(error.message.length).to.be.greaterThan(0)
            expect(error.message).to.equal(`section with id ${fakeId} not found`)
        }
    })

    it('Should throw a NotFoundError, wrong sectionId', async () => {
        expect(() => updateSection('')).to.throw(ContentError, ' is not a valid id')
        expect(() => updateSection(' \t\r')).to.throw(ContentError, ' is not a valid id')
    })

    it('Should throw a ContentError, wrong text type or empty', async () => {
        expect(() => updateSection(sectionId, 1)).to.throw(ContentError, '1 is not a string')
        expect(() => updateSection(sectionId, true)).to.throw(ContentError, 'true is not a string')
        expect(() => updateSection(sectionId, [])).to.throw(ContentError, ' is not a string')
        expect(() => updateSection(sectionId, {})).to.throw(ContentError, '[object Object] is not a string')
        expect(() => updateSection(sectionId, undefined)).to.throw(ContentError, 'undefined is not a string')
        expect(() => updateSection(sectionId, null)).to.throw(ContentError, 'null is not a string')
        expect(() => updateSection(sectionId, '')).to.throw(ContentError, ' is empty or blank')
        expect(() => updateSection(sectionId, ' \t\r')).to.throw(ContentError, ' is empty or blank')
    })

    after(() => Section.deleteMany())
})
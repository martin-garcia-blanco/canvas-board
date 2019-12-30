require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const deleteSection = require('.')
const { database, ObjectId, models: { Section } } = require('canvas-data')
const { errors: { ContentError } } = require('canvas-utils')


describe('logic deleteSection test', () => {
    before(() => database.connect(TEST_DB_URL))

    let sectionId 

    beforeEach(async () =>{
        await Section.deleteMany()
        
        const name = `name-${Math.random()}`
        const section = await Section.create({name})
        sectionId = section.id
    })

    it('There is a section so should delete it', async () => {
        await deleteSection(sectionId)

        const section = await Section.findById(sectionId)

        expect(section).not.to.exist
    })

    it('Should throw and error, unexpected sectionId', async () => {
        const fakeId = ObjectId().toString()

        try {
            await deleteSection(fakeId)
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
        expect(() => deleteSection('')).to.throw(ContentError, ' is not a valid id')
        expect(() => deleteSection(' \t\r')).to.throw(ContentError, ' is not a valid id')
    })


    after(() => Section.deleteMany())
})
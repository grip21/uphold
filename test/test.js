const expect  = require('chai').expect;
const request = require('request');
const assert = require('assert');
const chai = require('chai')
const server = require('../app')
const bot = require('../routes/upholdBot')
const chaiHttp = require('chai-http');
chai.use(chaiHttp)


describe('GET clients', () =>{
    it('should GET all the clients', async () => {
        await chai.request(server)
            .get('/client')
            .end((err,res,done) =>{
                expect(res).to.be.an('array').lengthOf(4);
                expect(res).to.have.property('clientid');
                expect(res).to.have.property('clientpat');
                should.exist(res);
                should.have.status(200);
                done();
            })
    });
})


describe('GET ticker', () => {
    it('resolves with ticker', async (err,res,done) => {
        const tick = await bot.ticker();

        console.log("FUCK:",tt);
        expect(tick).to.be.an('array').lengthOf(1);
        done();
        //expect(tt).to.have.property('ask')
        })
    })


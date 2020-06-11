const expect  = require('chai').expect;
const request = require('request');
const assert = require('assert');
const chai = require('chai')
const server = require('../app')
const bot = require('../routes/upholdBot')
const chaiHttp = require('chai-http');
chai.use(chaiHttp)


it('should GET all the clients', function (done) {
     chai.request(server)
        .get('/client')
        .end(function(err,res) {
            expect(res).to.be.an('array').lengthOf(4);
            expect(res).to.have.property('clientid');
            expect(res).to.have.property('clientpat');
            should.exist(res);
            should.have.status(200);
            done();
        })
});

/*
it('resolves with ticker', async (err,res,done) => {
    const tick = await bot.ticker();
    expect(tick).to.be.an('array').lengthOf(1);
    done();
    //expect(tt).to.have.property('ask')
})
*/


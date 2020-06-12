const app = require('../app')
const chai = require('chai')
const chaiHttp = require('chai-http')
const mocha = require("mocha");
const describe = mocha.describe
const expect = chai.expect
const it = mocha.it
chai.use(chaiHttp)

describe('GET /client',() => {
    it('returns the bot data', (done) => {
             chai.request(app).get('/client')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.lengthOf(1);
                done();
            });
    });
});

describe('GET /cards',() => {
    it('returns the list of cards', (done) => {
        chai.request(app).get('/cards')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.lengthOf(2);
                done();
            });
    });
});

describe('GET /transactions',() => {
    it('returns the list of transactions', (done) => {
        chai.request(app).get('/transactions')
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});



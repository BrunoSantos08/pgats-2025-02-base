const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const app = require('../../../rest/app');
const checkoutService = require('../../../src/services/checkoutService');

describe('Testes de API Rest para checkout utilizando Controller', () => {
    before(async () => {
        const respostaLogin = await request(app)
            .post('/api/users/login')
            .send({
                email: 'bob@email.com',
                password: '123456'
            });
        token = respostaLogin.body.token;
    });

    afterEach(() => {
        sinon.restore();
    })

    const testesSucesso = require('../fixture/postCheckout.json');

    it(`Receber 200 ao realizar um checkout com sucesso`, async () => {
        //const testesSucesso = require('../fixture/postCheckout.json');
        const respostaEsperada = require('../fixture/respostaPostChekout.json');
        const checkoutServiceMock = sinon.stub(checkoutService, 'checkout');
        checkoutServiceMock.returns(testesSucesso);

        const resposta = await request(app)
            .post('/api/checkout')
            .set('Authorization', `Bearer ${token}`)
            .send(testesSucesso);

        expect(resposta.status).to.equal(200);
        expect(resposta.body).to.deep.equal(respostaEsperada);
    });

    it(`Receber 401 ao realizar uma requisição sem o token de autenticação`, async () => {
        const checkoutServiceMock = sinon.stub(checkoutService, 'checkout');
        checkoutServiceMock.throws(new Error('Token inválido'));

        const resposta = await request(app)
            .post('/api/checkout')
            .set('Authorization', `Token-invalido`)
            .send(testesSucesso);

        expect(resposta.status).to.equal(401);
        expect(resposta.body).to.have.property('error', 'Token inválido');
    }); 
});

const request = require('supertest');
const { expect } = require('chai');

const baseUrl = 'http://localhost:3000';

describe('Testes de API Rest para checkout utilizando HTTP', () => {
    before(async () => {
        const respostaLogin = await request(baseUrl)
            .post('/api/users/login')
            .send({
                email: 'bob@email.com',
                password: '123456'
            });
        token = respostaLogin.body.token;
    });


    const testesSucesso = require('../fixture/postCheckout.json');

    it(`Receber 200 ao realizar um checkout com sucesso`, async () => {
        const respostaEsperada = require('../fixture/respostaPostChekoutExternal.json');
    
        const resposta = await request(baseUrl)
            .post('/api/checkout')
            .set('Authorization', `Bearer ${token}`)
            .send(testesSucesso);

        expect(resposta.status).to.equal(200);
        expect(resposta.body).to.deep.equal(respostaEsperada);
    });

    it(`Receber 401 ao realizar uma requisição sem o token de autenticação`, async () => {

        const resposta = await request(baseUrl)
            .post('/api/checkout')
            .set('Authorization', `Token-invalido`)
            .send(testesSucesso);

        expect(resposta.status).to.equal(401);
        expect(resposta.body).to.have.property('error', 'Token inválido');
    }); 
});

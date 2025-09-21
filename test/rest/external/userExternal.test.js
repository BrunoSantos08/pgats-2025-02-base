const request = require('supertest');
const { expect } = require('chai');
const { faker } = require('@faker-js/faker');

const baseUrl = 'http://localhost:3000';

describe('Testes de API Rest para usuário utilizando HTTP', () => {

    it(`Receber 201 ao realizar um registro de um novo usuário com dados válidos`, async () => {
        const nome = faker.name.firstName();
        const email = faker.internet.email();

        const resposta = await request(baseUrl)
            .post('/api/users/register')
            .send({
                name: nome,
                email: email,
                password: '123456'
            });

        expect(resposta.status).to.equal(201);
        expect(resposta.body.user).to.have.property('name', nome);
        expect(resposta.body.user).to.have.property('email', email);
    });

    it(`Receber 200 ao realizar um login com credenciais válidas`, async () => {
        const resposta = await request(baseUrl)
            .post('/api/users/login')
            .send({
                email: 'bob@email.com',
                password: '123456'
            });

        expect(resposta.status).to.equal(200);
        expect(resposta.body).to.have.property('token');
    });

    it(`Receber 400 ao realizar um registro com um e-mail já cadastrado`, async () => {
        const resposta = await request(baseUrl)
            .post('/api/users/register')
            .send({
                name: 'bob',
                email: 'bob@email.com',
                password: '123456'
            });

        expect(resposta.status).to.equal(400);
        expect(resposta.body).to.have.property('error', 'Email já cadastrado');
    });

});

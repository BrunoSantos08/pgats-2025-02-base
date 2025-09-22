const request = require('supertest');
const { expect } = require('chai');
const { faker } = require('@faker-js/faker');

const baseUrl = 'http://localhost:4000/graphql';

describe('Testes de API Graphql para usuário utilizando HTTP', () => {

    it(`Receber 200 ao realizar um registro de um novo usuário com dados válidos`, async () => {
        const registroSucesso = require('../fixture/request/registerUser.json');
        registroSucesso.variables.name = faker.name.firstName();
        registroSucesso.variables.email = faker.internet.email();

        const resposta = await request(baseUrl)
            .post('')
            .send(registroSucesso);

        expect(resposta.status).to.equal(200);
        expect(resposta.body.data.register).to.have.property('name', registroSucesso.variables.name);
        expect(resposta.body.data.register).to.have.property('email', registroSucesso.variables.email);
    });

    it(`Receber 200 ao realizar um login com credenciais válidas`, async () => {
        const loginSucesso = require('../fixture/request/loginUser.json');
        const resposta = await request(baseUrl)
            .post('')
            .send(loginSucesso);

        expect(resposta.status).to.equal(200);
        expect(resposta.body.data.login).to.have.property('token');
    });

    it(`Realizar um registro com um e-mail já cadastrado`, async () => {
        const erroRegistro = require('../fixture/request/registerUserWithErros.json');
        const resposta = await request(baseUrl)
            .post('')
            .send(erroRegistro);

        expect(resposta.status).to.equal(200);
        expect(resposta.body.errors[0].message).to.equal('Email já cadastrado');
    });

});

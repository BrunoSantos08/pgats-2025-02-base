const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const app = require('../../../rest/app');
const userService = require('../../../src/services/userService');

describe('Testes de API Rest para usuário utilizando Controller', () => {
    afterEach(() => {
        sinon.restore();
    })


    it(`Receber 201 ao realizar um registro de um novo usuário com dados válidos`, async () => {
        const userServiceMock = sinon.stub(userService, 'registerUser');
        userServiceMock.returns({
            name: 'bruno',
            email: 'bruno@email.com',
            password: '123456'
        });

        const resposta = await request(app)
            .post('/api/users/register')
            .send({
                name: 'bruno',
                email: 'bruno@email.com',
                password: '123456'
            });

        expect(resposta.status).to.equal(201);
        expect(resposta.body.user).to.have.property('name', 'bruno');
        expect(resposta.body.user).to.have.property('email', 'bruno@email.com');
        expect(resposta.body.user).to.have.property('password', '123456');
    });

    it(`Receber 200 ao realizar um login com credenciais válidas`, async () => {
        const userServiceMock = sinon.stub(userService, 'authenticate');
        userServiceMock.returns({ token: 'token-valido' });

        const resposta = await request(app)
            .post('/api/users/login')
            .send({
                email: 'bob@email.com',
                password: '123456'
            });

        expect(resposta.status).to.equal(200);
        expect(resposta.body).to.have.property('token', 'token-valido');
    });

    it(`Receber 400 ao realizar um registro com um e-mail já cadastrado`, async () => {
        const userServiceMock = sinon.stub(userService, 'registerUser');
        userServiceMock.returns(null);

        const resposta = await request(app)
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

import {test, expect, it, describe, beforeAll, afterAll} from 'vitest'
import userService from '../../src/services/user'
import IUser from '../../src/interfaces/IUser'
import connection from '../../src/database/connectionDatabaseTest'
import user from '../../src/repositories/user'
import app from '../../src/app'
import supertest from 'supertest'
import path from 'path'
app.listen(4077)
let token: string

const image = path.resolve(__dirname, 'temp', 'teste.jpg')
const image2 = path.resolve(__dirname, 'temp', 'editar.png')


 

beforeAll(async ()=> {
    new connection().execute()
})

const userNotAcceptable:IUser = {
    name: '',
    email: '@@',
    password: 'senha de teste',

}
const userAcceptable:IUser = {
    name: `Paulo${Date.now()}`,
    email: `paulo13paulo423${Date.now()}@gmail.com`,
    password: 'sdsadsadsa',
}
describe('user service tests', ()=>{
    it('should not create user with empty name', async ()=> {
            await expect( userService.createUserInstance(userNotAcceptable)).rejects.toThrow()
    })
    it('should crate user instance', async ()=> {
     
       let user = await userService.createUserInstance(userAcceptable)
       expect(user).toBeInstanceOf(userService)
    
    })


})
describe('cadastro',()=>{
    it('deve cadastrar um usuario', async ()=>{
        const response = await supertest(app).post('/user').send({user: userAcceptable})
        expect(response.body).ownProperty('token') 
        

        const responseToken = `Bearer ${response.body.token}`
        if(responseToken) token = responseToken

    })
    it('deve fazer upload de uma imagem', async ()=> {
        const response = await supertest(app).post('/img-profile').set('authorization', token).attach('profileImg',image)
        expect(response.body).ownProperty('token')
        expect(response.body).ownProperty('imgSrc')
    })
})

describe('login', () => {
    it('deve fazer o login do usuario', async ()=> {
        const response = await supertest(app).post('/login').send({user: userAcceptable})
        expect(response.body).ownProperty('token') 

        token = `Bearer ${response.body.token}`

    })
  /*   it('não deve fazer o login do usuario de um usuario com nome incorreto', async ()=> {
        userAcceptable.name = '                      kmkmlmkkjwjw'
        expect(await supertest(app).post('/login').send({user: userAcceptable})).rejects.toThrow()
    }) */
})
describe('editar imagem', ()=> {
    it('deve editar uma imagem', async () => {
        const response = await supertest(app).put('/img-profile').set('authorization', token).attach('profileImg',image2)
        expect(response.body).ownProperty('token')

    })
})
describe('crud de usuario', ()=> {
    it('deve editar o nome do usuario', async ()=> {
        const response = await supertest(app).put('/user').set('authorization', token).send({user: {userName: `Paulo Ribas 33 ${Date.now()}`}})
        expect(response.body).ownProperty('token')
    })
    it('deve editar o email do usuario', async ()=> {

        let newEmail = `paulo24paulo23${Date.now()}@gmail.com`

        const response = await supertest(app).put('/user').set('authorization', token).send({user: {userEmail:  newEmail}})
        expect(response.body).ownProperty('token')

        userAcceptable.email = newEmail

    })
    it('deve editar a senha do usuario', async ()=> {
        const response = await supertest(app).put('/user').set('authorization', token).send({user: {password: `paulo24paulo23${Date.now()}@gmail.com`}})
        expect(response.body).ownProperty('token')
    })
})
describe('token', ()=> {
    it('deve criar um token e enviar o email', async()=> {
        const response = await supertest(app).post('/recovery-token').send({email: userAcceptable.email})
        expect(response.statusCode).toBe(200)

    })
})
afterAll(async()=> {
     
    new connection().close()
})
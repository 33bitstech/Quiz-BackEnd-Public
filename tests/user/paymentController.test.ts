import {test, expect, it, describe, beforeAll, afterAll} from 'vitest'
import { orderCreditCard, orderPix } from './utils/orderObject'
import connection from '../../src/database/connectionDatabaseTest'
import payment from '../../src/services/payment'
import ICustomer from '../../src/interfaces/orders/ICustomer'
import app from '../../src/app'
import supertest from 'supertest'

let token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4M2U4ODI2ZC0zMmVjLTQ0OTYtOWRiOC05ZmJhM2MzYmJmYjIiLCJuYW1lIjoiUGF1bG8xNzIzMTYzMDMxODQzIiwiZW1haWwiOiJwYXVsbzEzcGF1bG80MjMxNzIzMTYzMDMxODQzQGdtYWlsLmNvbSIsInByb2ZpbGVJbWciOiJodHRwczovL3F1aXp2b3J0ZXguczMuc2EtZWFzdC0xLmFtYXpvbmF3cy5jb20vcHJvZmlsZXNpbWcvcHJvZmlsZUltZy03ODllOGVkYmM1YTZkZTg2YzcyYTE1NWM2YjVjZTcwY2M0NjkyMzEyNTQ1ZmJmNDk1NDk2ZTUxMmIyMjI4NmMzLTE3MjMxNjMwMzI3MzAiLCJpYXQiOjE3MjMxNjMwMzQsImV4cCI6MTcyMzc2NzgzNH0.6ZtBbUJtr-ZVW1gQztcA7gXIaUQmIL1Y49ACyYsb-xY'

let order_id = '',
reference_id = ''


let customer: ICustomer = {
    name: 'Paulo Ribas',
    email:'ovatsugavlis15@gmail.com',
    tax_id: '13535377498', // minimo 11 e max 14
    phone: {
        coutry: 55,
        area: 11,
        number: 9999999,
    },}

beforeAll(async ()=> {
    new connection().execute()
})
describe('orders and payments', async ()=> {
    it('deve criar uma order', async ()=>{
        const response = await supertest(app).post('/order').send({customer: customer}).set('Authorization', token)
        expect(response.body).ownProperty('order_id') 
        

        order_id =  response.body.order_id
        reference_id = response.body.reference_id
    })
    it('deve pagar uma order', async()=> {
        let encryptedCard = 'GJ5nhwW2bTcqCJktxgPW+wRK6rnrBBgzu9c8JrM6BYr2PLIQ04UQKVobpLlLIqAttgcoaTGUHkb4ekCQ53j/RycC58m/jl/lnG5feF0Kx28L3JLwHiuDFsCCU9tiVoejOkmfCq+p5Qp8gSPyffLQlhbqe5GnOMYF6udnWN+HR/gGePuy+8Ka1GgAlaTvzaw0WgdOrAEyIYgyR72qoApZchYDfXq6BIOlfxWI3wYkYtQGCXtR3uvB0Hze3531PQyqvyUvdgi5wn0qoOBLcf9ziglgd5lnlxUWZoq5Z+J5QkAuFc5xvjIjvYyYHzeTIA87kP/KMFpsInZ8lWESvCvbHMg=='
        const response = await supertest(app).post('/pay-once').send({order_id, reference_id, encryptedCard}).set('Authorization', token) 
        expect(response.body).ownProperty('payed')

    })
    it('should create an order with pix',async ()=>{
        const response = await supertest(app).post('/generate-order-pix').send({customer: customer}).set('Authorization', token)
        expect(response.body).ownProperty('order_id') 
         
    })
    
})


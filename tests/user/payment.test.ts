import {test, expect, it, describe, beforeAll, afterAll} from 'vitest'
import { orderCreditCard, orderPix } from './utils/orderObject'
import payment from '../../src/services/payment'
import ICustomer from '../../src/interfaces/orders/ICustomer'
import { createUUID } from '../../src/utils/ids'

let token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4M2U4ODI2ZC0zMmVjLTQ0OTYtOWRiOC05ZmJhM2MzYmJmYjIiLCJuYW1lIjoiUGF1bG8xNzIzMTYzMDMxODQzIiwiZW1haWwiOiJwYXVsbzEzcGF1bG80MjMxNzIzMTYzMDMxODQzQGdtYWlsLmNvbSIsInByb2ZpbGVJbWciOiJodHRwczovL3F1aXp2b3J0ZXguczMuc2EtZWFzdC0xLmFtYXpvbmF3cy5jb20vcHJvZmlsZXNpbWcvcHJvZmlsZUltZy03ODllOGVkYmM1YTZkZTg2YzcyYTE1NWM2YjVjZTcwY2M0NjkyMzEyNTQ1ZmJmNDk1NDk2ZTUxMmIyMjI4NmMzLTE3MjMxNjMwMzI3MzAiLCJpYXQiOjE3MjMxNjMwMzQsImV4cCI6MTcyMzc2NzgzNH0.6ZtBbUJtr-ZVW1gQztcA7gXIaUQmIL1Y49ACyYsb-xY'
let order:any

let customer: ICustomer = {
    name: 'Paulo Ribas',
    email:'ovatsugavlis15@gmail.com',
    tax_id: '13535377498', // minimo 11 e max 14
    phone: {
        coutry: 55,
        area: 11,
        number: 9999999,
    },}

describe('keys', async ()=> {
    it('should create an order with creditCard', async()=> {
        let orderInstance = await payment.createOrderInstance(customer)
        order = await payment.createOrder(orderInstance)
         
    })  
  /*   it('should create an order with pix',async ()=>{
        let order = await payment.createOrder(orderPix)
    }) */
    
    it('should pay and order with credit card', async() => {
        const id = createUUID()
        let encrypted = 'MAfQrTN4zqiG2SfUyZtN12HPJXj5PIb7OYv985fHxatm7umBWhsB6Edomm/pUtBmcGc6yMugeVig1mXdgfPGT2Q2hAM7rkfJvaPvVtH7OXKL+VwsNbw9Vg1HShlmOyTcrKureBBbghSYJ5v1E+JuII+1UCzxtrYhxISSPcujfgd3Yu97DYYZlyEj/BduPUqiTmQENnkESXQ7Dk8t72+gP+t95RV8DB4S2uxTTC5swcQZdrwOV8Fe5DzYyuhcH4j2b+AIb6IoMUDBjZTmDASq5/w89MGSigE/veQ+jNibJw70+TdYw3pg8R2tDcmjqgMipDQUZb/uDF4iA03SaX9S6w=='
        let charge =await payment.payOrder(id, order.id, encrypted, undefined)
         
    }) 
})


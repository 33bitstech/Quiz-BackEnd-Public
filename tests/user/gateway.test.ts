import {test, expect, it, describe, beforeAll, afterAll} from 'vitest'
import { orderCreditCard, orderPix } from './utils/orderObject'
import paymentGateway from '../../src/services/paymentGateway'


describe('app', async ()=> {
    it('should create an public key', async()=> {
        let key = await paymentGateway.createPublicKey()
        expect(key).toBeTypeOf('string')
         
    })

    /* it('should create an app', async()=> {
        let data = await paymentGateway.createAplication()
        expect(data).ownProperty('client_id')
         
    }) */
     /*    it('should get the token', async()=> {
            let data = await paymentGateway.getToken()
            expect(data).toBe('string')
             
        }) */
})

       
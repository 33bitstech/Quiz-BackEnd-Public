import {Request, Response} from 'express'
import { configDotenv } from 'dotenv'
import paymentService from '../services/payment'
//import ICharge from '../interfaces/payments/ICharge'
import User from '../services/user'
import stripeConfig from 'stripe'
import payment from '../services/payment'
import subscriptions from '../services/subscriptions'
configDotenv()
const stripe = new stripeConfig(process.env.SECRET_STRIPE_KEY_TEST as string)

export default new class paymentController {
    async processOnePayment(req: Request, res: Response) {
        try {
            let {sessionId} = req.body,
            {user} = req
             
            if(!user) throw {message:'usuario não informado', code: 403, type: 'global'}
            if(!sessionId) throw {message: 'session não informado', code: 403, type: 'global'}

            const session = await stripe.checkout.sessions.retrieve(sessionId),
            paymentIntent = session.payment_intent

             
            let result = await stripe.paymentIntents.retrieve(paymentIntent as string)

            const userId = session?.metadata?.userId
            if(result.status !==  'succeeded' || !result.payment_method) throw {message: `o pagamento não foi concluido, se acredita que isso é um erro interno nosso, mande essa informaçõe para o suporte: ${session.id} | ${result.id}`}

            const transationExits = await payment.getPayment(result.id)
            if(!transationExits) {
                await User.increaseSpecialCount(userId as string)
                await payment.savePayment(result.id, result.payment_method as string, userId as string, result.status, true)  
                 
                return res.status(200).send({payment:'payment succeeded'})         
             }
             if(transationExits?.expired) throw {message: 'essa pagamento já foi concluido antes', code: 403, type: 'global'}
             await User.increaseSpecialCount(userId as string)
             let pagado = await payment.updatePayment(transationExits.paymentId, result.payment_method as string, userId as string, result.status, true )
              
                
            res.status(200).send({payment:'payment succeeded'})         
            
        } catch (error: any) {
             
            const status = error.code || 500,
            message = error.message || 'ocorreu um erro no servidor',
            type = error.type || 'global'

            res.status(status).send({message, type})
        }
    }
    /* async processOneTimePixPayment(req: Request, res: Response) {
        try {
            let {customer} = req.body,
            {user} = req

            if(!user) throw {message:'usuario não informado', code: 403, type: 'global'}
            let orderInstance = await paymentService.createOrderInstance(customer),
            orderPixInstance =  paymentService.createOrderPixInstance(orderInstance)

            const requestOrder = await paymentService.createOrder(orderPixInstance)
            const {order_id, reference_id, qr_codes} = await paymentService.saveOrder(requestOrder, user.userId as string)

            res.status(201).send({order_id, reference_id, qr_codes})         
            
        } catch (error: any) {
             
            const status = error.code || 500,
            message = error.message || 'ocorreu um erro no servidor',
            type = error.type || 'global'

            res.status(status).send({message, type})
        }
    } */
    async startSubscription(req: Request, res: Response) {
        try {
            let {sessionId} = req.body,
            {user} = req

            const session = await stripe.checkout.sessions.retrieve(sessionId, {expand: ['subscription', 'invoice']}),
            {subscription, invoice} = session,
            {id: subscriptionId,status: subscriptionStatus} = subscription as any,
            {payment_intent, status: invoiceStatus, id: invoiceId} = invoice as any
            const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent as string)

            if(paymentIntent.status !== 'succeeded' || session.status !== 'complete' || invoiceStatus !== 'paid') {
                throw {message: `o pagamento não foi concluido, se acredita que isso é um erro interno nosso, mande essa informaçõe para o suporte: ${sessionId.id}`}
            }
            let userIdFromSession = session.metadata?.userId as string || user?.userId as string

            await stripe.subscriptions.update(subscriptionId as string, {
                metadata: {
                    userId: userIdFromSession 
                }
            })
            const newSubscription = await subscriptions.saveSubscription({invoiceId, status: subscriptionStatus, subscriptionId: subscriptionId, userId: userIdFromSession})
            await User.setPremium(userIdFromSession, true)
             
            res.status(200).send({newSubscription})
            
            /*  
        } catch (error: any) {
             
            const message = error.message || 'ocorreu um erro', 
            code = error.code || 500,
            type = error.type || 'global'
            res.status(code).send({message, type})
        }
    }
    async cancelSubscription(req: Request, res: Response){
        try {
            const {user} = req

            if(!user) throw {message:'usuario não informado', code: 403, type: 'global'}

            let subscription = await subscriptions.getUserActiveSubscription(user.userId as string)

            if(!subscription) throw {message: 'não foram encontradas assinaturas desse usuario', code: 404, type: 'global'} 
            if(subscription.userId !== user.userId) throw {message: 'essa assinatura não pertence a esse usuario'}
            await subscriptions.cancelSubscription(subscription.subscriptionId)
            await subscriptions.updateSubscription(subscription.subscriptionId, user.userId, subscription.invoiceId, 'canceled' )
            await User.setPremium(user.userId, false)

            res.status(200).send({status:'canceled'})
            
        } catch (error:any) {
             
            const message = error.message || 'ocorreu um erro', 
            code = error.code || 500,
            type = error.type || 'global'
            res.status(code).send({message, type})
        }
    }
    
}
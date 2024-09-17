import { Request, Response } from "express-serve-static-core"
import { configDotenv } from "dotenv"
import paymentGateway from "../services/paymentGateway"
import payment from "../services/payment"
configDotenv()
import stripeConfig from 'stripe'
import subscriptions from "../services/subscriptions"
import User from "../services/user"
const stripe =  new stripeConfig(process.env.SECRET_KEY_TEST as string)

export default new class PaymentGateWayController {
    async createSubscriptionCheckOutSession(req: Request, res: Response) {
        try {
            const {user} = req ,
            {currency = 'USD'}= req.params

            if(!user) throw {message: 'usuario não informado', code: 400, type: 'global'}

            let {premium} = await User.getUserPremiumStatus(user.userId as string)
            if(premium) throw {message: 'o usuario já tem uma inscrição ativa', code: 403}

            const price = currency === 'USD' ? process.env.PRICE_ID_SUBSCRIPTION_ENG_TEST : process.env.PRICE_ID_SUBSCRIPTION_BR_TEST

            const {client_secret, id} = await payment.createCheckOutSession(price as string, user?.userId as string, 'subscription' )

            res.status(200).send({client_secret, id});
        } catch (error:any) {
            const message = error.message || 'ocorreu um erro', 
            code = error.code || 500,
            type = error.type || 'global'
             
            res.status(code).send({message, type})
        }
    }
    async createPaymentSession(req: Request, res: Response) {
        try {
            const {user} = req,
            {currency = 'USD'} = req.params
            if(!user) throw {message: 'user não informado', code: 403}

            const price = currency === 'USD' ? process.env.PRICE_ID_PAYMENT_ENG_TEST : process.env.PRICE_ID_PAYMENT_BR_TEST,
            {client_secret, id} = await payment.createCheckOutSession(price as string, user?.userId as string, 'payment')
            res.status(200).send({client_secret: client_secret, id})

        } catch (error:any) {
            const message = error.message || 'ocorreu um erro', 
            code = error.code || 500,
            type = error.type || 'global'
             
            res.status(code).send({message, type})
        }
    }
    async getStripePublicKey(req: Request, res: Response) {
        try {
            let public_key = process.env.PUBLIC_STRIPE_KEY_TEST

            if(!public_key) throw {message: 'não foi possivel enviar a public key', code: 500, type: 'global'}
                
                res.status(200).send({public_key})
            
        } catch (error:any) {
            const message = error.message || 'ocorreu um erro', 
            code = error.code || 500,
            type = error.type || 'global'
             
            res.status(code).send({message, type})
        }
    }
    async stripeWebHook(req: Request, res: Response) {
        try {
            const sig = req.headers['stripe-signature']
            if(!sig) throw {message:'stripe headers not set', code: 500}
            let event = await stripe.webhooks.constructEventAsync(req.body, sig, process.env.END_POINT_SECRET as string)

            if(event.type === 'customer.subscription.updated') {
                const subscription = event.data.object

                if(subscription.status === 'unpaid' || subscription.status === 'past_due') {
                    await subscriptions.cancelSubscription(subscription.id)

                    const userId = subscription.metadata.userId,
                    isTheSubscriptionActive = await subscriptions.getUserActiveSubscription(userId)

                    if(isTheSubscriptionActive) {
                        await subscriptions.updateSubscription(subscription.id, userId as string, subscription.latest_invoice as string, 'canceled')
                    } 
                    await User.setPremium(userId, false)
                    
                    return res.status(200).send({status: 'Ok', event})
                }
            }
            res.status(200).send({status: 'Ok', event})
        
        } catch (error:any) {
            const message = error.message || 'ocorreu um erro', 
            code = error.code || 500,
            type = error.type || 'global'
             
            res.status(code).send({message, type})
        }
    }
}
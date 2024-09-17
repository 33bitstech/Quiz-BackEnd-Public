import { configDotenv } from "dotenv"
import subscriptionRepositorie from "../repositories/subscriptions"
import stripeConfig from 'stripe'
const stripe =  new stripeConfig(process.env.SECRET_STRIPE_KEY_TEST as string, {apiVersion: '2024-06-20; custom_checkout_beta=v1' as any})
import ISubscription from "../interfaces/payments/ISubscription"

configDotenv()
const domain = 'https://quizvortex.site/'
export default new class Subscription {
   async saveSubscription(dates: ISubscription): Promise<ISubscription> {
    try {
      const {userId, subscriptionId, status, invoiceId} = dates,
      subscriptionMade = await subscriptionRepositorie.saveSubscription(userId, subscriptionId, invoiceId, status)
      return subscriptionMade
      
    } catch (error) {
      throw error
    }
   }
   async getSubscription(subscriptionId: string): Promise<ISubscription> {
    try {
      const subscription = await subscriptionRepositorie.findSubscription({subscriptionId})
      if(!subscription) throw {message:'subscription not found', code: 404}
      return subscription
    } catch (error) {
      throw error
    }
   }
   async getUserActiveSubscription(userId: string): Promise<ISubscription | null> {
    try {
      return await subscriptionRepositorie.findSubscription({userId, status: 'active'})
    } catch (error) {
      throw error
    }
   }
   async updateSubscription(subscriptionId:string, userId: string, invoiceId: string, status: string): Promise<ISubscription> {
    try {
      let subscriptionUpdated = await subscriptionRepositorie.updateSubscription(userId, subscriptionId, invoiceId, status)
      if(!subscriptionId) throw {message: 'não foi possivel atualizar a assinatura', code: 500}
      return subscriptionUpdated as ISubscription
    } catch (error) {
      throw error
    }
   }
   async cancelSubscription(subscriptionId: string):Promise<void> {
    try {
       await stripe.subscriptions.cancel(subscriptionId)
    } catch (error) {
      throw error
    }
   }
}
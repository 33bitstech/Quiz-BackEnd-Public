import { configDotenv } from "dotenv"
import payments from "../repositories/payments"
import stripeConfig from 'stripe'
configDotenv()
const stripe =  new stripeConfig(process.env.SECRET_STRIPE_KEY_TEST as string, {apiVersion: '2024-06-20; custom_checkout_beta=v1' as any})
import IPayments from "../interfaces/payments/IPayment"

const domain = 'https://quizvortex.site/'
export default new class Payment {
    async createCheckOutSession(price: string, userId: string, mode: 'subscription' | 'payment'):Promise<{id: string, client_secret: string}> {
        try {
            const session = await stripe.checkout.sessions.create({
              ui_mode: "custom",
              line_items: [
                {
                  price,
                  quantity: 1,
                },
              ],
              mode: mode,
              metadata: {
                userId: userId
              },
              return_url: `${process.env.DOMAIN}/return.html?session_id={CHECKOUT_SESSION_ID}`,
             // automatic_tax: {enabled: true} rotas do stripe não funcionam para essa parte
            });
            return  {id: session.id, client_secret: session.client_secret as string}
        } catch (error: any) {
             
            throw error
        }
    };
    async savePayment(paymentId: string, payment_method_id: string, userId: string, status: string, expired?: boolean):Promise<IPayments> {
      try {
        let payment = {paymentId, userId, payment_method_id, status, expired}
        return await payments.savePayment(payment)
      } catch (error) {
         
        throw {message: 'ocorreu um erro durante o processo de pagamento', code: 500, type: 'global'}
      }
    }
    async getPayment(paymentId: string):Promise<IPayments | null> {
      try {
        return  await payments.findPayment(paymentId)

      } catch (error) {
        throw error
      }
    }
    async updatePayment(paymentId: string, payment_method_id: string, userId: string, status: string, expired:boolean) {
      try {
        const updated = await payments.updatePayment(paymentId, userId, payment_method_id, status, expired)
        return updated
      } catch (error) {
        throw error
      }
    }
}
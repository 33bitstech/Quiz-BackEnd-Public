import ISubscription from "../interfaces/payments/ISubscription";
import subscriptionModel from "../models/subscriptionModel";
import subscription from "../models/subscriptionModel"

export default new class PaymentRepositorie {
    async saveSubscription(userId: string, subscriptionId: string, invoiceId: string, status: string ): Promise<ISubscription> {
        try {
            const newSubscription = new subscription({userId, subscriptionId, invoiceId, status})
            return await newSubscription.save()
        } catch (error) {
            throw error
        }
    }
    async findSubscription(query: any): Promise <ISubscription | null>{
        try {
            return subscriptionModel.findOne(query)
        } catch (error) {
            throw error
        }
    }
    async updateSubscription(userId: string, subscriptionId: string, invoiceId: string, status: string): Promise<ISubscription | null> {
        try {
            return  await subscriptionModel.findOneAndUpdate({subscriptionId, userId}, {invoiceId, status}, {new: true})
        } catch (error) {
         throw error   
        }
    }
    
}
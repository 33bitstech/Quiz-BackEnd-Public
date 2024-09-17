import ISubscription from '../interfaces/payments/ISubscription'
import mongoose from 'mongoose'

export const Schema = new mongoose.Schema<ISubscription>({
    userId: {type: String, required: true},
    subscriptionId: {type: String, required: true},
    invoiceId: {type: String, required: true},
    status: {type: String, required: true},
})

const subscriptionModel = mongoose.model('subscriptions', Schema)

export default subscriptionModel
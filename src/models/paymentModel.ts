import IPayment from '../interfaces/payments/IPayment'
import mongoose from 'mongoose'

export const Schema = new mongoose.Schema<IPayment>({
    paymentId: {type: String, required: true},
    payment_method_id: {type: String, required: true},
    userId: {type: String, required: true},
    status: {type: String, required: true},
    expired: {type: Boolean, default: false}
})

const paymentModel = mongoose.model('payments', Schema)

export default paymentModel
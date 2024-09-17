import IPayment from "../interfaces/payments/IPayment";
//import ICharge from "../interfaces/payments/ICharge";
import chargeModel from "../models/chargeModel";
import paymentModel from "../models/paymentModel";

export default new class PaymentRepositorie {
    async savePayment(payment: IPayment): Promise<IPayment> {
        try {
            const newPayment = new paymentModel(payment)
            return await newPayment.save()
        } catch (error) {
            throw error
        }
    }
    async updatePayment(paymentId: string, userId:string, payment_method_id:string,  status: string, expired?: boolean ): Promise<IPayment | null> {
        try {
            let query = expired ? {status, expired, payment_method_id} : {status, payment_method_id}
            return await paymentModel.findOneAndUpdate({paymentId, userId}, query, {new: true})
        } catch (error) {
            throw error
        }
    }
    async findPayment(paymentId: string): Promise<IPayment | null> {
        try {
            return await paymentModel.findOne({paymentId})
        } catch (error) {
            throw error
        }
    }

  /*   async saveCharge(charge: ICharge, userId: string): Promise<ICharge> {
        try {
            const newCharge = new chargeModel({...charge, userId})
            return await  newCharge.save()
        } catch (error) {
            throw error
        }
    } */
}
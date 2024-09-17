import ICharge from "../interfaces/payments/ICharge";
import mongoose from "mongoose";

export const Charge = new mongoose.Schema<ICharge>({
    charge_id: {type: String, required: true},
    reference_id: {type: String, required: true},
    userId: {type: String, required: true},
    created_at: {type: Date, default: new Date()},
    paid_at: {type: Date, default: new Date()}

})

const ChargeModel = mongoose.model('Charges', Charge)

export default ChargeModel
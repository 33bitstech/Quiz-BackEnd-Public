export default interface IPayments {
    paymentId: string,
    payment_method_id: string,
    userId: string,
    status: string,
    expired?: boolean,    
}
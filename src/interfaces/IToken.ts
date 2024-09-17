export default interface IToken {
    email: string,
    token: string,
    expired: boolean,
    created_at: Date,
}
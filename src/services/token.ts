import IToken from "../interfaces/IToken"
import token from "../repositories/token"
import { createHash } from "../utils/bcrypt"
import { createUniversalHash } from "../utils/universalHash"
export default new class Token {
    async create(email: string): Promise<string> {
        try {
            const hash = await createHash(3, email) as string,
            hashForToken = createUniversalHash(hash)
            await token.save({email, token: hashForToken, expired: false, created_at: new Date()})

            return hashForToken
            
        } catch (error) {
            throw error
        }
    }
    async getToken(tokenHash: string): Promise<IToken | unknown> {
        try {
            const tokenFromDB = await token.findToken(tokenHash)
            return tokenFromDB
        } catch (error) {
            throw error
        }
    }
    async expireToken(tokenHash: string): Promise<void>{
        try {
            await token.setExpired(tokenHash)
        } catch (error) {
            throw error
        }
    }
    isTokenExpiredByTime(tokenDate: Date, limitMinutes: number) {
        let now = new Date
        const differenceBetweenDates = (now.getTime() - tokenDate.getTime()) / 1000 / 60
        
        return(differenceBetweenDates >= limitMinutes)
        
    }
}
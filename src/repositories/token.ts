import tokenModel from "../models/tokenModel";
import IToken from "../interfaces/IToken";


export default new class tokenRepositorie {
    async save(token: IToken): Promise<IToken> {
        try {
            const newToken = new tokenModel(token)
            return newToken.save()
        }
        catch(error)  {
            throw error
        }
    }
    async findToken(token: string): Promise<IToken | unknown> {
        try {
            const foundToken = await tokenModel.find({token})
            return foundToken
        } catch (error) {
            throw error
        }
    }
    async setExpired(token: string): Promise<IToken | unknown> {
        try {
            const tokenExpired = await tokenModel.findOneAndUpdate({token: token},
                {
                    $set: {expired: true}
                },
                {new: true}
            )
            return tokenExpired
        } catch (error) {
            throw error
        }
    }
}
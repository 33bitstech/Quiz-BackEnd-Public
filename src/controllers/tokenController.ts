import { Request, Response } from "express"
import User from "../services/user"
import token from "../services/token"
import sendEmail from "../services/email"
import IUser from "../interfaces/IUser"
export default new class Token {
    async CreateAndSendTokenToUser(req: Request, res: Response){
        try {
            const {email} = req.body
            if(!email) throw {code: 400, message: 'email não informado', type: 'email'}
            const user = await User.getUserByEmail(email, true) as IUser

            let tokenHash = await token.create(email)

            await sendEmail('QuizVortex <33bitstech@gmail.com>', {email, name: user.name}, {subject: 'recuperação de senha', body: `<a href="https://www.quizvortex.site/login/recovery/${tokenHash}">recupere sua conta clicando nesse link</a>`})

            res.status(200).send()
        } catch (error: any) {

            if(!error.code) error.code = 500
            if(!error.message) error.message = 'ocorreu um erro no servidor'
            if(!error.type) error.type = 'global'
             
            res.status(error.code).send({message: error.message, type: error.type})
        }
    }
    
}
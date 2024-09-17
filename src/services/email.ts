interface IEmailTo {
    name: string,
    email: string,
}
interface IMessage {
    subject: string,
    body: string,
}
import Transporter from "../config/nodemailer"
export default async function sendEmail(from: string, to: IEmailTo, message: IMessage): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        try {
            Transporter.sendMail({
                from,
                to: to.email,
                subject: message.subject,
                html: message.body
            }, (err, info) => {
                if(err) return reject(err)
                    return resolve()
            })
            
        } catch (error) {
             
            throw error
        } 
    
    })

    
}
import { configDotenv } from "dotenv";
import { createTransport } from "nodemailer";

configDotenv()
const Transporter = createTransport({
    host: 'smtp.gmail.com',
    port: Number( process.env.TRANSPORTER_PORT),
    secure: true,
    auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string,
    }
})
export default Transporter
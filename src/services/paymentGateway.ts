import axios from "axios"
import { configDotenv } from "dotenv"
configDotenv()

const url = 'https://sandbox.api.pagseguro.com',
config = {
    headers:{
        Authorization: `Bearer ${process.env.TOKEN_PAGBANK}`,
    }
}
export default new class PaymentGateWay {
    async createPublicKey():Promise<string> {            
        let body = {type: 'card'}
        try {
            let response =  await axios.post(`${url}/public-keys`, body, config)
             
            return response.data.public_key
        } catch (error) {
           
          throw error
        }
    }

}
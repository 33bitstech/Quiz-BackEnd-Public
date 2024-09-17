import { JwtPayload, sign, verify } from "jsonwebtoken"; 
import { configDotenv } from "dotenv";
import IUserObjectJWT from "../interfaces/JwtUser";
configDotenv()


export const signToken = async function (data: object | string, expiresIn: string | number): Promise<string | void>{
     
    return new Promise<string | void>((resolve, reject) => {
        sign(data, process.env.JWTSECRET as string, {expiresIn}, (err, token) => {
            if(err) return reject(err)

            return resolve(token)
        } )
    })
}

export const decodeToken = async function (token:string): Promise<IUserObjectJWT | void>{
    
    return new Promise<IUserObjectJWT | void>((resolve, reject) => {
        verify(token, process.env.JWTSECRET as string, (err, decoded) => {
            if(err) return reject(err)

            return resolve(decoded as IUserObjectJWT)
        } )
    })
}
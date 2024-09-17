import {Request} from 'express'
import IUserObjectJWT from '../interfaces/JwtUser'

declare module 'express-serve-static-core' {
    interface Request {
        user?: IUserObjectJWT,
        file?: {
            key?: string
        }
    }
}


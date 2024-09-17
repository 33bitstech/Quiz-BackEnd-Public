import IUser from "../interfaces/IUser";
import IUserObjectJWT from "../interfaces/JwtUser";
import userRepositorie from "../repositories/user";
import { compareStringToHash } from "../utils/bcrypt";
import { decodeToken, signToken } from "../utils/jwt";

abstract class MethodsAuthenticate {
    abstract compareName(name:string): Promise<boolean | void>
    abstract compareEmail(email:string): Promise<boolean | void>
    abstract getUserFromDB(id:string): Promise<IUser>
    abstract comparePassword(password:string, hash:string): Promise<boolean | void>  
    abstract createAndGetToken(expiresIn: string | number): Promise<string | void>
    
}

export class authenticateUser extends MethodsAuthenticate implements IUserObjectJWT {
    constructor(public userId:string, public name?:string, public email?:string, public password?:string, public profileImg?: string ){super()}
    async compareName(userName: string): Promise<boolean | void> {
        try {
            const isEqual = userName === this.name
            return isEqual
            
        } catch (error) {
            throw error
        }
    }
        async compareEmail(email: string): Promise<boolean> {
            try {
                const isEqual = email === this.email
                return isEqual
                
            } catch (error) {
                throw error
            }
    }
    async comparePassword(password: string, hash: string): Promise<boolean | void> {
        try {
           return await compareStringToHash(password, hash)
        } catch (error) {
            throw {message: 'ocorreu um erro no servidor', code: 500, type: 'password'}
        }
        
    }
    async getUserFromDB(): Promise<IUser> {
        try {
            const user = await userRepositorie.findUserById(this.userId)
            if(!user) throw {message: 'esse usuario não foi encontrado', code: 404, type: 'global'} 
            return user
        } catch (error) {
            throw error
        }
        
    }
    async createAndGetToken(expiresIn: string | number): Promise<string | void> {
        try {
            const jwtToSign: IUserObjectJWT = {
                userId: this.userId,
                name: this.name,
                email: this.email,
                profileImg: this.profileImg
            }
            return await signToken(jwtToSign, expiresIn)
            
        } catch (error) {
            throw error
        }
        
    }
    static async decodeToken(token: string): Promise<void | IUserObjectJWT> {
        
    }
    

}
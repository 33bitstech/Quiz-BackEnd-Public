import IUser from "../interfaces/IUser";
import userRepositorie from "../repositories/user";
import { isTextEmpty, generateTrimmedString, checkEmailValidate,} from "../utils/inputs";
import { createUUID } from "../utils/ids";
import { createHash } from "../utils/bcrypt";
import IHttpErrorResponse from "../interfaces/IHttpErrorResponse";
import IUserObjectJWT from "../interfaces/JwtUser";
import {config} from 'dotenv'
config()
export default class User{
    constructor( public userId:string, public name:string, public email:string, public password:string, public created_at:Date, public updated_at:Date){
    }
    static async createUserInstance(userData: IUser, login?: boolean): Promise<IUser> {
        try {
            let {name, email, password, userId} = userData
            await this.verifyName(name, login)
            await this.verifyEmail(email)
            await this.verifyPassword(password)

            const id = userId ? userId : this.createUserId()
            const date = new Date

            const factory = new User(id, name, email, password, date, date)
            return factory
            
        } catch (error) {
             
            throw error
        }

    }
    static async verifyName(name:string, login?: boolean): Promise<boolean | void> {
        try {
            let isEmpty = isTextEmpty(name),
            nameLength = generateTrimmedString(name).length,
             isThereUserWithSameName = await userRepositorie.findUserByName(name)

            if(isThereUserWithSameName && !login) throw {messagePT: 'usuário com esse nome já existente', message: 'user with this name already exists', type: 'name', code: 409}
            if(isEmpty) throw {messagePT: 'preencha o campo', message: 'please fill in the field', code: 400, type: 'name'}
            if(nameLength < 5) throw {messagePT: 'nome muito curto', message: 'name too short', code: 400, type: 'name'}
            if(nameLength > 33) throw {messagePT: 'nome muito longo', message: 'name too long', code: 400, type: 'name'}

            return true
            
        } catch (error ) {
            throw error
        }
    }
    static async verifyEmail(email: string): Promise<boolean | void> {
        try {
            await checkEmailValidate(email)
            return true

        } catch (error) {
            throw {code: 400, type: 'email', messagePT: 'email com caracteres inválidos', message: 'email with invalid characters'}
        }
    }
    static  async verifyPassword(password:string): Promise<boolean | void> {
        try {
            const isPasswordEmpty = isTextEmpty(password)

            if(isPasswordEmpty || password.length < 7) throw {messagePT: 'a senha precisa ser mais longa', 
                message: 'the password needs to be longer', code: 400, type: 'password'}

            return true

        } catch (error) {
            throw error
        }
    }
    static  async createHashPassword(password: string): Promise<string | void> {
        try {
            const hashPassword = createHash(13, password)
            return hashPassword
        } catch (error) {
            throw new Error(error as string)
        }
    }
        
    static createUserId():string{
        return createUUID()
    }
    static async getUsers(sensitive: boolean, list?: Array<string>): Promise<Array<IUserObjectJWT | IUser>> {
        try {
            let users: Array<IUserObjectJWT | IUser>
            sensitive ? users = await userRepositorie.findSensitiveUsersInformation(list) : users = await userRepositorie.findNonSensitiveUsersInformation(list)
            return users
        } catch (error) {
            throw error
        }
    }
    static async getUserById(userId: string): Promise<IUser> {
        try {
            const user = await userRepositorie.findUserById(userId)
            if(!user) throw {message: 'esse usuario não foi cadastrado', code: 404} 
            return user
        } catch (error) {
            throw error
        }
    }
    static async getUserByName(name:string): Promise<IUser | void>{
        try {
            const user = await userRepositorie.findUserByName(name)
            if(!user) throw {
                messagePT: 'não foram encontrados usuários com esse nome cadastrado',
                 message: 'no users found with this name registered', 
                 code: 404, type: 'name'
                }
            return user
        } catch (error) {
            throw error
        }
    }
    static async getUserByEmail(email:string, login: boolean): Promise<IUser | null> {
        try {
            const user = await userRepositorie.findUserByEmail(email)
            if(!user && login) throw {messagePT: 'esse email não foi cadastrado', message: 'this email has not been registered', code: 404, type: 'email'}
            return user
        } catch (error) {
            throw error
        }
    }
    static async findUserById(userId:string): Promise<IUser | null> {
        try {
            const user = await userRepositorie.findUserById(userId)
            return user
        } catch (error) {
            throw error
        }
    }
    static async save(user:IUser) {
        try {
            await userRepositorie.save(user)
        } catch (error) {
            throw error
        }
    }
    static async increaseSpecialCount(userId:string):Promise<number> {
        try {
            const user = await this.getUserById(userId)

            if(!user.specialCount) user.specialCount = 1
            else user.specialCount++

           let userUpdated = await userRepositorie.setSpecialCount(userId, user.specialCount)
           return userUpdated.specialCount as number

        } catch (error) {
            throw error
        }
    }
    static async decreaseSpecialCount(userId:string):Promise<number> {
        try {
            const user = await this.getUserById(userId)

            if(!user.specialCount) user.specialCount = 0
            else user.specialCount--

           let userUpdated = await userRepositorie.setSpecialCount(userId, user.specialCount)
           return userUpdated.specialCount as number

        } catch (error) {
            throw error
        }
    }
    static async updateUser(userId: string, updates: {name?: string, email?: string, password?: string}): Promise<IUser>{
        try {
            const userFromDB = await userRepositorie.findUserById(userId)
            if(!userFromDB) throw {messagePT: 'usuário não cadastrado', message: 'user not registered', code: 403}

            const updatesToApply: Partial<IUser> = {}
            
            if(updates.name && updates.name !== userFromDB.name)  updatesToApply.name = updates.name
            if(updates.email && updates.email !== userFromDB.email) updatesToApply.email = updates.email
            if(updates.password && updates.password  !== process.env.PASSWORDUPDATE)  updatesToApply.password = updates.password
            
            if(Object.keys(updatesToApply).length === 0 ) throw {message: 'nenhum campo foi alterado', code: 500}

            let  userUpdated:IUser

            if(updatesToApply.name) await userRepositorie.updateName(userId, updatesToApply.name) as IUser
            if(updatesToApply.email) await userRepositorie.updateEmail(userId, updatesToApply.email) as IUser
            if(updatesToApply.name) await userRepositorie.updateName(userId, updatesToApply.name) as IUser

            if(updatesToApply.password) {
                const hash = await User.createHashPassword(updatesToApply.password)
                await userRepositorie.updatePassword(userId, hash as string)
            }

            userUpdated = await userRepositorie.findUserById(userId) as IUser

            return userUpdated
            
        } catch (error: IHttpErrorResponse | any) {
            throw {
                message: error.message || 'não foi possivel fazer nenhuma alteração',
                code: error.code || 500
            }
            
        }
    }
    static async updateUserProfileImg(userId:string, imgSrc: string): Promise<IUser> {
        try {
            const user = await userRepositorie.updateProfileImg(userId, imgSrc)
            if(!user) throw {message: 'não foi possivel concluir a ação', code: 400}
            return user
            
        } catch (error) {
            throw error
        }
    }
    static async saveQuiz(quizId: {id: string}, userId:string, savedQuizzes: Array<{id: string}> | undefined) {
        if(!savedQuizzes) savedQuizzes = [] 
        try {
            savedQuizzes.push(quizId)
            let savedQuizzesUpdated = await userRepositorie.addSavedQuiz(savedQuizzes, userId)
            return savedQuizzesUpdated

        } catch (error) {
            throw error
        }
    }
    static  async addFinishedQuiz(quizId: string, time: number, userId: string):Promise<void>{
        try {
            const user = await this.findUserById(userId)
            let finishedQuizzes = user?.finishedQuizzes?.push({id: quizId, time})
            const updated = await userRepositorie.updateFinishedQuizzes(userId, finishedQuizzes as unknown as Array<{id: string, time: number}>)
            return
        } catch (error) {
            throw error
        }
    }
    static async unSaveQuiz(quizId: {id: string,}, userId: string, savedQuizzes: Array<{id:string}> | undefined){
        if(!savedQuizzes) savedQuizzes = [] 
        try {
            let unsavedQuiz = savedQuizzes.filter(quiz => quiz.id !== quizId.id)

            let savedQuizzesUpdated = await userRepositorie.addSavedQuiz(unsavedQuiz, userId)
            return savedQuizzesUpdated

        } catch (error) {
            throw error
        }
    }
    static async getUserPremiumStatus(userId: string):Promise <{premium: boolean, specialCount: number }>{
        try {
            let {premium, specialCount} = await this.getUserById(userId) as IUser
            return {premium: premium || false, specialCount: specialCount || 0}
        } catch (error) {
            throw error
        }

    }
    static async setPremium(userId: string, premium: boolean):Promise<void> {
        try {
            const updated = await userRepositorie.updatePremium(userId, premium)
            if(!updated) throw {message: 'ocorreu um erro ao atualizar o serviço premium', code: 500}
        } catch (error) {
             
            throw error
        }
    }
    static async deleteUser(userId: string): Promise<void> {
        try {
            const deleted = await userRepositorie.deleteUser(userId)
            if(!deleted) throw {message: 'não foi possivel deletar esse usuario', type: 'global', code: 500}
            return
        } catch (error) {
            throw error
        }
    }
}

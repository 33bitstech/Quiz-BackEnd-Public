import {Request, Response} from 'express'
import IUser from '../interfaces/IUser'
import userService from '../services/user'
import {authenticateUser} from '../services/autenthicate'
import IHttpErrorResponse from '../interfaces/IHttpErrorResponse'
import { signToken } from '../utils/jwt'
import IUserObjectJWT from '../interfaces/JwtUser'
import { getImgKey, makeImgSrc,  } from '../utils/images'
import S3AWS from '../services/S3AWS'
import Token from '../services/token'
import IToken from '../interfaces/IToken'
import User from '../services/user'
import { configDotenv } from 'dotenv'
configDotenv()

let expiresIn = '7d'
export default new class {
    async create(req:Request, res: Response) {
        try {
            const {user} = req.body
            let {name, email, password} = user
            if(!name || !email || !password) throw {message: 'preencha todos os campos', type: 'global', code: 400}
            
                let newUser: IUser = await userService.createUserInstance(user)
                const isEmailAlreadyRegistered = await userService.getUserByEmail(email, false)

                if(isEmailAlreadyRegistered) throw {message: 'um usuario já foi cadastrado com esse email', type: 'email',code: 409}

                let hash = await userService.createHashPassword(password) as string
                newUser.password = hash

                await userService.save(newUser)

                const signUser:IUserObjectJWT = {
                    userId: newUser.userId as string,
                    name: newUser.name,
                    email: newUser.email,
                    profileImg: newUser.profileImg as string
                }
                const token = await signToken(signUser, expiresIn)

                res.status(201).send({token: token})
            
        } catch (error) {
             
            let {code, message, type} = error as IHttpErrorResponse
            if(!code || !message || !type) {
                code = 500
                message = 'ocorreu um erro com essa requisição'
                type = 'global'
            }
            res.status(code).send({message, type})
        }
    }
    async login(req: Request, res: Response){
        try {
            const {user} = req.body

            if(!user.email) throw {message: "preencha o email", type: 'email', code: 400}
            if(!user.password) throw {message: "preencha a senha", type: 'password', code: 400}

            await userService.verifyEmail(user.email)
            await userService.verifyPassword(user.password)

            const userFromDB = await userService.getUserByEmail(user.email, true) as IUser,
            userToAuthenticate = new authenticateUser(userFromDB.userId as string, userFromDB.name, userFromDB.email, userFromDB.password, userFromDB.profileImg)
            
            const isPasswordEqual = await userToAuthenticate.comparePassword(user.password, userFromDB.password)

            if(!isPasswordEqual) throw {message: 'senha incorreta', type: 'password', code:  401}
            
            const token = await userToAuthenticate.createAndGetToken('7d')
            res.status(200).send({token})

        } catch (error: IHttpErrorResponse | any) {
             
            res.status(error.code).send({message: error.message, type: error.type})
        }
    }
    async authenticateUser(req: Request, res: Response){
        try {
            const {user} = req
            if(!user) throw {code: 406, message: 'usuario não informado'}
            res.status(201).send({user})
        } catch (error) {
            const {code, message, type} = error as IHttpErrorResponse
            res.status(code).send({message, type})
        }
    }
    async get(req:Request, res: Response) {
        try {
            const {userId} = req.params
            if(!userId) throw {message: 'usuario não informado', code: 406, type: 'global'}

            const user = await userService.getUserById(userId)

            res.status(200).send(user)
            
        } catch (error: any) {
            let code = error.code || 500,
            message = error.message || 'ocorreu um erro',
            type = error.type || 'global'

            res.status(code).send({message, type})
        }
        
    }
    async getAll(req:Request, res: Response) {
        try {
            const users = await userService.getUsers(false)
            res.status(200).send(users)
        } catch (error) {
            res.status(500).send({message: 'ocorreu um erro interno no servidor'})
        }
    }
    async update(req: Request, res: Response){
        try {
            const id = req.user?.userId
            if(!id) throw {message: 'usuario não informado, faça login', type: 'global', code: 400}
            let {userName, userEmail, password} = req.body.user

            if(!password) password = process.env.PASSWORDUPDATE

            if(userName) await userService.verifyName(userName, false)

            if(userEmail) {
                await userService.verifyEmail(userEmail)
                const isThereUserWithSameEmail = await userService.getUserByEmail(userEmail, false)
                if(isThereUserWithSameEmail) throw {message:'usuario com esse endereço de email já foi cadastrado', type: 'global', code: 409}

            }
            const {userId, name, email, profileImg} = await userService.updateUser(
                id as string,
                {
                    name: userName,
                    email: userEmail,
                    password: password
                }
            )

            const token = await signToken({userId, name, email, profileImg}, '7d')

            res.status(200).send({token, user: {
                userId,
                name,
                email
            }})


        } catch (error: IHttpErrorResponse | any) {

            res.status(error.code).send({message: error.message, type: error.type})
        }
    }
    async uploadProfileImg(req:Request, res: Response) {
        try {
            const {user} = req
            if(!user) throw {code: 406, global: true, message: 'usuario não informado'}

            const key = req.file?.key 
            if(!key) throw {code: 500, message: 'não foi encontrado origem da imagem'}

            const imgSrc = makeImgSrc(key, 'quizvortex.s3.sa-east-1.amazonaws.com')
            
            const {userId, name, email, profileImg} = await userService.updateUserProfileImg(user.userId as string, imgSrc)
            const token = await signToken({userId, name, email, profileImg}, '7d')

            res.status(200).send({token, imgSrc})
        } catch (error) {
             
            res.status(500).send('erro')
        }
    }
    async updateProfileImg(req: Request, res: Response) {
        try {
            const {user} = req,
            key = req.file?.key 

            if(!user) throw {code: 406, message: 'usuario não informado'}
            if(!user.profileImg) throw {code: 406, message: 'imagem não fornecida'}
            if(!key) throw {code: 500, message: 'não foi encontrado origem da imagem'}

            if(user.profileImg !== 'default'){
                const key = getImgKey(user.profileImg, 'profilesimg')
                await S3AWS.deteleteProfileOrQuizImgBucketObject(key)
            }
            const imgSrc = makeImgSrc(key, 'quizvortex.s3.sa-east-1.amazonaws.com')

            const {userId, name, email, profileImg} = await userService.updateUserProfileImg(user.userId as string, imgSrc)
            const token:string = await signToken({userId, name, email, profileImg}, '7d') as string

            res.status(200).send({token, imgSrc})

        } catch (error: IHttpErrorResponse | any) {
             
            res.status(error.code || 500).send({message: error.message || 'ocorreu um erro no servidor'})
        }
    }
    async recoveryPassword(req: Request, res: Response) {
        try {
            const {email, token, password } = req.body

            const tokenFromDB = await Token.getToken(token),
            user = await User.getUserByEmail(email, true)

            if(!user) throw {code: 404, message: 'usuario não cadastrado', type:"global"}
            if(!tokenFromDB) throw {code: 404, message: 'token não encontrado', type: 'token'}

            let tokenInfos = tokenFromDB as IToken,
            isExpired = Token.isTokenExpiredByTime(tokenInfos.created_at, 15)

            if(tokenInfos.email !== email) throw {code: 402, message: 'esse token não pertence a você', type: 'token'}
            if(tokenInfos.expired || isExpired) throw {code: 403, message: 'token expirado', tyoe: 'token' }

            await User.verifyPassword(password)

            await User.updateUser(user.userId as string, {password: password})

            await Token.expireToken(tokenInfos.token)

            res.status(200).send()

        } catch (error: any) {
            const statusCode = error.code || 500,
            message = error.message || 'Erro interno do servidor',
            errorType = error.type || 'global'

            res.status(statusCode).send({message, type: errorType})
        }
    }
    async saveQuiz(req: Request, res: Response){
        try {
            const {user} = req,
            {quizId} = req.params

            if(!quizId) throw {code: 406, message: 'quiz não informado', type: 'global'}

            const savedQuizzes = await User.saveQuiz({id: quizId}, user?.userId as string, user?.savedQuizzes)
            const token = await signToken({
                userId: user?.userId, 
                name: user?.name,
                email: user?.email,
                profileImg: user?.profileImg,
                savedQuizzes}, '7d')

            res.status(200).send({savedQuizzes, token})

        } catch (error: any) {
            let code = error.code || 500,
            message = error.message || 'ocorreu um erro',
            type = error.type || 'global'
             

            res.status(code).send({message, type})
        }
    }
    async unSaveQuiz(req: Request, res: Response){
        try {
            const {user} = req,
            {quizId} = req.params

            if(!quizId) throw {code: 406, message: 'quiz não informado', type: 'global'}

            const savedQuizzes = await User.unSaveQuiz({id: quizId}, user?.userId as string, user?.savedQuizzes)
            const token = await signToken({
                userId: user?.userId, 
                name: user?.name,
                email: user?.email,
                profileImg: user?.profileImg,
                savedQuizzes}, '7d')

            res.status(200).send({savedQuizzes, token})

        } catch (error: any) {
            let code = error.code || 500,
            message = error.message || 'ocorreu um erro',
            type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
    async checkUserPremiumStats(req:Request, res: Response){
        try {
            const user = req.user
            const {premium, specialCount} = await User.getUserPremiumStatus(user?.userId as string)
            res.status(200).send({response: 'OK', premium, specialCount})
            
        } catch (error:any) {
            let code = error.code || 500,
            message = error.message || 'ocorreu um erro',
            type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
    async delete(req:Request, res: Response) {
        try {
            const {user} = req,
            userFromDb = await User.getUserById(user?.userId as string),
             usersPremiumStats = await User.getUserPremiumStatus(user?.userId as string)

             if(usersPremiumStats.premium) throw {message: 'cancele seu plano antes de apagar sua conta', code: 400, type: 'global'}
             if(userFromDb.profileImg !== 'default') {
                let key = getImgKey(userFromDb.profileImg as string, 'profilesimg')
                await S3AWS.deteleteProfileOrQuizImgBucketObject(key)
                
             }

             await User.deleteUser(user?.userId as string)
            
        } catch (error: any) {
             
            let code = error.code || 500,
            message = error.message || 'ocorreu um erro',
            type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
}
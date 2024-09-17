import { NextFunction } from "express";
import { decodeToken } from "../utils/jwt";
import { Request, Response } from "express";
import { authenticateUser } from "../services/autenthicate";
import IHttpErrorResponse from "../interfaces/IHttpErrorResponse";
import IUserObjectJWT from "../interfaces/JwtUser";
import Quiz from "../services/quiz";
import Comments from "../services/comments";
import { configDotenv } from "dotenv"; 
configDotenv()

export async function authenticate (req: Request, res: Response, next: NextFunction) {
    try {
        const authorization = req.headers['authorization']
        if(!authorization) throw {message: 'authorization não fornecido', code: 401}

        let [ , token] = authorization.split(' ')
        if(!token) throw {message: 'token não fornecido', code: 401}

        const tokendecoded = await decodeToken(token) as IUserObjectJWT
        req.user = tokendecoded

        next()

    } catch (error: any) {
        let message = error.message || 'ocorreu um erro',
        code = error.error || 403
         
        if(!message && !code) {
            message = 'token inválido'
            code = 403
        }
        res.status(code).send({message})
    }
}
export async function multerAuthenticate (req: Request, res: Response, next: NextFunction) {
    try {
        const authorization = req.headers['authorization']
        if(!authorization) throw {message: 'authorization não fornecido', code: 401}

        let [ , token] = authorization.split(' ')
        if(!token) throw {message: 'token não fornecido', code: 401}

        const tokendecoded = await decodeToken(token) as IUserObjectJWT
        const user = new authenticateUser(tokendecoded.userId as  string, tokendecoded.name, tokendecoded.email)
        await user.getUserFromDB()
        
        req.user = tokendecoded
        next()

    } catch (error) {
        let {message, code} = error as IHttpErrorResponse
         
        if(!message && !code) {
            message = 'token inválido'
            code = 403
        }
        res.status(code).send({message})
    }
}

export async function quizAuthenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const authorization = req.headers['authorization']
        if(!authorization) throw {message: 'authorization não fornecido', code: 401}

        let [ , token] = authorization.split(' ')
        if(!token) throw {message: 'token não fornecido', code: 401}

        const tokendecoded = await decodeToken(token) as IUserObjectJWT

        const quizId = req.params.quizId

        if(!quizId) throw {message: 'quiz não informado', code: 401}

        const quiz = await Quiz.getQuiz(quizId)

        if(quiz.userCreatorId != tokendecoded.userId) throw {message: 'esse quiz não pertence ao usuario', code: 403}
        req.user = tokendecoded

        next()

    } catch (error) {
        let {message, code, type} = error as IHttpErrorResponse
         
            !message ? message = 'token inválido' : message
            !code ? code = 403 : code
            !type ? type = 'global': type 
        
        res.status(code).send({message, type})
    }
}
export async function quizExistsAuthenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const authorization = req.headers['authorization']
        if(!authorization) throw {message: 'authorization não fornecido', code: 401}

        let [ , token] = authorization.split(' ')
        if(!token) throw {message: 'token não fornecido', code: 401}

        const tokendecoded = await decodeToken(token) as IUserObjectJWT

        const quizId = req.params.quizId

        if(!quizId) throw {message: 'quiz não informado', code: 401}

        req.user = tokendecoded

        next()

    } catch (error) {
        let {message, code, type} = error as IHttpErrorResponse
         
            !message ? message = 'token inválido' : message
            !code ? code = 403 : code
            !type ? type = 'global': type 
        
        res.status(code).send({message, type})
    }
}

export async function commentAuthenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const authorization = req.headers['authorization']
        if(!authorization) throw {message: 'authorization não fornecido', code: 401}

        const [, token] = authorization.split(' ')
        if(!token) throw {message: 'token não fornecido', code: 401}

        const tokenDecoded = await decodeToken(token) as IUserObjectJWT

        const {commentId} = req.params

        if(!commentId) throw {message: 'comentário não informado', code: 401}

        const comment = await Comments.getComment(commentId)

        if(tokenDecoded.userId !== comment.userId) throw {message: 'esse comentário não pertence a você', code: 403}
        
           next()

    } catch (error:any) {
         

        let message = error.message || 'ocorreu um erro no servidor',
        code = error.code || 500,
        type = error.tyoe || 'global'

        res.status(code).send({message, type})
    }
    
}

export async function APIusageAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const apiKey = req.headers['apiKey']
        if(!apiKey) throw {message: 'apiKey not found', code: 403}
        if(apiKey !== process.env.OWN_API_KEY) throw {message: 'apiKey not allowed', code: 403}

        next()
    } catch (error: any) {
         

        let message = error.message || 'ocorreu um erro no servidor',
        code = error.code || 500,
        type = error.tyoe || 'global'

        res.status(code).send({message, type})
    }
}
    


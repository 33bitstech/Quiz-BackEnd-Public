import {Request, Response} from 'express'
import Quiz from '../services/quiz'
import { makeImgSrc, getImgKey } from '../utils/images'
import IHttpErrorResponse from '../interfaces/IHttpErrorResponse'
import IQuestion from '../interfaces/IQuestion'
import IQuizes from '../interfaces/IQuizes'
import S3AWS from '../services/S3AWS'
import questions from '../services/questions'
import leaderboard from '../services/leaderboard'
import User from '../services/user'
export default new class {
    async create(req:Request, res: Response) {
        try {
            const userCreatorId = req.user?.userId,
            userCreatorName = req.user?.name

            let {quizData} = req.body,
            quizObj = {
                ...quizData,
                userCreatorName,
                userCreatorId
            }
            const quizInstance = await Quiz.createQuizInstance(quizObj)
            await Quiz.save(quizInstance)

            res.status(201).send({quizId: quizInstance.quizId})
        } catch (error: any) {
            const statusCode = error.code || 500,
            message = error.message || 'Erro interno do servidor',
            errorType = error.type || 'global'
             
            res.status(statusCode).send({message, type: errorType})
            
        }
    }
    async uploadImg(req: Request, res: Response) {
        try {
            const {user} = req,
            {quizId} = req.params,
            key = req.file?.key 

            if(!user) throw {code: 406, message: 'usuario não informado'}
            if(!quizId) throw {code: 406, message: 'quiz não informado'}
            if(!key) throw {code: 500, message: 'não foi encontrado origem da imagem'}
             
            const imgSrc = makeImgSrc(key, 'quizvortex.s3.sa-east-1.amazonaws.com'),
            quiz = await Quiz.getQuiz(quizId)
            
            if(quiz.quizThumbnail !== 'default') {
                let key = getImgKey(quiz.quizThumbnail, 'questionimg')
                await S3AWS.deteleteProfileOrQuizImgBucketObject(key)
            
            }
            await Quiz.updateImg(quizId, user.userId as string, imgSrc)
            
            res.status(200).send({quizThumbnail: imgSrc})
        } catch (error: IHttpErrorResponse | any) {
             
            let {message, code, type} = error
            !message ? message = 'ocorreu um erro desconhecido, tente novamente mais tarde' : message
            !code ? code = 500 : code
            !type ? type = 'global' : type

            res.status(code).send({message, type})
        }
    }
    async uploadQuestionImages(req: Request, res: Response) {
        try {
            const {quizId} = req.params,
            {user} = req,
            files = req.files  as Express.Multer.File[] 
            
             
            let quiz = await Quiz.getQuiz(quizId)
            if(quiz.questions?.length !== files?.length) throw {code: 400, message: 'a quantidade de imagens não é igual a quantidade de perguntas'}
            
            const questionImgUrls = await questions.addImgToQuestions(quiz.questions, files)

            if(quiz.type !== 'image/RW') await Quiz.updateType(quizId, 'image/RW')

            let newQuestions = await questions.updateQuestions(quizId, user?.userId as string, questionImgUrls)
            res.status(200).send({newQuestions})
            
        } catch (error: any) {
            let code = error.code || 500,
            message = error.message || 'ocorreu um erro no servidor',
            type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
    async uploadAlternatives(req: Request, res: Response){
        try {
            const {quizId, questionId} = req.params,
            {user} = req,
            files = req.files  as Express.Multer.File[] 
            
             
            let quiz = await Quiz.getQuiz(quizId),
            questionFromDb = quiz.questions?.find(question => question.questionId === questionId)

            if(!questionFromDb) throw {message: 'questão não encontrada', code: 400}

            if(questionFromDb.answers?.length !== files?.length) throw {code: 400, message: 'a quantidade de imagens não é igual a quantidade de alternativas'}
            
            const alternativesWithImgUrls = await questions.addImgToAlternatives(questionFromDb, files)            
            let newQuestions = await questions.updateAlternativesImgs(user?.userId as string, quizId, alternativesWithImgUrls)
            res.status(200).send({newQuestions})
            
        } catch (error: any) {
            let code = error.code || 500,
            message = error.message || 'ocorreu um erro no servidor',
            type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
    async updateAlternatives(req: Request, res: Response) {

    }
    async  getPublics(req: Request, res: Response) {
        try {
            const quizzes = await Quiz.getPublicQuizzes()
            res.status(200).send({quizzes: quizzes.reverse()})
        } catch (error: any) {
            let code = error.code || 500,
            message = error.message || 'ocorreu um erro no servidor',
            type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
    async getPrivates(req:Request, res: Response) {}
    async getQuizzes(req:Request, res: Response) {
        try {
            let {list} = req.query,
            quizzes: Array<string> | undefined = undefined
            
             
            if(list) quizzes = list.toString().split(',')
                 
            let quizzesFromDb = await Quiz.getQuizzes(quizzes)

            res.status(200).send({quizzes: quizzesFromDb})

        } catch (error: any) {
            let code = error.code || 500,
            message = error.message || 'ocorreu um erro no servidor',
            type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
    async getUserSavedQuizzes (req: Request, res: Response){
        try {
            const  {user} = req,
            quizIds = user?.savedQuizzes?.map(quiz => quiz.id)

            if(user?.savedQuizzes?.length === 0) return res.status(200).send({quizzes: []})

             let quizzes = await Quiz.getUserSavedQuizzes(quizIds || [])

             res.status(200).send({quizzes: quizzes.reverse()})
        } catch (error: any) {
            let code = error.code || 500,
            message = error.message || 'ocorreu um erro',
            type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
    async getMostPopularQuizzes(req: Request, res: Response){
        try {
            const quizzes = await Quiz.getPublicQuizzes(),
            
            quizzesSort = quizzes.sort((a, b) => {
                let AusersCount = a.usersCount || 0
                let BusersCount = b.usersCount || 0
                return BusersCount - AusersCount
            })

             
            
            res.status(200).send({quizzesSort})

        } catch (error:any) {
            let code = error.code || 500,
            message = error.message || 'ocorreu um erro no servidor',
            type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
    async getAll(req:Request, res: Response) {}
    async getQuiz(req: Request, res: Response){
        try {
            const {quizId} = req.params,
            {user} = req

            if(!quizId) throw {code: 406, message: 'quiz não informado', type: 'global'}

            const quiz = await Quiz.getQuiz(quizId)

            res.status(200).send({quiz})

        } catch (error: IHttpErrorResponse | any) {
            let code = error.code || 500,
            message = error.message || 'ocorreu um erro no servidor',
            type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
    async getUserPublicQuizzes(req: Request, res: Response){
        try {
            const {userId} = req.params 
            if(!userId) throw {code: 406, message: 'id do usuario não informado'}
            const quizes = await Quiz.getUserPublicQuizes(userId)

            res.status(200).send({quizes: quizes.reverse()})
        } catch (error: IHttpErrorResponse | any) {
            let code = error.code || 500, 
            message = error.message || 'ocorreu um erro no servidor',
            type = error.type || global
            
             
            res.status(code).send({message, type})
        }
    }
    async getUserPrivateQuizzes(req: Request, res: Response){
        try {
            const {user} = req
            if(!user) throw {code: 403, message: 'usuario não informado', type: 'global'}
                const quizzes = await Quiz.getUserPrivateQuizzes(user.userId as string)
                res.status(200).send({quizzes: quizzes.reverse()})
        } catch (error: IHttpErrorResponse | any) {
            let code = error.code || 500, 
            message = error.message || 'ocorreu um erro no servidor',
            type = error.type || global
            
             
            res.status(code).send({message, type})
        }
    }
    async searchQuizzes(req: Request, res: Response) {
        try {
            let {title, categories, tags} = req.query

            if(tags) tags = tags.toString().split(',')
            if(categories) categories = categories.toString().split(',')
            
            const searchTitle = title ?? '',
            searchCategories = categories && categories.length > 0 ? categories : [''],
            searchTags = tags && tags.length > 0 ? tags : ['']

            let quizzes = await Quiz.search(searchTitle as string, searchCategories as Array<string>, searchTags as Array<string>)

            res.status(200).send({quizzes})

        } catch (error: IHttpErrorResponse | any) {
            let code = error.code || 500, 
            message = error.message || 'ocorreu um erro no servidor',
            type = error.type || global
             
            res.status(code).send({message, type})
        }
    }
    async getSavedQuizzes(req: Request, res: Response){
        try {
            const  {user} = req,
            quizIds = user?.savedQuizzes?.map(quiz => quiz.id)

            if(user?.savedQuizzes?.length === 0) return res.status(200).send({quizzes: []})

             let quizzes = await Quiz.getUserSavedQuizzes(quizIds || [])

             res.status(200).send({quizzes: quizzes.reverse()})
        } catch (error: any) {
            let code = error.code || 500,
            message = error.message || 'ocorreu um erro',
            type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
    async getUserDraftQuizzes(req: Request, res: Response){
        try {
            const {user} = req
            const quizzes = await Quiz.getDraftQuizzes(user?.userId as string)

            res.status(200).send({quizzes: quizzes.reverse()})
        } catch (error: any) {
            const statusCode = error.code || 500,
            message = error.message || 'Erro interno do servidor',
            errorType = error.type || 'global'
             
            res.status(statusCode).send({message, type: errorType})
        }
    }
    async update(req:Request, res: Response) {
        try {
            const userCreatorId = req.user?.userId,
            userCreatorName = req.user?.name,
            {quizId} = req.params

            let {title, description, isPrivate, category, idiom, resultMessages, draft, tags, quizThumbnail} = req.body.quizData,
            quizObj = {
                title, description, isPrivate, category, idiom,
                resultMessages, draft, tags, quizThumbnail,
                userCreatorName, userCreatorId
            }

            const quizInstance = await Quiz.createUpdateQuizInstance(quizObj as IQuizes, quizId)

            await Quiz.update(quizInstance as  IQuizes, quizId)

            res.status(200).send({quizId: quizId})
        } catch (error: any) {
            const statusCode = error.code || 500,
            message = error.message || 'Erro interno do servidor',
            errorType = error.type || 'global'
             
            res.status(statusCode).send({message, type: errorType})
            
        }
    }
    async updateQuestions(req: Request, res: Response) {
        try {
            const {quizId} = req.params,
            Questions: Array<IQuestion> = req.body.questions,
            user = req.user
            
            if(!user) throw {code: 400, message: 'usuario não informado'}
            if(!quizId) throw {code: 400, message: 'quiz não informado'}

            const {premium, specialCount} = await User.getUserPremiumStatus(user.userId as string),
            isPremium = (premium || specialCount > 0)

            if(Questions.length > 10 && !isPremium) throw {message: 'limite de questões excedido; assine ou compre para adicionar mais', code: 403, type: 'global' }

            const {invalidQuestions, validQuestions} = await Quiz.verifyQuestions(Questions, isPremium),
            oldQuiz = await Quiz.getQuiz(quizId)

            if(invalidQuestions.length > 0) throw {code: 400, invalidQuestions}

            const newQuestions = await questions.updateQuestions(quizId, user.userId as string, validQuestions )
            
            if(oldQuiz.qtdQuestions === 0 && oldQuiz.draft) await Quiz.setDraftValue(quizId,false)
            if(oldQuiz.qtdQuestions !== newQuestions.length) await leaderboard.deleteQuizLeaderBoard(oldQuiz.quizId)

            if(Questions.length > 10) {
                if(!premium) await User.decreaseSpecialCount(user.userId as string)    
            }

            res.status(200).send({newQuestions})

        } catch (error: IHttpErrorResponse | any) {

            if(!error.code) error.code = 500
             
            res.status(error.code).send({code: error.code, questionErrs: error.invalidQuestions})
        }
    }
    async updateQuestionsImg(req: Request, res: Response) {
        try {
            const {quizId} = req.params,
            Questions: Array<IQuestion> = req.body.questions,
            user = req.user
             
            if(!user) throw {code: 400, message: 'usuario não informado'}
            if(!quizId) throw {code: 400, message: 'quiz não informado'}

            const {premium, specialCount} = await User.getUserPremiumStatus(user.userId as string),
            isPremium = (premium || specialCount > 0)

            if(Questions.length > 10 && !isPremium) throw {message: 'limite de questões excedido; assine ou compre para adicionar mais', code: 403, type: 'global' }
            
            const oldQuiz = await Quiz.getQuiz(quizId),
            {invalidQuestions, validQuestions} = await Quiz.verifyQuestionsAndAlternativesImg(Questions, isPremium)

            let oldQuestions = oldQuiz.questions || [],
            imagesToDelete:Array<IQuestion> | undefined

             
            
            if(oldQuestions?.length > 0) {
                imagesToDelete = oldQuiz.questions?.filter(oldQuestion => {
                    const found = validQuestions.find(newQuestion => newQuestion.questionId === oldQuestion.questionId)
                    if(!found) return true
                    return false
                })
                 
            }


            if(invalidQuestions.length > 0) throw {code: 400, invalidQuestions}
            
            const newQuestions = await questions.updateQuestions(quizId, user.userId as string, validQuestions )
            if (oldQuestions.length > 0)await questions.deleteImagesOfQuestions(imagesToDelete as Array<IQuestion>)
            
            if(oldQuiz.qtdQuestions === 0 && oldQuiz.draft) await Quiz.setDraftValue(quizId,false)
            if(oldQuiz.qtdQuestions !== newQuestions.length) await leaderboard.deleteQuizLeaderBoard(oldQuiz.quizId)
            if(!premium) await User.decreaseSpecialCount(user.userId as string)    
            

            res.status(200).send({newQuestions})

        } catch (error: IHttpErrorResponse | any) {

            if(!error.code) error.code = 500
             
            res.status(error.code).send({code: error.code, questionErrs: error.invalidQuestions})
        }
    }
    async delete(req:Request, res: Response) {
        try {
            const {quizId} = req.params,
            quiz = await Quiz.getQuiz(quizId)

            if(quiz.type === 'default/RW') await Quiz.deleteQuiz(quizId)
        } catch (error) {
            throw error
        }
    }
}
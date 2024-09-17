import {Request, Response} from 'express'
import Questions from '../services/questions'
import IUserAnswer from '../interfaces/IUserAnswer'
import Quiz from '../services/quiz'
import IQuestion from '../interfaces/IQuestion'
import leaderboard from '../services/leaderboard'
import ILeaderBoard from '../interfaces/ILeaderboard'
import IHttpErrorResponse from '../interfaces/IHttpErrorResponse'
import { IResultMessages } from '../interfaces/IQuizes'
import User from '../services/user'

export default new class {
    async submitQuizAnswered(req: Request, res: Response){
        try {
             
            const quizAnswer:Array<IUserAnswer> = req.body.quizAnswer,
            {timing} = req.body,
            {user} = req,
            {quizId} = req.params

            if(!quizId) throw {message: 'quiz não informado', code: 406, type: 'global'}

            let quiz = await Quiz.getQuiz(quizId),
            isThereAnLeaderBoard = await leaderboard.thereIsLeaderBoard(quiz.quizId)

            if(!isThereAnLeaderBoard) await leaderboard.makeleaderboard(quiz)
            
            let leaderboardFromDb = await leaderboard.getLeaderBoard(quiz.quizId) as  ILeaderBoard,
            compared = await Questions.compareQuestions(quizAnswer, quiz.questions as Array<IQuestion>),
            attempts = 1

            let userOldScore = leaderboardFromDb.usersScoreBoard?.find(userLb => userLb.userId === user?.userId)
            if(userOldScore) attempts = (userOldScore.attempts || 1) + 1
            
            const score = leaderboard.getScoreString(compared, quiz.qtdQuestions), 
            userForLeaderBoard = leaderboard.makeUserLeaderBoardInstance(user?.userId as string, timing, score, compared, attempts ),
            usersArrangeds = await leaderboard.arrangeUserSpot(userForLeaderBoard, leaderboardFromDb.usersScoreBoard || [])
            
            await User.addFinishedQuiz(quizId, timing, user?.userId as string)
            await leaderboard.defineUsersSpots(usersArrangeds, leaderboardFromDb.leaderBoardId)
            await Quiz.updateUsersCount(quizId, usersArrangeds.length)

            const message =  Quiz.calcAndGetMessage(score, quiz.resultMessages as IResultMessages)
            
            res.status(200).send({score:{userForLeaderBoard, message}})
        

        } catch (error: IHttpErrorResponse | any) {
             
            const status = error.code || 500,
            message = error.message || 'ocorreu um erro no servidor',
            type = error.type || 'global'


            res.status(status).send({message, type})
        }
    }
    
}
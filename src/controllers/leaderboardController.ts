import  {Request, Response} from 'express'
import leaderboard from '../services/leaderboard'
import User from '../services/user'
export default new class LeaderboardController {
    async getLeaderBoard(req: Request, res: Response) {
        try {
            const{ quizId } = req.params
            if(!quizId) throw {code: 406, message: 'quiz não informado', type: 'global'}
            
            const {usersScoreBoard} = await leaderboard.getLeaderBoard(quizId),
            usersId = usersScoreBoard?.map(user => user.userId)

            const users = await User.getUsers(false, usersId),
            usersScoreBoardMargedInformation = await leaderboard.margeUsersInfoInLeaderboard(usersScoreBoard?? [], users)

            res.status(200).send({scoreBoard: usersScoreBoardMargedInformation})

        } catch (error: any) {
            const code = error.code || 500,
            message = error.message || 'ocorreu um erro no servidor',
            type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }

}
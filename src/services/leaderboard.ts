import ILeaderBoard from "../interfaces/ILeaderboard";
import IQuizes from "../interfaces/IQuizes";
import IResultComparation from "../interfaces/IResultComparation";
import IUserLeaderBoardScore from "../interfaces/IUserLeaderBoardScore";
import IUserObjectJWT from "../interfaces/JwtUser";
import leaderboard from "../repositories/leaderboard";
import { createUUID } from "../utils/ids";

export default new class Leaderboard {
    async makeleaderboard(quiz: IQuizes) {
        try {
            const {quizId} = quiz,
            leaderBoardId = createUUID()

            const createdleaderboard = await leaderboard.save({quizId, leaderBoardId}) 

            return createdleaderboard
            
        } catch (error) {
            throw error
        }

    }
    async thereIsLeaderBoard(quizId: string):Promise<boolean> {
        try {
           await leaderboard.findLeaderboardByQuizId(quizId)
           return true
           
        } catch (error) {
            let erro = error as object
            if(erro.hasOwnProperty('message')) return false

            throw error
        }
    }
    async getLeaderBoard(quizId: string): Promise<ILeaderBoard> {
        try {
            let leaderboardFound = await leaderboard.findLeaderboardByQuizId(quizId)
            return leaderboardFound as ILeaderBoard
        } catch (error) {
            throw error
        }
    }
    getScoreString(result: IResultComparation, qtdQuestions: number): string {
        const {correctAnswers} = result
        return `${correctAnswers.length}/${qtdQuestions}`

    }
    makeUserLeaderBoardInstance(userId:string, timing:number, score:string, result:IResultComparation, attempts: number){
        return <IUserLeaderBoardScore>{
            userId,
            timing,
            score,
            result,
            attempts
        }
    }
    async arrangeUserSpot(userForLeaderBoard: IUserLeaderBoardScore, LeaderBoardScore: Array<IUserLeaderBoardScore>): Promise<Array<IUserLeaderBoardScore>> {
        try {
            let arrayToArrange:Array<IUserLeaderBoardScore> = LeaderBoardScore

            arrayToArrange = LeaderBoardScore.filter(user => user.userId !== userForLeaderBoard.userId)

            arrayToArrange.push(userForLeaderBoard)
        
            const arrayToSort = this.getArrayToSort(arrayToArrange)

            return arrayToSort.sort((a, b) => a.totalPoints - b.totalPoints)
            .map<IUserLeaderBoardScore>((user:IUserLeaderBoardScore) => {
                return {
                    userId: user.userId,
                    timing: user.timing,
                    score: user.score,
                    result: user.result,
                    attempts: user.attempts
                }
            })
            
        } catch (error) {
            throw error
        }
    }
    getArrayToSort(usersScore: Array<IUserLeaderBoardScore>){
        const createdArrayToSort = usersScore.map(user => {

            let correctAnswer = user.result.correctAnswers.length
            let timing = user.timing
            let [, totalQuestions] =  user.score.split('/')
        
            
            let difference = Number(totalQuestions) - correctAnswer
            
            let totalPoints = timing + (100000 * difference)

            return {
                ...user,
                totalPoints
            }
        })

        return createdArrayToSort
    }

    async  defineUsersSpots(usersScore: IUserLeaderBoardScore[], leaderBoardId: string):    Promise<IUserLeaderBoardScore> {
        try {
            return await leaderboard.updateLeaderboardUserScore(leaderBoardId, usersScore) as IUserLeaderBoardScore
        } catch (error) {
            throw error
        }
    }
   async margeUsersInfoInLeaderboard(usersScore: Array<IUserLeaderBoardScore>, usersInfo: Array<IUserObjectJWT>): Promise<Array<IUserLeaderBoardScore & { name: string, profileImg: string }>> {

    return usersScore.map((score: IUserLeaderBoardScore, index: number) => {
        let found = usersInfo.find(user => {
            return user.userId === score.userId
        })
        const obj = {
            ...score,
            name: found?.name ?? 'Deleted User', 
            profileImg: found?.profileImg ?? '/default'
        };
        return obj;
    });
}
    async deleteQuizLeaderBoard(quizId: string): Promise<void>{
        try {
            const deleted = await leaderboard.deleteLeaderBoardByQuizId(quizId)
            //if(!deleted) throw {message: 'não foi possivel deletar a leaderboard', code: 500, type: 'global'}
            return
        } catch (error) {
            throw error
        }

    }
}
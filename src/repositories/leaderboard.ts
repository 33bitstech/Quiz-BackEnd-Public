import ILeaderBoard from "../interfaces/ILeaderboard";
import IUserLeaderBoardScore from "../interfaces/IUserLeaderBoardScore";
import leaderboardModel from "../models/leaderboardModel";


export default new class leaderboard {
    async save(leaderboard: ILeaderBoard ): Promise<ILeaderBoard | unknown> {
        try {
            const newleaderboard = new leaderboardModel(leaderboard)
            return newleaderboard.save()
            
        } catch (error) {
            throw error
        }

    }
    async findLeaderboardByQuizId(quizId:string): Promise<ILeaderBoard | unknown> {
        try {
            const leaderboard = await leaderboardModel.findOne({quizId})
            if(!leaderboard) throw {type: 'global', message: 'leaderboard não encontrado', code: 404}

            return leaderboard as ILeaderBoard

        } catch (error) {
            throw error
        }
    }
    async updateLeaderboardUserScore(leaderBoardId: string, usersScoreBoard: Array<IUserLeaderBoardScore>): Promise<ILeaderBoard | unknown>  {
        try {
            const leaderBoardUpdated = await leaderboardModel.updateOne({leaderBoardId}, {$set: {usersScoreBoard}}, {new: true})
            if(!leaderBoardUpdated) throw {type: 'global', message: 'leaderboard não atualizado', code: 500}

            return leaderBoardUpdated

        } catch (error) {
            throw error
        }
    } 
    async deleteLeaderBoardByQuizId(quizId: string): Promise<ILeaderBoard | null> {
        try {
            return leaderboardModel.findOneAndDelete({quizId})
        } catch (error) {
            throw error
        }
    }
}


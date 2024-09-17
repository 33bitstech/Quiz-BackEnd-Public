import ILeaderBoard from "../interfaces/ILeaderboard";
import mongoose from "mongoose";

export const Schema = new mongoose.Schema<ILeaderBoard>({
    leaderBoardId: {type: String, required: true},
    quizId: {type: String, required: true},
    usersScoreBoard: {type: Array, default: []}
})


const leaderboardModel = mongoose.model<ILeaderBoard>('leaderboard', Schema) 

export default leaderboardModel
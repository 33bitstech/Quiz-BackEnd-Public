import IUserLeaderBoardScore from "./IUserLeaderBoardScore" 

export default interface ILeaderBoard {
    leaderBoardId: string;
    quizId: string;
    usersScoreBoard?: Array<IUserLeaderBoardScore>
}
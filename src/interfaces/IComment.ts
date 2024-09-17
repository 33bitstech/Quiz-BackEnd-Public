import IAnswers from "./IReplies";
export default interface IComment {
    commentId: string;
    userId: string;
    body: string;
    quizId: string;
    created_at: Date;
    updated_at: Date;
    userLikes?: Array<{userId: string}>;
    replies?: Array<IAnswers> 
}



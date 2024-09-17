export default interface IReplies {
    commentId: string;
    replyId: string
    userId: string;
    body: string;
    userLikes: Array<{userId: string}>;
    created_at: Date;
    updated_at: Date;
    replyTo: string; 
}
import IAnswers from "../interfaces/IReplies";
import IComment from "../interfaces/IComment";
import CommentsRepositorie from "../repositories/comments";
import { createUUID } from "../utils/ids";
import { isTextEmpty } from "../utils/inputs";
import IReplies from "../interfaces/IReplies";
import IUser from "../interfaces/IUser";
import IUserObjectJWT from "../interfaces/JwtUser";
import User from "../services/user";

export default class Comments {
    constructor(public commentId: string, public userId: string, public quizId: string, public body: string,
        public created_at: Date, public updated_at: Date, public userLikes?: Array<{userId: string}>,
        public replies?: Array<IAnswers> ){}

    static async createCommentInstance(commentObject: IComment, userId: string): Promise<IComment> {
        try {
            let {
                commentId, body, quizId,
                created_at, updated_at,
                userLikes,  replies
            } = commentObject
    
            if(!commentId) commentId = createUUID()
            if(!userId) throw {message: 'usuario não informado', code: 406, type: 'global'}
            if(!quizId) throw {message: 'quiz não informado', code: 406, type: 'global'}
            if(!body || isTextEmpty(body)) throw {message: 'comentário não pode estar vazio', code: 406, type: 'comentário'}
    
            if(!created_at) created_at = new Date()
            if(!updated_at) updated_at = created_at
    
            return new Comments(commentId, userId, quizId, body, created_at, updated_at, userLikes, replies)
            
        } catch (error) {
            throw error
        }
    }
   static  async saveComment(comment: IComment): Promise<IComment>{
        try {
            let commentSaved = await CommentsRepositorie.saveComment(comment)
            return commentSaved
        } catch (error) {
            throw error
        }
    }
    static async getComment(commentId: string): Promise<IComment> {
        try {
            let comment = await CommentsRepositorie.findComment(commentId)
            if(!comment) throw {message: 'comentário não encontrado', code: 404, type: 'comment'}

            return comment

        } catch (error) {
            throw error
        }
    }
    static async getComments(quizId: string): Promise<Array<IComment>> {
        try {
            const comments = await CommentsRepositorie.findComments(quizId)
            return comments as Array<IComment>
        } catch (error) {
            throw error
        }
    }
    static async getCommentRepiles(commentId: string):Promise <Array<IReplies>> {
        try {
            const comment = await CommentsRepositorie.findComment(commentId)
            if(!comment) throw {message: 'comentário não encontrado', code: 404, type: 'comment'}

            return comment.replies as Array<IReplies>

        } catch (error) {
            throw error
        }
    }
    static async replyComment(comment:IReplies, replies: Array<IReplies>, commentId: string, replyTo: string): Promise<Array<IReplies>> {
        try {
            if(!replyTo) replyTo = ''
            if(!comment.replyId) comment.replyId = createUUID()
            if(!comment.userLikes) comment.userLikes = []

            comment.created_at = new Date()
            comment.updated_at = comment.created_at
            comment.replyTo = replyTo

            replies.push(comment)
            let repiles = await CommentsRepositorie.saveReply(replies, commentId)
            return repiles

        } catch (error) {
            throw error
        }
    }
    static async likeComment(userId: string, commentId: string): Promise<Array<{userId: string}>> {
        try {
            const comment = await CommentsRepositorie.findComment(commentId)
            if(!comment) throw {message: 'comentário não encontrado', code: 404, type: 'comment'}

            const found = comment.userLikes?.find(userLiked => userLiked.userId === userId)

            if(found) throw {message: 'esse usuario já curtiu esse comentário', type: 'global',  code: 400}

            comment.userLikes?.push({userId})

            let likedComment = await CommentsRepositorie.updateLikes(comment.userLikes ?? [{userId}], commentId)

            return likedComment
        } catch (error) {
            throw error
        }

    }
    static async unlikeComment(userId: string, commentId: string): Promise<Array<{userId: string}>> {
        try {
            const comment = await CommentsRepositorie.findComment(commentId)
            if(!comment) throw {message: 'comentário não encontrado', code: 404, type: 'comment'}

            const found = comment.userLikes?.find(userLiked => userLiked.userId === userId)

            if(!found) throw {message: 'esse usuario não curtiu esse comentário', type: 'global',  code: 400}

            const commentFilter = comment.userLikes?.filter(userLikes => userLikes.userId !== userId)
            let unLikedComment = await CommentsRepositorie.updateLikes(commentFilter ?? [{userId}], commentId)
            
            return unLikedComment
            
        } catch (error) {
            throw error
        }

    }
    static async likeReply(userId:string, commentId:string, repiles: Array<IReplies>, replyId: string): Promise<Array<IReplies>>{
        try {
            const reply = repiles.find(replyObj => replyObj.replyId === replyId)

            let found = reply?.userLikes?.find(userLiked => userLiked.userId === userId)

            if(!reply) throw {message: 'comentário que você está tentando curtir não existe ou foi excluido', type: 'global',  code: 400}
            if(found) throw {message: 'esse usuario já curtiu esse comentário', type: 'global',  code: 400}

            repiles.map(reply => {
                if(reply.replyId === replyId) reply.userLikes.push({userId})
                    return reply
            })

            let likedReply = await CommentsRepositorie.updateRepilesLikes(repiles, commentId)

            if(!likedReply) throw {message: 'não foi possivel curtir esse comentário', type: 'global', code: 500}

            return likedReply

        } catch (error) {
            throw error
        }
    }
    static async unLikeReply(userId:string, commentId:string, repiles: Array<IReplies>, replyId: string): Promise<Array<IReplies>>{
        try {
            const reply = repiles.find(replyObj => replyObj.replyId === replyId)

            let found = reply?.userLikes?.find(userLiked => userLiked.userId === userId)

            if(!reply) throw {message: 'comentário que você está tentando curtir não existe ou foi excluido', type: 'global',  code: 400}
            if(!found) throw {message: 'esse usuario nunca curtiu esse comentário', type: 'global',  code: 400}

            const addLikeToReply = repiles.map(reply => {
                if(reply.replyId === replyId) reply.userLikes = reply.userLikes.filter(user => user.userId!== userId)
                    return reply
            })

            let likedReply = await CommentsRepositorie.updateRepilesLikes(addLikeToReply, commentId)

            if(!likedReply) throw {message: 'não foi possivel descurtir esse comentário', type: 'global', code: 500}

            return likedReply
            
        } catch (error) {
            throw error
        }
    }
    static async editComment(comment: IComment): Promise<IComment> {
        try {
            let commentUpdated = await CommentsRepositorie.updateComment(comment)
            if(!commentUpdated) throw {message: 'não foi possivel editar o comentário', code: 500, type: 'comment'}

            return commentUpdated

        } catch (error) {
            throw error
        }
    }
    static async editReply(commentId: string, reply: IReplies, userId: string): Promise<Array<IReplies>> {
        try {
            const comments = await CommentsRepositorie.findComment(commentId),
            repiles = comments?.replies

            let foundReply = repiles?.find(reply => reply.replyId === reply.replyId)
            if(!foundReply) throw {code: 404, message: 'comentáro não encontrado', type: 'reply'}

            const isUserCreatorOfTheReply = foundReply.userId === userId
            if(!isUserCreatorOfTheReply) throw {code: 403, message: 'você não tem permição para editar esse comentário', type: 'reply'}

            reply.updated_at = new Date()
            const commentWithReplyEdited = await CommentsRepositorie.updateReply(commentId, reply)

            if(!commentWithReplyEdited) throw {code: 500, message: 'não foi possivel editar esse comentário', type: 'comment'}

            return commentWithReplyEdited.replies as Array<IReplies>

            
        } catch (error) {
            throw error
        }
    }
    static async deleteComment(comment: IComment, userId: string): Promise<void> {
        try {
            let deleted = await CommentsRepositorie.deleteComment(comment, userId)
            if(deleted === null) throw {message: 'não foi possivel deletar esse comentário', code: 500, type: 'comment'}

            return 

        } catch (error) {
            throw error
        }
    }
    static async mergeUsersInfoAndComment(comments: Array<IComment>, users: Array<IUserObjectJWT>): Promise<Array<IComment & { name: string, profileImg: string }>> {

        return comments.map((comment: IComment, index: number) => {
            let found = users.find(user => {
                return user.userId === comment.userId
            })
            const obj = {
                ...comment,
                name: found?.name ?? 'Deleted User', 
                profileImg: found?.profileImg ?? 'default'
            };
            return obj;
        });
    }
    static async mergeUsersInfoAndReplies(replies: Array<IReplies>, users: Array<IUserObjectJWT>): Promise<Array<IReplies & { name: string, profileImg: string }>> {
        let repilesPromisses = replies.map(async(reply: IReplies, index: number) => {
            let found = users.find(user => {
                return user.userId === reply.userId
            })
            let user = await User.findUserById(reply.replyTo)
            const obj = {
                ...reply,
                name: found?.name ?? 'Deleted User', 
                profileImg: found?.profileImg ?? 'default',
                userRepliedDates: {
                    userId: reply.replyTo ?? '',
                    name: user?.name ?? ''
                }
            };
            return obj;
        });

        return Promise.all(repilesPromisses)
    }
    static async deleteReply(commentId:string, replyId:string, repiles:Array<IReplies>){
        try {
            const newRepiles = repiles.filter(reply => reply.replyId !== replyId)

            const comment = await CommentsRepositorie.updateRepiles(commentId, newRepiles)
            return comment.replies

        } catch (error) {
            throw error
        }
    }
    
}
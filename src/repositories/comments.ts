import commentsModel from "../models/commentsModel"
import IComment from "../interfaces/IComment"
import IReplies from "../interfaces/IReplies"

export default new class CommentsRepositorie {
    async saveComment(comment: IComment): Promise<IComment> {
        try {
            let preSave = new commentsModel(comment)
            return  await preSave.save()

        } catch (error) {
            throw error
        }
    }
    async saveReply(replies: Array<IReplies>, commentId: string): Promise<Array<IReplies>> {
        try {
           let comments = await commentsModel.findOneAndUpdate({commentId}, {$set:{ replies}}, {new: true})

           if(!comments) throw {message: 'ocorreu um erro ao responder', type: 'global', code: 500}
           return comments.replies as Array<IReplies>
           
        } catch (error) {
            throw error
        }
    }
    async findComment(commentId: string): Promise<IComment | null> {
        try {
            let comment = await commentsModel.findOne({commentId})
            return comment
        } catch (error) {
            throw error
        }
    }
    async findComments(quizId: string): Promise<Array<IComment> | null> {
        try {
            let comments = await commentsModel.find({quizId})
            if(!comments) throw {message: 'comentários não foram encontrados', code: 404, type: 'comment'}
            return comments
        } catch (error) {
            throw error
        }
    }
    async updateComment(comment: IComment): Promise<IComment | null> {
        try {
            const {commentId, body} = comment
            let commentUpdated = await commentsModel.findOneAndUpdate({commentId}, {$set: {body}}, {new: true})
            return commentUpdated
        } catch (error) {
            throw error
        }
    }
    async updateReply(commentId: string, reply: IReplies): Promise<IComment | null> {
        try {
           return  await commentsModel.findOneAndUpdate(
                { commentId },
                { 
                  $set: { "replies.$[elem].body": reply.body } 
                },
                { 
                  arrayFilters: [ { "elem.replyId": reply.replyId } ] ,
                  new: true,
                },
              );
        } catch (error) {
            throw error
        }
    }
    async updateRepiles(commentId: string, replies: Array<IReplies>): Promise<IComment> {
        try {
            let comment = await commentsModel.findOneAndUpdate({commentId}, {replies}, {new: true})
            if(!comment) throw {message:'não foi possivel modificar as respostas do comentário', type: 'reply', code: 500}
            return comment
        } catch (error) {
            throw error
        }
    }
    async updateLikes(userLikes: Array<{userId: string}>, commentId: string): Promise<Array<{userId: string}>> {
        try {
            let comments = await commentsModel.findOneAndUpdate({commentId}, {$set:{userLikes}}, {new: true})
            return comments?.userLikes as Array<{userId: string}>
        } catch (error) {
            throw error
        }
    }
    async updateRepilesLikes(replies: Array<IReplies>, commentId: string): Promise<Array<IReplies> | undefined> {
        try {
            let comments = await commentsModel.findOneAndUpdate({commentId}, {$set: {replies}}, {new: true})
            return comments?.replies || undefined
        } catch (error) {
            throw error
        }
    }
    async deleteComment(comment:IComment, userId: string): Promise<void | null> {
        try {
            const {commentId} = comment
             
            return await commentsModel.findOneAndDelete({commentId, userId})
        } catch (error) {
            throw error
        }
    }
   
}
import { Request, response, Response } from "express"
import Comments from "../services/comments"
import IComment from "../interfaces/IComment"
import IReplies from "../interfaces/IReplies"
import User from "../services/user"

export default new class CommentController {
    async save(req: Request, res: Response) {
        try {
            const {quizId} = req.params,
            {user} = req,
            comment: IComment = req.body.comment

            if(!quizId) throw {message: 'quiz não informado', code: 406, type: 'global'}
            if(!user || !user?.userId) throw {message: 'usuario não informado', code: 400, type: 'global'}

            comment.userId = user.userId as string 

            let newComment = await Comments.createCommentInstance(comment, user.userId),
            commentSaved = await Comments.saveComment(newComment)

            res.status(200).send({commentSaved})
        } catch (error: any) {
             
            let message = error.message || 'ocorreu um erro no servidor',
            code = error.code || 500, type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
    async getComments(req: Request, res: Response){
        try {
            const {quizId} = req.params

            if(!quizId) throw {message: 'quiz não encontrado', code: 406, type: 'global'}
            const comments = await Comments.getComments(quizId),
            usersId = comments.map(comment => comment.userId),
            users = await User.getUsers(false, usersId)

            let commentsMargedArray = await Comments.mergeUsersInfoAndComment(comments, users)

            res.status(200).send({commentsMargedArray: commentsMargedArray.reverse()})
        } catch (error: any) {
             
            let message = error.message || 'ocorreu um erro no servidor',
            code = error.code || 500, type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
    async editComment(req: Request, res: Response){
        try{
            const {commentId} = req.params,
                {user} = req,
                comment: IComment = req.body.comment
                
                if(!commentId) throw {message: 'comentário não informado', code: 406, type: 'global'}
                if(!user || !user?.userId) throw {message: 'usuario não informado', code: 400, type: 'global'}
    
                let newComment = await Comments.createCommentInstance(comment, user.userId as string),
                commentUpdated = await Comments.editComment(newComment)
    
                res.status(200).send({commentUpdated})

        } catch (error: any) {
             
            let message = error.message || 'ocorreu um erro no servidor',
            code = error.code || 500, type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
    async deleteComment(req: Request, res: Response){
        try{
            const {commentId} = req.params,
                {user} = req
                
                if(!commentId) throw {message: 'comentário não informado', code: 406, type: 'global'}
                if(!user || !user?.userId) throw {message: 'usuario não informado', code: 400, type: 'global'}
                
                let comment: IComment = await Comments.getComment(commentId)
                
                 await Comments.deleteComment(comment, user.userId as string)
    
                res.status(200).send({deleted: true})

        } catch (error: any) {
             
            let message = error.message || 'ocorreu um erro no servidor',
            code = error.code || 500, type = error.type || 'global'

            res.status(code).send({message, type})
        }

    }
    async reply(req: Request, res: Response) {
        try {
            const {commentId} = req.params,
            {user} = req,
            comment: IReplies = req.body.comment,
            {replyTo} = req.body
            
            if(!commentId) throw {message: 'comentário não informado', code: 406, type: 'global'}
            if(!user || !user?.userId) throw {message: 'usuario não informado', code: 400, type: 'global'}

            comment.userId = user.userId as string 
            const repiles = await Comments.getCommentRepiles(commentId)

            let updatedRepiles = await Comments.replyComment(comment, repiles, commentId, replyTo)

            res.status(200).send({updatedRepiles, commentId})

        } catch (error: any) {
             
            let message = error.message || 'ocorreu um erro no servidor',
            code = error.code || 500, type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
    async editReply(req: Request, res: Response){
        try {
            const {commentId} = req.params,
            {user} = req,
            reply: IReplies | IComment = req.body.reply

            if(!commentId) throw {message: 'comentário não informado', code: 406, type: 'global'}
            if(!user || !user?.userId) throw {message: 'usuario não informado', code: 400, type: 'global'}

            await Comments.createCommentInstance(reply as IComment, user.userId)
            
            let updatedRepiles = await Comments.editReply(commentId, reply as IReplies, user.userId)


            res.status(200).send({updatedRepiles})

        } catch (error: any) {
             
            let message = error.message || 'ocorreu um erro no servidor',
            code = error.code || 500, type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
    async likeComment(req: Request, res: Response) {
        try {
            const commentId = req.params.commentId,
            user = req.user

            if(!commentId) throw {message: 'id do comentário não foi fornecido', type: 'comment', code: 400}

            let commentLiked = await Comments.likeComment(user?.userId as string, commentId)

            res.status(200).send({commentLiked, commentId})
            
        } catch (error: any) {
            let message = error.message || 'ocorreu um erro no servicor',
            code = error.code || 500,
            type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
    async unLikeComment(req: Request, res: Response) {
        try {
            const commentId = req.params.commentId,
            user = req.user

            if(!commentId) throw {message: 'id do comentário não foi fornecido', type: 'comment', code: 400}

            let commentLiked = await Comments.unlikeComment(user?.userId as string, commentId)

            res.status(200).send({commentLiked, commentId})
            
        } catch (error: any) {
            let message = error.message || 'ocorreu um erro no servicor',
            code = error.code || 500,
            type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
    async likeReply(req: Request, res: Response) {
        try {
            const {commentId, replyId} = req.params,
            user = req.user

            if(!commentId) throw {message: 'id do comentário não foi fornecido', type: 'comment', code: 400}
            if(!replyId) throw {message: 'id do comentário não foi fornecido', type: 'comment', code: 400}

            const repiles = await Comments.getCommentRepiles(commentId)

            let commentLiked = await Comments.likeReply(user?.userId as string, commentId, repiles, replyId)

            res.status(200).send({commentLiked, commentId})
            
        } catch (error: any) {
            let message = error.message || 'ocorreu um erro no servicor',
            code = error.code || 500,
            type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
    async unLikeReply(req: Request, res: Response){
        try {
            const {commentId, replyId} = req.params,
            user = req.user

            if(!commentId) throw {message: 'id do comentário não foi fornecido', type: 'comment', code: 400}
            if(!replyId) throw {message: 'id do comentário não foi fornecido', type: 'comment', code: 400}

            const repiles = await Comments.getCommentRepiles(commentId)

            let commentUnliked = await Comments.unLikeReply(user?.userId as string, commentId, repiles, replyId)

            res.status(200).send({commentUnliked, commentId})
            
        } catch (error: any) {
            let message = error.message || 'ocorreu um erro no servicor',
            code = error.code || 500,
            type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
    async deleteReply(req: Request, res: Response) {
        try {
            const {commentId, replyId} = req.params,
            {user} = req
            let replies = (await Comments.getComment(commentId)).replies,
            foundReply = replies?.find(reply => reply.replyId == replyId)

            if(!foundReply) throw {message:'resposta não existe', type: 'reply', code: 404}
        
            if(user?.userId !== foundReply.userId) throw {message:'essa resposta não pertence a esse usuario', type: 'reply', code: 404}

            const currentReplies = await Comments.deleteReply(commentId, replyId, replies as Array<IReplies>)
            res.status(200).send({replies: currentReplies?.reverse()})
        } catch (error:any) {
            let message = error.message || 'ocorreu um erro no servicor',
            code = error.code || 500,
            type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
    async  getCommentRepiles(req: Request, res: Response){
        try {
            const {commentId} = req.params

            if(!commentId) throw {message: 'quiz não encontrado', code: 406, type: 'global'}
            const repiles = await Comments.getCommentRepiles(commentId),
            usersId = repiles.map(reply => reply.userId),
            users = await User.getUsers(false, usersId)

            const repliesMargedArray = await Comments.mergeUsersInfoAndReplies(repiles, users)
            
            res.status(200).send({repliesMargedArray, commentId})
        } catch (error: any) {
             
            let message = error.message || 'ocorreu um erro no servidor',
            code = error.code || 500, type = error.type || 'global'

            res.status(code).send({message, type})
        }
    }
}
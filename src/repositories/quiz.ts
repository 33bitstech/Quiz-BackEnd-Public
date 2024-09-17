import IQuestion from "../interfaces/IQuestion";
import IQuizes from "../interfaces/IQuizes";
import quizModel from "../models/quizModel";

export default new class quizRepositorie {
    async save(quiz: IQuizes): Promise<IQuizes>{
        try {
            const newQuiz = new quizModel(quiz)
            return await newQuiz.save()
        } catch (error) {
            throw error
        }
    }
    async update(quiz:IQuizes, quizId: string): Promise<IQuizes | null> {
        try {
            const updatedQuiz:IQuizes | null = await quizModel.findOneAndUpdate({quizId: quizId},{ 
                $set: quiz
            }, {$new: true})

            if(!updatedQuiz) throw {message: 'não foi possivel atualizar o Quiz', code: 500, type: 'Quiz'}
            return updatedQuiz

        } catch (error) {
            throw error
        }
    }
    async updateType(quizId: string, type: string):Promise<IQuizes | null> {
            try {
                const updatedQuiz:IQuizes | null = await quizModel.findOneAndUpdate({quizId: quizId},{ 
                    $set: {type}
                }, {$new: true})
    
                if(!updatedQuiz) throw {message: 'não foi possivel atualizar o Quiz', code: 500, type: 'Quiz'}
                return updatedQuiz
    
            } catch (error) {
                throw error
            }
    }
    async updateAmount(quizId: string, usersCount: number):Promise <IQuizes | null>{
        try {
            return quizModel.findOneAndUpdate({quizId}, {usersCount})
        } catch (error) {
            throw error
        }
    }
    async findQuizById(quizId: string): Promise<IQuizes | unknown> {
        try {
            return quizModel.findOne({quizId})
        } catch (error) {
            throw error
        }
    }
    async findUserQuizzes(userId: string, isPrivate: boolean, draft: boolean): Promise<Array<IQuizes> | unknown> {
        try {
            let query = draft ? {userCreatorId: userId, draft} : {userCreatorId: userId, isPrivate, draft}
            return quizModel.find(query)
        } catch (error) {
            throw error
        }
    }
    async updateImg(quizId: string, userCreatorId: string, quizThumbnail: string): Promise<IQuizes | unknown> {
        try {
            return quizModel.findOneAndUpdate({quizId, userCreatorId}, {$set:{quizThumbnail}}, {new: true})
        } catch (error) {
             
            throw error
        }
    }
    async updateDraft(quizId: string, draft: boolean): Promise<void> {
        try {
            await quizModel.findOneAndUpdate({quizId}, {draft}) 
        } catch (error) {
            throw error
        }
    }
    async updateQuestions(quizId: string, userCreatorId: string, questions: Array<IQuestion>, qtdQuestions: number): Promise <Array<IQuestion>> {
        try {
            const newQuestions = await quizModel.findOneAndUpdate({quizId, userCreatorId }, {$set:{questions, qtdQuestions}}, {new: true})
             if(newQuestions) return newQuestions.questions as Array<IQuestion>
             throw {message: 'não foi possivel atualizar as perguntas', code: 500}
        } catch (error) {
            throw error
        }
    }
    async updateAlternativesImgs(userId: string, quizId: string, question: IQuestion):Promise<Array<IQuestion> | null> {
        try {
            return await quizModel.findOneAndUpdate({quizId, userCreatorId: userId, 'questions.questionId': question.questionId}, {
                $set: {
                    'questions.$': question
                }
            }, {new: true})
        }
        catch(error) {
            throw error
        }
     }
    async findQuizzes(list: Array<string> | undefined,): Promise<Array<IQuizes> | []> {
        let query = list ?  { quizId: { $in: list}} : {}
        try {
            const quizzes = await quizModel.find(query)
            return quizzes
        } catch (error) {
            throw error
        }
    }
    async findPublicQuizzes(): Promise<Array<IQuizes> | []> {
        try {
            const quizzes = await quizModel.find({isPrivate: false, draft: false})
            return quizzes
        } catch (error) {
            throw error
        }
    }
    async search(title: string | RegExp, categories: Array<RegExp> | string, tags: Array<string>): Promise<Array<IQuizes> | unknown> {
        try {
            let quizzes = await quizModel.find({isPrivate: false, draft: false,
                $or:[
                    {title: title}, 
                    {category: {$in: categories}}, 
                    {tags: {$in: tags}}
                ]})
            return quizzes
        } catch (error) {
            throw {error}
        }
    }
}
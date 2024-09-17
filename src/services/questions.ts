import IQuestion from "../interfaces/IQuestion"
import IResultComparation from "../interfaces/IResultComparation"
import IUserAnswer from "../interfaces/IUserAnswer"
import { makeImgSrc, getImgKey} from "../utils/images"
import { isTextEmpty } from "../utils/inputs"
import quiz from "../repositories/quiz"
import S3AWS from "./S3AWS"
export default new class question {
    async compareQuestions(userAnswers: Array<IUserAnswer>, questionAnswers:Array<IQuestion>): Promise<IResultComparation> {
        let index = 0,  result: IResultComparation = {correctAnswers: [], incorrectAnswers: []}, invalidQuestion = []
        for(const questionItem of questionAnswers) {
            try {
                const currentAnswer = userAnswers[index]
                await this.verifyQuestionAndAnswer(questionItem, currentAnswer)

                if(currentAnswer.answer === questionItem.correctAnswer) {
                    result.correctAnswers.push({question: questionItem.question, answer: currentAnswer.answer})
                }
                else {
                    result.incorrectAnswers.push({question: questionItem.question, answer: currentAnswer.answer})
                }
            } catch (error) {
                invalidQuestion.push(error)
            }
            index++
        }
        if(invalidQuestion.length > 0) throw invalidQuestion

        return result
    }
    
   async verifyQuestionAndAnswer(question: IQuestion, userAnswer: IUserAnswer): Promise<void>{
        try {
            let {answer} = userAnswer,
            isAnswerEmpty = isTextEmpty(answer),
            answerBelongsToQuestion = question.questionId === userAnswer.questionId

            if(isAnswerEmpty) throw {code: 406, message: 'nenhuma resposta do quiz pode estar vazia', type: 'quiz'}
            if(!answerBelongsToQuestion) throw {code: 403, message: 'essa resposta não pertence a essa questão', type: 'question'}
            return

        } catch (error) {
            throw error
        }

    }  
    async addImgToQuestions(questions: Array<IQuestion>,   files: Express.Multer.File[] ):Promise <Array<IQuestion>> {
        try {
             const urlsSrc = files.map((file: any) => makeImgSrc(file.key, 'quizvortex.s3.sa-east-1.amazonaws.com')),
             insertUrls = questions.map((question, index) => {
                return {
                    ...question,
                    image: urlsSrc[index]
                }
             })
             return insertUrls
        } catch (error) {
            throw error
        }
    }
    async addImgToAlternatives(question: IQuestion, files: Express.Multer.File[]):Promise<IQuestion> {
        try {
            const urlsSrc = files.map((file: any) => makeImgSrc(file.key, 'quizvortex.s3.sa-east-1.amazonaws.com')),
            insertUrls = question.answers.map((answer: any, index) => {
                return {
                    answer: answer.answer,
                    thumbnail:   urlsSrc[index]
                }
             })
             let newQuestions =  question
             newQuestions.answers = insertUrls
             newQuestions.correctAnswerThumbnal = urlsSrc[0]
              
             return newQuestions
        } catch (error) {
            throw error
        }
    }
    async updateQuestions(quizId: string, userId: string, questions: Array<IQuestion>):Promise<Array<IQuestion>> {
        try {
           let qtdQuestions = questions.length
           const newQuestions = await quiz.updateQuestions(quizId, userId, questions, qtdQuestions)
           return newQuestions
        } catch (error) {
           throw error
        }
     }
     async updateAlternativesImgs(userId: string, quizId: string, question: IQuestion):Promise<Array<IQuestion>> {
        try {
            let newAlternativesImgs = await quiz.updateAlternativesImgs(userId, quizId, question)
            if(!newAlternativesImgs) throw {message: 'não foi possivel atualizar as informações', code: 500}
            return newAlternativesImgs
        }
        catch(error) {
            throw error
        }
     }
     async deleteImagesOfQuestions(imagesOfQuestionToDalete: Array<IQuestion>):Promise <void> {
        try {
            let keys = imagesOfQuestionToDalete.map(question =>  getImgKey('questionimg', question.image as string))
            await S3AWS.deleteQuestionsImgs(keys)
            return
        } catch (error) {
            throw error
        }
     }

}
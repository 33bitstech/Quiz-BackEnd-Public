import IQuizes from "../interfaces/IQuizes";
import IQuestion from "../interfaces/IQuestion";
import IQuestionValidation from "../interfaces/IQuestionValidation";
import { IResultMessages } from "../interfaces/IQuizes";
import { createUUID } from "../utils/ids";
import { escapeRegExp } from "../utils/regex";
import { isTextEmpty, generateTrimmedString } from "../utils/inputs";
import quiz from "../repositories/quiz";
import leaderboard from "./leaderboard";

export default class Quiz {
    constructor(public quizId: string, public title: string, public description: string,
      public isPrivate: boolean,  public userCreatorId: string, public userCreatorName: string, public idiom: string,
        public draft: boolean, public category: string, public tags: Array<string>, public resultMessages: IResultMessages,
      public quizThumbnail?: string, public qtdQuestions?: number, public questions?: Array<IQuestion>, public usersCount?: number,
      public created_at?: Date, public updated_at?: Date){}
       static async save(quizObj: IQuizes):Promise<void>{
         try {
            await quiz.save(quizObj)
         } catch (error) {
            throw error
         }
        }
        static async update(quizObj: IQuizes, quizId: string): Promise<void>{
         try {
            await quiz.update(quizObj, quizId)
         } catch (error) {
            throw error
         }
        }
        static async updateType(quizId: string, type: 'default/RW' | 'image/RW'): Promise<void>{
         try {
            await quiz.updateType(quizId, type)
         } catch (error) {
          throw error  
         }
        }
         static async createQuizInstance(quizObj: IQuizes): Promise<IQuizes> {
            try {
               let {quizId, title, description, isPrivate, userCreatorId, userCreatorName, idiom, draft, category, tags, resultMessages} = quizObj

               if(!quizId) quizId = createUUID()
               if(!idiom || isTextEmpty(idiom)) idiom = 'en'
               
               if(resultMessages){
                  await this.verifyResultMessages(resultMessages)
               } 
               else resultMessages = this.getDefaultResultMessages()

               if(typeof(draft) !== "boolean") draft = true
               if(typeof(isPrivate) !== "boolean") isPrivate = true

               await this.verifyTitle(title)
               await this.verifyDescription(description)
               await this.verifyCategory(category)

               if(!tags) tags = []
               tags = await this.returnTagsNotEmpty(tags)
                  
               const factory = new Quiz(quizId, title, description, isPrivate, userCreatorId, userCreatorName, idiom, draft as boolean, category, tags, resultMessages)
               return factory as IQuizes
               
            } catch (error) {
               throw error
            }
            
         }
         static async createUpdateQuizInstance(quizObj: IQuizes, quizId: string): Promise<
         {
            title: string,
             description: string, 
            isPrivate: boolean, 
            userCreatorName: string, 
            category: string,
            idiom: string,
            resultMessages: IResultMessages,
            draft: boolean,
            tags: Array<string>,
            quizThumbnail: string,
          }>
           {
            try {
               let {
                  title, description, isPrivate, 
                  userCreatorName, 
                  idiom, draft,
                   category, tags, 
                  resultMessages, 
                  quizThumbnail
               } = quizObj

               const quiz = await this.getQuiz(quizId)

               if(!idiom || isTextEmpty(idiom)) idiom = quiz.idiom
               
               if(resultMessages){
                  await this.verifyResultMessages(resultMessages)
               } 
               else resultMessages = quiz.resultMessages

               if(typeof(draft) !== "boolean") draft = quiz.draft
               if(typeof(isPrivate) !== "boolean") isPrivate = quiz.isPrivate

               if(title) await this.verifyTitle(title)
               if(description) await this.verifyDescription(description)
               if(category) await this.verifyCategory(category)

               if(!tags) tags = quiz.tags || []
               tags = await this.returnTagsNotEmpty(tags)
                  
               const instanceToUpdate = {
                  title: title || quiz.title,
                   description: description || quiz.description,
                   category: category || quiz.category,
                   draft: draft  || quiz.draft as boolean,
                   idiom: idiom,
                   tags: tags,
                   isPrivate: isPrivate,
                   resultMessages: resultMessages as IResultMessages,
                   userCreatorName: userCreatorName,
                   quizThumbnail: quizThumbnail || quiz.quizThumbnail
                  }

               return instanceToUpdate
               
            } catch (error) {
               throw error
            }
            
         }
         static async getQuiz(quizId: string): Promise<IQuizes>{
            try {
               const foundQuiz = await quiz.findQuizById(quizId)

               if(!foundQuiz) throw {message: 'quiz não encontrado', type: 'global', code: 404}
               return foundQuiz as IQuizes

            } catch (error) {
               throw error
            }
         }
         static async getQuizzes(list: Array<string> | undefined): Promise<Array<IQuizes > | []> {
            try {
               const Quizzes = await quiz.findQuizzes(list)

               return  Quizzes

            } catch (error) {
               throw error
            }
         }
         static async getDraftQuizzes(userId: string):Promise<Array<IQuizes | []>> {
            try {
               const userQuiz = await quiz.findUserQuizzes(userId, true, true)

               if(!userQuiz) throw {code: 404, message: 'não foram encontrados nenhum quiz desse usuario ou o usuario não foi cadastrado', type: 'global'}
               return  userQuiz as Array<IQuizes>

            } catch (error) {
               throw error
            }
         }
         static async getPublicQuizzes():Promise<Array<IQuizes> | []> {
            try {
               const quizzes = await quiz.findPublicQuizzes()
               return quizzes
            } catch (error) {
               throw error
            }
         }
         static async getUserPublicQuizes(userId: string): Promise<Array<IQuizes>> {
            try {
               const userQuiz = await quiz.findUserQuizzes(userId, false, false)

               if(!userQuiz) throw {code: 404, message: 'não foram encontrados nenhum quiz desse usuario ou o usuario não foi cadastrado', type: 'global'}
               return  userQuiz as Array<IQuizes>

            } catch (error) {
               throw error
            }
         }
         static async getUserPrivateQuizzes(userId: string): Promise<Array<IQuizes>> {
            try {
               const userQuiz = await quiz.findUserQuizzes(userId, true, false)

               if(!userQuiz) throw {code: 404, message: 'não foram encontrados nenhum quiz desse usuario ou o usuario não foi cadastrado', type: 'global'}
               return  userQuiz as Array<IQuizes>

            } catch (error) {
               throw error
            }
         }
         static async getUserSavedQuizzes(quizIds: Array<string>): Promise<Array<IQuizes> | []> {
            try {
               return await quiz.findQuizzes(quizIds)
            } catch (error) {
               throw error
            }
         }
         static getDefaultResultMessages(): IResultMessages{
            return <IResultMessages>{
               allCorrect: "Congratulations! You got all the questions right!",
               aboveEighty: "Great job! You got more than 80% of the questions right.",
               aboveFifty: "Good job! You got more than 50% of the questions right.",
               belowFifty: "You got less than 50% of the questions right. Keep practicing!",
               allWrong: "Too bad! You got all the questions wrong. Don't give up and try again!"
            }
         }
         static calcAndGetMessage(score: string, resultMessages: IResultMessages): string {
            try {
               const [correctAnswer, totalQuestions] = score.split('/'),
               total = (Number(correctAnswer) / Number(totalQuestions)) * 100
               
               if(total == 100) return  resultMessages.allCorrect
               if(total > 80) return resultMessages.aboveEighty
               if(total >= 50) return resultMessages.aboveFifty
               if(total > 0) return resultMessages.belowFifty

               return resultMessages.allWrong

            } catch (error) {
               throw error
            }
         }
         static async verifyTitle(title: string): Promise<void> {
            try {
               const isEmpty = isTextEmpty(title),
               titleLength = generateTrimmedString(title).length

               if(isEmpty) throw {messagePT: 'o título não pode estar vazio', message: 'the title cannot be empty', code: 400, type: 'title'}
               if(titleLength < 4) throw {messagePT: 'título muito curto', message: 'title too short', code: 400, type: 'title'}
               if(titleLength > 49) throw {messagePT: 'título muito longo', message: 'title too long', code: 400, type: 'title'} 

               return
            } catch (error) {
               throw error
            }
         }
         static async verifyQuestionTitle(title: string): Promise<void> {
            try {
               const isEmpty = isTextEmpty(title),
               titleLength = generateTrimmedString(title).length

               if(isEmpty) throw {messagePT: 'o título não pode estar vazio', message: 'the title cannot be empty', code: 400, type: 'title'}
               if(titleLength < 4) throw {messagePT: 'título muito curto', message: 'title too short', code: 400, type: 'title'}
               if(titleLength > 49) throw {messagePT: 'título muito longo', message: 'title too long', code: 400, type: 'title'} 

               return

            } catch (error) {
                
               throw {error}
            }
         }
         static async verifyDescription(description: string): Promise<void> {
            try {
               const isEmpty = isTextEmpty(description),
               descriptionLength = generateTrimmedString(description).length

             if(isEmpty) throw {messagePT: 'a descrição não pode estar vazia', message: 'the description cannot be empty', code: 400, type: 'description'}
             if(descriptionLength < 5) throw {messagePT: 'descrição muito curta', message: 'description too short', code: 400, type: 'description'}
             if(descriptionLength > 555) throw {messagePT: 'descrição muito longa', message: 'description too long', code: 400, type: 'description'}
               return
            } catch (error) {
               throw error
            }
         }
         static async verifyCategory(category: string): Promise<void> {
            try {
               const isEmpty = isTextEmpty(category),
               categoryLength = generateTrimmedString(category).length

               if(isEmpty) throw {message: 'a categoria não pode estar vazia', code: 400, type: 'category'}
               if(categoryLength < 3) throw {message: 'categoria muito curta', code: 400, type: 'category'}
               if(categoryLength > 33) throw {message: 'categoria muito longa', code: 400, type: 'category'}  
               return
            } catch (error) {
               throw error
            }
         }
         static async verifyResultMessages(resultMessages: IResultMessages): Promise<void>{
            try {
                let keys = Array.from(Object.values(resultMessages))

                if(keys.length != 5) throw {message: 'você precisa informar 5 mensagens', code: 400, type: 'message'}

                for (const iterator of keys) {
                  let empty = isTextEmpty(iterator)
                  if(empty) throw {message: 'a mensagem não pode estar vazia', code:400, type: 'message'}
                }
                return
            } catch (error) {
               throw error
            }
         }
         static async verifyQuestions(questions: Array<IQuestion>, premium?: boolean): Promise<IQuestionValidation> {
            try {
               const validQuestions = [], invalidQuestions = []
               
               for (const questionItem of questions) {
                  const {questionId , answers} = questionItem
                  try {
                     await this.verifyRequiredQuestionInputs(questionItem)
                     await this.verifyAnswers(answers as string[], premium)
                     if(questionItem.title) await this.verifyQuestionTitle(questionItem.title)

                     let questionValidated = this.makeQuestion(questionItem)

                     validQuestions.push(questionValidated)

                  } catch (error) {
                     let errorObj = {}
                     if(typeof(error) === 'object') errorObj = {...error as object, questionId}  
                     invalidQuestions.push(errorObj)

                  }
               }
               return {validQuestions, invalidQuestions}
            } catch (error) {
               throw error
            }
         }
         static async verifyQuestionsAndAlternativesImg(questions: Array<IQuestion>, premium?: boolean): Promise<IQuestionValidation> {
            try {
               const validQuestions = [], invalidQuestions = []
               
               for (const questionItem of questions) {
                  const {questionId , answers} = questionItem
                  try {
                     if(!questionItem.title) throw {message: 'titulo não fornecido', code: 400}
                     await this.verifyRequiredQuestionImageInputs(questionItem)
                      
                     await this.verifyAnswersImages(answers as Array<{answer: string, thumbnail: string}>, premium)
                     await this.verifyQuestionTitle(questionItem.title)

                     let questionValidated = this.makeQuestionsImg(questionItem)

                     validQuestions.push(questionValidated)

                  } catch (error) {
                     let errorObj = {}
                      
                     if(typeof(error) === 'object') errorObj = {...error as object, questionId}  
                     invalidQuestions.push(errorObj)

                  }
               }
               return {validQuestions, invalidQuestions}
            } catch (error) {
               throw error
            }
         }
         static getAlternativesKeysAndDelete(oldQuestions: Array<IQuestion>, newQuestions:Array<IQuestion>){
            let index = 0
            try {
               for (const oldQuestion of oldQuestions) {
                  const OldAnswers = oldQuestion.answers,
                  currentAnswer = newQuestions
                  
               }
               
            } catch (error) {
               
            }
         }
         static async verifyRequiredQuestionInputs(questionObj: IQuestion): Promise<void> {
            const {question, correctAnswer} = questionObj
            try {
               let isQuestionEmpty = isTextEmpty(question),
               isCorrectAnswerEmpty = isTextEmpty(correctAnswer)

               if(isQuestionEmpty) throw {message: 'a questão não pode estar vazia', code: 400, type: 'global'}
               if(isCorrectAnswerEmpty) throw {message: 'a alternativa não pode estar vazia', code: 400,  type: 'global'}
            } catch (error) {
               throw error
            }
         }
         static async verifyRequiredQuestionImageInputs(questionObj: IQuestion): Promise<void> {
            const {questionId, correctAnswer} = questionObj
            try {
               let isQuestionEmpty = isTextEmpty(questionId),
               isCorrectAnswerEmpty = isTextEmpty(correctAnswer)

               if(isQuestionEmpty) throw {message: 'a questão não pode estar sem Id', code: 400, type: 'global'}
               if(isCorrectAnswerEmpty) throw {message: 'a alternativa correta não pode estar vazia', code: 400,  type: 'global'}
            } catch (error) {
               throw error
            }
         }
         static async verifyAnswers(answers: Array<string>, premium?: boolean): Promise<Array<string>> {
            try {
               
               const emptyAnswers = answers.filter(answer => isTextEmpty(answer) )
               
               if(emptyAnswers.length > 0) throw {message: 'alternativa não pode estar vazia', code: 400, type: 'global'}
               if(answers.length > 10 &&  !premium) throw {message: 'limite de alternativas excedido; assine ou compre para adicionar mais', code: 403, type: 'global' }
               if(answers.length > 16) throw {message: 'você atingiu o limite maximo de alternativas', code: 403, type: 'global'}
               return answers

            } catch (error) {
               throw error
            }
         }
         static async verifyAnswersImages(answers: Array<{answer: string, thumbnail: string}>, premium?: boolean): Promise<Array<{answer: string, thumbnail: string}>> {
            try {
               
               const emptyAnswers = answers.filter(answer => isTextEmpty(answer.answer) )
               
               if(emptyAnswers.length > 0) throw {message: 'alternativa não pode estar vazia', code: 400, type: 'global'}
               if(answers.length > 10 &&  !premium) throw {message: 'limite de alternativas excedido; assine ou compre para adicionar mais', code: 403, type: 'global' }
               if(answers.length > 16) throw {message: 'você atingiu o limite maximo de alternativas', code: 403, type: 'global'}
               return answers

            } catch (error) {
                
               throw error
            }
         }
         static makeQuestion(question: IQuestion): IQuestion {
            return {
               ...question,
               questionId: createUUID(),
               created_at: new Date,
               updated_at: new Date
            }
         }
         static makeQuestionsImg(question: IQuestion): IQuestion {
            try {
               if(!question.questionId) throw {message:'questão não tem id', code: 400}
               return {
                  ...question,
                  created_at: new Date,
                  updated_at: new Date
               }
            } catch (error) {
               throw error
            }
         }
         static async returnTagsNotEmpty(tags: Array<string>): Promise<Array<string>> {
            try {
               return tags.filter(tag => {
                  const tagLength = generateTrimmedString(tag).length

                  if(tagLength > 1 && tagLength < 55) return true
                  return false 
               })
            } catch (error) {
               throw error
            }
         }
         static async updateImg(quizId: string, userId: string, thumbnail: string): Promise<void> {
            try {
              const updated = await quiz.updateImg(quizId, userId, thumbnail)
              if(!updated) throw {message: 'não foi possivel alterar a imagem do quiz', code: 500, type: global}

            } catch (error) {
               throw error
            }
         }
         static async setDraftValue(quizId: string, draft: boolean):Promise<void> {
            try {
               await quiz.updateDraft(quizId, draft)
            } catch (error) {
               throw error
            }
         }
         static async updateUsersCount(quizId: string, amount: number):Promise<number> {
            try {
               const updated = await quiz.updateAmount(quizId, amount)
               return updated?.usersCount as number
            } catch (error) {
               throw error
            }
         }
         static async search(title: string, categories: Array<string>, tags: Array<string>):Promise<Array<IQuizes> | undefined> {
            try {
               let titleQuery = title == '' ? title :  new RegExp(escapeRegExp(title), 'ig'), 
               categoriesQuery = categories.length == 0 || categories[0] === '' ? '' :  categories.map(category => new RegExp(escapeRegExp(category), 'ig'))
   
              const quizzes = await quiz.search(titleQuery, categoriesQuery, tags) 
              return quizzes as Array<IQuizes>

            } catch (error) {
               throw error
            }
         }
         static async deleteQuiz(quizId: string): Promise<void>{
            try {
               const lb = await leaderboard.getLeaderBoard(quizId)
               if(lb) await leaderboard.deleteQuizLeaderBoard(quizId)
                 
            } catch (error) {
               throw error
            }
         }

}

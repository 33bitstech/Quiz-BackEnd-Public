import {test, expect, it, describe, beforeAll, afterAll} from 'vitest'
import quizService from '../../src/services/quiz'
import IUser from '../../src/interfaces/IUser'
import connection from '../../src/database/connectionDatabaseTest'
import user from '../../src/repositories/user'
import app from '../../src/app'
import supertest from 'supertest'
import path from 'path'
import IQuizes from '../../src/interfaces/IQuizes'
import IQuestion from '../../src/interfaces/IQuestion'
app.listen(4078)
let token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4M2U4ODI2ZC0zMmVjLTQ0OTYtOWRiOC05ZmJhM2MzYmJmYjIiLCJuYW1lIjoiUGF1bG8xNzIzMTYzMDMxODQzIiwiZW1haWwiOiJwYXVsbzEzcGF1bG80MjMxNzIzMTYzMDMxODQzQGdtYWlsLmNvbSIsInByb2ZpbGVJbWciOiJodHRwczovL3F1aXp2b3J0ZXguczMuc2EtZWFzdC0xLmFtYXpvbmF3cy5jb20vcHJvZmlsZXNpbWcvcHJvZmlsZUltZy03ODllOGVkYmM1YTZkZTg2YzcyYTE1NWM2YjVjZTcwY2M0NjkyMzEyNTQ1ZmJmNDk1NDk2ZTUxMmIyMjI4NmMzLTE3MjMxNjMwMzI3MzAiLCJpYXQiOjE3MjMxNjMwMzQsImV4cCI6MTcyMzc2NzgzNH0.6ZtBbUJtr-ZVW1gQztcA7gXIaUQmIL1Y49ACyYsb-xY',
quizId: string = '',
questionId1: string = '',
questionId2:string = ''
 

beforeAll(async ()=> {
    new connection().execute()
})

const userAcceptable:IUser = {
    name: `Paulo Ribas${Date.now()}`,
    email: `paulo13paulo423${Date.now()}@gmail.com`,
    password: 'sdsadsadsa',
}
let quizNotAcceptable: Partial<IQuizes> = {
    title: '',
    description: '',
    category: 'scify',
    draft: false,
    isPrivate: false,
    tags: ['', 'doctor who', 'yugioh gx', '                      ', '                   .                    '],
    questions: [],
    resultMessages: undefined,
}
let quizAcceptable: IQuizes = {
    title: 'Quiz Criado',
    description: 'descrição desse quiz de doctor who',
    category: 'scify',
    draft: false,
    isPrivate: false,
    tags: ['', 'doctor who', 'yugioh gx', '                      ', '                   .                    '],
    questions: [],
    resultMessages: undefined,
}

let questions: IQuestion = {
    answers: ['doctor who', 'doctor who 2', 'doctor who 3'],
    correctAnswer: 'doctor who 33',
    question: 'qual a option correta?',
    questionId: '3333333333',
}
let questionCorrect2: IQuestion = {
    answers: ['doctor who', 'doctor who 2', 'doctor who 3'],
    correctAnswer: 'doctor who 33',
    question: 'qual a option correta?',
    questionId: '3333333333',
}
let incorrectQuestion: IQuestion = {
    answers: ['', ' ', '        ', ''],
    correctAnswer: 'doctoe3e3e3er who 33',
    question: 'qual a option correta?',
    questionId: '3333333333',
}
let incorrectQuestion2: IQuestion = {
    answers: ['', ' ', '        ', ''],
    correctAnswer: 'doctoe3e3e3er who 33',
    question: 'qual a option correta?',
    questionId: '5555555555',
}
describe('quiz instance', ()=> {
    it('should not create quiz with empty title', async ()=> {
            await expect( quizService.createQuizInstance(quizNotAcceptable)).rejects.toThrow()
    })
    it('should create quiz stance', async() => {
    })
})
    

describe('quiz', () => {
    it('deve criar um quiz', async ()=> {
        const response = await supertest(app).post('/quiz').set('Authorization', token).send({quizData: quizAcceptable})
        expect(response.body).ownProperty('quizId')
        quizId = response.body.quizId

    })
    it('deve atualizar os quizes', async () => {
        const response = await supertest(app).put(`/questions/${quizId}`).set('Authorization', token).send({
            questions: [questions, questionCorrect2]
        })

        expect(response.body).ownProperty('newQuestions')
         
        questionId1 = response.body.newQuestions[0].questionId,
        questionId2 = response.body.newQuestions[1].questionId
    })
    it('deve falhar ao atualizar os quizes e retornar um array com dois objetos mostrando os erros', async () => {
        const response = await supertest(app).put(`/questions/${quizId}`).set('Authorization', token).send({
            questions: [incorrectQuestion, incorrectQuestion2]
        })

        expect(response.body).ownProperty('questionErrs')
        expect(response.body.questionErrs.length).toBe(2)
         
    })
    it('deve responder o quiz com sucesso e retornar o score', async() => {
        const quizAnswer = [{questionId: questionId1, answer: '33'},{ questionId: questionId2, answer: 'doctor who 33'}]
        const response = await supertest(app).post(`/answer-quiz/${quizId}`).set('Authorization', token).send({
            quizAnswer,
            timing: Date.now()
        })
         
        expect(response.body).ownProperty('score')
    })
    it('deve pegar informações do usuario da leaderboard', async() => {
        const response = await supertest(app).get(`/leaderboard/${quizId}`).set('Authorization', token)
        expect(response.body).ownProperty('scoreBoard')
         
    })
    it('deve buscar e encontrar um quiz pelo nome incompleto', async() => {
        const response = await supertest(app).get(`/search-quiz?title=Quiz`)
        expect(response.body).ownProperty('quizzes')

    })
    it('deve buscar e encontrar um quiz pela categoria incompleta', async() => {
        const response = await supertest(app).get(`/search-quiz?category=scify`)
        expect(response.body).ownProperty('quizzes')
    })
    it('deve buscar e encontrar um quiz pelas tags', async() => {
        const response = await supertest(app).get(`/search-quiz?tags=doctor who`)
        expect(response.body).ownProperty('quizzes')
    })
})
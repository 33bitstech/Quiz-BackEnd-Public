export default interface IQuestion{
    questionId: string
    question: string
    answers: Array<string | {answer:string, thumbnail:string}>
    correctAnswer: string,
    correctAnswerThumbnal?: string,
    image?: string,
    title?: string,
    created_at: Date,
    updated_at: Date
}
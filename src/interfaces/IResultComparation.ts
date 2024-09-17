export default interface IResultComparation {
    correctAnswers: Array<{question:string, answer: string}>;
    incorrectAnswers: Array<{question:string, answer: string}>;
}
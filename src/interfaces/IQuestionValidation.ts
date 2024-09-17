import IQuestion from "./IQuestion";
export default interface IQuestionValidation {
     validQuestions: Array<IQuestion>,
     invalidQuestions: Array<object>,
}
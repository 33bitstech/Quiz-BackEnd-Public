import IQuestion from "./IQuestion"
export interface IResultMessages {
    allCorrect: string; // Mensagem para quando o usuário acertar todas as perguntas
    aboveEighty: string; // Mensagem para quando o usuário acertar mais de 80%
    aboveFifty: string; // Mensagem para quando o usuário acertar entre 50% e 80%
    belowFifty: string; // Mensagem para quando o usuário acertar menos de 50%
    allWrong: string; // Mensagem para quando o usuário errar todas as perguntas
}
export default interface IQuizes {
    quizId: string;
    title: string;
    description: string;
    isPrivate: boolean;
    quizThumbnail: string,
    userCreatorId: string;
    userCreatorName: string;
    qtdQuestions: number;
    questions?: Array<IQuestion>;
    tags?: Array<string>;
    category: string;
    resultMessages?: IResultMessages;
    idiom: string,
    usersCount?: number,
    created_at: Date;
    updated_at: Date;
    draft?: boolean
    type?: 'default/RW' | 'image/RW',
}
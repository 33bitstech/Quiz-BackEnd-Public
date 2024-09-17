export default interface IUser{
    userId?: string;
    name: string;
    email: string;
    password: string;
    profileImg?: string;
    premium?: boolean,
    specialCount?: number,
    savedQuizzes?: Array<{id: string}>;
    finishedQuizzes?: Array<{id: string, time: number}>;
    created_at?: Date;
    updated_at?: Date;
}
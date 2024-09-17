export default interface IUserObjectJWT {
    userId?: string,
    name?: string,
    email?: string,
    profileImg?: string,
    password?: string,
    savedQuizzes?: Array<{id:string}>,
    finishedQuizzes?: Array<{id: string, time: number}>
    created_at?: Date, 
    update_at?: Date

}
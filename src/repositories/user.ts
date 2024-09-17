import userModel from "../models/userModel";
import IUser from "../interfaces/IUser";
import IUserObjectJWT from "../interfaces/JwtUser";

export default  new class userRepositorie {
    async save(user:IUser): Promise<IUser> {
        try {
            const newUser = new userModel(user)
            return newUser.save()
        } catch (error) {
            throw error
        }
    }
    async findSensitiveUsersInformation(list:Array<string> | undefined): Promise<Array<IUser>> {
        try {
            const query = list ? { userId: { $in: list } } : {}

            let users = await userModel.find(query)

            if(!users) throw {message: 'falha ao acessar o banco de dados', code: 500}
            return users as Array<IUser>
        } catch (error) {
            throw error
        }
    }
    async findNonSensitiveUsersInformation(list: Array<string> | undefined): Promise<Array<IUserObjectJWT>> {
        try {
            const query = list ? {userId: {$in: list}} : {}

            let users = await userModel.find(query).select('userId name email profileImg savedQuizzes finishedQuizzes created_at updated_at')

            if(!users) throw {message: 'falha ao acessar o banco de dados', code: 500}
            return users as Array<IUserObjectJWT>
        } catch (error) {
            throw error
        }
    }
    async findUserById(userId:string): Promise<IUser | null>{
        try {
            let user:IUser | null = await userModel.findOne({userId})
            return user
        } catch (error) {
            throw error
        }
}
    async findUserByName(name:string): Promise<IUser | null>{
            try {
                let user:IUser | null = await userModel.findOne({name})
                return user
            } catch (error) {
                throw error
            }
    }
    async findUserByEmail(email:string): Promise<IUser | null>{
        try {
            let user:IUser | null = await userModel.findOne({email})
            return user
        } catch (error) {
            throw error
        }
    }
    async updateName(userId: string, name: string): Promise<IUser | null>{
        try {
            let user:IUser | null = await userModel.findOneAndUpdate({userId}, {$set:{name}}, {new: true})
            return user
        } catch (error) {
            throw error
        }
    }
    async updateEmail(userId: string, email: string): Promise<IUser | null>{
        try {
            let user:IUser | null = await userModel.findOneAndUpdate({userId}, {$set:{email}}, {new: true})
            return user
        } catch (error) {
         throw error   
        }
    }
    async updatePassword(userId: string, password: string): Promise<IUser | null>{
        try {
            let user:IUser | null = await userModel.findOneAndUpdate({userId}, {$set:{password}}, {new: true})
            return user
        } catch (error) {
            throw error
        }
    }
    async updateProfileImg(userId: string, profileImg: string): Promise<IUser | null>{
        try {
            let user:IUser | null = await userModel.findOneAndUpdate({userId}, {profileImg}, {new: true})
             
            return user
        } catch (error) {
            throw error
        }
    }
    async addSavedQuiz(savedQuizzes: Array<{id:string}>, userId: string): Promise<Array<{id: string}> | undefined> {
        try {
            const savedQuizedUpdated = await userModel.findOneAndUpdate({userId}, {$set: {savedQuizzes}}, {new: true})

            if(!savedQuizedUpdated) throw {code: 500, message: 'não foi possivel salvar esse quiz', type: 'global'}
            return savedQuizedUpdated.savedQuizzes 
        } catch (error) {
            throw error
        }
    }
    async updateFinishedQuizzes(userId: string, finishedQuizzes: Array<{id:string, time:number}>):Promise<void>{
        try {
            let finishedQuizzesUpdated = await userModel.findOneAndUpdate({userId}, {finishedQuizzes})
            if(!finishedQuizzesUpdated) throw {message: 'não foi possivel adicionar o quiz terminado', type: 'global'}
            return
        } catch (error) {
            throw error
        }
    }
    async setSpecialCount(userId: string, specialCount: number): Promise<IUser> {
        try {
            const userUpdated = await userModel.findOneAndUpdate({userId}, {$set:{specialCount}},{new: true} )
            if(!userUpdated) throw {message: 'não foi possivel concluir a ação de atualizar special count', code: 500, type: 'global'}
            return userUpdated 
        } catch (error) {
            throw error
        }
    }
    static async setPreimium(userId: string,premium: boolean): Promise<IUser> {
        try {
            const user = await userModel.findOneAndUpdate({userId}, {$set:{premium}}, {new: true})
            if(!user) throw {message: 'não foi possivel mudar o status premium', code: 500, type: 'global'}
            return user
        } catch (error) {
            throw error
        }
    }
    async updatePremium(userId: string, premium: Boolean):Promise<IUser | null> {
        try {
            return await userModel.findOneAndUpdate({userId}, {premium}, {new: true})
        } catch (error) {
            throw error
        }
    }
    async deleteUser(userId: string): Promise<IUser | null>{
        try {
            const deleted = await userModel.findOneAndDelete({userId})
            return deleted

        } catch (error) {
            throw error
        }
    }


}
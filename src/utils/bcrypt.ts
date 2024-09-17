import { hash, compare } from "bcrypt";

export async function createHash(salth: number, data: string): Promise<string | void> {
    try {
        const createdHash: string = await hash(data, salth)
        return createdHash
    } catch (error) {
        throw error
    }
} 

export async function compareStringToHash(stringData: string, hashData: string): Promise<boolean | void> {
    try {
        const isEqual = await compare(stringData, hashData)
        return isEqual
    } catch (error) {
        throw error
    }
    
}
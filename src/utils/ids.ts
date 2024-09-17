import { v4 } from "uuid"

export function createUUID():string {
    return v4()
}
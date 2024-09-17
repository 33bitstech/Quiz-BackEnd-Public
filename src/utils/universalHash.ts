import {createHmac} from 'node:crypto'

export function createUniversalHash(string: string):string {
    return createHmac('sha256', `secury not necessery${Date.now()}`).update(string).digest('hex')
}
export function isTextEmpty(text:string): boolean{
    if(text.length === 0 || text.trim().length === 0) return true
    return false
}

export function generateTrimmedString(text: string): string {
    return text.trim()
}

export async function checkEmailValidate(text: string): Promise<boolean> {
    let isEmailEmpty = isTextEmpty(text)
    let validateByRegex = text.match(/^[\w\d.!#$%&'+/=?^_`{|}~-]+@[\w\d-]+(?:\.[\w\d-]+)+$/);
    
    return new Promise<boolean>((resolve, reject) => {

        if(!isEmailEmpty && validateByRegex) return resolve(true)
        return reject(false)
    
    })
}
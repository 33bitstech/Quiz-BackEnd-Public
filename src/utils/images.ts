export function makeImgSrc(key: string, dominain: string): string {
    return `https://${dominain}/${key}`
}
export function getImgKey(src: string, S3path: string) {
    const key = src.split('/')[-1]
    return `${S3path}/${key}`
}
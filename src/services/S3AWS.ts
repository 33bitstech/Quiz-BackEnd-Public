
import { DeleteBucketCommandOutput, S3 } from "@aws-sdk/client-s3";
import { DotenvConfigOptions, configDotenv } from "dotenv";
configDotenv()

const s3 = new S3()
export default new class S3AWS {
    deteleteProfileOrQuizImgBucketObject(key: string): Promise<void>{
        return new Promise<void>((resolve, reject) => {
            s3.deleteObject({Bucket: process.env.AWS_S3_BUCKET, Key: key}, (err, data) => {
                 
                err ? reject(err) : resolve(data as void)
            })
        })
    }
    deleteQuestionsImgs(keys: Array<string>): Promise<void>{
        const Objects = keys.map(key => ({Key: key}))

        let params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Delete: {Objects, Quiet: false}
        }
        return new Promise<void>((resolve, reject) => {
            s3.deleteObjects(params, (err: any, data: any)=> {

                 
                err ? reject(err) : resolve(data as void)
            })
        })
    }
}
import { S3 } from "@aws-sdk/client-s3";
import { configDotenv } from "dotenv";
import multerS3 from 'multer-s3'
import { createUniversalHash } from "../utils/universalHash";
configDotenv()

const s3Config = {
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
    region: process.env.AWS_Region,
}



export const storageProfile = multerS3({
    s3: new S3(s3Config),
    bucket: process.env.AWS_S3_BUCKET as string,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: async function(req, file, cb) {
        const date = Date.now().toString(),
        {fieldname} = file,

        hash = `profilesimg/${fieldname}-${createUniversalHash(fieldname)}-${date}`

        cb(null, hash)
    }

})

export const storageQuestions = multerS3({
    s3: new S3(s3Config),
    bucket: process.env.AWS_S3_BUCKET as string,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: async function(req, file, cb) {
        const date = Date.now().toString(),
        {fieldname} = file,

        hash = `questionimg/${fieldname}-${createUniversalHash(fieldname)}-${date}`

        cb(null, hash)
    }

})

export const storageQuiz = multerS3({
    s3: new S3(s3Config),
    bucket: process.env.AWS_S3_BUCKET as string,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: async function(req, file, cb) {
        const date = Date.now().toString(),
        {fieldname} = file,

        hash = `quizimg/${fieldname}-${createUniversalHash(fieldname)}-${date}`

        cb(null, hash)
    }

})
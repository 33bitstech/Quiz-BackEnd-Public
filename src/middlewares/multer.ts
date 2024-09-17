import multer from "multer";
import { storageProfile, storageQuiz, storageQuestions } from "../config/multer";

export  const uploadProfileImg = multer({
    storage: storageProfile,
    limits: {
        fileSize: 11 * 1024 * 1024,
    },
    fileFilter(req, file, cb) {
        if(!file.mimetype.match(/image\/*/)) return cb(null, false)
        return cb(null, true)
    }

}).single('profileImg')

export  const uploadQuizImg = multer({
    storage: storageQuiz,
    limits: {
        fileSize: 11 * 1024 * 1024,
    },
    fileFilter(req, file, cb) {
        if(!file.mimetype.match(/image\/*/)) return cb(null, false)
        return cb(null, true)
    }

}).single('quizImg')

export const uploadQuestionsImg = multer({
    storage: storageQuestions,
    limits: {
        fileSize: 11 * 1024 * 1024,
    },
    fileFilter(req, file, cb){
        if(!file.mimetype.match(/image\/*/)) return cb(null, false)
            return cb(null, true)
    }

}).array('quizQuestions')
export const uploadQuestionsAlternativesImg = multer({
    storage: storageQuestions,
    limits: {
        fileSize: 11 * 1024 * 1024,
    },
    fileFilter(req, file, cb){
        if(!file.mimetype.match(/image\/*/)) return cb(null, false)
            return cb(null, true)
    }

}).array('questionAlternatives')

export const uploadQuestionAlternativeImg = multer({
    storage: storageQuestions,
    limits: {
        fileSize: 11 * 1024 * 1024,
    },
    fileFilter(req, file, cb){
        if(!file.mimetype.match(/image\/*/)) return cb(null, false)
            return cb(null, true)
    }

}).single('questionAlternative')
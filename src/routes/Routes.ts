import express from 'express';
import { authenticate, multerAuthenticate, quizAuthenticate, commentAuthenticate, quizExistsAuthenticate } from '../middlewares/auth';
import userController from '../controllers/userController';
import tokenController from '../controllers/tokenController';
import { uploadProfileImg, uploadQuizImg, uploadQuestionsImg, uploadQuestionAlternativeImg, uploadQuestionsAlternativesImg } from '../middlewares/multer';
import quizController from '../controllers/quizController';
import questionController from '../controllers/questionController';
import leaderboardController from '../controllers/leaderboardController';
import commentControllers from '../controllers/commentControllers';
import paymentController from '../controllers/paymentController'
import paymentGatewayController from '../controllers/paymentGatewayController';

const routes = express.Router();

// ** user routes **

// user authentication
routes.get('/authenticate-user', authenticate, userController.authenticateUser);
routes.post('/login', userController.login);
routes.post('/recovery-token', tokenController.CreateAndSendTokenToUser);
routes.put('/password-by-token', userController.recoveryPassword);

// user registration and updates
routes.get('/user/:userId', userController.get)
routes.get('/users',/* APIusageAuth,*/ userController.getAll)
routes.post('/user', userController.create);
routes.put('/user', authenticate, userController.update);
routes.get('/checkUserPremiumStats', authenticate, userController.checkUserPremiumStats)

// profile image upload and update
routes.post('/img-profile', multerAuthenticate, uploadProfileImg, userController.uploadProfileImg);
routes.put('/img-profile', multerAuthenticate, uploadProfileImg, userController.updateProfileImg);

//delete user
routes.delete('/user', authenticate, userController.delete)

// ** quiz routes **

// quiz authenticate
routes.get('/authenticate-quiz/:quizId', quizAuthenticate, quizController.getQuiz)

// general quiz operations
routes.get('/quizzes', quizController.getQuizzes);
routes.get('/public-quizzes', quizController.getPublics)
routes.get('/quiz/:quizId', quizController.getQuiz);
routes.get('/user-public-quizzes/:userId', quizController.getUserPublicQuizzes);
routes.get('/user-private-quizzes', authenticate, quizController.getUserPrivateQuizzes);
routes.get('/user-saved-quizzes/', authenticate, quizController.getUserSavedQuizzes)
routes.get('/user-draft-quizzes/', authenticate, quizController.getUserDraftQuizzes)
routes.get('/most-popular-quizzes', quizController.getMostPopularQuizzes)
routes.post('/quiz', authenticate, quizController.create);
routes.put('/quiz/:quizId', authenticate, quizAuthenticate, quizController.update )
routes.put('/quiz-thumbnail/:quizId', quizAuthenticate, uploadQuizImg, quizController.uploadImg);
routes.put('/questions/:quizId', quizAuthenticate, quizController.updateQuestions);
routes.put('/questions-images/:quizId', quizAuthenticate, quizController.updateQuestionsImg)
routes.put('/questions-thumbnail/:quizId', quizAuthenticate, uploadQuestionsImg, quizController.uploadQuestionImages) //rota do reste 3

routes.post('/quiz-images-alternatives/:quizId/:questionId', quizAuthenticate, uploadQuestionsAlternativesImg, quizController.uploadAlternatives) 
routes.put('/quiz-image-alternatives/:quizId/:questionId', quizAuthenticate, uploadQuestionAlternativeImg, quizController.updateAlternatives)
routes.post('/answer-quiz/:quizId', quizExistsAuthenticate, questionController.submitQuizAnswered);
routes.post('/save-quiz/:quizId', authenticate, quizExistsAuthenticate, userController.saveQuiz);
routes.delete('/unsave-quiz/:quizId', authenticate, quizExistsAuthenticate, userController.unSaveQuiz);

// quiz search
routes.get('/search-quiz', quizController.searchQuizzes);

// ** comment routes **

// comment operations
routes.get('/comments/:quizId', commentControllers.getComments)
routes.get('/replies/:commentId', commentControllers.getCommentRepiles)
routes.post('/comment/:quizId', quizExistsAuthenticate, commentControllers.save);
routes.post('/reply/:commentId', authenticate, commentControllers.reply);
routes.put('/comment/:commentId', authenticate, commentAuthenticate, commentControllers.editComment);
routes.delete('/comment/:commentId', authenticate, commentAuthenticate, commentControllers.deleteComment);
routes.put('/like-comment/:commentId', authenticate, commentControllers.likeComment);
routes.delete('/unlike-comment/:commentId', authenticate, commentControllers.unLikeComment);
routes.put('/reply/:commentId', authenticate, commentControllers.editReply)
routes.delete('/reply/:commentId/:replyId', authenticate, commentControllers.deleteReply)
routes.put('/like-reply/:commentId/:replyId', authenticate, commentControllers.likeReply);
routes.delete('/unlike-reply/:commentId/:replyId', authenticate, commentControllers.unLikeReply);


// ** leaderboard routes **

routes.get('/leaderboard/:quizId', leaderboardController.getLeaderBoard);

// ** Payment Routes **

//Gateway
routes.get('/stripe-publickey', authenticate, paymentGatewayController.getStripePublicKey)
routes.post('/create-stripe-subscription-session/:currency?', authenticate,  paymentGatewayController.createSubscriptionCheckOutSession)
routes.post('/create-stripe-payment-session/:currency?',authenticate,  paymentGatewayController.createPaymentSession)


// One-time payment
routes.post('/usage-payed', authenticate, paymentController.processOnePayment)

//Subscription
routes.post('/subscription', authenticate, paymentController.startSubscription)
routes.delete('/cancel-subscription', authenticate, paymentController.cancelSubscription)



export default routes;
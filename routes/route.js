import { Router } from "express";
import { addAnswer, askQuestions, botChat, DeleteAnswer, GetAnswer, UpdateAnswer } from "../controller/controller.js";
import { forgotPassword, resetPassword, sendOtp, signIn, signUp, verifyOtp } from "../controller/AuthController.js";
const router = Router();

// here is the all routes for the aiChats
router.post('/chats',botChat )
router.post('/addAnswers',addAnswer)
router.post('/ask', askQuestions )
router.get('/answers',GetAnswer)

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/verify-otp', verifyOtp);
router.delete('/answers/:id', DeleteAnswer);
router.put('/answers/:id', UpdateAnswer);
router.post('/forgot-password', forgotPassword); 
router.post('/reset-password/:token', resetPassword); 



export default router;
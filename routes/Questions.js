// routes/Questions.js
import express from 'express';
import { AskQuestion, getAllquestions, deleteQuestion, voteQuestion, uploadQuestionWithVideo } from '../controllers/Questions.js';
import upload from '../config/multerConfig.js'; // Import Multer configuration

const router = express.Router();

router.post('/ask', AskQuestion);
router.get('/all', getAllquestions);
router.delete('/:id', deleteQuestion);
router.patch('/vote/:id', voteQuestion);
router.post('/upload-video', upload.single('video'), uploadQuestionWithVideo); // Use Multer middleware

export default router;

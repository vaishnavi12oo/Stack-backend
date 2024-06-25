import express from 'express';
import multer from 'multer';
import path from 'path';
import { AskQuestion, getAllquestions, deleteQuestion, voteQuestion, uploadQuestionWithVideo } from '../controllers/Questions.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Configure multer for video upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Existing routes
router.post('/Ask', auth, AskQuestion);
router.get('/get', getAllquestions);
router.delete('/delete/:id', auth, deleteQuestion);
router.patch('/vote/:id', auth, voteQuestion);

// New route for uploading question with video
router.post('/upload-video', auth, upload.single('video'), uploadQuestionWithVideo);

export default router;
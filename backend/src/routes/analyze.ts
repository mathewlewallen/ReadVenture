import express from 'express';
import { analyzeText } from '../controllers/analyze';

const router = express.Router();

router.post('/', analyzeText);

export default router;

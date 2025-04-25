import express from 'express'
import authService from '../services/authService.js';

const router = express.Router()

router.get('/seeder', async (req, res) => {
    try {
        const result = await authService.seeder(req, res)
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: true, msg: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const result = await authService.auth(req, res);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: true, msg: error.message });
    }
});

export default router;
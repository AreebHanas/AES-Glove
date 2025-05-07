import express from 'express';
import exerciseService from '../services/exerciseService.js';

const router = express.Router();

// Route to get all exercises
router.get('/', async (req, res) => {
    try {
        const exercises = await exerciseService.getExercises();
        res.status(200).json(exercises);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get a exercise by ID (ID passed in the body)
router.post('/getById', async (req, res) => {
    try {
        const exercise = await exerciseService.getexErciseById(req.body.patient_id);
        if (!exercise) {
            return res.status(404).json({ message: 'exercise not found' });
        }
        res.status(200).json(exercise);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to create a new exercise
router.post('/create_exercise', async (req, res) => {
    try {
        const newexercise = await exerciseService.creatExercise(req.body);
        res.status(201).json(newexercise);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to update a exercise by ID (ID passed in the body)
router.put('/edit_exercise', async (req, res) => {
    try {
        const updatedexercise = await exerciseService.updateExercise(req.body);
        if (!updatedexercise) {
            return res.status(404).json({ message: 'exercise not found' });
        }
        res.status(200).json(updatedexercise);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to delete a exercise by ID (ID passed in the body)
router.post('/delete_exercise', async (req, res) => {
    try {
        const deletedexercise = await exerciseService.deleteExercise(req.body.patient_id);
        if (!deletedexercise) {
            return res.status(404).json(deletedexercise);
        }
        res.status(200).json(deletedexercise);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export default router;
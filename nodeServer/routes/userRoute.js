import express from 'express';
import userService from '../services/userService.js';

const router = express.Router();

// Route to get all users
router.get('/', async (req, res) => {
    try {
        const users = await userService.getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get a user by ID (ID passed in the body)
router.post('/getById', async (req, res) => {
    try {
        const user = await userService.getUserById(req.body.patient_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to create a new user
router.post('/create_user', async (req, res) => {
    try {
        const newUser = await userService.creatUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to update a user by ID (ID passed in the body)
router.put('/edit_user', async (req, res) => {
    try {
        const updatedUser = await userService.updateUser(req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to delete a user by ID (ID passed in the body)
router.post('/delete_user', async (req, res) => {
    try {
        const deletedUser = await userService.deleteUser(req.body.patient_id);
        if (!deletedUser) {
            return res.status(404).json(deletedUser);
        }
        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
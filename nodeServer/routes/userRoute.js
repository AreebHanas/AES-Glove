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

// Route to edit a user by ID (ID passed in the body)
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

router.post('/autocomplete', async (req, res) => {
    try {
        const { search } = req.body;
        const exercises = await userService.autoComplete(search);
        res.status(200).json(exercises);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/get__patient_exercise', async (req, res) => {
    try {
        const { user_id } = req.body;
        const user = await userService.getPatientExercise(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/add_patient_exercise', async (req, res) => {
    try {
        const { user_id, exercise_id, rounds } = req.body;
        const updatedUser = await userService.addPatientExercise(user_id, exercise_id, rounds);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/remove_patient_exercise', async (req, res) => {
    try {
        const { user_id, exercise_id } = req.body;
        const updatedUser = await userService.removePatientExercise(user_id, exercise_id);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/edit_patient_exercise', async (req, res) => {
    try {
        const { user_id, exercise_id, rounds } = req.body;
        const updatedUser = await userService.editPatientExercise(user_id, exercise_id, rounds);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/get_patient_count', async (req, res) => {
    try {
        const patients = await userService.countTotalPatient();
        if (!patients) {
            return res.status(404).json({ message: 'No patients found' });
        }
        res.status(200).json({count:patients});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/get_active_patient_count', async (req, res) => {
    try {
        const activePatients = await userService.countActivePatient();
        if (!activePatients) {
            return res.status(404).json({ message: 'No active patients found' });
        }
        res.status(200).json({count:activePatients});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/get_online_patient_count', async (req, res) => {
    try {
        const currentlyOnlinePatients = await userService.countCurrentlyOnlinePatient();
        if (!currentlyOnlinePatients) {
            return res.status(404).json({ message: 'No currently online patients found' });
        }
        res.status(200).json({count:currentlyOnlinePatients});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to search users by name
router.get('/search_user_by_name', async (req, res) => {
    try {
        const { name } = req.query;
        const users = await userService.searchUserByName(name);
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to toggle user status (activate/deactivate)
router.put('/toggle_user_status', async (req, res) => {
    try {
        const { user_id, status } = req.body;
        const result = await userService.toggleUserStatus(user_id, status);
        if (result.error) {
            return res.status(404).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

// Route to get activated patient count
router.get('/get_activated_patient_count', async (req, res) => {
    try {
        const activatedPatients = await userService.countActivatedPatient();
        if (!activatedPatients) {
            return res.status(404).json({ message: 'No activated patients found' });
        }
        res.status(200).json({ count: activatedPatients });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default router;
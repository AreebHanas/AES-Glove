import userModel from '../models/userModel.js';
import exerciseModel from '../models/exerciseModel.js';
import bcrypt from 'bcryptjs';

class UserService {
    creatUser = async (userDetails) => {
        try {
            const { email, password } = userDetails;
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await userModel.create({ email, password: hashedPassword });
            return { message: 'created', id: user._id, role: 'user', error: false };
        } catch (error) {
            error.message = error.message.includes('duplicate key error') ? 'User already exists' : error.message;
            return { error: true, message: error.message }  ;
        }
    }

    deleteUser = async (user_id) => {
        try {
            if (!user_id || user_id === undefined) {
                return { error: true, message: 'User ID is required' };
            }
            const deleteUser = await userModel.findByIdAndDelete(user_id);
            if (!deleteUser) {
                return { error: true, message: 'User not found' };
            }
            return { error:false, message: 'User deleted' };
        } catch (error) {
            return { error: true, message: error.message };
        }
    }

    updateUser = async (userDetails) => {
        try {
            const { user_id, email, password } = userDetails;
            const hashedPassword = await bcrypt.hash(password, 10);
            await userModel.findByIdAndUpdate(user_id, { email, password: hashedPassword });
            return { status: 'updated' };
        } catch (error) {
            return { error: true, message: error.message };
        }
    };
      
    getUsers = async () => {
        try {
            const users = await userModel.find({}, { email: 1 });
            return { users };
        } catch (error) {
            return { error: true, message: error.message };
        }
    };

    getUserById = async (id) => {
        try {
            const { user_id } = id;
            const user = await userModel.findById(user_id, { email: 1 });
            if (!user) {
                return { error: true, message: 'User not found' };
            }
            return { user };
        } catch (error) {
            return { error: true, message: error.message };
        }
    };

    autoComplete = async (exerciseName) => {
        try {
            let exercises = [];
            if (!exerciseName || exerciseName === undefined) {
                exercises = await exerciseModel.find();
            } else {
            exercises = await exerciseModel.find({ name: { $regex: exerciseName, $options: 'i' } });
            }
            if (exercises.length === 0) {
                return { error: true, message: 'No exercises found' };
            }
            return { exercises };
        } catch (error) {
            return { error: true, message: error.message };
        }
    }

    getPatientExercise = async (user_id) => {
        try {
            const user = await userModel.findById(user_id).populate('exercise.exerciseDetails', 'name url');
            if (!user) {
                return { error: true, message: 'User not found' };
            }
            return { error: false, data: user.exercise, message: 'Exercise fetched' };
        } catch (error) {
            return { error: true, message: error.message };
        }
    };

    addPatientExercise = async (user_id, exerciseDetails, rounds) => {
        try {
            const user = await userModel.findById(user_id);
            if (!user) {
                return { error: true, message: 'User not found' };
            }
            user.exercise.push({exerciseDetails, round: rounds});
            await user.save();
            return { message: 'Exercise added to user' };
        } catch (error) {
            return { error: true, message: error.message };
        }
    }

    removePatientExercise = async (user_id, exercise_id) => {
        try {
            const user = await userModel.findById(user_id);
            if (!user) {
                return { error: true, message: 'User not found' };
            }
            user.exercise = user.exercise.filter(exercise => exercise.exerciseDetails.toString() !== exercise_id.toString());
            await user.save();
            return { message: 'Exercise removed from user' };
        } catch (error) {
            return { error: true, message: error.message };
        }
    }
    
    editPatientExercise = async (user_id, exercise_id, rounds) => {
        try {
            const user = await userModel.findById(user_id);
            if (!user) {
                return { error: true, message: 'User not found' };
            }
            const exercise = user.exercise.find(exercise => exercise.exerciseDetails.toString() === exercise_id.toString());
            if (!exercise) {
                return { error: true, message: 'Exercise not found' };
            }
            exercise.round = rounds;
            await user.save();
            return { message: 'Exercise updated for user' };
        } catch (error) {
            return { error: true, message: error.message };
        }
    }

}

const userService = new UserService();
export default userService;
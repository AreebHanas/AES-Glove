import exerciseModel from '../models/exerciseModel.js';
import bcrypt from 'bcryptjs';

class exercise {
    creatExercise = async (exerciseDetails) => {
        try {
            const { name, url } = exerciseDetails;
            const exercise = await exerciseModel.create({ name, url });
            return { message: 'created', id: exercise._id};
        } catch (error) {
            error.message = error.message.includes('duplicate key error') ? 'exercise already exists' : error.message;
            return { error: true, message: error.message };
        }
    }

    deleteExercise = async (exercise_id) => {
        try {
            if (!exercise_id || exercise_id === undefined) {
                return { error: true, message: 'exercise ID is required' };
            }
            const deleteexercise = await exerciseModel.findByIdAndDelete(exercise_id);
            if (!deleteexercise) {
                return { error: true, message: 'exercise not found' };
            }
            return { error:false, message: 'exercise deleted' };
        } catch (error) {
            return { error: true, message: error.message };
        }
    }

    updateExercise = async (exerciseDetails) => {
        try {
            const { exercise_id, name, url } = exerciseDetails;
            await exerciseModel.findByIdAndUpdate(exercise_id, { name, url });
            return { status: 'updated' };
        } catch (error) {
            return { error: true, message: error.message };
        }
    };
      
    getExercises = async () => {
        try {
            const exercises = await exerciseModel.find();
            return { exercises };
        } catch (error) {
            return { error: true, message: error.message };
        }
    };

    getExerciseById = async (id) => {
        try {
            const { exercise_id } = id;
            const exercise = await exerciseModel.findById(exercise_id);
            if (!exercise) {
                return { error: true, message: 'exercise not found' };
            }
            return { exercise };
        } catch (error) {
            return { error: true, message: error.message };
        }
    };
}

const exerciseService = new exercise();
export default exerciseService;
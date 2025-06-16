import exerciseModel from '../models/exerciseModel.js';

class exercise {
    // Exercise management services
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
            const deactiveExercises = exercises.filter(exercise => exercise.status === false);
            console.log('deactive exercises', deactiveExercises);
            if (exercises.length === 0 || deactiveExercises.length === 0) {
                await exerciseModel.create({ name: 'rest', url: 'Keep you hand at the rest position for few minituse', status: false});
            }
            return { exercises };
        } catch (error) {
            return { error: true, message: error.message };
        }
    };

    getExerciseById = async (id) => {
        try {
            const { exercise_id } = id;
            const exercise = await exerciseModel.findById(exercise_id);
            if (!exercise || exercise.status === false) {
                return { error: true, message: 'exercise not found' };
            }
            return { exercise };
        } catch (error) {
            return { error: true, message: error.message };
        }
    };
    // Exercise management services end

    // Dashboard services
    getExerciseCount = async () => {
        try {
            const count = await exerciseModel.countDocuments({status:true});
            return {error:false, count };
        } catch (error) {
            return { error: true, message: error.message };
        }
    };

    searchExerciseByName = async (name) => {
        try {
            // Partial, case-insensitive search by name
            const exercises = await exerciseModel.find({ name: { $regex: name, $options: 'i' }, status: true });
            return exercises;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

const exerciseService = new exercise();
export default exerciseService;
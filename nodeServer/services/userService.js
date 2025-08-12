import userModel from '../models/userModel.js';
import exerciseModel from '../models/exerciseModel.js';
import bcrypt from 'bcryptjs';

class UserService {
    // User account management services
    creatUser = async (userDetails) => {
        try {
            const { email, password, name, macAddress } = userDetails;
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await userModel.create({ email, password: hashedPassword, name, macAddress });
            const restExercise = await exerciseModel.find({status: false});
            if (user && user.userRole === 'user') {
                if (restExercise && restExercise.length === 1) {
                    user.exercise.push({exerciseDetails: restExercise[0]._id, round: 1, status: false});
                    await user.save();
                } else {
                    return { error: true, message: 'Default exercise not found' };
                }
            }
                return { message: 'created', id: user._id, role: user.userRole, error: false, description: user.description };
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
            const updateData = { email };
            if (password && password.trim() !== "") {
                updateData.password = await bcrypt.hash(password, 10);
            }
                const { description } = userDetails;
                if (description !== undefined) updateData.description = description;
                await userModel.findByIdAndUpdate(user_id, updateData);
            return { status: 'updated' };
        } catch (error) {
            return { error: true, message: error.message };
        }
    };
      
    getUsers = async () => {
        try {
            // Include status, name, and macAddress fields so frontend can toggle and display correctly
            const users = await userModel.find({userRole:'user'}, { email: 1, status: 1, _id: 1, userRole: 1, name: 1, macAddress: 1, avatar: 1 });
                const usersWithDescription = await userModel.find({userRole:'user'}, { email: 1, status: 1, _id: 1, userRole: 1, name: 1, macAddress: 1, avatar: 1, description: 1 });
                return { users: usersWithDescription };
        } catch (error) {
            return { error: true, message: error.message };
        }
    };

    getUserById = async (id) => {
        try {
            const { user_id } = id;
            const user = await userModel.findById(user_id, { email: 1, name: 1, macAddress: 1 });
            if (!user) {
                return { error: true, message: 'User not found' };
            }
                const userWithDescription = await userModel.findById(user_id, { email: 1, name: 1, macAddress: 1, description: 1 });
                return { user: userWithDescription };
        } catch (error) {
            return { error: true, message: error.message };
        }
    };
    // User account management services end

    // User exercise management services
    autoComplete = async (exerciseName) => {
        try {
            let exercises = [];
            if (!exerciseName || exerciseName === undefined) {
                exercises = await exerciseModel.find({status: true})
            } else {
            exercises = await exerciseModel.find({ name: { $regex: exerciseName, $options: 'i' }, status: true });
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
            const user = await userModel.findById(user_id).populate('exercise.exerciseDetails', 'name url sensor');
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
    // User exercise management services end

    // Dashboard services
    countTotalPatient = async () => {
        try {
            const totalPatient = await userModel.countDocuments({ userRole: 'user' });
            return {error:false, totalPatient };
        } catch (error) {
            return { error: true, message: error.message };
        }
    }

    countActivePatient = async () => {
        try {
            const activePatient = await userModel.countDocuments({ userRole: 'user', isActive: true });
            return {error:false, activePatient };
        } catch (error) {
            return { error: true, message: error.message };
        }
    }

    countCurrentlyOnlinePatient = async () => {
        try {
            const currentlyOnlinePatient = await userModel.countDocuments({ userRole: 'user', status: true });
            return {error:false, currentlyOnlinePatient };
        } catch (error) {
            return { error: true, message: error.message };
        }
    }

    countActivatedPatient = async () => {
        try {
            const activatedPatient = await userModel.countDocuments({ userRole: 'user', status: true });
            return { error: false, activatedPatient };
        } catch (error) {
            return { error: true, message: error.message };
        }
    }

    searchUserByName = async (name) => {
        try {
            // Search only users with userRole 'user' and partial email match
            const users = await userModel.find({ userRole: 'user', email: { $regex: name, $options: 'i' } }, { email: 1 });
            return users;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    toggleUserStatus = async (user_id, status) => {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(user_id, { status }, { new: true });
            if (!updatedUser) {
                return { error: true, message: 'User not found' };
            }
            return { error: false, message: `User status updated to ${status ? 'active' : 'inactive'}` };
        } catch (error) {
            return { error: true, message: error.message };
        }
    };

    getUserCreatedStatsByMonth = async () => {
        try {
            // Group users by month of creation
            const users = await userModel.aggregate([
                { $match: { userRole: 'user' } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]);
            // Format for chart.js
            const labels = users.map(u => u._id);
            const counts = users.map(u => u.count);
            return { labels, counts };
        } catch (error) {
            return { error: true, message: error.message };
        }
    }

    updateProfile = async ({ user_id, email, password, avatar }) => {
        try {
            const updateData = { email };
            if (password && password.trim() !== "") {
                updateData.password = await bcrypt.hash(password, 10);
            }
            if (avatar) {
                updateData.avatar = avatar;
            }
            // Update and return the new user document
            const updatedUser = await userModel.findByIdAndUpdate(
                user_id,
                updateData,
                { new: true, select: 'email avatar _id userRole status' }
            );
            if (!updatedUser) {
                return { error: true, message: 'User not found' };
            }
            return { error: false, message: 'Profile updated', user: updatedUser };
        } catch (error) {
            return { error: true, message: error.message };
        }
    }
}

const userService = new UserService();
export default userService;
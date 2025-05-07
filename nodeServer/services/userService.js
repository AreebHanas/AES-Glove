import userModel from '../models/userModel.js';
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
}

const userService = new UserService();
export default userService;
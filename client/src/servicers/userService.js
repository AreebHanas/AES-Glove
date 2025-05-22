import axios from "axios";

const BASE_URL = "http://127.0.0.1:8080/api/user"

class userService {

    async fetchUser(){
        try {
            const result = await axios.get(`${BASE_URL}/`)
            return{msg:"Users fetched",error:false,data:result.data}
        } catch (err) {
            console.log("error: ", err.message)
            return {error:true, msg:"Cannot add user somthing went Wrong"}
        }
    }

    async addUser(data){
        try {
            const result = await axios.post(`${BASE_URL}/create_user`, data)
            return{message: result.data.message, error:result.data.error}
        } catch (err) {
            return {error:true, msg:"Cannot add user somthing went Wrong"}
        }
    }

    async deleteUser(data){
        
        try {
            const result = await axios.post(`${BASE_URL}/delete_user`, {patient_id:data})
            return{message:result.data.message, error:result.data.error}
        } catch (err) {
            console.log("error: ", err.message)
            return {error:true, message:"Cannot delete user. somthing went Wrong"}
        }
    }

    async autoCompleteExercise(data){
        try {
            const result = await axios.post(`${BASE_URL}/autocomplete`, {search:data})
            return{message:result.data.message, error:result.data.error, data:result.data.exercises}
        } catch (err) {
            console.log("error: ", err.message)
            return {error:true, message:"Cannot get user exercise. somthing went Wrong"}
        }
    }

    async getPatientExercise(data){
        try {
            const result = await axios.post(`${BASE_URL}/get__patient_exercise`, {user_id:data})
            return{message:result.data.message, error:result.data.error, data:result.data.data}
        } catch (err) {
            console.log("error: ", err.message)
            return {error:true, message:"Cannot get user exercise. somthing went Wrong"}
        }
    }

    async addPatientExercise(data){
        try {
            const result = await axios.post(`${BASE_URL}/add_patient_exercise`, {user_id:data.user_id, exercise_id:data.exercise_id, rounds:data.rounds})
            if (result.data.error) {
                return {error:true, message:result.data.message}
            }
            return{message:result.data.message, error:result.data.error}
        } catch (err) {
            console.log("error: ", err.message)
            return {error:true, message:"Cannot add user exercise. somthing went Wrong"}
        }
    }

    async removePatientExercise(data){
        try {
            const result = await axios.post(`${BASE_URL}/remove_patient_exercise`, {user_id:data.user_id, exercise_id:data.exercise_id})
            return{message:result.data.message, error:result.data.error}
        }
        catch (err) {
            console.log("error: ", err.message)
            return {error:true, message:"Cannot remove user exercise. somthing went Wrong"}
        }
    }

    async getPatientCount(){
        try {
            const result = await axios.get(`${BASE_URL}/get_patient_count`)
            if (result.data.error) {
                return {error:true, message:result.data.message}
            }
            return {error:false, count:result.data.count}
        } catch (err) {
            console.log("error: ", err.message)
            return {error:true, message:"Cannot get user count. somthing went Wrong"}
        }
    }

    async getActivePatientCount(){
        try {
            const result = await axios.get(`${BASE_URL}/get_active_patient_count`)
            if (result.data.error) {
                return {error:true, message:result.data.message}
            }
            return {error:false, count:result.data.count}
        } catch (err) {
            console.log("error: ", err.message)
            return {error:true, message:"Cannot get user count. somthing went Wrong"}
        }
    }

    async getOnlinePatientCount(){
        try {
            const result = await axios.get(`${BASE_URL}/get_online_patient_count`)
            if (result.data.error) {
                return {error:true, message:result.data.message}
            }
            return {error:false, count:result.data.count}
        } catch (err) {
            console.log("error: ", err.message)
            return {error:true, message:"Cannot get user count. somthing went Wrong"}
        }
    }

    async searchUserByName(name) {
        try {
            const result = await axios.get(`${BASE_URL}/search_user_by_name`, { params: { name } });
            return { error: false, data: result.data.users };
        } catch (err) {
            console.log("error: ", err.message);
            return { error: true, message: "Cannot search user by name. Something went wrong" };
        }
    }

    async editUser(data) {
        try {
            const result = await axios.put(`${BASE_URL}/edit_user`, data);
            return { message: result.data.message, error: result.data.error };
        } catch (err) {
            console.log("error: ", err.message);
            return { error: true, message: "Cannot edit user. Something went wrong" };
        }
    }

    async toggleUserStatus(user_id, status) {
        try {
            const result = await axios.put(`${BASE_URL}/toggle_user_status`, { user_id, status });
            return { message: result.data.message, error: result.data.error };
        } catch (err) {
            console.log("error: ", err.message);
            return { error: true, message: "Cannot toggle user status. Something went wrong" };
        }
    }

    async getActivatedPatientCount(){
        try {
            const result = await axios.get(`${BASE_URL}/get_activated_patient_count`)
            if (result.data.error) {
                return {error:true, message:result.data.message}
            }
            return {error:false, count:result.data.count.activatedPatient}
        } catch (err) {
            console.log("error: ", err.message)
            return {error:true, message:"Cannot get activated user count. somthing went Wrong"}
        }
    }

    async editPatientExercise(data) {
        try {
            const result = await axios.post(`${BASE_URL}/edit_patient_exercise`, data);
            return { message: result.data.message, error: result.data.error };
        } catch (err) {
            console.log("error: ", err.message);
            return { error: true, message: "Cannot edit patient exercise. Something went wrong" };
        }
    }
}

const user = new userService();

export default user;
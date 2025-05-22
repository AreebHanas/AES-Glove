import axios from "axios";

class userService {

    async fetchUser(){
        try {
            const result = await axios.get("http://127.0.0.1:8080/api/user/")
            return{msg:"Users fetched",error:false,data:result.data}
        } catch (err) {
            console.log("error: ", err.message)
            return {error:true, msg:"Cannot add user somthing went Wrong"}
        }
    }

    async addUser(data){
        try {
            const result = await axios.post("http://127.0.0.1:8080/api/user/create_user", data)
            return{message: result.data.message, error:result.data.error}
        } catch (err) {
            return {error:true, msg:"Cannot add user somthing went Wrong"}
        }
    }

    async deleteUser(data){
        
        try {
            const result = await axios.post("http://127.0.0.1:8080/api/user/delete_user", {patient_id:data})
            return{message:result.data.message, error:result.data.error}
        } catch (err) {
            console.log("error: ", err.message)
            return {error:true, message:"Cannot delete user. somthing went Wrong"}
        }
    }

    async updateUser(data){
        try {
            const result = await axios.post("http://127.0.0.1:8080/api/user/edit_user", data)
            return{message:result.data.message, error:result.data.error}
        } catch (err) {
            console.log("error: ", err.message)
            return {error:true, message:"Cannot update user. somthing went Wrong"}
        }
    }

    async autoCompleteExercise(data){
        try {
            const result = await axios.post("http://127.0.0.1:8080/api/user/autocomplete", {search:data})
            return{message:result.data.message, error:result.data.error, data:result.data.exercises}
        } catch (err) {
            console.log("error: ", err.message)
            return {error:true, message:"Cannot get user exercise. somthing went Wrong"}
        }
    }

    async getPatientExercise(data){
        try {
            const result = await axios.post("http://127.0.0.1:8080/api/user/get__patient_exercise", {user_id:data})
            return{message:result.data.message, error:result.data.error, data:result.data.data}
        } catch (err) {
            console.log("error: ", err.message)
            return {error:true, message:"Cannot get user exercise. somthing went Wrong"}
        }
    }

    async addPatientExercise(data){
        try {
            const result = await axios.post("http://127.0.0.1:8080/api/user/add_patient_exercise", {user_id:data.user_id, exercise_id:data.exercise_id, rounds:data.rounds})
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
            const result = await axios.post("http://127.0.0.1:8080/api/user/remove_patient_exercise", {user_id:data.user_id, exercise_id:data.exercise_id})
            return{message:result.data.message, error:result.data.error}
        }
        catch (err) {
            console.log("error: ", err.message)
            return {error:true, message:"Cannot remove user exercise. somthing went Wrong"}
        }
    }
}

const user = new userService();

export default user;
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
}

const user = new userService();

export default user;
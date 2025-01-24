import axios from "axios";

class userService {

    async fetchUser(){
        try {
            const result = await axios.get("http://127.0.0.1:8080/api/get_patients", {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            return{msg:"User added",error:false,data:result.data}
        } catch (err) {
            console.log("error: ", err.message)
            return {error:true, msg:"Cannot add user somthing went Wrong"}
        }
    }

    async addUser(data){
        try {
            await axios.post("http://127.0.0.1:8080/api/create_patient", data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            return{msg:"User added",error:false}
        } catch (err) {
            console.log("error: ", err.message)
            return {error:true, msg:"Cannot add user somthing went Wrong"}
        }
    }

    async deleteUser(data){
        
        try {
            await axios.post("http://127.0.0.1:8080/api/delete_patient", {patient_id:data}, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            return{msg:"Account Deleted",error:false}
        } catch (err) {
            console.log("error: ", err.message)
            return {error:true, msg:"Cannot delete user. somthing went Wrong"}
        }
    }
}

const user = new userService();

export default user;
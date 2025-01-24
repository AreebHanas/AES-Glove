import axios from "axios";

class authService {

    async loginUser(data){
        // const secretKey = "Univercity of Morattuwa ".padEnd(32)
        // const encryptedPassword = CryptoJS.AES.encrypt(password,secretKey).toString();

        try {
            const response = await axios.post("http://127.0.0.1:8080/api/authenticate", data, {
                headers: {
                    'Content-Type': 'multipart/form-data', // This is automatically set by Axios when using FormData
                },
            });

            if(response.data.token){
                localStorage.setItem("authToken", response.data.token);
                return {error:false, msg:"success"}
            } else {
                return {error:true,msg:"Invalid credentials"}
            }

        } catch (err) {
            console.log("error: ", err.message)
            return {error:true, msg:"Login failed. Please try again."}
        }

    }
}

const auth = new authService();

export default auth;
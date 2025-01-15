import axios from "axios";

class authService {

    async loginUser(data){
        const secretKey = "Univercity of Morattuwa ".padEnd(32)
        const email = data.email
        const password = data.password
        // const encryptedPassword = CryptoJS.AES.encrypt(password,secretKey).toString();

        try {
            const response = await axios.post("http://127.0.0.1:5000/login", {
              email,
              password: password,
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

export default new authService;
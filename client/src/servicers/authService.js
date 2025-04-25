// import axios from "axios";

// class authService {

//     async loginUser(data){
//         // const secretKey = "Univercity of Morattuwa ".padEnd(32)
//         // const encryptedPassword = CryptoJS.AES.encrypt(password,secretKey).toString();

//         try {
//             const response = await axios.post("http://127.0.0.1:8080/api/authenticate", data, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data', // This is automatically set by Axios when using FormData
//                 },
//             });
//             console.log(data)
//             return {error:false, msg:"Login success", token:response.data.token}
//         } catch (err) {
//             console.log("error: ", err.message)
//             return {error:true, msg:"Login failed. Please try again."}
//         }

//     }
// }

// const auth = new authService();

// export default auth;


import axios from "axios";

class authService {

    async seeder(){
        try {
            const response = await axios.get("http://127.0.0.1:8080/api/seeder");
            return {error:false, msg:response.data.msg, data:response.data}
        } catch (err) {
            console.log("error: ", err.message)
            return {error:true, msg:"Cant create a seeder service"}
        }

    }

    async loginUser(data){

        try {
            const response = await axios.post("http://127.0.0.1:8080/api/login", data);
            return {error:response.data.error, msg:response.data.msg, resData:response.data}
        } catch (err) {
            console.log("error: ", err.message)
            return {error:true, msg:"Login failed. Please try again."}
        }

    }
}

const auth = new authService();

export default auth;
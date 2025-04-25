import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    // name: {
    //     type: String,
    //     required: true,
    // },
    password: {
        type: String,
        required: true,
    },
    userRole: {
        type: String,
        required: true,
        default: 'user',
    },
    status:{
        type: Boolean,
        required: true,
        default: true,
    },
},
{timestamps: true}
);

const user = mongoose.model("User", userSchema);

export default user;
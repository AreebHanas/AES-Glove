import mongoose from "mongoose";


const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    status:{
        type: Boolean,
        required: true,
        default: true,
    },
},
{timestamps: true}
);

const exercise = mongoose.model("Exercise", exerciseSchema);

export default exercise;
// src/services/exerciseService.js
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://20.249.219.51:8080/api/exercise";

class ExerciseService {
  async fetchExercise() {
    try {
      const result = await axios.get(`${BASE_URL}/`);
      return { msg: "Exercises fetched", error: false, data: result.data };
    } catch (err) {
      console.log("Error:", err.message);
      toast.error("Something went wrong while fetching exercises");
      return { error: true, msg: "Cannot fetch exercises. Something went wrong." };
    }
  }

  async addExercise(data) {
    try {
      const result = await axios.post(`${BASE_URL}/create_exercise`, data);
      return { message: result.data.message, error: result.data.error };
    } catch (err) {
      console.log("Error:", err.message);
      toast.error("Something went wrong while adding exercise");
      return { error: true, msg: "Cannot add exercise. Something went wrong." };
    }
  }

  async deleteExercise(id) {
    try {
      const result = await axios.post(`${BASE_URL}/delete_exercise`, { patient_id: id });
      return { message: result.data.message, error: result.data.error };
    } catch (err) {
      console.log("Error:", err.message);
      toast.error("Something went wrong while deleting exercise");
      return { error: true, message: "Cannot delete exercise. Something went wrong." };
    }
  }

  async getExerciseCount(){
        try {
            const result = await axios.get(`${BASE_URL}/get_exercise_count`)
            if (result.data.error) {
                return {error:true, message:result.data.message}
            }
            return {error:false, count:result.data.count}
        } catch (err) {
            console.log("error: ", err.message)
            return {error:true, message:"Cannot get exercise count. somthing went Wrong"}
        }
    }

  async searchExerciseByName(name) {
    try {
      const result = await axios.get(`${BASE_URL}/search_exercise_by_name`, { params: { name } });
      return { error: false, data: result.data.exercises };
    } catch (err) {
      console.log("Error:", err.message);
      return { error: true, message: "Cannot search exercise by name. Something went wrong." };
    }
  }
}

const exerciseService = new ExerciseService();

export default exerciseService;

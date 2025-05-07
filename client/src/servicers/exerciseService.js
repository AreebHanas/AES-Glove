// src/services/exerciseService.js
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://127.0.0.1:8080/api/exercise";

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
}

const exerciseService = new ExerciseService();

export default exerciseService;

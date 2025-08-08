import axios from "axios";

const BASE_URL = "http://127.0.0.1:8080/api"

class historyService {

    async fetchHistory(userId, period = 'day', fields = [], startDate, endDate, exerciseId) {
        try {
            const result = await axios.post(`${BASE_URL}/history`, { userId, period, fields, startDate, endDate, exerciseId });
            return{msg:"history fetched", error:false, data:result.data}
        } catch (error) {
            console.error("Error in fetchHistory:", error);
            throw error;
            
        }
    }

    // Add: fetchExerciseRoundsSummary for summary table
    async fetchExerciseRoundsSummary(userId, startDate, endDate) {
        try {
            const result = await axios.post(`${BASE_URL}/history/rounds-summary`, { userId, startDate, endDate });
            return { msg: "summary fetched", error: false, data: result.data };
        } catch (error) {
            console.error("Error in fetchExerciseRoundsSummary:", error);
            throw error;
        }
    }
}

const history = new historyService();

export default history;
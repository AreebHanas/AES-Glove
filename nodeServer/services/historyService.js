import mongoose from "mongoose";
import SensorData from "../models/sensorModel.js";
import User from "../models/userModel.js";

class HistoryService {
  getDateRange = (type) => {
    const now = new Date();
    let start;

    switch (type) {
      case "day":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        start = new Date();
        start.setDate(start.getDate() - 7);
        break;
      case "month":
        start = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the month
        break;
      default:
        start = new Date(0);
    }

    return { start, end: new Date() };
  };

  getAggregatedSensorData = async (userId, period, fields = [], startDate, endDate, exerciseId) => {
    // Use provided startDate/endDate or fallback to default
    let start, end;
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      const range = this.getDateRange(period);
      start = range.start;
      end = range.end;
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Build projection for flex and sensor fields
    let flexFields = [
      "EF_Flex",
      "IF_Flex",
      "MF_Flex",
      "PF_Flex",
      "RF_Flex",
      "TF_Flex",
      "WF_Flex",
    ];
    let sensorFields = ["HR", "SPO2", "EMG", "Pressure"];
    let project = { createdAt: 1 };
    // Add completedRounds to fields
    let extraFields = ["completedRounds"];

    // Add requested flex, sensor, and extra fields
    if (fields && fields.length > 0) {
      flexFields.forEach((flex) => {
        if (fields.includes(flex)) project[`flex.${flex}`] = 1;
      });
      sensorFields.forEach((sensor) => {
        if (fields.includes(sensor)) project[`sensors.${sensor}`] = 1;
      });
      extraFields.forEach((extra) => {
        if (fields.includes(extra)) project[extra] = 1;
      });
    } else {
      // Default: all
      flexFields.forEach((flex) => (project[`flex.${flex}`] = 1));
      sensorFields.forEach((sensor) => (project[`sensors.${sensor}`] = 1));
      extraFields.forEach((extra) => (project[extra] = 1));
    }

    const matchQuery = {
      userId: userObjectId,
      createdAt: { $gte: start, $lte: end },
    };
    if (exerciseId) {
      matchQuery.exerciseId = new mongoose.Types.ObjectId(exerciseId);
    }

    if (period === "day") {
      // Return average per day for the selected date range
      // Group by day and average each field
      let group = {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
      };
      flexFields.forEach((flex) => {
        if (!fields.length || fields.includes(flex))
          group[`avg_${flex}`] = { $avg: `$flex.${flex}` };
      });
      sensorFields.forEach((sensor) => {
        if (!fields.length || fields.includes(sensor))
          group[`avg${sensor}`] = { $avg: `$sensors.${sensor}` };
      });
      // Add completedRounds aggregation
      if (!fields.length || fields.includes("completedRounds")) {
        // group["avgCompletedRounds"] = { $avg: "$completedRounds" };
        group["maxCompletedRounds"] = { $max: "$completedRounds" };
        // group["sumCompletedRounds"] = { $sum: "$completedRounds" };
      }
      return await SensorData.aggregate([
        {
          $match: matchQuery,
        },
        { $group: group },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ]);
    }

    if (period === "week") {
      // Return average per week for the selected date range
      // Group by year and ISO week number
      let group = {
        _id: {
          year: { $year: "$createdAt" },
          week: { $isoWeek: "$createdAt" },
        },
      };
      flexFields.forEach((flex) => {
        if (!fields.length || fields.includes(flex))
          group[`avg_${flex}`] = { $avg: `$flex.${flex}` };
      });
      sensorFields.forEach((sensor) => {
        if (!fields.length || fields.includes(sensor))
          group[`avg${sensor}`] = { $avg: `$sensors.${sensor}` };
      });
      // Add completedRounds aggregation
      if (!fields.length || fields.includes("completedRounds")) {
        // group["avgCompletedRounds"] = { $avg: "$completedRounds" };
        group["maxCompletedRounds"] = { $max: "$completedRounds" };
        // group["sumCompletedRounds"] = { $sum: "$completedRounds" };
      }
      return await SensorData.aggregate([
        {
          $match: matchQuery,
        },
        { $group: group },
        { $sort: { "_id.year": 1, "_id.week": 1 } },
      ]);
    }

    if (period === "month") {
      // Return average per month for selected fields
      let group = {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
      };
      flexFields.forEach((flex) => {
        if (!fields.length || fields.includes(flex))
          group[`avg_${flex}`] = { $avg: `$flex.${flex}` };
      });
      sensorFields.forEach((sensor) => {
        if (!fields.length || fields.includes(sensor))
          group[`avg${sensor}`] = { $avg: `$sensors.${sensor}` };
      });
      // Add completedRounds aggregation
      if (!fields.length || fields.includes("completedRounds")) {
        // group["avgCompletedRounds"] = { $avg: "$completedRounds" };
        group["maxCompletedRounds"] = { $max: "$completedRounds" };
        // group["sumCompletedRounds"] = { $sum: "$completedRounds" };
      }
      return await SensorData.aggregate([
        {
          $match: matchQuery,
        },
        { $group: group },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);
    }

    // Default fallback
    return [];
  };

  // New: Get max completedRounds per exercise per day (or period), and assigned round from user table
  getExerciseRoundsSummary = async (userId, startDate, endDate) => {
    const period = "day"
    let start, end;
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      const range = this.getDateRange(period);
      start = range.start;
      end = range.end;
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Aggregate max completedRounds per exercise per day
    let groupId = {
      exerciseId: "$exerciseId",
      year: { $year: "$createdAt" },
      month: { $month: "$createdAt" },
      day: { $dayOfMonth: "$createdAt" },
    };

    const sensorAgg = await SensorData.aggregate([
      {
        $match: {
          userId: userObjectId,
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: groupId,
          maxCompletedRounds: { $max: "$completedRounds" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.exerciseId": 1 } },
    ]);

    // 2. Get assigned rounds for each exercise from user table
    const user = await User.findById(userObjectId).lean();
    const assignedRoundsMap = {};
    if (user && user.exercise) {
      user.exercise.forEach((ex) => {
        assignedRoundsMap[ex.exerciseDetails.toString()] = ex.round;
      });
    }

    // 3. Merge assigned round into result
    const result = sensorAgg.map((row) => {
      const exerciseId = row._id.exerciseId.toString();
      return {
        ...row._id,
        exerciseId,
        maxCompletedRounds: row.maxCompletedRounds,
        assignedRound: assignedRoundsMap[exerciseId] || 0,
      };
    });
    console.log('result', result)
    return result;
  };
}

export default new HistoryService();

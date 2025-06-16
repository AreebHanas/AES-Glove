import mongoose from "mongoose";
import SensorData from "../models/sensorModel.js";

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

    // Add requested flex fields
    if (fields && fields.length > 0) {
      flexFields.forEach((flex) => {
        if (fields.includes(flex)) project[`flex.${flex}`] = 1;
      });
      sensorFields.forEach((sensor) => {
        if (fields.includes(sensor)) project[`sensors.${sensor}`] = 1;
      });
    } else {
      // Default: all
      flexFields.forEach((flex) => (project[`flex.${flex}`] = 1));
      sensorFields.forEach((sensor) => (project[`sensors.${sensor}`] = 1));
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
}

export default new HistoryService();

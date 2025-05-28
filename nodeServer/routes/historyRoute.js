import express from 'express';
import HistoryService from '../services/historyService.js'; // Assuming that's where your service is
// import { authenticateUser } from '../middleware/authMiddleware.js'; // Optional if you have auth

const router = express.Router();

// @route   GET /api/history/:userId
// @desc    Get sensor history data by period
// @query   period=day|week|month
// @access  Private (assuming you're using authentication)
router.post('/', async (req, res) => {
  const { userId, period = 'day', fields = [], startDate, endDate } = req.body; // accept startDate, endDate

  try {
    const data = await HistoryService.getAggregatedSensorData(userId, period, fields, startDate, endDate);
    res.status(200).json(data);
  } catch (error) {
    console.error('History route error:', error);
    res.status(500).json({ message: 'Failed to fetch sensor history data' });
  }
});

export default router;

import mongoose from 'mongoose';

const sensorDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // helps with filtering by week/month
  },
  flex: {
    EF_Flex: Number,
    IF_Flex: Number,
    MF_Flex: Number,
    PF_Flex: Number,
    RF_Flex: Number,
    TF_Flex: Number,
    WF_Flex: Number,
  },
  sensors: {
    HR: Number,         // Heart Rate
    SPO2: Number,       // Blood oxygen
    EMG: Number,
    FSR: Number,
  },
  status: {
    type: String,
    default: 'Active',
  },
  battery: {
    type: String,
    default: 'Not Configured',
  },
}, {
  timestamps: true, // gives you createdAt & updatedAt
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

export default SensorData;

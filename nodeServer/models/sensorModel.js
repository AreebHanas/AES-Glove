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
    default: Date.now,
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
    HR: Number,
    SPO2: Number,
    EMG: Number,
    Pressure: Number,
  },
  completedRounds: {
    type: Number,
    default: 0,
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
  timestamps: true,
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

export default SensorData;

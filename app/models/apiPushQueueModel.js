//#########################################################
//############### API PUSH QUEUE DATA MODEL ###############
//#########################################################

////////////////////////////////
////// NPM Module Imports //////
////////////////////////////////
import mongoose from 'mongoose';

/////////////////////////////////
////// Connect to Mongoose //////
/////////////////////////////////
mongoose.connect(
  "mongodb://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@mongodb:27017/" + process.env.DB_DATABASE + "?authSource=admin",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 2000,
  },
  (err) => {
    if (err) {
      console.error('FAILED TO CONNECT TO MONGODB');
    } else {
      //console.log('CONNECTED TO MONGODB');
    }
  }
);

/////////////////////////////
////// Mongoose Schema //////
/////////////////////////////
const Schema = mongoose.Schema;
const apiPushQueueSchema = Schema({
  platform: {
    type: String,
    index: true,
    required: [true, ''],
    validate: {
      validator: function(value) {
        return value.trim() !== '';
      },
      message: ''
    },
    trim: true
  },
  api_type: {
    type: String,
    index: true,
    required: [true, ''],
    validate: {
      validator: function(value) {
        return value.trim() !== '';
      },
      message: ''
    },
    trim: true
  },
  request_time: {
    type: Number,
    required: [true, ''],
    validate: {
      validator: function(value) {
        return !isNaN(value) && isFinite(value);
      },
      message: ''
    },
    default: 0
  },
  status: {
    type: Number,
    required: [true, ''],
    validate: {
      validator: function(value) {
        return !isNaN(value) && isFinite(value);
      },
      message: ''
    },
    default: 0
  },
  attempts: {
    type: Number,
    required: [true, ''],
    validate: {
      validator: function(value) {
        return !isNaN(value) && isFinite(value);
      },
      message: ''
    },
    default: 0
  },
  push_data: {
    type: Object,
    default: {}
  },
});

//////////////////////////
////// Model Export //////
//////////////////////////
const apiPushQueueModel = mongoose.model('api_push_queues', apiPushQueueSchema);

export { apiPushQueueModel };
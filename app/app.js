//########################################################
//########################################################
//########                                        ########
//########       CLOUD SWITCHBOARD API V1.0       ########
//########                                        ########
//########################################################
//########################################################

//################################################
//############### CORE API MODULES ###############
//################################################ 
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import Redis from "ioredis";
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from "@socket.io/redis-adapter";

//##################################################
//############### CREATE EXPRESS APP ###############
//##################################################
const app = express();
const server = createServer(app); 

//###########################################
//############### APP OPTIONS ###############
//###########################################
app.disable('x-powered-by'); 
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

const corsOptions = {
  origin: '*',
  methods: 'GET,POST,OPTIONS',
  preflightContinue: true,
  optionsSuccessStatus: 204,
  exposedHeaders: ['Location', 'Upload-Offset']
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
  app.locals.session_id = null;
  next();
});
app.use(express.json({ limit: '50000mb' }));   
app.use((req, res, next) => {
  req.io = io;
  next();
}); 

//#########################################
//############### SOCKET.IO ###############
//#########################################
const io = new SocketIOServer(server);
const pubClient = new Redis({ host: "redis" });
const subClient = pubClient.duplicate();

pubClient.on('error', (err) => console.error('Redis pubClient error', err));
subClient.on('error', (err) => console.error('Redis subClient error', err));

io.adapter(createAdapter(pubClient, subClient));
io.use((socket, next) => { 
  const isValidAccessKey = checkSocketAccessKey(
    socket.handshake.query.accessKey,
    socket.handshake.headers['user-agent']
  );
  if (isValidAccessKey) {
    next();
  } else {
    next(new Error('Authentication error'));
    socket.disconnect(true);
  }
});
 
io.on('connection', (socket) => {
  socket.on('event', (data) => {
    if (data && data.eventName) {      
      const isValidAccessKey = checkSocketAccessKey(
        data.payload.accessKey,
        socket.handshake.headers['user-agent'],
        data.eventName
      );
      if (isValidAccessKey) {
        if (process.env.NODE_ENV === "development") {
          console.log('EMIT Received, passed token clearance');
        }
      } else {
        socket.disconnect(true);
      } 
    }
  });

  if (process.env.NODE_ENV === "development") {
    console.log('A user connected to socket');
  }

  socket.on('disconnect', () => {
    if (process.env.NODE_ENV === "development") {
      console.log('User disconnected to socket');
    }
  });

});


//#######################################################
//############### REQUEST HANDLER IMPORTS ###############
//#######################################################
import handleGetDefault from './handlers/handleGetDefault.js';
import handleTest from './handlers/handleTest.js';
import handlePushToQueue from './handlers/handlePushToQueue.js';

//###############################################
//########## REST API END-POINT ROUTER ##########
//###############################################

///////////////////////////////
////// SYSTEM END POINTS //////
///////////////////////////////

////// TEST FILE //////
app.get('/test/', (req, res) => {
  handleTest(app, req, res);  
});

////// PUSH TO QUEUE //////
app.post('/push-to-api/:fromPlatform/', (req, res) => {
  handlePushToQueue(app, req, res);  
});

////// TEST FILE ////// 
app.post('/emit-event', (req, res) => {
  handleEmitEvent(req, res);
});

/////////////////
////// END //////
/////////////////

////// 404 //////
app.use((req, res) => {
  handleGetDefault(app, req, res);
});

export default app; 
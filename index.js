const express = require('express');
const app = express();
const env = require("./env");
process.env = {
    ...env,
    ...process.env,
  };
const {processChatData} = require('./services/chat-service');
const {processZaloChat} = require('./services/zalo-service');
const webhookController = require("./controller/webhook-controller");
const bodyParser = require("body-parser");
const logger = require('./base/logger');
const queueService  = require("./base/services/queue-service");
const redisService = require("./base/services/redis-service");
const httpLogger = require("pino-http").pinoHttp({
    logger:logger,
    customLogLevel: function (req, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'warn'
      } else if (res.statusCode >= 500 || err) {
        return 'error'
      } else if ((res.statusCode >= 300 && res.statusCode < 400) ||res.hasHeader('x-log')) {
        return 'silent'
      }
      return 'info'
    }
  });


//ejs
app.set("view engine", 'ejs');

//routes
app.get('/zalo-chat', (req,res) =>{
    const orgId = req.query.orgId;
    if(orgId == "3388f0b8-7d8c-49f2-b6ff-9d45d184186e"){
        res.render('zalo-chat');
    }else{
        res.render('404');
    }
});

app.get('/detail', (req,res) =>{
    res.render('detail');
});

app.use(httpLogger);
// parse application/json
app.use(bodyParser.json({}));
app.use(bodyParser.raw({ type: "application/json" }));
app.use('/public', express.static('public'));
app.use("/webhook", webhookController);

const completedEvent=(job)=>{
    logger.info({tag:job.name,attempt:job?.attemptsMade},`processed ${job.name}`)
  }
  const failedEvent = (job)=>{
    const maxAttempts = job?.opts.attempts || 1;
      
    if (job.attemptsMade < maxAttempts) return;
    logger.warn({tag:job.name,attempt:job?.attemptsMade,data:job?.data,err:job?.stacktrace},`failed to process ${job.name} ` +job?.failedReason);
  }
const startZaloChatWorker =()=>{
    const queueName=process.env.MSG_QUEUE||"msg-queue";
    const workerConfig = queueService.defaultWorkerConfig(`${queueName}-zaloChat`);
    workerConfig.concurrency= 1;
    workerConfig.settings = {backoffStrategy:(attemptsMade, type, err, job)=>{
    return attemptsMade===undefined?1000:  attemptsMade*(attemptsMade+60)*1000;
  
    }}
    const worker = queueService.createWorker(`${queueName}-zaloChat`, processZaloChat ,workerConfig);
    worker?.on('failed', failedEvent);
    worker?.on('completed', completedEvent);
  
}
startZaloChatWorker();

//init socket 
var serverSocket = require('http').createServer(app);
var io = require('socket.io')(serverSocket, {
    allowEIO3: true, // false by default
    maxHttpBufferSize: 1e8
  });
io.on('connection', function (socket) {

  const orgId = socket.handshake.query.orgId;
  const zaloUserId = socket.handshake.query.zaloUserId;
  const groupName = `group-${orgId}-${zaloUserId}`;
  console.log(groupName)
    socket.join(groupName);

    socket.on('send', function (data) {
        try{
            processChatData(io.to(groupName), data)
        }catch(error){
            console.log("Lỗi", error)
        }
    });

    socket.on('end', function (data) {
        try{
            // SF update endTime, endedBy
            io.to(groupName).emit('end', data);
        }catch(error){
            console.log("Lỗi", error)
        }
    });
});

//port
app.set("port", process.env.PORT || 8080);

const server = app.listen(app.get("port"), function () {
    logger.info(`Server is running at localhost: ${app.get("port")}`)
  });

process.on('SIGTERM', () => {
    logger.debug('SIGTERM signal received: closing HTTP server')
    shutdown();
  });
  process.on('SIGINT', () => {
    logger.debug('SIGINT signal received: closing HTTP server');
    shutdown();
  });
  
  const shutdown = ()=>{
  
    server.close(async () => {
      logger.debug('HTTP server closed');
      await queueService.closeAllWorker();
      await queueService.closeAllQueue();
  
      await redisService.closeAll();
      logger.debug('queue closed');
    });
  }
  
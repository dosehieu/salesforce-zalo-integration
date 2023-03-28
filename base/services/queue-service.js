const { Queue,Worker, MetricsTime } = require("bullmq");
const redisService= require('./redis-service');

/**
 * list of queue
 * @type {Map<string,Queue>}
 */
const queues = new Map();

/**
 * list of worker
 * @type {Map<string,Worker>}
 */
const workers = new Map();
const defaultQueueConfig = (name)=>{
 return {
    streams: {
      events: {
        maxLen: 0,
      },
    },
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "custom" },
    },
    connection: redisService.createConnection(`${name}-producer`,false),
  };
}
/**
 * 
 * @param {string} name 
 * @returns {import("bullmq").WorkerOptions}
 */
const defaultWorkerConfig = (name)=>{
  return {
    concurrency: 1,
    settings: {
      backoffStrategy: (attemptsMade) =>attemptsMade===undefined? 2000: attemptsMade*attemptsMade*1000,

    },
    connection: redisService.createConnection(`${name}-consumer`,false),
    metrics: {
      maxDataPoints: MetricsTime.ONE_MONTH,
    },
  }


}

  /**
   * create or get queue
   * @param {string} name 
   * @param {import("bullmq").QueueOptions|undefined} [config]
   * @returns {Queue}
   */
 const createQueue = (name,config)=>{
  if (queues.has(name)){

    // @ts-ignore
    return queues.get(name);
  }else {
    const queue = new Queue(name,config?config :defaultQueueConfig(name));
    queues.set(name,queue);
    return queue;
  }

 } 
 /**
  * create or get worker
  * @param {string} name 
  * @param {import("bullmq").Processor} process 
  * @param {import("bullmq").WorkerOptions|undefined} [config] 
  * @returns 
  */

 const createWorker = (name,process,config)=>{
  if(workers.has(name)){
    return workers.get(name);
  }else{
    const worker = new Worker(name,process,config?config:defaultWorkerConfig(name));
      workers.set(name,worker);
      return worker;
  }

 }
 const closeAllQueue = async ()=>{

   await Promise.allSettled([...queues.values()].map(x=>x.close()));

 }
 const closeAllWorker = async()=>{
  await Promise.allSettled([...workers.values()].map(x=>x.close()));
 }

module.exports ={createQueue,createWorker,closeAllQueue,closeAllWorker,defaultQueueConfig,defaultWorkerConfig};



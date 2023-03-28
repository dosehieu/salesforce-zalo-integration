const Redis = require('ioredis').default;
const e = require('express');
const logger = require('../logger');
/**
 * @type {Map<string,Redis>}
 */
const clients =new Map();
/**
 * create new connection if connectionName not exist else return connected connection
 * @param {string} connectionName 
 * @param {boolean} enableOfflineQueue 
 * @returns  {Redis}
 */
const createConnection = (connectionName,enableOfflineQueue=true)=>{
    if(clients.has(connectionName)) 
    // @ts-ignore
    return clients.get(connectionName);
    else {
    const redis = new Redis(process.env.REDIS_URL ,{maxRetriesPerRequest: null, lazyConnect:false,reconnectOnError(err) {
        const targetError = "READONLY";
        if (err.message.includes(targetError)) {
          // Only reconnect when the error contains "READONLY"
          return true; // or `return 1;`
        }
      },enableOfflineQueue,connectionName});
    redis.on("connect",()=>logger.info({tag:'redis'},`redis ${redis.options.connectionName} connected`));
    redis.on("close",()=>logger.info({tag:'redis'},`redis ${redis.options.connectionName} closed`));

    clients.set(connectionName,redis);

    return redis;}
}

const closeAll = ()=>Promise.allSettled([...clients.values()].map(client=>client.quit()));



module.exports= {createConnection,closeAll};
const logger = require("../../base/logger");
const MongoClient = require("mongodb").MongoClient;
const mongourl = process.env.MONGODB_URL;
const dbName = "salesforce-zalo-chat";

async function connectDb() {
  const client = await MongoClient.connect(mongourl, {
    useNewUrlParser: true,
  }).catch((error) => {
    logger.error({ tag: "app-connect-db", err: error }, "failed to connect db");
  });
  return client;
}

const find = async (doc,collection)=>{
  const client = await connectDb();
  try{
    const db = client.db(dbName);
    const coll = db.collection(collection);
    return await coll.findOne(doc);
  }finally{
    if(client) await client.close();
  }
}
const query = async (query,collection)=>{
  const client = await connectDb();
  try{
    const db = client.db(dbName);
    const coll = db.collection(collection);
    return await coll.find(query).toArray();
  }finally{
    if(client) await client.close();
  }
}

const insert = async (doc,collection)=>{
  const client = await connectDb();

  try{
    const db = client.db(dbName);
    const coll = db.collection(collection);
    return await coll.insertOne(doc);
  }finally{
    if(client) await client.close();
  }
  

}
/**
 * 
 * @param {*} filter 
 * @param {*} value 
 * @param {*} collection 
 * @returns {Promise<import("mongodb").UpdateResult>}
 */
const update = async (filter,value,collection)=>{
  const client = await connectDb();

  try{
    const db = client.db(dbName);
    const coll = db.collection(collection);
    return await coll.updateOne(filter,value);
  }finally{
    if(client) await client.close();
  }
  

}

module.exports = { query, find, insert, update };


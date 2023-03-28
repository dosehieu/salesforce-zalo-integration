const pino = require('pino').pino;
const streams= [
    {stream: process.stdout}
];
if (process.env.NODE_ENV!=='production'){
    // @ts-ignore
    streams.push({stream: pino.destination({dest:`log/logger.log`, mkdir:true})});
}
const logger = pino({level:'debug'}, pino.multistream(streams));

module.exports=logger;
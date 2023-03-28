const crypto = require('crypto');
const verifyWebhook = () => async (req, res, next) => { 
    console.log("webhook req.body", req.body);
    const signature = req.get('X-ZEvent-Signature');
    const body = req.body;
    if(!body){
        // register webhook
        res.status(200).json({});
        return false;
    }
    if(body.app_id && body.timestamp && signature){
        var content = process.env.APP_ID + JSON.stringify(body) + body.timestamp + process.env.OA_Secret_Key;
        console.log("content",content);
        const hash = "mac=" + crypto.createHash('sha256').update(content).digest('hex');
        console.log("hash",hash);
        console.log("signature",signature);
        if(hash == signature){
        return next();
        }
      
    }
    req.log.info({tag:"webhook-verify", body:req.body},`failed to verify webhook `)
    res.status(403).json({"message":"verify webhook failed"});
  };

  module.exports={verifyWebhook}
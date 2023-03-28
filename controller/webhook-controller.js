const express = require("express");
const router = express.Router();
const auth = require("../base/middlewares/auth");
const queueService = require("../base/services/queue-service");
const queueName = process.env.MSG_QUEUE||"msg-queue";
const zaloChatQueue = queueService.createQueue(`${queueName}-zaloChat`);

// Get SaleForce Personalized data
router.post("/zalo/:orgId", auth.verifyWebhook(), async (req, res) => {
    console.log("webhook", req.body);
    await zaloChatQueue.add('zaloChat', {orgId: req.params.orgId, body: req.body});
  res.json({});
});

module.exports = router;
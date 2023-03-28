const express = require("express");
const router = express.Router();
const auth = require("../base/middlewares/auth");
const queueService = require("../base/services/queue-service");
const queueName = process.env.MSG_QUEUE||"msg-queue";
const zaloChatQueue = queueService.createQueue(`${queueName}-zaloChat`);

// Get SaleForce Personalized data
router.post("/zalo", async (req, res) => {
    console.log("webhook", req.body);
    await zaloChatQueue.add('zaloChat', req.body);
  res.json({});
});

module.exports = router;
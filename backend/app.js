const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 1337;

app.use(bodyParser.json());

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {
  // Parse the request body from the POST
  let body = req.body;

  // Check the incoming webhook message
  console.log(JSON.stringify(req.body, null, 2));

  // Handle WhatsApp webhook events
  if (req.body.object) {
    // Extract necessary information from the webhook payload
    // Your logic for handling WhatsApp webhook events goes here
    // ...

    // Respond with a 200 OK status
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if the event is not from a WhatsApp API
    res.sendStatus(404);
  }
});

// Accepts GET requests at the /webhook endpoint for initial verification
app.get('/webhook', (req, res) => {
  const verify_token = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// Listen on the specified port
app.listen(PORT, () => {
  console.log(`Webhook server is listening on port ${PORT}`);
});

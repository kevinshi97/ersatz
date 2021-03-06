// https://developers.facebook.com/docs/messenger-platform/getting-started/webhook-setup


/**
 * Quick test, run the following things in cmd line
 * - curl -X GET "localhost:1337/webhook?hub.verify_token=<YOUR_VERIFY_TOKEN>&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"
 * - curl -H "Content-Type: application/json" -X POST "localhost:1337/webhook" -d "{\"object\": \"page\", \"entry\": [{\"messaging\": [{\"message\": \"TEST_MESSAGE\"}]}]}"
 */

'use strict'

// imports
const express = require('express');
const app = express();
app.use(express.json());

const backupPort = 1337

app.post('/webhook', (req, res) => {
  let body = req.body;
  if (body.object === 'page') {
    body.entry.forEach(function(entry) {
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

app.get('/webhook', (req, res) => {
  let VERIFY_TOKEN = "<YOUR_VERIFY_TOKEN>"
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);      
    }
  }
});

app.listen(process.env.PORT || backupPort, () => console.log('webhook is listening'));
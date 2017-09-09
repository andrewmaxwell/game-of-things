const WebSocket = require('ws');
const server = new WebSocket.Server({port: 8000});
server.on('connection', ws => {
  console.log('someone connected!');
  ws.on('message', data => {
    console.log('Received', data);
    server.clients.forEach(client => client.send(data));
  });
});

const express = require('express');
const app = express();
app.use(express.static('client'));
app.listen(3000, () => console.log('App listening on port 3000!'));

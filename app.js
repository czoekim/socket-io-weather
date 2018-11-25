const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const axios = require('axios');

const port = process.env.PORT || 4001;
const index = require('./routes/index');

const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIO(server);

let interval; 
io.on('connection', socket => {
  console.log('New client connected');
  if(interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 10000);
  socket.on('disconnect', () => {console.log('Client disconnected')
  });
});

const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(
      "https://api.darksky.net/forecast/94563199349ee746781bdf588dae0a36/43.7695,-11.2558"
    );
    socket.emit('FromAPI', res.data.currently.temperature)
  } catch (err) {
    console.log(`Error: $(err.code}`);
  }
};

server.listen(port, () => console.log(`listening on port ${port}`));

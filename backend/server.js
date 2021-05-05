const express = require('express');
const mongoose = require("mongoose");
const db = require('./application/config/database');
const {requireToken} = require('./application/controller/authController');
require('dotenv').config();

const port = 8098;
const app = express();

const registerAuthHandlers = require('./application/socketHandlers/authHandler');
const registerFactHandlers = require('./application/socketHandlers/factHandler');

//const http = require('http').createServer(app);
//const io = require('socket.io');

//const socket = io(http);

const http = require('http').Server(app);
const io = require('socket.io')(http, {cors: {origin: '*'}});


let clients = new Map();

mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const database = mongoose.connection;
database ? console.log("Connected to database") : console.log("Error while connecting to database");

io.on('connection', (socket) => {
//socket.on('connection', (socket) => { 
  console.log('User connected')

  socket.onAny((eventName, userData) => {
    requireToken(socket, userData, () => {
      if (!clients.has(socket.id)) {
        clients.set(socket.id, socket.userId);
        //socket.broadcast.emit('user:update', {userId: socket.userId, online: true});
      }
    })
  })

  registerAuthHandlers(io, socket, clients);
  registerFactHandlers(io, socket);

  socket.on('disconnect', () => {
    if (clients.has(socket.id)) {
      //socket.broadcast.emit('user:update', {userId: clients.get(socket.id), online: false});
      clients.delete(socket.id);
    }

    console.log(`User ${socket.id} disconnected!`)
  })
})

app.use(express.static(__dirname + "/public"));

/*
http.listen(port, () => {
    console.log("Server is running on port " + port)
});
*/


app.listen(port, () => {
    console.log("Server is running on port " + port);
});


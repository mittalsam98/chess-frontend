import { io } from 'socket.io-client';

// const URL = 'https://chess-web-online.herokuapp.com/';
const URL = 'https://purrfect-dandy-confidence.glitch.me/';

var connectionOptions = {
  withCredentials: true,
  extraHeaders: {
    'Access-Control-Allow-Headers': '*'
  },
  transports: ['websocket', 'polling', 'flashsocket']
};
const socket = io(URL, connectionOptions);
var mySocketId;

socket.on('createNewGame', (statusUpdate) => {
  mySocketId = statusUpdate.mySocketId;
});

export { socket, mySocketId };

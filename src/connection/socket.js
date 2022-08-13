import { io } from 'socket.io-client';

const URL = 'https://chess-web-online.herokuapp.com/';

const socket = io(URL);
var mySocketId;

socket.on('createNewGame', (statusUpdate) => {
  mySocketId = statusUpdate.mySocketId;
});

export { socket, mySocketId };

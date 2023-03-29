import { io } from 'socket.io-client';

// const URL = 'https://chess-web-online.herokuapp.com/';
const URL = 'https://chess-web-online.vercel.app/';

const socket = io(URL);
var mySocketId;

socket.on('createNewGame', (statusUpdate) => {
  mySocketId = statusUpdate.mySocketId;
});

export { socket, mySocketId };

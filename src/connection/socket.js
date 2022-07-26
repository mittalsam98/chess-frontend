import { io } from "socket.io-client";

const URL='https://chess-web-online.herokuapp.com/';

const socket=io(URL);
var mySocketId
console.log('dfas');

socket.on("createNewGame", statusUpdate => {
    console.log("A new game has been created! Username: " + statusUpdate.userName + ", Game id: " + statusUpdate.gameId + " Socket id: " + statusUpdate.mySocketId)
    mySocketId = statusUpdate.mySocketId
})

export  { socket, mySocketId}
import { io } from "socket.io-client";

const URL='http://localhost:5000/';

const socket=io(URL);
var mySocketId
console.log('dfas');

socket.on("createNewGame", statusUpdate => {
    console.log("A new gamye has been created! Username: " + statusUpdate.userName + ", Game id: " + statusUpdate.gameId + " Socket id: " + statusUpdate.mySocketId)
    mySocketId = statusUpdate.mySocketId
})

export  { socket, mySocketId}
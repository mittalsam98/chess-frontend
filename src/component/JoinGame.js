import React,{useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {socket} from '../connection/socket';

const JoinGameRoom = (gameid, userName, isCreator) => {
    /**
     * For this browser instance, we want 
     * to join it to a gameRoom. For now
     * assume that the game room exists 
     * on the backend. 
     *  
     * 
     * TODO: handle the case when the game room doesn't exist. 
     */
    const idData = {
        gameId : gameid,
        userName : userName,
        isCreator: isCreator
    }

    useEffect(() => {
        socket.emit("playerJoinsGame", idData)
    },[])
}
  

const JoinGame = ({userName,gameCreater}) => {
    const {gameId} = useParams();


    // console.log('In Join Game rendered',gameId);
    
    
    JoinGameRoom(gameId, userName, gameCreater)
    // console.log('In JoinGame rendered 2');

    return (
        <>
        <h1 style = {{textAlign: "center"}}>Welcome to Play Chess Online!</h1>
        <h3 style = {{textAlign: "center"}}></h3>
        </>
    );
}
 

export default JoinGame;
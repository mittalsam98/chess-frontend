import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../connection/socket';

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
    gameId: gameid,
    userName: userName,
    isCreator: isCreator
  };

  useEffect(() => {
    socket.emit('playerJoinsGame', idData);
  }, []);
};

const JoinGame = ({ userName, gameCreater }) => {
  const { gameId } = useParams();

  JoinGameRoom(gameId, userName, gameCreater);

  return (
    <>
      <h1
        style={{
          textAlign: 'center',
          color: '#fff',
          marginBlockStart: '0px',
          marginBlockEnd: '0px',
          padding: '35px'
        }}
      >
        Welcome to Play Chess Online!
      </h1>
    </>
  );
};

export default JoinGame;

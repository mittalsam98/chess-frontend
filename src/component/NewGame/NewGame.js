import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { socket } from '../../connection/socket';

const useStyles = makeStyles((theme) => ({
  turnBox: {
    color: 'white',
    backgroundColor: '#6C9D40',
    padding: '5px',
    margin: '20px 60px',
    textAlign: 'center'
  }
}));
export default function NewGame(props) {
  const classes = useStyles();
  const { opponentTurn, orientationColor, opponentUserName, myUserName } = props;
  const startNewGame = () => {
    socket.emit('newGame', { gameId: props.gameId });
  };

  return (
    <div className={classes.turnBox} onClick={startNewGame}>
      <h1>Start New Game</h1>
    </div>
  );
}

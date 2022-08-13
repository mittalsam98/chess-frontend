import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  infoContainer: {
    color: 'white',
  },
  turnBox: {
    backgroundColor: '#6C9D40',
    padding: '5px',
    margin: '20px 60px',
    textAlign: 'center'
  },
  paraContainer: {
    background: '#000',
    padding: '30px 50px',
    fontSize: '20px',
    margin: '20px 10px'
  }
}));
export default function GameInfo(props) {
  const classes = useStyles();

  const { opponentTurn, orientationColor, opponentUserName, myUserName } = props;
  return (
    <div className={classes.infoContainer}>
      <div className={classes.turnBox}>
        <h1>
          {(opponentTurn === 'w' && orientationColor === 'white') ||
          (opponentTurn === 'b' && orientationColor === 'black')
            ? `Your's Turn`
            : `Opponent's Turn`}
        </h1>
      </div>
      <div>
        <p className={classes.paraContainer}> Your Username: {myUserName} </p>
        <p className={classes.paraContainer}> Opponent Username: {opponentUserName} </p>
      </div>
    </div>
  );
}

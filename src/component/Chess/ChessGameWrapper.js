import React, { useState, useEffect, useContext } from 'react';
import Chessboard from 'chessboardjsx';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import ChessGame from './ChessGame';
import VideoCall from '../Video/VideoChat';
import UserContext from '../../context/userContext';
import { socket } from '../../connection/socket';
import './ChessGame.css';
import Button from '@material-ui/core/Button';
import { Grid, Tab, Tabs } from '@material-ui/core';
import PhoneIcon from '@mui/icons-material/Phone';
import Add from '@mui/icons-material/Add';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import Games from '@mui/icons-material/Games';
import GameInfo from '../GameInfo/GameInfo';
import NewGame from '../NewGame/NewGame';

const useStyles = makeStyles((theme) => ({
  tab: {
    color: '#ffffff',
    fontSize: '12px',
    height: '100%'
  },
  tabItemContainer: {
    background: 'none'
  },
  boxContainer: {
    display: 'flex',
    margin: '100px 30px'
  },
  chessContainer: {
    // marginLeft: '3%'
  },
  sideContainer: {
    // marginLeft: '10%',
    width: '90%',

    padding: '25px 25px 0px 25px',
    background: '#1F1E1B'
  }
}));

const ChessGameWrapper = (props) => {
  const userContext = React.useContext(UserContext);
  const { gameId } = useParams();
  const classes = useStyles();
  const [opponentSocketId, setOpponentSocketId] = React.useState('');
  const [opponentDidJoinTheGame, didJoinGame] = React.useState(false);
  const [opponentUserName, setUserName] = React.useState('');
  const [gameSessionDoesNotExist, doesntExist] = React.useState(false);
  const [orientationColor, setOrientationColor] = useState('');
  const [toggleVideoContainer, setToggleVideoContainer] = useState(true);
  const [buttonText, setButtonText] = useState('');
  const [opponentTurn, setOpponentTurn] = useState('w');

  const [value, setValue] = React.useState(0);

  function toggleVideo() {
    setToggleVideoContainer(!toggleVideoContainer);
  }

  useEffect(() => {
    setButtonText(toggleVideoContainer ? 'Hide Video' : 'Show Video');
  }, [toggleVideoContainer]);

  useEffect(() => {
    socket.on('playerJoinedRoom', (statusUpdate) => {
      setOrientationColor(
        userContext.gameCreater
          ? userContext.orientationColor
          : statusUpdate.orientationColor === 'white'
          ? 'black'
          : 'white'
      );
      if (socket.id !== statusUpdate.mySocketId) {
        setOpponentSocketId(statusUpdate.mySocketId);
      }
    });

    socket.on('status', (statusUpdate) => {
      alert(statusUpdate);
      if (
        statusUpdate === 'This game session does not exist.' ||
        statusUpdate === 'There are already 2 people playing in this room.'
      ) {
        doesntExist(true);
      }
    });

    socket.on('start game', (idData) => {
      // console.log('start game  ' + idData.userName + props.userName);
      if (idData.userName !== props.myUserName) {
        setUserName(idData.userName);
        didJoinGame(true);
      } else {
        // in chessGame, pass opponentUserName as a prop and label it as the enemy.
        // in chessGame, use reactContext to get your own userName
        // socket.emit('myUserName')
        socket.emit('request username', gameId);
      }
    });

    socket.on('give userName', (socketId) => {
      if (socket.id !== socketId) {
        socket.emit('recieved userName', { userName: props.myUserName, gameId: gameId });
      }
    });

    socket.on('get Opponent UserName', (data) => {
      if (socket.id !== data.socketId) {
        setUserName(data.userName);
        setOpponentSocketId(data.socketId);
        didJoinGame(true);
      }
    });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const renderTab = (val) => {
    switch (val) {
      case 0:
        return (
          <GameInfo
            opponentUserName={opponentUserName}
            myUserName={props.myUserName}
            opponentTurn={opponentTurn}
            orientationColor={orientationColor}
          />
        );
      case 1:
        return <NewGame gameId={gameId} />;
      case 2:
        return (
          <VideoCall
            toggleVideoContainer={toggleVideoContainer}
            mySocketId={socket.id}
            opponentSocketId={opponentSocketId}
            myUserName={props.myUserName}
            opponentUserName={opponentUserName}
          />
        );
    }
  };

  return (
    <div>
      {opponentDidJoinTheGame ? (
        // <div className={classes.boxContainer}>
        <Grid container>
          <Grid item xs={0} sm={0} md={1}></Grid>
          <Grid item xs={12} sm={12} md={5}>
            <ChessGame
              orientationColor={orientationColor}
              gameId={gameId}
              gameCreater={userContext.gameCreater}
              setOpponentTurn={setOpponentTurn}
              opponentTurn={opponentTurn}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} container>
            <div className={classes.sideContainer}>
              <Tabs value={value} onChange={handleChange} aria-label='icon position tabs example'>
                <Tab icon={<Games />} className={classes.tab} label='Game' />
                <Tab icon={<Add />} className={classes.tab} label='NewGame' />
                {/* <Tab icon={<PhoneIcon />} className={classes.tab} label='Call' /> */}
              </Tabs>
              {renderTab(value)}
            </div>
          </Grid>
          <Grid item xs={1} sm={12} md={2}></Grid>
        </Grid>
      ) : // </div>
      gameSessionDoesNotExist ? (
        <div>
          <h1 style={{ textAlign: 'center', marginTop: '200px' }}> :( </h1>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              textAlign: 'center',
              marginTop: String(window.innerHeight / 8) + 'px',
              marginLeft: '30px',
              marginRight: '30px',
              color: '#fff'
            }}
          >
            Hey <strong style={{ textDecoration: 'underline' }}>{props.myUserName}</strong>, just
            copy and paste the below URL below and send it to your friend to play chess online:
          </h1>
          <textarea
            style={{ textAlign: 'center', height: '40px', width: '500px', fontSize: '17px' }}
            onFocus={(event) => {
              event.target.select();
            }}
            value={`${window.location.origin}/game/` + gameId}
            type='text'
          ></textarea>
          <br></br>
          <h1 style={{ textAlign: 'center', marginTop: '100px', color: '#fff' }}>
            {' '}
            Waiting for other opponent to join the game...{' '}
          </h1>
        </div>
      )}
    </div>
  );
};

export default ChessGameWrapper;

import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Img from './pawn.png';
import Typography from '@material-ui/core/Typography';

import OnBoard from './component/Onboard/onBoard';
import JoinRoom from './component/JoinRoom.js';
import JoinGame from './component/JoinGame.js';
import UserContext from './context/userContext';
import ChessGameWrapper from './component/Chess/ChessGameWrapper';
import Confetti from 'react-confetti';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: '#6C9D40'
  },
  root: {
    flexGrow: 1
  },
  logo: {
    maxWidth: 50,
    background: 'transparent'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

function App() {
  const classes = useStyles();

  const [didRedirect, setDidRedirect] = useState(false);
  const [gameCreater, setGameCreater] = useState(false);
  const [winMatch, setWinMatch] = useState(false);
  const [orientationColor, setOrientationColor] = useState('white');
  const [userName, setUserName] = useState('');
  return (
    <UserContext.Provider
      value={{
        didRedirect: didRedirect,
        gameCreater: gameCreater,
        orientationColor: orientationColor,
        setOrientationColor,
        setUserName,
        setGameCreater,
        setDidRedirect,
        setWinMatch
      }}
    >
      <Router>
        <AppBar position='static' className={classes.appbar}>
          <ToastContainer />

          <Toolbar>
            {winMatch ? <Confetti /> : null}

            <IconButton
              edge='start'
              className={classes.menuButton}
              color='inherit'
              aria-label='menu'
            >
              <img src={Img} alt='logo' className={classes.logo} />
            </IconButton>
            <Typography variant='h6' className={classes.title}>
              Play Chess Online
            </Typography>
            {/* <Button color="inherit"></Button> */}
          </Toolbar>
        </AppBar>
        <Switch>
          <Route path='/' exact component={OnBoard} />
          {/* <Route path="/" exact component={ChessBoard} /> */}
          <Route path='/game/:gameId'>
            {didRedirect ? (
              <div style={{ background: '#312E2B', height: '100vh' }}>
                <JoinGame userName={userName} gameCreater={gameCreater} />
                <ChessGameWrapper myUserName={userName} />
              </div>
            ) : (
              <JoinRoom />
            )}
          </Route>
          <Redirect to='/'></Redirect>
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;

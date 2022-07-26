import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Img from './pawn.png'
import Typography from '@material-ui/core/Typography';

import OnBoard from './component/Onboard/onBoard';
import JoinRoom from './component/JoinRoom.js';
import JoinGame from './component/JoinGame.js';
import UserContext from "./context/userContext"
import ChessGameWrapper from './component/Chess/ChessGameWrapper';

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: '#6C9D40',
  },
  root: {
    flexGrow: 1,
  },
  logo: {
    maxWidth: 50,
    background: 'transparent',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  }
}));


function App() {

  const classes = useStyles();

  const [didRedirect, setDidRedirect] = useState(false);
  const [gameCreater, setGameCreater] = useState(false);
  const [orientationColor, setOrientationColor] = useState('white');
  const [userName, setUserName] = useState('');
  console.log('In App.js rendered', didRedirect, gameCreater, userName, orientationColor);
  return (
    <UserContext.Provider value={{ didRedirect: didRedirect, gameCreater: gameCreater, orientationColor: orientationColor, setOrientationColor, setUserName, setGameCreater, setDidRedirect }}>
      <Router>
        <AppBar position="static" className={classes.appbar}>
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <img src={Img} alt="logo" className={classes.logo} />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Play Chess Online
                  </Typography>
            {/* <Button color="inherit"></Button> */}
          </Toolbar>
        </AppBar>
        <Switch>
          <Route path="/" exact component={OnBoard} />
          {/* <Route path="/" exact component={ChessBoard} /> */}
          {console.log(didRedirect)}
          <Route path='/game/:gameId'>
            {
              didRedirect ?
                <>
                  <JoinGame userName={userName} gameCreater={gameCreater} />
                  <ChessGameWrapper myUserName={userName} />
                </>
                :
                <JoinRoom />
            }
          </Route>
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;

import React, { useState, useContext } from 'react';
import { Redirect, useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ChessGame from './Chess/ChessGame';
import UserContext from '../context/userContext';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const JoinRoom = () => {
  const [userName, setUserName] = useState('');
  const [didGetUserName, setDidSetUserName] = useState(false);
  const params = useParams();
  const userContext = useContext(UserContext);

  const classes = useStyles();

  function send() {
    setDidSetUserName(true);
    userContext.setDidRedirect(true);
    userContext.setGameCreater(false);
    userContext.setUserName(userName);
  }
  const onChange = (e) => {
    e.preventDefault();
    setUserName(e.target.value);
  };

  return (
    <>
      <Container component='main' maxWidth='xs'>
        {didGetUserName ? (
          <Redirect to={'/game/' + params.gameId}>
            <button>ssss</button>
          </Redirect>
        ) : (
          <div className={classes.paper}>
            <TextField
              variant='outlined'
              margin='normal'
              required
              onChange={onChange}
              value={userName}
              fullWidth
              id='name'
              label='Username'
              name='username'
              autoFocus
            />
            <Button
              type='submit'
              fullWidth
              disabled={!(userName.length > 0)}
              variant='contained'
              color='primary'
              className={classes.submit}
              onClick={send}
            >
              Submit
            </Button>
          </div>
        )}
      </Container>
    </>
  );
};

export default JoinRoom;

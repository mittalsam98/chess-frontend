import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { v4 as uuidv4 } from 'uuid';
import { socket } from '../../connection/socket';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Img from '../../pawn.png';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import UserContext from '../../context/userContext';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';

// import MenuIcon from '@material-ui/icons/Menu';
import home from '../../home.png';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import SimpleDialog from '../Modal/Modal';

const useStyles = makeStyles((theme) => ({
  container: {
    // backgroundColor: '#312E2B',
    // height: '100vh',
    verticalAlign: 'center',
    // color: 'white',
    width: '100vw'
  },

  paper: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginTop: '8rem'
    }
    // alignContent: 'center',
    // height: '100%',
    // alignItems: 'center',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      width: '33%'
    }
  },
  card: {
    // maxWidth: 300,
    padding: '15px 35px 25px 35px',
    margin: 'auto',
    transition: '0.3s',
    boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
    '&:hover': {
      boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.3)'
    }
  },
  content: {
    textAlign: 'left',
    padding: theme.spacing.unit * 3
  },
  divider: {
    margin: `${theme.spacing.unit * 3}px 0`
  },
  imgFlex: {
    width: '90%',
    heigth: '90%',
    [theme.breakpoints.up('md')]: {
      width: '43%'
    }
  },
  imgItem: {
    // objectFit: 'contain',
    marginTop: '3rem',
    width: '99%'
  },
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
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    alignSelf: 'center'
  }
}));

const OnBoard = () => {
  const [gameId, setGameId] = useState('');
  const [userName, setUserName] = useState('');
  const [didGetUserName, setDidSetUserName] = useState(false);
  // const [color, setColor] = React.useState('White');

  const userContext = useContext(UserContext);
  const classes = useStyles();

  function send() {
    const newGameId = uuidv4();
    const data = {
      gameId: newGameId,
      userName: userName,
      orientationColor: userContext.orientationColor
    };
    userContext.setDidRedirect(true);
    userContext.setGameCreater(true);
    userContext.setUserName(userName);
    setGameId(newGameId);
    setDidSetUserName(true);
    socket.emit('createNewGame', data);
  }

  const onChange = (e) => {
    e.preventDefault();
    setUserName(e.target.value);
  };

  const colorSelect = (event) => {
    userContext.setOrientationColor(event.target.value);
  };

  return (
    <div className={classes.container} component='main' maxWidth='xs'>
      {didGetUserName ? (
        <Redirect to={'/game/' + gameId}>
          <button>ssss</button>
        </Redirect>
      ) : (
        <div style={{ height: '100%' }}>
          <div className={classes.paper}>
            <div className={classes.imgFlex}>
              <img src={home} alt='logo' className={classes.imgItem} />
            </div>
            <div className={classes.inputContainer}>
              <Card className={classes.card}>
                <CardContent className={classes.content}>
                  <Typography className={'MuiTypography--heading'} variant={'h6'} gutterBottom>
                    Enter username
                  </Typography>

                  <Divider className={classes.divider} light />
                  <TextField
                    variant='outlined'
                    margin='normal'
                    required
                    onChange={onChange}
                    value={userName}
                    id='name'
                    fullWidth
                    label='Username'
                    name='username'
                    autoFocus
                  />
                  <Button
                    type='submit'
                    fullWidth
                    disabled={!(userName.length > 0)}
                    variant='contained'
                    color='success'
                    className={classes.submit}
                    onClick={send}
                  >
                    Submit
                  </Button>
                  <Divider className={classes.divider} light />
                  <FormControl component='fieldset' fullWidth className={classes.self}>
                    <FormLabel component='legend'>Select Your Color</FormLabel>
                    <RadioGroup aria-label='color' name='color' onChange={colorSelect}>
                      <FormControlLabel value='white' control={<Radio />} label='White' />
                      <FormControlLabel value='black' control={<Radio />} label='Black' />
                    </RadioGroup>
                  </FormControl>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnBoard;

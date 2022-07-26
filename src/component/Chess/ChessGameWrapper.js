import React, { useState, useEffect, useContext } from 'react';
import Chessboard from 'chessboardjsx'
import Chess from 'chess.js'
import { useParams } from 'react-router-dom';
import ChessGame from './ChessGame';
import VideoCall from '../Video/VideoChat';
import UserContext from '../../context/userContext';
import { socket } from '../../connection/socket';
import './ChessGame.css';
import Button from '@material-ui/core/Button';


const ChessGameWrapper = (props) => {

    const userContext = React.useContext(UserContext)
    const { gameId } = useParams()
    // const [play] = useSound(chessMove);
    const [opponentSocketId, setOpponentSocketId] = React.useState('')
    const [opponentDidJoinTheGame, didJoinGame] = React.useState(false)
    const [opponentUserName, setUserName] = React.useState('')
    const [gameSessionDoesNotExist, doesntExist] = React.useState(false)
    const [orientationColor, setOrientationColor] = useState('');
    const [toggleVideoContainer, setToggleVideoContainer] = useState(true);
    const [buttonText, setButtonText] = useState('');
    const [opponentTurn,setOpponentTurn] = useState('w');


    function toggleVideo() {
        setToggleVideoContainer(!toggleVideoContainer);

    }

    useEffect(() => {
        setButtonText(toggleVideoContainer ? 'Hide Video' : 'Show Video')
    }, [toggleVideoContainer])

    console.log('In Game Wrapper test '+socket.id+" "+opponentUserName+"  "+opponentDidJoinTheGame+"  "+opponentSocketId);

    useEffect(() => {


        socket.on("playerJoinedRoom", statusUpdate => {
            console.log("Orientation Color  " + statusUpdate.mySocketId+"  "+socket.id);
            setOrientationColor(userContext.gameCreater ? userContext.orientationColor : (statusUpdate.orientationColor === 'white' ? 'black' : 'white'))
            if (socket.id !== statusUpdate.mySocketId) {
                setOpponentSocketId(statusUpdate.mySocketId)
            }
        })

        socket.on("status", statusUpdate => {
            console.log('status'+statusUpdate)
            alert(statusUpdate)
            if (statusUpdate === 'This game session does not exist.' || statusUpdate === 'There are already 2 people playing in this room.') {
                doesntExist(true)
            }
        })


        socket.on('start game', (idData) => {
            console.log("start game  " +idData.userName +props.userName );
            if (idData.userName !== props.myUserName) {
                setUserName(idData.userName)
                didJoinGame(true)
            } else {
                // in chessGame, pass opponentUserName as a prop and label it as the enemy. 
                // in chessGame, use reactContext to get your own userName
                // socket.emit('myUserName')
                socket.emit('request username', gameId)
            }
        })


        socket.on('give userName', (socketId) => {
            if (socket.id !== socketId) {
                socket.emit('recieved userName', { userName: props.myUserName, gameId: gameId })
            }
        })

        socket.on('get Opponent UserName', (data) => {
            if (socket.id !== data.socketId) {
                setUserName(data.userName)
                setOpponentSocketId(data.socketId)
                didJoinGame(true)
            }
        })

    }, [])



    return (
    <div>
    {    opponentDidJoinTheGame ? (
            <>
            <div style={{ textAlign: 'right', marginRight: '50px' }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={toggleVideo}>
                        {buttonText}
                </Button>
            </div>
                        <div className="heading-container">
                        <div>
                        <h4> {((opponentTurn === 'w' && orientationColor==='white') || (opponentTurn === 'b' && orientationColor==='black')) ? `Your's Turn` : `Opponent's Turn`} </h4>
                        </div>
                        <div>
                        <h4> Opponent Username: {opponentUserName} </h4>
                        </div>
                        </div>
            <div className="flex-container">
                <div>
                        <ChessGame orientationColor={orientationColor} gameId={gameId} gameCreater={userContext.gameCreater} setOpponentTurn={setOpponentTurn}/>
                </div>
                <div className='video-container'>
                    <VideoCall 
                    toggleVideoContainer={toggleVideoContainer}
                    mySocketId={socket.id}
                    opponentSocketId={opponentSocketId}
                    myUserName={props.myUserName}
                    opponentUserName={opponentUserName}
                    />
                </div>
            </div>
            </>
            ) : gameSessionDoesNotExist ? (
          <div>
            <h1 style={{ textAlign: "center", marginTop: "200px" }}> :( </h1>
          </div>
        ) : (   
          <div   style={{textAlign: "center"}}>
            <h1
              style={{
                textAlign: "center",
                marginTop: String(window.innerHeight / 8) + "px",
                marginLeft:'30px',
                marginRight:'30px',
              }}>
              Hey <strong style={{textDecoration: "underline"}}>{props.myUserName}</strong>, just copy and paste the below URL
              below and send it to your friend to play chess online:
            </h1>
            <textarea
                style={{ textAlign:'center' ,  height: "30px", width:"500px" }}
                onFocus={(event) => {
                    event.target.select()
                }}
                value = { "http://localhost:3000/game/" + gameId}
                type = "text">
              </textarea>
            <br></br>
            <h1 style={{ textAlign: "center", marginTop: "100px" }}>
              {" "}
              Waiting for other opponent to join the game...{" "}
            </h1>
          </div>
         )

    }
    </div>
    );
}

export default ChessGameWrapper;

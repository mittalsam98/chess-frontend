import React, { useState, useEffect, useContext } from 'react';
import Chessboard from 'chessboardjsx'
import Chess from 'chess.js'
import { socket } from '../../connection/socket';
import { store } from 'react-notifications-component';


const ChessGame = (props) => {

    const [fenString, setFenString] = useState('start')
    const [chess, setChess] = useState(null);
    // const [boardRotation.setBoardRotation] = useState(1)


    useEffect(() => {
        socket.on('opponent move', newMove => {
            console.log('In Chessgame useeffect ', newMove.turn);
            // move == [pieceId, finalPosition]
            setFenString(newMove.fen);
            setChess(new Chess(newMove.fen))
            props.setOpponentTurn(newMove.turn);

            // setChess(newMove.move);
            // chess.move(newMove.move)
        })
    }, []);

    console.log('In chessGame Rendered');

    useEffect(() => {
        setChess(new Chess());
    }, []);


    const onDrop = ({ sourceSquare, targetSquare }) => {
        let move = chess.move({ from: sourceSquare, to: targetSquare, promotion: "q" })
        if (move === null) {
            return;
        }
        else {
            console.log(chess.turn(), move, props.gameCreater);
        if((props.orientationColor === 'white' && move.color === 'w') || (props.orientationColor === 'black' && move.color === 'b')){
            socket.emit('new move', {
                gameId: props.gameId,
                move: move,
                turn:chess.turn(),
                fen: chess.fen()
            })
        }
        else{
            store.addNotification({
                title: "Careful!",
                message: "Wrong Move",
                type: "danger",
                insert: "top",
                container: "bottom-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 1000,
                }
              });
         }
        }
    }



    return (
        <Chessboard
            position={fenString}
            onDrop={onDrop}
            orientation={props.orientationColor}
        />
    );
}

export default ChessGame;

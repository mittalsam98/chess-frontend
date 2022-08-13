import React, { useState, useEffect, useContext } from 'react';
import Chessboard from 'chessboardjsx';
import Chess from 'chess.js';
import { socket } from '../../connection/socket';
import SimpleDialog from '../Modal/Modal';
import UserContext from '../../context/userContext';
import { ToastContainer, toast } from 'react-toastify';

const ChessGame = (props) => {
  const [fenString, setFenString] = useState('start');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [chess, setChess] = useState(null);
  const [open, setOpen] = React.useState(false);
  const userContext = useContext(UserContext);

  const modalValues = (open) => {
    if (
      (props.opponentTurn === 'w' && props.orientationColor === 'white') ||
      (props.opponentTurn === 'b' && props.orientationColor === 'black')
    ) {
      setOpen(open);
      setTitle('Hurray!');
      userContext.setWinMatch(true);
      setContent('Hurray, Congratulations you won the match');
    } else {
      setOpen(open);
      setTitle('Better Luck next time');
      setContent('Opponent won the match');
      userContext.setWinMatch(false);
    }
  };

  useEffect(() => {
    socket.on('opponent move', (newMove) => {
      // console.log('In Chessgame useeffect ', newMove);
      if (newMove.gameOver) {
        modalValues(newMove.gameOver);
      }
      setFenString(newMove.fen);
      setChess(new Chess(newMove.fen));
      props.setOpponentTurn(newMove.turn);
    });
    socket.on('newGame', (data) => {
      toast.info('New game has been started', {
        position: 'bottom-center',
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      setFenString('start');
      setOpen(false);
      setChess(new Chess());
    });
  }, []);

  // console.log('In chessGame Rendered');

  useEffect(() => {
    setChess(new Chess());
  }, []);

  const handleClose = (value) => {
    setOpen(false);
    userContext.setWinMatch(false);
  };

  const onDrop = ({ sourceSquare, targetSquare }) => {
    let move = chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
    // console.log('ondrop out', chess.turn(), chess.game_over(), move, props.gameCreater);

    if (move === null) {
      return;
    } else if (chess.game_over()) {
      modalValues(chess.game_over());
      // console.log('fdsfdasfasafsad', chess.turn(), chess.game_over(), move, props.gameCreater);
      socket.emit('new move', {
        gameId: props.gameId,
        move: move,
        turn: chess.turn(),
        fen: chess.fen(),
        gameOver: chess.game_over()
      });
      return;
    } else {
      // console.log('fdsafsad', chess.turn(), chess.game_over(), move, props.gameCreater);
      if (
        (props.orientationColor === 'white' && move.color === 'w') ||
        (props.orientationColor === 'black' && move.color === 'b')
      ) {
        socket.emit('new move', {
          gameId: props.gameId,
          move: move,
          turn: chess.turn(),
          fen: chess.fen(),
          gameOver: chess.game_over()
        });
      } else {
        toast.error('🦄 Carefully Wrong Move', {
          position: 'bottom-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
      }
    }
  };

  return (
    <>
      <SimpleDialog open={open} onClose={handleClose} title={title} content={content} />
      <Chessboard position={fenString} onDrop={onDrop} orientation={props.orientationColor} />;
    </>
  );
};

export default ChessGame;

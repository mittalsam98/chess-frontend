import React, { useEffect, useState, useRef } from 'react';
import Peer from 'simple-peer';
import { socket } from '../../connection/socket';

export default function VideoCall(props) {
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const userVideo = useRef();
  const opponentVideo = useRef();
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream) => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    socket.on('hey', (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, []);

  function callPeer(id) {
    setIsCalling(true);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: props.mySocketId });
    });

    peer.on('stream', (stream) => {
      if (opponentVideo.current) {
        opponentVideo.current.srcObject = stream;
      }
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
  }

  function acceptCall() {
    setCallAccepted(true);
    setIsCalling(false);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    });
    peer.on('signal', (data) => {
      socket.emit('acceptCall', { signal: data, to: caller });
    });

    peer.on('stream', (stream) => {
      opponentVideo.current.srcObject = stream;
    });
    peer.on('close', () => {});

    peer.signal(callerSignal);
  }

  let user_video;

  if (stream) {
    user_video = <video style={{ border: '1px solid blue' }} ref={userVideo} autoPlay></video>;
  }

  let mainView;

  if (callAccepted) {
    mainView = <video style={{ border: '1px solid blue' }} ref={opponentVideo} autoPlay></video>;
  } else if (receivingCall) {
    mainView = (
      <div>
        <h1 style={{ color: '#fff' }}>{props.opponentUserName} is calling you</h1>
        <button onClick={acceptCall}>
          <h1>Accept</h1>
        </button>
      </div>
    );
  } else if (isCalling) {
    mainView = (
      <div>
        <h1 style={{ color: '#fff' }}>Currently calling {props.opponentUserName}...</h1>
      </div>
    );
  } else {
    mainView = (
      <button
        onClick={() => {
          callPeer(props.opponentSocketId);
        }}
      >
        <h1>Chat with your friend while you play!</h1>
      </button>
    );
  }

  return (
    <div style={{ visibility: props.toggleVideoContainer ? 'visible' : 'hidden' }}>
      <div>{mainView}</div>
      <div>{user_video}</div>
    </div>
  );
}

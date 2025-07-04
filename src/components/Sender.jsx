import { useEffect, useState } from "react";

export const Sender = () => {
  const [socket, setSocket] = useState(null);
  const [pc, setPC] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080/signal');
    setSocket(socket);

    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: 'sender'
      }));
    };
  }, []);

  const initiateConn = async () => {
    if (!socket) {
      alert("Socket not found");
      return;
    }

    // Set up peer connection
    const peerConnection = new RTCPeerConnection();
    setPC(peerConnection);

    // Handle incoming messages
    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'createAnswer') {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp));
      } else if (message.type === 'iceCandidate') {
        await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
      }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(JSON.stringify({
          type: 'iceCandidate',
          candidate: event.candidate
        }));
      }
    };

    // Create offer on negotiation
    peerConnection.onnegotiationneeded = async () => {
      console.log("onnegotiationneeded");
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.send(JSON.stringify({
        type: 'createOffer',
        sdp: peerConnection.localDescription
      }));
    };

    getCameraStreamAndSend(peerConnection);
  };

  const getCameraStreamAndSend = (peerConnection) => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.muted = true;
      video.playsInline = true;
      document.body.appendChild(video);

      stream.getTracks().forEach((track) => {
        console.log("track added");
        peerConnection.addTrack(track, stream);
      });
    }).catch(err => {
      console.error("Error accessing media devices:", err);
    });
  };

  return (
    <div>
      <h2>Clarity Cast</h2>
      <button onClick={initiateConn}>Create Call</button>
    </div>
  );
};

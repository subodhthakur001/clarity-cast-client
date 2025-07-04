import { useEffect, useRef } from "react";

export const Receiver = () => {
    const videoRef = useRef(null);
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080/signal');

    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: 'receiver'
      }));
    };

    startReceiving(socket);
  }, []);

  function startReceiving(socket) {
    const pc = new RTCPeerConnection();

    pc.ontrack = (event) => {
      console.log("Received track event:", event);
      // If you want the full stream, use event.streams[0] instead
      if (event.streams && event.streams[0]) {
    videoRef.current.srcObject = event.streams[0];
  }
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'createOffer') {
        pc.setRemoteDescription(new RTCSessionDescription(message.sdp)).then(() => {
          return pc.createAnswer();
        }).then((answer) => {
          return pc.setLocalDescription(answer).then(() => {
            socket.send(JSON.stringify({
              type: 'createAnswer',
              sdp: answer
            }));
          });
        }).catch((err) => {
          console.error("Error handling offer/answer:", err);
        });

      } else if (message.type === 'iceCandidate') {
        pc.addIceCandidate(new RTCIceCandidate(message.candidate)).catch((err) => {
          console.error("Failed to add ICE candidate:", err);
        });
      }
    };
  }

  return <div>
    <h1>Receiver</h1>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: '600px', border: '2px solid #333', borderRadius: '8px' }}
      />
    </div>
};

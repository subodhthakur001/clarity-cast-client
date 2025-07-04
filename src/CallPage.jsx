// CallPage.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

// ... (iceServers and global polyfill - keep these in this file for now) ...

function CallPage() {
  const { roomId } = useParams(); // Get roomId from URL
  const [searchParams] = useSearchParams(); // Get query parameters
  const role = searchParams.get('role'); // 'sender' or 'receiver'

  // ... (All your existing state and useRef variables from App.jsx) ...
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const stompClientRef = useRef(null);
  const sessionIdRef = useRef(null);
  const navigate = useNavigate(); // For redirection if needed

  // ... (All your useCallback functions: sendSignalingMessage, getLocalMedia,
  //      connectToSignalingServer, createPeerConnection, handleSignalingMessage) ...
  //      Make sure to pass `roomId` from `useParams()` to your functions as needed.

  // The main connection handler (similar to App.jsx's handleConnect)
  const handleConnect = useCallback(async () => {
    try {
      const stream = await getLocalMedia();
      if (!stream) {
        console.error("Failed to get local media, aborting connection.");
        return;
      }
      const currentSessionId = await connectToSignalingServer(); // Assuming connectToSignalingServer returns sessionId now
      if (!currentSessionId) {
          console.error("Failed to get session ID, aborting offer.");
          return;
      }
      const pc = createPeerConnection(stream); 

      if (pc) {
          // This logic for sending initial offer is good here.
          if (pc.signalingState === 'stable' && !pc.localDescription) {
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              console.log('Initial offer created and sent.');
              sendSignalingMessage({ type: 'offer', roomId: roomId, sdp: offer.sdp }, currentSessionId);
          } else {
              console.log('Signaling state is not stable or local description already exists, not sending initial offer.');
          }
      } else {
          console.warn("Peer connection not ready, cannot send initial offer.");
      }

    } catch (error) {
      console.error("Error during connection process:", error);
      alert("Failed to connect to the call. See console for details.");
    }
  }, [getLocalMedia, connectToSignalingServer, createPeerConnection, roomId, sendSignalingMessage]);


  // Effect to initiate connection when component mounts or role/roomId changes
  useEffect(() => {
    if (roomId && role && !isConnected) {
      handleConnect();
    }
    // Cleanup on unmount
    return () => {
      // Add your disconnection logic here if needed
      // e.g., handleDisconnect(); but be careful with async cleanup
    };
  }, [roomId, role, isConnected, handleConnect]);

  const handleDisconnect = () => { /* ... existing logic ... */ };

  // Conditional Rendering based on role
  return (
    <div className="call-page">
      <h1>Call in Room: {roomId}</h1>
      <p>Your Role: {role}</p>

      {/* Common UI elements */}
      <div className="controls">
        <button onClick={handleDisconnect} disabled={!isConnected}>Leave Call</button>
      </div>

      <div className="video-container">
        <div className="video-feed">
          <h2>Local Video ({sessionIdRef.current || 'Not Connected'})</h2>
          <video ref={localVideoRef} autoPlay playsInline muted></video>
        </div>
        <div className="video-feed">
          <h2>Remote Video</h2>
          <video ref={remoteVideoRef} autoPlay playsInline></video>
        </div>
      </div>

      {/* Render specific views based on role */}
      {role === 'sender' && (
        <SenderView
          localStream={localStream}
          remoteStream={remoteStream}
          sessionId={sessionIdRef.current}
          messages={messages}
          sendSignalingMessage={sendSignalingMessage}
          // Pass any other props needed for sender-specific controls
        />
      )}

      {role === 'receiver' && (
        <ReceiverView
          localStream={localStream}
          remoteStream={remoteStream}
          sessionId={sessionIdRef.current}
          messages={messages}
          sendSignalingMessage={sendSignalingMessage}
          // Pass any other props needed for receiver-specific controls
        />
      )}

      <div className="messages">
        <h2>Signaling Log</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CallPage;
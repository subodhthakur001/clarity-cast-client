import React, { useState } from 'react';
import JitsiMeetComponent from './components/JitsiMeetComponent';


const App = () => {
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const [startCall, setStartCall] = useState(false);

  const handleJoin = () => {
    if (roomName && userName) {
      setStartCall(true);
    } else {
      alert("Please enter both room name and user name");
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      {!startCall ? (
        <>
          <h2>Join Jitsi Meet Room</h2>
          <input
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <input
            placeholder="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <br /><br />
          <button onClick={handleJoin}>Join Room</button>
        </>
      ) : (
        <JitsiMeetComponent roomName={roomName} userName={userName} />
      )}
    </div>
  );
};

export default App;

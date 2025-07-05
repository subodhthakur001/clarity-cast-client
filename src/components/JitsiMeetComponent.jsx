import React, { useEffect, useRef } from 'react';

const JitsiMeetComponent = ({ roomName, userName }) => {
  const jitsiContainer = useRef(null);

  useEffect(() => {
    const domain = 'meet.jit.si';
    const options = {
      roomName: roomName,
      width: '100%',
      height: 600,
      parentNode: jitsiContainer.current,
      userInfo: {
        displayName: userName
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
      },
      interfaceConfigOverwrite: {
        filmStripOnly: false,
        SHOW_JITSI_WATERMARK: false
      }
    };
    const api = new window.JitsiMeetExternalAPI(domain, options);

    return () => {
      api.dispose();
    };
  }, [roomName, userName]);

  return <div ref={jitsiContainer} style={{ width: '100%', height: '100%' }} />;
};

export default JitsiMeetComponent;

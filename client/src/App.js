import ZoomVideo from '@zoom/videosdk'
import './App.css';
import { useEffect, useState } from 'react';
import FrameContainer from './components/Frame';

function App(props) {

  const {
    client,
    meetingArgs: { sdkKey, topic, signature, name, password}
  } = props

  const [loading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('');
  const [mediaStream, setMediaStream] = useState();
  const [status, setStatus] = useState(false);

  useEffect(() => { 
    const init = async () => {
      client.init('en-US')
      try {
        setLoadingText('Joining Meeting...')
        console.log(topic, signature, name, password)
        await client.join(topic, signature, name, password);
        const stream = client.getMediaStream();
        setMediaStream(stream);
        setIsLoading(false);
      } catch (error) {
        console.log('Error Joining', error);
        setIsLoading(false);
      }
    }
    init();
    return () => {
      ZoomVideo.destroyClient();
    }
  },[sdkKey, signature, client, topic, name, password]) 



  return (
    <div className="screen-container">
      <h1>Will's Zoom Video SDK App</h1>
      { loading ? 
          <h1>{loadingText}</h1> :
          <FrameContainer className="video-container" client={client} mediaStream={mediaStream}></FrameContainer>
      }
      
    </div>
  );
}

export default App;

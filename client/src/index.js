import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { devConfig } from './devConfig'
import ZoomVideo from '@zoom/videosdk';
import App from './App';
import reportWebVitals from './reportWebVitals';

const meetingArgs = {...devConfig};

const client = ZoomVideo.createClient();

const getToken = async(options) => {  
  let response = await fetch('http://localhost:4000/generate', options)
    .then(res => {
      if (res.status !== 200) {
        throw new Error(res.status)
      }
      return res.json()
    })
  return response.token
}

if (!meetingArgs.signature && meetingArgs.topic) { 
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
    body: JSON.stringify(meetingArgs)
  };
  await getToken(requestOptions).then(res => meetingArgs.signature = res)
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App client = {client} meetingArgs = {meetingArgs}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React, { useState, useCallback } from "react";

const FrameContainer = ({ client, mediaStream }) => {
    const [videoStarted, setVideoStarted] = useState(false);
    const [audioStarted, setAudioStarted] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isSAB, setIsSAB] = useState(false);

    const startVideoButton = useCallback(async () => {
        if (!videoStarted) {
            if (!!window.chrome && !(typeof SharedArrayBuffer === 'function')) {
                setIsSAB(false);
                await mediaStream.startVideo({ videoElement: document.querySelector('#self-view-video')})
            } else {
                setIsSAB(true);
                await mediaStream.startVideo();
                mediaStream.renderVideo(document.querySelector('#self-view-canvas'), client.getCurrentUserInfo().userId, 1280, 720, 0, 0, 3);
            }
            setVideoStarted(true);
        } else {
            await mediaStream.stopVideo();
            if (isSAB) {
                mediaStream.stopRenderVideo(document.querySelector('#self-view-canvas'), client.getCurrentUserInfo().userId);
            }
            setVideoStarted(false)
        }
    }, [mediaStream, videoStarted, client, isSAB])

    const startAudioButton = useCallback(async () => { 
        if (audioStarted) {
            if (isMuted) {
                await mediaStream.unmuteAudio();
                setIsMuted(false);
            } else {
                await mediaStream.muteAudio();
                setIsMuted(true);
            }
        } else {
            await mediaStream.startAudio();
            setAudioStarted(true);
        }
    }, [mediaStream, audioStarted, isMuted])

    return (
        <>
            <div className="video-wrapper">
            {
                isSAB ? 
                    <canvas id='self-view-canvas' width='1280' height='720'></canvas> :
                    <video id='self-view-video' width='1280' height='720'></video>   
            }
            </div>
            <div className="button-wrapper">
                <svg onClick={startVideoButton} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path fill={ videoStarted ? '#66669A' : 'grey'} d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/></svg>
                { !audioStarted ? 
                        <svg onClick={startAudioButton} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><path fill='grey' d="M320 64c0-12.6-7.4-24-18.9-29.2s-25-3.1-34.4 5.3L131.8 160H64c-35.3 0-64 28.7-64 64v64c0 35.3 28.7 64 64 64h67.8L266.7 471.9c9.4 8.4 22.9 10.4 34.4 5.3S320 460.6 320 448V64z"/></svg>
                    :
                        <>  
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><path fill="#66669A" d="M533.6 32.5C598.5 85.3 640 165.8 640 256s-41.5 170.8-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/></svg>
                            <svg onClick={startAudioButton} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path fill={ isMuted ? '#66669A' : 'grey'} d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"/></svg>
                        </>
                }
            </div>
        </>
    )
    
}

export default FrameContainer
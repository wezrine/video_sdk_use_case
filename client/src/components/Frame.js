import React, { useState, useEffect, useCallback } from "react";

const FrameContainer = ({ client, mediaStream }) => {
    const [videoStarted, setVideoStarted] = useState(false);
    const [audioStarted, setAudioStarted] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isShareScreen, setIsShareScreen] = useState(false);
    const [isSAB, setIsSAB] = useState(false);

    const isSupportWebCodecs = () => {
        return typeof window.MediaStreamTrackProcessor === 'function';
    }

    const startVideoButton = useCallback(async () => {
        if (!videoStarted) {
            if (!!window.chrome && !(typeof SharedArrayBuffer === 'function')) {
                setIsSAB(false);
                await mediaStream.startVideo({ videoElement: document.querySelector('#self-view-video')})
            } else {
                setIsSAB(true);
                await mediaStream.startVideo();
                mediaStream.renderVideo(document.querySelector('#self-view-canvas'), client.getCurrentUserInfo().userId, 1920, 1080, 0, 0, 3);
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

    const startShareScreen = useCallback(async () => { 
        if (isShareScreen) {
            setIsShareScreen(false);
            await mediaStream.stopShareScreen();
        } else {
            if (isSupportWebCodecs()) {
                await mediaStream.startShareScreen(document.querySelector('#share-video'))
            } else {
                await mediaStream.startShareScreen(document.querySelector('#share-canvas'));
            }
            setIsShareScreen(true);
        }
    }, [isShareScreen, mediaStream])

    return (
        <>
            <div className="video-wrapper">
            {
                isSAB ? 
                    <canvas id='self-view-canvas' width='480' height='270'></canvas> :
                    <video id='self-view-video' width='480' height='270'></video>   
            }
            {
                !isSupportWebCodecs() ?
                <canvas id='share-canvas' width='480' height='270'></canvas> :                 
                <video id='share-video' width='480' height='270'></video> 
            }
            </div>
            <div className="button-wrapper">
                <svg onClick={startVideoButton} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path fill={ videoStarted ? 'red' : 'grey'} d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/></svg>
                <svg onClick={startShareScreen} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path fill={ isShareScreen ? 'red' : 'grey'} d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64H240l-10.7 32H160c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H346.7L336 416H512c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM512 64V352H64V64H512z"/></svg>
                <svg onClick={startAudioButton} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><path d="M320 64c0-12.6-7.4-24-18.9-29.2s-25-3.1-34.4 5.3L131.8 160H64c-35.3 0-64 28.7-64 64v64c0 35.3 28.7 64 64 64h67.8L266.7 471.9c9.4 8.4 22.9 10.4 34.4 5.3S320 460.6 320 448V64z"/></svg>
            </div>
        </>
    )
    
}

export default FrameContainer
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
} from 'react-native';
import {IconButton, useTheme} from 'react-native-paper';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import {width} from '../../Constants';
// import {height, width} from '../Consts';

const VideoComponent = ({
  uri,
  style,
  fullscreen,
  setFullScreen,
  noControls,
  swiperControl,
  autoPlay,
  playing,
  onEndVideo,
  muted = false,
  repeat,
  resize,
}) => {
  const videoRef = React.createRef();
  const {colors} = useTheme();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    play: autoPlay ? true : false,
    currentTime: 0,
    duration: 0,
    showControls: noControls ? false : true,
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
  });
  const [mute, setMute] = useState(muted);

  useEffect(() => {
    if (autoPlay) {
    }
    Orientation.addOrientationListener(handleOrientation);
    const listner = Dimensions.addEventListener('change', () => {
      let {width, height} = Dimensions.get('screen');
      setState(s => ({...s, height, width}));
    });

    return () => {
      Orientation.removeOrientationListener(handleOrientation);
      listner.remove();
    };
  }, []);

  // useEffect(() => {
  //   if (fullscreen) ;
  //   else StatusBar.setHidden(false, 'slide');
  // }, [fullscreen]);

  return (
    <TouchableWithoutFeedback onPress={noControls ? () => {} : showControls}>
      <View
        style={
          fullscreen
            ? {height: state.height, width: state.width, zIndex: 2}
            : {}
        }>
        <Video
          ref={videoRef}
          muted={mute}
          repeat={repeat}
          source={{
            uri,
          }}
          style={
            fullscreen
              ? styles.fullscreenVideo
              : {...style, backgroundColor: 'black'}
          }
          controls={false}
          onBuffer={() => setLoading(true)}
          onVideoLoadStart={() => setLoading(true)}
          resizeMode={resize || 'contain'}
          onLoadStart={() => setLoading(true)}
          onLoad={onLoadEnd}
          onProgress={onProgress}
          onEnd={onEnd}
          paused={playing !== undefined ? !playing : !state.play}
        />
        <IconButton
          icon={mute ? 'volume-mute' : 'volume-high'}
          onPress={() => setMute(m => !m)}
          iconColor="white"
          size={16}
          style={{
            backgroundColor: '#000000c4',
            borderRadius: 50,
            padding: 5,
            position: 'absolute',
            top: 0,
          }}
        />
        {loading ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              ...style,
              // ...StyleSheet.absoluteFill,
            }}>
            <Image
              source={require('../../assets/img/loader.gif')}
              resizeMode="center"
            />
          </View>
        ) : (
          state.showControls && (
            <View style={{...styles.controlOverlay, ...style}}>
              {setFullScreen && (
                <TouchableOpacity
                  onPress={handleFullscreen}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                  style={styles.fullscreenButton}>
                  {fullscreen ? (
                    <MaterialIcons
                      name="close-fullscreen"
                      style={styles.icon}
                    />
                  ) : (
                    <MaterialIcons name="fullscreen" style={styles.icon} />
                  )}
                </TouchableOpacity>
              )}
              <PlayerControls
                onPlay={handlePlayPause}
                onPause={handlePlayPause}
                playing={state.play}
                showPreviousAndNext={false}
                showSkip={true}
                skipBackwards={skipBackward}
                skipForwards={skipForward}
              />
              <ProgressBar
                currentTime={state.currentTime}
                duration={state.duration > 0 ? state.duration : 0}
                onSlideStart={handlePlayPause}
                onSlideComplete={handlePlayPause}
                onSlideCapture={onSeek}
                seekBarColor={colors.secondary}
              />
            </View>
          )
        )}
      </View>
    </TouchableWithoutFeedback>
  );

  function handleOrientation(orientation) {
    orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
      ? (setState(s => ({
          ...s,
          fullscreen: true,
        })),
        StatusBar.setHidden(true))
      : (setState(s => ({...s, fullscreen: false})),
        StatusBar.setHidden(false));
  }

  function handleFullscreen() {
    if (fullscreen) {
      Orientation.lockToPortrait();
    } else {
      Orientation.unlockAllOrientations();
    }

    setFullScreen(f => !f);
  }

  function handlePlayPause() {
    // If playing, pause and show controls immediately.
    if (state.play) {
      setState({...state, play: false, showControls: true});
      return;
    }

    setState({...state, play: true});
    setTimeout(() => setState(s => ({...s, showControls: false})), 2000);
  }

  function skipBackward() {
    videoRef.current.seek(state.currentTime - 10);
    setState({...state, currentTime: state.currentTime - 10});
  }

  function skipForward() {
    videoRef.current.seek(state.currentTime + 10);
    setState({...state, currentTime: state.currentTime + 10});
  }

  function onSeek(data) {
    videoRef.current.seek(data.seekTime);
    setState(state => ({...state, currentTime: data.seekTime}));
  }

  function onLoadEnd(data) {
    setLoading(false);
    setState(s => ({
      ...s,
      duration: data.duration,
      currentTime: data.currentTime,
    }));
  }

  function onProgress(data) {
    setLoading(false);
    setState(s => ({
      ...s,
      currentTime: data.currentTime,
    }));
  }

  function onEnd() {
    setState({...state, play: false});
    videoRef.current.seek(0);
    if (swiperControl) swiperControl({nativeEvent: {locationX: width}});
    if (onEndVideo) onEndVideo();
  }

  function showControls() {
    state.showControls
      ? setState({...state, showControls: false})
      : setState({...state, showControls: true});
  }
};

const styles = StyleSheet.create({
  video: {
    backgroundColor: 'black',
  },
  fullscreenVideo: {
    height: '100%',
    width: '100%',
    backgroundColor: 'black',
    alignSelf: 'center',
  },
  text: {
    marginTop: 30,
    marginHorizontal: 20,
    fontSize: 15,
    textAlign: 'justify',
  },
  fullscreenButton: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingRight: 10,
  },
  controlOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000c4',
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 20,
    color: 'white',
  },
});

export default VideoComponent;

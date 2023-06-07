import React, {useContext, useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, ToastAndroid} from 'react-native';
import Camera from 'react-native-vision-camera';
import Video from 'react-native-video';
import {Title} from 'react-native-paper';
import {GlobalContext} from '../../auth/GlobalProvider';
import {uploadPics} from '../../utils/userAPI';

const IntroductionScreen = () => {
  const cameraRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const {user, setUser} = useContext(GlobalContext);

  const getPermissions = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    if (cameraPermission !== 'authorized') {
      const newCameraPermission = await Camera.requestCameraPermission();
      if (newCameraPermission !== 'authorized')
        return alert('Camera Permission is Required');
    }
    const microphonePermission = await Camera.getMicrophonePermissionStatus();
    if (microphonePermission !== 'authorized') {
      const newCameraPermission = await Camera.requestMicrophonePermission();
      if (newCameraPermission !== 'authorized')
        return alert('Microphone Permission is Required');
    }
  };
  useEffect(() => {
    getPermissions();
  }, []);

  const startRecording = async () => {
    if (cameraRef.current) {
      setRecording(true);
      cameraRef.current.startRecording({
        onRecordingFinished: video => console.log(video),
        onRecordingError: error => console.error(error),
        fileType: 'mp4',
      });
      //   setVideoUri(uri);
      setRecording(false);
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current && recording) {
      await cameraRef.current.stopRecording();
    }
  };

  const uploadVideo = async () => {
    let uri = await uploadPics();
  };

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Title style={{flex: 2, alignSelf: 'center'}}>
          Record a Video Introduction of Yourself
        </Title>
        {videoUri ? (
          <Video
            source={{uri: videoUri}}
            style={{flex: 6}}
            resizeMode="contain"
            controls
            repeat
            paused={!recording}
          />
        ) : (
          <Camera
            ref={cameraRef}
            style={{flex: 6}}
            video={true}
            audio={true} // <-- optional
          />
        )}
      </View>
      <View style={{alignItems: 'center', marginVertical: 20}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          Give a video introduction about yourself
        </Text>
      </View>
      <View style={{alignItems: 'center'}}>
        {recording ? (
          <TouchableOpacity onPress={stopRecording}>
            <Text style={{fontSize: 18, color: 'red'}}>Stop Recording</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={startRecording}>
            <Text style={{fontSize: 18, color: 'green'}}>Start Recording</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={uploadVideo}>
          <Text style={{fontSize: 18, marginTop: 10}}>Upload Video</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IntroductionScreen;

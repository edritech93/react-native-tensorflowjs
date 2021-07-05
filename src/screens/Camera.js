import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { TfImageRecognition } from 'react-native-tensorflow';
import { RNCamera } from 'react-native-camera';

const tfImageRecognition = new TfImageRecognition({
  model: require('../assets/tensorflow_inception_graph.pb'),
  labels: require('../assets/tensorflow_labels.txt'),
  imageMean: 117, // Optional, defaults to 117
  imageStd: 1 // Optional, defaults to 1
})

export default function Camera(props) {
  const cameraRef = useRef();
  const [isProcessing, setIsProcessing] = useState(false);

  async function _captureImage() {
    try {
      const image = await cameraRef.current.takePictureAsync().catch((error) => {
        throw error;
      });
      const results = await tfImageRecognition.recognize({
        image: image.uri,
        inputName: "input", //Optional, defaults to "input"
        inputSize: 224, //Optional, defaults to 224
        outputName: "output", //Optional, defaults to "output"
        maxResults: 3, //Optional, defaults to 3
        threshold: 0.1, //Optional, defaults to 0.1
      })
      console.log('results => ', results);
    } catch (error) {
      console.log('error => ', error);
    } finally {
      // _captureImage();
    }
  }

  return (
    <View style={styles.container}>
      <RNCamera
        zoom={0}
        ratio={'16:9'}
        focusDepth={0}
        ref={cameraRef}
        camera1ScanMode={'boost'}
        captureAudio={false}
        style={styles.camera}
        type={RNCamera.Constants.Type.front}
        autoFocus={RNCamera.Constants.AutoFocus.on}
        whiteBalance={RNCamera.Constants.WhiteBalance.auto}>
      </RNCamera>
      <TouchableOpacity
        onPress={() => _captureImage()}
        style={styles.captureButton}></TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  captureButton: {
    position: 'absolute',
    left: Dimensions.get('screen').width / 2 - 50,
    bottom: 40,
    width: 100,
    zIndex: 100,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 50,
  },
  modal: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 300,
    borderRadius: 24,
    backgroundColor: 'gray',
  },
  dismissButton: {
    width: 150,
    height: 50,
    marginTop: 60,
    borderRadius: 24,
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
});
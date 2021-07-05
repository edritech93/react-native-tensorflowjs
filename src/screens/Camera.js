import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import ImgToBase64 from 'react-native-image-base64';
import { TfImageRecognition } from 'react-native-tensorflow';

export default function Camera(props) {
  const cameraRef = useRef();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageCapture = async () => {
    try {
      setIsProcessing(true);
      const image = await cameraRef.current.takePictureAsync().catch((error) => {
        throw error;
      });
      ImgToBase64.getBase64String(image.uri)
        .then(base64String => {
          processImagePrediction(base64String);
        })
        .catch(error => {
          console.log('base64String => ', error);
        });
    } catch (error) {
      console.log('handleImageCapture => ', error);
    }
  };

  const processImagePrediction = async (base64Image) => {};

  useEffect(() => {
    async function _loadData() {
      

      const tfImageRecognition = new TfImageRecognition({
        model: require('../assets/tensorflow_inception_graph.pb'),
        labels: require('../assets/tensorflow_labels.txt'),
        imageMean: 117, // Optional, defaults to 117
        imageStd: 1 // Optional, defaults to 1
      })

      const results = await tfImageRecognition.recognize({
        image: require('../assets/dumbbell.jpg'),
        inputName: "input", //Optional, defaults to "input"
        inputSize: 224, //Optional, defaults to 224
        outputName: "output", //Optional, defaults to "output"
        maxResults: 3, //Optional, defaults to 3
        threshold: 0.1, //Optional, defaults to 0.1
      })

      results.forEach(result =>
        console.log(
          result.id, // Id of the result
          result.name, // Name of the result
          result.confidence // Confidence value between 0 - 1
        )
      )
    }
    _loadData()
  }, [])

  return (
    <View style={styles.container}>
      <RNCamera
        zoom={0}
        ratio={'16:9'}
        focusDepth={0}
        ref={cameraRef}
        captureAudio={false}
        style={styles.container}
        type={RNCamera.Constants.Type.front}
        autoFocus={RNCamera.Constants.AutoFocus.on}
        whiteBalance={RNCamera.Constants.WhiteBalance.auto}></RNCamera>
      <Pressable
        onPress={() => handleImageCapture()}
        style={styles.captureButton}></Pressable>
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

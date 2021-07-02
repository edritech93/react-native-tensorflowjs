import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Modal,
  Text,
  ActivityIndicator,
} from 'react-native';
import {
  getModel,
  convertBase64ToTensor,
  startPrediction,
} from '../helpers/tensor-helper';
import { cropPicture } from '../helpers/image-helper';
import { RNCamera } from 'react-native-camera';
import ImgToBase64 from 'react-native-image-base64';

const RESULT_MAPPING = ['Triangle', 'Circle', 'Square'];

export default function Camera(props) {
  const cameraRef = useRef();
  const [isProcessing, setIsProcessing] = useState(false);
  const [presentedShape, setPresentedShape] = useState('');

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

  const processImagePrediction = async (base64Image) => {
    // const croppedData = await cropPicture(base64Image, 300);
    // const model = await getModel();
    // const tensor = await convertBase64ToTensor(croppedData.base64);

    // const prediction = await startPrediction(model, tensor);

    // const highestPrediction = prediction.indexOf(
    //   Math.max.apply(null, prediction),
    // );
    // setPresentedShape(RESULT_MAPPING[highestPrediction]);
  };

  return (
    <View style={styles.container}>
      <Modal visible={isProcessing} transparent={true} animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text>Your current shape is {presentedShape}</Text>
            {presentedShape === '' && <ActivityIndicator size="large" />}
            <Pressable
              style={styles.dismissButton}
              onPress={() => {
                setPresentedShape('');
                setIsProcessing(false);
              }}>
              <Text>Dismiss</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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

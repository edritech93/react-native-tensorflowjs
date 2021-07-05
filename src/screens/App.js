import React, { useEffect } from 'react';
import { View, PermissionsAndroid } from 'react-native';
import Camera from './Camera';

export default function App(props) {
  useEffect(() => {
    async function _loadPermission()  {
      const granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ],
        {
          title: 'Storage & Camera Permission',
          message:
            'Apps needs permission to store and access camera in order to use this feature',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log('granted => ', granted)
    }
    _loadPermission();
  }, []);

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white'
    }}>
      <Camera />
    </View>
  );
}

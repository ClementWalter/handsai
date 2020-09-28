import React from 'react';
import PropTypes from 'prop-types';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { EvilIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const flashIcons = {
  off: 'flash-off',
  on: 'flash-on',
  auto: 'flash-auto',
  torch: 'highlight',
};

const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};

const wbIcons = {
  auto: 'wb-auto',
  sunny: 'wb-sunny',
  cloudy: 'wb-cloudy',
  shadow: 'beach-access',
  fluorescent: 'wb-iridescent',
  incandescent: 'wb-incandescent',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noPermissions: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  noPermissionsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: 'white',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flex: 0.2,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bottomBar: {
    flex: 0.2,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bottomBarCenterContainer: {
    flex: 0.5,
  },
  bottomBarSideContainer: {
    flex: 0.25,
  },
  bottomBarIcon: {
    alignSelf: 'center',
  },
  toggleButton: {
    flex: 0.25,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoFocusLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

class CameraScreen extends React.Component {
  state = {
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    type: 'back',
    whiteBalance: 'auto',
    ratio: '16:9',
    ratios: [],
    cameraPermissionsGranted: false,
    cameraRollPermissionsGranted: false,
  };

  allowCameraPermission = async () => {
    if (!this.state.cameraPermissionsGranted) {
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({cameraPermissionsGranted: status === 'granted'});
    }
  }

  allowCameraRollPermission = async () => {
    if (!this.state.cameraRollPermissionsGranted) {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({cameraRollPermissionsGranted: status === 'granted'});
    }
  }

  componentDidMount = async () => {
    await this.allowCameraPermission();
    await this.allowCameraRollPermission();
  };

  toggleFacing = () => this.setState({type: this.state.type === 'back' ? 'front' : 'back'});

  toggleFlash = () => this.setState({flash: flashModeOrder[this.state.flash]});

  toggleWB = () => this.setState({whiteBalance: wbOrder[this.state.whiteBalance]});

  toggleFocus = () => this.setState({autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on'});

  takePictureAsync = async () => {
    if (this.camera) {
      const photo = await this.camera.takePictureAsync({quality: 0});
      this.props.handleTakePictureAsync(photo)
    }
  };

  openImagePickerAsync = async () => {
    await this.allowCameraRollPermission();
    const photo = await ImagePicker.launchImageLibraryAsync({allowsEditing: false});
    if (!photo.cancelled) {
      this.props.handleTakePictureAsync(photo)
    }
  }

  renderTopBar = () =>
    <View style={styles.topBar}>
      <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFacing}>
        <Ionicons name="ios-reverse-camera" size={32} color="white"/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFlash}>
        <MaterialIcons name={flashIcons[this.state.flash]} size={32} color="white"/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.toggleButton} onPress={this.toggleWB}>
        <MaterialIcons name={wbIcons[this.state.whiteBalance]} size={32} color="white"/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFocus}>
        <Text style={[styles.autoFocusLabel, {color: this.state.autoFocus === 'on' ? "white" : "#6b6b6b"}]}>AF</Text>
      </TouchableOpacity>
    </View>;

  renderBottomBar = () =>
    <View style={styles.bottomBar}>
      <View style={styles.bottomBarSideContainer}>
        <TouchableOpacity style={styles.bottomBarIcon} onPress={this.openImagePickerAsync}>
          <EvilIcons name="image" size={60} color="white"/>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomBarCenterContainer}>
        <TouchableOpacity style={styles.bottomBarIcon} onPress={this.takePictureAsync}>
          <Ionicons name="ios-radio-button-on" size={70} color="white"/>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomBarSideContainer}/>
    </View>;

  renderCamera = () =>
    (
      <View style={{flex: 1}}>
        <Camera
          ref={ref => {
            this.camera = ref
          }}
          style={styles.camera}
          type={this.state.type}
          flashMode={this.state.flash}
          autoFocus={this.state.autoFocus}
          zoom={this.state.zoom}
          whiteBalance={this.state.whiteBalance}
          ratio={this.state.ratio}
        >
          {this.renderTopBar()}
          {this.renderBottomBar()}
        </Camera>
      </View>
    );

  renderNoPermissions = () =>
    <View style={styles.noPermissions}>
      <Text style={styles.noPermissionsText}>
        Camera permissions not granted - cannot open camera preview.
      </Text>
      <Button
        onPress={this.allowCameraPermission}
        title="Allow camera"
        color="white"
      />
    </View>;

  render() {
    return <View
      style={styles.container}>{this.state.cameraPermissionsGranted ? this.renderCamera() : this.renderNoPermissions()}</View>;
  }
}

CameraScreen.propTypes = {
  handleTakePictureAsync: PropTypes.func.isRequired,
}

export default CameraScreen

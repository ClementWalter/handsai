import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

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

export default class CameraScreen extends React.Component {
  state = {
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    type: 'back',
    whiteBalance: 'auto',
    ratio: '16:9',
    ratios: [],
    permissionsGranted: false,
  };

  componentDidMount = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({permissionsGranted: status === 'granted'});
  };

  toggleFacing = () => this.setState({type: this.state.type === 'back' ? 'front' : 'back'});

  toggleFlash = () => this.setState({flash: flashModeOrder[this.state.flash]});

  toggleWB = () => this.setState({whiteBalance: wbOrder[this.state.whiteBalance]});

  toggleFocus = () => this.setState({autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on'});

  takePicture = async () => {
    if (this.camera) {
      const photo = await this.camera.takePictureAsync({quality: 0});
      this.props.handleTakePicture(photo)
    }
  };

  handleMountError = ({message}) => console.error(message);

  renderNoPermissions = () =>
    <View style={styles.noPermissions}>
      <Text style={{color: 'black'}}>
        Camera permissions not granted - cannot open camera preview.
      </Text>
    </View>;

  renderTopBar = () =>
    <View
      style={styles.topBar}>
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
      <TouchableOpacity
        onPress={this.takePicture}
        style={{alignSelf: 'center'}}
      >
        <Ionicons name="ios-radio-button-on" size={70} color="white"/>
      </TouchableOpacity>
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
          onMountError={this.handleMountError}
        >
          {this.renderTopBar()}
          {this.renderBottomBar()}
        </Camera>
      </View>
    );

  render() {
    const content = this.state.permissionsGranted
                                ? this.renderCamera()
                                : this.renderNoPermissions();
    return <View style={styles.container}>{content}</View>;
  }
}

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

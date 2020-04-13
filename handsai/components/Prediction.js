import React from 'react';
import { ActivityIndicator, ImageBackground, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Layout from '../constants/Layout';
import { FontAwesome } from '@expo/vector-icons';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import BoundingBoxDraw from './BoundingBoxDraw';

export default class Prediction extends React.Component {

  handleMountError = ({message}) => console.error(message);

  onLabelReject = () => this.labelInput.focus();

  renderTopBar = () => {
    return <View style={styles.topBar}>
      {this.renderLabel()}
      {this.renderConfidence()}
    </View>;
  }

  renderLabel = () => <View style={styles.labelBar}>
    <TextInput
      onChangeText={this.props.handlePredictionCorrection}
      value={this.props.prediction && this.props.prediction.label}
      selectTextOnFocus={true}
      style={styles.labelText}
      ref={(ref) => {
        this.labelInput = ref
      }}
    />
  </View>

  renderConfidence = () => {
    const confidence = this.props.prediction ? this.props.prediction.confidence : 0;
    const backgroundColor = confidence < 0.5 ? "red" : confidence < 0.75 ? "yellow" : "green"
    return <View style={styles.confidenceBar}>
      <ProgressBarAnimated
        width={Layout.window.width}
        value={confidence}
        backgroundColor={backgroundColor}
        borderRadius={0}
        borderColor="white"
        borderWidth={0}
      />
    </View>
  }

  renderBottomBar = () =>
    <View style={styles.bottomBar}>
      <TouchableOpacity
        onPress={this.onLabelReject}
        style={{alignSelf: 'center'}}
      >
        <FontAwesome name="times-circle" size={60} style={styles.labelKo}/>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={this.props.onLabelAccept}
        style={{alignSelf: 'center'}}
      >
        <FontAwesome name="check-circle" size={60} style={styles.labelOk}/>
      </TouchableOpacity>
    </View>;

  render() {
    return <View style={{flex: 1}}>
      <ImageBackground style={styles.background} source={{uri: this.props.uri}}>
        {this.renderTopBar()}
        {!this.props.prediction && <View style={styles.loader}><ActivityIndicator size="large" color="white"/></View>}
        {!!this.props.prediction && <BoundingBoxDraw handleBoundingBoxChange={() => {}}/>}
        {!!this.props.prediction && this.renderBottomBar()}
      </ImageBackground>
    </View>;
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topBar: {
    flex: 0.2,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  loader: {flex: 1, flexDirection: "column", justifyContent: "center"},
  labelBar: {
    flex: 0.8,
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    width: Layout.window.width,
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    color: 'black',
  },
  confidenceBar: {
    flex: 0.2,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    width: Layout.window.width,
  },
  bottomBar: {
    backgroundColor: 'transparent',
    justifyContent: 'space-around',
    flex: 0.2,
    flexDirection: 'row',
  },
  noPermissions: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  labelOk: {color: "rgb(84,255,34)"},
  labelKo: {color: "#c3483c"},
});

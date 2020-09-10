import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Camera from './Camera';
import Prediction from './Prediction';
import { resize, crop, base64WebSafe } from '../utils/ImageUtils';
import getEnvVars from '../environment';
import * as Permissions from 'expo-permissions';

const {apiUrl} = getEnvVars();

export default class HomeScreen extends React.Component {

  state = {
    photo: null,
    prediction: null,
    overwrite: true,
    permissionsGranted: false,
  }

  componentDidMount = async () => {
    fetch(`${apiUrl}/status`, {
      method: "GET",
    }).then(r => console.log("status", r));
    if (!this.state.permissionsGranted) {
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({permissionsGranted: status === 'granted'});
    }
  };

  predict = async (photo) => {
    let label = "NO_LABEL";
    let confidence;
    if (!this.state.overwrite) {
      try {
        const photoLow = await resize(224, 224)(photo)
        const body = JSON.stringify({
          "signature_name": "decode_and_serve",
          "inputs": {"image_bytes": [base64WebSafe(photoLow.base64)]},
        });
        const response = await fetch(`${apiUrl}/predict`, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body,
        });
        const prediction = await response.json()
        console.log("prediction", prediction);
        const scores = prediction["outputs"]["scores"][0];
        const labels = prediction["outputs"]["classes"];
        confidence = Math.max(...scores);
        label = labels.length > 0 ? labels[scores.indexOf(confidence)] : label;
      } catch (e) {
        console.log(e)
      }
    }
    this.setState({prediction: {label, confidence}})
  };

  sendPredictionFeedback = async () => {
    console.log("this.state.prediction", this.state.prediction)
    let photo = this.state.photo
    if (this.state.prediction.boundingBox) {
      photo = await crop(this.state.photo.uri, this.state.prediction.boundingBox)
    }
    const photoLow = await resize(224, 224)(photo)
    const body = JSON.stringify({
      "signature_name": "set_support_set",
      "inputs": {
        "image_bytes": [base64WebSafe(photoLow.base64)],
        "crop_window": [[0, 0, photoLow.height, photoLow.width]],
        "label": [this.state.prediction.label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()],
        "overwrite": this.state.overwrite,
      },
    });
    const response = await fetch(`${apiUrl}/predict`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });
    if (response.ok) {
      const support_set_loss = await response.json();
      console.log("support_set_loss", support_set_loss["outputs"][0]);
      this.setState({
        photo: null,
        prediction: null,
        overwrite: false,
      })
    }
  };

  handleTakePicture = async (photo) => {
    this.setState({photo})
    await this.predict(photo)
  }

  handlePredictionCorrection = (key) => (value) => this.setState((prevState) => ({
    prediction: {
      ...prevState.prediction,
      [key]: value,
    },
  }))

  renderNoPermissions = () =>
    <View style={styles.noPermissions}>
      <Text style={{color: 'black'}}>
        Camera permissions not granted - cannot open camera preview.
      </Text>
    </View>;

  render() {
    const content = !this.state.permissionsGranted ?
                    this.renderNoPermissions() : !this.state.photo ?
                                                 <Camera
                                                   handleTakePicture={this.handleTakePicture}/> :
                                                 <Prediction
                                                   uri={this.state.photo.uri}
                                                   prediction={this.state.prediction}
                                                   onLabelAccept={this.sendPredictionFeedback}
                                                   handlePredictionCorrection={this.handlePredictionCorrection}
                                                 />
    return <View style={styles.container}>{content}</View>
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
})

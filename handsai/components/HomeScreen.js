import React from 'react';
import { View } from 'react-native';
import CameraScreen from './Camera';
import Prediction from './Prediction';

export default class HomeScreen extends React.Component {

  state = {
    photo: null,
    prediction: null,
  }

  render() {
    return <View style={{flex: 1}}>
      {!this.state.photo && <CameraScreen handleTakePicture={(photo) => this.setState({ photo })}/>}
      {!!this.state.photo && <Prediction
        uri={this.state.photo.uri}
        prediction={this.state.prediction}
        onLabelAccept={() => {}}
        handlePredictionCorrection={() => {}}
      />}
    </View>
  }
}

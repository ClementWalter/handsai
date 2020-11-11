import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { updatePrediction, validatePrediction } from '../actions/predictionActions';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { ProgressBar } from 'react-native-paper';

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#6E00FF',
  },
  imageStyle: {
    resizeMode: 'contain',
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
    width: width,
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    color: 'black',
  },
  confidenceContainer: {
    flex: 0.2,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: width,
  },
  progressBar: {width, height: 10, backgroundColor: 'transparent'},
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

class Prediction extends React.Component {

  async componentDidMount() {
    if (this.props.prediction && !!this.props.prediction.predictions) {
      this.props.updatePrediction({
        label: this.props.prediction.predictions[0].label,
        confidence: this.props.prediction.predictions[0].confidence,
        uri: this.props.prediction.predictions[0].uri,
      })
    }
  }

  onLabelReject = () => this.labelInput.focus();

  onLabelAccept = () => {
    this.props.validatePrediction(this.props.prediction);
    this.props.toggleModal()
  }

  renderTopBar = () => {
    return <View style={styles.topBar}>
      {this.renderLabel()}
      {this.renderConfidence()}
    </View>;
  }

  onLabelChange = (label) => this.props.updatePrediction({label})

  renderLabel = () => <View style={styles.labelBar}>
    <TextInput
      value={this.props.prediction.label}
      onChangeText={this.onLabelChange}
      selectTextOnFocus={true}
      style={styles.labelText}
      ref={(ref) => {
        this.labelInput = ref
      }}
    />
  </View>

  renderConfidence = () => {
    const confidence = this.props.prediction.confidence || 0;
    const backgroundColor = confidence < 0.5 ? "red" : confidence < 0.75 ? "yellow" : "green"
    return <View style={styles.confidenceContainer}>
      <ProgressBar
        style={styles.progressBar}
        progress={confidence}
        color={backgroundColor}
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
        onPress={this.onLabelAccept}
        style={{alignSelf: 'center'}}
      >
        <FontAwesome name="check-circle" size={60} style={styles.labelOk}/>
      </TouchableOpacity>
    </View>;

  render() {
    const source = isEmpty(this.props.prediction) ? require('../assets/images/splash.png') : {uri: this.props.prediction.uri}
    return <View style={{flex: 1}}>
      <ImageBackground style={styles.background} imageStyle={styles.imageStyle} source={source}>
        {this.renderTopBar()}
        {!!this.props.prediction.label ? this.renderBottomBar() :
         <View style={styles.loader}><ActivityIndicator size="large" color="white"/></View>}
      </ImageBackground>
    </View>;
  }
}

Prediction.propTypes = {
  prediction: PropTypes.shape({
    predictions: PropTypes.array,
    label: PropTypes.string,
    confidence: PropTypes.number,
    uri: PropTypes.string,
  }),
  supportSet: PropTypes.array,
  toggleModal: PropTypes.func,
}

const mapStateToProps = (state) => ({
  prediction: state.prediction,
  supportSet: state.supportSet,
});

const mapDispatchToProps = (dispatch) => ({
  updatePrediction: (prediction) => dispatch(updatePrediction(prediction)),
  validatePrediction: (prediction) => dispatch(validatePrediction(prediction)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Prediction)

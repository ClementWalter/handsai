import React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import Prediction from './Prediction';
import isEmpty from 'lodash/isEmpty';
import Camera from './Camera';
import { connect } from 'react-redux';
import { clearPrediction, updatePrediction } from '../actions/predictionActions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    margin: 0,
  },
})

class Home extends React.Component {

  handleTakePictureAsync = (photo) => this.props.updatePrediction({photo})

  onSwipeComplete = () => this.props.clearPrediction();

  render() {
    return (
      <View style={styles.container}>
        <Camera handleTakePictureAsync={this.handleTakePictureAsync}/>
        <Modal isVisible={!isEmpty(this.props.prediction)}
               onSwipeComplete={this.onSwipeComplete}
               style={styles.modal}
               backdropOpacity={1}
               swipeDirection="up"
        >
          <Prediction/>
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
    prediction: state.prediction,
  })
;

const mapDispatchToProps = (dispatch) => ({
  clearPrediction: () => dispatch(clearPrediction()),
  updatePrediction: (prediction) => dispatch(updatePrediction(prediction)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)

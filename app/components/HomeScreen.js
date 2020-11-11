import React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import Prediction from './Prediction';
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

  state = {
    isModalVisible: false,
  }

  toggleModal = () => this.setState({isModalVisible: !this.state.isModalVisible})

  openImagePickerAsync = (images) => {
    this.props.updatePrediction({images})
  };

  onSwipeComplete = async () => {
    await this.toggleModal()
    this.props.clearPrediction();
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera openImagePickerAsync={this.openImagePickerAsync} toggleModal={this.toggleModal}/>
        <Modal isVisible={this.state.isModalVisible}
               onSwipeComplete={this.onSwipeComplete}
               style={styles.modal}
               backdropOpacity={1}
               swipeDirection={["up", "down"]}
        >
          <Prediction toggleModal={this.toggleModal}/>
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

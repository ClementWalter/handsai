import React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import Prediction from './Prediction';
import Camera from './Camera';
import { connect } from 'react-redux';
import { clearPrediction } from '../actions/predictionActions';

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

  render() {
    return (
      <View style={styles.container}>
        <Camera toggleModal={this.toggleModal}/>
        <Modal isVisible={this.state.isModalVisible}
               onSwipeComplete={this.toggleModal}
               style={styles.modal}
               backdropOpacity={1}
               swipeDirection={["up", "down"]}
               onModalHide={this.props.clearPrediction}
        >
          <Prediction toggleModal={this.toggleModal}/>
        </Modal>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  clearPrediction: () => dispatch(clearPrediction()),
})

export default connect(null, mapDispatchToProps)(Home)

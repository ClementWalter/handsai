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

const width = Dimensions.get('window').width;
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
    width: width,
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
    justifyContent: 'flex-start',
    width: width,
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

class Prediction extends React.Component {

  onLabelReject = () => this.labelInput.focus();

  renderTopBar = () => {
    return <View style={styles.topBar}>
      {this.renderLabel()}
    </View>;
  }

  renderLabel = () => <View style={styles.labelBar}>
    <TextInput
      value={this.props.prediction && this.props.prediction.label}
      selectTextOnFocus={true}
      style={styles.labelText}
      ref={(ref) => {
        this.labelInput = ref
      }}
    />
  </View>

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
    return <View style={{flex: 1}}>
      <ImageBackground style={styles.background} source={{uri: this.props.uri}}>
        {this.renderTopBar()}
        {this.props.prediction ? this.renderBottomBar() :
         <View style={styles.loader}><ActivityIndicator size="large" color="white"/></View>}
      </ImageBackground>
    </View>;
  }
}

Prediction.propTypes = {
  uri: PropTypes.string.isRequired,
  prediction: PropTypes.shape({
    label: PropTypes.string,
    confidence: PropTypes.number,
  }),
}

export default Prediction

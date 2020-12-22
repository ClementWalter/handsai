import React from 'react';
import { Button, StyleSheet, View } from 'react-native';

class ModalContent extends React.Component {

  render() {
    return (
      <View style={styles.content}>
        <Button onPress={this.props.onPress} title={this.props.text}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
});

export default ModalContent;

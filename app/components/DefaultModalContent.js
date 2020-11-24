import React from 'react';
import { Button, StyleSheet, View } from 'react-native';

class DefaultModalContent extends React.Component {

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
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
});

export default DefaultModalContent;

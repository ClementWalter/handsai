import React from 'react';
import { Dimensions, Image, ScrollView, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    bottom: 100,
  },
  imageContainer: {
    width: 75,
    height: 75,
    marginRight: 5,
  },
  image: {
    width: 75,
    height: 75,
  },
  bottomToolbar: {
    width: Dimensions.get('window').width,
    position: 'absolute',
    height: 100,
    bottom: 0,
  },
})

export default ({captures = []}) => (
  <ScrollView
    horizontal={true}
    style={[styles.bottomToolbar, styles.container]}
  >
    {captures.map(({uri}) => (
      <View style={styles.imageContainer} key={uri}>
        <Image source={{uri}} style={styles.image}/>
      </View>
    ))}
  </ScrollView>
);

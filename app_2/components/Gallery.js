import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Image, ScrollView, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

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

class Gallery extends React.Component {

  render() {
    return <ScrollView
      horizontal={true}
    >
      {Object.keys(this.props.supportSet).map((uri) => (
        <View style={styles.imageContainer} key={uri}>
          <Image source={{uri}} style={styles.image}/>
        </View>
      ))}
    </ScrollView>
  }
}

Gallery.propTypes = {
  supportSet: PropTypes.object
}

const mapStateToProps = (state) => ({
    supportSet: state.supportSet,
  })
;

export default connect(mapStateToProps, null)(Gallery)

import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Photo from './Photo';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  topBar: {
    alignItems: 'center',
    width: "100%",
    height: "13%",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  text: {
    color: "white",
    fontSize: 20,
  },
});

export default class PhotoBrowser extends React.Component {

  getItemLayout = (data, index) => (
    {length: height, offset: width * index, index}
  )

  keyExtractor = item => item.id || item.thumb || item.photo;

  renderItem = ({item}) => {
    return (
      <Photo
        width={width / 3}
        height={100}
        resizeMode={'cover'}
        thumbnail
        progressImage={require('./Assets/hourglass.png')}
        uri={item.thumb || item.photo}
      />
    );
  }

  renderTopBar = () =>
    <View style={styles.topBar}>
      <TouchableOpacity onPress={this.props.onBack}>
        <MaterialCommunityIcons name="camera-plus" size={32} color="white"/>
      </TouchableOpacity>
      <Text
        style={styles.text}>{`${this.props.mediaList.length} photo${this.props.mediaList.length > 1 ? 's' : ''}`}
      </Text>
      <TouchableOpacity onPress={this.props.toggleModal}>
        <MaterialCommunityIcons name="dots-horizontal" size={32} color="white"/>
      </TouchableOpacity>
    </View>;

  render() {
    return (
      <View style={styles.container}>
        {this.renderTopBar()}
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.props.mediaList}
          initialNumToRender={21}
          numColumns={3}
          renderItem={this.renderItem}
          getItemLayout={this.getItemLayout}
        />
      </View>
    );
  }

}

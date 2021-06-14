import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Button} from 'react-native-paper';
import {StyleSheet, View, Dimensions} from 'react-native';
let {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export default function Controls(props) {
  soundObject = props.soundObject;
  filehandler = props.filehandler;
  youTubeAPI = props.youTubeAPI;
  // TODO find better way of implementing this
  // soundObject.setYoutubeState(props.setParentState);
  const icon = useSelector((state) => state.icon.value);
  const dispatch = useDispatch();

  return (
    <View style={styles.bottomButtons}>
      <Button
        icon="rewind"
        style={styles.button}
        onPress={() => soundObject.startPlayListFrom('previous')}
      />
      <Button
        icon={icon}
        style={styles.button}
        onPress={() => soundObject.handleTrackPlayer()}
      />
      <Button
        icon="fast-forward"
        style={styles.button}
        onPress={() => soundObject.startPlayListFrom('next')}
      />
    </View>
  );
}
// CSS
const styles = StyleSheet.create({
  bottomButtons: {
    flex: 0.06,
    backgroundColor: '#1A1A1B',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  button: {
    width: screenWidth / 3,
  },
});

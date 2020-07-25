import React from 'react';
import {Button, TextInput} from 'react-native-paper';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
let {width: screenWidth, height: screenHeight} = Dimensions.get('window');
import RNPickerSelect from '../src/RNPickerSelect';
export default class PlayList extends React.Component {
  constructor(props) {
    super(props);
    // LogBox.ignoreAllLogs(value);
    this.soundObject = props.soundObject;
    this.filehandler = props.filehandler;
    this.youTubeAPI = props.youTubeAPI;
    this.state = {
      playListsNames: [{label: 'test', value: 'PlayList'}],
      currentSong: '',
      icon: 'play',
      playListIndex: 0,
      playListName: 'PlayList',
      playlist: [],
      trackLength: 1,
      trackPosition: 0,
      value: 'PL3AStYGqDKPyIkNTdHy9gEf35CNDKgL6b',
    };
  }
  componentDidMount = async () => {
    this.setState({
      playListsNames: await this.filehandler.loadFile('PlayListsNames'),
      playlist: await this.filehandler.loadFile(),
    });
  };
  nextSong = () => {
    console.log('nextsong');
    this.startPlayListFrom(this.state.playListIndex + 1);
  };
  startPlayListFrom = index => {
    console.log(index);
    console.log('startPlayListFrom');

    if (index >= 0 && index < this.state.playlist.length) {
      this.setState({playListIndex: index});
      console.log(this.state.currentSong);
      console.log(this.state.playlist[index]);
      this.soundObject.getSongURL(
        this.state.currentSong,
        this.state.playlist[index],
        this.setParentState,
        this.nextSong,
      );
    }
  };
  setParentState = data => {
    this.setState(data);
  };
  removeFromPlayList = async index => {
    let playlist = await this.filehandler.loadFile();
    playlist.splice(index, 1);
    this.saveFile(playlist);
  };
  saveFile = async data => {
    // console.log(data);
    try {
      this.filehandler.saveFile('PlayList', data);
      this.setState({
        playlist: await this.filehandler.loadFile(),
      });
    } catch (error) {
      console.log(error);
    }
  };
  onChangeText(text) {
    this.setState({
      value: text,
    });
  }
  refresh = async () => {
    this.setState({
      playlist: await this.filehandler.loadFile(this.state.playListName),
      playListsNames: await this.filehandler.loadFile('PlayListsNames'),
    });
  };
  removePlayList = async playListName => {
    for (let index = 0; index < this.state.playListsNames.length; index++) {
      const element = this.state.playListsNames[index].value;
      if (element == playListName && playListName != 'PlayList') {
        let data = this.state.playListsNames;
        data.splice(index, 1);
        this.setState({playListsNames: data});
        await this.filehandler.saveFile('PlayListsNames', data);
      }
    }
  };

  render = () => {
    return (
      <View style={styles.container}>
        <View>
          <RNPickerSelect
            placeholder={{}}
            onValueChange={async value =>
              await this.setState({playListName: value})
            }
            value={this.state.playListName}
            items={this.state.playListsNames}
          />
        </View>
        <View style={{padding: 10}}>
          <TextInput
            style={{
              height: screenHeight / 32,
            }}
            placeholder={'Enter youtube playlist id here.'}
            onChangeText={text => this.onChangeText(text)}
          />
        </View>
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={{width: screenWidth / 2}}
            onPress={async () => {
              await this.youTubeAPI.getYoutubePlayList(this.state.value),
                this.refresh();
            }}>
            <Text style={styles.item}>add playlist</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{width: screenWidth / 2}}
            onPress={async () => {
              this.removePlayList(this.state.playListName);
              this.filehandler.deleteFile(this.state.playListName);
            }}>
            <Text style={styles.item}>remove playlist</Text>
          </TouchableOpacity>
          <Button
            icon="refresh"
            style={{
              position: 'absolute',
              right: 0,
            }}
            onPress={async () => this.refresh()}
          />
        </View>
        <View
          style={{
            paddingLeft: 5,
            height: screenHeight / 1.65,
          }}>
          <FlatList
            data={this.state.playlist}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => this.startPlayListFrom(index)}
                style={{flexDirection: 'row'}}>
                <Image style={styles.image} source={{uri: item.imageURL}} />
                <Text style={styles.item}>{item.songName}</Text>
                <Button
                  style={{
                    position: 'absolute',
                    right: 0,
                  }}
                  icon="playlist-remove"
                  onPress={() => this.removeFromPlayList(index)}
                />
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={styles.bottom}>
          <View style={styles.bottomButtons}>
            <Button
              icon="rewind"
              style={styles.button}
              onPress={() =>
                this.startPlayListFrom(this.state.playListIndex - 1)
              }
            />
            <Button
              icon={this.state.icon}
              style={styles.button}
              onPress={() =>
                this.setState(this.soundObject.handleTrackPlayer())
              }
            />
            <Button
              icon="fast-forward"
              style={styles.button}
              onPress={() =>
                this.startPlayListFrom(this.state.playListIndex + 1)
              }
            />
          </View>
          {/* <Slider
            value={this.state.trackPosition}
            onSlidingComplete={this.onSeekSliderSlidingComplete}
            disabled={this.state.isLoading}
            maximumValue={this.state.trackLength}
          /> */}
        </View>
      </View>
    );
  };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: screenHeight / 32,
    backgroundColor: '#1A1A1B',
  },
  item: {
    padding: 2,
    fontSize: 18,
    height: screenHeight / 13,
    width: screenWidth / 1.35,
    color: '#ffffff',
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    width: screenWidth / 3,
  },
  image: {
    width: screenWidth / 8,
    height: screenWidth / 8,
  },
});

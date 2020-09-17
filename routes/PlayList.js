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
  RefreshControl,
  ScrollView,
} from 'react-native';
let {width: screenWidth, height: screenHeight} = Dimensions.get('window');
import RNPickerSelect from 'react-native-picker-select';

export default class PlayList extends React.Component {
  constructor(props) {
    super(props);
    // LogBox.ignoreAllLogs(value);
    this.soundObject = props.soundObject;
    this.filehandler = props.filehandler;
    this.youTubeAPI = props.youTubeAPI;
    this.soundObject.setPlayListState(this.setParentState);
    this.state = {
      playListsNames: [{label: 'test', value: 'PlayList'}],
      icon: 'play',
      playListName: 'PlayList',
      playList: [],
      trackLength: 1,
      trackPosition: 0,
      playListID: 'PL3AStYGqDKPzovoq8mTjpIS-w9ijoLhNf',
      refreshing: false,
    };
  }
  componentDidMount = async () => {
    this.setState({icon: this.soundObject.getIcon()});
    console.log(this.state.icon);
    playList = await this.filehandler.loadFile();
    this.soundObject.setPlayList(playList);
    this.soundObject.setPlayListName(this.state.playListName);
    this.setState({
      playListsNames: await this.filehandler.loadFile('PlayListsNames'),
      playList: playList,
    });
  };
  setParentState = (data) => {
    // console.log(data);
    this.setState(data);
  };
  removeFromPlayList = async (index, playListName) => {
    let playList = await this.filehandler.loadFile(playListName);
    playList.splice(index, 1);
    this.soundObject.setPlayList(playList);
    this.saveFile(playListName, playList);
  };
  saveFile = async (playListName, data) => {
    this.filehandler.saveFile(playListName, data);
    this.setState({
      playList: await this.filehandler.loadFile(playListName),
    });
  };
  onChangeText(text) {
    this.setState({
      playListID: text,
    });
  }
  refresh = async () => {
    console.log('refresh');
    playList = await this.filehandler.loadFile(this.state.playListName);
    this.soundObject.setPlayList(playList);
    this.soundObject.setPlayListName(this.state.playListName);
    // console.log(playList);
    // console.log(this.state.playListName);
    this.setState({
      playListsNames: await this.filehandler.loadFile('PlayListsNames'),
      playList: playList,
    });
  };
  removePlayList = async (playListName) => {
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
  shufflePlayList = (array) => {
    array.sort(() => Math.random() - 0.5);
    this.setState({playList: array});
  };
  setPlayListName = async (value) => {
    console.log('setPlayListName');
    this.soundObject.setPlayListName(value);
    await this.setState({playListName: value});
    this.refresh();
  };

  onRefresh() {
    this.refresh;
  }
  render = () => {
    return (
      <View style={styles.container}>
        <View>
          <RNPickerSelect
            placeholder={{}}
            onValueChange={async (value) => await this.setPlayListName(value)}
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
            onChangeText={(text) => this.onChangeText(text)}
          />
        </View>
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={{width: screenWidth / 3}}
            onPress={async () => {
              await this.youTubeAPI.getYoutubePlayList(this.state.playListID),
                this.refresh();
            }}>
            <Text style={styles.item}>add playlist</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{width: screenWidth / 3}}
            onPress={async () => {
              this.shufflePlayList(this.state.playList);
            }}>
            <Text style={styles.item}>shuffle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{width: screenWidth / 3}}
            onPress={async () => {
              this.removePlayList(this.state.playListName);
              this.filehandler.deleteFile(this.state.playListName);
            }}>
            <Text style={styles.item}>remove playlist</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingLeft: 5,
            height: screenHeight / 1.65,
          }}>
          <FlatList
            data={this.state.playList}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() =>
                  this.soundObject.startPlayListFrom(index, this.setParentState)
                }
                style={{flexDirection: 'row'}}>
                <Image style={styles.image} source={{uri: item.imageURL}} />
                <Text style={styles.item}>{item.songName}</Text>
                <Button
                  style={{
                    position: 'absolute',
                    right: 0,
                  }}
                  icon="playlist-remove"
                  onPress={() =>
                    this.removeFromPlayList(index, this.state.playListName)
                  }
                />
              </TouchableOpacity>
            )}
            refreshControl={
              <RefreshControl
                //refresh control used for the Pull to Refresh
                refreshing={this.state.refreshing}
                onRefresh={this.refresh}
              />
            }
          />
        </View>
        <View style={styles.bottom}>
          <View style={styles.bottomButtons}>
            <Button
              icon="rewind"
              style={styles.button}
              onPress={() =>
                this.soundObject.startPlayListFrom(
                  'previous',
                  this.setParentState,
                )
              }
            />
            <Button
              icon={this.state.icon}
              style={styles.button}
              onPress={() => this.soundObject.handleTrackPlayer()}
            />
            <Button
              icon="fast-forward"
              style={styles.button}
              onPress={() =>
                this.soundObject.startPlayListFrom('next', this.setParentState)
              }
            />
          </View>
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

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
} from 'react-native';
let {width: screenWidth, height: screenHeight} = Dimensions.get('window');
import RNPickerSelect from 'react-native-picker-select';

// PlayList class
export default class PlayList extends React.Component {
  constructor(props) {
    super(props);
    this.soundObject = props.soundObject;
    this.filehandler = props.filehandler;
    this.youTubeAPI = props.youTubeAPI;
    // TODO find better way of implementing this
    this.soundObject.setPlayListState(this.setParentState);
    this.state = {
      playListsNames: [{label: 'test', value: 'PlayList'}],
      playListName: 'PlayList',
      playList: [],
      playListID: '',
      refreshing: false,
    };
  }

  componentDidMount = async () => {
    // Gets the last played song, wich playlist was selected last
    userSettings = await this.filehandler.getUserSettings();

    this.setState({
      icon: this.soundObject.getIcon(),
      playListName: userSettings.playListName,
      playListsNames: await this.filehandler.loadFile('PlayListsNames'),
    });
  };

  // Set the state from a child element
  setParentState = (data) => {
    this.setState(data);
  };

  // Removes a song from the currently selected playList
  removeFromPlayList = async (index) => {
    let playList = await this.filehandler.loadFile(this.state.playListName);
    playList.splice(index, 1);
    this.soundObject.setPlayList(playList);
    this.filehandler.saveFile(this.state.playListName, playList);
    this.setState({
      playList: await this.filehandler.loadFile(this.state.playListName),
    });
  };

  // Sets the playListID
  onChangeText(text) {
    this.setState({
      playListID: text,
    });
  }

  // Refreshes the playList and PlayListsNames
  refresh = async () => {
    playList = await this.filehandler.loadFile(this.state.playListName);
    this.soundObject.setPlayList(playList);
    this.soundObject.setPlayListName(this.state.playListName);
    this.setState({
      playListsNames: await this.filehandler.loadFile('PlayListsNames'),
      playList: playList,
    });
  };

  // Removes a playList
  removePlayList = async (playListName) => {
    for (let index = 0; index < this.state.playListsNames.length; index++) {
      const element = this.state.playListsNames[index].value;
      // Trying to delete default PlayList will result in emptying it
      if (element == playListName && playListName != 'PlayList') {
        let data = this.state.playListsNames;
        data.splice(index, 1);
        this.setState({
          playListsNames: data,
        });
        await this.filehandler.deleteFile(this.state.playListName);
        await this.filehandler.saveFile('PlayListsNames', data);
      } else if (playListName == 'PlayList') {
        await this.filehandler.saveFile('PlayList', []);
      }
    }
  };

  // Shuffles the playList
  // refreshing after shuffle will return it to original
  shufflePlayList = (array) => {
    array.sort(() => Math.random() - 0.5);
    this.setState({playList: array});
  };

  // Sets the new playList then updates the userSettings and refreshes the flatlist with the new playList songs
  setPlayListName = async (playListName) => {
    this.soundObject.setPlayListName(playListName);
    this.setState({playListName: playListName});
    this.filehandler.setUserSettings({
      playListName: playListName,
      index: 0,
    });
    this.refresh();
  };

  render = () => {
    return (
      <View style={styles.container}>
        <View style={styles.listSelector}>
          <RNPickerSelect
            placeholder={{}}
            onValueChange={async (value) => await this.setPlayListName(value)}
            value={this.state.playListName}
            items={this.state.playListsNames}
          />
        </View>
        <View style={styles.input}>
          <TextInput
            style={styles.textInput}
            placeholder={'Enter youtube playlist id here.'}
            onChangeText={(text) => this.onChangeText(text)}
          />
        </View>
        <View style={styles.playListButtons}>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await this.youTubeAPI.getYoutubePlayList(this.state.playListID),
                this.refresh();
            }}>
            <Text style={styles.item}>add playlist</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              this.shufflePlayList(this.state.playList);
            }}>
            <Text style={styles.item}>shuffle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              this.removePlayList(this.state.playListName);
            }}>
            <Text style={styles.item}>remove playlist</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.list}>
          <FlatList
            data={this.state.playList}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() =>
                  this.soundObject.startPlayListFrom(index, this.setParentState)
                }
                style={styles.flatList}>
                <Image style={styles.image} source={{uri: item.imageURL}} />
                <Text style={styles.item}>{item.songName}</Text>
                <Button
                  style={styles.removeFromPlayListButton}
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
        {/* <View style={styles.bottomButtons}>
          <Button
            icon="rewind"
            style={styles.button}
            onPress={() => this.soundObject.startPlayListFrom('previous')}
          />
          <Button
            icon={this.state.icon}
            style={styles.button}
            onPress={() => this.soundObject.handleTrackPlayer()}
          />
          <Button
            icon="fast-forward"
            style={styles.button}
            onPress={() => this.soundObject.startPlayListFrom('next')}
          />
        </View> */}
      </View>
    );
  };
}
// CSS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: screenHeight / 32 - 10,
    backgroundColor: '#1A1A1B',
  },
  listSelector: {
    alignItems: 'center',
    flex: 0.06,
  },
  input: {
    paddingTop: 10,
    flex: 0.06,
  },
  playListButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 0.06,
  },
  list: {
    paddingLeft: 5,
    paddingBottom: 10,
    flex: 0.76,
  },
  flatList: {
    flexDirection: 'row',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flex: 0.06,
  },
  item: {
    padding: 2,
    fontSize: 18,
    height: screenHeight / 13,
    width: screenWidth / 1.35,
    color: '#ffffff',
  },
  button: {
    width: screenWidth / 3,
  },
  image: {
    width: screenWidth / 8,
    height: screenWidth / 8,
  },
  removeFromPlayListButton: {
    position: 'absolute',
    right: 0,
  },
  textInput: {
    height: screenHeight / 32,
  },
});

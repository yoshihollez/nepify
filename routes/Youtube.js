import React from 'react';
import {TextInput, Button} from 'react-native-paper';
import {
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

let {width: screenWidth, height: screenHeight} = Dimensions.get('window');
export default class Youtube extends React.Component {
  constructor(props) {
    super(props);
    this.soundObject = props.soundObject;
    this.filehandler = props.filehandler;
    this.youTubeAPI = props.youTubeAPI;
    // TODO find better way of implementing this
    this.soundObject.setYoutubeState(this.setParentState);

    this.state = {
      youTubeSearchTerm: 'zack hemsey',
      results: [],
      showCarousel: false,
      currentSong: '',
      icon: 'play',
      playListName: 'PlayList',
    };
  }
  componentDidMount = async () => {
    // Gets the last played song, wich playlist was selected last
    userSettings = await this.filehandler.getUserSettings();
    // If there was no song being played from a playlist there will be no notifcation to resume.
    this.soundObject.setNotification({
      title: userSettings.songName,
      artwork: userSettings.imageURL, // URL or RN's image require()
      artist: userSettings.channel,
    });
    this.setState({
      icon: this.soundObject.getIcon(),
      playListName: userSettings.playListName,
    });
    // This is for the first time the app is started. A file named PlayList will be made.
    if ((await this.filehandler.loadFile('PlayList')) == null) {
      // console.log("PlayList file doens't exist");
      await this.filehandler.saveFile('PlayList', []);
    }
    // This is for the first time the app is started. A file named PlayListsNames will be made where all playList names will be stored in.
    if ((await this.filehandler.loadFile('PlayListsNames')) == null) {
      // console.log("PlayListsNames file doens't exist");
      await this.filehandler.saveFile('PlayListsNames', [
        {
          value: 'PlayList',
          key: 'PlayList',
          label: 'PlayList',
          default: true,
          color: '#9EA0A4',
        },
      ]);
    }

    playList = await this.filehandler.loadFile(this.state.playListName);
    this.soundObject.setPlayList(playList);
    this.soundObject.setPlayListName(this.state.playListName);
    this.soundObject.setPlayListIndex(userSettings.index);
  };

  onChangeText(text) {
    this.setState({
      youTubeSearchTerm: text,
    });
  }

  // Adds songs to the playList
  addToPlayList = async (item) => {
    let playList = [];
    let temp = await this.filehandler.loadFile(
      this.soundObject.getPlayListName(),
    );
    if (temp != null) {
      playList = temp;
    }

    // checks if song is already in playlist
    const alreadyContains = playList.some(
      (element) => element.key === item.key,
    );
    if (!alreadyContains) {
      playList.push(item);
      this.filehandler.saveFile(this.soundObject.getPlayListName(), playList);
    } else {
      console.log('already contains');
    }
  };

  // Set the state from a child element
  setParentState = (data) => {
    this.setState(data);
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.input}>
          <TextInput
            style={{
              width: screenWidth / 2,
            }}
            onChangeText={(text) => this.onChangeText(text)}
          />
          <Button
            icon="search-web"
            onPress={async () =>
              this.setState(
                await this.youTubeAPI.getYoutubeVids(
                  this.state.youTubeSearchTerm,
                ),
              )
            }>
            Search
          </Button>
        </View>
        <View style={styles.list}>
          <FlatList
            data={this.state.results}
            renderItem={({item, index}) => (
              <View
                style={{
                  flexDirection: 'row',
                  paddingRight: screenWidth / 4,
                }}>
                <Image style={styles.image} source={{uri: item.imageURL}} />
                <TouchableOpacity
                  onPress={() => this.soundObject.playSong(item)}>
                  <Text style={styles.item}>
                    {item.songName.replace('&quot;', ' ').replace('&#39;', "'")}
                  </Text>
                </TouchableOpacity>
                <Button
                  style={{
                    position: 'absolute',
                    right: 0,
                  }}
                  icon="playlist-plus"
                  onPress={() =>
                    this.addToPlayList({
                      key: item.key,
                      songName: item.songName
                        .replace('&quot;', ' ')
                        .replace('&#39;', "'"),
                      imageURL: item.imageURL,
                      // artist: item.channel,
                    })
                  }
                />
              </View>
            )}
          />
        </View>
        <View style={styles.bottom}>
          <View style={styles.bottomButtons}>
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
          </View>
        </View>
      </View>
    );
  }
}

// CSS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: screenHeight / 32,
    backgroundColor: '#1A1A1B',
  },
  input: {
    alignItems: 'center',
    flex: 1.5,
  },
  list: {
    paddingLeft: 5,
    paddingBottom: 25,
    paddingTop: 15,
    flex: 3.5,
  },
  image: {
    width: screenWidth / 8,
    height: screenWidth / 8,
  },
  item: {
    padding: 5,
    fontSize: 18,
    height: screenHeight / 13,
    width: screenWidth / 1.35,
    color: '#FFFFFF',
  },
  bottom: {
    flex: 0.5,
    justifyContent: 'flex-end',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    width: screenWidth / 3,
  },
});

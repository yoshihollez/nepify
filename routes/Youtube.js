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
    this.soundObject.setYoutubeState(this.setParentState);

    this.state = {
      value: 'zack hemsey',
      results: [],
      showCarousel: false,
      currentSong: '',
      icon: 'play',
      playListName: 'PlayList',
    };
  }
  componentDidMount = async () => {
    userSettings = await this.filehandler.getUserSettings();
    this.setState({
      icon: this.soundObject.getIcon(),
      playListName: userSettings.playListName,
    });
    if ((await this.filehandler.loadFile('PlayList')) == null) {
      // console.log("PlayList file doens't exist");
      await this.filehandler.saveFile('PlayList', []);
    }
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
      value: text,
    });
  }
  addToPlayList = async (item) => {
    let playList = [];
    let temp = await this.filehandler.loadFile(
      this.soundObject.getPlayListName(),
    );
    console.log('temp');
    console.log(temp);
    if (temp != null) {
      playList = temp;
    }
    const alreadyContains = playList.some(
      (element) => element.key === item.key,
    );

    if (!alreadyContains) {
      console.log('adding');
      playList.push(item);
      this.filehandler.saveFile(this.soundObject.getPlayListName(), playList);
    } else {
      console.log('already contains');
    }
  };

  setParentState = (data) => {
    // console.log(data);
    this.setState(data);
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
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
                await this.youTubeAPI.getYoutubeVids(this.state.value),
              )
            }>
            Search
          </Button>
        </View>
        <View
          style={{
            paddingLeft: 5,
            paddingBottom: 25,
            paddingTop: 15,
            height: screenHeight / 1.5,
          }}>
          <FlatList
            data={this.state.results}
            renderItem={({item, index}) => (
              <View
                style={{
                  flexDirection: 'row',
                  paddingRight: screenWidth / 4,
                }}>
                <Image style={styles.image} source={{uri: item.videoImg}} />
                <TouchableOpacity
                  onPress={() =>
                    this.soundObject.playSong(
                      this.state.currentSong,
                      item,
                      this.setParentState,
                    )
                  }>
                  <Text style={styles.item}>
                    {item.videoTitle
                      .replace('&quot;', ' ')
                      .replace('&#39;', "'")}
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
                      songName: item.videoTitle
                        .replace('&quot;', ' ')
                        .replace('&#39;', "'"),
                      imageURL: item.videoImg,
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
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: screenHeight / 32,
    backgroundColor: '#1A1A1B',
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
});

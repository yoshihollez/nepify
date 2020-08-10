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

    this.state = {
      value: 'zack hemsey',
      results: [],
      showCarousel: false,
      uri: '',
      currentSong: '',
      icon: 'play',
      trackLength: 1,
      trackPosition: 0,
      playListName: 'PlayList',
    };
  }
  componentDidMount = async () => {
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
    } else {
      // console.log('PlayListsNames file exists');
      // console.log(await this.filehandler.loadFile('PlayListsNames'));
    }
  };
  onChangeText(text) {
    this.setState({
      value: text,
    });
  }
  addToPlayList = async item => {
    let playList = [];
    let temp = await this.filehandler.loadFile();
    console.log('temp');
    console.log(temp);
    if (temp != null) {
      playList = temp;
    }
    const alreadyContains = playList.some(element => element.key === item.key);

    if (!alreadyContains) {
      console.log('adding');
      playList.push(item);
      this.filehandler.saveFile(this.state.playListName, playList);
    } else {
      console.log('already contains');
    }
  };

  setParentState = data => {
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
            onChangeText={text => this.onChangeText(text)}
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
            height: screenHeight / 1.4,
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
                this.startPlayListFrom(this.state.playListIndex - 1)
              }
            />
            <Button
              icon={this.state.icon}
              style={styles.button}
              onPress={() =>
                this.setState(
                  this.soundObject.handleTrackPlayer(this.state.uri),
                )
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

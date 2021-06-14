import React, {useState, useEffect} from 'react';
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
export default function Youtube(props) {
  soundObject = props.soundObject;
  filehandler = props.filehandler;
  youTubeAPI = props.youTubeAPI;

  const [youTubeSearchTerm, setYouTubeSearchTerm] = useState('zack hemsey');
  const [results, setResults] = useState([]);
  const [playListName, setPlayListName] = useState('PlayList');

  useEffect(() => {
    // Gets the last played song, wich playlist was selected last
    async function fetchData() {
      // Gets the last played song, wich playlist was selected last
      userSettings = await filehandler.getUserSettings();
      // If there was no song being played from a playlist there will be no notifcation to resume.
      soundObject.setNotification({
        title: userSettings.songName,
        artwork: userSettings.imageURL, // URL or RN's image require()
        artist: userSettings.channel,
      });
      setPlayListName(userSettings.playListName);
      // This is for the first time the app is started. A file named PlayList will be made.
      if ((await filehandler.loadFile('PlayList')) == null) {
        // console.log("PlayList file doens't exist");
        await filehandler.saveFile('PlayList', []);
      }
      // This is for the first time the app is started. A file named PlayListsNames will be made where all playList names will be stored in.
      if ((await filehandler.loadFile('PlayListsNames')) == null) {
        // console.log("PlayListsNames file doens't exist");
        await filehandler.saveFile('PlayListsNames', [
          {
            value: 'PlayList',
            key: 'PlayList',
            label: 'PlayList',
            default: true,
            color: '#9EA0A4',
          },
        ]);
      }

      playList = await filehandler.loadFile(playListName);
      soundObject.setPlayList(playList);
      soundObject.setPlayListName(playListName);
      soundObject.setPlayListIndex(userSettings.index);
    }
    fetchData();
  }, []); //notice the empty array here

  onChangeText = (text) => {
    setState({
      youTubeSearchTerm: text,
    });
  };

  // Adds songs to the playList
  addToPlayList = async (item) => {
    let playList = [];
    let temp = await filehandler.loadFile(soundObject.getPlayListName());
    if (temp != null) {
      playList = temp;
    }

    // checks if song is already in playlist
    const alreadyContains = playList.some(
      (element) => element.key === item.key,
    );
    if (!alreadyContains) {
      playList.push(item);
      filehandler.saveFile(soundObject.getPlayListName(), playList);
    } else {
      console.log('already contains');
    }
  };

  // Set the state from a child element
  setParentState = (data) => {
    setState(data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => onChangeText(text)}
        />
        <Button
          icon="search-web"
          onPress={async () =>
            setState(await youTubeAPI.getYoutubeVids(youTubeSearchTerm))
          }>
          Search
        </Button>
      </View>
      <View style={styles.list}>
        <FlatList
          data={results}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => soundObject.playSong(item)}
              style={styles.flatList}>
              <Image style={styles.image} source={{uri: item.imageURL}} />
              <Text style={styles.item}>
                {item.songName.replace('&quot;', ' ').replace('&#39;', "'")}
              </Text>
              <Button
                style={styles.addToPlayListButton}
                icon="playlist-plus"
                onPress={() =>
                  addToPlayList({
                    key: item.key,
                    songName: item.songName
                      .replace('&quot;', ' ')
                      .replace('&#39;', "'"),
                    imageURL: item.imageURL,
                    // artist: item.channel,
                  })
                }
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
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
    flex: 0.18,
  },
  list: {
    paddingLeft: 5,
    paddingBottom: 10,
    flex: 0.76,
  },
  textInput: {
    width: screenWidth / 2,
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
  flatList: {
    flexDirection: 'row',
  },
  bottomButtons: {
    flex: 0.06,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  addToPlayListButton: {
    position: 'absolute',
    right: 0,
  },
  button: {
    width: screenWidth / 3,
  },
});

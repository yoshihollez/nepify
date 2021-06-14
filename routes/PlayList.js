import React, {useState, useEffect} from 'react';
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

// PlayList function
export default function PlayList(props) {
  soundObject = props.soundObject;
  filehandler = props.filehandler;
  youTubeAPI = props.youTubeAPI;

  const [playListsNames, setPlayListsNames] = useState([
    {label: 'test', value: 'PlayList'},
  ]);
  const [playListName, setPlayListName] = useState('PlayList');
  const [playList, setPlayList] = useState([]);
  const [playListID, setPlayListID] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Gets the last played song, wich playlist was selected last
    async function fetchData() {
      userSettings = await filehandler.getUserSettings();
      setPlayListName(userSettings.playListName);
      setPlayListsNames(await filehandler.loadFile('PlayListsNames'));
    }
    fetchData();
  }, []); //notice the empty array here

  // Set the state from a child element
  // const setParentState = (data) => {
  //   setState(data);
  // };

  // Removes a song from the currently selected playList
  const removeFromPlayList = async (index) => {
    let playList = await filehandler.loadFile(playListName);
    playList.splice(index, 1);
    soundObject.setPlayList(playList);
    filehandler.saveFile(playListName, playList);
    setPlayList(playList);
  };

  // Sets the playListID
  const onChangeText = (text) => {
    setPlayListID(text);
  };

  // Refreshes the playList and PlayListsNames
  const refresh = async () => {
    playListArray = await filehandler.loadFile(playListName);
    soundObject.setPlayList(playListArray);
    soundObject.setPlayListName(playListName);
    setPlayListsNames(await filehandler.loadFile('PlayListsNames'));
    setPlayList(playListArray);
  };

  // Removes a playList
  const removePlayList = async (playListName) => {
    for (let index = 0; index < playListsNames.length; index++) {
      const element = playListsNames[index].value;
      // Trying to delete default PlayList will result in emptying it
      if (element == playListName && playListName != 'PlayList') {
        let data = playListsNames;
        data.splice(index, 1);
        setPlayListsNames(data);

        await filehandler.deleteFile(playListName);
        await filehandler.saveFile('PlayListsNames', data);
      } else if (playListName == 'PlayList') {
        await filehandler.saveFile('PlayList', []);
      }
    }
  };

  // Shuffles the playList
  // refreshing after shuffle will return it to original
  const shufflePlayList = (array) => {
    array.sort(() => Math.random() - 0.5);
    setPlayList(array);
  };

  // Sets the new playList then updates the userSettings and refreshes the flatlist with the new playList songs
  const handlePlayList = (playListName) => {
    soundObject.setPlayListName(playListName);
    setPlayListName(playListName);
    filehandler.setUserSettings({
      playListName: playListName,
      index: 0,
    });
    refresh();
  };

  return (
    <View style={styles.container}>
      <View style={styles.listSelector}>
        <RNPickerSelect
          placeholder={{}}
          onValueChange={(value) => handlePlayList(value)}
          value={playListName}
          items={playListsNames}
        />
      </View>
      <View style={styles.input}>
        <TextInput
          style={styles.textInput}
          placeholder={'Enter youtube playlist id here.'}
          onChangeText={(text) => onChangeText(text)}
        />
      </View>
      <View style={styles.playListButtons}>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            await youTubeAPI.getYoutubePlayList(playListID), refresh();
          }}>
          <Text style={styles.item}>add playlist</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            shufflePlayList(playList);
          }}>
          <Text style={styles.item}>shuffle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            removePlayList(playListName);
          }}>
          <Text style={styles.item}>remove playlist</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.list}>
        <FlatList
          data={playList}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => soundObject.startPlayListFrom(index)}
              style={styles.flatList}>
              <Image style={styles.image} source={{uri: item.imageURL}} />
              <Text style={styles.item}>{item.songName}</Text>
              <Button
                style={styles.removeFromPlayListButton}
                icon="playlist-remove"
                onPress={() => removeFromPlayList(index, playListName)}
              />
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={refreshing}
              onRefresh={refresh}
            />
          }
        />
      </View>
    </View>
  );
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

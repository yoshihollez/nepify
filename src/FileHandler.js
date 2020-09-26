import AsyncStorage from '@react-native-community/async-storage';

export default class FileHandler {
  constructor() {}
  loadPlayListNames = async () => {
    try {
      let temp = await AsyncStorage.getItem('PlayListsNames');
      return JSON.parse(temp);
    } catch (error) {
      console.log(error);
    }
  };
  loadFile = async (fileName = 'PlayList') => {
    try {
      // console.log(fileName);
      let temp = await AsyncStorage.getItem(fileName);
      // console.log(JSON.parse(temp));
      return JSON.parse(temp);
    } catch (error) {
      console.log(error);
    }
  };
  saveFile = async (fileName = 'PlayList', data) => {
    try {
      // console.log(fileName);
      await AsyncStorage.setItem(fileName, JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  };
  deleteFile = async (fileName) => {
    try {
      await AsyncStorage.removeItem(fileName);
    } catch (error) {
      console.log(error);
    }
  };
  getUserSettings = async () => {
    let userSettings = await this.loadFile('UserSettings');
    if (userSettings == null) {
      // console.log("PlayListsNames file doens't exist");
      await this.saveFile('UserSettings', {
        playListName: 'PlayList',
        index: 0,
      });
      return {
        playListName: 'PlayList',
        index: 0,
      };
    } else {
      return userSettings;
    }
  };
  setUserSettings = async (data) => {
    await this.saveFile('UserSettings', data);
  };
}

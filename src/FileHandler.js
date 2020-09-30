import AsyncStorage from '@react-native-community/async-storage';

export default class FileHandler {
  constructor() {}

  // Loads data from file and returns parsed data.
  loadFile = async (fileName = 'PlayList') => {
    try {
      let fileData = await AsyncStorage.getItem(fileName);
      return JSON.parse(fileData);
    } catch (error) {
      console.log(error);
    }
  };

  // Save data to file
  saveFile = async (fileName = 'PlayList', data) => {
    try {
      await AsyncStorage.setItem(fileName, JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  };

  // Deletes a file.
  deleteFile = async (fileName) => {
    try {
      await AsyncStorage.removeItem(fileName);
    } catch (error) {
      console.log(error);
    }
  };

  // return userSettings and if no file UserSettings exists create one
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

  // Set userSettings
  setUserSettings = async (data) => {
    await this.saveFile('UserSettings', data);
  };
}

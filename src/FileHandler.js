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
  deleteFile = async fileName => {
    try {
      await AsyncStorage.removeItem(fileName);
    } catch (error) {
      console.log(error);
    }
  };
}

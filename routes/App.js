import React from 'react';
import {BottomNavigation} from 'react-native-paper';
import PlayList from './PlayList';
import Youtube from './Youtube';
import SoundHandler from '../src/SoundHandler';
import Filehandler from '../src/FileHandler';
import YouTubeAPI from '../src/YouTubeAPI';
import RNDisableBatteryOptimizationsAndroid from 'react-native-disable-battery-optimizations-android';

RNDisableBatteryOptimizationsAndroid.isBatteryOptimizationEnabled().then(
  (isEnabled) => {
    if (isEnabled) {
      RNDisableBatteryOptimizationsAndroid.openBatteryModal();
    }
  },
);

let soundObject = new SoundHandler();
let filehandler = new Filehandler();
let youTubeAPI = new YouTubeAPI();

export default class App extends React.Component {
  state = {
    index: 0,
    routes: [
      {
        key: 'music',
        title: 'Music',
        icon: 'search-web',
      },
      {
        key: 'playlist',
        title: 'playlist',
        icon: 'playlist-music',
      },
    ],
  };

  searchSongs = () => (
    <Youtube
      soundObject={soundObject}
      filehandler={filehandler}
      youTubeAPI={youTubeAPI}
    />
  );

  playList = () => (
    <PlayList
      soundObject={soundObject}
      filehandler={filehandler}
      youTubeAPI={youTubeAPI}
    />
  );

  _handleIndexChange = (index) => this.setState({index});

  _renderScene = BottomNavigation.SceneMap({
    music: this.searchSongs,
    playlist: this.playList,
  });

  render() {
    return (
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
      />
    );
  }
}

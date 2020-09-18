var Sound = require('react-native-sound');
Sound.setCategory('Playback');
import YouTubeAPI from './YouTubeAPI';
import FileHandler from './FileHandler';

let youTubeAPI = new YouTubeAPI();
let fileHandler = new FileHandler();

export default class SoundHandler {
  constructor() {
    this.soundObject = new Sound('', null);
    this.setNextSong;
    this.currentSong = 'leeg';
    this.playList = [];
    this.playListName;
    this.playListIndex = 0;
    this.icon = 'play';
    this.youtubeState;
    this.playListState;
  }
  getIcon = () => {
    return this.icon;
  };
  setPlayListIndex = (index) => {
    this.playListIndex = index;
  };
  setYoutubeState = (setState) => {
    this.youtubeState = setState;
  };
  setPlayListState = (setState) => {
    this.playListState = setState;
  };
  editParentStates = (data) => {
    this.youtubeState(data);
    try {
      this.playListState(data);
    } catch (error) {}
  };

  playTrack = (uri) => {
    console.log('playtrack');
    if (!this.soundObject.isLoaded()) {
      console.log(this.soundObject.isLoaded());
      try {
        this.soundObject = new Sound(uri, null, (e) => {
          if (e) {
            console.log('error loading track:', e);
          } else {
            this.resumeTrack();
          }
        });
      } catch (error) {
        console.log('error');
        console.log(error);
      }
    } else {
      this.resumeTrack();
    }
  };
  pauseTrack = () => {
    console.log('pauseTrack');
    try {
      this.soundObject.pause();
    } catch (error) {
      console.log(error);
    }
  };
  resumeTrack = () => {
    console.log('resumeTrack');
    try {
      this.soundObject.play((success) => {
        if (success) {
          console.log('successfully finished playing');
          this.setNextSong();
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  unloadTrack = () => {
    console.log('unloadTrack');
    try {
      this.soundObject.stop();
      this.soundObject.release();
    } catch (error) {
      console.log(error);
    }
  };
  handleTrackPlayer = async (uri) => {
    console.log('handleTrackPlayer');
    if (this.soundObject.isPlaying()) {
      this.pauseTrack();
      this.icon = 'play';
      this.editParentStates({icon: 'play'});
      return {icon: 'play'};
    } else if (this.soundObject.isLoaded() || uri != undefined) {
      this.playTrack(uri);
      this.icon = 'pause';
      this.editParentStates({icon: 'pause'});
      return {icon: 'pause'};
    } else {
      let songData = await youTubeAPI.getSongURL(
        'https://www.youtube.com/watch?v=' +
          this.playList[this.playListIndex].key,
      );
      this.handleTrackPlayer(songData[0].url);
    }
  };
  playSong = async (currentSong, item, setParentState, nextSong) => {
    console.log('playSong');
    // after update to ytdl full url is now needed
    this.setNextSong = nextSong;
    this.pauseTrack();
    //if statement currently of no use
    if (this.currentSong != item.songName) {
      this.currentSong = item.songName;
      this.urls = await youTubeAPI.getSongURL(
        'https://www.youtube.com/watch?v=' + item.key,
      );
      this.unloadTrack();
      this.handleTrackPlayer(this.urls[0].url);
    } else {
      this.handleTrackPlayer();
    }
  };
  getSoundObject = () => {
    return this.soundObject;
  };
  setPlayList = (playList) => {
    this.playList = playList;
  };
  setPlayListName = (playListName) => {
    this.playListName = playListName;
  };
  getPlayListName = () => {
    return this.playListName;
  };

  startPlayListFrom = (index, setParentState) => {
    console.log('startPlayListFrom');
    if (index == 'next') {
      index = this.playListIndex + 1;
    } else if (index == 'previous') {
      index = this.playListIndex - 1;
    }
    if (index >= 0 && index < this.playList.length) {
      this.playListIndex = index;
      console.log(this.playListIndex);
      fileHandler.setUserSettings({
        playListName: this.playListName,
        index: this.playListIndex,
      });
      this.playSong(
        this.currentSong,
        this.playList[index],
        setParentState,
        this.nextSong,
      );
    }
  };
  nextSong = () => {
    console.log('nextsong');
    this.startPlayListFrom(this.playListIndex + 1);
  };
}

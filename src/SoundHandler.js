var Sound = require('react-native-sound');
Sound.setCategory('Playback');
import YouTubeAPI from './YouTubeAPI';
import FileHandler from './FileHandler';
import MusicControl from 'react-native-music-control';
import store from './store';
import {play, pause} from '../src/ControlSlice';

let youTubeAPI = new YouTubeAPI();
let fileHandler = new FileHandler();

export default class SoundHandler {
  constructor() {
    // Creates new soudn object
    this.soundObject = new Sound('', null);
    -this.setNextSong;
    this.currentSong = '';
    this.artist = '';
    this.playList = [];
    this.playListName;
    this.playListIndex = 0;
    this.shouldNotificationBeVisible = false;

    // Basic Controls for notification
    MusicControl.enableControl('play', true);
    MusicControl.enableControl('pause', true);
    MusicControl.enableControl('nextTrack', true);
    MusicControl.enableControl('previousTrack', true);

    MusicControl.on('play', () => {
      //   console.log('notification play');
      this.handleTrackPlayer();
    });
    // on iOS this event will also be triggered by audio router change events
    // happening when headphones are unplugged or a bluetooth audio peripheral disconnects from the device
    MusicControl.on('pause', () => {
      //   console.log('notification pause');
      this.handleTrackPlayer();
    });
    MusicControl.on('nextTrack', () => {
      this.nextSong();
    });
    MusicControl.on('previousTrack', () => {
      this.previousSong();
    });
  }

  // sets the playListIndex
  setPlayListIndex = (index) => {
    this.playListIndex = index;
  };

  // plays a song
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

  // pauses the current song
  pauseTrack = () => {
    console.log('pauseTrack');
    try {
      this.soundObject.pause();
    } catch (error) {
      console.log(error);
    }
  };

  // resumes the current song
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

  // stops the current song and unloads it
  unloadTrack = () => {
    console.log('unloadTrack');
    try {
      this.soundObject.stop();
      this.soundObject.release();
    } catch (error) {
      console.log(error);
    }
  };

  // Handles wether sound object has to pause song or play it
  handleTrackPlayer = async (uri) => {
    // console.log('handleTrackPlayer');
    if (this.soundObject.isPlaying()) {
      this.pauseTrack();
      store.dispatch(play());
      if (this.shouldNotificationBeVisible) {
        MusicControl.updatePlayback({
          state: MusicControl.STATE_PAUSED,
        });
      }
    } else if (this.soundObject.isLoaded() || uri != undefined) {
      this.playTrack(uri);
      store.dispatch(pause());
      if (this.shouldNotificationBeVisible) {
        MusicControl.updatePlayback({
          state: MusicControl.STATE_PLAYING,
        });
      }
    } else {
      let playList = store.getState().playList.playList;
      let songData = await youTubeAPI.getSongURL(
        'https://www.youtube.com/watch?v=' + playList[this.playListIndex].key,
      );
      console.log(songData);
      this.handleTrackPlayer(songData[0].url);
    }
  };

  // plays song
  playSong = async (item, nextSong) => {
    console.log('playSong');
    let playList = store.getState().playList.playList;
    // after update to ytdl full url is now needed
    this.setNextSong = nextSong;
    this.pauseTrack();
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
    this.setNotification({
      title: playList[this.playListIndex].songName,
      artwork: playList[this.playListIndex].imageURL, // URL or RN's image require()
      artist: playList[this.playListIndex].channel,
    });
  };

  // returns sound object
  getSoundObject = () => {
    return this.soundObject;
  };

  // returns playList
  setPlayList = (playList) => {
    this.playList = playList;
  };

  // returns playListName
  setPlayListName = (playListName) => {
    this.playListName = playListName;
  };

  // returns playListName
  getPlayListName = () => {
    return this.playListName;
  };

  // Starts playing songs from a playList at a certain position
  startPlayListFrom = (index) => {
    let playList = store.getState().playList.playList;
    console.log('startPlayListFrom');
    if (index == 'next') {
      index = this.playListIndex + 1;
    } else if (index == 'previous') {
      index = this.playListIndex - 1;
    }
    if (index >= 0 && index < playList.length) {
      this.playListIndex = index;
      fileHandler.setUserSettings({
        playListName: this.playListName,
        index: this.playListIndex,
        songName: playList[this.playListIndex].songName,
        imageURL: playList[this.playListIndex].imageURL, // URL or RN's image require()
        channel: playList[this.playListIndex].channel,
      });
      this.playSong(playList[index], this.nextSong);
    }
  };

  // plays next song in the playList
  nextSong = () => {
    console.log('nextsong');
    this.startPlayListFrom(this.playListIndex + 1);
  };

  // plays previous song in the playList
  previousSong = () => {
    console.log('nextsong');
    this.startPlayListFrom(this.playListIndex - 1);
  };

  // creates notification or hides it
  setNotification = (settings) => {
    if (settings.artwork !== undefined) {
      this.shouldNotificationBeVisible = true;
      MusicControl.setNowPlaying(settings);
    } else {
      this.shouldNotificationBeVisible = false;
      MusicControl.resetNowPlaying();
    }
  };
}

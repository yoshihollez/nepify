var Sound = require('react-native-sound');
Sound.setCategory('Playback');
import YouTubeAPI from './YouTubeAPI';
let youTubeAPI = new YouTubeAPI();

export default class SoundHandler {
  constructor() {
    this.soundObject = new Sound('', null);
    this.setNextSong;
  }
  playTrack = uri => {
    console.log('playtrack');
    if (!this.soundObject.isLoaded()) {
      try {
        this.soundObject = new Sound(uri, null, e => {
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
      this.soundObject.play(success => {
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
  handleTrackPlayer = uri => {
    console.log('handleTrackPlayer');
    if (this.soundObject.isPlaying()) {
      this.pauseTrack();
      return {icon: 'play'};
    } else {
      this.playTrack(uri);
      return {icon: 'pause'};
    }
  };
  playSong = async (currentSong, item, setParentState, nextSong) => {
    console.log('playSong');
    // after update to ytdl full url is now needed
    this.setNextSong = nextSong;
    this.pauseTrack();
    //if statement currently of no use
    if (currentSong != item.songName) {
      let urls = await youTubeAPI.getSongURLS(
        'https://www.youtube.com/watch?v=' + item.key,
      );
      // console.log(urls[0].url);
      this.unloadTrack();
      setParentState({
        currentSong: item.videoTitle,
        uri: urls[0].url,
        icon: this.handleTrackPlayer(urls[0].url).icon,
      });
    } else {
      return this.handleTrackPlayer();
    }
  };
  getSoundObject = () => {
    return this.soundObject;
  };
}

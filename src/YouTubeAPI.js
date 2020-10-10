import {API_KEY} from '@env';
import ytdl from 'react-native-ytdl';
import Filehandler from './FileHandler';

let filehandler = new Filehandler();

export default class YouTubeAPI {
  constructor() {
    this.key = API_KEY;
  }

  // searches for youtube videos with a specific search term
  getYoutubeVids = async (searchValue) => {
    let songs = [];
    // creates api url
    let url =
      'https://www.googleapis.com/youtube/v3/search?key=' +
      this.key +
      '&part=snippet&q=' +
      searchValue +
      '&maxResults=25&type=video';

    // fetch api data
    await fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        for (let index = 0; index < responseJson.items.length; index++) {
          const element = responseJson.items[index];
          songs.push({
            songName: element.snippet.title.replace('&quot;', ' '),
            imageURL: element.snippet.thumbnails.medium.url,
            channel: element.snippet.channelTitle,
            key: element.id.videoId,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return {results: songs, showCarousel: true};
  };

  // returns a link to a audio file using a youtube link
  getSongURL = async (url) => {
    console.log('getSongURL');
    console.log(url);
    return await ytdl(url, {
      quality: 'highestaudio',
    });
  };

  // gets songs from youtube playList and saves them in file
  getYoutubePlayList = async (userInput) => {
    try {
      let newPlayListArray = [];
      let token = '';
      let playListID = '';
      // api url

      if (userInput.includes('https://www.youtube.com/playlist?list=')) {
        playListID = userInput.replace(
          'https://www.youtube.com/playlist?list=',
          '',
        );
      } else {
        playListID = userInput;
      }
      console.log(playListID);
      let url =
        'https://www.googleapis.com/youtube/v3/playlistItems?key=' +
        this.key +
        '&part=snippet&maxResults=50&playlistId=' +
        playListID +
        '&pageToken=' +
        token;
      // only 50 songs can be requested per call so tokens are needed
      do {
        url =
          'https://www.googleapis.com/youtube/v3/playlistItems?key=' +
          this.key +
          '&part=snippet&maxResults=50&playlistId=' +
          playListID +
          '&pageToken=' +
          token;
        await fetch(url)
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.nextPageToken) {
              token = responseJson.nextPageToken;
            } else token = false;
            if (
              responseJson.error != undefined &&
              responseJson.error.code == 404
            ) {
              alert('Playlist not found.');
              throw 'Playlist not found.';
            }
            responseJson.items.forEach((element) => {
              newPlayListArray.push({
                key: element.snippet.resourceId.videoId,
                songName: element.snippet.title.replace('&quot;', ' '),
                imageURL: element.snippet.thumbnails.medium.url,
                channel: '',
              });
            });
          });
      } while (token);

      let playListNames = await filehandler.loadFile('PlayListsNames');

      let bool = false;
      for (let index = 0; index < playListNames.length; index++) {
        const element = playListNames[index].key;
        if (element == playListID) {
          bool = true;
        }
      }
      let urlForPlayListName =
        'https://www.googleapis.com/youtube/v3/playlists?part=snippet%2Clocalizations&id=' +
        playListID +
        '&fields=items(localizations%2Csnippet%2Flocalized%2Ftitle)&key=' +
        this.key;
      playListName = await fetch(urlForPlayListName)
        .then((response) => response.json())
        .then((responseJson) => {
          return responseJson.items[0].snippet.localized.title;
        });

      // save new playList name inside PlayListsNames file and save the new playList
      if (!bool) {
        playListNames.push({
          value: playListName,
          default: false,
          label: playListName,
          key: playListID,
          color: '#9EA0A4',
        });
        filehandler.saveFile('PlayListsNames', playListNames);
        filehandler.saveFile(playListName, newPlayListArray);
      }
    } catch (error) {
      console.log(error);
    }
  };
}

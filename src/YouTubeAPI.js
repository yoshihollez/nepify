import {API_KEY} from '@env';
import ytdl from 'react-native-ytdl';
import Filehandler from './FileHandler';

let filehandler = new Filehandler();

export default class YouTubeAPI {
  constructor() {
    this.key = API_KEY;
  }

  getYoutubeVids = async (searchValue) => {
    let temp = [];
    let url =
      'https://www.googleapis.com/youtube/v3/search?key=' +
      this.key +
      '&part=snippet&q=' +
      searchValue +
      '&maxResults=25&type=video';
    await fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        for (let index = 0; index < responseJson.items.length; index++) {
          const element = responseJson.items[index];
          temp.push({
            videoTitle: element.snippet.title.replace('&quot;', ' '),
            videoImg: element.snippet.thumbnails.medium.url,
            channel: element.snippet.channelTitle,
            key: element.id.videoId,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return {results: temp, showCarousel: true};
  };
  getSongURL = async (url) => {
    console.log('getSongURL');
    return await ytdl(url, {
      quality: 'highestaudio',
    });
  };

  getYoutubePlayList = async (playListID) => {
    try {
      let newPlayListArray = [];
      let token = '';
      let url =
        'https://www.googleapis.com/youtube/v3/playlistItems?key=' +
        this.key +
        '&part=snippet&maxResults=50&playlistId=' +
        playListID +
        '&pageToken=' +
        token;
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
            responseJson.items.forEach((item) => {
              newPlayListArray.push({
                key: item.snippet.resourceId.videoId,
                songName: item.snippet.title
                  .replace('&quot;', ' ')
                  .replace('&#39;', "'"),
                imageURL: item.snippet.thumbnails.default.url,
              });
            });
          })
          .catch((error) => {
            console.error(error);
          });
      } while (token);

      let playListNames = await filehandler.loadPlayListNames();

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
      //  PL3AStYGqDKPyIkNTdHy9gEf35CNDKgL6b
    } catch (error) {
      console.log(error);
    }
  };
}

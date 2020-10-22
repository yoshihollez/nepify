# Nepify

This mobile app is meant to replace Spotify.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:

- Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
- Android studio - [Download & Install Android studio](https://developer.android.com/studio).
- React-native-cli - [Download & Install React-native-cli](https://www.npmjs.com/package/react-native-cli).
- YouTube Data API v3 key - [How to obtain a YouTube Data API v3 key](https://www.slickremix.com/docs/get-api-key-for-youtube/).

### Installing

A step by step series of examples that tell you how to get a development env running

First you will need to install the npm modules using `npm install`.

Then a .env file is needed with a youtube v3 api key.

```
API_KEY=KEY_HERE
```

After that you can use `npm start` or `react-native start` to start the development server.

## Deployment

The build apk for android is stored in `nepify/android/app/release/`.

## Demo

![Demo of the app.](demo.gif 'demo')

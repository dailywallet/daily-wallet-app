# Daily Wallet (iOS and Android)
Daily Wallet React Native app.


## Requirements  
- NodeJS v10.12.0
- Yarn 1.10.1  
    

## Deployment

New to React Native? Here's a helpful introduction: https://facebook.github.io/react-native/docs/getting-started.html

#### iOS

1.  Clone the GitHub repository to your machine.
2.  Run `yarn` to get all of the packages required.
3.  Run `yarn build` script.
4.  Run `npm run start --reset-cache` to start the bundler.
5.  Open ios directory in Xcode.
6.  Run the project by clicking the play button.

#### Android

1.  Clone the GitHub repository to your machine.
2.  Run `yarn` to get all of the packages required.
3.  Run `yarn build` script.
4.  Run `npm run start --reset-cache` to start the bundler.
5.  Open android directory on Android Studio.
6.  Run the project by clicking the play button.

### Please note 

After each `yarn` you also need to run `yarn build`, which makes the following hacks: 
- node_modules/universal-login-monorepo/universal-login-contracts directory is copied to node_modules/. (As UniversalLoginsSDK is a monorepo and `universal-loigin-sdk` has dependency on `universal-loigin-contracts`).  
- Hacks from `rn-nodeify` package for crypto dependencies.  


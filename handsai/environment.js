import Constants from "expo-constants";

const ENV = {
 dev: {
   apiUrl: "http://localhost:5000",
 },
 prod: {
   apiUrl: "https://handsai.herokuapp.com",
 }
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
 // What is __DEV__ ?
 // This variable is set to true when react-native is running in Dev mode.
 // __DEV__ is true when run locally, but false when published.
 if (__DEV__) {
   return ENV.dev;
 }
 return ENV.prod;
};

export default getEnvVars;

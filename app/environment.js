const ENV = {
 dev: {
   apiUrl: "http://192.168.1.11:5000/api",
   // apiUrl: "http://172.16.1.74:5000/api",
 },
 prod: {
   apiUrl: "https://handsai.herokuapp.com/api",
 }
};

const getEnvVars = () => {
 // What is __DEV__ ?
 // This variable is set to true when react-native is running in Dev mode.
 // __DEV__ is true when run locally, but false when published.
 if (__DEV__) {
   return ENV.dev;
 }
 return ENV.prod;
};

export default getEnvVars;

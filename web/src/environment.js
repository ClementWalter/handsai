const ENV = {
 dev: {
   apiUrl: "http://localhost:5000",
 },
 prod: {
   apiUrl: "https://handsai.herokuapp.com",
 }
};

const getEnvVars = () => {
 // What is __DEV__ ?
 // This variable is set to true when react-native is running in Dev mode.
 // __DEV__ is true when run locally, but false when published.
 if (process.env.NODE_ENV === "development") {
   return ENV.dev;
 }
 return ENV.prod;
};

export default getEnvVars;

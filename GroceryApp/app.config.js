export default {
  name: "GroceryApp",
  version: "1.0.0",
  extra: {
    apiUrl: process.env.API_URL || "http://localhost:8080/api"
  },
  ios: {
    bundleIdentifier: "com.groceryapp.mobile"
  },
  android: {
    package: "com.groceryapp.mobile"
  }
};

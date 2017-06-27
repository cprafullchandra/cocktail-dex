var config = {
  apiKey: 'AIzaSyBFsh2d7QP0HAWEiRRpb8K3syc8JIDjQQA',
  authDomain: 'https://cocktaildex.firebaseapp.com/',
  databaseURL: 'https://cocktaildex.firebaseio.com/',
  storageBucket: 'gs://cocktaildex.appspot.com'
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

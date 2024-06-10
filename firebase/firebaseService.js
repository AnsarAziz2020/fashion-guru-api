const admin = require('firebase-admin');
const serviceAccount = require('./fashion-guru-8635b-firebase-adminsdk-p1s9c-a000baf7e0.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;

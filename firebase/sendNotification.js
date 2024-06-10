const log = require('../log');
const admin = require('./firebaseService');

const registrationToken = 'exzIl8MLRGq4cwMvjfgpsI:APA91bFdBeMxPJnIsUmltyw0OAYTINac18oExsblN6YoRBNe8OFccCZLrlPuuB0KX3HzboZilXLpPF9XK2OZS1Wq4ayU7j8V7JEm-vVk_g56pVPl_yoTSfrZpLcR-t3sq6pFIHNq0R80';

// const message = {
//   notification: {
//     title: 'Hello World',
//     body: 'This is a test notification',
//   },
//   token: registrationToken,
// };

const SendNotification = (message) => {
    admin.messaging().send(message)
  .then((response) => {
    log.info('Successfully sent message:', response);
  })
  .catch((error) => {
    log.info('Error sending message:', error);
  });
}

module.exports = SendNotification

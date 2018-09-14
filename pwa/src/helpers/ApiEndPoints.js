// const apiHostUrl = 'https://microsoftmrrapi.azurewebsites.net/api/';
const apiHostUrl = 'https://popcornappsservices.azurewebsites.net/api/';
const newApiHostUrl = 'https://mrrdevapi.azurewebsites.net/Service/';
const walletApiHostUrl = 'https://mrrdevapi.azurewebsites.net/Wallet/';
const apiEndPoints = {
  SaveSession: `${apiHostUrl}SaveSession`,
  SendNotification: `${apiHostUrl}SendNotification`,
  createPass: `${apiHostUrl}SavePass`,
  DevicesBySessionId: `${newApiHostUrl}DevicesBySessionId`,
  SendRawNotification: `${newApiHostUrl}SendRawNotification`,
  CreateiosPass: `${walletApiHostUrl}IOSPass`,
  CreateandroidPass: `${walletApiHostUrl}AndroidPass`,
};
export default apiEndPoints;
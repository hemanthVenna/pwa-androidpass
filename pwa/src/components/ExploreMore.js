import React, { Component } from "react";
import {Animated} from 'react-animated-css';
/*import { map }  from 'lodash';*/
import { isUndefined, isEmpty }  from 'lodash';
import appConstants from "../helpers/appConstants";
import userLanguage from '../helpers/languageConstants.js';
import OtherDevices from '../components/OtherDevices.js';
import ExperienceDevices from '../components/ExperienceDevices.js';
import Notification from '../components/Notification';
import ApiClient  from '../helpers/ApiClient';
import ApiEndPoints  from '../helpers/ApiEndPoints';

class ExploreMore extends Component {
    constructor(props) {
      super(props);
      this.state = {
        otherDeviceList: [],
        expDeviceList: [],
        simillarDeviceList: [],
        busyDeviceList: [],
        unavailableDeviceList: [],
        showExpdevice: false,
        showOtherdevice: false,
        showBusydevice: false,
        showUnavailableDevices: false,
        notificationSent: false,
        showSimilardevice: false,
        wayFinderSymbol: '',
        selectedDevice: {},
        showAtStore: false,
        isNotAvailable: false,
        isNotOnDisplay: false,
        isSimillarDevice: false,
        statusChanged: false,
        displayLoader : true,
        language: 'en'
      };
    }

    componentDidMount() {
      this.componentOnloadAction();
    };

    componentOnloadAction = () => {
      let currentParams = [];
      let sessionId = ApiClient.getRequiredKeyCookieValue(appConstants.sessionCookie);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          currentParams = { latitude: position.coords.latitude, longitude: position.coords.longitude, sessionId:sessionId };
          //currentParams = { latitude: '17.425646' , longitude: '78.41799', sessionId:sessionId };   
          const that = this;
          ApiClient.apiPost(ApiEndPoints.DevicesBySessionId, currentParams).then(function(res) {
            if(res.data.data.length > 0) {
              const productsList = res.data.data.length > 0 ? res.data.data.filter((item) => {
                  if(item.Id !== null){
                    return item; 
                  }else{
                    return null;
                  } 
             }) : [];
              let stringObj = JSON.stringify(productsList);
              that.setProductList(stringObj, currentParams);
              //that.setState({displayLoader:false})
            } else {
                alert(userLanguage[that.state.language].saveSessionErr);
                that.setState({displayLoader:false})
            } 
          });
        }, (error) => {
          alert(userLanguage[this.state.language].browserSettingErr);
          this.setState({displayLoader:false})
        });
      }else{
        alert(userLanguage[this.state.language].useAnotherBrowser);
      }
    };
    remove = (array, element) => {
      return array.filter(e => e !== element);
    }
    setProductList = (wishlist, currentParams) => {
      wishlist = (wishlist !== undefined && wishlist !== '' && wishlist.length > 0) ? JSON.parse(wishlist) : [];
      let journeyCompletedIds = ApiClient.getRequiredKeyCookieValue(appConstants.journeyCompleted);
      journeyCompletedIds = (journeyCompletedIds !== undefined && journeyCompletedIds !== '') ? journeyCompletedIds : '';
      let busyDevicesIds = ApiClient.getRequiredKeyCookieValue(appConstants.busyDevices);
      busyDevicesIds = (busyDevicesIds !== undefined && busyDevicesIds !== '') ? busyDevicesIds : '';
      let unavailableIds = ApiClient.getRequiredKeyCookieValue(appConstants.notOnDisplay);
      unavailableIds = (unavailableIds !== undefined && unavailableIds !== '') ? unavailableIds : '';
      if(wishlist !== '' && wishlist.length > 0) {
        let filterBusylist = []
        if(busyDevicesIds.length > 0){
          filterBusylist = wishlist.length > 0 ? wishlist.filter((item) => {
              if((item.Id !== null) && (busyDevicesIds.indexOf(item.Id) > -1) && (item.Status.toLowerCase() !== 'busy')){
                return item; 
              }else{
                return null;
              } 
          }) : [];
        }
        let filterOnDisplaylist = []
        if(unavailableIds.length > 0){
          filterOnDisplaylist = wishlist.length > 0 ? wishlist.filter((item) => {
              if((item.Id !== null) && (unavailableIds.indexOf(item.Id) > -1) && (item.IsDeviceOnDisplay === 1)){
                return item; 
              }else{
                return null;
              } 
          }) : [];
        }
        if(filterBusylist.length > 0){
          let busyDevices = busyDevicesIds.split(',');
          busyDevices = this.remove(busyDevices, filterBusylist[0].Id);
          let busyDevicesstr = (busyDevices.length > 0) ? busyDevices.join(',') : ''; 
          document.cookie = appConstants.busyDevices+"=" +busyDevicesstr+ ";path=/;";
          this.setState({
            otherDeviceList: [],
            expDeviceList: [],
            busyDeviceList: [],
            showExpdevice: false,
            showOtherdevice: false,
            showBusydevice: false,
            notificationSent: false,
            wayFinderSymbol: '',
            selectedDevice: filterBusylist[0],
            statusChanged: true,
            displayLoader : false
          });
        }else if(filterOnDisplaylist.length > 0){
          let onDisplayDevices = unavailableIds.split(',');
          onDisplayDevices = this.remove(onDisplayDevices, filterOnDisplaylist[0].Id);
          let ondisplayDevicesstr = (onDisplayDevices.length > 0) ? onDisplayDevices.join(',') : ''; 
          document.cookie = appConstants.notOnDisplay+"=" +ondisplayDevicesstr+ ";path=/;";
          this.setState({
            otherDeviceList: [],
            expDeviceList: [],
            busyDeviceList: [],
            showExpdevice: false,
            showOtherdevice: false,
            showBusydevice: false,
            notificationSent: false,
            wayFinderSymbol: '',
            selectedDevice: filterOnDisplaylist[0],
            statusChanged: true,
            displayLoader : false
          });
        }else{
          const expList = wishlist.length > 0 ? wishlist.filter((item) => {
              if(item.Id !== null && (journeyCompletedIds.indexOf(item.Id) > -1)){
                return item; 
              }else{
                return null;
              } 
          }) : [];
          const unavailableList = wishlist.length > 0 ? wishlist.filter((item) => {
              if(
                item.Id !== null && 
                (unavailableIds.indexOf(item.Id) > -1)
              ){
                return item; 
              }else{
                return null;
              } 
          }) : [];
          const otherList = wishlist.length > 0 ? wishlist.filter((item) => {
            if(
              (item.Id !== null) && 
              (journeyCompletedIds.indexOf(item.Id) < 0) &&
              (busyDevicesIds.indexOf(item.Id) < 0) &&
              (unavailableIds.indexOf(item.Id) < 0) 
            ){
              return item; 
            }else{
              return null;
            } 
          }) : [];
          const busyDeviceList = wishlist.length > 0 ? wishlist.filter((item) => {
            if(
              (item.Id !== null) && 
              (busyDevicesIds.indexOf(item.Id) > -1)
            ){
              return item; 
            }else{
              return null;
            } 
          }) : [];
          let showExpdevice = (expList.length > 0) ? true : false;
          let showOtherdevice = (otherList.length > 0) ? true : false;
          let showBusydevice = (busyDeviceList.length > 0) ? true : false;
          let showUnavailableDevices = (unavailableList.length > 0) ? true : false;
          
          this.setState({
            otherDeviceList: otherList,
            expDeviceList: expList,
            busyDeviceList: busyDeviceList,
            unavailableDeviceList: unavailableList,
            showExpdevice: showExpdevice,
            showOtherdevice: showOtherdevice,
            showBusydevice: showBusydevice,
            showUnavailableDevices: showUnavailableDevices,
            notificationSent: false,
            wayFinderSymbol: '',
            selectedDevice: {},
            statusChanged: false,
            //displayLoader : false
          });
          if(showUnavailableDevices){
            let showSimilar = !showOtherdevice ? true : false;
            this.getUnavailableDevices(unavailableList, currentParams, showSimilar);
          }else if(!showOtherdevice){
            this.setState({displayLoader : true})
            this.getSimillarDevices();
          }else{
            this.setState({
              displayLoader : false
            });
          }
        }
      }else{
        console.log('no devices');
      }
    };

    getUnavailableDevices = (unavailableList, currentParams, showSimilar) => {
      let devicesArr = [];
      let nearestStoreId = ApiClient.getRequiredKeyCookieValue(appConstants.storeId);
      nearestStoreId = (nearestStoreId !== undefined && nearestStoreId !== '') ? nearestStoreId : '';
      unavailableList.forEach(function(val) { 
        let obj = {}
        obj.storeId = nearestStoreId;
        obj.make = val.Make;
        obj.model = val.DeviceName;
        devicesArr.push(obj);
      });
      currentParams.devices = devicesArr;
      const that = this;
      ApiClient.apiPost(ApiEndPoints.DeviceAvailability, currentParams).then((res) => {
        if(res.status === 200){
          if(res.data.data.length > 0){
            let list = res.data.data.length > 0 ? res.data.data.filter((item) => {
              if(item.Id !== null){
                if(item.StoreOpenStatus.indexOf(' To ') > -1){
                  let statusArr = item.StoreOpenStatus.split(' To ');
                  item.closeStatus = 'Open till '+statusArr[1];
                }else{
                  item.closeStatus = item.StoreOpenStatus;
                }
                return item; 
              }else{
                return null;
              } 
            }) : [];
            that.setState({
              unavailableDeviceList: list,
              showUnavailableDevices: true,
            });
          }else{
            let notFoundList = [];
            unavailableList.forEach(function(val) { 
                val.showAddr = true;
                notFoundList.push(val);
            });
            that.setState({
              unavailableDeviceList: notFoundList,
              showUnavailableDevices: true,
            });
          }
          if(showSimilar){
            that.getSimillarDevices();
          }else{
            this.setState({
              displayLoader : false
            });
          }
        }else{
          this.setState({
            displayLoader : false
          });
          alert(userLanguage[that.state.language].unableAlert);
        }
      });
    };
    getSimillarDevices = () => {
      let journeyCompletedIds = ApiClient.getRequiredKeyCookieValue(appConstants.journeyCompleted);
      journeyCompletedIds = (journeyCompletedIds !== undefined && journeyCompletedIds !== '') ? journeyCompletedIds : '';
      let nearestStoreId = ApiClient.getRequiredKeyCookieValue(appConstants.storeId);
      nearestStoreId = (nearestStoreId !== undefined && nearestStoreId !== '') ? nearestStoreId : '';
      let busyDevicesIds = ApiClient.getRequiredKeyCookieValue(appConstants.busyDevices);
      busyDevicesIds = (busyDevicesIds !== undefined && busyDevicesIds !== '') ? busyDevicesIds : '';
      let unavailableIds = ApiClient.getRequiredKeyCookieValue(appConstants.notOnDisplay);
      unavailableIds = (unavailableIds !== undefined && unavailableIds !== '') ? unavailableIds : '';
      if(nearestStoreId !== ''){
        const payload = {
          "storeId": nearestStoreId 
        };
        const that = this;
        ApiClient.apiPost(ApiEndPoints.DevicesByStoreId, payload).then((res) => {
          if(res.status === 200){
            let resList = res.data.data;
            const simillarDeviceList = resList.length > 0 ? resList.filter((item) => {
                if(
                  item.Id !== null && 
                  (journeyCompletedIds.indexOf(item.Id) < 0) && 
                  (busyDevicesIds.indexOf(item.Id) < 0) && 
                  (unavailableIds.indexOf(item.Id) < 0)
                ){
                  return item; 
                }else{
                  return null;
                } 
            }) : [];
            let showSimilardevice = (simillarDeviceList.length > 0) ? true : false;
            that.setState({
              simillarDeviceList: simillarDeviceList,
              showSimilardevice: showSimilardevice,
              displayLoader : false
            });
          }else{
            this.setState({
              displayLoader : false
            });
            alert(userLanguage[that.state.language].unableAlert);
          }
        });
      }else{
        this.setState({
          displayLoader : false
        });
        alert('You are not in store.')
      }
    };
    showList = () => {
      this.setState({
        isNotAvailable: false,
        isNotOnDisplay: false,
        displayLoader : true
      });
      this.componentOnloadAction()
    }
    
    handleClick = (selectedProduct, isFromSimillar) => {      
      let nearestStoreId = ApiClient.getRequiredKeyCookieValue(appConstants.storeId);
      nearestStoreId = (nearestStoreId !== undefined && nearestStoreId !== '') ? nearestStoreId : '';
      let wishlistIds = ApiClient.getRequiredKeyCookieValue(appConstants.wishlistData);
      wishlistIds = (wishlistIds !== undefined && wishlistIds !== '') ? wishlistIds : '';
      if(nearestStoreId !== '' && selectedProduct.Make !== ''  && selectedProduct.RDXModel !== ''){
        let currentParams = [];
        let sessionId = (!isUndefined(currentParams.sessionId) && !isEmpty(currentParams.sessionId)) ? currentParams.sessionId : ApiClient.getRequiredKeyCookieValue(appConstants.sessionCookie);
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            currentParams = { latitude: position.coords.latitude, longitude: position.coords.longitude, sessionId:sessionId };
            //currentParams = { latitude: '17.425646' , longitude: '78.41799', sessionId:sessionId };   
            const that = this;
            ApiClient.apiPost(ApiEndPoints.DevicesBySessionId, currentParams).then(function(res) {
              if(res.data.data.length > 0) {
                let showAtStore = (res.data.nearestStoreId === null) ? true : false;
                let param = {deviceRegId: selectedProduct.DeviceRegId}
                let simillar = false;
                let busy = false;
                if(isFromSimillar === '1'){
                  simillar = true;
                }
                const selDevice = res.data.data.length > 0 ? res.data.data.filter((item) => {
                  if(item.Id !== null && item.Id === selectedProduct.Id)
                  {
                    return item; 
                  }else{
                    return null;
                  } 
                }) : [];
                if(((selDevice.length > 0) && (selDevice[0].IsDeviceOnDisplay)) || (selDevice.length === 0)){
                  ApiClient.apiPost(ApiEndPoints.GetDeviceStatus, param).then(function(statusres) {
                    if(statusres.data.status.toLowerCase() === 'busy'){
                      busy = true;
                      if(wishlistIds.indexOf(selectedProduct.Id) > -1 && !simillar){
                        let busyIds = ApiClient.getRequiredKeyCookieValue(appConstants.busyDevices);
                        busyIds = (busyIds !== undefined && busyIds !== '') ? busyIds : '';
                        if(busyIds === '') {
                          document.cookie = appConstants.busyDevices+"=" +selectedProduct.Id+ ";path=/;";
                        }else if(busyIds !== '' && (busyIds.indexOf(selectedProduct.Id) < 0)) {
                          let completedIds = busyIds+','+selectedProduct.Id;
                          document.cookie = appConstants.busyDevices+"=" +completedIds+ ";path=/;";
                        }
                      }
                    }
                    that.setState({
                      showAtStore: showAtStore,
                      isNotAvailable: busy,
                      isNotOnDisplay: false,
                      isSimillarDevice: simillar,
                      statusChanged: false,
                      displayLoader : false,
                      notificationSent: false
                    });
                    if(showAtStore || busy){
                    }else{
                      that.callNotification(selectedProduct);
                    }
                  });
                }else{
                  let notOnDisplayIds = ApiClient.getRequiredKeyCookieValue(appConstants.notOnDisplay);
                  notOnDisplayIds = (notOnDisplayIds !== undefined && notOnDisplayIds !== '') ? notOnDisplayIds : '';
                  if(notOnDisplayIds === '') {
                    document.cookie = appConstants.notOnDisplay+"=" +selectedProduct.Id+ ";path=/;";
                  }else if(notOnDisplayIds !== '' && (notOnDisplayIds.indexOf(selectedProduct.Id) < 0)) {
                    let completedIds = notOnDisplayIds+','+selectedProduct.Id;
                    document.cookie = appConstants.notOnDisplay+"=" +completedIds+ ";path=/;";
                  }
                  that.setState({
                    showAtStore: showAtStore,
                    isNotAvailable: busy,
                    isNotOnDisplay: true,
                    isSimillarDevice: simillar,
                    statusChanged: false
                  });
                }
              } else {
                alert(userLanguage[that.state.language].saveSessionErr);
              } 
            });
          }, (error) => {
            alert(userLanguage[this.state.language].browserSettingErr);
          });
        }else{
          alert(userLanguage[this.state.language].useAnotherBrowser);
        }
      }else{
        alert(userLanguage[this.state.language].requiredValidations);
      }
    }
    
    callNotification = (deviceData) => {
      let nearestStoreId = ApiClient.getRequiredKeyCookieValue(appConstants.storeId);
      nearestStoreId = (nearestStoreId !== undefined && nearestStoreId !== '') ? nearestStoreId : '';
      if(nearestStoreId !== '' && deviceData.Make !== ''  && deviceData.RDXModel !== ''){
        const payload = {
          "make": deviceData.Make,
          "model": deviceData.RDXModel,
          "storeId": nearestStoreId 
        };
        ApiClient.apiPost(ApiEndPoints.SendRawNotification, payload).then((res) => {
          if(res.status === 200){
            this.setState({
              selectedDevice: deviceData,
              notificationSent: true,
              wayFinderSymbol: res.data.wayFinderSymbol
            });
            let journeyObj = {'deviceId': deviceData.Id, 'stage': '2'}
            document.cookie = appConstants.journeyStage+"=" +JSON.stringify(journeyObj)+ ";path=/;";
          }else{
            alert(userLanguage[this.state.language].unableAlert)
          }
        });
      }else{
        alert('Invalid Make / Model / StoreId');
      }
    }

    render() {
      const {isNotOnDisplay, unavailableDeviceList, showUnavailableDevices, otherDeviceList, expDeviceList, notificationSent, wayFinderSymbol, selectedDevice, showOtherdevice, showExpdevice, simillarDeviceList, showSimilardevice, showBusydevice, busyDeviceList, isNotAvailable, isSimillarDevice, statusChanged} = this.state;
      console.log(notificationSent, statusChanged, isNotAvailable);
      const loader = <div className="loaderContainer">
          <div className="loaderContent">
             <img src="/images/loader.gif" alt="loader" />
          </div>
        </div>;

        const reqLanguage = userLanguage[this.state.language];

      return (
        <div>
        {this.state.displayLoader && loader}
          <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
            { statusChanged ?  
              <div><div className="widgetAlert">
                <h4>{reqLanguage.available}</h4>
                <div className="availableImg"><img src={selectedDevice.DeviceImage ? selectedDevice.DeviceImage : '/images/hpLaptop.png'} alt="welcomeImage"/></div>
                <h6>{reqLanguage.availHeader}</h6>
                <h6>{reqLanguage.availSubHeader}</h6>
                <div className="btnContainer"> <button className="btn btn-primary"  onClick={() => this.handleClick(selectedDevice, '0')} >{reqLanguage.guideMe}</button>
                <button className="btn btn-cancel" onClick={() => this.componentOnloadAction()}>{reqLanguage.cancel}</button>
                </div>
              </div></div>
              : ''
            }
            {
              (!notificationSent && !statusChanged) ?
              <div>
                { isNotAvailable ? 
                  <div>
                    <div className="widgetAlert">
                        <h4>{reqLanguage.busy}</h4>
                        <div><img src="/images/ic-busy.png" alt="storeImage"/></div>
                        <h6>{reqLanguage.busyHeader}</h6>
                        <p>{reqLanguage.busySubHeader}</p>
                        <div className="btnContainer"> 
                          <button className="btn btn-primary" onClick={() => this.showList()}>{reqLanguage.tapToExplore}</button>
                          <button className="btn btn-cancel"  onClick={() => this.showList()}>{reqLanguage.cancel}</button>
                        </div>
                    </div>
                  </div> : '' }
                { isNotOnDisplay ? 
                  <div>
                    <div className="widgetAlert">
                        <h4>Unavailable!</h4>
                        <div><img src="/images/ic-busy.png" alt="storeImage"/></div>
                        <h6>The device is currently not on display for demo.</h6>
                        <p>Would you like to explore similar devices.</p>
                        <div className="btnContainer"> 
                          <button className="btn btn-primary" onClick={() => this.showList()}>{reqLanguage.tapToExplore}</button>
                          <button className="btn btn-cancel"  onClick={() => this.showList()}>{reqLanguage.cancel}</button>
                        </div>
                    </div>
                  </div> : '' }
                { (showSimilardevice && !isNotAvailable && !statusChanged && !isNotOnDisplay) ? 
                <div>
                  <div className="headingTxtmini">
                    <h1>{reqLanguage.similarDevices}</h1>
                    <div className="deviceTxt">{reqLanguage.similarDevicesAvailToDemo}</div>
                  </div>
                  <OtherDevices otherDeviceList={simillarDeviceList} activeKey="1" clickHandler={this.handleClick} simillar="1"/>
                </div> : ''}
                { (showOtherdevice && !isNotAvailable && !statusChanged && !isNotOnDisplay) ? 
                <div className={showSimilardevice ? 'topAlign' : ''}>
                  <div className="headingTxtmini">
                    <h1>{reqLanguage.otherDevices}</h1>
                    <div className="deviceTxt">{reqLanguage.expOnDemo}</div>
                  </div>
                  <OtherDevices otherDeviceList={otherDeviceList} activeKey="1" clickHandler={this.handleClick} simillar="0"/>
                </div> : ''}
                { (showBusydevice && !isNotAvailable && !statusChanged && !isNotOnDisplay) ? 
                <div className={(showSimilardevice ||  showOtherdevice) ? 'topAlign' : ''}>
                  <div className="headingTxtmini">
                      <h1 className="pad-top-30">{reqLanguage.yourDevicesHeader}</h1>
                      <div className="deviceTxt">{reqLanguage.someOneUsingDevice}</div>
                  </div>
                  <ExperienceDevices experienceDeviceList={busyDeviceList} activeKey="0" />
                </div> : ''}
                
                { (showUnavailableDevices && !isNotAvailable && !statusChanged && !isNotOnDisplay) ? 
                <div className={(showSimilardevice ||  showOtherdevice || showBusydevice || showExpdevice) ? 'topAlign' : ''}>
                  <div className="headingTxtmini">
                      <h1 className="pad-top-30">{reqLanguage.yourDevicesHeader}</h1>
                      <div className="deviceTxt">{reqLanguage.currentlyNotOnDisplayForDemo}</div>
                  </div>
                  <ExperienceDevices experienceDeviceList={unavailableDeviceList} activeKey="1" />
                </div> : ''}
                { (showExpdevice && !isNotAvailable && !statusChanged && !isNotOnDisplay) ? 
                <div className={(showSimilardevice ||  showOtherdevice || showBusydevice) ? 'topAlign' : ''}>
                  <div className="headingTxtmini">
                      <h1 className="pad-top-30">{reqLanguage.yourDevicesHeader}</h1>
                      <div className="deviceTxt">{reqLanguage.alreadyExpDevice}</div>
                  </div>
                  <ExperienceDevices experienceDeviceList={expDeviceList} activeKey="0" />
                </div> : ''}
              </div> 
             : ''}
             {(notificationSent && !statusChanged) ? <Notification productData={selectedDevice} wayFinderSymbol={wayFinderSymbol} clickHandler={this.componentOnloadAction} notificationClickHandler={this.handleClick} appConstants={appConstants} isSimillarDevice={isSimillarDevice} /> : ''} 
          </Animated>

        </div>
      );
    }
}

export default ExploreMore;
